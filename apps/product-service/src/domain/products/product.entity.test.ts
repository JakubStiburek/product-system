import { v4 } from 'uuid';
import { ProductId } from './product-id.vo';
import { Product } from './product.entity';
import { InvalidInstanceException } from '../../common/utils/exceptions/invalid-instance.exception';

describe('Product', () => {
  it('should create valid instance', () => {
    expect(() =>
      Product.create(ProductId.create(v4()), 'name', 100),
    ).not.toThrow();
  });

  it('should reject negative price', () => {
    expect(() => Product.create(ProductId.create(v4()), 'name', -100)).toThrow(
      InvalidInstanceException,
    );
  });

  it('should reject float price', () => {
    expect(() => Product.create(ProductId.create(v4()), 'name', 10.01)).toThrow(
      InvalidInstanceException,
    );
  });

  it('should do full product update', () => {
    const original = Product.create(ProductId.create(v4()), 'name', 100);

    const updated = {
      name: 'new name',
      price: 500,
      description: 'new description',
    };

    original.update(updated);

    expect(original.name).toStrictEqual(updated.name);
    expect(original.price).toStrictEqual(updated.price);
    expect(original.description).toStrictEqual(updated.description);
  });

  it('should do partial product update', () => {
    const old = {
      name: 'name',
      price: 100,
      description: 'description',
    };

    const original = Product.create(
      ProductId.create(v4()),
      old.name,
      old.price,
      old.description,
    );

    const updated = {
      name: 'new name',
    };

    original.update(updated);

    expect(original.name).toStrictEqual(updated.name);
    expect(original.price).toStrictEqual(old.price);
    expect(original.description).toStrictEqual(old.description);
  });

  it('should remove description', () => {
    const old = {
      name: 'name',
      price: 100,
      description: 'description',
    };

    const original = Product.create(
      ProductId.create(v4()),
      old.name,
      old.price,
      old.description,
    );

    const updated = {
      description: null,
    };

    original.update(updated);

    expect(original.name).toStrictEqual(old.name);
    expect(original.price).toStrictEqual(old.price);
    expect(original.description).toBeUndefined();
  });

  it('should fail to update product', () => {
    const original = Product.create(ProductId.create(v4()), 'name', 100);

    const updated = {
      price: -500,
    };

    expect(() => original.update(updated)).toThrow(InvalidInstanceException);
  });
});
