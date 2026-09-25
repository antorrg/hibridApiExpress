import { DataTypes } from "sequelize";

export default (sequelize)=>{
      sequelize.define('Client', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
             allowNull:false
        },
        url: {
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
