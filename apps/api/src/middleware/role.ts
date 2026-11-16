import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@careerpulse/shared';

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Authentication required',
      });
    }

    if (req.auth.role === 'admin') {
      return next(); // Admin always has full access
    }

    if (!allowedRoles.includes(req.auth.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: Requires one of [${allowedRoles.join(', ')}] role`,
      });
    }

    next();
  };
}
