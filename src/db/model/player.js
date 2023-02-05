// ---------------------------------------------------------------------------------------------
// YOU CAN MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// YOU SHOULD NOT CHANGE THE EXPORTED VALUE OF THIS FILE
// ---------------------------------------------------------------------------------------------

import Sequelize from "sequelize";
import database from "../index";
import PlayerSkill from "./playerSkill";

const Player = database.define(
  "player",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING(200),
    },
    position: {
      type: Sequelize.STRING(200),
    },
  },
  {
    timestamps: false,
  }
);
// Player.associate = (models) => {
//     models.Player.hasMany(models.PlayerSkill, {
//         as: 'playerSkill',
//         foreignKey: 'PlayerId'
//     });
// }
Player.hasMany(PlayerSkill, {
  as: "playerSkills",
  foreignKey: "PlayerId",
});

export default Player;
