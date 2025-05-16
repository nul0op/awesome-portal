import { Alert, Snackbar, Container, createTheme, CssBaseline } from "@mui/material";
import { AppProvider, DashboardLayout, Account, type Navigation, type Router } from "@toolpad/core";
import { ToolbarActionsSearch } from "../lib/toolbar";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useState, useContext, useMemo } from "react";
import { LinkContext } from "../ContextProvider";
import { AwesomeSession } from "../Types";
import AwesomeCardList from "./AwesomeCardList";
import DashboardIcon from '@mui/icons-material/Dashboard';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();

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
    // {
    //   segment: 'orders',
    //   title: 'Orders',
    //   icon: <ShoppingCartIcon />,
    // },
    // {
    //   kind: 'divider',
    // },
    // {
    //   kind: 'header',
    //   title: 'Analytics',
    // },
    // {
    //   segment: 'reports',
    //   title: 'Reports',
    //   icon: <BarChartIcon />,
    //   children: [
    //     {
    //       segment: 'sales',
    //       title: 'Sales',
    //       icon: <DescriptionIcon />,
    //     },
    //     {
    //       segment: 'traffic',
    //       title: 'Traffic',
    //       icon: <DescriptionIcon />,
    //     },
    //   ],
    // },
    // {
    //   segment: 'integrations',
    //   title: 'Integrations',
    //   icon: <LayersIcon />,
    // },
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
  
  function DemoPageContent(props: any) {
    console.log(props);
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

export default function AwesomeCard() {

    const [pathname, setPathname] = useState('/dashboard');
      
// ---------------------------------------------------------
const {awesomeSession, setAwesomeSession} = useContext(LinkContext);

const login = () => {
  console.log("app->dashboard->login()");

  signInWithPopup(auth, provider)
  .then(async (result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential !== null) {
      const user = result.user;

      let newSession = new AwesomeSession();
      newSession.name = user.displayName || "";
      newSession.email = user.email || "";
      newSession.image = user.photoURL || "";
      newSession.googleToken = credential.accessToken || "";
      // newSession.backendToken = user.stsTokenManager.accessToken;
      newSession.backendToken = await user.getIdToken();
      
      newSession.user = {};
      newSession.user.id = user.displayName;
      newSession.user.name = user.displayName || "";
      newSession.user.image = user.photoURL || "";
      newSession.user.email = user.email || "";
      newSession.user.token = credential.accessToken || "";

      console.log("user Context: ", newSession);

      setAwesomeSession(newSession);
    }
  });
}
// ---------------------------------------------------------

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
      await login();
    },
    signOut: () => {
      setAwesomeSession(new AwesomeSession());
    },
  };
}, []);

    return (
        <AppProvider
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
        authentication={authentication}
        session={awesomeSession}
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
            session={awesomeSession} />
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
        { "xx" }
        </Alert>
        </Snackbar>
        </div>
        </AppProvider>
    )
}