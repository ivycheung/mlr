import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React from "react";
import mlrTeamsJson from '../utils/mlrteams.json';
import milrTeamsJson from '../utils/milrteams.json';

interface TeamsDropdownProps { 
  league: string,
  teamOption: string,
  handleChangeTeam: (newTeamOption: string) => void
 }

const TeamsDropdown: React.FC<TeamsDropdownProps> = ({ league, teamOption, handleChangeTeam }) => {

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

  const handleDropdownChange = (e: { target: { value: string; }; }) => {
    const teamOption = e.target.value;
    handleChangeTeam(teamOption);
  }
    
  return (
    <FormControl sx={{ m: 1, minWidth: 240, color: "red" }}>
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
      <FormHelperText>{teamOption ? '' : 'Select Team'}</FormHelperText>
    </FormControl>
  )
}

export default TeamsDropdown;