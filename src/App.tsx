import {
  Route,
  Routes,
  BrowserRouter,
} from 'react-router-dom';
import MLRPitchers from './views/MLRPitchers';
import MLRBatters from './views/MLRBatters';
import MILRBatters from './views/MILRBatters';
import MILRPitchers from './views/MILRPitchers';
import MLRPitchersSeason from './views/MLRPitchersSeason';
import MILRPitchersSeason from './views/MILRPitchersSeason';
import Nav from './views/Nav';
import Home from './views/Home';

export default function App() {

  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/mlr" element={<Home />} />
        <Route path="/mlr/mlrbatters" element={<MLRBatters />} />
        <Route path="/mlr/mlrpitchers" element={<MLRPitchers />} />
        <Route path="/mlr/mlrpitchersseason" element={<MLRPitchersSeason />} />
        <Route path="/mlr/milrbatters" element={<MILRBatters />} />
        <Route path="/mlr/milrpitchers" element={<MILRPitchers />} />
        <Route path="/mlr/milrpitchersseason" element={<MILRPitchersSeason />} />
      </Routes>
    </BrowserRouter>
  );
}
