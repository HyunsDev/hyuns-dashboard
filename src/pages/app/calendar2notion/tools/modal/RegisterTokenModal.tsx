import { ModalTitle, ModalTitleBox } from "../../../../../components/Modal/Header"
import { useForm, Controller } from "react-hook-form";
import { Button, TextArea, TextField } from "../../../../../components/Input";
import styled from "styled-components";
import axios from "axios";
import { useContext, useState } from "react";
import { TopLoadingContext } from "../../../../../context/topLoadingBarContext";
import { toast } from "react-toastify";


interface ModalViewProps {
    close: Function
}

interface Form {
    title: string,
    subTitle?: string,
    content?: string
    buttons?: string
    avatarName?: string
    avatarIcon?: string
    state: string
    type: string
}

const Inputs = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`

const SubmitButtonBox = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
`

export function RegisterTokenModal(props:ModalViewProps) {
    const [ token, setToken ] = useState(localStorage.getItem('calendar2notion/adminToken') || '')

    const register = () => {
        localStorage.setItem('calendar2notion/adminToken', token)
        props.close()
    }

    return (
        <>
            <ModalTitleBox>
                <ModalTitle>토큰 등록</ModalTitle>
            </ModalTitleBox>
            
                <Inputs>
                    <TextArea type="text" value={token} onChange={(e: string) => setToken(e)} />
                </Inputs>
                <SubmitButtonBox>
                    <Button onClick={register} label="생성" type="submit" color="black"/>
                </SubmitButtonBox>
        </>
    )
}