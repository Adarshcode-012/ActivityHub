import { NextRequest } from 'next/server';
import { verifyToken, JWTPayload } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export function authenticate(req: NextRequest): JWTPayload {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  const token = authHeader.substring(7);
  return verifyToken(token);
}

export function requireAdmin(user: JWTPayload): void {
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }
}
