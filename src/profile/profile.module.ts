import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResolver } from './profile.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Module } from 'src/s3/s3.module';
import { UsersModule } from 'src/users/users.module';
import { Contact } from 'src/entities/contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contact]), S3Module, UsersModule],
  providers: [ProfileResolver, ProfileService],
})
export class ProfileModule {}
