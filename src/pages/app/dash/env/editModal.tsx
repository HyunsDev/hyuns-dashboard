import { ModalTitle, ModalTitleBox } from "../../../../components/Modal/Header";
import { useForm, Controller } from "react-hook-form";
import styled from "styled-components";
import { Checkbox } from "../../../../components/Input/checkbox";
import axios from "axios";
import { useContext, useState } from "react";
import { TopLoadingContext } from "../../../../context/topLoadingBarContext";
import { toast } from "react-toastify";
import { Button, Flex, TextArea, TextField } from "opize-design-system";
import CryptoJS from "crypto-js";

interface ModalViewProps {
    close: Function;
    refetch: Function;
    initValue: {
        key: string;
        value: string;
        img?: string;
    };
}

interface Form {
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

export function EditModalView(props: ModalViewProps) {
    const [secretKey, setSecretKey] = useState("");
    const [isLocked, setIsLocked] = useState(true);

    const progress = useContext(TopLoadingContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        defaultValues: {
            value: props.initValue.value,
            img: props.initValue.img || "",
            secretKey: "",
        },
    });

    const decrypt = (value: string) => {
        setSecretKey(value);
        try {
            const result = CryptoJS.AES.decrypt(
                props.initValue.value,
                value
            ).toString(CryptoJS.enc.Utf8);
            if (result.startsWith("🔑_")) {
                setValue("value", result.replace("🔑_", ""));
                setIsLocked(false);
            } else {
                setIsLocked(true);
            }
        } catch (err) {
            setIsLocked(true);
        }
    };

    const onSubmit = async (data: Form) => {
        const { value, img, secretKey } = data;
        try {
            const encryptedValue = CryptoJS.AES.encrypt(
                `🔑_${value}`,
                secretKey
            ).toString();
            await axios.post(
                `${process.env.REACT_APP_API_URL}/env`,
                {
                    key: props.initValue.key,
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
                <ModalTitle>{props.initValue.key} 수정</ModalTitle>
            </ModalTitleBox>

            <Flex.Column gap="8px">
                {isLocked && (
                    <Flex.Row gap="4px">
                        <TextField
                            label="기존 비밀 키"
                            placeholder="기존 비밀 키"
                            type="password"
                            onChange={(e) => decrypt(e.target.value)}
                            value={secretKey}
                            autoComplete="off"
                        />
                    </Flex.Row>
                )}

                {!isLocked && (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Inputs>
                            <TextArea
                                label="값"
                                {...register("value", {
                                    required: "칸을 채워주세요",
                                })}
                                error={errors.value?.message}
                            />
                            <TextField
                                label="이미지"
                                {...register("img", {
                                    required: "칸을 채워주세요",
                                })}
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
                            <Button type="submit">수정</Button>
                        </SubmitButtonBox>
                    </form>
                )}
            </Flex.Column>
        </>
    );
}
