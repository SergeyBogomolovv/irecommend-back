import { Injectable, Logger } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.input';
import { ConfigService } from '@nestjs/config';
import { S3Service } from 'src/s3/s3.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddContactDto } from './dto/add-contact.input';
import { UsersService } from 'src/users/users.service';
import { FileUpload } from 'graphql-upload-ts';
import { MessageResponse } from 'src/common';
import { Contact, Contacts, contactsUrl } from 'src/entities/contact.entity';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);
  constructor(
    @InjectRepository(Contact)
    private readonly contactsRepository: Repository<Contact>,
    private readonly cloud: S3Service,
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async getProfileInfo(id: string, relations: string[]) {
    return this.usersService.findOneById(id, relations);
  }

  async updateProfile(
    id: string,
    payload: UpdateProfileDto,
    image: FileUpload,
    relations: string[],
  ) {
    const user = await this.usersService.findOneByIdOrFail(id, [
      ...relations,
      'profile',
    ]);
    let newLogo = user.profile.logo;
    if (image) {
      newLogo = await this.cloud.upload({
        file: image.createReadStream(),
        path: 'logos',
      });
      if (user.profile.logo?.includes(this.config.get('YANDEX_BUCKET'))) {
        this.cloud.delete(user.profile.logo);
      }
    }
    user.profile = { ...user.profile, ...payload, logo: newLogo };
    this.logger.debug(`Updating profile for user ${user.email}`);
    return await this.usersService.update(user);
  }

  async addContact(id: string, payload: AddContactDto) {
    const user = await this.usersService.findOneByIdOrFail(id, [
      'profile.contacts',
    ]);

    const contactUrl =
      payload.type !== Contacts.DISCORD
        ? contactsUrl[payload.type] + payload.nickname
        : null;

    user.profile.contacts.push(
      this.contactsRepository.create({
        ...payload,
        url: contactUrl,
        nickname: payload.nickname,
      }),
    );
    await this.usersService.update(user);
    this.logger.debug(`contact ${payload.type} added to ${user.email} profile`);
    return new MessageResponse('Контакт добавлен в ваш профиль');
  }

  async removeContact(id: string) {
    await this.contactsRepository.delete(id);
    this.logger.debug(`Removing contact ${id}`);
    return new MessageResponse('Контакт удален из вашего профиля');
  }
}
