import {
  Route,
  Routes,
  BrowserRouter,
} from 'react-router-dom';
import FCBPitchers from './views/FCBPitchers';
import FCBBatters from './views/FCBBatters';
import Nav from './views/Nav';

export default function App() {

  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        {/* <Route path="/r-slash-fake-baseball/mlr" element={<MLR />} /> */}
        <Route path="/r-slash-fake-baseball/fcb/batters" element={<FCBBatters />} />
        <Route path="/r-slash-fake-baseball/fcb/pitchers" element={<FCBPitchers />} />
        {/* <Route path="/r-slash-fake-baseball/mlr/batters" element={<MLRBatters />} /> */}
        {/* <Route path="/r-slash-fake-baseball/mlr/pitchers" element={<MLRPitchers />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
