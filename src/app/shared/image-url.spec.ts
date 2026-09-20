import { optimizedImageUrl } from './image-url';

describe('optimizedImageUrl', () => {
  it('adds Cloudinary delivery transformations at the requested width', () => {
    expect(
      optimizedImageUrl(
        'https://res.cloudinary.com/example/image/upload/v1/product.jpg',
        96
      )
    ).toBe(
      'https://res.cloudinary.com/example/image/upload/f_auto,q_auto,c_limit,w_96/v1/product.jpg'
    );
  });
});
