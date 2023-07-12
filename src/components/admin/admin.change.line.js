import { useEffect } from "react";
import { useParams } from "react-router-dom";
import LineForm from "./line.form";

const AdminChangeLine = () => {
  const { id } = useParams(); //useParams vraca sve kljuceve parametara iz url-a. Dekonstuisemo ga da ne bi pisali params.id

  return (
    <>
      <LineForm mode="edit" id={id} />
    </>
  );
};

export default AdminChangeLine;
