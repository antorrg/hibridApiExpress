import {GenericMidd, ProductMidd} from '../../Classes/GenericMiddleware.js'


const productMidd = new ProductMidd(['title', 'logo', 'landing', 'info_header', 'info_body', 'url'], ['id', 'text', 'img'])

const itemMidd = new GenericMidd(['id', 'text', 'img'])

export default {
    createProd : productMidd.validateFieldsWithItems(),
    updateProd : productMidd.validateFields(['title', 'logo', 'landing', 'info_header', 'info_body', 'url', 'enable']),
    createItem: productMidd.validateFields(),
    updateItem : itemMidd.validateFields(['id', 'text', 'img', 'enable']),
    validId : productMidd.validateINT('id'),
}