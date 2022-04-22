require('dotenv').config();
const cors = require('cors')
const express = require('express');
const fs = require('fs');
const app = express();
const { PORT, MONGO_URI } = process.env;
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); 
const APP = './app/routes'
const nodes = ['board', 'user']
for(const leaf of nodes){
  require(`${APP}/${leaf}.route`)({url:`/api/${leaf}`,app})
}
require(`${APP}/user.route`)({url:`/api/user`,app})
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 
}
app.listen(PORT, () => {
  console.log('***************** ***************** *****************')
  console.log('********** The server is running normally. *********')
  console.log('***************** ***************** *****************')
})
app.get('/', (req, res) => {
  res.send("Hello!");
})
app.get('/api/now', cors(corsOptions),(req, res) => {
  res.json({"now":new Date().toLocaleString()})
})

app.get("/ft/:startIndex", cors(corsOptions) ,(req, res) => {
  fs.readFile("./contents/csv/Korea_Development_Bank_financial_terms_2015.csv", "utf-8", (err, data) => {
      let FTList = data.split("\r\n");
      const startIndex = parseInt(req.params.startIndex)
      const endIndex = startIndex + 20;
      res.json(FTList.slice(startIndex, endIndex));
  });
});
