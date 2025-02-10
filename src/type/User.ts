export type UserRoles = {
  users: {
    [name: string]: {
      role: string
      email: string
    }
  }
}

export type UserRequest = {
  id: string
  email: string
  status: string
}
