import { Document } from 'mongoose'

export interface SpendingInterface extends Document{
    value: number,
    name: string,
    description: string,
    category: string
}
