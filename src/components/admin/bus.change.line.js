import { useParams } from "react-router-dom";
import BusForm from "./bus.form";

const BusChangeLine = () => {
  const { id } = useParams(); //useParams vraca sve kljuceve parametara iz url-a. Dekonstuisemo ga da ne bi pisali params.id
  console.log();
  return (
    <>
      <BusForm mode="edit" id={id} />
    </>
  );
};

export default BusChangeLine;
