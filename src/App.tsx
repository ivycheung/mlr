import {
  Route,
  Routes,
  BrowserRouter,
} from 'react-router-dom';
import MLRPitchers from './views/MLRPitchers';
import MLRBatters from './views/MLRBatters';
import Nav from './views/Nav';

export default function App() {

  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/mlr/batters" element={<MLRBatters />} />
        <Route path="/mlr/pitchers" element={<MLRPitchers />} />
      </Routes>
    </BrowserRouter>
  );
}
