import { DigitalSignature } from '@prisma/client';
import prisma from '../config/database';
import { getCached, setCached, clearCachePattern } from '../config/redis';

export class DigitalSignatureService {
  async createSignature(data: {
    userId: string;
    signatureText: string;
    signatureStyle: string;
    signatureDataUrl: string;
    stampDataUrl?: string;
  }): Promise<DigitalSignature> {
    // If this is set as default, unset other defaults
    const signature = await prisma.digitalSignature.create({
      data: {
        ...data,
        signatureType: 'TYPED',
      },
    });

    // Clear user's signature cache
    await clearCachePattern(`signature:user:${data.userId}*`);

    return signature;
  }

  async getSignatureById(id: string): Promise<DigitalSignature | null> {
    return prisma.digitalSignature.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }

  async getUserSignatures(userId: string): Promise<DigitalSignature[]> {
    // Try cache first
    const cacheKey = `signature:user:${userId}`;
    const cached = await getCached<DigitalSignature[]>(cacheKey);
    if (cached) return cached;

    // Get from database
    const signatures = await prisma.digitalSignature.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Cache it
    await setCached(cacheKey, signatures, 3600);

    return signatures;
  }

  async getDefaultSignature(userId: string): Promise<DigitalSignature | null> {
    return prisma.digitalSignature.findFirst({
      where: { userId, isDefault: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async setDefaultSignature(userId: string, signatureId: string): Promise<DigitalSignature> {
    // Unset all defaults for this user
    await prisma.digitalSignature.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    // Set new default
    const signature = await prisma.digitalSignature.update({
      where: { id: signatureId },
      data: { isDefault: true },
    });

    // Clear cache
    await clearCachePattern(`signature:user:${userId}*`);

    return signature;
  }

  async deleteSignature(id: string, userId: string): Promise<void> {
    await prisma.digitalSignature.delete({
      where: { id, userId },
    });

    // Clear cache
    await clearCachePattern(`signature:user:${userId}*`);
  }

  // Generate signature styles (for frontend to use)
  getSignatureStyles(): string[] {
    return [
      'Dancing Script',
      'Pacifico',
      'Great Vibes',
      'Allura',
      'Sacramento',
      'Cookie',
      'Satisfy',
      'Alex Brush',
    ];
  }
}

export default new DigitalSignatureService();
