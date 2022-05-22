import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express, {Request, Response} from 'express';
import { type } from 'os';
import path from 'path';

const createSdk = require('invest-nodejs-grpc-sdk');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

type TypedRequestBody<T> = Request & {
  body: T;
}

type ExchangeScheduleFormData = {
  from: string;
  to: string;
  exchange?: string;
};

type ExchangeScheduleReq = TypedRequestBody<ExchangeScheduleFormData>;

// API calls
app.get('/api/hello', (req: Request, res: Response) => {
  res.send({express: 'Hello From Express'});
});

app.post('/api/test-token', async (req: Request, res: Response) => {
  if (process.env.TOKEN) {
    res.status(404).send('Token not found, place it in .env file');
  }
  res.send(
      `TOKEN is valid, everything is ok`,
  );
});

const tempToken = 't.EaKSOQf4DkeAubaVyGZgLHxK8u_EcV2Lk3kDwx8NCcHhBsKkmk9ap9cqcvfzYHm2BO1opD_EM5PLAZXHc3apzQ';

app.post('/api/get-schedule', async (req: ExchangeScheduleReq, res: Response) => {
  const {instruments} = createSdk.createSdk(process.env.TOKEN || tempToken);
  console.log('starting making request', req.body);
  const schedule = instruments.tradingSchedules({
    from: new Date(req.body.from),
    to: new Date(req.body.to),
    ...(req.body.exchange && { exchange: req.body.exchange}),
  });

  return schedule
    .then((result: string) => res.status(200).send(result))
    .catch((err: Error) => {
      console.log('error', err);
      res.status(500).send(JSON.stringify(err.message));
    });
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(process.cwd(), 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req: Request, res: Response) {
    res.sendFile(path.join(process.cwd(), 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));

export {};