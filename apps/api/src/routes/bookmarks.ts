import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create a bookmark
router.post('/', async (req: Request, res: Response) => {
    const { placeId } = req.body;
    const userId = req.headers['x-user-id'] as string;

    if (!userId || !placeId) {
        res.status(400).json({ error: 'Missing userId or placeId' });
        return;
    }

    try {
        const bookmark = await prisma.bookmark.create({
            data: {
                userId,
                placeId,
            },
        });
        res.json(bookmark);
    } catch (error) {
        console.error('Error creating bookmark:', error);
        res.status(500).json({ error: 'Failed to create bookmark' });
    }
});

// Delete a bookmark
router.delete('/:placeId', async (req: Request, res: Response) => {
    const { placeId } = req.params;
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
        res.status(400).json({ error: 'Missing userId' });
        return;
    }

    try {
        await prisma.bookmark.deleteMany({
            where: {
                userId,
                placeId,
            },
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting bookmark:', error);
        res.status(500).json({ error: 'Failed to delete bookmark' });
    }
});

// Get all bookmarks for a user
router.get('/', async (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
        res.status(400).json({ error: 'Missing userId' });
        return;
    }

    try {
        const bookmarks = await prisma.bookmark.findMany({
            where: {
                userId,
            },
            include: {
                place: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Transform to return list of places with bookmarkedAt date
        const bookmarkedPlaces = bookmarks.map(b => ({
            ...b.place,
            bookmarkedAt: b.createdAt
        }));

        res.json(bookmarkedPlaces);
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
});

export default router;
