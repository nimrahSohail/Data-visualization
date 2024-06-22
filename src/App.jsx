import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import TweetsTable from "./components/TweetsTable/TweetsTable";
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
} from "react-icons/bs";
import { Link } from 'react-router-dom';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  const isActiveLink = (match, location) => {
    // Check if the current location matches the link's path
    if (match) {
      return true; // Set link as active
    } else {
      return false; // Set link as inactive
    }
  };

  return (
    <div className="grid-container">
      <BrowserRouter>
      <aside
        id="sidebar"
        className={openSidebarToggle ? "sidebar-responsive" : ""}
      >
        <div className="sidebar-title">
          <div className="sidebar-brand"> Sentix
          </div>
          <span className="icon close_icon" onClick={OpenSidebar}>
            X
          </span>
        </div>
        
        <ul className='sidebar-list'>
            <li className='sidebar-list-item active-link' >
                <Link to="/" ><BsGrid1X2Fill className='icon'/>Home</Link>
            </li>
            <li className='sidebar-list-item active-link'>
                <Link to="/table" ><BsFillArchiveFill className='icon'/>Tweets Table</Link>
            </li>
        </ul>
      </aside>

      
        <Header OpenSidebar={OpenSidebar} />
        {/* <Home /> */}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/table" element={<TweetsTable />} />
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
