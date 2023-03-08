import React from 'react'
import "./kontakt.css";
import AdminInitial from '../../admin/admin.initial'
import Bus from '../../admin/admin.bus';
import BusForm from '../../admin/bus.form';





const Kontakt = () => {
  return (
    <div>
     

        <BusForm />


        <AdminInitial />
      
      
      <section className='distance'>
        <div className="contact row1">
                <div className="contact_prikaz">
                    
                    <div className="contact-div">
                        <h3>Nas kontakt</h3>
                        
                            <h5>Broj i Email</h5>
                            <p>broj: 037 44 32 77</p>
                            <p>e-mail: eurocompassdoo@gmail.com </p>
                          
                          
                    </div>
                </div>
                <div className="rasponsive-maps contact_prikaz">
                <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2890.003133483065!2d21.32630621576257!3d43.5856510648136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475687e7b6613f35%3A0xa504bc5265bd6eee!2seurocompass!5e0!3m2!1sen!2srs!4v1677160858699!5m2!1sen!2srs"
			    
                title='Google'
                 />

                </div>
            </div>   
            </section>
          

    </div>
  )
}

export default Kontakt
