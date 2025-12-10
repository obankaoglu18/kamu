import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create a review
router.post('/', async (req, res) => {
    const { placeId, rating, text, userId } = req.body;
    try {
        const review = await prisma.review.create({
            data: {
                placeId,
                rating,
                text,
                userId, // In real app, get from auth context
                status: 'active',
            },
        });

        // Update place rating
        const aggregates = await prisma.review.aggregate({
            where: { placeId },
            _avg: { rating: true },
            _count: { rating: true },
        });

        await prisma.place.update({
            where: { id: placeId },
            data: {
                avgRating: aggregates._avg.rating || 0,
                ratingCount: aggregates._count.rating || 0,
                reviewCount: aggregates._count.rating || 0,
            },
        });

        res.json(review);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create review' });
    }
});

// Get reviews for a place
router.get('/place/:placeId', async (req, res) => {
    const { placeId } = req.params;
    try {
        const reviews = await prisma.review.findMany({
            where: { placeId },
            include: { user: { select: { displayName: true, avatarUrl: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

export default router;
