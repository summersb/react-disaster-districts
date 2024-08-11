import React, { createContext, useState } from 'react'

export type UserType = {
  name?: string | null
  photoURL?: string | null
}

export interface UserContextType {
  user: UserType
  setUser: (user: UserType) => void
}

const DEFAULT = {} as UserContextType;

const AuthContext = createContext<UserContextType>(DEFAULT)

type AuthProviderType = {
  children: React.ReactElement
}
export const AuthProvider = ({
  children,
}: AuthProviderType): React.ReactElement => {
  const [user, setUser] = useState<UserType>({})

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
