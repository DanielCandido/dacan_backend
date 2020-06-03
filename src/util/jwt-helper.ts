import jwt from 'jsonwebtoken'
import fs from 'fs'
import strings from './strings'
import { TokenInterface, PayloadInterface } from '../interfaces'

class JWTHelper {
  public sign (payload: PayloadInterface) : string {
    const privateKey = fs.readFileSync(strings.keyMainPath + 'private.key', 'utf8')

    return jwt.sign(payload, privateKey, {
      expiresIn: '1m'
    })
  }

  public decode (payload: unknown): TokenInterface {
    const token = jwt.decode(payload.toString())
    return token as TokenInterface
  }

  public valid (exp: number) : boolean {
    if (Date.now() >= exp * 1000) { return false } else { return true }
  }
}

export default new JWTHelper()
