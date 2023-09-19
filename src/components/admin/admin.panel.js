import { Link } from "react-router-dom";
import "./admin.css";

import bus1 from "../images/bus1.jpg";
import "./admin.css";

const AdminPanel = () => {
  return (
    <div>
      <br />
      <Link to={"/bus.initial"}>
        <button className="button-panel">Autobusi</button>
      </Link>
      &ensp;
      <Link to={"/admin.initial"}>
        <button className="button-panel">Linije</button>
      </Link>
      &ensp;
      <Link to={"/korisniciInitial"}>
        <button className="button-panel">Korisnici</button>
      </Link>
    </div>
  );
};

export default AdminPanel;
