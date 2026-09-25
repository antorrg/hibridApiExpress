import { DataTypes } from "sequelize";

export default (sequelize)=>{
      sequelize.define('Letter', {
        id: {
            type: DataTypes.UUID,
             primaryKey: true,
        },
        mensaje: {
            type: DataTypes.TEXT
        },
        tema: {
            type: DataTypes.TEXT
        },
        aprobada: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
      },{
        timestamps: true
    })
}