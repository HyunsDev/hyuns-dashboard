import ModalContextProvider from "./modalContext";
import ChannelContextProvider from "./serverContext";
import TopLoadingContextProvider from "./topLoadingBarContext";
import UserContextProvider from "./userContext";

function ContextWrapper({children}: {children: React.ReactElement}) {
    return (
        <>
            <UserContextProvider>
                <TopLoadingContextProvider>
                    <ModalContextProvider>
                        <ChannelContextProvider>
                            {children}
                        </ChannelContextProvider>
                    </ModalContextProvider>
                </TopLoadingContextProvider>
            </UserContextProvider>
        </>
    )
}

export {ContextWrapper}