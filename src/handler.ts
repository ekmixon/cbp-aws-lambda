import {CognitoUserPoolTriggerEvent, Handler} from 'aws-lambda'

export const handler: Handler<CognitoUserPoolTriggerEvent> = (event, context, callback) => {
  const domainPostFix = process.env.DOMAIN_POSTFIX
  let selfRegistered = false
  try {
    selfRegistered = (event.request as any).clientMetadata.selfRegistered
  } catch(e) {
      // tslint:disable-next-line: no-console
      console.debug('No selfRegistered attribute in clientMetadata')
  }
  if (event.triggerSource === 'CustomMessage_AdminCreateUser' || (event.triggerSource === 'CustomMessage_ResendCode' && !selfRegistered)) {
    setAdminCreateUserMessage(event, domainPostFix)
  } else if(event.triggerSource === 'CustomMessage_ForgotPassword') {
    setForgotPasswordMessage(event, domainPostFix)
  } else if(event.triggerSource === 'CustomMessage_SignUp' || (event.triggerSource === 'CustomMessage_ResendCode' && selfRegistered)) {
    setSignUpMessage(event, domainPostFix)
  }
  callback(null, event)
}

const setAdminCreateUserMessage = (event:any, domainPostFix: string | undefined) => {
  const subDomain = getSubDomain(event)
  event.response.emailSubject = 'Your Casebook Account Information'
  event.response.emailMessage = `${event.request.userAttributes.name}, \<br\> \<br\>` +
          `You've been added to Casebook. Please follow this link to activate your account: https://${subDomain}.casebook${domainPostFix}.net/.\<br\>` +
          `Your associated email address is ${event.request.usernameParameter} and your temporary password is ${event.request.codeParameter}.\<br\>` +
          'Please note that this invitation will expire in 24 hours.'
}


const setForgotPasswordMessage = (event:any, domainPostFix: string | undefined) => {
  const subDomain = getSubDomain(event)
  event.response.emailSubject = 'Reset your password'
  event.response.emailMessage = `${event.request.userAttributes.name}, \<br\> \<br\>` +
    'You recently requested to reset your password for your Casebook account. ' +
    `Your verification code is ${event.request.codeParameter} and the code is valid for 1 hour. ` +
    'Please follow this link to complete the reset process (click link or paste entire URL into a browser address line): ' +
    `https://${subDomain}.casebook${domainPostFix}.net/authentication/reset-password \<br\> \<br\>` +
    'Please do not share this code with anyone. \<br\>' +
    'If you would rather not reset your password or you didn\'t make this request, then you can ignore this email, and your password will not be changed.'
}

const setSignUpMessage = (event:any, domainPostFix: string | undefined) => {
  let tenantName = 'Casebook'
  const subDomain = getSubDomain(event)
  try {
    tenantName = event.request.clientMetadata.tenantName
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


const getSubDomain = (event:any): string => {
  let subDomain = '[placeholder]'
  try {
      subDomain = event.request.clientMetadata.subDomain
  } catch(e) {
      // tslint:disable-next-line: no-console
      console.error('No subDomain attribute in clientMetadata')
  }
  return subDomain
}