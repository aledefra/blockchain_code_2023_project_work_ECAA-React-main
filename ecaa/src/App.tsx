import { AppRoutes } from "./app-router";
import { BrowserRouter } from 'react-router-dom';
import { Header } from "./pages/headers/headers";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Header />
      <div className="app-content">
        <AppRoutes />
      </div>
      </BrowserRouter>
    </div>
  );
}
export default App;