import { Schema, model } from 'mongoose'
import { FolderInterface } from '../interfaces'

const FolderSchema = new Schema({
  name: String,
  userId: String
},
{
  timestamps: true
})

export default model<FolderInterface>('Folder', FolderSchema)
