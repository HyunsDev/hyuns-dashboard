import styled from "styled-components";
import { TabDivver, H1 } from "../../../../components/Tab";
import { CurrencyKrw, Check, Spinner, UserCircle, Aperture, CircleNotch } from 'phosphor-react'
import React from "react";
import { useQuery } from "react-query";
import { instance } from "../../../../utils/axios";
import dayjs from "dayjs";
import axios from "axios";
import { FlexCenter, FlexColumn, Items } from "../../../../components";

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
    justify-content: space-between;
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
            <StatusBoxItem
                label="서버 상태"
                value={serverStatusLoading ? 'Loading' : res ? '정상' : '오류'}
                color={serverStatusLoading ? 'var(--status-yellow)' : res ? "var(--status-green)" : "var(--status-red)"}
                icon={serverStatusLoading ? LoadingIcon : <Check weight="bold" size={22} color={res ? "var(--status-green)" : "var(--status-red)"} />}
            />
        </BoxDivver>
    )
}

const StatisticBoxDiv= styled.div`
    background-color: var(--gray2);
    border: solid 1px var(--gray3);
    border-radius: 8px;
    padding: 12px;
    width: 100%;
`

function StatisticsBox() {
    const { isLoading,  data } = useQuery(['calendar2notion', 'server'], async () => {
        const res = await axios.get(`https://api-calendar2notion.opize.me/v3/admin/statistics`, {
            headers: {
                Authorization: localStorage.getItem('calendar2notion/adminToken') || ''
            }
        })

        return res.data
    })

    return (
        <StatisticBoxDiv>
            { isLoading
                ? <FlexCenter>
                    <CircleNotch>
                        <animateTransform 
                            attributeName="transform"
                            attributeType="XML"
                            type="rotate"
                            dur="5s"
                            from="0 0 0"
                            to="360 0 0"
                            repeatCount="indefinite"
                        />
                    </CircleNotch>
                </FlexCenter>
                : <FlexColumn>
                <H1>통계</H1>
                <Items data={[
                    [
                        {
                            type: 'avatar',
                            icon: <UserCircle />,
                            name: `${data.userCounts.all} 명`,
                            label: '전체 유저수'
                        }, {
                            type: 'text',
                            text: `${data.userCounts.plan.free} 명`,
                            subText: 'Free 플랜'
                        }, {
                            type: 'text',
                            text: `${data.userCounts.plan.pro} 명`,
                            subText: 'pro 플랜'
                        }, {
                            type: 'text',
                            text: `${data.userCounts.plan.proPlus} 명`,
                            subText: 'proPlus 플랜'
                        }, {
                            type: 'text',
                            text: `${data.userCounts.connected.connected} 명`,
                            subText: '연결된 계정'
                        }, {
                            type: 'text',
                            text: `${data.userCounts.connected.notConnected} 명`,
                            subText: '연결되지 않은 계정'
                        },
                    ], [
                        {
                            type: 'avatar',
                            icon: <Aperture />,
                            name: `${data.calendar} 캘린더`,
                            label: '캘린더'
                        }, {
                            type: 'text',
                            text: `${data.event.toLocaleString()} 이벤트`,
                            subText: '전체 이벤트'
                        }, {
                            type: 'text',
                            text: `${data.money.toLocaleString()} 원`,
                            subText: 'DB상 총 수익'
                        }
                    ]
                ]} />
            </FlexColumn> }
        </StatisticBoxDiv>
    )
}

export function DashboardChannel() {
    return (
        <TabDivver>
            <H1>{dayjs().format('MM월 DD일')} 대시보드</H1>
            <StatusBox />
            <StatisticsBox />
        </TabDivver>
    )
}