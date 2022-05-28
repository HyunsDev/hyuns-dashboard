import { useEffect, useMemo, useState } from "react";
import { useTable, useFlexLayout, useBlockLayout } from 'react-table';
import styled from "styled-components";
import { SearchBox } from "../../../../components/search/searchBox";
import { useQuery } from "react-query";
import axios from "axios";

import { H1, TabDivver } from "../../../../components/Tab";
import { Table } from "../../../../components/table/tableStyle";


const Divver = styled.div`
    width: 100%;
`

const columnsData = [
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
]

export function VarChannel() {
    const [searchText, setSearchText] = useState('')
    const columns = useMemo(() => columnsData, [])

    const { isLoading: varLoading, data: varData } = useQuery(['var'], async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/var`, {
            headers: {
                Authorization: localStorage.getItem('token') || ''
            }
        })
        return res.data
    })

    const {
        getTableProps, headerGroups, rows, prepareRow
    } = useTable(
        {
            columns,
            data: varLoading ? [] : varData,
            // defaultColumn
        },
        useFlexLayout,
    );

    return (
        <Divver>
            <TabDivver>
                <H1>변수</H1>
                <SearchBox value={searchText} onChange={setSearchText} />
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