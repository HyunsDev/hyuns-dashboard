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
}

interface Form {
    key: string,
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

export function CreateModalModalView(props:ModalViewProps) {
    const progress = useContext(TopLoadingContext)

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            key: '',
            value: '',
            isPublic: false,
            isEncrypted: false,
            img: 'https://static.hyuns.dev/dashboard/logo.png'
        }
    });

    const onSubmit = async (data:Form) => {
        const { key, value, isPublic, isEncrypted, img } = data
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/var`, {
                key, value, isPublic, isEncrypted, img
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
                <ModalTitle>변수 생성</ModalTitle>
            </ModalTitleBox>
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <Inputs>
                    <Controller
                        name="key" 
                        control={control}
                        rules={{required: '칸을 채워주세요'}}
                        render={({field}) => <TextField {...field} label={'키'} message={errors.key?.message} ref={null} error={!!errors.key?.message} type="text" />}
                    />
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
                    <Button label="생성" type="submit" color="black"/>
                </SubmitButtonBox>
            </form>
        </>
    )
}