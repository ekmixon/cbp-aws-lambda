import {CognitoUserPoolTriggerEvent, Handler} from 'aws-lambda'

const missingSubdomainError = 'No subDomain attribute in clientMetadata'

export const handler: Handler<CognitoUserPoolTriggerEvent> = (event, context, callback) => {
  const domainPostFix = process.env.DOMAIN_POSTFIX
  let subDomain = '[placeholder]'
  if (event.triggerSource === 'CustomMessage_AdminCreateUser' || event.triggerSource === 'CustomMessage_ResendCode') {
    try {
        subDomain = (event.request as any).clientMetadata.subDomain
    } catch(e) {
        // tslint:disable-next-line: no-console
        console.error(missingSubdomainError)
    }
    event.response.emailSubject = 'Your Casebook Account Information'
    event.response.emailMessage = `${event.request.userAttributes.name}, \<br\> \<br\>` +
            `You've been added to Casebook. Please follow this link to activate your account: https://${subDomain}.casebook${domainPostFix}.net/.\<br\>` +
            `Your associated email address is ${event.request.usernameParameter} and your temporary password is ${event.request.codeParameter}.\<br\>` +
            'Please note that this invitation will expire in 24 hours.'
  } else if(event.triggerSource === 'CustomMessage_ForgotPassword') {
    try {
        subDomain = (event.request as any).clientMetadata.subDomain
    } catch(e) {
        // tslint:disable-next-line: no-console
        console.error(missingSubdomainError)
    }
    event.response.emailSubject = 'Reset your password'
    event.response.emailMessage = `${event.request.userAttributes.name}, \<br\> \<br\>` +
      'You recently requested to reset your password for your Casebook account. ' +
      `Your verification code is ${event.request.codeParameter} and the code is valid for 1 hour. ` +
      'Please follow this link to complete the reset process (click link or paste entire URL into a browser address line): ' +
      `https://${subDomain}.casebook${domainPostFix}.net/authentication/reset-password \<br\> \<br\>` +
      'Please do not share this code with anyone. \<br\>' +
      'If you would rather not reset your password or you didn\'t make this request, then you can ignore this email, and your password will not be changed.'
  } else if(event.triggerSource === 'CustomMessage_SignUp') {
    let tenantName = 'Casebook'
    try {
        subDomain = (event.request as any).clientMetadata.subDomain
    } catch(e) {
        // tslint:disable-next-line: no-console
        console.error(missingSubdomainError)
    }
    try {
      tenantName = (event.request as any).clientMetadata.tenantName
    } catch(e) {
        // tslint:disable-next-line: no-console
        console.error('No tenantName attribute in clientMetadata')
    }
    const verificationLink = `https://${subDomain}.casebook${domainPostFix}.net/authentication/login?verificationCode=${event.request.codeParameter}&username=${event.request.usernameParameter}`

    event.response.emailSubject = `Welcome to ${tenantName}. Please verify your email`
    event.response.emailMessage = `Hello ${event.request.userAttributes.name}, \<br\> \<br\>` +
      `Thanks for signing up with ${tenantName}. ` +
      `To complete your account setup, follow: ${verificationLink} \<br\>` +
      'Once you verify, you will be able to log in to your account. \<br\> \<br\>' +
      'This link is valid for the next 24 hours only.  \<br\> \<br\>' +
      'Thanks!'
      }
  callback(null, event)
}
