import Button from '@mui/material/Button';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function Login() {

    // // createUserWithEmailAndPassword
    // // signInWithPopup
    // // TODO: Add SDKs for Firebase products that you want to use
    // // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDwLCTbB96KNV_gs_0o5PWFPPo1WGd1828",
        authDomain: "awesome-portal-7902b.firebaseapp.com",
        projectId: "awesome-portal-7902b",
        storageBucket: "awesome-portal-7902b.firebasestorage.app",
        messagingSenderId: "235359032912",
        appId: "1:235359032912:web:0447a9a53de2e3e4772355"
    };

    // const actionCodeSettings = {
    //     // URL you want to redirect back to. The domain (www.example.com) for this
    //     // URL must be in the authorized domains list in the Firebase Console.
    //     url: 'https://awesome.portal/finishSignUp?cartId=1234',
    //     // This must be true.
    //     handleCodeInApp: true,
    //     // iOS: {
    //     //   bundleId: 'com.example.ios'
    //     // },
    //     // android: {
    //     //   packageName: 'com.example.android',
    //     //   installApp: true,
    //     //   minimumVersion: '12'
    //     // },
    //     // The domain must be configured in Firebase Hosting and owned by the project.
    //     linkDomain: 'awesome-portal-7902b.firebaseapp.com'
    // };

    // // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    auth.languageCode = 'en';
    const provider = new GoogleAuthProvider();

    let email = "fbeuserie@gmail.com";
    let password = "7kJjb3RdSy";

    // -------------------------- GOOGLE AUTH API => WORKS
    // signInWithPopup(auth, provider)
    // .then((result) => {
    //     // This gives you a Google Access Token. You can use it to access the Google API.
    //     const credential = GoogleAuthProvider.credentialFromResult(result);
    //     const token = credential.accessToken;
    //     // The signed-in user info.
    //     const user = result.user;
    //     console.log(user);

    //     // IdP data available using getAdditionalUserInfo(result)
    //     // ...
    // }).catch((error) => {
    //     // Handle Errors here.
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     // The email of the user's account used.
    //     const email = error.customData.email;
    //     // The AuthCredential type that was used.
    //     const credential = GoogleAuthProvider.credentialFromError(error);
    //     // ...
    // });
    // -------------------------- GOOGLE AUTH API => WORKS
    

    // // step 1:
    // sendSignInLinkToEmail(auth, email, actionCodeSettings)
    // .then(() => {
    //     // The link was successfully sent. Inform the user.
    //     // Save the email locally so you don't need to ask the user for it again
    //     // if they open the link on the same device.
    //     window.localStorage.setItem('emailForSignIn', email);
    //     // ...
    // })
    // .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     console.error(errorCode, " > ", errorMessage);
    // });

    // createUserWithEmailAndPassword(auth, email, password)
    //     .then((userCredential) => {
    //         // Signed up 
    //         const user = userCredential.user;
    //         // ...
    //         console.log("LOGGED IN AS: ", user);
    // })
    // .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     // ..
    // });

    const loginHandler = async () => {
        // await createUserWithEmailAndPassword(auth, email, password);
        console.log("click !");
    }

return (
    <>
    {/* <button onClick={ loginHandler }>Login !</button> */}
    <Button variant="contained" onClick={ loginHandler }>Login !</Button>
    </>
)
}