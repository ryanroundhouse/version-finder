/* eslint-disable @typescript-eslint/no-inferrable-types */
export class Product {
  id: number = Math.random();
  name: string = '';

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export default Product;
