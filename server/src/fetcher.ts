import marked from 'marked-ast';
import dotenv from 'dotenv';
import { AwesomeLink } from './models/Awesome';
import { ERROR_AWL_NOT_GITHUB, ERROR_AWL_NO_INDEX_PAGE } from './models/Error';
import { AW_ROOT } from './models/global';
import { saveLink } from './link.model';

dotenv.config();


const AW_BADGE_IS_PRESENT_LIMIT=1*1024;
const AW_BADGE_REGEX='*wesome*';
const GH_TOKEN=process.env.GH_TOKEN;
const GH_RATE_LIMITING = 1           // request / second (5000/3600) => 1/s

let rateLimitedToken = [];
let rateLimitInterval = undefined;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const awesomeLinks = [];


let throttledFetch = async (url: string, options: RequestInit) => {
    if (rateLimitInterval === undefined) {
        rateLimitInterval = setInterval( () => {
            for (let i = 0; i < GH_RATE_LIMITING; i++) {
                rateLimitedToken.push('I_M_A_TOKEN');
            }
        }, 500);
    };

    if (rateLimitedToken.length === 0) {
        do {
            // process.stdout.write(".");
            await sleep(100);
        } while (rateLimitedToken.length === 0)
    }
    rateLimitedToken.pop();

    if (options.headers === undefined) options.headers = {};

    options.headers["Authorization"] = `Bearer ${GH_TOKEN}`;
    // if (url === null) throw new Error();
    // console.log("===>", url);
    let response = await fetch(url, options);

    return response;
} 

/** 
 * using the github REST api: 
 * - find the README url (can be uppercase or lowercase)
 * - get the project metadata object
 */
let getProjectMeta = async (url: string): Promise<AwesomeLink> => {
    if (!url.startsWith('https://github.com/')) {
        throw new ERROR_AWL_NOT_GITHUB("The website is outside github");
    }

    let username = url.split('/')[3];
    let repo = url.split('/')[4];

    // ex: https://github.com/stackgl, user landing page
    // FIXME: we do not try to index this, should we ?
    if (repo === undefined) {
        throw new ERROR_AWL_NO_INDEX_PAGE("The page looks like user landing page, not a project landing page");
    }

    let apiURL = `https://api.github.com/repos/${username}/${repo}/contents/`;

    let projectMeta = new AwesomeLink();
    let response = null;

    for (let page of ['README.md','readme.md']) {
        response = await throttledFetch(apiURL+page, {
            method: "HEAD"
        });

        if (response.status === 200) {
            projectMeta.readmeUrl = apiURL+page;
            break;
        }
    }

    if (!projectMeta.readmeUrl)
        throw new ERROR_AWL_NO_INDEX_PAGE('There is no README file to look at in this project');

    apiURL = `https://api.github.com/repos/${username}/${repo}`;
    response = await throttledFetch(apiURL, {
        method: "GET"
    });

    if (response.status === 200) {
        let data = await response.json();
        projectMeta.name = data.name || "";
        projectMeta.description = data.description || "";
        projectMeta.subscribersCount = data.subscriber_count || 0;
        projectMeta.watchersCount = data.watchers_count || 0
        projectMeta.cloneUrl = data.clone_url || "";
        projectMeta.originUrl = url;
    }

    // console.debug("  found metadata: ", projectMeta);
    return projectMeta;
}

// type = heading: this is a category (see text[], level, raw)
// type = list: see body[] and ierate
let recurseAST = (ast, level, headings, foundLinks: AwesomeLink[]) => {
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
                recurseAST(node.body, level+1, headings, foundLinks);
                break;

            case "listitem":
                // console.log("listitem: ", node.body.length);
                recurseAST(node.text, level+1, headings, foundLinks);
                break;

            case "link":
                // we ignore local ref (#xxx). just keep track of the title hierarchy
                if (node && node.text && node.text.length > 0) {
                    if (node.href[0] === '#') { continue };
                    combo.name = node.text[0];
                    combo.href = node.href.replace('#readme','');

                    // sometimes links don't have a description, we know that because the link node had 0 text sibling
                    if (ast.length === 1) combo.description = "";
                }
                break;

            default:
                recurseAST(node.text, level+1, headings, foundLinks);
                break;
                
        }

        // normalise what we can
        if (combo.level && combo.name && combo.description && combo.href) {
            combo.headings = headings;
            let link = new AwesomeLink();
            link.description = combo.description.replace(/^.-./,'');
            link.name = combo.name;
            link.level = combo.level;
            link.readmeUrl = combo.href;
            foundLinks.push(link);
        }
    }
    return foundLinks;
}

