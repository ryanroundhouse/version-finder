/* eslint-disable @typescript-eslint/no-inferrable-types */
export class Family {
  id: number = Math.random();
  name: string = '';

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export default Family;
