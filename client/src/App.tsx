import AwesomeApp from "./components/AwesomeApp.tsx";
import { ContextProvider } from "./ContextProvider.tsx";

export default function App() {

  return (
    <ContextProvider>
      <AwesomeApp>
      </AwesomeApp>
    </ContextProvider>
  );
}