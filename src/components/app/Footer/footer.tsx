import styled from "styled-components"
import { StatusBadge } from "../../Badge/statusBadge"

const Divver = styled.div`
    height: 22px;
    min-height: 22px;
    min-width: 100vw;
    padding: 0px 4px;
    background-color: var(--gray2);
    border-top: solid 1px var(--gray4);

    display: flex;
    align-items: center;
`

interface FooterProps {
    
}

export function Footer(props: FooterProps) {


    return (
        <Divver>
            <StatusBadge />
        </Divver>
    )
}