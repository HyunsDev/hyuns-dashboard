import React, { createContext, useState } from "react";
import LoadingBar from 'react-top-loading-bar'

interface UserContextProps {
    progress: number
    setProgress: Function
}

export const TopLoadingContext = createContext<UserContextProps>({
    progress: 0,
    setProgress: () => {}
})

const TopLoadingContextProvider = ({children}: {children: React.ReactElement}) => {
    const [progress, setProgress] = useState(0)

    return (
        <TopLoadingContext.Provider
            value={{
                progress,
                setProgress
            }}
        >
            <LoadingBar color="var(--blue5)" progress={progress} onLoaderFinished={() => setProgress(0)} />
            {children}
        </TopLoadingContext.Provider>
    )
}

export default TopLoadingContextProvider;
