class AwesomeLink {
    private level: number = null;
    private name: string = null;
    private description: string = null;
    private href: string = null;

  constructor (
    // private jwtToken: string|null = null, 
    // private name: string|null = null
    ) {
    // this.jwtToken=jwtToken;
    // this.name=name;
  }

  setLevel(level: number) {
    this.level = level;
  }

  setName(name: string|null) {
    this.name = name;
  }

  setDescription(description: string) {
    this.description = description;
  }

  setHref(href: string|null) {
    this.href = href;
  }

  getLevel(): number|null {
    return this.level;
  }

  getName(): string|null {
    return this.name;
  }

  getDescription(): string|null {
    return this.description;
  }

  getHref(): string {
    // if (this.href === null) return ""
    return this.href;
  }
}

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

// Class objects
export {
    AwesomeLink
};