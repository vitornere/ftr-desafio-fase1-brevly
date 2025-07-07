export type CreateShortLink = {
    originalUrl: string
    slug: string
}

export type ShortLink = CreateShortLink & {
    id: string
    clicks: number
    createdAt: string
}