
import { Suspense, useState } from "react";
import { useQuery, useQueryErrorResetBoundary } from "react-query"
import styled from "styled-components"
import { instance } from "../../utils/axios"
import { ErrorBoundary } from 'react-error-boundary'
import axios from "axios";

const colorMap = {
    green: {
        color: "var(--status-green)",
        backgroundColor: 'var(--status-green-background)'
    },
    red: {
        color: "var(--status-red)",
        backgroundColor: 'var(--status-green-red)'
    },
    yellow: {
        color: "var(--status-yellow)",
        backgroundColor: 'var(--status-green-yellow)'
    },
    blue: {
        color: "var(--status-blue)",
        backgroundColor: 'var(--status-green-blue)'
    },
}

const Badge = styled.div<{color: 'red' | 'yellow' | 'green' | 'blue'}>`
    position: relative;

    background-color: ${props => colorMap[props.color].backgroundColor};
    color: ${props => colorMap[props.color].color};
    padding: 0px 8px;
    border-radius: 12px;
    height: 16px;
    font-size: 12px;
    display: flex;
    align-items: center;
    width: fit-content;

    &::before {
        content: "";
        width: 8px;
        height: 8px;
        background-color: ${props => colorMap[props.color].color};
        border-radius: 8px;
        margin-right: 6px;
    }
`

export function StatusBadge() {
    const { isError, isLoading,  data } = useQuery(['server'], async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/server`, {
            headers: {
                Authorization: localStorage.getItem('token') || ''
            }
        })
        return res.data
    })

    if (isLoading) {
        return (
            <Badge color="yellow">
                Loading
            </Badge>
        )
    }

    if (isError) {
        return (
            <Badge color="red">
                Error
            </Badge>
        )
    }

    const res = data.reduce((acc:boolean, cur:any) => acc && (cur.lastCheckStatus === 'good'), true)

    return (
        <Badge color={res ? 'green' : 'red'}>
            {res ? 'normal' : 'error'}
        </Badge>
    )
}

interface StatusBadgeTagProps {
    color: 'green' | 'yellow' | 'red' | 'blue'
    text: string
}

export function StatusBadgeTag(props: StatusBadgeTagProps) {
    return (
        <Badge color={props.color}>
            {props.text}
        </Badge>
    )
}