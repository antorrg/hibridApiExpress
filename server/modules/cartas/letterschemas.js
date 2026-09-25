export default { 
  createLetter:{
  tema: {
    type: "string",
    sanitize: {
      trim: true
    }
  },
  mensaje: {
    type: "string",
    sanitize: {
      trim: true
    }
  }
},
moderateLetter :{
 aprobada: {
  type: "boolean"
 }
}
};
