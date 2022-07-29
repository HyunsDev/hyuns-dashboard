import { useCallback, useContext, useState } from "react";
import {  Code as CodeIcon, X, Pencil, Eye } from 'phosphor-react'
import styled from "styled-components";
import { SearchBox } from "../../../../components/search/searchBox";
import { useQuery } from "react-query";
import axios from "axios";

import { H1, TabDivver } from "../../../../components/Tab";
import { Button, Checkbox } from "../../../../components/Input";
import { ModalContext } from "../../../../context/modalContext";
import { CreateModalView } from "./createVarModal";
import { RemoveModalView } from "./removeVarModal";
import { EditModalView } from "./editVarModal";
import { ModalTitle, ModalTitleBox } from "../../../../components/Modal/Header";
import { Code } from "../../../../components/code/code";
import { FlexRow, Items } from "../../../../components";
import dayjs from "dayjs";
import { useCodeModal } from "../../../../hooks/modal/useModal";


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

const Pre = styled.pre`
    font-size: 14px;
`

export function VarChannel() {
    const [ searchText, setSearchText ] = useState('')
    const [ isShowPrivateVar, setShowPrivateVar ] = useState(localStorage.getItem('dash/isShowPrivateVar') === 'show')
    const modal = useContext(ModalContext)
    const codeModal = useCodeModal()

    const { isLoading: varLoading, data: varData, refetch } = useQuery(['var'], async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/var`, {
            headers: {
                Authorization: localStorage.getItem('token') || ''
            }
        })
        return res.data
    })

    const createVar = useCallback(() => {
        modal.open(<CreateModalView close={modal.close} refetch={refetch} />)
    }, [modal, refetch])

    const removeVar = useCallback((key: string) => {
        modal.open(<RemoveModalView varKey={key} close={modal.close} refetch={refetch} />)
    }, [modal, refetch])

    const editVar = useCallback((initValue: {
        key: string
        value: string,
        isPublic: boolean,
        isEncrypted: boolean,
        img?: string
    }) => {
        modal.open(<EditModalView close={modal.close} refetch={refetch} initValue={initValue} />)
    }, [modal, refetch])

    const showVar = useCallback((value:any) => {
        modal.open(<>
            <ModalTitleBox>
                <ModalTitle>변수 정보</ModalTitle>
            </ModalTitleBox>
            <Pre>
                {value.value}
            </Pre>
        </>)
    }, [modal])

    const items = varLoading ? [] : varData.filter((e:any) => {
        if (!isShowPrivateVar && !e.isPublic) return false
        if (searchText === "") return true
        if (e.key.toUpperCase().includes(searchText.toUpperCase())) return true
        if (e.value.toUpperCase().includes(searchText.toUpperCase())) return true
        return false
    }).map((item: any) => ([
        {
            type: 'avatar',
            icon: item.img,
            name: item.key,
            label: dayjs(item.updatedAt).format('YY.MM.DD HH:mm')
        },
        {
            type: 'text',
            text: item.isPublic ? item.value : '',
            subText: item.isPublic ? '' : '(숨겨짐)'
        },
        {
            type: 'buttons',
            button: [
                [
                    {
                        label: '내용',
                        icon: <Eye />,
                        onClick: () => showVar(item)
                    },
                    {
                        label: 'Raw 보기',
                        icon: <CodeIcon />,
                        onClick: () => codeModal(`${item.key}`, item)
                    },
                    {
                        label: '수정',
                        icon: <Pencil />,
                        onClick: () => editVar(item)
                    },
                ], [
                    {
                        label: '삭제',
                        icon: <X />,
                        onClick: () => removeVar(item.key),
                        color: 'red'
                    },
                ]
            ]
        }
    ]))

    const toggleShowPrivateVar = () => {
        localStorage.setItem('dash/isShowPrivateVar', isShowPrivateVar ? 'hide' : 'show')
        setShowPrivateVar(!isShowPrivateVar)
    }

    return (
        <Divver>
            <TabDivver>
                <H1>변수</H1>
                <Buttons>
                    <SearchBox value={searchText} onChange={setSearchText} />
                    <FlexRow>
                        <Checkbox label="👀" value={isShowPrivateVar} onChange={() => {toggleShowPrivateVar()}} />
                        <Button label="변수 생성" onClick={createVar} type={'button'} color='black' />
                    </FlexRow>
                </Buttons>

                <Items data={items} />
            </TabDivver>
        </Divver>
    )
}