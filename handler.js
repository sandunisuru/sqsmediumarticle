'use strict';
const aws = require('aws-sdk');
const sqs = new aws.SQS({ apiVersion: '2012-11-05', region: 'us-east-1' });
const sqsQueueUrl = process.env.QUEUE_URL;

module.exports.messageProducer = async (event) => {

  for (var i = 0; i < 10; i++) {
    await sqs.sendMessage({
      MessageBody: 'success',
      QueueUrl: sqsQueueUrl
    }).promise();
  }

  for (var i = 0; i < 10; i++) {
    await sqs.sendMessage({
      MessageBody: 'failed',
      QueueUrl: sqsQueueUrl
    }).promise();
  }

  return {
    statusCode: 200
  };
};

module.exports.messageConsumer = async (event) => {

  var sqsRecords = event.Records;
  var batchItemFailures = [];

  if (sqsRecords.length > 0) {
    for await (const message of sqsRecords) {
      if (message.body === 'failed')
        batchItemFailures.push({ itemIdentifier: message.messageId })

      if (message.body === 'success')
        console.log("It is success")
    }
  }
  return { batchItemFailures };
};