import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Session from './pages/Session';
import About from './pages/About';
import Review from './pages/Review';

const AppRoutes = () => {
  const location = useLocation();

  return (
    <main className="container mx-auto px-4 py-8">
      <div key={location.pathname} className="animate-fade-in">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/session/:topic" element={<Session />} />
          <Route path="/about" element={<Review />} />
          <Route path="/review" element={<About />} />
        </Routes>
      </div>
    </main>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <Header />
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
