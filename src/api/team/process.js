// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------
import Player from "../../db/model/player";
import PlayerSkill from "../../db/model/playerSkill";

export default async (req, res) => {
  try {
    const players = await Player.findAll({
      include: [
        {
          model: PlayerSkill,
          as: "playerSkills",
        },
      ],
    });

    const findPlayers = (players, requests) => {
      const results = [];

      requests.forEach((request) => {
        const filteredPlayers = players.filter((player) => {
          return player.position === request.position;
        });

        if (!filteredPlayers.length) {
          return;
        }

        const skillPlayers = filteredPlayers.filter((player) => {
          return player.playerSkills.some((skill) => {
            return skill.skill === request.mainSkill;
          });
        });

        if (skillPlayers.length) {
          const selectedPlayers = skillPlayers.sort((a, b) => {
            const aSkillValue = a.playerSkills.find((skill) => {
              return skill.skill === request.mainSkill;
            }).value;
            const bSkillValue = b.playerSkills.find((skill) => {
              return skill.skill === request.mainSkill;
            }).value;
            return bSkillValue - aSkillValue;
          });

          selectedPlayers
            .slice(0, request.numberOfPlayers)
            .forEach((selectedPlayer) => {
              results.push({
                name: selectedPlayer.name,
                position: selectedPlayer.position,
                skills: selectedPlayer.playerSkills.filter((skill) => {
                  return skill.skill === request.mainSkill;
                }).map((skill) => {
                  return { skill: skill.skill, value: skill.value };
                }),
              });
            });
        } else {
          const selectedPlayers = filteredPlayers.sort((a, b) => {
            const aSkillValue = Math.max(
              ...a.playerSkills.map((skill) => skill.value)
            );
            const bSkillValue = Math.max(
              ...b.playerSkills.map((skill) => skill.value)
            );
            return bSkillValue - aSkillValue;
          });

          selectedPlayers
            .slice(0, request.numberOfPlayers)
            .forEach((selectedPlayer) => {
              results.push({
                name: selectedPlayer.name,
                position: selectedPlayer.position,
                skills: selectedPlayer.playerSkills.map((skill) => {
                  return { skill: skill.skill, value: skill.value };
                }),
              });
            });
        }
      });
      return results;
    };

    let bestPlayers = findPlayers(players, req.body);

    res.status(200).send(bestPlayers);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};
