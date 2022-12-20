import { ModalTitle, ModalTitleBox } from "../../../../components/Modal/Header";
import { useForm, Controller } from "react-hook-form";
import { Button, TextArea, TextField } from "../../../../components/Input";
import styled from "styled-components";
import { Checkbox } from "../../../../components/Input/checkbox";
import axios from "axios";
import { useContext } from "react";
import { TopLoadingContext } from "../../../../context/topLoadingBarContext";
import { toast } from "react-toastify";

interface ModalViewProps {
  id: string;
  name: string;
  close: Function;
  refetch: Function;
}

const SubmitButtonBox = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

export function RemoveModalView(props: ModalViewProps) {
  const progress = useContext(TopLoadingContext);

  const onSubmit = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/request/${props.id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      );
      props.refetch();
      progress.setProgress(100);
      progress.setProgress(0);
      props.close();
    } catch (err: any) {
      toast.error(`문제가 발생했어요. ${err.response.status}`);
    }
  };

  return (
    <>
      <ModalTitleBox>
        <ModalTitle>리퀘스트를 삭제하시겠어요?</ModalTitle>
      </ModalTitleBox>

      <div>{props.name}</div>

      <SubmitButtonBox>
        <Button label="삭제" type="button" color="black" onClick={onSubmit} />
      </SubmitButtonBox>
    </>
  );
}
