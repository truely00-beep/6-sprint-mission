import 'dotenv/config';
export const getCorsOrigin = () => {
    const corsOrigin = process.env.CORS_ORIGIN;
    if (!corsOrigin || corsOrigin === '*') return '*';

    if (corsOrigin.includes(','))
        return corsOrigin.split(',').map((origin) => origin.trim().replace(/\/$/, ''));

    // 단일 origin (trailing slash 제거)
    return corsOrigin.trim().replace(/\/$/, '');
};

export const corsOriginChecker = (origin, callback) => {
    const allowedOrigins = getCorsOrigin();
    if (allowedOrigins === '*') return callback(null, true);

    const origins = Array.isArray(allowedOrigins) ? allowedOrigins : [allowedOrigins];
    if (!origins) return callback(null, false);

    const normalizedOrigin = origin.replace(/\/$/, '');
    const isAllowed = origins.some((allowed) => {
        const normalizedAllowed = allowed.replace(/\/$/, '');
        return normalizedOrigin === normalizedAllowed;

    });
    callback(null, isAllowed);

};