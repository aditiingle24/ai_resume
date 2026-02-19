import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import SkillsPage from './pages/SkillsPage';
import CareersPage from './pages/CareersPage';
import RoadmapPage from './pages/RoadmapPage';
import MentorPage from './pages/MentorPage';
import './index.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/analysis" element={<AnalysisPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/mentor" element={<MentorPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
