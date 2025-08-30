import { v4, v7 } from 'uuid';
import { ProductId } from './product-id.vo';

describe('ProductId', () => {
  it('should create valid isntance', () => {
    expect(() => ProductId.create(v4())).not.toThrow();
  });

  it('should reject invalid uuid version', () => {
    expect(() => ProductId.create(v7())).toThrow();
  });
});
