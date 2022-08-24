import "./Navbar.css"
import { Button } from '@chakra-ui/react'
import { useLocation, Link, Navigate} from "react-router-dom";
const NavBar = () => {
  const location = useLocation();
  return <div className="container-navbar">
    <div className="container-item-navbar">
        <Link to="/"><Button  variant={"unstyled"} >Home</Button></Link>
    </div>
    <div className="container-item-navbar" >
        <Link to="/interestGroups"><Button variant={"unstyled"} >Grupos de interés</Button></Link>
    </div>
  </div>;
};

export default NavBar;
