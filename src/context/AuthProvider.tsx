import React, { createContext, useState } from 'react'

export type UserType = {
  name?: string | null
  photoURL?: string | null
}

export interface UserContextType {
  user: UserType
  setUser: (user: UserType) => void
}

const AuthContext = createContext<UserContextType>({})

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
