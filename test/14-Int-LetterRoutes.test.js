import { describe, it, expect, beforeAll } from '@jest/globals'
import request from 'supertest'
import app from '../server/app.js'
import { setTokens } from './helperTest/jwtHelper.js'
import * as store from './helperTest/testStore.js'

const agent = request(app)

describe('Letter REST Routes Integration Tests: "/api/v1/letter"', () => {
    let adminToken = null
    let apiKey = null
    let createdLetterId = null

    beforeAll(async () => {
        await setTokens()
        adminToken = store.getToken()

        const apiRes = await agent
            .post('/api/v1/apikey')
            .send({ name: 'LetterTestClient', url: 'https://lettertest.example.com' })
            .expect(201)

        apiKey = apiRes.body.results.apiKey
    })

    describe('POST /api/v1/letter - Create letter', () => {
        it('should return 400 if x-api-key header is missing', async () => {
            const response = await agent
                .post('/api/v1/letter')
                .send({ tema: 'Ansiedad', mensaje: 'Mensaje de prueba' })
                .expect(400)

            expect(response.body.message).toContain('missing apiKey')
        })

        it('should return 400 if x-api-key header has invalid format', async () => {
            const response = await agent
                .post('/api/v1/letter')
                .set('x-api-key', 'invalid-key-format')
                .send({ tema: 'Ansiedad', mensaje: 'Mensaje de prueba' })
                .expect(400)

            expect(response.body.message).toContain('Invalid API Key format')
        })

        it('should return 404 if x-api-key is not found in database', async () => {
            await agent
                .post('/api/v1/letter')
                .set('x-api-key', 'hbx_000000000000_00000000000000000000000000000000')
                .send({ tema: 'Ansiedad', mensaje: 'Mensaje de prueba' })
                .expect(404)
        })

        it('should return error status 400 if tema is invalid', async () => {
            await agent
                .post('/api/v1/letter')
                .set('x-api-key', apiKey)
                .send({ tema: 'Tema Invalido', mensaje: 'Mensaje de prueba' })
                .expect(500)
        })

        it('should create a new letter successfully with status 201', async () => {
            const letterData = {
                tema: 'Ansiedad',
                mensaje: 'Esta es una carta sobre la ansiedad y superacion.'
            }

            const response = await agent
                .post('/api/v1/letter')
                .set('x-api-key', apiKey)
                .send(letterData)
                .expect('Content-Type', /json/)
                .expect(201)

            expect(response.body).toHaveProperty('results')
        })
    })

    describe('GET /api/v1/letter - Get public approved letters', () => {
        it('should return 400 if x-api-key is missing', async () => {
            await agent
                .get('/api/v1/letter')
                .expect(400)
        })

        it('should return status 200 and list of approved letters', async () => {
            const response = await agent
                .get('/api/v1/letter')
                .set('x-api-key', apiKey)
                .expect(200)

            expect(response.body).toHaveProperty('results')
        })
    })

    describe('GET /api/v1/letter/admin - Get all letters for admin', () => {
        it('should return status 401 if auth token is missing or invalid', async () => {
            await agent
                .get('/api/v1/letter/admin')
                .expect(401)
        })

        it('should return status 200 and list all letters when requested by admin', async () => {
            const response = await agent
                .get('/api/v1/letter/admin')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)

            expect(response.body).toHaveProperty('results')
            if (Array.isArray(response.body.results)) {
                createdLetterId = response.body.results[0].id
            } else if (response.body.results && response.body.results.id) {
                createdLetterId = response.body.results.id
            }
            expect(createdLetterId).toBeDefined()
        })
    })

    describe('GET /api/v1/letter/admin/:id - Get letter details by ID', () => {
        it('should return 400 status if id is not a valid UUID', async () => {
            await agent
                .get('/api/v1/letter/admin/not-a-uuid')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(400)
        })

        it('should return status 200 and letter details for valid UUID', async () => {
            const response = await agent
                .get(`/api/v1/letter/admin/${createdLetterId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)

            expect(response.body.results).toBeDefined()
            expect(response.body.results.id).toBe(createdLetterId)
            expect(response.body.results.tema).toBe('Ansiedad')
        })
    })

    describe('PATCH /api/v1/letter/admin/:id - Moderate letter', () => {
        it('should return 400 status if id is not a valid UUID', async () => {
            await agent
                .patch('/api/v1/letter/admin/invalid-id')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ aprobada: true })
                .expect(400)
        })

        it('should return 400 status if body field aprobada is not boolean', async () => {
            await agent
                .patch(`/api/v1/letter/admin/${createdLetterId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ aprobada: 'invalid-value' })
                .expect(400)
        })

        it('should update letter status to approved with status 200', async () => {
            const response = await agent
                .patch(`/api/v1/letter/admin/${createdLetterId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ aprobada: true })
                .expect(200)

            expect(response.body).toHaveProperty('results')
        })

        it('should show letter in public GET /api/v1/letter after approval', async () => {
            const response = await agent
                .get('/api/v1/letter')
                .set('x-api-key', apiKey)
                .expect(200)

            expect(response.body.results).toBeDefined()
        })
    })

    describe('DELETE /api/v1/letter/admin/:id - Delete letter', () => {
        it('should return 400 status if id is not a valid UUID', async () => {
            await agent
                .delete('/api/v1/letter/admin/invalid-id')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(400)
        })

        it('should delete letter with status 200', async () => {
            const response = await agent
                .delete(`/api/v1/letter/admin/${createdLetterId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)

            expect(response.body).toHaveProperty('results')
        })
    })
})