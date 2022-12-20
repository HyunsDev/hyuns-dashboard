import { ModalTitle, ModalTitleBox } from "../../../../components/Modal/Header";
import styled from "styled-components";
import axios from "axios";
import { useContext, useState } from "react";
import { TopLoadingContext } from "../../../../context/topLoadingBarContext";
import { toast } from "react-toastify";
import { Button, CodeBlock, Flex, StatusBadge } from "opize-design-system";
import { Code } from "../../../../components";

interface ModalViewProps {
  data: {
    _id: string;
    name: string;
    url: string;
    method: string;
    body?: string;
    headers?: string;
    image?: string;
    memo?: string;
  };
  close: Function;
  refetch: Function;
}

const SubmitButtonBox = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

const statusColorMap = (
  status?: number
): "gray" | "green" | "yellow" | "red" | "blue" => {
  if (!status) return "gray";
  if (status < 300) return "green";
  if (status < 400) return "blue";
  if (status < 500) return "yellow";
  if (status < 600) return "red";
  return "gray";
};

export function ExecuteModalView(props: ModalViewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>("");

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/request/${props.data._id}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      );

      console.log(res.data);
      setData(res.data);

      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      console.log(err.response.data);
      toast.error(`문제가 발생했어요. ${err.response.status}`);
    }
  };

  return (
    <>
      <ModalTitleBox>
        <ModalTitle>{props.data.name} 리퀘스트 실행</ModalTitle>
      </ModalTitleBox>

      <Code>{JSON.stringify(data?.data, null, 2)}</Code>

      <SubmitButtonBox>
        <Flex.Row gap="8px">
          <StatusBadge
            size="small"
            text={isLoading ? "Loading" : data?.status || "READY"}
            color={isLoading ? "gray" : statusColorMap(data?.status)}
          />
          <Button onClick={onSubmit} isLoading={isLoading} width="60px">
            실행
          </Button>
        </Flex.Row>
      </SubmitButtonBox>
    </>
  );
}
