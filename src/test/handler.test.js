//import your handler file or main file of Lambda
const mod = require('../handler');
const adminCreateUserEvent = require( './admin-create-user-event.json');
const adminResendCodeEvent = require( './admin-resend-invitation-event.json');
const forgotPasswordEvent = require( './forgot-password-event.json');
const verifyUserAttributeEvent = require( './verify-user-attribute-event.json');



const jestPlugin = require('serverless-jest-plugin');
const lambdaWrapper = jestPlugin.lambdaWrapper;

const wrapped = lambdaWrapper.wrap(mod);

const expectedInvitationEmailBody = "John Smith, \<br\> \<br\>" +
"You've been added to Casebook. Please follow this link to activate your account: https://testTenant.casebook.net/.\<br\>" +
"Your associated email address is userName@test.com and your temporary password is yourTempPassword.\<br\>" +
"Please note that this invitation will expire in 24 hours.";

describe('Customize Admin Create Message', () => {
    it('returns customized ivitation message', () => {
      return wrapped.run(adminCreateUserEvent).then((response) => {
        expect(response.response.emailMessage).toEqual(expectedInvitationEmailBody)
        expect(response.response.emailSubject).toEqual("Your Casebook Account Information")
      });
    });
  });

  describe('Customize Resend Code Message', () => {
    it('returns customized ivitation message', () => {
      return wrapped.run(adminResendCodeEvent).then((response) => {
        expect(response.response.emailMessage).toEqual(expectedInvitationEmailBody)
        expect(response.response.emailSubject).toEqual("Your Casebook Account Information")
      });
    });
  });

  describe('Customize Forgot Password Message', () => {
    it('returns customized forgot password message', () => {
      return wrapped.run(forgotPasswordEvent).then((response) => {
        var expectedEmailBody = "John Smith, \<br\> \<br\>You recently requested to reset your password for your Casebook account. "
            + "Your verification code is testVerificationCode and the code is valid for 1 hour. "
            + "Please follow this link to complete the reset process (click link or paste entire URL into a browser address line): "
            + "https://testTenant.casebook.net/authentication/reset-password \<br\> \<br\>" 
            + "Please do not share this code with anyone. \<br\>"
            + "If you would rather not reset your password or you didn't make this request, then you can ignore this email, and your password will not be changed.";
        expect(response.response.emailMessage).toEqual(expectedEmailBody)
        expect(response.response.emailSubject).toEqual("Reset your password")
      });
    });
  });

  describe('Test non customized Message', () => {
    it('returns original Cognito verify attribute message', () => {
      return wrapped.run(verifyUserAttributeEvent).then((response) => {
        expect(response.response.emailMessage).toEqual("Cognito Default Message")
        expect(response.response.emailSubject).toEqual("Cognito Default Subject")
      });
    });
  });