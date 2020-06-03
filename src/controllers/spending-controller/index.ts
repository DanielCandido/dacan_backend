import { Request, Response } from 'express'
import Spending from '../../schemas/spending'
import { SpendingInterface, TokenInterface } from '../../interfaces'
import jwtHelper from '../../util/jwt-helper'

class SpendingController {
  public async createSpending (req: Request, res: Response): Promise<Response> {
    try {
      const spending = req.body as SpendingInterface
      const token = jwtHelper.decode(req.headers.authorization) as TokenInterface

      if (jwtHelper.valid(token.expire)) {
        const spendingdb = await Spending.create(spending)

        return res.status(200).json({ message: 'Gasto cadastrado com sucesso', data: spendingdb })
      } else {
        return res.status(401).json({ message: 'Sessão expirada' })
      }
    } catch (e) {
      return res.status(500).json({ message: 'algo deu errado' })
    }
  }
}

export default new SpendingController()
