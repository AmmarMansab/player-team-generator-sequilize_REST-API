// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

import Player from "../../db/model/player";

export default async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ message: "Missing authorization header" });
    }
    const [bearer, token] = authHeader.split(" ");
    if (
      bearer !== "Bearer" ||
      token !==
        "SkFabTZibXE1aE14ckpQUUxHc2dnQ2RzdlFRTTM2NFE2cGI4d3RQNjZmdEFITmdBQkE="
    ) {
      return res.status(401).send({ message: "Invalid token" });
    }
    const player = await Player.findByPk(req.params.id);
    if (!player) {
      return res.status(404).send({ message: "Player not found" });
    }
    await player.destroy();
    return res.send({ message: "Player deleted" });
  } catch (error) {
    return res.status(500).send({ message: "Error deleting player" });
  }
};
