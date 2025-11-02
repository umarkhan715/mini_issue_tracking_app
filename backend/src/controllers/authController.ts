import { Request, Response, NextFunction } from 'express';
import { loginUser, registerUser } from '../services/authService';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, name } = req.body;
        const result = await loginUser(email, name);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, name } = req.body;
        const result = await registerUser(email, name);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};
