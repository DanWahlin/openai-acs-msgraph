import express from 'express';
import cors from 'cors';
import apiRoutes from './server/apiRoutes.mjs';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
