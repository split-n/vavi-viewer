import {PubSub} from '@google-cloud/pubsub';
import { CaptchaRequest } from 'vavi-viewer-shared';

export class CaptchaRequestPublisher {
    pubSubClient: PubSub;
    topicName: string;
    constructor(topicName: string) {
        this.pubSubClient = new PubSub();
        this.topicName = topicName;
    }

    async publishMessage(data: CaptchaRequest) {
        const dataBuffer = Buffer.from(JSON.stringify(data));
      
        try {
          const messageId = await this.pubSubClient.topic(this.topicName).publish(dataBuffer);
          console.log(`Message ${messageId} published.`);
        } catch (error) {
          console.error(`Received error while publishing: ${error.message}`);
          throw error;
        }
      }
}