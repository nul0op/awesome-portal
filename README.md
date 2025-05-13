# Context

"Awesome Lists" are manually curated list of links/materials for a given topic.

Those lists are stored in githib repos README.md files, following a structured content: https://github.com/sindresorhus/awesome/blob/main/awesome.md

The master page, referencing all lists: https://github.com/sindresorhus/awesome

# Previous attempts

- https://www.trackawesomelist.com/: still running, sumarize updates by day/week on the list content.

    Also allow full text search through the lists.

    based on custom script (JS). Coupled with github api to get lists metadata

# Objectives

Find a way make access to those lists content in a more "enjoyable" way, groupedb by categories, sortable in meaninglu ways, putting togheter many metadata. 

In no particular order/priority:
    - list metadata => taken from MD headings around a content
    - list content => git blame on README.md line
    - AWL content target wwebsite: 
        - is the page updated and how often ?
        - is the link broken or 200 ?
        - page content type: textual, video, AD divs, ...

Content will be available as a responsive website (desktop, mobile).

publishing structured data through a public API is also in mind.

# Infrastutructure

The approach in this project is:
- we are not planning to use Github api (may change)
- Master data list (YAML) will be taken from awesome-list-watcher project (1 file, YAML formatted)
- all pages will be fetched locally

Front End:
- React material UI
- TypeScript JS

Backend:
- Express
- PostgreSQL
- knex database layer abstraction
- Markdown DB as markdown abstraction layer


# Tools

During the developement, i found some usefull online/offline tools to help. here is the list
- github cli
- AST explorer: https://astexplorer.net/
- https://www.epochconverter.com/ (to see how many minutes i have to wait against the gitlab api ate limiting when the code goes wild)
- 

# Sources
- https://docs.github.com/en/rest/rate-limit/rate-limit?apiVersion=2022-11-28

# challenges

## Gitlab API rate limiting

for unauthenticated request is 60 requests / hour. way to low
making authenticated calls with personal token raise it to 5000 requests / hour. this is okay, but we made up to 5 requests / repo for the scanning process.
we need to throttle the code.


## index page content

many README does include html that makes it difficult to parse.
ex: curl -H 'Accept: application/vnd.github.v3.raw' https://api.github.com/repos/sindresorhus/awesome/contents/readme.md

```
<br>
<hr>
<br>
<br>
<a href="https://vshymanskyy.github.io/StandWithUkraine">
	<img src="https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg">
</a>
<br>
<br>
<hr>
<br>
```