import { DataTypes } from "sequelize";

export default (sequelize)=>{
    sequelize.define('User', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
        email: { type: DataTypes.STRING, allowNull: false },
        password: {type:DataTypes.STRING, allowNull: false},
        nickname:{type: DataTypes.STRING, allowNull: true},
        name: { type: DataTypes.STRING, allowNull: true },
        surname: { type: DataTypes.STRING, allowNull: true },
        picture: { type: DataTypes.STRING, allowNull: false},
        role:{type: DataTypes.SMALLINT, allowNull: false,defaultValue: 1,
          validate: {
            isIn: [[9, 1, 2, 3]], // Por ejemplo, 9: admin, 1: user, 2: moderator
          },
                },
        country: {
            type: DataTypes.STRING,
            allowNull: true
        },
        enable: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        deletedAt:{
          type: DataTypes.DATE,
          allowNull: true,
      },
    },{
        defaultScope : {
            where: {deletedAt : null}
        },  
        scopes: {
            enabledOnly: {
                where: {
                    enable: true
                }
            },
            allRecords: {} // No aplica ningún filtro
        },
        paranoid: true,
        timestamps: true 
    })
}