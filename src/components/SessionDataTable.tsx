import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { getDelta, getNextPitch } from "../utils/utils";
import { FormSchemaPitches } from "../types/schemas/pitches-schema";

interface SessionDataTableProps { pitches: FormSchemaPitches }

const SessionDataTable: React.FC<SessionDataTableProps> = ( {pitches} ) => {
  if (pitches == undefined) {
    return null
  }
  return (
    <div>
      <TableContainer component={Paper} style={{ maxHeight: document.documentElement.clientHeight * 0.4 }}>
        <Table stickyHeader sx={{ minWidth: document.documentElement.clientWidth * 0.80 }} size="small" aria-label="a dense table" >
          <TableHead>
            <TableRow>
              <TableCell width={50} align="center" >Pitch</TableCell>
              <TableCell width={50} align="center" >Swing</TableCell>
              <TableCell width={50} align="center" >Result</TableCell>
              <TableCell width={50} align="center" >Inning</TableCell>
              <TableCell width={50} align="center" >Outs</TableCell>
              <TableCell width={50} align="center">OBC</TableCell>
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
                <TableCell colSpan={1} component="th" scope="row" align="center">{pitch.pitch}</TableCell>
                <TableCell align="center">{pitch.swing}</TableCell>
                <TableCell align="center">{pitch.exactResult}</TableCell>
                <TableCell align="center">{pitch.inning}</TableCell>
                <TableCell align="center">{pitch.outs}</TableCell>
                <TableCell align="center">{pitch.obc}</TableCell>
                <TableCell align="center" style={{ borderRightWidth: 1, borderRightColor: 'lightgrey', borderRightStyle: 'solid' }}>{pitch.session}</TableCell>
                <TableCell align="center">{pitch.diff}</TableCell>
                <TableCell align="center"></TableCell>
                <TableCell align="center">{getNextPitch(array, i)}</TableCell>
                <TableCell align="center">{getDelta(array, i)}</TableCell>
              </TableRow>
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SessionDataTable;