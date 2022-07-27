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
        id: string,
        name: string,
        url: string
        checkUrl: string
        memo?: string
        img?: string,
        check: boolean,
    }
}

interface Form {
    name: string,
    url: string
    checkUrl: string
    memo?: string
    img?: string,
    check: boolean,
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
            name: props.initValue.name,
            url: props.initValue.url,
            checkUrl: props.initValue.checkUrl,
            img: props.initValue.img || '',
            check: props.initValue.check,
            memo: props.initValue.memo || ''
        }
    });

    const onSubmit = async (data:Form) => {
        const { name, url, checkUrl, check, img, memo } = data
        try {
            await axios.patch(`${process.env.REACT_APP_API_URL}/server/${props.initValue.id}`, {
                name, url, checkUrl, check, img, memo
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
                <ModalTitle>{props.initValue.id} 수정</ModalTitle>
            </ModalTitleBox>
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <Inputs>
                    <Controller
                        name="name" 
                        control={control}
                        render={({field}) => <TextField {...field} label={'이름'} message={errors.name?.message} ref={null} error={!!errors.name?.message} type="text" />}
                    />
                    <Controller
                        name="url" 
                        control={control}
                        render={({field}) => <TextField {...field} label={'주소'} message={errors.url?.message} ref={null} error={!!errors.url?.message} type="text" />}
                    />
                    <Controller
                        name="checkUrl" 
                        control={control}
                        render={({field}) => <TextField {...field} label={'확인용 주소'} message={errors.checkUrl?.message} ref={null} error={!!errors.checkUrl?.message} type="text" />}
                    />
                    <Controller
                        name="img" 
                        control={control}
                        render={({field}) => <TextField {...field} label={'이미지'} ref={null} type="text" />}
                    />
                    <Controller
                        name="check" 
                        control={control}
                        render={({field}) => <Checkbox {...field} label='상태 체크 여부' ref={null} />}
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