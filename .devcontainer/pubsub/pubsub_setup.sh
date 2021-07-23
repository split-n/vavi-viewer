# source this in shell
$(gcloud beta emulators pubsub env-init)
export GOOGLE_CLOUD_PROJECT=testprj
export PUBSUB_PROJECT_ID=testprj
#cd /nodejs-pubsub/samples/custom

# test
# node ../publishMessage.js vaviewer_crawl_request '{"loginCardInfo": {"inquiryNumber2": "", "inquiryNumber3": "", "inquiryNumber4": "", "securityCode":""}}'
# node ../publishMessage.js vaviewer_captcha_solved '{"uuid": "238f9798-e93b-409f-90df-d62d5df1b4cc", "answer": "ztHKB"}'
# node synchronousPull_emulator.js testprj vaviewer_crawl_request_sub
# node synchronousPull_emulator.js testprj vaviewer_captcha_solve_request_sub
# node synchronousPull_emulator.js testprj vaviewer_captcha_solved_sub