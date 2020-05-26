import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
  email: String,
  firstname: String,
  lastname: String,
  password: String
},
{
  timestamps: true
})

export default model('User', UserSchema)
