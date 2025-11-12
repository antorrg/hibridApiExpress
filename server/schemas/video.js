import { DataTypes } from'sequelize';

export default (sequelize) => {
    sequelize.define("Video", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
        videoGroupId: { type: DataTypes.INTEGER, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        youTubeId: { type: DataTypes.STRING, allowNull: false },
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