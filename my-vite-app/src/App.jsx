import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainContainer from './components/Layout/MainContainer';
import Navbar from './components/UI/Navbar';

// Pages
import Home from './views/Home';
import IntakePage from './pages/IntakePage';
import DiagnosisPage from './pages/DiagnosisPage'; // New wizard
import OptionsPage from './pages/OptionsPage';
import RoadmapPage from './pages/RoadmapPage';

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
            <Route path="/intake" element={<IntakePage />} /> {/* Legacy/Fallback */}
            <Route path="/options" element={<OptionsPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
          </Routes>
        </div>
      </MainContainer>
    </Router>
  );
}

export default App;
