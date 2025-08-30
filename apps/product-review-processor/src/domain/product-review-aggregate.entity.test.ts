import { v4 } from 'uuid';
import { ProductId } from './product-id.vo';
import { ProductReviewAggregate } from './product-review-aggregate.entity';
import { ProductReviewAggregateId } from './product-review-aggregate-id.vo';

describe('ProductReviewAggregate', () => {
  let aggregate: ProductReviewAggregate;

  beforeEach(() => {
    aggregate = ProductReviewAggregate.create(
      ProductReviewAggregateId.create('id'),
      ProductId.create(v4()),
      5,
      25,
      5,
    );
  });

  it('should add review', () => {
    aggregate.addReview(1);

    expect(aggregate.reviewCount).toStrictEqual(6);
    expect(aggregate.ratingSum).toStrictEqual(26);
    expect(aggregate.averageRating).toStrictEqual(4.33);
  });

  it('should ignore out-of-bounds rating', () => {
    aggregate.addReview(17);

    expect(aggregate.reviewCount).toStrictEqual(5);
    expect(aggregate.ratingSum).toStrictEqual(25);
    expect(aggregate.averageRating).toStrictEqual(5);

    aggregate.removeReview(17);

    expect(aggregate.reviewCount).toStrictEqual(5);
    expect(aggregate.ratingSum).toStrictEqual(25);
    expect(aggregate.averageRating).toStrictEqual(5);
  });

  it('should remove review', () => {
    aggregate.removeReview(5);

    expect(aggregate.reviewCount).toStrictEqual(4);
    expect(aggregate.ratingSum).toStrictEqual(20);
    expect(aggregate.averageRating).toStrictEqual(5);
  });

  it('should ignore review going under 1 reveiw count', () => {
    aggregate.reviewCount = 1;
    aggregate.averageRating = 1;
    aggregate.ratingSum = 1;
    aggregate.removeReview(5);

    expect(aggregate.reviewCount).toStrictEqual(1);
    expect(aggregate.ratingSum).toStrictEqual(1);
    expect(aggregate.averageRating).toStrictEqual(1);
  });
});
