import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React from "react";
import { FormSchemaPitches } from "../types/schemas/pitches-schema";
import { SxProps, Theme, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

type SessionsDropdownProps = {
  seasonOption: number;
  sessionOption: number,
  plateAppearances: FormSchemaPitches
  handleChangeSession: (seasonOption: number) => void;
  sx?: SxProps<Theme>;
};

const SessionsDropdown: React.FC<SessionsDropdownProps> = ({ seasonOption, sessionOption, plateAppearances, handleChangeSession, sx }) => {
  const handleDropdownChange = (e: { target: { value: string; }; }) => {
    const sessionOption = e.target.value;

    if (Number.isNaN(sessionOption)) {
      throw new Error('Invalid season.');
    }

    handleChangeSession(Number(sessionOption));
  }

  const seasons = new Set<number>();
  if (plateAppearances) {
    for (let i = 0; i < plateAppearances.length; i++) {
      seasons.add(plateAppearances[i].season)
    }
  }

  const numberOfSessions = new Set<number>();
  plateAppearances?.map((e) => {
    if (e.season == seasonOption) {
      numberOfSessions.add(e.session);
    }
  })
  const sessions = [...numberOfSessions].sort((a, b) => { return a - b });
  const latestSession = Number([...numberOfSessions].slice(-1));
  
  React.useEffect(() => {
    // Set default session to first of the game of the season
    if (sessionOption == 0) {
      handleChangeSession(latestSession);
    }
  }, [handleChangeSession, latestSession, sessionOption]);

  const theme = useTheme();
  const notDesktop = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <FormControl sx={{ m: 1, minWidth: { xs: 150, lg: 220 }, ...sx }}>
      {notDesktop ?
        <InputLabel id="session-input-select-label" shrink>Session</InputLabel> :
        <InputLabel id="session-input-select-label">Session</InputLabel>
      }
      <Select
        labelId="session-input-select-label"
        id="session-input-select"
        // label={sessionOption}
        onChange={handleDropdownChange}
        value={sessionOption ? sessionOption.toString() : ''}
      >
        {
          sessions.map((session) => {
            return (
              <MenuItem key={session} value={(session === undefined || session === null || sessions.length === 0) ? '' : session}>
                {session}
              </MenuItem>
            )
          })
        }
      </Select>
    </FormControl>
  )
}

export default SessionsDropdown;