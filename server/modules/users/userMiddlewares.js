

export default {
    password:/^(?=.*[A-Z]).{8,}$/ ,
    email:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    createUser: [{
        name: 'email', 
        type: 'string'
    }],
    loginUser : [{
            name: 'email', 
            type: 'string'
        },{
            name: 'password', 
            type: 'string'
    }],
    validatePassword: [{
        name: 'id', 
        type: 'string'
    },{
        name: 'password', 
        type: 'string'
}],
    upgradeUser: [{
        name: 'role', 
        type: 'string'
    },{
        name: 'enable', 
        type: 'boolean'
}],
    updateUser : [{
        name: 'email', 
        type: 'string'
    },{
        name: 'name', 
        type: 'string'
    },{
        name: 'surname', 
        type: 'string'
    },{
        name: 'picture', 
        type: 'string'
    },{
        name: 'country', 
        type: 'string'
}],
}