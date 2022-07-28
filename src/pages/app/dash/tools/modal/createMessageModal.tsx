import { ModalTitle, ModalTitleBox } from "../../../../../components/Modal/Header"
import { useForm, Controller } from "react-hook-form";
import { Button, TextArea, TextField } from "../../../../../components/Input";
import styled from "styled-components";
import axios from "axios";
import { useContext } from "react";
import { TopLoadingContext } from "../../../../../context/topLoadingBarContext";
import { toast } from "react-toastify";


interface ModalViewProps {
    close: Function
    refetch: Function
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

export function CreateModalView(props:ModalViewProps) {
    const progress = useContext(TopLoadingContext)

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            subTitle: '',
            content: '',
            avatarIcon: 'https://s3.hyuns.dev/hyuns.jpg',
            avatarName: '혀느현스',
            buttons: '',
            state: 'stateless',
            type: '',
        }
    });

    const onSubmit = async (data:Form) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/message`, data, {
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
                <ModalTitle>메세지</ModalTitle>
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
                        render={({field}) => <TextField {...field} label={'부제목'} message={errors.subTitle?.message} ref={null} error={!!errors.subTitle?.message} type="text" />}
                    />
                    <Controller
                        name="content" 
                        control={control}
                        render={({field}) => <TextArea {...field} label={'내용'} message={errors.content?.message} ref={null} error={!!errors.content?.message} type="text" />}
                    />

                    <Controller
                        name="avatarName" 
                        control={control}
                        rules={{required: '칸을 채워주세요'}}
                        render={({field}) => <TextField {...field} label={'아바타 이름'} message={errors.avatarName?.message} ref={null} error={!!errors.avatarName?.message} type="text" />}
                    />

                    <Controller
                        name="avatarIcon" 
                        control={control}
                        rules={{required: '칸을 채워주세요'}}
                        render={({field}) => <TextField {...field} label={'아바타 아이콘'} message={errors.avatarIcon?.message} ref={null} error={!!errors.avatarIcon?.message} type="text" />}
                    />
                    <Controller
                        name="state" 
                        control={control}
                        rules={{required: '칸을 채워주세요'}}
                        render={({field}) => <TextField {...field} label={'상태'} message={errors.state?.message} ref={null} error={!!errors.state?.message} type="text" />}
                    />
                    <Controller
                        name="type" 
                        control={control}
                        render={({field}) => <TextField {...field} label={'타입'} message={errors.type?.message} ref={null} error={!!errors.type?.message} type="text" />}
                    />
                </Inputs>
                <SubmitButtonBox>
                    <Button label="생성" type="submit" color="black"/>
                </SubmitButtonBox>
            </form>
        </>
    )
}