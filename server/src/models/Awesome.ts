import md5 from 'md5';

class AwesomeLink {
    private level: number = null;
    private name: string = null;
    private description: string = null;
    private href: string = null;
    private externalId: string = null;

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

    getExternalId(): string {
        return md5(this.href);
    }
}


class AwesomeProject {
    private name: string = null;
    subscriberCount: number = 0;
    watchersCount: number = 0;
    description: string = null;
    cloneUrl: string = null;
    readmeUrl: string = null;

    setReadmeUrl(url: string) {
        this.readmeUrl = url;
    }

    setName(name: string|null) {
        this.name = name;
    }

    getReadmeUrl(): string {
        return this.readmeUrl;
    }

    getName(): string {
        if (this.name === null) return "Unspecified";
        return this.name;
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
    AwesomeLink,
    AwesomeProject
};