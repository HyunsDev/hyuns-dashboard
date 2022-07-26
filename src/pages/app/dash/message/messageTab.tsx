import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
// import { useTable, useFlexLayout } from 'react-table';
import { fetchSSE } from "../../../../utils/sse";
import axios from "axios";

import { ArrowUpRight, Code as CodeIcon, ChatText, X } from 'phosphor-react'

import { TabDivver, H1 } from "../../../../components/Tab";
import { SearchBox } from "../../../../components/search/searchBox";
import { Button } from "../../../../components/Input";
import { ModalContext } from "../../../../context/modalContext";
import { CreateModalView } from "./message/createMessageModal";
import { useQuery } from "react-query";

import { ModalTitle, ModalTitleBox } from "../../../../components/Modal/Header";
import { Code } from "../../../../components/code/code";
import { StatusBadgeTag } from "../../../../components/Badge/statusBadge";
import dayjs from "dayjs";
import { TopLoadingContext } from "../../../../context/topLoadingBarContext";

// TODO: #7 중복 코드&필요없는 코드 제거 및 모듈화
const Bar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const ItemButton = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 120ms;
    opacity: 0;
`

const ItemButtons = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;

    @media ( max-width: 767px ) {
        width: 100%;
        align-items: flex-end;
        justify-content: flex-end;

        ${ItemButton} {
            opacity: 1;
        }
    }
`

const Item = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-right: solid 1px var(--gray4);
    border-left: solid 1px var(--gray4);
    border-top: solid 1px var(--gray4);

    @media ( max-width: 767px ) {
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        padding: 16px;
        gap: 8px;
    }


    &:first-child {
        border-top: none;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }

    &:last-child {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
`

const ItemInner = styled.div`
    display: flex;
    align-items: center;

    @media ( max-width: 767px ) {
        gap: 16px;
        align-items: flex-start;
        flex-direction: column;
    }
`

const Items = styled.div`
    margin-top: 8px;
    border-top: solid 1px var(--gray4);
    border-bottom: solid 1px var(--gray4);
    border-radius: 8px;

    ${Item}:hover ${ItemButton} {
        opacity: 1;
    }
`

const AvatarDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    width: 180px;
`

const AvatarIcon = styled.img`
    border-radius: 999px;
    background-color: var(--gray4);

    width: 36px;
    height: 36px;
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
    width: 120px;

    @media ( max-width: 767px ) {
        position: absolute;
        bottom: 12px;
        left: 16px;
    }
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

            <Items>
                {
                    (isLoading ? [] : data.filter((e:any) => {
                        if (searchText === "") return true
                        if (e.title.toUpperCase().includes(searchText.toUpperCase())) return true
                        if (e.subTitle.toUpperCase().includes(searchText.toUpperCase())) return true
                        return false
                    })).map((row:any) => (
                        <Item key={row._id}>
                            <ItemInner>

                                <AvatarDiv>
                                    <AvatarIcon src={row.avatarIcon} alt="" />
                                    <div>
                                        <AvatarName>{row.avatarName || '이름 없음'}</AvatarName>
                                        <Time>{dayjs(row.createdAt).format('YY.MM.DD HH:mm')}</Time>
                                    </div>
                                </AvatarDiv>

                                <StateDiv>
                                    <StatusBadgeTag hideBackground color={colorMap(row.state.toLowerCase())} text={capitalize(row.state)} />
                                    <TypeDiv>{row.type}</TypeDiv>
                                </StateDiv>


                                <TitleDiv>
                                    <Title>{row.title || '(제목 없음)'}</Title>
                                    <SubTitle>{row.subTitle}</SubTitle>
                                </TitleDiv>
                            </ItemInner>

                            <ItemButtons>
                                <ItemButton onClick={() => showContent(row.content)}><ChatText size={20} weight="bold" color="var(--gray5)" /></ItemButton>
                                <ItemButton onClick={() => showRAW(row)}><CodeIcon size={20} weight="bold" color="var(--gray5)" /></ItemButton>
                                <ItemButton onClick={() => deleteMessage(row._id)}><X size={20} weight="bold" color="var(--gray5)" /></ItemButton>
                            </ItemButtons>
                        </Item>
                    ))
                }
            </Items>
        </TabDivver>
    )
}