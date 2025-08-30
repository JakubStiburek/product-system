import { v4, v7 } from 'uuid';
import { ReviewId } from './review-id.vo';
import { InvalidInstanceException } from '../../common/utils/exceptions/invalid-instance.exception';

describe('ReviewId', () => {
  it('should create valid instance', () => {
    expect(() => ReviewId.create(v4())).not.toThrow();
  });

  it('should reject invalid uuid version', () => {
    expect(() => ReviewId.create(v7())).toThrow(InvalidInstanceException);
  });
});
