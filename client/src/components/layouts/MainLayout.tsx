import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";


const MainLayout = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
