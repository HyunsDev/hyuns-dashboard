import styled from "styled-components"


const Divver = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`

interface CenterLayoutProps {
    children: React.ReactElement
}

export function CenterLayout(props: CenterLayoutProps) {
    return (
        <Divver>
            {props.children}
        </Divver>
    )
}