import jwt from 'jsonwebtoken'
import fs from 'fs'
import strings from './strings'

class JWTHelper {
  sign (payload: any) {
    const privateKey = fs.readFileSync(strings.keyMainPath + 'private.key', 'utf8')

    return jwt.sign(payload, privateKey)
  }

  decode (payload: any) {
    return jwt.decode(payload)
  }
}

export default new JWTHelper()
