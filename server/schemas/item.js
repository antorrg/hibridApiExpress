import { DataTypes } from'sequelize';

export default (sequelize) => {
    sequelize.define("Item", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
        img: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          text: {
            type: DataTypes.TEXT,
            allowNull: false,
          },
        enable:{
          type: DataTypes.BOOLEAN,
           defaultValue:true
        },
        deletedAt:{
            type: DataTypes.DATE,
            allowNull: true,
         }
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
            timestamps: false
    });
};
