import { Schema, model } from 'mongoose'
import { SpendingInterface } from '../interfaces'

const SpendingSchema = new Schema({
  value: Number,
  name: String,
  description: String,
  category: String
},
{
  timestamps: true
})

export default model<SpendingInterface>('Spending', SpendingSchema)
