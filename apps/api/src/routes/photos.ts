import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create a photo record
router.post('/', async (req, res) => {
    const { url, placeId, reviewId, userId } = req.body;

    try {
        const photo = await prisma.photo.create({
            data: {
                url,
                placeId,
                reviewId,
                userId,
            },
        });
        res.json(photo);
    } catch (error) {
        console.error('Create photo error:', error);
        res.status(500).json({ error: 'Failed to create photo record' });
    }
});

export default router;
