import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';

// const prisma = new PrismaClient(); // Removed

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        console.log(`[AUTH] Register attempt for: ${email}`);

        if (!email || !password) {
            console.log('[AUTH] Missing email or password');
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            console.log('[AUTH] User already exists');
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        res.status(201).json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        console.log(`[AUTH] Login attempt for: ${email}`);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            console.log('[AUTH] User not found');
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('[AUTH] Invalid password');
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
