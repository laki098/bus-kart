import React from "react";
import { Link } from 'react-router-dom';


import "./footer.css";




const Footer = () => {
    return ( 
       <div className="footer">
		<div className="container">
			<div className="row">
				<div className="footer-col">
					<h4>Proba</h4>
					<ul>
						<li>Lorem ipsum dolor sit amet</li>
						<li>Lorem ipsum dolor sit amet</li>
						<li>Lorem ipsum dolor sit amet</li>
					</ul>
				</div>
				<div className="footer-col">
					<h4>Test</h4>
					<ul>
						<li>Lorem ipsum dolor sit amet</li>
						<li>Lorem ipsum dolor sit amet</li>
						<li>Lorem ipsum dolor sit amet</li>
					</ul>
				</div>
				<div className="footer-col">
					<h4>Kraj</h4>
					<ul>
						<li>Lorem ipsum dolor sit amet</li>
						<li>Lorem ipsum dolor sit amet</li>
						<li>Lorem ipsum dolor sit amet</li>
					</ul>
				</div>
				<div className="footer-col">
					<h4>Pratite nas</h4>
					<div className="social-links">
					<Link to='https://www.facebook.com/'><i className ="fab fa-facebook-f"></i></Link>
					<Link to='https://www.facebook.com/'><i className ="fab fa-twitter"></i></Link>
					<Link to='https://www.facebook.com/'><i className ="fab fa-instagram"></i></Link>
					<Link to='https://www.facebook.com/'><i className ="fab fa-linkedin-in"></i></Link>
					</div>
				</div>
			</div> 
			<hr />
			{/* <div className="row"> */}
				<p className="data">
					&copy;{new Date().getFullYear()} Ovaj sajt je uradjen / Sva prava / 
				</p>
			{/* </div> */}
		</div>
	   </div>

	   
     );
}
 
export default Footer;
