import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React from "react";
import { populatePlayersList } from "../utils/utils";
import { FormSchemaPlayers } from "../types/schemas/player-schema";

type PlayersDropdownProps = {
  league: string,
  players: FormSchemaPlayers
  playerType: string,
  teamOption: string;
  playerOption: number, // for callback
  handleChangePlayer: (newPlayerOption: string) => void;
};

const PlayersDropdown: React.FC<PlayersDropdownProps> = ({ league, players, playerType, teamOption, playerOption, handleChangePlayer }) => {
  const validLeagues = ['milr', 'mlr'];
  if (!validLeagues.includes(league)) {
    throw new Error('Invalid league or position type');
  }

  const playerList = populatePlayersList(players, league, playerType, teamOption);

  const handleDropdownChange = (e: { target: { value: string; }; }) => {
    const newPlayerOption = e.target.value;
    handleChangePlayer(newPlayerOption);
  }
    
  return (
    <FormControl sx={{ m: 1, minWidth: 240, color: "blue" }}>
      <InputLabel id="player-input-select-label">Player</InputLabel>
      <Select
        labelId="player-input-select-label"
        id="player-input-select"
        onChange={handleDropdownChange}
        value={playerOption ? playerOption.toString() : ''}
      >
        {
          teamOption && playerList.map((player) => {
            return (
              <MenuItem key={player.playerID} value={(player === undefined || player === null ) ? '' : player.playerID}>
                {player.playerName}
              </MenuItem>
            )
          })
        }
      </Select>
      <FormHelperText>{playerOption ? '' : `Select ${playerType}`}</FormHelperText>
    </FormControl>
  )
}

export default PlayersDropdown;