import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainContainer from './components/Layout/MainContainer';
import Navbar from './components/UI/Navbar';

// Pages
import Home from './views/Home';
import IntakePage from './pages/IntakePage';
import DiagnosisPage from './pages/DiagnosisPage'; // New wizard
import ProfileReviewPage from './pages/ProfileReviewPage';
import OptionsPage from './pages/OptionsPage';
import BridgePage from './pages/BridgePage';
import RoadmapPage from './pages/RoadmapPage';
import SimulatorPage from './pages/SimulatorPage';
import SwitchPromptGuide from './views/PromptGuide';

function App() {
  return (
    <Router>
      <MainContainer>
        <Navbar />

        {/* Main Content Area */}
        <div style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/diagnosis" element={<DiagnosisPage />} />
            <Route path="/profile" element={<ProfileReviewPage />} />
            <Route path="/options" element={<OptionsPage />} />
            <Route path="/bridge" element={<BridgePage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/simulator" element={<SimulatorPage />} />
            <Route path="/guide" element={<SwitchPromptGuide />} />
          </Routes>
        </div>
      </MainContainer>
    </Router>
  );
}

export default App;
