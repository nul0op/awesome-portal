import Alert from "@mui/material/Alert";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import firebaseConfig from "../../firebaseconfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();


const login = async (setSession: any, setAlert: Function, setMessage: Function) => {
  signInWithPopup(auth, provider)
  .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential !== null) {
        <Alert severity="info">This is an info Alert.</Alert>
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        setMessage(`User ${user.displayName} successfuly logged in`);
        setAlert(true);
        setSession({
          user: {
            name: user.displayName,
            email: user.email,
            image: user.photoURL,
          }
        });
      }

    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
  });
}

export { login };