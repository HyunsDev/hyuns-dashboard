import React, { createContext, useCallback, useState } from "react";
import { Modal } from "../components/Modal/modal";

interface ModalContextProps {
    isOpen: boolean
    open: (content: React.ReactElement) => void
    close: Function
    width: number
}

export const ModalContext = createContext<ModalContextProps>({
    isOpen: false,
    open: () => null,
    close: () => null,
    width: 350
})

const ModalContextProvider = ({children}: {children: React.ReactElement}) => {
    const [ isOpen, setOpen ] = useState(false)
    const [ content, setContent ] = useState(<></>)
    const [ width, setWidth ] = useState(350)

    const open = useCallback((content: React.ReactElement, width?:number) => {
        setOpen(true)
        setWidth(width || 350)
        setContent(content)
    }, [])

    const close = useCallback((content: React.ReactElement) => {
        setOpen(false)
    }, [])

    return (
        <ModalContext.Provider
            value={{
                isOpen,
                open,
                close,
                width
            }}
        >
            <Modal setOpen={setOpen} isOpen={isOpen} content={content} width={width} />
            {children}
        </ModalContext.Provider>
    )
}

export default ModalContextProvider;
