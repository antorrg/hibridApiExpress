import { describe, it, expect } from '@jest/globals'
import app from '../server/app.js'
import session from 'supertest-session'

const agent = session(app)

describe('ApiKey REST Routes Integration Tests: "/api/v1/apikey"', () => {
    let createdApiKey = null
    let clientId = null
    let keyId = null

    describe('POST /api/v1/apikey - Register client and generate API key', () => {
        it('should create a client and return the API key with 201 status', async () => {
            const clientPayload = {
                name: 'RouteTestClient',
                url: 'https://routetest.example.com'
            }

            const response = await agent
                .post('/api/v1/apikey')
                .send(clientPayload)
                .expect('Content-Type', /json/)
                .expect(201)

            expect(response.body).toHaveProperty('results')
            expect(response.body.results).toHaveProperty('name', 'RouteTestClient')
            expect(response.body.results).toHaveProperty('apiKey')
            expect(response.body.results.apiKey).toMatch(/^hbx_[a-f0-9]{12}_.+$/)

            createdApiKey = response.body.results.apiKey
        })

        it('should return 400 when attempting to register a client with an existing name', async () => {
            const clientPayload = {
                name: 'RouteTestClient',
                url: 'https://another.example.com'
            }

            const response = await agent
                .post('/api/v1/apikey')
                .send(clientPayload)
                .expect(400)

            expect(response.body.message).toContain('already exists')
        })
    })

    describe('GET /api/v1/apikey - Get paginated list of clients', () => {
        it('should return 200 status and list of clients', async () => {
            const response = await agent
                .get('/api/v1/apikey?page=1&limit=5')
                .expect('Content-Type', /json/)
                .expect(200)

            expect(response.body.results).toHaveProperty('info')
            expect(Array.isArray(response.body.results.data)).toBe(true)

            const targetClient = response.body.results.data.find(c => c.clientName === 'RouteTestClient')
            expect(targetClient).toBeDefined()
            expect(targetClient.keys.length).toBeGreaterThan(0)

            clientId = targetClient.clientId
            keyId = targetClient.keys[0].apiKeyId
        })
    })

    describe('GET /api/v1/apikey/:id - Get client details by ID', () => {
        it('should return 200 status and client details', async () => {
            const response = await agent
                .get(`/api/v1/apikey/${clientId}`)
                .expect(200)

            expect(response.body.results.clientId).toBe(clientId)
            expect(response.body.results.clientName).toBe('RouteTestClient')
        })

        it('should return 404 status if client ID does not exist', async () => {
            const fakeId = '00000000-0000-0000-0000-000000000000'
            await agent
                .get(`/api/v1/apikey/${fakeId}`)
                .expect(404)
        })
    })

    describe('PUT /api/v1/apikey/:id - Update client info', () => {
        it('should update client information and return 200 status', async () => {
            const updatedData = { url: 'https://routetest-updated.example.com' }

            const response = await agent
                .put(`/api/v1/apikey/${clientId}`)
                .send(updatedData)
                .expect(200)

            expect(response.body.results.message).toBe('Cliente actualizado exitosamente')
        })
    })

    describe('PATCH /api/v1/apikey/:id - Enable/disable API key', () => {
        it('should disable an API key and return 200 status', async () => {
            const patchData = { enabled: false }

            const response = await agent
                .patch(`/api/v1/apikey/${keyId}`)
                .send(patchData)
                .expect(200)

            expect(response.body.results.message).toBe('Registro actualizado exitosamente')
        })
    })

    describe('DELETE /api/v1/apikey/:id/apiKey - Delete API key', () => {
        it('should delete the specified API key and return 200 status', async () => {
            const response = await agent
                .delete(`/api/v1/apikey/${keyId}/apiKey`)
                .expect(200)

            expect(response.body.results.message).toBe('Registro borrado exitosamente')
        })
    })

    describe('DELETE /api/v1/apikey/:id - Delete client', () => {
        it('should delete the client record and return 200 status', async () => {
            const response = await agent
                .delete(`/api/v1/apikey/${clientId}`)
                .expect(200)

            expect(response.body.results.message).toBe('Cliente borrado exitosamente')
        })
    })
})
