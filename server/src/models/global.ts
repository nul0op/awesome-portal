class AwesomeUser {
  private _id: number;
  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    this._id = value;
  }
  
  private _external_id: string;
  public get externalId(): string {
    return this._external_id;
  }
  public set externalId(value: string) {
    this._external_id = value;
  }

  private _name: string;
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

  private _email: string;
  public get email(): string {
    return this._email;
  }
  public set email(value: string) {
    this._email = value;
  }

}



// // enums, interfaces, types & classes for an awSource object

// type myType =
//   | "val1"
//   | "val2" ;

// enum MyEnum {
//   like = "like",
//   visit = "visit",
//   pin = "pin",
// }

// interface MyInterface {
//   name: string;
//   rating: number;
//   address: string;
//   url: string;
//   openNow: boolean;
//   id: string;
//   visit: boolean;
//   like: boolean;
//   pin: boolean;
//   servesFeatures: Array<string>;
//   generativeSummary: string;
// }

// export type {
//   "xxx",
// };

const AW_ROOT = 'https://github.com/sindresorhus/awesome';

export {
  AW_ROOT,
  AwesomeUser
};