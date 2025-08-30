import {
  Entity,
  ObjectIdColumn,
  ObjectId,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('product_review_aggregates')
export class ProductReviewAggregate {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  @Index()
  productId: string;

  @Column()
  reviewCount: number;

  @Column()
  ratingSum: number;

  @Column('decimal', { precision: 3, scale: 2 })
  averageRating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

