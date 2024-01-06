import { createContext, useState, } from 'react';

// Create the context
export const UserContext = createContext();

// eslint-disable-next-line react/prop-types
export function UserContextProvider({children}){
const [userInfo, setUserInfo] = useState(null);


  return (
    <UserContext.Provider value={{userInfo, setUserInfo}}>
      {children}
    </UserContext.Provider>
  )
}
