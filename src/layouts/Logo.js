import imgfile from '../assets/images/logos/ketilogo.png';
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/">
      <img src={imgfile} width="220px" height="55px" alt=""></img>
      {/* <LogoDark /> */}
    </Link>
  );
};

export default Logo;
