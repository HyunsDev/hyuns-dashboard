import { useEffect, useMemo, useState } from "react";
import { useTable } from 'react-table';
import styled from "styled-components";
import { SearchBox } from "../../../../components/search/searchBox";

import { H1, TabDivver } from "../../../../components/Tab";

const Divver = styled.div`
    width: 100%;
`

const columnsData = [
    {
        accessor: 'key',
        Header: '키'
    },
    {
        accessor: 'value',
        Header: '값'
    },
    {
        accessor: 'isPublic',
        Header: '공개'
    },
    {
        accessor: 'img',
        Header: ''
    },
]

export function VarChannel() {
    const [ searchText, setSearchText ] = useState('')
    const columns = useMemo(() => columnsData, [])
    const { isLoading: serverStatusLoading,  data:serverStatus } = useQuery(['serversStatus'], async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/server`, {
            headers: {
                Authorization: localStorage.getItem('token') || ''
            }
        })

        return res.data
    })

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns: columns, data: varData });

    return (
        <Divver>
            <TabDivver>
                <H1>변수</H1>
                <SearchBox value={searchText} onChange={setSearchText} />
                
            </TabDivver>
        </Divver>
    )
}