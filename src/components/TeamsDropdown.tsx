import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React from "react";
import mlrTeamsJson from '../utils/mlrteams.json';
import milrTeamsJson from '../utils/milrteams.json';
import { SxProps, Theme } from "@mui/material/styles";

type TeamsDropdownProps = {
  league: string;
  teamOption: string;
  handleChangeTeam: (newTeamOption: string) => void
  sx?: SxProps<Theme>;
}

const TeamsDropdown: React.FC<TeamsDropdownProps> = ({ league, teamOption, handleChangeTeam, sx }) => {
  const validLeagues = ['milr', 'mlr'];
  if (!validLeagues.includes(league)) {
    throw new Error('Invalid league or position type');
  }

  let teams: { teamID: string, teamName: string }[] = [];

  if (league == 'mlr') {
    teams = mlrTeamsJson;
  }
  else if (league == 'milr') {
    teams = milrTeamsJson;
  }

  if (teams && teams.length > 0) {
    teams.sort((a, b) => a.teamName.localeCompare(b.teamName));
  }

  const handleDropdownChange = (e: { target: { value: string } }) => {
    const teamOption = e.target.value;
    handleChangeTeam(teamOption);
  }

  return (
    <FormControl sx={{ m: 1, minWidth: { xs: 150, sm: 200, lg: 240 }, ml: { lg: 0 }, ...sx }}>
      <InputLabel id="team-input-select-label">Team</InputLabel>
      <Select
        labelId="team-input-select-label"
        id="team-input-select"
        label={teamOption}
        onChange={handleDropdownChange}
        value={teamOption}
      >
        {
          teams.map((team) => {
            return (
              <MenuItem key={team.teamID} value={team.teamID}>
                {team.teamName}
              </MenuItem>
            )
          })
        }
      </Select>
    </FormControl>
  )
}

export default TeamsDropdown;