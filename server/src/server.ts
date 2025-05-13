import express from 'express';
import { scanAW, awesomeLinks } from './fetcher';
import { getAll } from './link.model';

const app = express();
const port = 3000;
const AW_ROOT = 'https://github.com/sindresorhus/awesome';

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/links', (req, res) => {
  res.send(getAll());
});

app.listen(port, async () => {
    await scanAW(AW_ROOT);

    console.log("FOUND: ", awesomeLinks.length);

    for (let link of awesomeLinks) {
      if (link.level === 2) {
        console.log(link.href)
      }
    }

    return console.log(`Express is listening at http://localhost:${port}`);
});
