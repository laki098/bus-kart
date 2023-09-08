import { useParams } from "react-router-dom";
import LineForm from "./line.form";
import { useLocation } from "react-router-dom";

const AdminChangeLine = () => {
  const { id } = useParams(); //useParams vraca sve kljuceve parametara iz url-a. Dekonstuisemo ga da ne bi pisali params.id

  //?primanje podataka sa pocetne za bas odredjenu liniju
  const location = useLocation();
  const state = location.state;

  return (
    <>
      <LineForm mode="edit" id={id} state={state} />
    </>
  );
};

export default AdminChangeLine;
