import { Profile } from '@app/shared/entities/profile.entity';
import { InputType, Field } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@InputType()
export class UpdateProfileDto implements Partial<Profile> {
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  about?: string;
  @Field(() => GraphQLUpload, { nullable: true })
  file?: FileUpload;
}