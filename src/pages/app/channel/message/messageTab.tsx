import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useTable, useFlexLayout } from 'react-table';
import { fetchSSE } from "../../../../utils/sse";
import { ArrowUpRight, Code as CodeIcon, ChatText, X } from 'phosphor-react'

import { TabDivver, H1 } from "../../../../components/Tab";
import { SearchBox } from "../../../../components/search/searchBox";
import { Button } from "../../../../components/Input";
import { ModalContext } from "../../../../context/modalContext";
import { CreateModalView } from "./message/createMessageModal";
import { useQuery } from "react-query";
import axios from "axios";
import { ModalTitle, ModalTitleBox } from "../../../../components/Modal/Header";
import { Code } from "../../../../components/code/code";
import { StatusBadgeTag } from "../../../../components/Badge/statusBadge";
import { Table } from "../../../../components/table/tableStyle";
import { MessageTable } from "../../../../components/table/messageTableStyle";
import dayjs from "dayjs";
import { TopLoadingContext } from "../../../../context/topLoadingBarContext";


const Bar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const DeleteButton = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 120ms;
    opacity: 0;
`

const TableWrapper = styled(MessageTable)`
    tr:hover ${DeleteButton} {
        opacity: 1;
    }
`

const AvatarDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`

const AvatarIcon = styled.img`
    border-radius: 999px;
    background-color: var(--gray4);
`

const AvatarName = styled.div`
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
`

const Time = styled.div`
    font-size: 12px;
    color: var(--gray5);
`

const StateDiv = styled.div`
    
`

const TypeDiv = styled.div`
    color: var(--gray5);
    font-size: 12px;
    margin-left: 16px;
`

const TitleDiv = styled.div`
    

`

const Title = styled.div`
    font-weight: 500;
    font-size: 14px;
`

const SubTitle = styled.div`
    color: var(--gray6);  
    font-size: 12px;  

`

const colorMap:((text: string) => 'red' | 'yellow' | 'green' | 'blue' | 'gray') = (text:string) => {
    const map:any= {
        stateless: 'gray',
        error: 'red',
        warning: 'yellow',
        done: 'blue',
    }
    return map[text] || 'gray'
}

function capitalize(str:string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function MessageTab() {
    const modal = useContext(ModalContext)
    const progress = useContext(TopLoadingContext)
    const [searchText, setSearchText] = useState('')

    const { isLoading, data, refetch } = useQuery(['message'], async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/message`, {
            headers: {
                Authorization: localStorage.getItem('token') || ''
            }
        })
        return res.data.messages.reverse()
    })

    const showRAW = useCallback((value:any) => {
        modal.open(<>
            <ModalTitleBox>
                <ModalTitle>메세지</ModalTitle>
            </ModalTitleBox>
            <Code>{JSON.stringify(value, null, 2)}</Code>
        </>)
    }, [modal])
    
    const showContent = useCallback((value:any) => {
        modal.open(<>
            <ModalTitleBox>
                <ModalTitle>내용</ModalTitle>
            </ModalTitleBox>
            <Code>{value || '(내용이 없습니다.)'}</Code>
        </>)
    }, [modal])

    const deleteMessage = useCallback(async (id: string) => {
        await axios.delete(`${process.env.REACT_APP_API_URL}/message/${id}`, {
            headers: {
                Authorization: localStorage.getItem('token') || ''
            }
        })
        refetch()
        progress.setProgress(100)
    }, [progress, refetch])

    const columns = useMemo(() => [
        {
            accessor: 'server',
            Header: '',
            Cell: (row: any) => (
                <AvatarDiv>
                    <AvatarIcon src={row.row.original.avatarIcon} alt="" />
                    <div>
                        <AvatarName>{row.row.original.avatarName || '이름 없음'}</AvatarName>
                        <Time>{dayjs(row.row.original.createdAt).format('YY.MM.DD HH:mm')}</Time>
                    </div>
                </AvatarDiv>
            ),
            width: 200,
            maxWidth: 200
        },
        {
            accessor: 'state',
            Header: '',
            Cell: (row: any) => (
                <StateDiv>
                    <StatusBadgeTag hideBackground color={colorMap(row.row.original.state.toLowerCase())} text={capitalize(row.row.original.state)} />
                    <TypeDiv>{row.row.original.type}</TypeDiv>
                </StateDiv>
            ),
            width: 160,
            maxWidth: 160,
        },
        {
            accessor: 'title',
            Header: '',
            Cell: (row: any) => (
                <TitleDiv>
                    <Title>{row.row.original.title || '(제목 없음)'}</Title>
                    <SubTitle>{row.row.original.subTitle}</SubTitle>
                </TitleDiv>
            ),
        },
        {
            accessor: 'content',
            Header: '',
            width: 36,
            maxWidth: 36,
            Cell: (row: any) => <DeleteButton onClick={() => showContent(row.row.original.content)}><ChatText size={20} weight="bold" color="var(--gray5)" /></DeleteButton>,
        },
        {
            accessor: 'info',
            Header: '',
            width: 36,
            maxWidth: 36,
            Cell: (row: any) => <DeleteButton onClick={() => showRAW(row.row.original)}><CodeIcon size={20} weight="bold" color="var(--gray5)" /></DeleteButton>,
        },
        {
            accessor: 'remove',
            Header: '',
            width: 36,
            maxWidth: 36,
            Cell: (row: any) => <DeleteButton onClick={() => deleteMessage(row.row.original._id)}><X size={20} weight="bold" color="var(--gray5)" /></DeleteButton>,
        },
    ], [deleteMessage, showContent, showRAW])

    const { getTableProps, rows, prepareRow } = useTable(
        {
            columns,
            data: isLoading ? [] : data.filter((e:any) => {
                if (searchText === "") return true
                if (e.title.toUpperCase().includes(searchText.toUpperCase())) return true
                if (e.subTitle.toUpperCase().includes(searchText.toUpperCase())) return true
                return false
            }),
        },
        useFlexLayout,
    );
    
    // SSE 등록
    useEffect(() => {
        fetchSSE(`${process.env.REACT_APP_API_URL}/message/sse`, (data) => {
            refetch()
        }, {
            headers: {
                Authorization: localStorage.getItem('token') || ''
            }
        })
    }, [refetch])

    const createMessage = useCallback(() => {
        modal.open(<CreateModalView close={modal.close} refetch={refetch} />)
    }, [modal, refetch])

    return (
        <TabDivver>
            <H1>메세지</H1>
            <Bar>
                <SearchBox value={searchText} onChange={setSearchText} />
                <Button label='작성' onClick={createMessage} color='black' />
            </Bar>
            
            <TableWrapper {...getTableProps()}>
                <thead>
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
            </TableWrapper>

        </TabDivver>
    )
}