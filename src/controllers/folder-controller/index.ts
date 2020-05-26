import { Request, Response } from 'express'
import Folder from '../../schemas/folders'
import jwtHelper from '../../util/jwt-helper'

class FolderController {
  public async createFolder (req: Request, res: Response): Promise<Response> {
    try {
      const folder = req.body
      const token = jwtHelper.decode(req.headers.authorization)

      const folders = await Folder.findOne().where('name', 'userId').equals(folder.name, token.bucket)

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
