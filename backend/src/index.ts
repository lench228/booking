import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Настройка CORS
app.use(cors({
    origin: '*', // Разрешить запросы с любых источников
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Укажите разрешённые методы
    allowedHeaders: ['Content-Type', 'Authorization'] // Укажите разрешённые заголовки
}));

app.use(express.json());

// Создание нового пользователя
app.get('/users', async (req, res) => {
    try {
        const user = await prisma.user.findMany()
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

app.post('/user', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await prisma.user.create({
            data: { name, email, password },
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Получение всех помещений
app.get('/spaces', async (req, res) => {
    try {
        const spaces = await prisma.space.findMany();
        res.status(200).json(spaces);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch spaces' });
    }
});

// Создание нового помещения
app.post('/spaces', async (req, res) => {
    const { name, location, pricePerDay } = req.body;
    try {
        const space = await prisma.space.create({
            data: { name, location, pricePerDay },
        });
        res.status(201).json(space);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create space' });
    }
});

// Получение всех бронирований
app.get('/bookings', async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: { user: true, space: true },
        });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Создание нового бронирования
app.post('/bookings', async (req, res) => {
    const { userId, spaceId, startDate, endDate } = req.body;
    try {
        const booking = await prisma.booking.create({
            data: { userId, spaceId, startDate: new Date(startDate), endDate: new Date(endDate) },
        });
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create booking' });
    }
});



// Удаление бронирования
app.delete('/bookings/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.booking.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete booking' });
    }
});

// Запуск сервера
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
