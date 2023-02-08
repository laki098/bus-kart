import React, { useState } from "react";
import  DatePicker  from 'react-datepicker';




const AdminComponent = () => {

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date())
    /* const [startTime, setStartTime] = useState('') */

    

    return ( 
        <div>
             <h2>Nova linija</h2>
             <form>
                <label>Mesto polaska</label><br />
                <input
                type='text'
                placeholder="Mesto polaska"
                required
                /><br/>
                <label>Mesto dolaska</label><br/>
                <input
                type='text'
                placeholder="Mesto dolaska"
                required
                /><br/>
                
                <label>Datum polaska</label>
                <DatePicker className="inputText"
                 selected={startDate}
                  value={startDate}
                  required
                  scrollableMonthYearDropdownv 
                  placeholderText="Datum dolaska"
                   onChange={(date) =>   
                            setStartDate(date)} />  
                <label>Datum dolaska</label>
                <DatePicker className="inputText"
                 selected={endDate}
                  value={endDate}
                  required
                  scrollableMonthYearDropdownv 
                  placeholderText="Datum dolaska"
                   onChange={(date) =>   
                            setEndDate(date)} /><br/>
                <label>Vreme polaska</label><br/>
                <input className="inputText" type="time" required label="Time"></input>
                <br/>
                <label>Vreme dolaska</label><br/>
                <input className="inputText" type="time" required ></input><br/>
                <label>Prevoznik</label><br/>
                <select>
                    <option value=''>Eurocompass</option>
                    
                </select><br/>
                
                <button>Dodaj</button>

                </form>   
                    
         </div>

     );
}
 
export default AdminComponent;
