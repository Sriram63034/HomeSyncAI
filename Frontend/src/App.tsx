import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Wizard from './pages/Wizard';
import Results from './pages/Results';
import Details from './pages/Details';
import Saved from './pages/Saved';

import ProtectedRoute from './components/auth/ProtectedRoute';

// Wrapper for animated routes
const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />

                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><PageTransition><Landing /></PageTransition></ProtectedRoute>} />
                <Route path="/home" element={<ProtectedRoute><PageTransition><Landing /></PageTransition></ProtectedRoute>} />
                <Route path="/wizard" element={<ProtectedRoute><PageTransition><Wizard /></PageTransition></ProtectedRoute>} />
                <Route path="/results" element={<ProtectedRoute><PageTransition><Results /></PageTransition></ProtectedRoute>} />
                <Route path="/house/:id" element={<ProtectedRoute><PageTransition><Details /></PageTransition></ProtectedRoute>} />
                <Route path="/saved" element={<ProtectedRoute><PageTransition><Saved /></PageTransition></ProtectedRoute>} />
            </Routes>
        </AnimatePresence>
    );
};

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex flex-col pt-14">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
