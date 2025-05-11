import express from 'express';
import { scanAW } from './fetcher';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, async () => {
    await scanAW();

    return console.log(`Express is listening at http://localhost:${port}`);
});

// (async () => {
//     console.log("hi");
//     await scanAW();
//     console.log("ho");
// })