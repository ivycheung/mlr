import { FormSchemaPitch } from "../types/schemas/pitch-schema";
import { FormSchemaPlayers } from "../types/schemas/player-schema";

export function calculateDiff(pitch: FormSchemaPitch) {
  const difference = pitch.swing - pitch.pitch;
  return difference < 0 ? 1000 + difference : difference
}

export function calculatePitchCircleDelta(pitches: Array<FormSchemaPitch>, index: number, deco: boolean = false) {
  let previousPitch = pitches[index - 1];
  const currentPitch = pitches[index];
  if (previousPitch == undefined || previousPitch == null || currentPitch.pitch == null) {
    return ''
  }
  else if (previousPitch.pitch == null) {
    previousPitch = pitches[index - 2];
  }

  let delta = currentPitch.pitch - (previousPitch?.pitch ?? 0)
  if (delta > 500) {
    delta -= 1000
  } else if (delta < -500) {
    delta += 1000
  }

  let finalString = delta.toString();

  if (deco) {
    finalString = `(${delta})`
  }

  return finalString
}

export function calculateSwingCircleDelta(pitches: Array<FormSchemaPitch>, index: number, deco: boolean = false) {
  let previousPitch = pitches[index - 1];
  const currentPitch = pitches[index];
  if (previousPitch == undefined || previousPitch == null || currentPitch.swing == null) {
    return ''
  }
  else if (previousPitch.swing == null) {
    previousPitch = pitches[index - 2];
  }

  let delta = currentPitch.swing - (previousPitch?.swing ?? 0)
  if (delta > 500) {
    delta -= 1000
  } else if (delta < -500) {
    delta += 1000
  }

  let finalString = delta.toString();

  if (deco) {
    finalString = `(${delta})`
  }

  return finalString
}

export function getNextPitch(pitches: Array<FormSchemaPitch>, index: number) {
  return (pitches[index + 1] != undefined ? pitches[index + 1].pitch : '-');
}

export function getDelta(pitches: Array<FormSchemaPitch>, index: number) {
  const currentPitch = (pitches[index] != undefined ? pitches[index].pitch : null);
  const previousPitch = (pitches[index - 1] != undefined ? pitches[index - 1].pitch : null);

  if (currentPitch == undefined || currentPitch == null || previousPitch == undefined || previousPitch == null) {
    return '-';
  }
  else {
    return Math.abs(previousPitch - currentPitch);
  }
}

export function getResultCategory(pitch: FormSchemaPitch) {
  let result: string = '';
  const outcome = pitch.exactResult;

  // if (!outcome) {
  //   return null;
  // }

  switch (outcome) {
    case 'BB':
    case '1B':
    case 'IF1B':
      result = 'BB/1B'
      break;
    case 'IBB':
      result = ''
      break;
    case '2B':
    case '3B':
      result = 'XBH'
      break;
    case 'HR':
      result = 'HR'
      break;
    case 'STEAL':
    case 'STEAL 2B':
    case 'STEAL 3B':
    case 'Steal':
    case 'Steal 2B':
    case 'Steal 3B':
    case 'Steal 2b':
    case 'Steal 3b':
      result = 'STEAL'
      break;
    case 'RGO':
    case 'LGO':
    case 'FO':
    case 'PO':
    case 'Bunt DP':
    case 'DP':
    case 'K':
    case 'CS 2B':
    case 'CS 1B':
    case 'CS 3B':
    case 'Sac Fly':
    case 'CMS Home':
    case 'CS Home':
      result = 'OUT'
      break;
    case 'Bunt Sac':
      result = 'BUNT SAC'
      break;
    default:
      result = ''
      break;
  }

  return result;
}

export function populatePlayersList(players: FormSchemaPlayers, league: string, getPositionType: string, teamOption: string) {
  const validLeagues = ['milr', 'mlr'];
  const validPositionTypes = ['pitching', 'batting'];
  if (!validLeagues.includes(league) || !validPositionTypes.includes(getPositionType)) {
    throw new Error('Invalid league or position type');
  }

  if (teamOption == null) {
    throw new Error('Invalid team option.');
  }

  const playerList = [];

  for (let i = 0; i < players.length; i++) {
    if (league == 'milr') {
      if (players[i].milr_team === teamOption) {
        playerList.push(players[i]);
      }
    }
    else if (league == 'mlr') {
      if (getPositionType == 'pitching') {
        if (players[i].priPos == 'P' && players[i].Team === teamOption)
          playerList.push(players[i])
      }

      else if (getPositionType == 'batting') {
        if (players[i].priPos != 'P' && players[i].Team === teamOption) {
          playerList.push(players[i]);
        }
      }
    }
  }

  playerList.sort((a, b) => a.playerName.localeCompare(b.playerName));
  return playerList;
}

