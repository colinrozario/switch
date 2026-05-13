import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import MainContainer from './components/Layout/MainContainer';
import Navbar from './components/UI/Navbar';

// Pages
import Home from './views/Home';
import IntakePage from './pages/IntakePage';
import DiagnosisPage from './pages/DiagnosisPage';
import ProfileReviewPage from './pages/ProfileReviewPage';
import OptionsPage from './pages/OptionsPage';
import BridgePage from './pages/BridgePage';
import RoadmapPage from './pages/RoadmapPage';
import SimulatorPage from './pages/SimulatorPage';
import SwitchPromptGuide from './views/PromptGuide';

// Scrolls to the top of the page on every route change.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Inner pages need a top padding offset for the fixed navbar.
// Home is full-bleed so it renders the navbar overlaid on the dark hero.
function InnerPageWrapper({ children }) {
  return (
    <div style={{ paddingTop: '68px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/diagnosis" element={<InnerPageWrapper><DiagnosisPage /></InnerPageWrapper>} />
      <Route path="/profile"   element={<InnerPageWrapper><ProfileReviewPage /></InnerPageWrapper>} />
      <Route path="/options"   element={<InnerPageWrapper><OptionsPage /></InnerPageWrapper>} />
      <Route path="/bridge"    element={<InnerPageWrapper><BridgePage /></InnerPageWrapper>} />
      <Route path="/roadmap"   element={<InnerPageWrapper><RoadmapPage /></InnerPageWrapper>} />
      <Route path="/simulator" element={<InnerPageWrapper><SimulatorPage /></InnerPageWrapper>} />
      <Route path="/guide"     element={<InnerPageWrapper><SwitchPromptGuide /></InnerPageWrapper>} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <MainContainer>
        <Navbar />
        <AppRoutes />
      </MainContainer>
    </Router>
  );
}

export default App;
