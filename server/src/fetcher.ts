/*
 * starting from https://github.com/sindresorhus/awesome
 * - recursively fetch all README.md (using git) until it points no more to an awesome list
 * - if a README.md contains the awesome badge, it will be scanned, otherwise, scan for this branch is stopped 
 *   this is when this text appear in the first half of the README: [![Awesome](https://awesome.re/badge.*svg)](https://awesome.re)

 * - 
 * - check for duplicates
*/
// import * as cheerio from 'cheerio';
import marked from 'marked-ast';

// const AW_ROOT='https://raw.githubusercontent.com/sindresorhus/awesome/refs/heads/main/readme.md'
// const AW_ROOT='https://github.com/sindresorhus/awesome/tree/main';
// const AW_ROOT = 'https://raw.githubusercontent.com/sindresorhus/awesome/refs/heads/main/readme.md';
// const AW_ROOT = 'https://github.com/agucova/awesome-esp#readme';
// const AW_ROOT = 'https://github.com/biologist79/ESPuino';
const AW_ROOT = ' https://api.github.com/repos/sindresorhus/awesome/contents/readme.md';
const AW_BADGE_IS_PRESENT_LIMIT=1*1024;
// const AW_BADGE_REGEX='[![Awesome](https://awesome.re/badge.*svg)](https://awesome.re)'
const AW_BADGE_REGEX='*wesome*';

/** from here to there:
 * https://github.com/michelpereira/awesome-games-of-coding#readme
 * https://raw.githubusercontent.com/michelpereira/awesome-games-of-coding/refs/heads/main/readme.md
 */
let ghGetRawAddress = (url: string) => {
    let url1 = url.replace('https://github.com/','https://raw.githubusercontent.com/');
    let url2 = url1.replace('#readme','');
    let url3 = url2 + '/refs/heads/main/README.md';
    return url3;
}

// type = heading: this is a category (see text[], level, raw)
// type = list: see body[] and ierate
let recurseAST = (ast, level, headings) => {
    if (!Array.isArray(ast)) return;
    let combo = {
        level: 0,
        name: null,
        description: null,
        href: null
    };

    for (let node of ast) {
        let type = node.type;
        let name = null;
        let href = null;
        let description = null;

        combo.level = level;

        // this is the text description of the current bullet/node
        if (typeof(node) === 'string') {
            // if it happens we will reach a link at the same level, here we have te description (right part) of the link
            combo.description = node;     // as a string
        }

        switch (type) {
            case "heading":
                // if the level if bigger than the preceding, concatenate, otherwise, remove it
                if (headings.length === node.level) {
                    headings.pop();
                    headings.push(node.text[0]);

                } else if (headings.length <= node.level) {
                    headings.pop();
                    headings.pop();
                    headings.push(node.text[0]);

                } else {
                    headings.push(node.test[0]);
                }
                break;

            case "list":
                recurseAST(node.body, level+1, headings);
                break;

            case "listitem":
                // console.log("listitem: ", node.body.length);
                recurseAST(node.text, level+1, headings);
                break;

            case "link":
                // we ignore local ref (#xxx). just keep track of the title hierarchy
                if (node && node.text && node.text.length > 0) {
                    if (node.href[0] === '#') { continue };
                    combo.name = node.text[0];
                    combo.href = node.href;

                    // sometimes links don't have a description, we know that because the link node had 0 text sibling
                    if (ast.length === 1) combo.description = "EMPTY";
                }
                break;
        }

        if (combo.level && combo.name && combo.description && combo.href) {
            console.log(`${ident(level)}> ${headings.join(',')}: [${combo.name}] (${combo.href}) ${combo.description}`);
        }
    }
    return
}

let ident = (level: number) => {
    let ident = '';
    for (let i=0; i<level; i++) {
        ident = ident + '-';
    }
    return ident;
}

let scanAW = async () => {
    // let url: string = ghGetRawAddress(AW_ROOT);
    // console.log("getting url: ", url);
    let url: string = AW_ROOT;
    const headers = new Headers();
    headers.set("Accept", "application/vnd.github.v3.raw");

    let response: Response = await fetch(
        url, {
            method: 'GET',
            headers: headers
          }
    );
    // console.log(response);
    if (response.status === 200) {
        let content = await response.text();
        let firstHEadingPosition = content.search(/^#/m);
        let markdown = content.substring(firstHEadingPosition);

        // temp
        // markdown = markdown.substring(0,2000);
        let ast = marked.parse(markdown);
        // console.log(JSON.stringify(ast));
        recurseAST(ast, 0, []);
    } else if (response.status === 301) {
        console.log("Oops: redirect for ", url);
    
    } else {
        console.log("Oops: other error: ", response.status, " for: ", url)
    }

    // const $ = cheerio.load(content);

    // // AW badge must be present or bailout
    // console.log(content);
    // let hasBadge = content.match(/BADGE_REGEX/)
    // if (hasBadge && hasBadge.length > 0) {
    //     console.log("This is a list");
    // } else {
    //     console.log("This is not a AW list");
    // }

    // // console.log(content);

    // $('a').each( (index, element) => {
    //     const link = $(element).attr('href');
    //     // console.log(link);
    // })
    // // const $ = await cheerio.fromURL(AW_ROOT);

}

export { scanAW };
