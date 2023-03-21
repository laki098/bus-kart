import React, { useState } from 'react';
import "./poppup";
import Poppup from './poppup';
 

function TestPop() {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  }
  

  return <div>
    <input
      type="button"
      value="Vrsta karte"
      onClick={togglePopup}
    />
    
    {isOpen && <Poppup
      content={<div>
        
        
        
      </div>}
      handleClose={togglePopup}
    />}
  </div>
  
}

export default TestPop;
