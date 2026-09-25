import express from 'express'
import { Validator } from 'req-valid-express'
import { Letter } from '../../database.js'
import { LetterService } from './LetterService.js'
import { LetterController } from './LetterController.js'
import { verifyToken, checkRole} from '../../utils/authConfig.js'
import { apiMiddleware } from '../apiKey/apiKey.routes.js'
import sch from './letterschemas.js'
import { UuidHandler } from '../../utils/UuidHandler.js'

const letterService = new LetterService(Letter)
const cont = new LetterController(letterService)

const letterRouter = express.Router()

letterRouter.post(
    '/',
    apiMiddleware.verifyApiKey,
    Validator.validateBody(sch.createLetter),
    cont.create
)

letterRouter.get(
    '/',
    apiMiddleware.verifyApiKey,
    cont.getAll
)

letterRouter.get(
    '/admin',
    verifyToken,
    checkRole([3,9]),
    cont.getAllAdmin
)

letterRouter.get(
    '/admin/:id',
    verifyToken,
    checkRole([3,9]),
    Validator.paramId('id', UuidHandler.uuidRegex),
    cont.getById
)

letterRouter.patch(
    '/admin/:id',
   verifyToken,
    checkRole([3,9]),
    Validator.paramId('id', UuidHandler.uuidRegex),
    Validator.validateBody(sch.moderateLetter),
    cont.moderateLetter
)

letterRouter.delete(
    '/admin/:id',
    verifyToken,
    checkRole([3,9]),
    Validator.paramId('id', UuidHandler.uuidRegex),
    cont.delete
)


export default letterRouter