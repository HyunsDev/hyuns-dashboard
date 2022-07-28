import { useQuery } from "react-query"
import styled from "styled-components"
import axios from "axios";

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

const Badge = styled.div<{color: 'red' | 'yellow' | 'green' | 'blue' | 'gray', size: 'small' | 'normal'}>`
    position: relative;

    ${props => props.size === 'small' && `background-color: ${colorMap[props.color].backgroundColor};`}
    color: ${props => props.size === 'normal' ? '#555761' :colorMap[props.color].color};
    padding: ${props => props.size === 'normal' ? '4px 8px' : '0px 8px'};
    border-radius: 12px;
    height: 16px;
    font-size: ${props => props.size === 'normal' ? '14px' : '12px'};
    display: flex;
    align-items: center;
    width: fit-content;
    font-weight: ${props => props.size === 'normal' ? '700' : '400'};

    &::before {
        content: "";
        width: ${props => props.size === 'normal' ? '12px' : '8px'};
        height: ${props => props.size === 'normal' ? '12px' : '8px'};
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
            <Badge color="yellow" size="small">
                Loading
            </Badge>
        )
    }

    if (isError) {
        return (
            <Badge color="red" size="small">
                Error
            </Badge>
        )
    }

    const res = data.reduce((acc:boolean, cur:any) => acc && (cur.lastCheckStatus === 'good'), true)

    return (
        <Badge color={res ? 'green' : 'red'} size="small">
            {res ? 'normal' : 'error'}
        </Badge>
    )
}

interface StatusBadgeTagProps {
    color: 'green' | 'yellow' | 'red' | 'blue' | 'gray'
    text: string
    size?: 'small' | 'normal'
}

export function StatusBadgeTag({
    color,
    text,
    size = 'normal'
}: StatusBadgeTagProps) {
    return (
        <Badge color={color} size={size}>
            {text}
        </Badge>
    )
}