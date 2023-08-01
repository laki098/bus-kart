import { Link } from "react-router-dom";
import './admin.css';

const AdminPanel = () => {
  return (
    <>
      <Link to={"/bus.initial"}>
        <button className="dugme">Autobusi</button>
      </Link>
      <Link to={"/admin.initial"}>
        <button className="dugme">Linije</button>
      </Link>
      <Link to={""}>
        <button className="dugme">Korisnici</button>
      </Link>
    </>
  );
};

export default AdminPanel;
