import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BrandIdentity from './pages/BrandIdentity';
import StrategyLab from './pages/StrategyLab';
import ContentCalendar from './pages/ContentCalendar';
import Insights from './pages/Insights';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BrandIdentity />} />
        <Route path="/lab" element={<StrategyLab />} />
        <Route path="/calendar" element={<ContentCalendar />} />
        <Route path="/insights" element={<Insights />} />
      </Routes>
    </BrowserRouter>
  );
}