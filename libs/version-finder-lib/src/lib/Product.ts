/* eslint-disable @typescript-eslint/no-inferrable-types */
export class Product {
  id: number;
  name: string;
  productType?:
    | 'CIS Releases'
    | '7 Module Releases'
    | 'Addon Releases'
    | 'NSBL Releases';

  constructor(
    id: number,
    name: string,
    productType?:
      | 'CIS Releases'
      | '7 Module Releases'
      | 'Addon Releases'
      | 'NSBL Releases'
  ) {
    this.id = id;
    this.name = name;
    this.productType = productType;
  }
}

export default Product;
