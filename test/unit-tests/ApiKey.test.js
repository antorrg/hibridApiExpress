import { ApiKey } from "../../server/modules/apiKey/ApiKey.js";
import { UuidHandler } from '../../server/utils/UuidHandler.js'
import { describe, it, expect } from '@jest/globals'

describe('ApiKey static class', () => {
  describe('ApiKey.createApiKey method', () => {
    it('should create a valid api-key', () => {
      const clientId = UuidHandler.createUuid()

      const result = ApiKey.createApiKey(clientId)

      // La key entregada al cliente debe ser un string
      expect(result.toClient).toEqual(expect.any(String))

      // Debe tener el formato hbx_keyId_secret
      const [prefix, keyId, secret] = result.toClient.split('_')

      expect(prefix).toBe('hbx')
      expect(keyId).toEqual(expect.any(String))
      expect(secret).toEqual(expect.any(String))

      // El keyId público debe ser el mismo que guardamos
      expect(keyId).toBe(result.toPersistence.keyId)

      // Datos destinados a persistencia
      expect(result.toPersistence).toEqual({
        id: expect.any(String),
        clientId,
        keyId: expect.any(String),
        keyHash: expect.any(String),
      })

      // Nunca debemos persistir el secreto
      expect(result.toPersistence).not.toHaveProperty('secret')

      // Ni la API key completa
      expect(result.toPersistence).not.toHaveProperty('toClient')
    })
    it('should create different api-keys for the same client', () => {
        const clientId = UuidHandler.createUuid()

        const first = ApiKey.createApiKey(clientId)
        const second = ApiKey.createApiKey(clientId)

        expect(first.toClient).not.toBe(second.toClient)

        expect(first.toPersistence.keyId)
            .not.toBe(second.toPersistence.keyId)

        expect(first.toPersistence.keyHash)
            .not.toBe(second.toPersistence.keyHash)

        expect(first.toPersistence.clientId)
            .toBe(second.toPersistence.clientId)
        })
  })
  describe('ApiKey.parse method', () => {
    it('should parse a valid api-key', () => {
      const clientId = UuidHandler.createUuid()
      const created = ApiKey.createApiKey(clientId)

      const parsed = ApiKey.parse(created.toClient)
      expect(parsed).toEqual({
        keyId: created.toPersistence.keyId,
        secret: expect.any(String),
      })
    })

    it('should return null when prefix is invalid', () => {
      const invalidKey = 'invalid_123456_secret'

      const parsed = ApiKey.parse(invalidKey)

      expect(parsed).toBeNull()
    })

    it('should return null when api-key format is invalid', () => {
      const invalidKey = 'hbx_onlyTwoParts'

      const parsed = ApiKey.parse(invalidKey)

      expect(parsed).toBeNull()
    })
  })

  describe('ApiKey.verify method', () => {
    it('should return true for a valid secret', () => {
      const clientId = UuidHandler.createUuid()
      const created = ApiKey.createApiKey(clientId)

      const parsed = ApiKey.parse(created.toClient)

      const result = ApiKey.verify(
        parsed.secret,
        created.toPersistence.keyHash
      )

      expect(result).toBe(true)
    })

    it('should return false for an invalid secret', () => {
      const clientId = UuidHandler.createUuid()
      const created = ApiKey.createApiKey(clientId)

      const result = ApiKey.verify(
        'this-is-not-the-secret',
        created.toPersistence.keyHash
      )

      expect(result).toBe(false)
    })
  })
  
  
})
