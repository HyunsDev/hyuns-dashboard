import styled from "styled-components";
import { CenterLayout } from "../../components/Layout/center";
import { Logo } from "../../components/Logo/logo";
import { useContext, useState } from "react";

import { TextField, Button } from "../../components/Input";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TopLoadingContext } from "../../context/topLoadingBarContext";

const Divver = styled.div`
    height: calc(var(--vh) * 100);
    width: 350px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
`

const H1 = styled.div`
    font-size: 24px;
    font-weight: 700;
`

const ButtonDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
`

export function LoginScreen() {
    const [ id, setId ] = useState('')
    const [ password, setPassword ] = useState('')
    const progress = useContext(TopLoadingContext)

    const navigate = useNavigate()

    const login = async() => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
                id, password
            })
            localStorage.setItem('token', response.data.token)
            progress.setProgress(100)
            navigate('/app')
        } catch (err:any) {
            progress.setProgress(100)
            if (err.response) {
                switch (err.response.data.message) {
                  case "user_not_found":
                    toast.error('계정을 찾을 수 없어요.')
                    break
        
                  case "wrong_password":
                    toast.error('비밀번호가 올바르지 않아요.')
                    break
        
                  default:
                    toast.error(`서버가 알 수 없는 응답을 했어요. ${err.response.data.message}`)
                    break
                }
              } else {
                console.log(err)
                toast.error(`서버에 연결할 수 없어요.`)
              }
        } 
    }

    return (
        <CenterLayout>
            <Divver>
                <Logo size={48} isRounded />
                <H1>Hyuns Dashboard</H1>
                <TextField value={id} onChange={setId} placeholder='아이디' type="text" label="아이디" />
                <TextField value={password} onChange={setPassword} placeholder='비밀번호' type="password" label="비밀번호" />
                <ButtonDiv>
                    <Button label="로그인" onClick={login} type='button' color="blue" />
                </ButtonDiv>
            </Divver>
        </CenterLayout>
    )
}