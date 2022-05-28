import styled from "styled-components"
import { MagnifyingGlass } from 'phosphor-react'

const Divver = styled.div`
    background-color: var(--gray2);
    border-radius: 100px;
    display: flex;
    align-items: center;
    padding: 4px 12px;
    gap: 12px;
    border: solid 1px var(--gray3);
    outline: solid 0px var(--blue3);
    box-sizing: border-box;
    width: 250px;
    transition: 100ms;

    &:focus-within {
        border: solid 1px var(--gray3);
        outline: solid 3px var(--blue3);
    }
`

const Input = styled.input`
    border: 0;
    background-color: transparent;
    width: 100%;

    &:focus {
        outline: none;
    }

`

interface SearchBoxProps {
    value: string,
    onChange: Function
    placeHolder?: string
}

export function SearchBox(props:SearchBoxProps) {
    return (
        <Divver>
            <MagnifyingGlass />
            <Input value={props.value} onChange={e => props.onChange(e.target.value)} placeholder={props.placeHolder || '검색'} />
        </Divver>
    )
}