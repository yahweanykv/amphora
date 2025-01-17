import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import About from './components/About'; // ������ ���������� "About"
import './index.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App />} /> {/* ������� �������� */}
                <Route path="/about" element={<About />} /> {/* �������� "About" */}
            </Routes>
        </Router>
    </StrictMode>
);