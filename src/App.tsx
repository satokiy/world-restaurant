import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Globe from "./components/Globe";

const queryClient = new QueryClient();

function App() {
  const handleClick = (data: any) => {
    console.log(data);
  };
  const handleMouseOver = (data: any) => {
    console.log("Mouse Over", data.properties.SOVEREIGNT);
  };
  const handleMouseOut = (data: any) => {
    console.log("Mouse Out", data.properties.SOVEREIGNT);
  };

  return (
    <div style={{ width: "100vw" }}>
      <QueryClientProvider client={queryClient}>
        <Globe
          onCountryClick={handleClick}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        />
      </QueryClientProvider>
    </div>
  );
}

export default App;
