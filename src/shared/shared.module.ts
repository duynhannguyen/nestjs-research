import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { HashingService } from './services/hashing.service';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './services/token.service.ts.service';
import { AuthenticatedGuard } from './guards/authentication-guards';
import { ApiKeyGuard } from './guards/api-key-guard';
import { AccessTokenGuard } from './guards/access-token-guard';

const sharedServices = [
  PrismaService,
  HashingService,
  TokenService,
  AuthenticatedGuard,
  ApiKeyGuard,
  AccessTokenGuard,
];
@Global()
@Module({
  imports: [JwtModule],
  providers: sharedServices,
  exports: sharedServices,
})
export class SharedModule {}
