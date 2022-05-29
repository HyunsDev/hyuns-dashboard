import { ModalTitle, ModalTitleBox } from "../../../../components/Modal/Header"
import { useForm, Controller } from "react-hook-form";
import { Button, TextArea, TextField } from "../../../../components/Input";
import styled from "styled-components";
import { Checkbox } from "../../../../components/Input/checkbox";
import axios from "axios";
import { useContext } from "react";
import { TopLoadingContext } from "../../../../context/topLoadingBarContext";
import { toast } from "react-toastify";


interface ModalViewProps {
    close: Function
    refetch: Function
    initValue: {
        key: string
        value: string,
        isPublic: boolean,
        isEncrypted: boolean,
        img?: string
    }
}

interface Form {
    value: string,
    isPublic: boolean,
    isEncrypted: boolean,
    img?: string
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

export function EditModalModalView(props:ModalViewProps) {
    const progress = useContext(TopLoadingContext)

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            value: props.initValue.value,
            isPublic: props.initValue.isPublic,
            isEncrypted: props.initValue.isEncrypted,
            img: props.initValue.img || ''
        }
    });

    const onSubmit = async (data:Form) => {
        const { value, isPublic, isEncrypted, img } = data
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/var`, {
                key: props.initValue.key, value, isPublic, isEncrypted, img
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
                <ModalTitle>{props.initValue.key} 수정</ModalTitle>
            </ModalTitleBox>
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <Inputs>
                    <Controller
                        name="value" 
                        control={control}
                        render={({field}) => <TextArea {...field} label={'값'} message={errors.value?.message} ref={null} error={!!errors.value?.message} type="text" />}
                    />
                    <Controller
                        name="img" 
                        control={control}
                        render={({field}) => <TextField {...field} label={'이미지'} ref={null} type="text" />}
                    />
                    <Controller
                        name="isPublic" 
                        control={control}
                        render={({field}) => <Checkbox {...field} label='공개 여부' ref={null} />}
                    />
                    <Controller
                        name="isEncrypted" 
                        control={control}
                        render={({field}) => <Checkbox {...field} label='암호화 여부' ref={null} />}
                    />
                </Inputs>
                <SubmitButtonBox>
                    <Button label="수정" type="submit" color="black"/>
                </SubmitButtonBox>
            </form>
        </>
    )
}