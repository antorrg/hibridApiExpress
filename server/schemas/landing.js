import { DataTypes } from'sequelize';

export default (sequelize) => {
    sequelize.define("Landing", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
        picture: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          title: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          info_header:{
            type: DataTypes.STRING,
            allowNull: false,
          },
          description: {
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
        paranoid: true,
        timestamps: true 
    });
};