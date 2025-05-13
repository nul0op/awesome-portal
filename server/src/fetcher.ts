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
import { ERROR_AWL_NOT_GITHUB, ERROR_AWL_NO_INDEX_PAGE } from './models/error';

// thinks to check
// if README in capital is 404, just try in lowercase
// https://api.github.com/repos/${username}/${repos}/contents/{README|readme}.md
// const AW_ROOT = 'https://api.github.com/repos/sindresorhus/awesome/contents/readme.md';

const AW_BADGE_IS_PRESENT_LIMIT=1*1024;
// const AW_BADGE_REGEX='[![Awesome](https://awesome.re/badge.*svg)](https://awesome.re)'
const AW_BADGE_REGEX='*wesome*';

const GH_TOKEN=process.env.GH_TOKEN;
const GH_RATE_LIMITING = 1           // request / second (5000/3600) => 1/s

let rateLimitedToken = [];

// if the rateLimitedToken list is empty, it means someone took the slot,
// will inject a new token after the delay
let rateLimitInterval = undefined;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// auth is added
//
// 'x-ratelimit-limit', '5000']
// 'x-ratelimit-remaining', '4983']
// 'x-ratelimit-reset', '1747022695']
// 'x-ratelimit-resource', 'core']
// 'x-ratelimit-used', '17']
let ghFetch = async (url, options) => {
    if (rateLimitInterval === undefined) {
        rateLimitInterval = setInterval( () => {
            for (let i = 0; i < GH_RATE_LIMITING; i++) {
                rateLimitedToken.push('I_M_A_TOKEN');
            }
        }, 1000);
    };

    // rate limiting stuff
    if (rateLimitedToken.length === 0) {
        do {
            process.stdout.write(".");
            await sleep(100);
        } while (rateLimitedToken.length === 0)
    }
    rateLimitedToken.pop();

    if (options.headers === undefined) options.headers = {};

    options.headers["Authorization"] = `Bearer ${GH_TOKEN}`;
    let response = await fetch(url, options);

    return response;
} 

/** from here to there:
 * thinks to check
 * if README in capital is 404, just try in lowercase. we give a try using an HEAD request
 * https://api.github.com/repos/${username}/${repos}/contents/{README|readme}.md
 * if the url doesn't looks like a GH repos, throw error "NOT_A_GITHUB_REPO"

 */
let ghGetAPIAddress = async (url: string): Promise<string> => {
    if (!url.startsWith('https://github.com/')) throw ERROR_AWL_NOT_GITHUB;

    let username = url.split('/')[3];
    let repo = url.split('/')[4];
    let apiURL = `https://api.github.com/repos/${username}/${repo}/contents/`;

    let response = null;

    for (let page of ['README.md','readme.md']) {
        console.debug("trying: ", page);
        response = await ghFetch(apiURL+page, {
            method: "HEAD"
        });
        if (response.status === 200) return apiURL+page;
        console.error(response.status, "/", response.statusText);
        for (let header of response.headers.entries()) {
            if (header[0].startsWith('x-ratelimit-'))
                console.log(header);
        };
    }

    throw ERROR_AWL_NO_INDEX_PAGE;
}

// type = heading: this is a category (see text[], level, raw)
// type = list: see body[] and ierate
let recurseAST = (ast, level, headings, elements) => {
    if (!Array.isArray(ast)) return;
    let combo = {
        level: 0,
        headings: [],
        name: null,
        description: null,
        href: null
    };
    let content = [];

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
                recurseAST(node.body, level+1, headings, elements);
                break;

            case "listitem":
                // console.log("listitem: ", node.body.length);
                recurseAST(node.text, level+1, headings, elements);
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

            default:
                // console.log(node);
                recurseAST(node.text, level+1, headings, elements);
                break;
                
        }

        if (combo.level && combo.name && combo.description && combo.href) {
            // console.log(`${ident(level)}> ${headings.join(',')}: [${combo.name}] (${combo.href}) ${combo.description}`);
            combo.headings = headings;
            elements.push(combo);
        }
    }
    return elements;
}

let ident = (level: number) => {
    let ident = '';
    for (let i=0; i<level; i++) {
        ident = ident + '-';
    }
    return ident;
}

let scanAW = async (repo) => {
    let url = null;

    try {
        url = await ghGetAPIAddress(repo);
    } catch (e) {
        // end of this branch
        console.log("Oops");
        return;
    }

    console.debug(`getting index page ${url}`);

    let response: Response = await ghFetch(
        url, {
            method: 'GET',
            headers: { 
                "Accept": "application/vnd.github.v3.raw",
            }
          }
    );

    if (response.status === 301) {
        let redirectURL = response.headers['Location'];
        console.debug(`got a redirect, retrying with: ${redirectURL}`)
        response = await ghFetch(
            url, {
                method: 'GET',
                headers: {
                    "Accept": "application/vnd.github.v3.raw",
                }
              }
        );    
    }

    if (response.status !== 200) throw ERROR_AWL_NO_INDEX_PAGE;

    let content = await response.text();
    let firstHeadingPosition = content.search(/^#/m);
    let markdown = content.substring(firstHeadingPosition);
    let ast = marked.parse(markdown);
    let awesomeElements = recurseAST(ast, 0, [], []);
    console.log(`got ${awesomeElements.length} result`);
    console.log(awesomeElements);

    let max = 5;
    let i = 0;
    for (let element of awesomeElements) {
        if (i++ > max) break;
        // console.log(element);
        scanAW(element.href);
    };

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
