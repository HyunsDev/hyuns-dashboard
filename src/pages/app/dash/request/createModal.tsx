import { ModalTitle, ModalTitleBox } from "../../../../components/Modal/Header";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import axios from "axios";
import { useContext } from "react";
import { TopLoadingContext } from "../../../../context/topLoadingBarContext";
import { toast } from "react-toastify";
import { Button, Select, TextArea, TextField } from "opize-design-system";

interface ModalViewProps {
  close: Function;
  refetch: Function;
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

export function CreateModalView(props: ModalViewProps) {
  const progress = useContext(TopLoadingContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      url: "https://",
      method: "get",
      body: "",
      headers: "",
      image: "https://s3.hyuns.dev/dash/dash.png",
      memo: "",
    },
  });

  const onSubmit = async (data: Form) => {
    const { method, name, url, body, headers, image, memo } = data;
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/request`,
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
        <ModalTitle>변수 생성</ModalTitle>
      </ModalTitleBox>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Inputs>
          <TextField
            {...register("name", {
              required: true,
            })}
            error={errors.name?.message}
            label="name"
          />

          <TextField
            {...register("url", {
              required: true,
            })}
            error={errors.url?.message}
            label="url"
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
            error={errors.body?.message}
            label="body"
          />

          <TextArea
            {...register("headers")}
            error={errors.headers?.message}
            label="headers"
          />

          <TextField
            {...register("image")}
            error={errors.image?.message}
            label="image"
          />

          <TextArea
            {...register("memo")}
            error={errors.memo?.message}
            label="memo"
          />
        </Inputs>
        <SubmitButtonBox>
          <Button type="submit">생성</Button>
        </SubmitButtonBox>
      </form>
    </>
  );
}
