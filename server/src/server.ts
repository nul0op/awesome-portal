import express from 'express';
import { scanAW, awesomeLinks } from './fetcher';
import { getAllLink, saveLink } from './link.model';
import { AwesomeLink } from './models/Awesome';
import { AW_ROOT } from './models/global';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/links', (req, res) => {
  res.send(getAllLink());
});

app.listen(port, async () => {
  let awesomeLinks: AwesomeLink[] = await scanAW(AW_ROOT);

  for (let link of awesomeLinks) {
    await saveLink(link);
  }

  return console.log(`Express is listening at http://localhost:${port}`);
});
