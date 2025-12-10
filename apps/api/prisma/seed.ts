import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
    // Create multiple test users with realistic data
    const users = [
        {
            id: 'user-1',
            email: 'ayse.yilmaz@example.com',
            password: await hashPassword('password123'),
            displayName: 'Ayşe Yılmaz',
            avatarUrl: 'https://i.pravatar.cc/150?img=5',
            homeCity: 'Istanbul',
            trustScore: 4.8,
            contributionPoints: 245,
        },
        {
            id: 'user-2',
            email: 'mehmet.demir@example.com',
            password: await hashPassword('password123'),
            displayName: 'Mehmet Demir',
            avatarUrl: 'https://i.pravatar.cc/150?img=12',
            homeCity: 'Ankara',
            trustScore: 4.5,
            contributionPoints: 180,
        },
        {
            id: 'user-3',
            email: 'zeynep.kaya@example.com',
            password: await hashPassword('password123'),
            displayName: 'Zeynep Kaya',
            avatarUrl: 'https://i.pravatar.cc/150?img=9',
            homeCity: 'Izmir',
            trustScore: 4.9,
            contributionPoints: 320,
        },
        {
            id: 'user-4',
            email: 'can.ozturk@example.com',
            password: await hashPassword('password123'),
            displayName: 'Can Öztürk',
            avatarUrl: 'https://i.pravatar.cc/150?img=15',
            homeCity: 'Istanbul',
            trustScore: 4.2,
            contributionPoints: 95,
        },
    ];

    for (const userData of users) {
        await prisma.user.upsert({
            where: { id: userData.id },
            update: {},
            create: userData,
        });
    }

    // Create mock places
    const places = [
        {
            id: 'place-1',
            name: 'Gezi Park',
            description: 'A beautiful public park in the heart of the city',
            category: 'park',
            tags: 'green,urban,central',
            lat: 41.0367,
            lng: 28.9869,
            avgRating: 4.5,
            ratingCount: 23,
            reviewCount: 15,
            status: 'active',
            createdBy: 'user-1',
        },
        {
            id: 'place-2',
            name: 'Kadikoy Pier',
            description: 'Historic waterfront pier with stunning Bosphorus views',
            category: 'waterfront',
            tags: 'historic,water,scenic',
            lat: 40.9999,
            lng: 29.0285,
            avgRating: 4.8,
            ratingCount: 45,
            reviewCount: 32,
            status: 'active',
            createdBy: 'user-2',
        },
        {
            id: 'place-3',
            name: 'Bebek Park',
            description: 'Charming neighborhood park along the Bosphorus',
            category: 'park',
            tags: 'bosphorus,family,peaceful',
            lat: 41.0768,
            lng: 29.0433,
            avgRating: 4.3,
            ratingCount: 18,
            reviewCount: 12,
            status: 'active',
            createdBy: 'user-3',
        },
    ];

    for (const place of places) {
        await prisma.place.upsert({
            where: { id: place.id },
            update: {},
            create: place,
        });
    }

    // Create mock reviews
    await prisma.review.upsert({
        where: { id: 'review-1' },
        update: {},
        create: {
            id: 'review-1',
            rating: 5,
            text: 'Amazing place! Perfect for a weekend stroll.',
            placeId: 'place-1',
            userId: 'user-1',
        },
    });

    await prisma.review.upsert({
        where: { id: 'review-2' },
        update: {},
        create: {
            id: 'review-2',
            rating: 4,
            text: 'Great views, can get crowded on weekends.',
            placeId: 'place-2',
            userId: 'user-2',
        },
    });

    console.log('✅ Database seeded with mock data!');
    console.log('📧 Test user credentials:');
    console.log('   Email: ayse.yilmaz@example.com, Password: password123');
    console.log('   Email: mehmet.demir@example.com, Password: password123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
