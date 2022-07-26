import { ModalTitle, ModalTitleBox } from "../../../../components/Modal/Header"
import { useForm, Controller } from "react-hook-form";
import { Button, TextArea, TextField } from "../../../../components/Input";
import styled from "styled-components";
import { Checkbox } from "../../../../components/Input/checkbox";
import axios from "axios";
import { useContext, useState } from "react";
import { TopLoadingContext } from "../../../../context/topLoadingBarContext";
import { toast } from "react-toastify";
import { FileField } from "../../../../components/Input/fileField";
import { Code } from "../../../../components/code/code";


interface ModalViewProps {
    close: Function
    refetch: Function
    FunctionName: String
}

interface Form {
    payload: string,
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

export function InvokeLambdaModalView(props:ModalViewProps) {
    const progress = useContext(TopLoadingContext)
    const [ output, setOutput ] = useState('')

    const { control, handleSubmit, formState: { errors } } = useForm<{
        payload: string,
    }>({
        defaultValues: {
            payload: '{\n\n}',
        }
    });

    const onSubmit = async (data:Form) => {
        const { payload } = data

        try {
            progress.setProgress(0)

            let parsedPayload
            try {
                parsedPayload = JSON.parse(payload)
            } catch (err:any) {
                toast.error(`문제가 발생했어요.`)
                console.error(err)
            }

            const res = await axios.post(`${process.env.REACT_APP_API_URL}/lambda/${props.FunctionName}`, {
                payload: parsedPayload,
            }, {
                headers: {
                    Authorization: localStorage.getItem('token') || ''
                }
            })

            setOutput(JSON.stringify(JSON.parse(res.data.Payload), null, 2))

            props.refetch()
            progress.setProgress(100)
        } catch(err:any) {
            console.error(err)
            toast.error(`문제가 발생했어요. ${err.response.status}`)
        }
    }

    return (
        <>
            <ModalTitleBox>
                <ModalTitle>람다 실행</ModalTitle>
            </ModalTitleBox>
            <div>{props.FunctionName}</div>
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <Inputs>
                    <Controller
                        name="payload" 
                        control={control}
                        render={({field}) => <TextArea {...field} label={'페이로드'} message={errors.payload?.message} ref={null} error={!!errors.payload?.message} type="text" />}
                    />
                </Inputs>
                <SubmitButtonBox>
                    <Button label="실행" type="submit" color="black"/>
                </SubmitButtonBox>
                <Code>{ output }</Code>
            </form>
        </>
    )
}