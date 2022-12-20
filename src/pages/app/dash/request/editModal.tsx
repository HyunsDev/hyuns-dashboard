import { ModalTitle, ModalTitleBox } from "../../../../components/Modal/Header";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import axios from "axios";
import { useContext } from "react";
import { TopLoadingContext } from "../../../../context/topLoadingBarContext";
import { toast } from "react-toastify";
import { TextField, Button, TextArea, Select } from "opize-design-system";

interface ModalViewProps {
  close: Function;
  refetch: Function;
  initValue: {
    _id: string;
    name: string;
    url: string;
    method: string;
    body?: string;
    headers?: string;
    image?: string;
    memo?: string;
  };
}

interface Form {
  name: string;
  url: string;
  method: string;
  body?: string;
  headers?: string;
  image?: string;
  memo?: string;
}

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SubmitButtonBox = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

export function EditModalView(props: ModalViewProps) {
  const progress = useContext(TopLoadingContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: props.initValue.name,
      url: props.initValue.url,
      method: props.initValue.method,
      body: props.initValue.body || "",
      headers: props.initValue.headers || "",
      image: props.initValue.image || "",
      memo: props.initValue.memo || "",
    },
  });

  const onSubmit = async (data: Form) => {
    const { method, name, url, body, headers, image, memo } = data;
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/request/${props.initValue._id}`,
        {
          method,
          name,
          url,
          body,
          headers,
          image,
          memo,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      );
      props.refetch();
      progress.setProgress(100);
      props.close();
    } catch (err: any) {
      toast.error(`문제가 발생했어요. ${err.response.status}`);
    }
  };

  return (
    <>
      <ModalTitleBox>
        <ModalTitle>{props.initValue.name} 수정</ModalTitle>
      </ModalTitleBox>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register("name", { required: true })}
          label="이름"
          error={errors.name?.message}
        />
        <TextField
          {...register("url", { required: true })}
          label="url"
          error={errors.url?.message}
        />
        <Select {...register("method", { required: true })} label="method">
          <Select.Option value={"GET"}>GET</Select.Option>
          <Select.Option value={"POST"}>POST</Select.Option>
          <Select.Option value={"PATCH"}>PATCH</Select.Option>
          <Select.Option value={"PUT"}>PUT</Select.Option>
          <Select.Option value={"DELETE"}>DELETE</Select.Option>
        </Select>
        <TextArea
          {...register("body")}
          label="body"
          error={errors.body?.message}
        />
        <TextArea
          {...register("headers")}
          label="headers"
          error={errors.headers?.message}
        />
        <TextField
          {...register("image")}
          label="image"
          error={errors.image?.message}
        />
        <TextArea
          {...register("memo")}
          label="memo"
          error={errors.memo?.message}
        />
        <SubmitButtonBox>
          <Button type="submit">수정</Button>
        </SubmitButtonBox>
      </form>
    </>
  );
}
