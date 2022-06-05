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

    tr {
        border-left: 1px solid var(--gray3);
        border-right: 1px solid var(--gray3);
        border-bottom: 1px solid var(--gray3);
        padding: 0px 16px;

        &:first-child {
            border-top: 1px solid var(--gray3);
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }

        &:last-child {
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }
    }

    td {
        box-sizing: border-box;
        height: 80px;

        img {
            width: 36px;
            height: 36px;
            display: block;
        }
    } 

    th, td {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 4px 8px;
        
        div {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
`

interface TableProps {
    children: React.ReactElement[],
    className?: string
}

export function MessageTable(props: TableProps) {
    return (
        <Divver>
            <TableStyle className={props.className}>
                {props.children}
            </TableStyle>
        </Divver>
    )
}