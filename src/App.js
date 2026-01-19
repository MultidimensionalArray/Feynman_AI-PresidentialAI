import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Session from './pages/Session';
import About from './pages/About';
import CharacterSelect from './pages/CharacterSelect';
import { CharacterProvider } from './context/CharacterContext';

function App() {
  return (
    <CharacterProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/session/:topic" element={<Session />} />
              <Route path="/about" element={<About />} />
              <Route path="/companion" element={<CharacterSelect />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CharacterProvider>
  );
}

export default App;
