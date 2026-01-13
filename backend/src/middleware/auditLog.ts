import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import prisma from '../config/database';

export function auditLog(action: string, entity: string) {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const originalJson = res.json.bind(res);

      res.json = function (body: any) {
        // Log after successful request
        if (body.success && req.user) {
          prisma.auditLog
            .create({
              data: {
                userId: req.user.id,
                action,
                entity,
                entityId: body.data?.id || req.params.id,
                changes: body.data,
                ipAddress: req.ip,
                userAgent: req.get('user-agent'),
              },
            })
            .catch((error) => console.error('Audit log error:', error));
        }

        return originalJson(body);
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}
