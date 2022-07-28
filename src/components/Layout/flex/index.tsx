import styled from "styled-components";


export const FlexRow = styled.div<{gap?: number}>`
    display: flex;
    align-items: center;
    gap: ${props => props.gap || 8}px;
`

export const FlexColumn = styled.div<{gap?: number}>`
    display: flex;
    flex-direction: column;
    gap: ${props => props.gap || 8}px;
`