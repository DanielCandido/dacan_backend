import { Schema, model } from 'mongoose'

const FolderSchema = new Schema({
  name: String,
  userId: String
},
{
  timestamps: true
})

export default model('Folder', FolderSchema)
