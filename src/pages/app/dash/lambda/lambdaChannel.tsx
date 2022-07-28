import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTable, useFlexLayout } from 'react-table';
import { Trash, PaperPlaneTilt, Code } from 'phosphor-react'
import styled from "styled-components";
import { SearchBox } from "../../../../components/search/searchBox";
import { useQuery } from "react-query";
import axios from "axios";

import { H1, TabDivver } from "../../../../components/Tab";
import { Table } from "../../../../components/table/tableStyle";
import { Button } from "../../../../components/Input";
import { ModalContext } from "../../../../context/modalContext";
import { InvokeLambdaModalView } from "./invokeLambdaModal";
import { Items, ItemsType, ItemType } from "../../../../components";
import { useCodeModal } from "../../../../hooks/modal/useModal";

import dayjs from 'dayjs';
import 'dayjs/locale/ko'
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

export function LambdaChannel() {
    const [searchText, setSearchText] = useState('')
    const modal = useContext(ModalContext)
    const codeModal = useCodeModal()

    const { isLoading, data, refetch } = useQuery(['lambda'], async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/lambda`, {
            headers: {
                Authorization: localStorage.getItem('token') || ''
            }
        })
        return res.data.Functions
    })

    const invokeLambda = useCallback((FunctionName:string) => {
        modal.open(<InvokeLambdaModalView close={modal.close} refetch={refetch} FunctionName={FunctionName} />)
    }, [modal, refetch])

    const columns = useMemo(() => [
        {
            accessor: 'FunctionName',
            Header: 'name',
            
        },
        {
            accessor: 'LastModified',
            Header: '마지막 수정',
            width: 100,
            maxWidth: 200,
            Cell: (row:any) => (<>{dayjs(row.row.original.LastModified).format("YYYY.MM.DD HH:mm:SS")}</>)
        },
        {
            accessor: 'invoke',
            Header: '',
            width: 36,
            maxWidth: 36,
            Cell: (row: any) => <DeleteButton onClick={() => invokeLambda(row.row.original.FunctionName)}><PaperPlaneTilt size={20} weight="fill" color="var(--gray5)" /></DeleteButton>,
        },
        
    ], [invokeLambda])


    let items: ItemsType = isLoading ? [] : data.filter((e:any) => {
        console.table(e)
        if (searchText === "") return true
        if (e.Key.toUpperCase().includes(searchText.toUpperCase())) return true
        return false
    }).map((item: any):ItemType => ([
        {
            type: 'text',
            text: item.FunctionName,
            subText: dayjs(item.LastModified).format('YY.MM.DD ddd HH:mm')
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
                    label: 'Invoke',
                    icon: <PaperPlaneTilt />,
                    onClick: () => invokeLambda(item.FunctionName)
                }
            ]
        }
    ]))

    return (
        <Divver>
            <TabDivver>
                <H1>Lambda</H1>
                <Buttons>
                    <SearchBox value={searchText} onChange={setSearchText} />
                    <Button label="AWS 람다" onClick={() => window.open('https://ap-northeast-2.console.aws.amazon.com/lambda/home?region=ap-northeast-2#/functions')} type={'button'} color='black' />
                </Buttons>
                
                <Items data={items} />
            </TabDivver>
        </Divver>
    )
}