import {PubSub} from '@google-cloud/pubsub';

export class CaptchaRequestPublisher {
    pubSubClient: PubSub;
    topicName: string;
    constructor(topicName: string) {
        this.pubSubClient = new PubSub();
        this.topicName = topicName;
    }

    async publishMessage(data: any) {
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