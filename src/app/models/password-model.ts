export interface Password {
    id?: string,
    password: string,
    salt?: string,
    userId?: number
}