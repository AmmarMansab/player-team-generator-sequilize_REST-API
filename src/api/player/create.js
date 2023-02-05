// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

import Player from "../../db/model/player";
import PlayerSkill from "../../db/model/playerSkill";

export default async (req, res) => {
  try {
    const { name, position, playerSkills } = req.body;
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
    const player = await Player.create({ name, position });
    const playerSkillsWithPlayerId = playerSkills.map((skill) => ({
      ...skill,
      PlayerId: player.id,
    }));
    const createdSkills = await PlayerSkill.bulkCreate(
      playerSkillsWithPlayerId
    );
    const result = {
      id: player.id,
      name: player.name,
      position: player.position,
      playerSkills: createdSkills,
    };
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
