
const addFields = (req, res, next)=>{
    req.body.uniqueField = 'title'
    next()
}

export {
    addFields,
}