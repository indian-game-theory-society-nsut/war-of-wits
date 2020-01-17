var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // console.log(redirectUrl)
            // console.log("lol")
            // console.log(authResult.user)
            // console.log("lol")
            post_data = {
                uid:           authResult.user.uid,
                displayName:   authResult.user.displayName,
                photoURL:      authResult.user.photoURL,
                email:         authResult.user.email,
                emailVerified: authResult.user.emailVerified,
                phoneNumber:   authResult.user.phoneNumber,
                isAnonymous:   authResult.user.isAnonymous
            }
            document.getElementById('loader').style.display = '';
            $.post("/users/login", post_data,
                function(data) {
                    window.location.pathname = '/'
                }
            );
            return false;
    

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
    signInSuccessUrl: '/',
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

// authResult.user.uid: "L64Naiq7jvYNhJQp6jk87OODhGo1"
// authResult.user.displayName: "Sachin Roy"
// authResult.user.photoURL: null
// authResult.user.email: "sroy895@gmail.com"
// authResult.user.emailVerified: true
// authResult.user.phoneNumber: null
// authResult.user.isAnonymous: false
