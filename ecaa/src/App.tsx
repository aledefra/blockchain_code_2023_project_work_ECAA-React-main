import { AppRoutes } from "./app-router";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./pages/headers/headers";

function App() {
	return (
		<BrowserRouter>
			<Header />
			<div className="container bg-body-secondary rounded p-4 mt-4">
				<AppRoutes />
			</div>
		</BrowserRouter>
	);
}
export default App;
