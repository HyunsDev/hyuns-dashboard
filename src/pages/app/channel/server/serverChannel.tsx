import { useCallback, useContext, useMemo, useState } from "react";
import { useTable, useFlexLayout } from 'react-table';
import { Trash, HighlighterCircle, ArrowUpRight, Code as CodeIcon } from 'phosphor-react'
import styled from "styled-components";
import { SearchBox } from "../../../../components/search/searchBox";
import { useQuery } from "react-query";
import axios from "axios";

import { ModalTitle, ModalTitleBox } from "../../../../components/Modal/Header"
import { H1, TabDivver } from "../../../../components/Tab";
import { Table } from "../../../../components/table/tableStyle";
import { Button } from "../../../../components/Input";
import { ModalContext } from "../../../../context/modalContext";
import { CreateModalView } from "./createServerModal";
import { RemoveModalView } from "./removeServerModal";
import { EditModalView } from "./editServerModal";
import { StatusBadgeTag } from "../../../../components/Badge/statusBadge";
import { Code } from "../../../../components/code/code";


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
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`

export function ServerChannel() {
    const [ searchText, setSearchText ] = useState('')
    const modal = useContext(ModalContext)

    const { isLoading: varLoading, data: varData, refetch } = useQuery(['server'], async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/server`, {
            headers: {
                Authorization: localStorage.getItem('token') || ''
            }
        })
        return res.data
    })

    const createServer = useCallback(() => {
        modal.open(<CreateModalView close={modal.close} refetch={refetch} />)
    }, [modal, refetch])

    const removeServer = useCallback((key: string) => {
        modal.open(<RemoveModalView serverId={key} close={modal.close} refetch={refetch} />)
    }, [modal, refetch])

    const showAPI = useCallback((value:any) => {
        modal.open(<>
            <ModalTitleBox>
                <ModalTitle>서버 정보</ModalTitle>
            </ModalTitleBox>
            <Code>{JSON.stringify(value, null, 2)}</Code>
        </>)
    }, [modal])

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

    const columns = useMemo(() => [
        {
            accessor: 'img',
            Header: '',
            Cell: (row: any) => <img src={row.row.original.img} alt="" className="TableImage"></img>,
            width: 64,
            maxWidth: 64
        },
        {
            accessor: 'id',
            Header: '아이디',
            width: 100,
            maxWidth: 100,
        },
        {
            accessor: 'name',
            Header: '이름',
            width: 100,
            maxWidth: 200,
        },
        {
            accessor: 'url',
            Header: '주소',
        },
        {
            accessor: 'lastCheckStatus',
            Header: '상태',
            Cell: (row: any) => <StatusBadgeTag color={row.row.original.lastCheckStatus === 'good' ? 'green' : 'red'} text={row.row.original.lastCheckStatus} />,
            width: 80,
            maxWidth: 80,
        },
        {
            accessor: 'info',
            Header: '',
            width: 36,
            maxWidth: 36,
            Cell: (row: any) => <DeleteButton onClick={() => showAPI(row.row.original)}><CodeIcon size={20} weight="bold" color="var(--gray5)" /></DeleteButton>,
        },
        {
            accessor: 'open',
            Header: '',
            width: 36,
            maxWidth: 36,
            Cell: (row: any) => <DeleteButton onClick={() => window.open(row.row.original.url)}><ArrowUpRight size={20} weight="bold" color="var(--gray5)" /></DeleteButton>,
        },
        {
            accessor: 'edit',
            Header: '',
            width: 36,
            maxWidth: 36,
            Cell: (row: any) => <DeleteButton onClick={() => editServer(row.row.original)}><HighlighterCircle size={20} weight="fill" color="var(--gray5)" /></DeleteButton>,
        },
        {
            accessor: 'delete',
            Header: '',
            width: 36,
            maxWidth: 36,
            Cell: (row: any) => <DeleteButton onClick={() => removeServer(row.row.original.id)}><Trash size={20} weight="fill" color="var(--gray5)" /></DeleteButton>,
        },
        
    ], [editServer, removeServer, showAPI])

    const { getTableProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data: varLoading ? [] : varData.filter((e:any) => {
                if (searchText === "") return true
                if (e.key.toUpperCase().includes(searchText.toUpperCase())) return true
                if (e.value.toUpperCase().includes(searchText.toUpperCase())) return true
                return false
            }),
        },
        useFlexLayout,
    );

    return (
        <Divver>
            <TabDivver>
                <H1>서버</H1>
                <Buttons>
                    <SearchBox value={searchText} onChange={setSearchText} />
                    <Button label="서버 생성" onClick={createServer} type={'button'} color='black' />
                </Buttons>
                <Table {...getTableProps()}>
                    <thead>
                        {
                            headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {
                                        headerGroup.headers.map(column => (
                                            <th {...column.getHeaderProps({
                                                style: { minWidth: column.minWidth, width: column.width, maxWidth: column.maxWidth },
                                            })}>
                                                <div>
                                                    {column.render('Header')}
                                                </div>
                                            </th>
                                        ))}
                                </tr>
                            ))}
                    </thead>
                    <tbody>
                        {
                            rows.map(row => {
                                prepareRow(row)
                                return (
                                    <tr {...row.getRowProps()}>
                                        {
                                            row.cells.map(cell => {
                                                return (
                                                    <td {...cell.getCellProps({
                                                        style: { minWidth: cell.column.minWidth, width: cell.column.width, maxWidth: cell.column.maxWidth },
                                                    })}>
                                                        <div>
                                                            { cell.render('Cell') }
                                                        </div>
                                                    </td>
                                                )
                                            })}
                                    </tr>
                                )
                            })}
                    </tbody>
                </Table>
            </TabDivver>
        </Divver>
    )
}