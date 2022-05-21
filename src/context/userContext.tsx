import React, { createContext, useState } from "react";

interface UserContextProps {
    userInfo: {}
    setUserInfo: Function
}

export const UserContext = createContext<UserContextProps>({
    userInfo: {},
    setUserInfo: () => {}
})

const UserContextProvider = ({children}: {children: React.ReactElement}) => {
    const [userInfo, setUserInfo] = useState({})

    return (
        <UserContext.Provider
            value={{
                userInfo,
                setUserInfo
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;
