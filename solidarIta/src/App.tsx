// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login/index";
// import { Multi } from "./pages/Multicontas";
// import SidebarWithHeader from "./components/SidebarHeader/index"
// import Pagina404 from "./pages/Page404";
// import { Ws } from "./pages/Ws";
// import { AccountProvider } from "./pages/Ws/AccountContext";
// import { Black } from "./pages/Blacklist";
// import { Sync } from "./pages/sync2";
// import CreateModal from "./pages/sync2/Modal/Create-update"
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Routess } from "./Routes";


export function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routess />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}
