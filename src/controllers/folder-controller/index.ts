import { Request, Response } from 'express'
import Folder from '../../schemas/folders'
import jwtHelper from '../../util/jwt-helper'
import { TokenInterface, FolderInterface } from '../../interfaces'

let token: TokenInterface

class FolderController {
  public async createFolder (req: Request, res: Response): Promise<Response> {
    try {
      const folder = req.body as FolderInterface
      token = jwtHelper.decode(req.headers.authorization) as TokenInterface
      const tokenValid = jwtHelper.valid(token.exp)

      const folderRegistration = { name: folder.name, userId: token.bucket }

      if (tokenValid) {
        const folders = await Folder.findOne({ name: folder.name, userId: token.bucket })

        if (folders == null) {
          const folderDB = await Folder.create(folderRegistration)
          return res.status(200).json({ message: 'Pasta criada com sucesso ', data: folderDB })
        } else {
          return res.status(401).json({ message: 'Pasta ja existe' })
        }
      } else {
        return res.status(401).json({ message: 'Sessão expirada' })
      }
    } catch (e) {
      return res.status(500).send(e)
    }
  }

  public async getFolders (req: Request, res: Response): Promise<Response> {
    try {
      token = jwtHelper.decode(req.headers.authorization) as TokenInterface
      const tokenValid = jwtHelper.valid(token.exp)

      if (tokenValid) {
        const folders = await Folder.find({ userId: token.bucket })

        return res.status(200).json(folders)
      } else {
        return res.status(401).json({ message: 'Sessão expirada' })
      }
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Algo deu errado' })
    }
  }

  public async deleteFolder (req: Request, res: Response): Promise<Response> {
    try {
      token = jwtHelper.decode(req.headers.authorization) as TokenInterface
      const tokenValid = jwtHelper.valid(token.exp)
      if (tokenValid) {
        const folder = await Folder.deleteOne({ _id: req.body._id })
        return res.status(200).json({ message: 'Pasta excluida com sucesso', data: folder })
      } else {
        return res.status(401).json({ message: 'Sessão expirada' })
      }
    } catch (e) {
      return res.status(500).json({ message: 'Algo deu errado' })
    }
  }
}

export default new FolderController()
