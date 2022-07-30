import "./App.css";
import { Outlet } from "react-router-dom";
import { TopBar } from "./TopBar";

function App() {
  return (
    <>
      <TopBar />
      <div className="content">
        <Outlet />
      </div>
    </>
  );
}

export default App;
