import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env['JWT_SECRET'] || 'supersecretkey';

interface AuthenticatedRequest extends Request {
    userId?: number;
    userEmail?: string;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            res.status(401).json({ error: 'Access token required' });
            return;
        }

        jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
            if (err) {
                res.status(403).json({ error: 'Invalid or expired token' });
                return;
            }

            req.userId = decoded.userId;
            req.userEmail = decoded.email;
            next();
        });
    } catch (error) {
        res.status(500).json({ error: 'Authentication error' });
    }
};