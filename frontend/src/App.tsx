import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Create from "./pages/Create";
import Sign from "./pages/Sign";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/create" Component={Create}/>
                <Route path="/sign" Component={Sign} />
            </Routes>
        </Router>
    );
}

export default App;
