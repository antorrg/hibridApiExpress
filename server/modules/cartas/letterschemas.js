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
},
publicQuery:{
  page:{
    type: 'int',
    default: 1
  },
  limit:{
    type: 'int',
    default: 10
  }
},
adminQuery:{
  page:{
    type: 'int',
    default: 1
  },
  aprobada:{
    type: 'boolean',
    default: true
  },
  limit:{
    type: 'int',
    default: 10
  },
  tema:{
    type:'string',
    default: ""
  }
},
TEMAS_DISPONIBLES : [
  "Para quien lo necesite",
  "Ansiedad",
  "Duelo",
  "Soledad",
  "Empezar de nuevo",
  "Gratitud"
]
};
