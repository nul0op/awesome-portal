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

// class User {
//   constructor (private jwtToken: string|null = null, private name: string|null = null) {
//     this.jwtToken=jwtToken;
//     this.name=name;
//   }

//   setToken(token: string) {
//     this.jwtToken = token;
//   }

//   setName(name: string) {
//     this.name = name;
//   }

//   getName(): string|null {
//     return this.name;
//   }

//   getToken(): string {
//     if (this.jwtToken === null) return ""
//     return this.jwtToken;
//   }

//   isLogged(): boolean {
//     return this.jwtToken ? true : false;
//   }

//   logout(): void {
//     this.jwtToken = null;
//   }

//   toString(): String {
//     return `name: ${this.name}, isLogged: ${this.isLogged()}, token (redacted): ${this.jwtToken?.substring(1,10)}`;
//   }
// }

// export type {
//   "xxx",
// };

// // Class objects
// export {
//   yyy
// };