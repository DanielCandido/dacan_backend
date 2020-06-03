import { Document } from 'mongoose'

export interface FolderInterface extends Document{
    name: string,
    userId: string
}
