import express from 'express';
import { getAllLink, saveLink } from './link.model';
import cors from 'cors';
import authenticateToken from '../middleware/authenticateToken';
import { saveUser } from './user.model';
import { AW_ROOT } from './models/global';
import { scanAW } from './fetcher';

export let indexingState = {
  paused: true,
  numberOfEntriesIndexed: 0,
  runner: () => {}
};

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('../client/dist'));

app.get('/links', authenticateToken, async (req, res) => {
  saveUser(req);

  res.send(await getAllLink(req.query["search"].toString()));
});

app.post('/index/restart', authenticateToken, async (req, res) => {
  indexingState.paused = false;

  res.status(200);
  res.send("indexing restarted");
  await scanAW(AW_ROOT, 0);
});

app.post('/index/pause', authenticateToken, async (req, res) => {
  indexingState.paused = true;

  res.status(200);
  res.send("indexing paused");
  await scanAW(AW_ROOT, 0);
});

app.get('/index/status', authenticateToken, async (req, res) => {
  res.status(200);
  let rows = await getAllLink("");

  indexingState.numberOfEntriesIndexed = rows.length
  res.send(indexingState);
});



app.listen(port, async () => {
  // let awesomeLinks: AwesomeLink[] = await scanAW(AW_ROOT, 0);

  // console.log(awesomeLinks.length);
  // for (let link of awesomeLinks) {
  //   await saveLink(link);
  // }  

  // lauching the indexer as a background task
  let runnerPromise = scanAW(AW_ROOT, 0);

  return console.log(`Express is listening at http://localhost:${port}`);
});
