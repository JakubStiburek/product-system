import { v4 } from 'uuid';
import { ProductId } from './product-id.vo';
import { Product } from './product.entity';

describe('Product', () => {
  it('should create valid instance', () => {
    expect(() =>
      Product.create(ProductId.create(v4()), 'name', 100),
    ).not.toThrow();
  });

  it('should reject negative price', () => {
    expect(() =>
      Product.create(ProductId.create(v4()), 'name', -100),
    ).toThrow();
  });

  it('should reject float price', () => {
    expect(() =>
      Product.create(ProductId.create(v4()), 'name', 10.01),
    ).toThrow();
  });
});
