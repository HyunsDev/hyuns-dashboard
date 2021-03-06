import { DotsThreeVertical, IconContext } from "phosphor-react"
import styled from "styled-components"
import { ActionMenu } from "../actionMenu"
import { StatusBadgeTag } from "../Badge/statusBadge"

const ItemButton = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 120ms;
    opacity: 0;
`

const ItemButtons = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;

    @media ( max-width: 767px ) {
        position: absolute;
        top: 16px;
        right: 16px;
    }
`

const ItemDiv = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-right: solid 1px var(--gray4);
    border-left: solid 1px var(--gray4);
    border-top: solid 1px var(--gray4);

    @media ( max-width: 767px ) {
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        padding: 16px;
        gap: 8px;
    }


    &:first-child {
        border-top: none;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }

    &:last-child {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
`

const ItemsDiv = styled.div`
    margin-top: 8px;
    border-top: solid 1px var(--gray4);
    border-bottom: solid 1px var(--gray4);
    border-radius: 8px;

    ${ItemDiv}:hover ${ItemButton} {
        opacity: 1;
    }
`

const AvatarDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    width: 200px;
`

const AvatarIcon = styled.img`
    border-radius: 999px;
    background-color: var(--gray4);

    width: 36px;
    height: 36px;
`

const AvatarName = styled.div`
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
`

const AvatarLabel = styled.div`
    font-size: 12px;
    color: var(--gray5);
`

const StateDiv = styled.div`
    width: 120px;
    display: flex;
    flex-direction: column;
    gap: 2px;

    @media ( max-width: 767px ) {
        margin-top: 4px;
        width: 100%;
        flex-direction: row;
        gap: 4px;
    }
`

const TypeDiv = styled.div`
    color: var(--gray5);
    font-size: 12px;
    margin-left: 8px;
`

const TextsDiv = styled.div`
    flex: 1;
`

const TextDiv = styled.div`
    font-weight: 500;
    font-size: 14px;
`

const SubTextDiv = styled.div`
    color: var(--gray6);  
    font-size: 12px;  
`

interface Avatar {
    type: 'avatar'
    icon: string | React.ReactElement
    name: string
    label: string
}

interface Status {
    type: 'status'
    status: 'stateless' | 'error' | 'warning' | 'done' | 'good'
    label?: string
}

interface Text {
    type?: 'text'
    text?: string
    subText?: string
}

interface Buttons {
    type: 'buttons'
    button: {
        label: string
        onClick: Function
        icon: React.ReactElement,
        color?: 'normal' | 'red'
    }[][]
}

type Item = (Avatar | Status | Text | Buttons)[]

interface Props {
    data: Item[]
}

const colorMap:((text: string) => 'red' | 'yellow' | 'green' | 'blue' | 'gray') = (text:string) => {
    const map:any= {
        stateless: 'gray',
        error: 'red',
        warning: 'yellow',
        done: 'blue',
        good: 'green'
    }
    return map[text] || 'gray'
}

function capitalize(str:string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

const A = styled.a`
    text-decoration: none;
    color: var(--gray6);

    &:hover {
        text-decoration: underline;
    }
`


export function Items(props: Props) {
    return (
        <ItemsDiv>
            <IconContext.Provider
                value={{
                    size: 20,
                    weight: 'bold',
                    color: 'var(--gray5)'
                }}    
            >
            {
                props.data.map((item, i) => (
                    <ItemDiv key={i}>
                        {
                            item.map((menu, ii) => {
                                if (menu.type === 'avatar') {
                                    return (
                                        <AvatarDiv key={ii}>
                                            <>
                                                {
                                                    typeof menu.icon === 'string' 
                                                    ? <AvatarIcon src={menu.icon} alt="" />
                                                    : menu.icon
                                                }
                                            </>
                                            <div>
                                                <AvatarName>{menu.name}</AvatarName>
                                                <AvatarLabel>{menu.label}</AvatarLabel>
                                            </div>
                                        </AvatarDiv>
                                    )
                                } else if (menu.type === 'buttons') {
                                    return (
                                        <ItemButtons key={ii}>
                                            <ActionMenu icon={<DotsThreeVertical />} actions={menu.button} />
                                        </ItemButtons>
                                        
                                    )
                                } else if (menu.type === 'status') {
                                    return (
                                        <StateDiv key={ii}>
                                            <StatusBadgeTag color={colorMap(menu.status.toLowerCase())} text={capitalize(menu.status)} />
                                            {menu.label && <TypeDiv>{menu.label}</TypeDiv>}
                                        </StateDiv>
                                    )
                                } else {
                                    return (
                                        <TextsDiv key={ii}>
                                            {menu.text && (menu.text.startsWith('https')
                                                ? <TextDiv><A href={menu.text} target={'_blank'} rel="noreferrer">{`${menu.text.substring(0, 50)}${menu.text.length > 50 ? '...' : ''}`}</A></TextDiv>
                                                : <TextDiv>{`${menu.text.substring(0, 50)}${menu.text.length > 50 ? '...' : ''}`}</TextDiv>)}
                                            {menu.subText && <SubTextDiv>{`${menu.subText.substring(0, 50)}${menu.subText.length > 50 ? '...'  : ''}`}</SubTextDiv>}
                                        </TextsDiv>
                                    )
                                }

                            })
                        }
                    </ItemDiv>
                ))
            }
            </IconContext.Provider>
        </ItemsDiv>
    )
}

export type ItemsType = Item[]
export type ItemType = Item