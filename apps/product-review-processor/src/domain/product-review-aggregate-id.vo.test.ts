import { ProductReviewAggregateId } from './product-review-aggregate-id.vo';

describe('ProductReviewAggregateId', () => {
  it('should create valid instance', () => {
    expect(() => ProductReviewAggregateId.create('id')).not.toThrow();
  });
});
