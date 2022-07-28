import { ModalTitle, ModalTitleBox } from "../../../../../components/Modal/Header"
import { useForm, Controller } from "react-hook-form";
import { Button, TextArea, TextField } from "../../../../../components/Input";
import styled from "styled-components";
import { Checkbox } from "../../../../../components/Input/checkbox";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SignJWT } from "jose";
import axios from "axios";


const Inputs = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`

interface ModalViewProps {

}

export function CreateJwtModal() {
    const [ payloadText, setPayloadText ] = useState("{\n\n}")
    const [ payloadError, setPayloadError ] = useState<string>('')
    const [ privateKey, setPrivateKey ] = useState('')
    const [ expiresIn, setExpiresIn ] = useState('7d')
    const [ issuer, setIssuer ] = useState('hyuns.dev')
    const [ result, setResult ] = useState('')

    useEffect(() => {
        try {
            JSON.parse(payloadText)
            setPayloadError('')
        } catch (err) {
            setPayloadError('올바르지 않은 페이로드 입니다.')
        }
    }, [payloadText])

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.code === 'Tab') {
                e.preventDefault()
            }
        }

        window.addEventListener('keydown', listener)
        return () => {
            window.removeEventListener('keydown', listener)
        }
    }, [])
    useEffect(() => {
        ;(async () => {
            if (!payloadText || !privateKey) {
                setResult('')
                return
            }

            try {
                JSON.parse(payloadText)
            } catch (err) {
                setResult('')
                return 
            }
    
            try {
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/utils/jwt`, {
                    payload: payloadText,
                    privateKey: privateKey,
                    exp: expiresIn,
                    iss: issuer
                }, {
                    headers: {
                        Authorization: localStorage.getItem('token') || ''
                    }
                })
        
                setResult(res.data.token)
            } catch (err:any) {
                console.log(err.response)
            }

        })()
    }, [expiresIn, issuer, payloadText, privateKey])

    return (
        <>
            <ModalTitleBox>
                <ModalTitle>메세지</ModalTitle>
            </ModalTitleBox>
            <Inputs>
                <TextArea label='페이로드' value={payloadText} onChange={(text: string) => setPayloadText(text)} type="text" message={payloadError} error={!!payloadError} />
                <TextField label="비밀키" value={privateKey} onChange={(text: string) => setPrivateKey(text)} type="text" />
                <TextField label="만료" value={expiresIn} onChange={(text: string) => setExpiresIn(text)} type="text" />
                <TextField label="Issuer" value={issuer} onChange={(text: string) => setIssuer(text)} type="text" />

                <TextArea label='JWT' value={result} onChange={() => null} readonly type="text" />
            </Inputs>
        </>
    )
}