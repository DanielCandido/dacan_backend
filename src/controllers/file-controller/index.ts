import { Request, Response } from 'express'
// import fs from 'fs'
import { folderExists } from '../../util/storageHelper'
import { Storage } from '@google-cloud/storage'
import jwtHelper from '../../util/jwt-helper'

// InterfaceToken
import { TokenInterface } from '../../interfaces'

const storage = new Storage({
  keyFilename: './private-key.json',
  projectId: 'workers-storage-258100'
})

const prefixBucket = 'cm_'
let token: TokenInterface

class FileController {
  public async index (req: Request, res: Response): Promise<Response> {
    try {
      token = jwtHelper.decode(req.headers.authorization) as TokenInterface
      const tokenValid = jwtHelper.valid(token.exp)
      if (tokenValid) {
        const buckets = await storage.bucket(prefixBucket.concat(token.bucket)).getFiles()
        const folders = []
        buckets[0].forEach(e => {
          const folder = { name: e.name, id: e.id }
          folders.push(folder)
        })
        res.status(200).json(folders)
      } else {
        res.status(401).json({ message: 'sessão expirada' })
      }
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Algo deu errado' })
    }
  }

  public async upload (req: Request, res: Response): Promise<Response> {
    try {
      const token = jwtHelper.decode(req.headers.authorization) as TokenInterface
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
        return res.status(200).json({ message: 'Pasta criada com sucesso', bucket: bucket[0] })
      }
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Algo deu errado' })
    }
  }
}

export default new FileController()
