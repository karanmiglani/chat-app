// import { Button } from '@chakra-ui/react'
import { Route } from "react-router-dom";
import "./App.css";
import { Routes } from "react-router-dom";
import Homepage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";

function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" Component={Homepage}>Home</Route>
      <Route path="/chats" Component={ChatPage}>Chats</Route>
      </Routes>
    </div>
  );
}

export default App;

