import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTable, useFlexLayout } from 'react-table';
import { Trash, HighlighterCircle } from 'phosphor-react'
import styled from "styled-components";
import { SearchBox } from "../../../../components/search/searchBox";
import { useQuery } from "react-query";
import axios from "axios";

import { H1, TabDivver } from "../../../../components/Tab";
import { Table } from "../../../../components/table/tableStyle";
import { Button } from "../../../../components/Input";
import { ModalContext } from "../../../../context/modalContext";
import { CreateModalView } from "./createVarModal";
import { RemoveModalView } from "./removeVarModal";
import { EditModalView } from "./editVarModal";


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

export function VarChannel() {
    const [ searchText, setSearchText ] = useState('')
    const modal = useContext(ModalContext)

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

    const columns = useMemo(() => [
        {
            accessor: 'img',
            Header: '',
            Cell: (row: any) => <img src={row.row.original.img} alt="" className="TableImage"></img>,
            width: 64,
            maxWidth: 64
        },
        {
            accessor: 'key',
            Header: '키',
            width: 100,
            maxWidth: 200,
        },
        {
            accessor: 'value',
            Header: '값'
        },
        {
            accessor: 'isPublic',
            Header: '공개',
            width: 80,
            maxWidth: 80,
            Cell: (row: any) => <>{row.row.original.isPublic ? '공개' : '비공개'}</>,
        },
        {
            accessor: 'edit',
            Header: '',
            width: 36,
            maxWidth: 36,
            Cell: (row: any) => <DeleteButton onClick={() => editVar(row.row.original)}><HighlighterCircle size={20} weight="fill" color="var(--gray5)" /></DeleteButton>,
        },
        {
            accessor: 'delete',
            Header: '',
            width: 36,
            maxWidth: 36,
            Cell: (row: any) => <DeleteButton onClick={() => removeVar(row.row.original.key)}><Trash size={20} weight="fill" color="var(--gray5)" /></DeleteButton>,
        },
        
    ], [editVar, removeVar])

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
                <H1>변수</H1>
                <Buttons>
                    <SearchBox value={searchText} onChange={setSearchText} />
                    <Button label="변수 생성" onClick={createVar} type={'button'} color='black' />
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