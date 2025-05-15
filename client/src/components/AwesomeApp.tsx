import { CardContent, Typography, CardActions, Button, Box, Card, Link, Paper, Alert, Snackbar, Container, createTheme, CssBaseline } from "@mui/material";
import { AppProvider, DashboardLayout, Account, type Navigation, type Router } from "@toolpad/core";
import { ToolbarActionsSearch } from "../lib/toolbar";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useState, useContext, useMemo } from "react";
import { LinkContext } from "../ContextProvider";
import { AwesomeSession } from "../Types";
import AwesomeCardList from "./AwesomeCardList";
import firebaseConfig from "../../firebaseconfig";
import DashboardIcon from '@mui/icons-material/Dashboard';

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

export default function AwesomeCard(props: any) {

      const [pathname, setPathname] = useState('/dashboard');
      const [alert, setAlert] = useState(false);
      const [message, setMessage] = useState("OK");
      
// ---------------------------------------------------------
const {awesomeSession, setAwesomeSession} = useContext(LinkContext);

const login = () => {
  console.log("app->dashboard->login()");

  signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential !== null) {
      const user = result.user;

      let newSession = new AwesomeSession();
      newSession.name = user.displayName || "";
      newSession.email = user.email || "";
      newSession.image = user.photoURL || "";
      newSession.googleToken = credential.accessToken || "";
      newSession.backendToken = user.stsTokenManager.accessToken;

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
      // setSession(null);
      console.log("app->dashboard->signout");
    },
  };
}, []);

    return (
        <AppProvider
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
        authentication={authentication}
        // session={awesomeSession}
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
        { message }
        </Alert>
        </Snackbar>
        </div>
        </AppProvider>
    )
}