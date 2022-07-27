import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTable, useFlexLayout } from 'react-table';
import { Trash, Download, ClipboardText  } from 'phosphor-react'
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

    const columns = useMemo(() => [
        {
            accessor: 'Key',
            Header: '키',
            
        },
        {
            accessor: 'LastModified',
            Header: '마지막 수정',
            width: 100,
            maxWidth: 200,
        },
        {
            accessor: 'Size',
            Header: '크기',
            width: 80,
            maxWidth: 80,
            Cell: (row: any) => <>{formatBytes(row.row.original.Size)}</>,
        },
        {
            accessor: 'copy',
            Header: '',
            width: 36,
            maxWidth: 36,
            Cell: (row: any) => <DeleteButton onClick={() => {navigator.clipboard.writeText(`https://s3.hyuns.dev/${row.row.original.Key}`); toast.info('클립보드에 복사했어요.')}}><ClipboardText size={20} weight="fill" color="var(--gray5)" /></DeleteButton>,
        },
        {
            accessor: 'download',
            Header: '',
            width: 36,
            maxWidth: 36,
            Cell: (row: any) => <DeleteButton onClick={() => window.open(`https://s3.hyuns.dev/${row.row.original.Key}`)}><Download size={20} weight="fill" color="var(--gray5)" /></DeleteButton>,
        },
        {
            accessor: 'delete',
            Header: '',
            width: 36,
            maxWidth: 36,
            Cell: (row: any) => <DeleteButton onClick={() => removeVar(row.row.original.Key)}><Trash size={20} weight="fill" color="var(--gray5)" /></DeleteButton>,
        },
        
    ], [removeVar])

    const { getTableProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data: isLoading ? [] : data.filter((e:any) => {
                if (searchText === "") return true
                if (e.Key.toUpperCase().includes(searchText.toUpperCase())) return true
                return false
            }),
        },
        useFlexLayout,
    );

    return (
        <Divver>
            <TabDivver>
                <H1>리소스</H1>
                <Buttons>
                    <SearchBox value={searchText} onChange={setSearchText} />
                    <Button label="리소스 업로드" onClick={createVar} type={'button'} color='black' />
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