// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

import Player from "../../db/model/player";
import PlayerSkill from "../../db/model/playerSkill";

export default async (req, res) => {
  const { id } = req.params;
  const { name, position, playerSkills } = req.body;
  try {
    // Find the player by id
    const player = await Player.findByPk(id);
    // If player is not found, return error message
    if (!player) {
      return { message: `Player with id ${id} not found.` };
    }
    // validate the incoming data
    const availablePositions = ["defender", "midfielder", "forward"];
    const availableSkills = [
      "defense",
      "attack",
      "speed",
      "strength",
      "stamina",
    ];
    if (!name || !position) {
      return res
        .status(400)
        .json({ message: "Missing required fields: name and position" });
    }
    if (!availablePositions.includes(position)) {
      return res
        .status(400)
        .json({ message: `Invalid value for position: ${position}` });
    }
    if (!playerSkills || !playerSkills.length) {
      return res
        .status(400)
        .json({ message: "Missing required field: playerSkills" });
    }
    for (let i = 0; i < playerSkills.length; i++) {
      const { skill, value } = playerSkills[i];
      if (!skill || !value) {
        return res
          .status(400)
          .json({ message: "Missing required fields: skill and value" });
      }
      if (!availableSkills.includes(skill)) {
        return res
          .status(400)
          .json({ message: `Invalid value for skill: ${skill}` });
      }
    }
    // Update the player data
    await player.update(req.body);
    // If new player skills are provided, update them
    if (playerSkills) {
      // Delete existing player skills
      await PlayerSkill.destroy({ where: { PlayerId: id } });
      // Create new player skills
      for (let i = 0; i < req.body.playerSkills.length; i++) {
        const skill = req.body.playerSkills[i];
        await PlayerSkill.create({ ...skill, PlayerId: id });
      }
    }
    // Return the updated player
    const updatedPlayer = await Player.findByPk(id, {
      include: [{ model: PlayerSkill, as: "playerSkills" }],
    });
    return res.status(200).send(updatedPlayer);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};
