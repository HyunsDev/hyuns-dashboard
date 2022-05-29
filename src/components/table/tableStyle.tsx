import styled from "styled-components"

const Divver = styled.div`
    display: block;
    overflow: auto;
`

const TableStyle = styled.table`
    width: 100%;
    border-collapse: collapse;
    box-sizing: border-box;
    font-size: 14px;

    th {
        text-align: left;
        
    }

    td {
        box-sizing: border-box;

        img {
            width: 28px;
            display: block;
        }
    } 

    th, td {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 4px 8px;
        border-bottom: 1px solid var(--gray4);
        
        div {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
`

interface TableProps {
    children: React.ReactElement[]
}

export function Table(props: TableProps) {
    return (
        <Divver>
            <TableStyle>
                {props.children}
            </TableStyle>
        </Divver>
    )
}