import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import KanbanBoard from "./pages/KanbanBoard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KanbanBoard />} />
      </Routes>
    </Router>
  );
}

export default App;