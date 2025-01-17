import React from 'react';
import { Link } from 'react-router-dom'; // Импорт Link из react-router-dom
import logo from '../assets/logo.png'; // Импорт логотипа
import './Header.css'; // Стили для шапки


const Header = () => {
    return (
        <header className="header">
            <div className="container">
                {/* Логотип и название сайта */}
                <div className="logo-container">
                    <img src={logo} alt="logo" className="logo" />
                    <h1>Amphora</h1>
                </div>

                {/* Навигация */}
                <nav>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><Link to="/about">About</Link></li> {/* Ссылка на страницу "About" */}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;