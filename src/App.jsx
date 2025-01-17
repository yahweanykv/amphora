import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './components/modal';
import Header from './components/Header'; // Импорт шапки
import Footer from './components/Footer'; // Импорт футера
import './App.css';

const App = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [wishlist, setWishlist] = useState({ items: [] });
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Регистрация пользователя
    const handleRegister = async () => {
        try {
            const response = await axios.post('/api/register', { username, password });
            alert(response.data.message);
        } catch (error) {
            alert(error.response?.data?.error || 'Error registering user');
        }
    };

    // Вход пользователя
    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/login', { username, password });
            setToken(response.data.token);
            alert('Login successful');
            fetchWishlist();
        } catch (error) {
            alert(error.response?.data?.error || 'Error logging in');
        }
    };

    // Получение вишлиста пользователя
    const fetchWishlist = async () => {
        try {
            const response = await axios.get('/api/wishlist', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWishlist(response.data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    // Добавление элемента в вишлист
    const handleAddItem = async ({ name, price }) => {
        try {
            const response = await axios.post(
                '/api/wishlist/items',
                { name, price },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setWishlist(response.data);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    // Удаление элемента из вишлиста
    const deleteItem = async (itemId) => {
        try {
            await axios.delete(`/api/wishlist/items/${itemId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchWishlist();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    // Загрузка вишлиста при изменении токена
    useEffect(() => {
        if (token) {
            fetchWishlist();
        }
    }, [token]);

    return (
        <div className="app">
            {/* Шапка */}
            <Header />

            {/* Основной контент */}
            <div className="container">
                {/* Условный рендеринг заголовка */}
                {!token && <h1>Войдите, чтобы получить доступ к своим желаниям</h1>}

                {!token ? (
                    // Форма регистрации и входа
                    <div className="auth-form">
                        <input
                            type="text"
                            placeholder="Логин"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="auth-buttons">
                            <button className="login-button" onClick={handleLogin}>Вход</button>
                            <button className="register-button" onClick={handleRegister}>Регистрация</button>
                        </div>
                    </div>
                ) : (
                    // Интерфейс для работы с вишлистом
                    <>
                        <h2>Ваш вишлист:</h2>
                        <button className="add-wishlist-button" onClick={() => setIsModalOpen(true)}>
                            Добавить желаемое
                        </button>

                        {/* Модальное окно для добавления элемента */}
                        <Modal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onAddItem={handleAddItem}
                        />

                        {/* Отображение элементов вишлиста в виде сетки */}
                        <div className="wishlist-grid">
                            {wishlist.items.map((item) => (
                                <div key={item._id} className="wishlist-item">
                                    <h3>{item.name}</h3>
                                    <p>Цена: {item.price} руб.</p>
                                    <button onClick={() => deleteItem(item._id)}>Убрать</button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Футер */}
            <Footer />
        </div>
    );
};

export default App;