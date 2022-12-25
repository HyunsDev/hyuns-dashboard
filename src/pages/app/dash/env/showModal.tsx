import { ModalTitle, ModalTitleBox } from "../../../../components/Modal/Header";
import { useForm, Controller } from "react-hook-form";
import styled from "styled-components";
import { Checkbox } from "../../../../components/Input/checkbox";
import axios from "axios";
import { useContext, useState } from "react";
import { TopLoadingContext } from "../../../../context/topLoadingBarContext";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import {
    Box,
    Button,
    Flex,
    StatusBadge,
    TextArea,
    TextField,
} from "opize-design-system";

interface ModalViewProps {
    value: {
        _id: string;
        createdAt: string;
        updatedAt: string;
        img: string;
        key: string;
        value: string;
    };
}

const Pre = styled.pre`
    font-size: 14px;
`;

export function ShowModalView(props: ModalViewProps) {
    const [secretKey, setSecretKey] = useState("");
    const [value, setValue] = useState(props.value.value);
    const [status, setStatus] = useState<"lock" | "unlock">("lock");

    const onChange = (value: string) => {
        setSecretKey(value);
        try {
            const result = CryptoJS.AES.decrypt(
                props.value.value,
                value
            ).toString(CryptoJS.enc.Utf8);
            if (result.startsWith("🔑_")) {
                setStatus("unlock");
                setValue(result.replace("🔑_", ""));
            } else {
                setValue(result);
                setStatus("lock");
            }
        } catch (err) {
            setStatus("lock");
        }
    };

    return (
        <>
            <ModalTitleBox>
                <Flex.Between style={{ width: "100%" }}>
                    <ModalTitle>환경변수 정보</ModalTitle>
                    <StatusBadge
                        text={status}
                        color={status === "lock" ? "gray" : "blue"}
                    />
                </Flex.Between>
            </ModalTitleBox>
            <Flex.Column gap="16px">
                <TextField
                    label="암호화 키"
                    onChange={(e) => onChange(e.target.value)}
                    value={secretKey}
                    type="password"
                    autoComplete="off"
                />
                <Box>
                    <Pre>{value}</Pre>
                </Box>
            </Flex.Column>
        </>
    );
}
