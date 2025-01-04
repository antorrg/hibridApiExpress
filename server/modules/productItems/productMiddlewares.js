import {GenericMidd, ProductMidd} from '../../Classes/GenericMiddleware.js'


const productMidd = new ProductMidd(['title', 'logo', 'landing', 'info_header', 'info_body', 'url'], ['text', 'img'])

const productUpdateMidd = new GenericMidd(['title', 'logo', 'landing', 'info_header', 'info_body', 'url', 'enable'])

const itemMidd = new GenericMidd(['id','text', 'img'])

export default {
    createProd : productMidd.validateFieldsWithItems(['title', 'logo', 'landing', 'info_header', 'info_body', 'url'], ['img', 'text']),
    updateProd : productUpdateMidd.validateFields(['title', 'logo', 'landing', 'info_header', 'info_body', 'url', 'enable']),
    createItem: productMidd.validateFields(),
    updateItem : itemMidd.validateFields(['id', 'text', 'img', 'enable']),
    validId : productMidd.validateINT('id'),
}