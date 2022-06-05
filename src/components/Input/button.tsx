import styled from "styled-components"

interface ButtonProps {
    type: 'button' | 'submit'
    label: string;
    onClick?: Function;
    disabled?: boolean;
    color?: 'gray' | 'blue' | 'black'
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
        },
        'black': {
            color: 'var(--gray1)',
            backgroundColor: 'var(--gray7)',
            backgroundColorHover: 'var(--gray7)'
        },
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
    /* margin-bottom: 16px; */

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
            <Input {...props} type={props.type} value={props.label} onClick={() => props.onClick && props.onClick()} />
        </Divver>
    )
}

Button.defaultProps = {
    type: 'button'
}