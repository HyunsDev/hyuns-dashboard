import { ModalTitle, ModalTitleBox } from "../../../../components/Modal/Header"
import { useForm, Controller } from "react-hook-form";
import { Button, TextArea, TextField } from "../../../../components/Input";
import styled from "styled-components";
import { Checkbox } from "../../../../components/Input/checkbox";
import axios from "axios";
import { useContext } from "react";
import { TopLoadingContext } from "../../../../context/topLoadingBarContext";
import { toast } from "react-toastify";
import { FileField } from "../../../../components/Input/fileField";


interface ModalViewProps {
    close: Function
    refetch: Function
}

interface Form {
    key: string,
    value: any,
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

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function CreateModalModalView(props:ModalViewProps) {
    const progress = useContext(TopLoadingContext)

    const { control, handleSubmit, watch, formState: { errors } } = useForm<{
        key: string,
        value: any,
    }>({
        defaultValues: {
            key: '',
            value: null,
        }
    });

    const onSubmit = async (data:Form) => {
        const { key, value } = data

        try {
            progress.setProgress(0)
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/resource`, {
                key,
            }, {
                headers: {
                    Authorization: localStorage.getItem('token') || ''
                }
            })

            console.log(value)

            await axios.put(res.data.url, value, {
                headers: {
                  "Content-Type": value.type
                }
            })

            props.refetch()
            progress.setProgress(100)
            props.close()
        } catch(err:any) {
            console.error(err)
            toast.error(`문제가 발생했어요. ${err.response.status}`)
        }
    }

    return (
        <>
            <ModalTitleBox>
                <ModalTitle>리소스 업로드</ModalTitle>
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
                        rules={{required: '칸을 채워주세요'}}
                        render={({field}) => <FileField {...field} label={'값'} message={`${watch()?.value?.type || ''} | ${formatBytes(watch()?.value?.size || 0)}`} ref={null} error={!!errors.value?.message}/>}
                    />
                </Inputs>
                <SubmitButtonBox>
                    <Button label="업로드" type="submit" color="black"/>
                </SubmitButtonBox>
            </form>
        </>
    )
}