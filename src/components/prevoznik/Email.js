import React from 'react';
import { useRef } from 'react';
import emailjs from '@emailjs/browser';

const Email = () => {
    const form=useRef();
    const sendEmail=(e)=>{
        e.preventDefault();

        emailjs.sendForm('slobodanka.nedeljkovic@skysoft.rs', 'YOUR_TEMPLATE_ID', form.current, 'YOUR_PUBLIC_KEY')
          .then((result) => {
              console.log(result.text);
          }, (error) => {
              console.log(error.text);
          });

    };

  return (
    <section>
       <div className='container' >
            <h2 className='--text-center'> Contact Us </h2>
            <form  ref={form} onSubmit={sendEmail} className='--form-control --card --flex-center --dir-column'>
                <input type='text' placeholder='Ime i prezime' name='user_name' required />
                <input type='Email' placeholder='Email' name='user_email' required />
                <input type='text' placeholder='Sublect' name='user_subject' required />
                <textarea name='message' cols="30" rows="10"></textarea>
                <button type='submit' className='--btn--btn-primary'>Send message</button>
            </form>


       </div>


    </section>
  )
}

export default Email