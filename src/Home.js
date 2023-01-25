import  "./index.css";
import { useState } from 'react';


const Home = () => {

    const [prevoznik, setPrevoznik] = useState('Nišekspres');
    const [linija, setLinija] = useState('Niš Beograd');
    const [vrstakarte, setVrstakarte]=useState('Jednosmerna');
  
    

    return ( 
        <div className="styleHome">
        <div className="wrapper">
            <h1>Rezervacija karata u autobuskom prevozu</h1>
        <form>
        <fieldset >
         <label >
           <p>Odaberite prevoznika, liniju i datum i vreme polaska, kao i da li je karta jednosmerna ili povratna </p>
         </label>

         <select
          value={prevoznik}
          onChange={(e) => setPrevoznik(e.target.value)}
        >
          <option value="Nišekspres">Nišekspres</option>
          <option value="Lasta">Lasta</option>
          <option value="Kanin">Kanin</option>
          <option value="Sinplon">Sinplon</option>
          <option value="Jeremić prevoz">Jeremić prevoz</option>
        </select>
        &emsp;&emsp;

        <select
          value={linija}
          onChange={(e) => setLinija(e.target.value)}
        >
          <option value="Niš - Beograd">Niš - Beograd</option>
          <option value="Beograd - Niš">Beograd - Niš</option>
          <option value="Pirot - Niš">Pirot - Niš</option>
          <option value="Niš - Pirot">Niš - Pirot</option>
          <option value="Leskovac - Niš">Leskovac - Niš</option>
        </select>

        &emsp;&emsp;
        <select
          value={vrstakarte}
          onChange={(e) => setVrstakarte(e.target.value)}
        >
          <option value="Jednosmerna">Jednosmerna</option>
          <option value="Povratna">Povratna</option>
        </select>

       </fieldset>
       <button type="submit">Submit</button>
       <br/> <br/><br/>


        <p><b>Vi ste odabrali</b> <br/> Liniju:  {linija} &ensp;<br/>Prevoznika: {prevoznik} &ensp;<br/>Karta je: {vrstakarte} </p> 
        <h4>Potvrdite</h4>

        
       

        </form>
    </div>
    </div>
     );
}
 
export default Home;