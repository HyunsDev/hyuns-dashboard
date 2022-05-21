import styled from 'styled-components'
import LogoFile from '../assets/logo.png'

interface LogoProps {
    isRounded?: boolean,
    size: number
}

const Img = styled.img<LogoProps>`
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    border-radius: ${props => props.isRounded ? props.size : 0}px;
`



export function Logo(props: LogoProps) {
    return (
        <Img src={LogoFile} alt='Hyuns Dashboard Logo' {...props} />
    )
}