import {
  Route,
  Routes,
  HashRouter,
} from 'react-router-dom';
import MLRPitchers from './views/MLRPitchers';
import MLRBatters from './views/MLRBatters';
import MILRBatters from './views/MILRBatters';
import MILRPitchers from './views/MILRPitchers';
import MLRPitchersSeason from './views/MLRPitchersSeason';
import MILRPitchersSeason from './views/MILRPitchersSeason';
import Nav from './views/Nav';
import Home from './views/Home';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();

export default function App() {

  return (
    <QueryClientProvider client={queryClient}>
    <HashRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mlrbatters" element={<MLRBatters />} />
        <Route path="/mlrpitchers" element={<MLRPitchers />} />
        <Route path="/mlrpitchersseason" element={<MLRPitchersSeason />} />
        <Route path="/milrbatters" element={<MILRBatters />} />
        <Route path="/milrpitchers" element={<MILRPitchers />} />
        <Route path="/milrpitchersseason" element={<MILRPitchersSeason />} />
      </Routes>
    </HashRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
