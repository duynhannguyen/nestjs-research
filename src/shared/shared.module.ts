import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { HashingService } from './services/hashing.service';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './services/token.service.ts.service';

const sharedServices = [PrismaService, HashingService, TokenService];
@Global()
@Module({
  imports: [JwtModule],
  providers: sharedServices,
  exports: sharedServices,
})
export class SharedModule {}
