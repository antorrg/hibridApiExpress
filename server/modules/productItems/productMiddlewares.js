
export default {
    createProd : [{
        name: 'title', 
        type: 'string'
    },{
        name: 'logo', 
        type: 'string'
    }, {
        name: 'landing',
    },{
        name: 'info_header', 
        type: 'string'
    },{
        name: 'info_body', 
        type: 'string'
    },{
        name: 'url', 
        type: 'string'}],

    secondField :[{
        name: 'img', 
        type: 'string'
    },{
        name: 'text', 
        type: 'string'
    }],
    updateProd : [{
        name: 'title', 
        type: 'string'
    },{
        name: 'logo', 
        type: 'string'
    }, {
        name: 'landing', 
        type: 'string'
    },{
        name: 'info_header', 
        type: 'string'
    },{
        name: 'info_body', 
        type: 'string'
    },{
        name: 'url', 
        type: 'string'
    },{
        name: 'enable', 
        type: 'boolean'  
    }],

    createItem: [{
        name: 'id', 
        type: 'int'
    },{
        name: 'text', 
        type: 'string'
    },{
        name: 'img', 
        type: 'string'
    }],
    updateItem :[{
        name: 'id', 
        type: 'int'
    },{
        name: 'text', 
        type: 'string'
    },{
        name: 'img', 
        type: 'string'
    },{
        name: 'enable', 
        type: 'boolean'
    }],
}