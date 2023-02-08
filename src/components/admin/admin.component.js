import React, { useState } from "react";
import  DatePicker  from 'react-datepicker';




const AdminComponent = () => {

    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
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
                    value={startDate}
                    showYearDropdown
                    required
                    placeholderText="Datum polaska"
                    scrollableMonthYearDropdownv 
                    onChange={(date) =>   
                            setStartDate(date)} />  
                <label>Datum dolaska</label>
                <DatePicker className="inputText"
                    value={endDate}
                    showYearDropdown
                    placeholderText="Datum dolaska"
                    required
                    scrollableMonthYearDropdownv 
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
