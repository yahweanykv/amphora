import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import About from './components/About'; // Импорт компонента "About"
import './index.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App />} /> {/* Главная страница */}
                <Route path="/about" element={<About />} /> {/* Страница "About" */}
            </Routes>
        </Router>
    </StrictMode>
);