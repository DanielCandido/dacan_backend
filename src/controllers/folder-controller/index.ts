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

      const folders = await Folder.findOne({ name: folder.name, userId: token.bucket })

      if (folders == null) {
        const folderDB = await Folder.create(folder)
        return res.status(200).json({ message: 'Pasta criada com sucesso ', data: folderDB })
      } else {
        return res.status(401).json({ message: 'Pasta ja existe' })
      }
    } catch (e) {
      return res.status(500).send(e)
    }
  }
}

export default new FolderController()
