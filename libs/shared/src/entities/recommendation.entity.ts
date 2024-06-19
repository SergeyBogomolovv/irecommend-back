import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from './user.entity';
import { Image } from './image.entity';
import { Comment } from './comments.entity';

export enum RecommendationType {
  MOVIE = 'movie',
  MUSIC = 'music',
  ANIME = 'anime',
  BOOK = 'book',
  HOBBY = 'hobby',
  TODO = 'todo',
  SERIES = 'series',
}
registerEnumType(RecommendationType, {
  name: 'RecommendationType',
});

@ObjectType()
@Entity()
export class Recommendation {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  readonly id: string;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  description: string;

  @Column('int', { default: 0 })
  @Field(() => Int)
  favoritesCount: number;

  @Column({ type: 'enum', enum: RecommendationType })
  @Field(() => RecommendationType)
  type: RecommendationType;

  @Column({ nullable: true })
  @Field({ nullable: true })
  link?: string;

  @OneToMany(() => Image, (image) => image.recommendation, { cascade: true })
  @Field(() => [Image], { nullable: true })
  images: Image[];

  @OneToMany(() => Comment, (comment) => comment.recommendation, {
    cascade: true,
  })
  @Field(() => [Comment], { nullable: true })
  comments: Comment[];

  @ManyToOne(() => User, (author) => author.recommendations, {
    onDelete: 'SET NULL',
  })
  @Field(() => User, { nullable: true })
  author: User;

  @CreateDateColumn()
  @Field(() => Date)
  readonly created_at: Date;
}
