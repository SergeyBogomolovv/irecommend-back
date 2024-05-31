import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  readonly id: string;

  @ManyToOne(() => User, (user) => user.sendedFriendRequests, {
    cascade: true,
  })
  @Field(() => User, { nullable: true })
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedFriendRequests, {
    cascade: true,
  })
  @Field(() => User, { nullable: true })
  recipient: User;

  @CreateDateColumn()
  @Field(() => Date)
  readonly created_at: Date;
}
