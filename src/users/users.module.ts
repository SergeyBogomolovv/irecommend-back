import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { SharedModule } from '@app/shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '@app/shared/entities/profile.entity';
import { User } from '@app/shared/entities/user.entity';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([User, Profile])],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}