export const jwtConstants = {
    JWT_SECRET: process.env.JWT_SECRET || 'not-so-secret',
    JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME || '24h',
}