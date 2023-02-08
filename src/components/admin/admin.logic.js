import { useState } from "react";

const AdminLogic = () => {
    let [data, setData] = useState({});


    const changeHandler = (e) => setData({
        ...data,
        [e.target.name]: e.target.value
      })
      
    return {changeHandler, setData};
}

 
export default AdminLogic;