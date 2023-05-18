
import { AppRoutes } from "./app-router";
import { BrowserRouter } from 'react-router-dom';
import { Header } from "./pages/headers/headers";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Header />
      <div className="app-content">
        <div className="container bg-body-tertiary p-4 m-5">
          <div className="">
          <AppRoutes />
          </div>
        </div>
      </div>
      </BrowserRouter>
    </div>
  );
}
export default App;
