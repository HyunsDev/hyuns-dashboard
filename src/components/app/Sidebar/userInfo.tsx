import styled from "styled-components";
import { Gear } from 'phosphor-react'
import { ToolTip } from "../../Tooltip/tooltip";

interface UserInfoProps {
    title: string;
    subTitle: string;
    img: string;
}

const Divver = styled.div`
    padding: 12px 12px;
    transition: 100ms;
    height: 50px;
    min-height: 50px;
    border-top: solid 1px var(--gray4);
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const Img = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 16px;
`

const Title = styled.div`
    font-size: 14px;
    font-weight: 700;
    line-height: 100%;
`

const SubTitle = styled.div`
    font-size: 12px;
    color: var(--gray5);
`

const UserInfoDivver = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`

const ImgDivver = styled.div`

`

const UserNameDivver = styled.div`

`

const SettingDivver = styled.div`
    padding: 4px;
    border-radius: 4px;
    cursor: pointer;
    transition: 100ms;
    width: 28px;
    height: 28px;

    background-color: var(--gray1);
    &:hover {
        background-color: var(--gray3);
    }
`

export function UserInfo(props: UserInfoProps) {
    return (
        <Divver>
            <UserInfoDivver>
                <ImgDivver>
                    <Img src={props.img} alt='프로필 이미지' />
                </ImgDivver>
                <UserNameDivver>
                    <Title>{props.title}</Title>
                    <SubTitle>{props.subTitle}</SubTitle>
                </UserNameDivver>
            </UserInfoDivver>
            
            <ToolTip text="설정" direction="top">
                <SettingDivver>
                    <Gear color="var(--gray5)" weight="fill" size={20} />
                </SettingDivver>
            </ToolTip>
            
        </Divver>
    )
}