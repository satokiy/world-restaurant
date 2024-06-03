import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Globe from "./components/Globe";
import Globe2D from "./components/Globe2D";

const queryClient = new QueryClient();

function App() {
  const handleClick = (data: any) => {
    console.log(data);
  };
  const handleMouseOver = (data: any) => {
    console.log(data.properties.SOVEREIGNT);
  };
  const handleMouseOut = (data: any) => {
    console.log(data.properties.SOVEREIGNT);
  };

  return (
    <div style={{ width: "100vw" }}>
      <QueryClientProvider client={queryClient}>
        {
          /* <Globe
          onCountryClick={handleClick}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        /> */
        }
        <Globe2D
          onCountryClick={handleClick}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        />
      </QueryClientProvider>
    </div>
  );
}

export default App;
