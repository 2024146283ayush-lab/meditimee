import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'meditime-secret-key-2024';

export interface AuthPayload {
  userId: string;
  email: string;
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}
