import React from "react";
import './reset.css';
import bus from '../images/bus.jpg';

const ResetPassword = () => {
    return ( 
        <div className="main">
            <div className="sub-main1">
                <div>
                    <div className="imgs">
                        <div className="container-image1">
                            <img src={bus} alt="bus" className="bus"/>
                        </div>
                    </div>
                    <h1 className="h1">Resetuj lozinku</h1>
                    <div>
                        <input type='email' placeholder="Email adresa" className="input1 name" name="email" />
                    </div>

                    <div className="login-button">
                        <button className="button">Potvrdi</button>
                    </div>
                </div>
            </div>
        </div>
        
     );
}
 
export default ResetPassword;