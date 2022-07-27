import styled from "styled-components";
import { TabDivver, H1 } from "../../../../components/Tab";
import { CurrencyKrw, Check, Spinner } from 'phosphor-react'
import React from "react";
import { useQuery } from "react-query";
import { instance } from "../../../../utils/axios";
import dayjs from "dayjs";
import axios from "axios";

const StatusBoxItemDivver = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    width: 200px;
    padding: 8px;
`

const StatusBoxItemText = styled.div`
    display: flex;
    flex-direction: column;   
    align-items: flex-start;
`

const StatusBoxItemLabel = styled.div`
    color: var(--gray5);
    font-size: 14px;
`

const StatusBoxItemValue = styled.div`
    color: var(--gray6);
    font-size: 18px;
    font-weight: 700;
`

const StatusBoxItemIcon = styled.div<{color: string}>`
    width: 44px;
    height: 44px;
    border-radius: 22px;
    background-color: var(--gray1);
    border: solid 8px ${props => props.color};
    
    display: flex;
    align-items: center;
    justify-content: center;
`

function StatusBoxItem(props:{label: string, value: string, color: string, icon: React.ReactElement}) {
    return (
        <StatusBoxItemDivver>
            <StatusBoxItemText>
                <StatusBoxItemLabel>{props.label}</StatusBoxItemLabel>
                <StatusBoxItemValue>{props.value}</StatusBoxItemValue>
            </StatusBoxItemText>
            <StatusBoxItemIcon color={props.color}>
                { props.icon }
            </StatusBoxItemIcon>
        </StatusBoxItemDivver>
    )
}

const BoxDivver = styled.div`
    background-color: var(--gray2);
    border: solid 1px var(--gray3);
    border-radius: 8px;
    padding: 12px;
    width: 100%;

    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 25%));
    /* grid-auto-columns: minmax(200px, auto); */
    justify-content: space-between;
    /* grid-auto-rows: minmax(150px, auto); */
`

const LoadingIcon = <Spinner size={22} color='var(--status-yellow)'>
    <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        dur="3s"
        from="0 0 0"
        to="360 0 0"
        repeatCount="indefinite"
      ></animateTransform>
</Spinner>

function StatusBox() {
    // const { data: sales, isLoading: salesLoading } = useQuery(['sales'], async () => {
    //     const res = await axios.get(`${process.env.REACT_APP_API_URL}/var/secret/dashboard/revenue`, {
    //         headers: {
    //             Authorization: localStorage.getItem('token') || ''
    //         }
    //     })
    //     return res.data
    // })

    const { isLoading: serverStatusLoading,  data:serverStatus } = useQuery(['server'], async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/server`, {
            headers: {
                Authorization: localStorage.getItem('token') || ''
            }
        })

        return res.data
    })
    const res = !serverStatusLoading && serverStatus.reduce((acc:boolean, cur:any) => acc && (cur.lastCheckStatus === 'good'), true)
    

    return (
        <BoxDivver>
            {/* <StatusBoxItem
                label="오늘까지의 매출"
                value={`${salesLoading ? 'Loading' : sales?.toLocaleString('ko-KR')}원`}
                color="var(--blue5)" 
                icon={<CurrencyKrw weight="bold" size={22} color='var(--blue5)' />}
            /> */}

            <StatusBoxItem
                label="서버 상태"
                value={serverStatusLoading ? 'Loading' : res ? '정상' : '오류'}
                color={serverStatusLoading ? 'var(--status-yellow)' : res ? "var(--status-green)" : "var(--status-red)"}
                icon={serverStatusLoading ? LoadingIcon : <Check weight="bold" size={22} color={res ? "var(--status-green)" : "var(--status-red)"} />}
            />
        </BoxDivver>
    )
}

const GithubBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: var(--gray2);
    border: solid 1px var(--gray3);
    border-radius: 8px;
    padding: 12px;

    img {
        max-width: 700px;
        width: 100%;
    }
`

export function DashboardTab() {

    return (
        <TabDivver>
            <H1>{dayjs().format('MM월 DD일')} 대시보드</H1>
            <StatusBox />
            <GithubBox>
                <img src="https://ghchart.rshah.org/219138/hyunsdev" alt="" />
            </GithubBox>
        </TabDivver>
    )
}