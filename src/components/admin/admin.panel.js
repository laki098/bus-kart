import { Link } from "react-router-dom";

const AdminPanel = () => {
  return (
    <>
      <Link to={"/bus.initial"}>
        <button>Autobusi</button>
      </Link>
      <Link to={"/admin.initial"}>
        <button>Linije</button>
      </Link>
      <Link to={""}>
        <button>Korisnici</button>
      </Link>
    </>
  );
};

export default AdminPanel;
