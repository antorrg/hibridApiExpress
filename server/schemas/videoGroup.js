import { DataTypes } from'sequelize';

export default (sequelize) => {
    sequelize.define("VideoGroup", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
        title: { type: DataTypes.STRING, allowNull: false },
        productId: { type: DataTypes.INTEGER, allowNull: false },
        enable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
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
        timestamps: false
    },);
};