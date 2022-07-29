import { useContext } from "react";
import { FilePlus, Keyhole, MagnifyingGlass, X } from 'phosphor-react'

import { TabDivver, H1 } from "../../../../components/Tab";
import { ModalContext } from "../../../../context/modalContext";

import { Items } from "../../../../components";
import { RegisterTokenModal } from "./modal/RegisterTokenModal";

export function IndexTab() {
    const modal = useContext(ModalContext)
    
    return (
        <TabDivver>
            <H1>도구</H1>

            <Items data={[
                [
                    {
                        type: 'avatar',
                        icon: <Keyhole />,
                        name: 'Admin Token 등록',
                        label: 'Calendar2notion API'
                    }, {
                        type: 'buttons',
                        button: [
                            [
                                {
                                    label: '토큰 등록',
                                    icon: <Keyhole />,
                                    onClick: () => modal.open(<RegisterTokenModal close={modal.close} />)
                                }, {
                                    label: '삭제',
                                    icon: <X />,
                                    onClick: () => {},
                                    color: 'red'
                                }
                            ]
                        ]
                        
                    }
                ]
            ]} />
        </TabDivver>
    )
}