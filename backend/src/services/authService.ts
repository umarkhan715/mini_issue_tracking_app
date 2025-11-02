import jwt from 'jsonwebtoken';
import * as userRepo from '../repositories/userRepository';

const JWT_SECRET = process.env['JWT_SECRET'] || 'supersecretkey';

export async function loginUser(email: string, name: string) {
    if (!email || !name) {
        throw new Error('Email and name are required.');
    }

    let user = await userRepo.findByEmail(email);
    if (!user) throw new Error('User does not exist');

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return {
        user: { id: user.id, email: user.email, name: user.name },
        token,
    };
}

export async function registerUser(email: string, name: string) {
    if (!email || !name) {
        throw new Error('Email and name are required.');
    }

    let user = await userRepo.findByEmail(email);
    if (user) {
        throw new Error('User already exists');
    }

    user = await userRepo.create(email, name);
    return {
        user: { id: user.id, email: user.email, name: user.name },
    };
}
