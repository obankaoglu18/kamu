import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyPassword, hashPassword } from '../utils/password';

const router = Router();
const prisma = new PrismaClient();

// Sign up new user
router.post('/signup', async (req, res) => {
    const { email, password, displayName } = req.body;

    if (!email || !password || !displayName) {
        return res.status(400).json({ error: 'Email, password, and display name are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Hash password and create user
        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                displayName,
            }
        });

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({
            token: 'mock-jwt-token',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Signup failed' });
    }
});

// Login with email and password
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isValidPassword = await verifyPassword(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // In real app, issue a JWT token here
        res.json({
            token: 'mock-jwt-token',
            user: {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
                avatarUrl: user.avatarUrl,
                homeCity: user.homeCity,
                trustScore: user.trustScore,
                contributionPoints: user.contributionPoints,
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Update current user
router.patch('/me', async (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { avatarUrl, displayName, homeCity } = req.body;

    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                avatarUrl,
                displayName,
                homeCity,
            },
        });
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

export default router;
