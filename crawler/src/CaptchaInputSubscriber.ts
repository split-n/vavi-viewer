import { Message, PubSub, Subscription } from '@google-cloud/pubsub';
import { CaptchaInput } from 'vavi-viewer-shared';
import {EventEmitter} from 'events';

export class CaptchaInputSubscriber {
    pubSubClient: PubSub;
    topicName: string;
    subscriptionName: string;
    subscription: Subscription;

    constructor(topicName: string, subscriptionName: string) {
        this.pubSubClient = new PubSub();
        this.topicName = topicName;
        this.subscriptionName = subscriptionName;
        this.subscription = this.pubSubClient
            .topic(this.topicName)
            .subscription(this.subscriptionName);

    }

    waitForInputMessage(uuid: string, timeout: number = 120000): Promise<CaptchaInput> {
        return new Promise((resolve, reject) => {
            const listenerFunc = (message: Message) => {
                if(!message.data) {
                    console.log(`Received message no data: ${message}`);
                    return;
                }
                const json = message.data.toString();
                try {
                    const data = JSON.parse(json) as CaptchaInput;
                    if (uuid === data.uuid) {
                        message.ack();
                        console.log(`ack captcha: ${uuid}`)
                        this.subscription.removeListener('message', listenerFunc);
                        resolve(data);
                    }
                }catch(err) {
                    console.log(`Received invalid message: ${message}`);
                }
            }
            setTimeout(() => {
                this.subscription.removeListener('message', listenerFunc);
                reject(new Error(`Timeout on waitForImputMessage, uuid=${uuid}`));
            }, timeout)
            this.subscription.addListener('message', listenerFunc);
        });
    }
}