import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // Для получения __dirname в ES6-модулях

// Получаем __dirname в ES6-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем переменные окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET; // Секретный ключ для JWT
const MONGODB_URI = process.env.MONGODB_URI; // Строка подключения к MongoDB

// Настройка статической папки "dist" для клиента (React + Vite)
app.use(express.static(path.join(__dirname, '../dist'), {
    setHeaders: (res, filePath) => {
        // Устанавливаем правильные MIME-типы для файлов
        if (filePath.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        } else if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css; charset=UTF-8');
        } else if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        }
    }
}));

// Middleware
app.use(cors()); // Разрешаем CORS
app.use(express.json()); // Парсим JSON-тела запросов

// Подключение к MongoDB
mongoose.connect(MONGODB_URI, {
}).then(() => {
    console.log('Connected to MongoDB successfully');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Схемы и модели MongoDB
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const WishlistItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
});

const WishlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [WishlistItemSchema], // Массив элементов вишлиста
});

const User = mongoose.model('User', UserSchema);
const Wishlist = mongoose.model('Wishlist', WishlistSchema);

// Middleware для аутентификации JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Роуты

// Регистрация пользователя
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error registering user' });
    }
});

// Логин пользователя
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Получение вишлиста пользователя
app.get('/api/wishlist', authenticateJWT, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.userId }).populate('userId');
        if (!wishlist) {
            const newWishlist = new Wishlist({ userId: req.userId, items: [] });
            await newWishlist.save();
            return res.status(200).json(newWishlist);
        }
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching wishlist' });
    }
});

// Добавление элемента в вишлист
app.post('/api/wishlist/items', authenticateJWT, async (req, res) => {
    const { name, price } = req.body;
    try {
        const wishlist = await Wishlist.findOne({ userId: req.userId });
        if (!wishlist) return res.status(404).json({ error: 'Wishlist not found' });

        wishlist.items.push({ name, price });
        await wishlist.save();
        res.status(201).json(wishlist);
    } catch (error) {
        res.status(400).json({ error: 'Error adding item to wishlist' });
    }
});

// Удаление элемента из вишлиста
app.delete('/api/wishlist/items/:itemId', authenticateJWT, async (req, res) => {
    const { itemId } = req.params;
    try {
        const wishlist = await Wishlist.findOne({ userId: req.userId });
        if (!wishlist) return res.status(404).json({ error: 'Wishlist not found' });

        wishlist.items = wishlist.items.filter((item) => item._id.toString() !== itemId);
        await wishlist.save();
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(400).json({ error: 'Error deleting item from wishlist' });
    }
});

// Запуск сервера
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));