# source this in shell
$(gcloud beta emulators pubsub env-init)
export GOOGLE_CLOUD_PROJECT=testprj
export PUBSUB_PROJECT_ID=testprj
cd /nodejs-pubsub/samples
node createTopic.js vaviewer_crawl_request
node createTopic.js vaviewer_captcha_request
node createSubscription.js vaviewer_crawl_request vaviewer_crawl_request_sub
node createSubscription.js vaviewer_captcha_request vaviewer_captcha_request_sub

# test
# node publishMessage.js vaviewer_crawl_request '{"foo": "bar"}'
# node synchronousPull_emulator.js testprj vaviewer_crawl_request_sub