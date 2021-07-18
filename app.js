var express = require('express');
var path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config({ silent: true });
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const IamAuthenticator = require('ibm-watson/auth').IamAuthenticator;
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');

const ibmClient = new TextToSpeechV1({
    authenticator: new IamAuthenticator({ apikey: process.env.TEXT_TO_SPEECH_API_KEY }),
    version: '2020-04-01'
});

const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const translate = new LanguageTranslatorV3({
  version: '2018-05-01',
  authenticator: new IamAuthenticator({
      apikey: 'QXVi2LOqx0fgREWEvXr5P2PyVbXP5nW_b1E-gL0zAcNO',
  }),
  url: 'https://api.us-south.language-translator.watson.cloud.ibm.com/instances/9f6c7f54-22aa-47b9-82ae-e9d8baa2f276'
});

app.use(express.static(path.join(__dirname, 'public')));

// viewed at http://localhost:3000
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});


app.get('/api/voces', async (_, res, next) => {
    try {
      if (ibmClient) {
        const { result } = await ibmClient.listVoices();
        return res.json(result);
      } else {
        // Return Allison for testing and user still gets creds pop-up.
        return res.json(
          { voices: [
            { name: 'es-ES_EnriqueV3Voice',
              description: 'Enrique: American English female voice. Dnn technology.',
            }]
          });
      }
    } catch (err) {
      console.error(err);
      if (!client) {
        err.statusCode = 401;
        err.description = 'no se pueden encontrar credenciales validas para el servicio de IBM.';
        err.title = 'Credenciales Invalidad';
      }
      next(err);
    }
  });

app.get('/api/sintetizar', async (req, res, next) => {
    try {
      const { result } = await ibmClient.synthesize(req.query);
      result.pipe(res);
    } catch (err) {
      console.error(err);
      if (!ibmClient) {
        err.statusCode = 401;
        err.description = 'no se pueden encontrar credenciales validas para el servicio de IBM.';
        err.title = 'Credenciales Invalidad';
      }
      next(err);
    }
});


app.post('/api/translate', function(req, res, next) {
  translate
      .translate(req.body)
      .then(({ result }) => res.json(result))
      .catch(error => next(error));
});



require('./error-handler')(app);

module.exports = app;