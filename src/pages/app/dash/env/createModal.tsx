import { ModalTitle, ModalTitleBox } from "../../../../components/Modal/Header";
import { useForm, Controller } from "react-hook-form";
import styled from "styled-components";
import { Checkbox } from "../../../../components/Input/checkbox";
import axios from "axios";
import { useContext } from "react";
import { TopLoadingContext } from "../../../../context/topLoadingBarContext";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import { Button, TextArea, TextField } from "opize-design-system";

interface ModalViewProps {
    close: Function;
    refetch: Function;
}

interface Form {
    key: string;
    value: string;
    secretKey: string;
    img?: string;
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
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({
        defaultValues: {
            key: "",
            value: "",
            secretKey: "",
            img: "https://static.hyuns.dev/dashboard/logo.png",
        },
    });

    const onSubmit = async (data: Form) => {
        const { key, value, img, secretKey } = data;
        try {
            const encryptedValue = CryptoJS.AES.encrypt(
                `🔑_${value}`,
                secretKey
            ).toString();
            await axios.post(
                `${process.env.REACT_APP_API_URL}/env`,
                {
                    key,
                    value: encryptedValue,
                    img,
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
                        label="키"
                        {...register("key", { required: "칸을 채워주세요" })}
                        error={errors.key?.message}
                    />
                    <TextArea
                        label="값"
                        {...register("value", { required: "칸을 채워주세요" })}
                        error={errors.value?.message}
                    />
                    <TextField
                        label="이미지"
                        {...register("img", { required: "칸을 채워주세요" })}
                        error={errors.img?.message}
                    />

                    <TextField
                        label="암호화 키"
                        {...register("secretKey", {
                            required: "칸을 채워주세요",
                        })}
                        error={errors.secretKey?.message}
                        autoComplete="off"
                    />
                </Inputs>
                <SubmitButtonBox>
                    <Button type="submit">생성</Button>
                </SubmitButtonBox>
            </form>
        </>
    );
}
