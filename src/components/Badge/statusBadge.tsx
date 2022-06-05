
import { Suspense, useState } from "react";
import { useQuery, useQueryErrorResetBoundary } from "react-query"
import styled from "styled-components"
import { instance } from "../../utils/axios"
import { ErrorBoundary } from 'react-error-boundary'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const colorMap = {
    green: {
        color: "var(--status-green)",
        backgroundColor: 'var(--status-green-background)'
    },
    red: {
        color: "var(--status-red)",
        backgroundColor: 'var(--status-red-background)'
    },
    yellow: {
        color: "var(--status-yellow)",
        backgroundColor: 'var(--status-yellow-background)'
    },
    blue: {
        color: "var(--status-blue)",
        backgroundColor: 'var(--status-yellow-background)'
    },
    gray: {
        color: "var(--gray5)",
        backgroundColor: 'var(--gray4)'
    },
}

const Badge = styled.div<{color: 'red' | 'yellow' | 'green' | 'blue' | 'gray', hideBackground?: boolean}>`
    position: relative;

    ${props => !props.hideBackground && `background-color: ${colorMap[props.color].backgroundColor};` }
    color: ${props => colorMap[props.color].color};
    padding: ${props => props.hideBackground ? '0px 0px' : '0px 8px'};
    border-radius: 12px;
    height: 16px;
    font-size: ${props => props.hideBackground ? '14px' : '12px'};
    display: flex;
    align-items: center;
    width: fit-content;
    font-weight: ${props => props.hideBackground ? '700' : '400'};

    &::before {
        content: "";
        width: ${props => props.hideBackground ? '12px' : '8px'};
        height: ${props => props.hideBackground ? '12px' : '8px'};
        background-color: ${props => colorMap[props.color].color};
        border-radius: 8px;
        margin-right: 6px;
        margin-top: 2px;
    }
`

export function StatusBadge() {
    const navigate = useNavigate()

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
    color: 'green' | 'yellow' | 'red' | 'blue' | 'gray'
    text: string
    hideBackground?: boolean
}

export function StatusBadgeTag(props: StatusBadgeTagProps) {
    return (
        <Badge color={props.color} hideBackground={props.hideBackground}>
            {props.text}
        </Badge>
    )
}