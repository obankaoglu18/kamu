import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all places (with optional status filter)
router.get('/', async (req, res) => {
    const { status } = req.query;
    try {
        const where = status ? { status: String(status) } : {};
        const places = await prisma.place.findMany({
            where,
            include: { photos: true, user: { select: { displayName: true, avatarUrl: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(places);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch places' });
    }
});

// Update place status
router.patch('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'active', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const place = await prisma.place.update({
            where: { id },
            data: { status }
        });
        res.json(place);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update place status' });
    }
});

// Create a place
router.post('/', async (req, res) => {
    const { name, description, category, tags, lat, lng, createdBy } = req.body;
    try {
        const place = await prisma.place.create({
            data: {
                name,
                description,
                category,
                tags,
                lat,
                lng,
                createdBy, // In real app, get from auth context
            },
        });
        res.json(place);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create place' });
    }
});

// Get place details
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const place = await prisma.place.findUnique({
            where: { id },
            include: {
                photos: true,
                reviews: { include: { user: true } },
                user: { select: { displayName: true } }
            }
        });
        if (!place) return res.status(404).json({ error: 'Place not found' });
        res.json(place);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch place' });
    }
});

export default router;
