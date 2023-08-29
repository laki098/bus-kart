import { useParams } from "react-router-dom";
import BusForm from "./bus.form";

const BusChangeLine = () => {
  const { idAutobusa } = useParams(); //useParams vraca sve kljuceve parametara iz url-a. Dekonstuisemo ga da ne bi pisali params.id
  return (
    <>
      <BusForm mode="edit" idAutobusa={idAutobusa} />
    </>
  );
};

export default BusChangeLine;
