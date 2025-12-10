"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Create a test user
        const user = yield prisma.user.upsert({
            where: { id: 'user-1' },
            update: {},
            create: {
                id: 'user-1',
                displayName: 'Demo User',
                avatarUrl: 'https://i.pravatar.cc/150?img=1',
                homeCity: 'Istanbul',
                trustScore: 4.5,
                contributionPoints: 120,
            },
        });
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
                createdBy: user.id,
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
                createdBy: user.id,
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
                createdBy: user.id,
            },
        ];
        for (const place of places) {
            yield prisma.place.upsert({
                where: { id: place.id },
                update: {},
                create: place,
            });
        }
        // Create mock reviews
        yield prisma.review.upsert({
            where: { id: 'review-1' },
            update: {},
            create: {
                id: 'review-1',
                rating: 5,
                text: 'Amazing place! Perfect for a weekend stroll.',
                placeId: 'place-1',
                userId: user.id,
            },
        });
        yield prisma.review.upsert({
            where: { id: 'review-2' },
            update: {},
            create: {
                id: 'review-2',
                rating: 4,
                text: 'Great views, can get crowded on weekends.',
                placeId: 'place-2',
                userId: user.id,
            },
        });
        console.log('✅ Database seeded with mock data!');
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
