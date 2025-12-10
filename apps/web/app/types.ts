export interface User {
    id: string;
    displayName: string;
    avatarUrl?: string;
}

export interface Place {
    id: string;
    name: string;
    description: string;
    category: string;
    tags: string;
    lat: number;
    lng: number;
    createdAt: string;
    user?: User;
}
