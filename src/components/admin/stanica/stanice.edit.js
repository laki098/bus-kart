import { useParams } from "react-router-dom";
import StaniceForm from "./stanice.form";

const StaniceEdit = () => {
  const { id } = useParams();
  return (
    <>
      <StaniceForm mode="edit" id={id} />
    </>
  );
};

export default StaniceEdit;
