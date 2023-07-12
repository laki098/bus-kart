import { Link } from "react-router-dom";

import bus1 from "../images/bus1.jpg";
import "./admin.css";

const AdminPanel = () => {
  return (
    <div className="backgroundBus" style={{ backgroundImage: `url(${bus1})` }}>
      <br/>
      <Link to={"/bus.initial"}>
        <button>Autobusi</button>
      </Link> &ensp;
      <Link to={"/admin.initial"}>
        <button>Linije</button>
      </Link> &ensp;
      <Link to={""}>
        <button>Korisnici</button>
      </Link>

      <p>&nbsp;<br/> &ensp;<br/> &emsp;<br/>&nbsp;<br/> &ensp;<br/> &emsp;<br/>&nbsp;<br/> &ensp;<br/> &emsp;<br/></p>
      <p>&nbsp;<br/> &ensp;<br/> &emsp;<br/>&nbsp;<br/> &ensp;<br/> &emsp;<br/>&nbsp;<br/> &ensp;<br/> &emsp;<br/></p>
     
    </div>
  );
};

export default AdminPanel;
