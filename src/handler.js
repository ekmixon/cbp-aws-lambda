exports.handler = (event, context, callback) => {
    if(event.triggerSource === "CustomMessage_AdminCreateUser" || event.triggerSource === "CustomMessage_ResendCode") {
        event.response.emailSubject = "Welcome to the Casebook Platform";
        event.response.emailMessage = "Thank you for signing up. Your username is " + event.request.usernameParameter + " and " + event.request.codeParameter + " is your temporary password.";
    }
    else if(event.triggerSource === "CustomMessage_ForgotPassword") {
        event.response.emailSubject = "Forgot Password for Casebook Platform";
        event.response.emailMessage = "Your username is " + event.request.usernameParameter + " and " + event.request.codeParameter + " is your verification code. \n"
        + "Reset your password at internal.casebookdev.net/authentication/reset-password";
    }
    callback(null, event);
};