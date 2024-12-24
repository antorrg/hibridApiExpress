import GenericMidd from '../../Classes/GenericMiddleware.js'


const landingMidd = new GenericMidd(['title', 'description', 'info_header', 'picture'])

export default {
    createLand : landingMidd.validateFields(),
    updateLand : landingMidd.validateFields(['title', 'description', 'info_header', 'picture', 'enable']),
    validId : landingMidd.validateINT('id'),
}