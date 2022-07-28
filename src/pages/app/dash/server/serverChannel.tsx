import { useCallback, useContext, useState } from "react";
import { ArrowUpRight, Code as CodeIcon, Pencil, X } from 'phosphor-react'
import styled from "styled-components";
import { SearchBox } from "../../../../components/search/searchBox";
import { useQuery } from "react-query";
import axios from "axios";

import { H1, TabDivver } from "../../../../components/Tab";
import { Button } from "../../../../components/Input";
import { ModalContext } from "../../../../context/modalContext";
import { CreateModalView } from "./createServerModal";
import { RemoveModalView } from "./removeServerModal";
import { EditModalView } from "./editServerModal";
import { Items, ItemsType, ItemType } from "../../../../components";
import { useCodeModal } from "../../../../hooks/modal/useModal";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'
dayjs.locale('ko')
dayjs.extend(relativeTime)


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

export function ServerChannel() {
    const [ searchText, setSearchText ] = useState('')
    const modal = useContext(ModalContext)
    const codeModal = useCodeModal()

    const { isLoading: varLoading, data: varData, refetch } = useQuery(['server'], async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/server`, {
            headers: {
                Authorization: localStorage.getItem('token') || ''
            }
        })
        console.log(res.data)
        return res.data
    })

    const createServer = useCallback(() => {
        modal.open(<CreateModalView close={modal.close} refetch={refetch} />)
    }, [modal, refetch])

    const removeServer = useCallback((key: string) => {
        modal.open(<RemoveModalView serverId={key} close={modal.close} refetch={refetch} />)
    }, [modal, refetch])

    const editServer = useCallback((initValue: {
        id: string,
        name: string,
        url: string
        checkUrl: string
        memo?: string
        img?: string,
        check: boolean,
    }) => {
        modal.open(<EditModalView close={modal.close} refetch={refetch} initValue={initValue} />)
    }, [modal, refetch])

    const items:ItemsType = varLoading ? [] : varData.filter((e:any) => {
        if (searchText === "") return true
        if (e.key.toUpperCase().includes(searchText.toUpperCase())) return true
        if (e.value.toUpperCase().includes(searchText.toUpperCase())) return true
        return false
    }).map((item: any):ItemType => ([
        {
            type: 'avatar',
            icon: item.img,
            name: `${item.name} [${item.id}]`,
            label: `${item.url}`
        }, {
            type: 'text',
            subText: item.memo,
        }, {
            type: 'status',
            status: item.lastCheckStatus === 'good' ? 'good' : 'error',
            label: item.lastCheck && dayjs().to(dayjs(item.lastCheck))
        }, {
            type: 'buttons',
            button: [
                [
                    {
                        icon: <CodeIcon />,
                        label: 'Raw 보기',
                        onClick: () => codeModal(item.name, item)
                    }, {
                        icon: <ArrowUpRight />,
                        label: '열기',
                        onClick: () => window.open(item.url)
                    }, {
                        icon: <Pencil />,
                        label: '수정',
                        onClick: () => editServer(item)
                    },
                ], [
                    {
                        icon: <X />,
                        label: '삭제',
                        onClick: () => removeServer(item.id),
                        color: 'red'
                    }
                ]
            ]
        }
    ]))

    return (
        <Divver>
            <TabDivver>
                <H1>서버</H1>
                <Buttons>
                    <SearchBox value={searchText} onChange={setSearchText} />
                    <Button label="서버 생성" onClick={createServer} type={'button'} color='black' />
                </Buttons>
                <Items data={items} />
            </TabDivver>
        </Divver>
    )
}