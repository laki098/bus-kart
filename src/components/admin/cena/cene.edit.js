import { useParams } from "react-router-dom";
import CeneForm from "./cene.form";

const CeneEdit = () => {
    const { id } = useParams();
    return(
        <>
        <CeneForm mode="edit" id={id} />
        </>
    );
};

export default CeneEdit;