import styled from "styled-components";

const ServerInfoDivver = styled.div`
    padding: 12px 12px;
    transition: 100ms;
    cursor: pointer;
    height: 60px;
    min-height: 60px;

    &:hover {
        background-color: var(--gray2-hover);
    }
`

const ServerInfoTitle = styled.div`
    font-size: 16px;
    font-weight: 700;
    line-height: 120%;
    user-select: none;
`

const ServerInfoSubTitle = styled.div`
    font-size: 12px;
    color: var(--gray5);
    user-select: none;
`

interface ServerInfoProps {
    title: string;
    subTitle: string
}

export function ServerInfo(props: ServerInfoProps) {
    return (
        <ServerInfoDivver>
            <ServerInfoTitle>{props.title}</ServerInfoTitle>
            <ServerInfoSubTitle>{props.subTitle}</ServerInfoSubTitle>
        </ServerInfoDivver>
    )
}