import { Document } from 'mongoose'

export interface UserInterface extends Document{
    email: string,
    firstname: string,
    lastname: string,
    password: string,
    _id: string
}
