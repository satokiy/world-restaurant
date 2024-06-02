import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Globe from "./components/Globe";

const queryClient = new QueryClient();

function App() {
  const handleClick = (data: any) => {
    console.log(data);
  };
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Globe onCountryClick={handleClick} />
      </QueryClientProvider>
    </div>
  );
}

export default App;
