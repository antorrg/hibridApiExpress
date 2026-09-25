export const responder = (res, status, message= null, results = null,) =>{
return res.status(status).json({ message, results})
}
