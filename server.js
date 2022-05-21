require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const createSdk = require('invest-nodejs-grpc-sdk');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// API calls
app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/world', async(req, res) => {
  console.log(req.body);
  console.log('process.env.TOKEN', process.env.TOKEN);
  const { instruments } = createSdk.createSdk(process.env.TOKEN);
  const schedule = await instruments.tradingSchedules({
    from: new Date('2022-05-20T15:00:00Z'),
    to: new Date('2022-05-20:20:55:59Z'),
    exchange: 'MOEX',
  });
  const scheduleAll = await instruments.tradingSchedules({
    from: new Date('2022-05-20T15:00:00Z'),
    to: new Date('2022-05-20:20:55:59Z'),
  });
  console.log(schedule, scheduleAll);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
    
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));