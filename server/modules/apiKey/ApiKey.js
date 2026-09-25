import {     
    createHash,
    randomBytes,
    timingSafeEqual
} from 'node:crypto'
import { UuidHandler } from '../../utils/UuidHandler.js'

export class ApiKey {

    static createApiKey(clientId){
        const keyId = randomBytes(6).toString('hex')
        const secret = randomBytes(32).toString('base64url')

        const keyHash = createHash('sha256')
            .update(secret)
            .digest('hex')

        const apiKey = `hbx_${keyId}_${secret}`
        return{
            toClient: apiKey,
            toPersistence: {
                id: UuidHandler.createUuid(),
                clientId: clientId,
                keyId: keyId,
                keyHash: keyHash
            }
        }
    }
    static parse(apiKey) {
        if (typeof apiKey !== 'string') {
            return null
        }

        const match = apiKey.match(/^hbx_([a-f0-9]{12})_(.+)$/)

        if (!match) {
            return null
        }

        const [, keyId, secret] = match

        return { keyId, secret }
    }
    
    static verify(secret, storedHash) {
        if (
            typeof secret !== 'string' ||
            typeof storedHash !== 'string'
        ) {
            return false
        }

        const incomingHash = createHash('sha256')
            .update(secret)
            .digest()

        const expectedHash = Buffer.from(storedHash, 'hex')//eslint-disable-line

        if (incomingHash.length !== expectedHash.length) {
            return false
        }

        return timingSafeEqual(incomingHash, expectedHash)
    }
}

