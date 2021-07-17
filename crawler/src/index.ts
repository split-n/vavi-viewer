import * as vavi from "vavi"
import { CaptchaRequestPublisher as CaptchaSolveRequestPublisher } from "./CaptchaRequestPublisher";
import { CaptchaInput, CaptchaRequest, CrawlRequest } from "vavi-viewer-shared";
import { v4 as uuidv4 } from 'uuid';

import express from "express";
import { CaptchaInputSubscriber } from "./CaptchaInputSubscriber";

let crawler: vavi.VaViCrawler;

const topic_captchaSolveRequest = 'vaviewer_captcha_solve_request'
const topic_captchaSolved = 'vaviewer_captcha_solved';
const sub_captchaSolved = topic_captchaSolved + '_sub';

const captchaSolveRequestPublisher = new CaptchaSolveRequestPublisher(topic_captchaSolveRequest);
const subscriber = new CaptchaInputSubscriber(topic_captchaSolved, sub_captchaSolved);

const app = express();

app.use(express.json());

app.post('/', async (req, res, next) => {
  try{
    console.log(req.body);
    if (!req.body) {
      const msg = 'no Pub/Sub message received';
      console.error(`error: ${msg}`);
      res.status(400).send(`Bad Request: ${msg}`);
      return;
    }
    if (!req.body.message) {
      const msg = 'invalid Pub/Sub message format';
      console.error(`error: ${msg}`);
      res.status(400).send(`Bad Request: ${msg}`);
      return;
    }
  
    const pubSubMessageData = Buffer.from(req.body.message.data, 'base64').toString();
    const creq = JSON.parse(pubSubMessageData) as CrawlRequest;
  
    if(!creq.loginCardInfo) {
      res.status(400).send('Bad Request: no card info');
      return;
    }
  
    await startCrawl(creq.loginCardInfo);
  
    res.status(204).send();
  }catch(error) {
    next(error);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});


async function startCrawl(loginCardInfo: vavi.LoginCardInfo) {
  crawler ||= await vavi.launch({executablePath: 'google-chrome-stable'});
  let captchaOrResult: vavi.CaptchaInterruption | vavi.CardUsageStats;
  
  captchaOrResult = await crawler.getCardUsageStats(loginCardInfo);

  while(true) {
    if(captchaOrResult instanceof vavi.CaptchaInterruption) {
      const cr = new CaptchaRequest();
      cr.imageDataUrl = captchaOrResult.captchaImage;
      cr.uuid = uuidv4();
      captchaSolveRequestPublisher.publishMessage(cr);

      let input: CaptchaInput;
      while(true) {
        input = await subscriber.waitForInputMessage(cr.uuid);
        if(input.answer) {
          captchaOrResult = await captchaOrResult.continueFunc(input.answer);
          break;
        }
      }
    } else {
      console.log(captchaOrResult);
      return;
    }
  }

};
