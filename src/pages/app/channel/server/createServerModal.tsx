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
    id: string,
    name: string,
    url: string
    checkUrl: string
    memo?: string
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

export function CreateModalView(props:ModalViewProps) {
    const progress = useContext(TopLoadingContext)

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            id: '',
            name: '',
            url: '',
            checkUrl: '',
            memo: '',
            img: ''
        }
    });

    const onSubmit = async (data:Form) => {
        const { id, name, url, checkUrl, memo, img } = data
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/server`, {
                id, name, url, checkUrl, memo, img
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
                <ModalTitle>서버 생성</ModalTitle>
            </ModalTitleBox>
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <Inputs>
                    <Controller
                        name="id" 
                        control={control}
                        rules={{required: '칸을 채워주세요'}}
                        render={({field}) => <TextField {...field} label={'키'} message={errors.id?.message} ref={null} error={!!errors.id?.message} type="text" />}
                    />
                    <Controller
                        name="name" 
                        control={control}
                        rules={{required: '칸을 채워주세요'}}
                        render={({field}) => <TextField {...field} label={'이름'} message={errors.name?.message} ref={null} error={!!errors.name?.message} type="text" />}
                    />
                    <Controller
                        name="url" 
                        control={control}
                        rules={{required: '칸을 채워주세요'}}
                        render={({field}) => <TextField {...field} label={'주소'} message={errors.url?.message} ref={null} error={!!errors.url?.message} type="text" />}
                    />
                    <Controller
                        name="checkUrl" 
                        control={control}
                        rules={{required: '칸을 채워주세요'}}
                        render={({field}) => <TextField {...field} label={'checkUrl'} message={errors.checkUrl?.message} ref={null} error={!!errors.checkUrl?.message} type="text" />}
                    />
                    <Controller
                        name="memo"
                        control={control}
                        render={({field}) => <TextField {...field} label={'메모'} message={errors.memo?.message} ref={null} error={!!errors.memo?.message} type="text" />}
                    />
                    <Controller
                        name="img" 
                        control={control}
                        render={({field}) => <TextField {...field} label={'이미지'} ref={null} type="text" />}
                    />
                </Inputs>
                <SubmitButtonBox>
                    <Button label="생성" type="submit" color="black"/>
                </SubmitButtonBox>
            </form>
        </>
    )
}