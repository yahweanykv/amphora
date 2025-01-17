import React from 'react';
import { Link } from 'react-router-dom'; // ������ Link �� react-router-dom
import logo from '../assets/logo.png'; // ������ ��������
import './Header.css'; // ����� ��� �����


const Header = () => {
    return (
        <header className="header">
            <div className="container">
                {/* ������� � �������� ����� */}
                <div className="logo-container">
                    <img src={logo} alt="logo" className="logo" />
                    <h1>Amphora</h1>
                </div>

                {/* ��������� */}
                <nav>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><Link to="/about">About</Link></li> {/* ������ �� �������� "About" */}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;