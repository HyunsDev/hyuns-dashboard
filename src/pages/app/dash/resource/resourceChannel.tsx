import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTable, useFlexLayout } from 'react-table';
import { Trash, Download, ClipboardText, X, Code  } from 'phosphor-react'
import styled from "styled-components";
import { SearchBox } from "../../../../components/search/searchBox";
import { useQuery } from "react-query";
import axios from "axios";

import { H1, TabDivver } from "../../../../components/Tab";
import { Table } from "../../../../components/table/tableStyle";
import { Button } from "../../../../components/Input";
import { ModalContext } from "../../../../context/modalContext";
import { CreateModalModalView } from "./createResourceModal";
import { RemoveModalModalView } from "./removeResourceModal";
import { toast } from "react-toastify";
import { ItemType, ItemsType, Items } from "../../../../components";
import dayjs from 'dayjs';
import 'dayjs/locale/ko'
import { useCodeModal } from "../../../../hooks/modal/useModal";
dayjs.locale('ko')

const Divver = styled.div`
    width: 100%;
`

const Buttons = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    margin-top: 8px;
`

const DeleteButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function ResourceChannel() {
    const [searchText, setSearchText] = useState('')
    const modal = useContext(ModalContext)
    const codeModal = useCodeModal()

    const { isLoading, data, refetch } = useQuery(['resource'], async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/resource`, {
            headers: {
                Authorization: localStorage.getItem('token') || ''
            }
        })
        return res.data.fileList.Contents
    })

    const createVar = () => {
        modal.open(<CreateModalModalView close={modal.close} refetch={refetch} />)
    }

    const removeVar = useCallback((key: string) => {
        modal.open(<RemoveModalModalView resourceKey={key} close={modal.close} refetch={refetch} />)
    }, [modal, refetch])

    const items:ItemsType = isLoading ? [] : data.filter((e:any) => {
        if (searchText === "") return true
        if (e.Key.toUpperCase().includes(searchText.toUpperCase())) return true
        return false
    }).map((item: any):ItemType => ([
        {
            type: 'text',
            text: item.Key,
            subText: `${dayjs(item.LastModified).format('YY.MM.DD ddd HH:ss')} | ${formatBytes(item.Size)}`
        },
        {
            type: 'buttons',
            button: [
                {
                    label: 'Raw 보기',
                    icon: <Code />,
                    onClick: () => codeModal('Raw 보기', item)
                },
                {
                    icon: <ClipboardText />,
                    label: '복사',
                    onClick: () => {navigator.clipboard.writeText(`https://s3.hyuns.dev/${item.Key}`); toast.info('클립보드에 복사했어요.')}
                },
                {
                    icon: <Download />,
                    label: '다운로드',
                    onClick: () => window.open(`https://s3.hyuns.dev/${item.Key}`)
                },
                {
                    icon: <X />,
                    label: '삭제',
                    onClick: () => removeVar(item.Key)
                }
            ]
        }
    ]))

    return (
        <Divver>
            <TabDivver>
                <H1>리소스</H1>
                <Buttons>
                    <SearchBox value={searchText} onChange={setSearchText} />
                    <Button label="리소스 업로드" onClick={createVar} type={'button'} color='black' />
                </Buttons>
                <Items data={items} />

            </TabDivver>
        </Divver>
    )
}