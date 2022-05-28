import styled from "styled-components"

interface ButtonProps {
    type: 'button' | 'submit'
    label: string;
    onClick: Function;
    disabled?: boolean;
    color?: 'gray' | 'blue'
}

const Divver = styled.div`

`

const color = (name?: ButtonProps['color']) => {
    const list = {
        'gray': {
            color: 'var(--gray6)',
            backgroundColor: 'var(--gray5)',
            backgroundColorHover: 'var(--gray5)'
        },
        'blue': {
            color: 'var(--blue5)',
            backgroundColor: 'var(--blue2)',
            backgroundColorHover: 'var(--blue2-hover)'
        }
    }
    return list[name || 'gray']
}

const Input = styled.input<ButtonProps>`
    display: block;
    width: fit-content;
    border: 0;
    border-radius: 4px;
    padding: 6px 12px;
    transition: 200ms;
    cursor: pointer;

    color: ${props => color(props.color).color};
    background-color: ${props => color(props.color).backgroundColor};

    &:hover {
        background-color: ${props => color(props.color).backgroundColorHover};
    }

    &:focus {
        outline: 0;
    }
`

export function Button(props:ButtonProps) {
    return (
        <Divver>
            <Input {...props} type={"button"} value={props.label} onClick={() => props.onClick()} />
        </Divver>
    )
}