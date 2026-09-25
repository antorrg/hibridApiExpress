import { ApiKeyService } from '../server/modules/apiKey/ApiKeyService.js'
import { describe, it, expect } from '@jest/globals'
import { Client, ApiKey } from '../server/database.js'

const service = new ApiKeyService(Client, ApiKey)

describe('ApiKeyService Integration Unit Tests', () => {
   // let createdClientData = null
    let generatedApiKey = null
    let clientId = null
    let apiKeyRecordId = null

    describe('register method', () => {
        it('should register a new client and generate an API key', async () => {
            const clientInput = {
                name: 'ServiceTestClient',
                url: 'https://servicetest.example.com'
            }

            const response = await service.register(clientInput)

            expect(response).toHaveProperty('name', 'ServiceTestClient')
            expect(response).toHaveProperty('apiKey')
            expect(typeof response.apiKey).toBe('string')
            expect(response.apiKey).toMatch(/^hbx_[a-f0-9]{12}_.+$/)

            generatedApiKey = response.apiKey
        })

        it('should throw an error when registering a client with a duplicate name', async () => {
            const duplicateInput = {
                name: 'ServiceTestClient',
                url: 'https://duplicate.example.com'
            }

            await expect(service.register(duplicateInput)).rejects.toMatchObject({
                status: 400
            })
        })
    })

    describe('getAllClients method', () => {
        it('should retrieve a paginated list of clients including their keys', async () => {
            const response = await service.getAllClients({ page: 1, limit: 10 })

            expect(response).toHaveProperty('message')
            expect(response).toHaveProperty('info')
            expect(response.info.currentPage).toBe(1)
            expect(Array.isArray(response.data)).toBe(true)
            expect(response.data.length).toBeGreaterThan(0)

            const foundClient = response.data.find(c => c.clientName === 'ServiceTestClient')
            expect(foundClient).toBeDefined()
            expect(foundClient.keys.length).toBeGreaterThan(0)

            clientId = foundClient.clientId
            apiKeyRecordId = foundClient.keys[0].apiKeyId
        })
    })

    describe('getClientById method', () => {
        it('should retrieve client details by ID', async () => {
            const response = await service.getClientById(clientId)

            expect(response.clientId).toBe(clientId)
            expect(response.clientName).toBe('ServiceTestClient')
            expect(Array.isArray(response.keys)).toBe(true)
        })

        it('should throw 404 when client ID is not found', async () => {
            const fakeId = '00000000-0000-0000-0000-000000000000'
            await expect(service.getClientById(fakeId)).rejects.toMatchObject({
                status: 404
            })
        })
    })

    describe('apiKeyVerify method', () => {
        it('should successfully verify a valid API key', async () => {
            const result = await service.apiKeyVerify(generatedApiKey)

            expect(result.clientId).toBe(clientId)
            expect(result.clientName).toBe('ServiceTestClient')
            expect(result.clientUrl).toBe('https://servicetest.example.com')
        })

        it('should throw 400 for an invalid key format', async () => {
            await expect(service.apiKeyVerify('invalid-key-format')).rejects.toMatchObject({
                status: 400
            })
        })

        it('should throw 404 for a non-existent keyId', async () => {
            const fakeKey = 'hbx_000000000000_fakeSecretString'
            await expect(service.apiKeyVerify(fakeKey)).rejects.toMatchObject({
                status: 404
            })
        })

        it('should throw 401 for a key with mismatched secret', async () => {
            const match = generatedApiKey.match(/^hbx_([a-f0-9]{12})_(.+)$/)
            const keyId = match[1]
            const tamperedKey = `hbx_${keyId}_wrongSecretSignature`

            await expect(service.apiKeyVerify(tamperedKey)).rejects.toMatchObject({
                status: 401
            })
        })
    })

    describe('clientUpdate method', () => {
        it('should update client information', async () => {
            const updateResult = await service.clientUpdate(clientId, {
                url: 'https://updated.servicetest.com'
            })

            expect(updateResult.message).toBe('Cliente actualizado exitosamente')

            const client = await service.getClientById(clientId)
            expect(client.clientUrl).toBe('https://updated.servicetest.com')
        })
    })

    describe('apiKeyEnabledDisabled method', () => {
        it('should disable an API key and block verification', async () => {
            const disableResult = await service.apiKeyEnabledDisabled(apiKeyRecordId, { enabled: false })
            expect(disableResult.message).toBe('Registro actualizado exitosamente')

            await expect(service.apiKeyVerify(generatedApiKey)).rejects.toMatchObject({
                status: 401
            })
        })

        it('should re-enable an API key and allow verification', async () => {
            await service.apiKeyEnabledDisabled(apiKeyRecordId, { enabled: true })

            const result = await service.apiKeyVerify(generatedApiKey)
            expect(result.clientId).toBe(clientId)
        })
    })

    describe('apiKeyDelete and clientDelete methods', () => {
        it('should delete an API key by ID', async () => {
            const deleteKeyRes = await service.apiKeyDelete(apiKeyRecordId)
            expect(deleteKeyRes.message).toBe('Registro borrado exitosamente')

            await expect(service.apiKeyVerify(generatedApiKey)).rejects.toMatchObject({
                status: 404
            })
        })

        it('should delete a client by ID', async () => {
            const deleteClientRes = await service.clientDelete(clientId)
            expect(deleteClientRes.message).toBe('Cliente borrado exitosamente')

            await expect(service.getClientById(clientId)).rejects.toMatchObject({
                status: 404
            })
        })
    })
})
