import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
import { login } from './lib/auth';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AwesomeCard from './components/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';

let ITEMS = [
  { id: 'tree-view-community', label: 'TEST' },
  { id: 'tree-view-community2', label: 'TEST2' },
  { id: 'tree-view-community3', label: 'TEST3' },
  { id: 'tree-view-community4', label: 'TEST4' },
  { id: 'tree-view-community5', label: 'TEST5' },
  { id: 'tree-view-community6', label: 'TEST6' },
];

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: (theme.vars ?? theme).palette.text.secondary,
//   ...theme.applyStyles('dark', {
//     backgroundColor: '#1A2027',
//   }),
// }));

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

function DemoPageContent({ pathname }: { pathname: string }) {
  return (
    <>
      <Box sx={{ minWidth: 275 }}>
        <AwesomeCard/>
      </Box>
    </>
  );
}

export default function App() {
  const [pathname, setPathname] = React.useState('/dashboard');
  const [alert, setAlert] = React.useState(false);
  const [message, setMessage] = React.useState("OK");
  
  const router = React.useMemo<Router>(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);
  
  const [session, setSession] = React.useState<Session | null>(null);
  const authentication = React.useMemo(() => {
    return {
      signIn: async () => {
        login(setSession, setAlert, setMessage);
      },
      signOut: () => {
        setSession(null);
      },
    };
  }, []);

  return (
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
          <DemoPageContent pathname={pathname} />
        </DashboardLayout>
        <div>
      <Snackbar open={open} autoHideDuration={6000}>
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
  );
}
