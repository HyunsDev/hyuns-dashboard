import styled from "styled-components"



interface TextFieldProps {
    type: 'text' | 'password' | 'search' | 'url'
    value: string
    onChange: Function
    placeholder?: string
    readonly?: boolean
    label?: string
}

const Divver = styled.div`

`

const Input = styled.input<TextFieldProps>`
    display: block;
    width: 100%;
    border: solid 2px var(--gray3);
    border-radius: 4px;
    padding: 6px 12px;
    transition: 200ms;

    &:focus {
        border: solid 2px var(--blue4);
        outline: 0;
    }
`

const Label = styled.label`
    display: block;
    font-size: 12px;
    color: var(--gray5);
    margin-bottom: 4px;
`

export function TextField(props:TextFieldProps) {
    return (
        <Divver>
            {props.label && <Label>{props.label}</Label>}
            <Input {...props} onChange={(e) => props.onChange(e.target.value)} />
        </Divver>
    )
}