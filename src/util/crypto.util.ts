import { createHash } from 'crypto'

export class CryptoUtil {
  public static toSHA1(data: string) {
    const hash = createHash('sha1')
    hash.update(data)
    const result = hash.digest('hex')
    return result
  }
}
