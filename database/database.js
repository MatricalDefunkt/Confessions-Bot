const { Model, Sequelize, DataTypes } = require( "sequelize" );

const sequelize = new Sequelize( "database", "user", "pass", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  typeValidation: true,
  storage: "ConfessionsBot.sqlite",
} );

class Confessions extends Model { };

Confessions.init( {
  msgID: { type: DataTypes.STRING( 18 ), primaryKey: true },
  usrID: DataTypes.STRING( 18 )
}, {
  sequelize,
  modelName: "confessions"
} )

class BlockLogs extends Model { };

BlockLogs.init( {
  usrID: { type: DataTypes.STRING( 18 ) },
  action: DataTypes.STRING( 255 ),
  modID: DataTypes.STRING( 18 )
}, {
  sequelize,
  modelName: "blockLogs"
} )

BlockLogs.sync().catch( e => console.log )
Confessions.sync().catch( e => console.log )

module.exports = { Confessions, BlockLogs }