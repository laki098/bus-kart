import LoginLogic from "./login.logic";
import { Link } from 'react-router-dom';
import './loginStyle.css';
import profile from '../images/profile.png';
import user from '../images/user.png';
import password from '../images/password.png';






const LoginComponent = () => {
    const loginLogic = LoginLogic()
    return ( 
    

<div className="main">
     <div className="sub-main">
       <div>
         <div className="imgs">
           <div className="container-image">
             <img src={profile} alt="profile" className="profile"/>
          
           </div>


         </div>
         <div>
           <h1>Uloguj se</h1>
           <div>
              <img src={user} alt="user" className="user"/>
             <input  type="text" placeholder="Korisnicko ime" name="korisnickoIme" className="name input" onChange={loginLogic.changeHandler}/>
           </div>
           <div className="second-input">
             <img src={password} alt="password" className="user1"/>
             <input type="password" placeholder="Lozinka" name="lozinka" className="name input" onChange={loginLogic.changeHandler}/>
           </div>
          <div className="login-button">
          <button className="button" onClick={loginLogic.login}>Login</button>
          </div>
           
            <div className="link">
            <Link to ='/reset.password' className="a">Zaboravio sifru ? </Link> ili <Link to ='/registration.component' className="a">Registruj se</Link>
            </div>
           
 
         </div>
       </div>
       

     </div>
      {/* <input className="input1" type="text" name="korisnickoIme" required onChange={loginLogic.changeHandler}></input>
        <input className="input1" type="password" name="lozinka" required onChange={loginLogic.changeHandler}></input>
        <button className="button" onClick={loginLogic.login}>Login</button> */}
     {/*    <Link to ='/registration.component'>Registruj se</Link> */}
    </div>

      
       
      
     );
}
 
export default LoginComponent;