let ident = (level: number) => {
    let ident = '';
    for (let i=0; i<level; i++) {
        ident = ident + '-';
    }
    return ident;
}

// scanning individual URL found on an Awesome List page (README.md)
// it can be another Awesome list to follow or a project page outside of github (we stop at il)
// allong the way, we try to gather as much informations as we can on the content hosted
//
let scanAW = async (repo: string, depth: number) => {
    console.debug(`[${depth}]: scanning git repository: ${repo}`);
    let projectMeta = null;

    try {
        projectMeta = await getProjectMeta(repo);

    } catch (error) {
        // FIXME: find a way to save get usefull metadata from website outside GitHub ?
        // FIXME: go get the HEAD of the website and the META tags ?";
        // FIXME: why should i go look at the constructor ?
        // FIXME: get head and use last-modified: Thu, 08 May 2025 08:35:35 GMT (curl --head https://nodejs.org/api/fs.html)
        if (error.constructor.name === "ERROR_AWL_NOT_GITHUB") {
            console.log(`  AWESOME: found an individual project outside GitHub. saving it to the index`);
            let projectMeta = new AwesomeLink();
            projectMeta.description = "Unknown, outside GitHub !";
            projectMeta.subscribersCount = 0;
            projectMeta.watchersCount = 0
            projectMeta.cloneUrl = null;
            projectMeta.readmeUrl = null;
            projectMeta.originUrl = repo;
            console.log("  SAVING: ", projectMeta);
            saveLink(projectMeta);
            return;
        }

        console.debug(`  no index page found (${error.message})`);
        return;
    }

    // if (!projectMeta.getReadmeUrl()
    //     || !projectMeta.getReadmeUrl().startsWith('http')) 
    //     console.log("  ")
    //     throw ERROR_AWL_NO_INDEX_PAGE;
    // console.log(projectMeta);
    let response: Response = await throttledFetch(
        projectMeta.readmeUrl, {
            method: 'GET',
            headers: { 
                "Accept": "application/vnd.github.v3.raw",
            }
          }
    );

    if (response.status === 301) {
        let redirectUrl = response.headers['Location'];
        console.debug(`  got a redirect, retrying with: ${redirectUrl}`)
        response = await throttledFetch(
            redirectUrl, {
                method: 'GET',
                headers: {
                    "Accept": "application/vnd.github.v3.raw",
                }
              }
        );    
    }

    if (response.status !== 200) {
        console.debug(`  unable to fetch index page: ${response.status}. 
            Terminating this branch (nothing to save)`);
        throw new ERROR_AWL_NO_INDEX_PAGE(`code ${response.status} while fetching the project readme`);
    }

    let content = await response.text();

    // we are still on GitHub, but not on an "Awesome" page.
    // grep some info from the repos and terminate the branch
    if (
        repo !== AW_ROOT &&
        !content.match(/https\:\/\/awesome\.re\/badge/)) {

        // we have reached an leaf, go get the project metadata before closing this branch
        console.log(`  AWESOME: found an individual project inside GitHub. saving it to the index`);
        // FIXME: save it !
        console.log("  SAVING: ", projectMeta);
        await saveLink(projectMeta);
        // terminating the branch
        return [];
    };
    
    // at this point, we are on a README, tagged as an Awesome List content
    // remove garbage html header from github
    console.log("  looks like an Awesome index, walk over it.")

    let firstHeadingPosition = content.search(/^#/m);
    let markdown = content.substring(firstHeadingPosition);
    let ast = marked.parse(markdown);
    let awesomeLinks = recurseAST(ast, 0, [], []);

    console.log(`  found ${awesomeLinks.length} links`);

    let max = 99;
    let i = 0;
    for (let link of awesomeLinks) {
        if (i++ > max) break;
        await scanAW(link.readmeUrl, depth++);
    };

    return awesomeLinks;
}

export { scanAW, awesomeLinks };
