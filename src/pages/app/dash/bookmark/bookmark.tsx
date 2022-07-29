import { useCallback, useContext, useState } from "react";
import {  Code as CodeIcon, X, Pencil } from 'phosphor-react'
import styled from "styled-components";
import { SearchBox } from "../../../../components/search/searchBox";
import { useQuery } from "react-query";
import axios from "axios";

import { H1, TabDivver } from "../../../../components/Tab";
import { Button, Checkbox } from "../../../../components/Input";
import { ModalContext } from "../../../../context/modalContext";
import { CreateModalView } from "./modal/createModal";
import { RemoveModalView } from "./modal/removeModal";
import { EditModalView } from "./modal/editModal";
import { ModalTitle, ModalTitleBox } from "../../../../components/Modal/Header";
import { Code } from "../../../../components/code/code";
import { FlexRow, Items, ItemsType } from "../../../../components";


const Divver = styled.div`
    width: 100%;
`

const Buttons = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    margin-top: 8px;
    gap: 8px;
`

export function BookmarkChannel() {
    const [ searchText, setSearchText ] = useState('')
    const modal = useContext(ModalContext)

    const { isLoading, data, refetch } = useQuery(['bookmark'], async () => {
        const res = (await axios.get(`${process.env.REACT_APP_API_URL}/dash/bookmark`, {
            headers: {
                Authorization: localStorage.getItem('token') || ''
            }
        })).data as any

        return res
    })

    const create = useCallback(() => {
        modal.open(<CreateModalView prev={data} close={modal.close} refetch={refetch} />)
    }, [data, modal, refetch])

    const remove = useCallback((key: string) => {
        modal.open(<RemoveModalView prev={data} id={key} close={modal.close} refetch={refetch} />)
    }, [data, modal, refetch])

    const edit = useCallback((initValue: {
        id: string,
        key: string,
        title: string,
        subTitle: string,
        url: string
        img?: string
        memo?: string
    }) => {
        modal.open(<EditModalView prev={data} close={modal.close} refetch={refetch} initValue={initValue} />)
    }, [data, modal, refetch])

    const show = useCallback((value:any) => {
        modal.open(<>
            <ModalTitleBox>
                <ModalTitle>변수 정보</ModalTitle>
            </ModalTitleBox>
            <Code>{JSON.stringify(value, null, 2)}</Code>
        </>)
    }, [modal])

    const items: ItemsType = isLoading ? [] : (Object.entries(data).map((e: any) => ({
            id: e[0],
            ...e[1]
        })) as any).filter((e:any) => {
        if (searchText === "") return true
        if (e.id.toUpperCase().includes(searchText.toUpperCase())) return true
        if (e.value.toUpperCase().includes(searchText.toUpperCase())) return true
        return false
    }).map((item: any) => ([
        {
            type: 'avatar',
            icon: item.img,
            name: item.title,
            label: item.id
        },
        {
            type: 'text',
            text: item.url,
            subText: item.subTitle
        },
        {
            type: 'buttons',
            button: [
                [
                    {
                        label: 'Raw 보기',
                        icon: <CodeIcon />,
                        onClick: () => show(item)
                    },
                    {
                        label: '수정',
                        icon: <Pencil />,
                        onClick: () => edit(item)
                    },
                ], [
                    {
                        label: '삭제',
                        icon: <X />,
                        onClick: () => remove(item.id),
                        color: 'red'
                    },
                ]
            ]
        }
    ]))

    return (
        <Divver>
            <TabDivver>
                <H1>북마크</H1>
                <Buttons>
                    <SearchBox value={searchText} onChange={setSearchText} />
                    <FlexRow>
                        <Button label="북마크 추가" onClick={create} type={'button'} color='black' />
                    </FlexRow>
                </Buttons>

                <Items data={items} />
            </TabDivver>
        </Divver>
    )
}