import styled from "styled-components";


const Divver = styled.div`
    width: 220px;
    height: 100%;
    background-color: var(--gray2);
    border-left: solid 1px var(--gray4);
    border-top-left-radius: 12px;
    border-right: solid 1px var(--gray4);
`

interface SidebarProps {

}

export function Sidebar(props: SidebarProps) {

    return (
        <Divver>

        </Divver>
    );
}
