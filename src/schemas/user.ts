import { Schema, model } from 'mongoose'
import { UserInterface } from '../interfaces'

const UserSchema = new Schema({
  email: String,
  firstname: String,
  lastname: String,
  password: String
},
{
  timestamps: true
})

export default model<UserInterface>('User', UserSchema)
