import { Request, Response } from 'express'
// import fs from 'fs'
import { folderExists } from '../../util/storageHelper'
import { Storage } from '@google-cloud/storage'
import jwtHelper from '../../util/jwt-helper'
const storage = new Storage({
  keyFilename: './private-key.json',
  projectId: 'workers-storage-258100'
})

const prefixBucket = 'cm_'
let token: Token

class FileController {
  public async index (req: Request, res: Response): Promise<Response> {
    try {
      token = jwtHelper.decode(req.headers.authorization) as Token
      // const allbuckets = []
      const buckets = await storage.bucket(prefixBucket.concat(token.bucket)).getFiles()
      const folders = []
      buckets[0].forEach(e => {
        const folder = { name: e.name, id: e.id }
        folders.push(folder)
      })
      console.log(buckets)
      res.status(200).json(folders)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Algo deu errado' })
    }
  }

  public async upload (req: Request, res: Response): Promise<Response> {
    try {
      const token = jwtHelper.decode(req.headers.authorization)
      console.log(token)
      const file = req.file.originalname

      return res.status(200).send(file)
    } catch (e) {
      return res.status(500).send(e)
    }
  }

  public async createFolder (req: Request, res: Response): Promise<Response> {
    try {
      const name = req.body.name + '_' + req.body.user
      const exist = await folderExists(name)

      if (exist !== undefined) {
        return res.status(401).json({ message: 'Pasta ja existe' })
      } else {
        const bucket = await storage.createBucket(name)
        console.log(`bucket ${bucket} created`)
        return res.status(200).json({ message: 'Pasta criada com sucesso', bucket: bucket[0] })
      }
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Algo deu errado' })
    }
  }
}

export interface Token{
  email: string,
  bucket: string
}

export default new FileController()
