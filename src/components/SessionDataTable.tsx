import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { calculatePitchCircleDelta, calculateSwingCircleDelta, getNextPitch, getResultCategory } from "../utils/utils";
import { FormSchemaPitches } from "../types/schemas/pitches-schema";
import Typography from '@mui/material/Typography';

interface SessionDataTableProps {
  pitches: FormSchemaPitches,
  showSeason?: boolean
}

const SessionDataTable: React.FC<SessionDataTableProps> = ({ pitches , showSeason = false}) => {
  if (!pitches || pitches.length == 0 || pitches == undefined) {
    return null
  }

  return (
    <div>
      <TableContainer component={Paper} style={{ maxHeight: document.documentElement.clientHeight * 0.4 }}>
        <Table stickyHeader sx={{ minWidth: document.documentElement.clientWidth * 0.80 }} size="small" aria-label="a dense table" >
          <TableHead>
            <TableRow>
              <TableCell width={50} >Pitch</TableCell>
              <TableCell width={50} >Swing</TableCell>
              <TableCell width={50} align="center" >Result</TableCell>
              <TableCell width={50} align="center" >Inning</TableCell>
              <TableCell width={50} align="center" >Outs</TableCell>
              <TableCell width={50} align="center">OBC</TableCell>
              {showSeason ? <TableCell width={50} align="center">Season</TableCell> : null}
              <TableCell width={50} align="center" style={{ borderRightWidth: 1, borderRightColor: 'lightgrey', borderRightStyle: 'solid' }}>Session</TableCell>
              <TableCell width={50} align="center">Diff</TableCell>
              <TableCell width={50} align="center">Result</TableCell>
              <TableCell width={50} align="center">Next</TableCell>
              <TableCell width={50} align="center">Delta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pitches.map((pitch, i, array) => {
              return <TableRow
                key={pitch.paID}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              // style={{ backgroundColor: colors[(pitch.inning).toString().slice(-1)]}}
              >
                <TableCell colSpan={1} component="th" scope="row" >{pitch.pitch} <Typography variant="caption" gutterBottom>{calculatePitchCircleDelta(array, i, true)}</Typography></TableCell>
                <TableCell >{pitch.swing} <Typography variant="caption" gutterBottom>{calculateSwingCircleDelta(array, i, true)}</Typography></TableCell>
                <TableCell align="center" >{pitch.exactResult}</TableCell>
                <TableCell align="center">{pitch.inning}</TableCell>
                <TableCell align="center">{pitch.outs}</TableCell>
                <TableCell align="center">{pitch.obc}</TableCell>
                {showSeason ? <TableCell align="center">{pitch.season}</TableCell> : null}
                <TableCell align="center" style={{ borderRightWidth: 1, borderRightColor: 'lightgrey', borderRightStyle: 'solid' }}>{pitch.session}</TableCell>
                <TableCell align="center">{pitch.diff}</TableCell>
                <TableCell align="center">{getResultCategory(pitch)}</TableCell>
                <TableCell align="center">{getNextPitch(array, i)}</TableCell>
                <TableCell align="center">{calculatePitchCircleDelta(array, i)}</TableCell>
              </TableRow>
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SessionDataTable;