var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            return true;
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
        },
        uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'index.html',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID, //Google sign in
        firebase.auth.FacebookAuthProvider.PROVIDER_ID, //Facebook sign in
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID, // Twitter sign in
        // firebase.auth.GithubAuthProvider.PROVIDER_ID, //Github sign in
        // firebase.auth.EmailAuthProvider.PROVIDER_ID, //Email sign in
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID //Phone sign in
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>', //replace with your terms of service url
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>' //replace with your privacy policy url
};
ui.start('#firebaseui-auth-container', uiConfig);
