import { ModalTitle, ModalTitleBox } from "../../../../../components/Modal/Header"
import { useForm, Controller } from "react-hook-form";
import { Button, TextArea, TextField } from "../../../../../components/Input";
import styled from "styled-components";
import { Checkbox } from "../../../../../components/Input/checkbox";
import axios from "axios";
import { useContext } from "react";
import { TopLoadingContext } from "../../../../../context/topLoadingBarContext";
import { toast, useToast } from "react-toastify";


interface ModalViewProps {
    close: Function
    refetch: Function
    prev: Object
}

interface Form {
    key: string,
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
    gap: 8px;
`

export function CreateModalView(props:ModalViewProps) {
    const progress = useContext(TopLoadingContext)

    const { control, setValue, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            key: '',
            title: '',
            subTitle: '',
            url: '',
            img: 'https://static.hyuns.dev/dashboard/logo.png',
            memo: ''
        }
    });

    const onSubmit = async (data:Form) => {
        const { key, title, subTitle, url, img, memo } = data
        const body = {
            key: 'dash/bookmark',
            value: JSON.stringify({
                ...props.prev,
                [key]: {
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
            console.log(3)
            toast.error(`문제가 발생했어요. ${err.response.status}`)
        }
    }

    const getOG = async () => {
        if (!watch().url) return
        try {
            const res = (await axios.get(`${process.env.REACT_APP_API_URL}/utils/og?url=${encodeURIComponent(watch().url)}`, {
                headers: {
                    Authorization: localStorage.getItem('token') || ''
                }
            })).data
    
            setValue("key", res.ogSiteName)
            setValue('subTitle', res.ogDescription)
            setValue('title', res.ogTitle || res.ogSiteName)
            setValue('img', `${watch().url.split('/').slice(0, 4).join('/')}/favicon.ico`)
        } catch (err) {
            toast.warn('OG 정보를 불러올 수 없어요.')
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
                    <Button label="OG 불러오기" onClick={getOG} color="black"/>
                    <Button label="생성" type="submit" color="black"/>
                </SubmitButtonBox>
            </form>
        </>
    )
}