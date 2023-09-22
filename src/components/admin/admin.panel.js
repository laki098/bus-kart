import { Link } from "react-router-dom";
import "./admin.css";

const AdminPanel = () => {
  return (
    <div>
      <div className="red-1"></div>
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
      <Link to={"stanice.initial"}>
        <button className="button-panel">Stanice</button>
      </Link>
    </div>
  );
};

export default AdminPanel;
