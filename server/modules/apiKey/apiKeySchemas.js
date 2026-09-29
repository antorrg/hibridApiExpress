export default {
    create: {
        name: {
            type: 'string',
        },
        url: {
        type: 'string'
    }
    },
    update: {
        aprobada: {
            type: 'boolean'
        }
    },
    query:{
        page: {
            type: 'int',
            default: 1
        },
        limit: {
            type: 'int',
            default: 10
        }
    }

}