import {CognitoUserPoolTriggerEvent, Handler} from 'aws-lambda'

export const handler: Handler<CognitoUserPoolTriggerEvent> = (event, context, callback) => {
  const domainPostFix = process.env.DOMAIN_POSTFIX
  if (event.triggerSource === 'CustomMessage_AdminCreateUser' || event.triggerSource === 'CustomMessage_ResendCode') {
    let subDomain = '[placeholder]'
    try {
        subDomain = (event.request as any).clientMetadata.subDomain
    } catch(e) {
        // tslint:disable-next-line: no-console
        console.error('No subDomain attribute in clientMetadata')
    }
    event.response.emailSubject = 'Your Casebook Account Information'
    event.response.emailMessage = `${event.request.userAttributes.name}, \<br\> \<br\>` +
            `You've been added to Casebook. Please follow this link to activate your account: https://${subDomain}.casebook${domainPostFix}.net/.\<br\>` +
            `Your associated email address is ${event.request.usernameParameter} and your temporary password is ${event.request.codeParameter}.\<br\>` +
            'Please note that this invitation will expire in 24 hours.'
  } else if(event.triggerSource === 'CustomMessage_ForgotPassword') {
    let subDomain = '[placeholder]'
    try {
        subDomain = (event.request as any).clientMetadata.subDomain
    } catch(e) {
        // tslint:disable-next-line: no-console
        console.error('No subDomain attribute in clientMetadata')
    }
    event.response.emailSubject = 'Reset your password'
    event.response.emailMessage = `${event.request.userAttributes.name}, \<br\> \<br\>` +
      'You recently requested to reset your password for your Casebook account. ' +
      `Your verification code is ${event.request.codeParameter} and the code is valid for 1 hour. ` +
      'Please follow this link to complete the reset process (click link or paste entire URL into a browser address line): ' +
      `https://${subDomain}.casebook${domainPostFix}.net/authentication/reset-password \<br\> \<br\>` +
      'Please do not share this code with anyone. \<br\>' +
      'If you would rather not reset your password or you didn\'t make this request, then you can ignore this email, and your password will not be changed.'
  }
  callback(null, event)
}
