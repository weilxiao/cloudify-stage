/**
 * Created by Jakub on 18/04/2017.
 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('AdminSettings', {
    name: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    table: { type: DataTypes.JSON }
  });
};
