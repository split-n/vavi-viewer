'use strict';

const pushEndpoint = 'http://crawler:8080/';

const { PubSub } = require('@google-cloud/pubsub');

async function setup() {


    const pubSubClient = new PubSub();

    await pubSubClient.createTopic('vaviewer_crawl_request');
    await pubSubClient.createTopic('vaviewer_crawl_request_dead');
    await pubSubClient.createTopic('vaviewer_captcha_solve_request');
    await pubSubClient.createTopic('vaviewer_captcha_solved');

    await pubSubClient.createSubscription('vaviewer_crawl_request', 'vaviewer_crawl_request_sub');
    await pubSubClient.createSubscription('vaviewer_crawl_request_dead', 'vaviewer_crawl_request_dead_sub');
    await pubSubClient.createSubscription('vaviewer_captcha_solve_request', 'vvaviewer_captcha_solve_sub');
    await pubSubClient.createSubscription('vaviewer_captcha_solved', 'vaviewer_captcha_solved_sub', {
        ackDeadlineSeconds: 5
    });

    await pubSubClient.createSubscription('vaviewer_crawl_request', 'vaviewer_crawl_request_pushsub', {
        pushConfig: {
            pushEndpoint: pushEndpoint
        },
        ackDeadlineSeconds: 60 * 4,
        deadLetterPolicy: {
            deadLetterTopic: pubSubClient.topic('vaviewer_crawl_request_dead').name,
            maxDeliveryAttempts: 5
        }
    });
}

setup();