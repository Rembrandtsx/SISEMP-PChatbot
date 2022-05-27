

const {SessionsClient} = require('@google-cloud/dialogflow-cx');


const projectId = 'app-residia';
const location = 'us-central1';
const agentId = '94a84199-d729-4790-8b32-48adf6881e21';
const languageCode = 'es'
process.env.GOOGLE_APPLICATION_CREDENTIALS =
        Runtime.getAssets()["/dialogflow.json"].path;
//https://dialogflowservice-8458.twil.io/dialogflow.json
/**
 * Example for regional endpoint:
 *   const location = 'us-central1'
 *   const client = new SessionsClient({apiEndpoint: 'us-central1-dialogflow.googleapis.com'})
 */
const client = new SessionsClient({apiEndpoint: 'us-central1-dialogflow.googleapis.com'});

exports.handler = async function (context, event, callback) {
  let twiml = new Twilio.twiml.MessagingResponse();

  const receivedMsg = event.Body;
  const userNumber = event.From;

  if (!receivedMsg) return callback("No message received", twiml);


  const sessionPath = client.projectLocationAgentSessionPath(
    projectId,
    location,
    agentId,
    userNumber
  );
  console.info(sessionPath);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: receivedMsg,
      },
      languageCode,
    },
  };
  const [response] = await client.detectIntent(request);


  // Get response from Dialogflow
  //let diallofglowJsonFilePath = Runtime.getAssets()["/dialogflow.json"].path;
  
  //const dialogflogSessionClient = new dialogflow.SessionsClient({
  //  keyFilename: diallofglowJsonFilePath,
  //});
  //const dialogflowProjectId = process.env.DIALOGFLOW_PROJECT_ID;
  //const dialogflowSessionPath = dialogflogSessionClient.sessionPath(
    //dialogflowProjectId,
    //userNumber
  //);
  //const dialogflowRequestParams = {
   // session: dialogflowSessionPath,
    //queryInput: {
      //text: {
        //text: receivedMsg,
        //languageCode: "pt-BR",
      //},
   // },
  //};
  //const dialogflowRequest = await dialogflogSessionClient.detectIntent(
    //dialogflowRequestParams
  //);
  const dialogflowResponses =
    response.queryResult.responseMessages;

  // Iterate over every message
  for (const response of dialogflowResponses) {
    // Texts
    if (response.text) {
      const text = response.text.text[0];
      twiml.message(text);
    }

    // Payloads
    if (response.payload) {
      const fields = response.payload.fields;
      const payloadMessage = await twiml.message();
      if (fields.mediaUrl) {
        const mediaUrl = fields.mediaUrl.stringValue;
        payloadMessage.media(mediaUrl);
      }
      if (fields.text) {
        const text = fields.text.stringValue;
        payloadMessage.body(text);
      }
    }
  }
  return callback(null, twiml);
};
