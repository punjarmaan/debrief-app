export interface UserProfile {
    id: string,
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    phone_extension: string,
    phone_number: string
}

export interface EventProfile {
    _id: string,
    title: string,
    user: UserProfile | string,
    locked: boolean
}


