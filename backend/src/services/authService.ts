import { User } from '@prisma/client';
import prisma from '../config/database';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/password';
import { generateTokenPair } from '../utils/jwt';
import { LoginCredentials, RegisterUserData, TokenPair } from '../types';
import { getCached, setCached, deleteCached } from '../config/redis';

export class AuthService {
  async register(data: RegisterUserData): Promise<{ user: Omit<User, 'password'>; tokens: TokenPair }> {
    // Validate password strength
    const passwordValidation = validatePasswordStrength(data.password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: (data.role as any) || 'NURSE',
      },
    });

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, tokens };
  }

  async login(credentials: LoginCredentials, ipAddress?: string, userAgent?: string): Promise<{ user: Omit<User, 'password'>; tokens: TokenPair }> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account is inactive');
    }

    // Verify password
    const isPasswordValid = await comparePassword(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        ipAddress,
        userAgent,
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    // Cache user session
    await setCached(`user:${user.id}`, userWithoutPassword, 3600);

    return { user: userWithoutPassword, tokens };
  }

  async logout(userId: string, token: string): Promise<void> {
    // Invalidate session
    await prisma.session.updateMany({
      where: { userId, token },
      data: { isActive: false },
    });

    // Clear cache
    await deleteCached(`user:${userId}`);
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    // Find session
    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || !session.isActive) {
      throw new Error('Invalid refresh token');
    }

    if (new Date() > session.expiresAt) {
      throw new Error('Refresh token expired');
    }

    // Generate new tokens
    const tokens = generateTokenPair({
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role,
    });

    // Update session
    await prisma.session.update({
      where: { id: session.id },
      data: {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return tokens;
  }

  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    // Try cache first
    const cached = await getCached<Omit<User, 'password'>>(`user:${userId}`);
    if (cached) {
      return cached;
    }

    // Get from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const { password, ...userWithoutPassword } = user;

    // Cache it
    await setCached(`user:${userId}`, userWithoutPassword, 3600);

    return userWithoutPassword;
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<Omit<User, 'password'>> {
    // Don't allow updating sensitive fields
    const { password, role, isActive, ...updateData } = data as any;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    const { password: _, ...userWithoutPassword } = user;

    // Update cache
    await setCached(`user:${userId}`, userWithoutPassword, 3600);

    return userWithoutPassword;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Invalidate all sessions
    await prisma.session.updateMany({
      where: { userId },
      data: { isActive: false },
    });

    // Clear cache
    await deleteCached(`user:${userId}`);
  }
}

export default new AuthService();
