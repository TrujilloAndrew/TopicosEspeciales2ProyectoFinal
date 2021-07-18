const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const languageTranslator = new LanguageTranslatorV3({
  version: '2018-05-01',
  authenticator: new IamAuthenticator({
    apikey: 'QXVi2LOqx0fgREWEvXr5P2PyVbXP5nW_b1E-gL0zAcNO',
  }),
  serviceUrl: 'https://api.us-south.language-translator.watson.cloud.ibm.com/instances/9f6c7f54-22aa-47b9-82ae-e9d8baa2f276',
});

const translateParams = {
  text: 'Hello, how are you today?',
  modelId: 'en-es',
};

languageTranslator.translate(translateParams)
  .then(translationResult => {
    console.log(JSON.stringify(translationResult, null, 2));
  })
  .catch(err => {
    console.log('error:', err);
  });

  
  