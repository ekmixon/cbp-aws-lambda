exports.handler = (event, context, callback) => {
    if(event.triggerSource === "CustomMessage_AdminCreateUser" || event.triggerSource === "CustomMessage_ResendCode") {
        try {
            var subDomain = event.request.clientMetadata.subDomain;
        } catch(e) {
            var subDomain = "[placeholder]";
        }
        event.response.emailSubject = "Your Casebook Account Information";
        event.response.emailMessage = event.request.userAttributes.name + ", \<br\> \<br\>" +
            "You've been added to Casebook. Please follow this link to activate your account: https://" + subDomain + ".casebook.net/.\<br\>" +
            "Your associated email address is " + event.request.usernameParameter + " and your temporary password is " + event.request.codeParameter + ".\<br\>" +
            "Please note that this invitation will expire in 24 hours.";
    }
    else if(event.triggerSource === "CustomMessage_ForgotPassword") {
        try {
            var subDomain = event.request.clientMetadata.subDomain;
        } catch(e) {
            var subDomain = "[placeholder]";
        }
        event.response.emailSubject = "Reset your password";
        event.response.emailMessage = event.request.userAttributes.name + ", \<br\> \<br\>" +
            "You recently requested to reset your password for your Casebook account. " +
            "Your verification code is " + event.request.codeParameter + " and the code is valid for 1 hour. " +
            "Please follow this link to complete the reset process (click link or paste entire URL into a browser address line): " +
            "https://" + subDomain + ".casebook.net/authentication/reset-password \<br\> \<br\>" +
            "Please do not share this code with anyone. \<br\>" +
            "If you would rather not reset your password or you didn't make this request, then you can ignore this email, and your password will not be changed.";
    }
    callback(null, event);
};