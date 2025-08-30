import { v4 } from 'uuid';
import { ReviewId } from './review-id.vo';
import { ProductId } from '../products/product-id.vo';
import { Review } from './review.entity';
import { InvalidInstanceException } from '../../common/utils/exceptions/invalid-instance.exception';

describe('Review', () => {
  it('should create valid instance', () => {
    expect(() =>
      Review.create(
        ReviewId.create(v4()),
        ProductId.create(v4()),
        'John',
        'Doe',
        'Great product!',
        5,
      ),
    ).not.toThrow();
  });

  it('should reject rating below 1', () => {
    expect(() =>
      Review.create(
        ReviewId.create(v4()),
        ProductId.create(v4()),
        'John',
        'Doe',
        'Bad product',
        0,
      ),
    ).toThrow(InvalidInstanceException);
  });

  it('should reject rating above 5', () => {
    expect(() =>
      Review.create(
        ReviewId.create(v4()),
        ProductId.create(v4()),
        'John',
        'Doe',
        'Amazing product',
        6,
      ),
    ).toThrow(InvalidInstanceException);
  });

  it('should reject float rating', () => {
    expect(() =>
      Review.create(
        ReviewId.create(v4()),
        ProductId.create(v4()),
        'John',
        'Doe',
        'Good product',
        4.5,
      ),
    ).toThrow(InvalidInstanceException);
  });

  it('should do full review update', () => {
    const original = Review.create(
      ReviewId.create(v4()),
      ProductId.create(v4()),
      'John',
      'Doe',
      'Great product!',
      5,
    );

    const updated = {
      firstName: 'Jane',
      lastName: 'Smith',
      content: 'Updated review content',
      rating: 4,
    };

    original.update(updated);

    expect(original.firstName).toStrictEqual(updated.firstName);
    expect(original.lastName).toStrictEqual(updated.lastName);
    expect(original.content).toStrictEqual(updated.content);
    expect(original.rating).toStrictEqual(updated.rating);
  });

  it('should do partial review update', () => {
    const old = {
      firstName: 'John',
      lastName: 'Doe',
      content: 'Great product!',
      rating: 5,
    };

    const original = Review.create(
      ReviewId.create(v4()),
      ProductId.create(v4()),
      old.firstName,
      old.lastName,
      old.content,
      old.rating,
    );

    const updated = {
      firstName: 'Jane',
      rating: 4,
    };

    original.update(updated);

    expect(original.firstName).toStrictEqual(updated.firstName);
    expect(original.lastName).toStrictEqual(old.lastName);
    expect(original.content).toStrictEqual(old.content);
    expect(original.rating).toStrictEqual(updated.rating);
  });

  it('should fail to update review with invalid rating', () => {
    const original = Review.create(
      ReviewId.create(v4()),
      ProductId.create(v4()),
      'John',
      'Doe',
      'Great product!',
      5,
    );

    const updated = {
      rating: 6,
    };

    expect(() => original.update(updated)).toThrow(InvalidInstanceException);
  });
});
