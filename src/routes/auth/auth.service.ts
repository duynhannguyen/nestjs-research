import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  isNotFoundPrismaError,
  IsUniqueConstrainPrismaError,
} from 'src/shared/helper';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { TokenService } from 'src/shared/services/token.service.ts.service';
import { LoginBodyDTO, RegisterBodyDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}
  async register(body: RegisterBodyDTO) {
    try {
      const hashPassword = await this.hashingService.hash(body.password);
      const user = await this.prismaService.user.create({
        data: {
          email: body.email,
          password: hashPassword,
          name: body.name,
        },
      });
      return user;
    } catch (error) {
      if (IsUniqueConstrainPrismaError(error)) {
        throw new ConflictException('User with this email already exists.');
      }
      throw error;
    }
  }

  async login(body: LoginBodyDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Account is not exists');
    }
    const isPassWordMatch = await this.hashingService.compare(
      body.password,
      user.password,
    );
    if (!isPassWordMatch) {
      throw new UnprocessableEntityException([
        {
          field: 'password',
          error: 'Password is incorrect.',
        },
      ]);
    }

    const tokens = await this.generateTokens({ userId: user.id });
    return tokens;
  }
  async generateTokens(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ]);
    const decodedRefreshToken =
      await this.tokenService.verifyRefreshToken(refreshToken);
    await this.prismaService.refreshToken.create({
      data: {
        userId: decodedRefreshToken.userId,
        expiresAt: new Date(decodedRefreshToken.exp * 1000),
        token: refreshToken,
      },
    });
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      // 1. Verify refreshToken
      const { userId } =
        await this.tokenService.verifyRefreshToken(refreshToken);
      // 2.Check refreshToken in database
      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token: refreshToken,
        },
      });
      // 3. Delete old token
      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      });
      return await this.generateTokens({ userId });
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }
      throw new UnauthorizedException();
    }
  }
}
