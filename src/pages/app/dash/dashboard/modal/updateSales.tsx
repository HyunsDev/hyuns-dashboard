import { useForm, Controller } from "react-hook-form";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, ModalTitle, ModalTitleBox, TextArea, TextField } from "../../../../../components";
import { useContext } from "react";
import { TopLoadingContext } from "../../../../../context/topLoadingBarContext";


interface ModalViewProps {
    close: Function
    refetch: Function
    initValue: {
        value: string,
    }
}

interface Form {
    value: string,
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

export function UpdateSalesModal(props:ModalViewProps) {
    const progress = useContext(TopLoadingContext)

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            value: props.initValue.value,
        }
    });

    const onSubmit = async (data:Form) => {
        const { value } = data
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/var`, {
                key: 'money',
                value
            }, {
                headers: {
                    Authorization: localStorage.getItem('token') || ''
                }
            })
            props.refetch()
            progress.setProgress(100)
            props.close()
        } catch(err:any) {
            toast.error(`문제가 발생했어요. ${err.response.status}`)
        }
    }

    return (
        <>
            <ModalTitleBox>
                <ModalTitle>지금까지의 총 수익</ModalTitle>
            </ModalTitleBox>
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <Inputs>
                    <Controller
                        name="value" 
                        control={control}
                        render={({field}) => <TextField {...field} label={'값'} message={errors.value?.message} ref={null} error={!!errors.value?.message} type="text" />}
                    />
                </Inputs>
                <SubmitButtonBox>
                    <Button label="수정" type="submit" color="black"/>
                </SubmitButtonBox>
            </form>
        </>
    )
}