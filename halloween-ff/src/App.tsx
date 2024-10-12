import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import FamilyFortunePage from "./pages/FamilyFortune";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="family-fortune" element={<FamilyFortunePage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
