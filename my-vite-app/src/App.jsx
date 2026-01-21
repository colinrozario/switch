import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainContainer from './components/Layout/MainContainer';
import Navbar from './components/UI/Navbar';

// Views
import Home from './views/Home';
import Intake from './views/Intake';
import Paths from './views/Paths';
import Roadmap from './views/Roadmap';

function App() {
  return (
    <Router>
      <MainContainer>
        <Navbar />

        {/* Main Content Area */}
        <div style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/intake" element={<Intake />} />
            <Route path="/paths" element={<Paths />} />
            <Route path="/roadmap" element={<Roadmap />} />
          </Routes>
        </div>
      </MainContainer>
    </Router>
  );
}

export default App;
