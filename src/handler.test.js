//import your handler file or main file of Lambda
const adminCreateUserEvent = require( './admin-create-user-event.json');
const mod = require('./handler');


const jestPlugin = require('serverless-jest-plugin');
const lambdaWrapper = jestPlugin.lambdaWrapper;



//Call your exports function with required params
//In AWS lambda these are event, content, and callback
//event and content are JSON object and callback is a function
//In my example i'm using empty JSON

mod.handler( {}, //event
    {}, //content
    function(data,ss) {  //callback function with two arguments 
    });
const wrapped = lambdaWrapper.wrap(mod);

describe('Customize Admin Create Message', () => {
    it('returns customized email message', () => {
      return wrapped.run(adminCreateUserEvent).then((response) => {
        expect(response.response.emailMessage).toEqual("Thank you for signing up. Your username is test and {####} is your temporary password.")
        expect(response.response.emailSubject).toEqual("Welcome to the Casebook Platform")
      });
    });
  });

