import express from 'express';
import { getAllLink, saveLink } from './link.model';
import cors from 'cors';
import authenticateToken from '../middleware/authenticateToken';

// import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
// app.use(express.static(path.join(__dirname, '../client/dist')));

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// app.get('/links', async (req, res) => {
app.get('/links', authenticateToken, async (req, res) => {
  res.send(await getAllLink(req.query["search"].toString()));
});

app.listen(port, async () => {
  // let awesomeLinks: AwesomeLink[] = await scanAW(AW_ROOT, 0);

  // console.log(awesomeLinks.length);
  // for (let link of awesomeLinks) {
  //   await saveLink(link);
  // }  

  // this one
  // await scanAW(AW_ROOT, 0);

  return console.log(`Express is listening at http://localhost:${port}`);
});
