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
    user: string,
    locked: boolean
}

export interface EventInfo {
    title: string
}

export interface BoxProfile {
    title: string,
    user: string,
    images: string[],
    is_private: boolean
}