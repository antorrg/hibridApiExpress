import { DataTypes } from "sequelize";

export default (sequelize)=>{
      sequelize.define('ApiKey', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        keyId: {
            type: DataTypes.STRING,
            unique:true,
            allowNull:false
        },
        keyHash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
      },{
        timestamps: true
    })
}
