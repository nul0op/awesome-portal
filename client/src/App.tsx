import * as React from 'react';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider, type Navigation, type Router, type Session } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Account } from '@toolpad/core/Account';
import { ToolbarActionsSearch } from './lib/toolbar';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AwesomeCardList from './components/AwesomeCardList';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { useMemo, useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, type User } from "firebase/auth";
import { ContextProvider } from "./ContextProvider.tsx";
import firebaseConfig from "../firebaseconfig";
import { initializeApp } from 'firebase/app';
import type { UserSession } from './Types.tsx';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();

let ITEMS = [
  { id: 'tree-view-community', label: 'TEST' },
  { id: 'tree-view-community2', label: 'TEST2' },
  { id: 'tree-view-community3', label: 'TEST3' },
  { id: 'tree-view-community4', label: 'TEST4' },
  { id: 'tree-view-community5', label: 'TEST5' },
  { id: 'tree-view-community6', label: 'TEST6' },
];

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'orders',
    title: 'Orders',
    icon: <ShoppingCartIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'sales',
        title: 'Sales',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'traffic',
        title: 'Traffic',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'integrations',
    title: 'Integrations',
    icon: <LayersIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

const login = async (setSession: any, setAlert: Function, setMessage: Function, userContext: UserSession) => {
    console.log("inside login");

    auth.onAuthStateChanged((user) => {
        if (user) {
            userContext.accessToken = user.accessToken;

            // FIXME: why does it warns me on this ?
            console.log("Firebase token: ", user.accessToken);
            console.log("user Context: ", userContext);

            setSession(
              {
                user: {
                  name: user.displayName,
                  email: user.email,
                  image: user.photoURL,
                  token: user.accessToken
                }
            }
          )
        }
    })

  signInWithPopup(auth, provider)
  .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential !== null) {
        <Alert severity="info">This is an info Alert.</Alert>
        // const token = credential.accessToken;
        // console.log(token);
        // The signed-in user info.
        const user = result.user;
        // setMessage(`User ${user.displayName} successfuly logged in`);
        // console.log(credential);
        // setAlert(true);
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

function DemoPageContent(props: any) {
  return (
    <>
      <CssBaseline />
      <Container maxWidth={false} disableGutters style={{
        display: 'flex',
        flexWrap: 'wrap',
        
      }}>
        <AwesomeCardList/>
      </Container>
    </>
  );
}

export default function App() {
  const [pathname, setPathname] = useState('/dashboard');
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("OK");
  const [session, setSession] = useState<Session | null>(null);

  const router = useMemo<Router>(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);
  
  const authentication = React.useMemo(() => {
    return {
      signIn: async () => {
        console.log("app->dashboard->signin")
        // await login(setSession, setAlert, setMessage, userContext);
      },
      signOut: () => {
        // setSession(null);
        console.log("app->dashboard->signout");
      },
    };
  }, []);

  return (
    <ContextProvider>
      <AppProvider
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
        authentication={authentication}
        session={session}
        branding={{
          logo: <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/awesome/awesome.png" alt="Awezome List Logo" />,
          title: 'Awesome List Portal'
        }}
      >
        <DashboardLayout
          slots={{ 
            toolbarAccount: () => <Account/> ,
            toolbarActions: ToolbarActionsSearch,
          }}
        >
          <DemoPageContent 
            session={session} />
        </DashboardLayout>
        <div>
      {/* <Snackbar open={open} autoHideDuration={6000}> */}
      <Snackbar autoHideDuration={6000}>
        <Alert
          // onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          { message }
        </Alert>
      </Snackbar>
      </div>
      </AppProvider>
    </ContextProvider>
  );
}
