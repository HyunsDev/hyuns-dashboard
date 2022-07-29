import { ModalTitle, ModalTitleBox } from "../../../../../components/Modal/Header"
import { useForm, Controller } from "react-hook-form";
import { Button, TextArea, TextField } from "../../../../../components/Input";
import styled from "styled-components";
import { Checkbox } from "../../../../../components/Input/checkbox";
import axios from "axios";
import { useContext } from "react";
import { TopLoadingContext } from "../../../../../context/topLoadingBarContext";
import { toast } from "react-toastify";


interface ModalViewProps {
    close: Function
    refetch: Function
    prev: object
    initValue: {
        id: string,
        title: string,
        subTitle: string,
        url: string
        img?: string
        memo?: string
    }
}

interface Form {
    id: string,
    title: string,
    subTitle: string,
    url: string
    img?: string
    memo?: string
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

export function EditModalView(props:ModalViewProps) {
    const progress = useContext(TopLoadingContext)

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            id: props.initValue.id,
            title: props.initValue.title,
            subTitle: props.initValue.subTitle || '',
            url: props.initValue.url,
            img: props.initValue.img || '',
            memo: props.initValue.memo || ''
        }
    });

    const onSubmit = async (data:Form) => {
        const { id, title, subTitle, url, img, memo } = data
        const body = {
            key: 'dash/bookmark',
            value: JSON.stringify({
                ...props.prev,
                [id]: {
                    title, subTitle, url, img, memo
                }
            })
        }

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/var`, body, {
                headers: {
                    Authorization: localStorage.getItem('token') || ''
                }
            })
            props.refetch()
            progress.setProgress(100)
            props.close()
        } catch(err:any) {
            console.log(err.response)
            toast.error(`문제가 발생했어요. ${err.response.status}`)
        }
    }

    return (
        <>
            <ModalTitleBox>
                <ModalTitle>{props.initValue.id} 수정</ModalTitle>
            </ModalTitleBox>
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <Inputs>
                    <Controller
                        name="title" 
                        control={control}
                        rules={{required: '칸을 채워주세요'}}
                        render={({field}) => <TextField {...field} label={'제목'} message={errors.title?.message} ref={null} error={!!errors.title?.message} type="text" />}
                    />
                    <Controller
                        name="subTitle" 
                        control={control}
                        render={({field}) => <TextField {...field} label={'내용'} message={errors.subTitle?.message} ref={null} error={!!errors.subTitle?.message} type="text" />}
                    />
                    <Controller
                        name="url" 
                        control={control}
                        rules={{required: '칸을 채워주세요'}}
                        render={({field}) => <TextField {...field} label={'URL'} message={errors.url?.message} ref={null} error={!!errors.url?.message} type="text" />}
                    />
                    <Controller
                        name="img" 
                        control={control}
                        render={({field}) => <TextField {...field} label={'이미지'} ref={null} type="text" />}
                    />
                    <Controller
                        name="memo" 
                        control={control}
                        render={({field}) => <TextArea {...field} label={'메모'} message={errors.memo?.message} ref={null} error={!!errors.memo?.message} type="text" />}
                    />
                </Inputs>
                <SubmitButtonBox>
                    <Button label="수정" type="submit" color="black"/>
                </SubmitButtonBox>
            </form>
        </>
    )
}