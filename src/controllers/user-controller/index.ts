import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { Storage } from '@google-cloud/storage'
import User from '../../schemas/user'
import jwtHelper from '../../util/jwt-helper'
import { UserInterface } from '../../interfaces'
const privateKey = process.env.PRIVATE_KEY

const storage = new Storage({
  keyFilename: privateKey,
  projectId: 'workers-storage-258100'
})
const saltRounds = 12
const prefixname = 'cm_'

class UserController {
  public async createUser (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.body
      user.password = await bcrypt.hash(user.password, saltRounds)

      User.countDocuments({ email: user.email }, async (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Algo deu errado' })
        } else {
          if (result > 0) {
            return res.status(401).json({ message: 'Ja existe uma conta com este email' })
          } else {
            const userDb = await User.create(user)
            const bucket = await storage.createBucket(prefixname + userDb._id)

            return res.status(200).json({ message: 'Cadastro realizado', objeto: userDb, bucket: bucket[0].metadata })
          }
        }
      })
    } catch (e) {
      return res.status(500).json({ message: 'Algo deu errado', erro: e })
    }
  }

  public async getUserByEmail (req: Request, res: Response): Promise<Response> {
    try {
      const user = User.findOne().where('email').equals(req.body.email)
      user.select('email firstname lastname _id')

      user.exec((err, user) => {
        if (err) return res.status(500).json({ message: 'Algo deu errado' })
        return res.status(200).json({ message: 'Usuário Encontrado', data: user })
      })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Algo deu errado', erro: e })
    }
  }

  public async login (req: Request, res: Response): Promise<Response> {
    try {
      const user = User.findOne({ email: req.body.email })
      user.exec(async (err, us: UserInterface) => {
        if (err) {
          return res.status(401).json({ message: 'Usuário Invalido' })
        } else if (us != null) {
          const match = await bcrypt.compare(req.body.password, us.password)
          if (!match) {
            return res.status(401).json({ message: 'Senha incorreta' })
          } else {
            const payload = {
              UN: us.email,
              bucket: us._id
            }
            const token = jwtHelper.sign(payload)
            return res.status(200).json({ message: 'Login efetuado com sucesso', token: token })
          }
        } else {
          return res.status(401).json({ message: 'Usuário Invalido' })
        }
      })
    } catch (e) {
      return res.status(500).json({ message: 'Algo deu errado' })
    }
  }

  public async loginFacebook (req: Request, res: Response): Promise<Response> {
    try {
      req.body.password = await bcrypt.hash(req.body.password, saltRounds)
      await User.countDocuments({ email: req.body.email }, async (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Algo deu errado' })
        } else {
          if (result > 0) {
            const userDB = await User.findOne({ email: req.body.email })

            const payload = {
              UN: userDB.email,
              bucket: userDB._id
            }

            const token = jwtHelper.sign(payload)
            return res.status(200).json({ message: 'Login efetuado com sucesso', token: token })
          } else {
            const userDb = await User.create(req.body)
            await storage.createBucket(prefixname + userDb._id)

            const payload = {
              UN: userDb.email,
              bucket: userDb._id
            }

            const token = jwtHelper.sign(payload)
            return res.status(200).json({ message: 'Login efetuado com sucesso', token: token })
          }
        }
      })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Algo deu errado' })
    }
  }
}

export default new UserController()
