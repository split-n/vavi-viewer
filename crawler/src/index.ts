import vavi from "vavi"
import { CaptchaRequestPublisher } from "./CaptchaRequestPublisher";

import express from "express";

let crawler: vavi.VaViCrawler;

async function setup() {
  const captchaRequestTopicName = process.env['PUBSUB_CAPTCHA_REQUEST_TOPIC_NAME'];
  if(!captchaRequestTopicName) {
    throw new Error('Env PUBSUB_CAPTCHA_REQUEST_TOPIC_NAME not set');
  }

  const publisher = new CaptchaRequestPublisher(captchaRequestTopicName);
  
  const app = express();

  app.post('/', (req, res) => {
    if (!req.body) {
      const msg = 'no Pub/Sub message received';
      console.error(`error: ${msg}`);
      res.status(400).send(`Bad Request: ${msg}`);
      return;
    }
    if (!req.body.message || !req.body.message.data) {
      const msg = 'invalid Pub/Sub message format';
      console.error(`error: ${msg}`);
      res.status(400).send(`Bad Request: ${msg}`);
      return;
    }
  
    const data =  Buffer.from(req.body.message.data, 'base64').toString();
  
    console.log(`${data}`);
    res.status(204).send();
  });
}


async function startCrawl(loginCardInfo: vavi.LoginCardInfo) {
  crawler ||= await vavi.launch({headless: false});
  let captcha = await crawler.getCardUsageStats(loginCardInfo);
  captcha.captchaImage
}

const loginCardInfo: vavi.LoginCardInfo = {
    inquiryNumber2 : '', inquiryNumber3 : '', inquiryNumber4 : '', securityCode : ''
};

setup();
