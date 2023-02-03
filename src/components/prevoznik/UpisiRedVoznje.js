import  "./index.css";

const UpisiRedVoznje = () => {
    return ( 
    <div className="styleHome1">
        <div className="wrapper">
            
            <table className="table">
                <tr>
                    <td><label>Autoprevoznik  </label></td>
                    <td><input type="text" placeholder="Autoprevoznik"></input></td>
                </tr>
                <tr>
                    <td><label>Pasword  </label></td>
                    <td><input type="text" placeholder="Pasword"></input></td>
                </tr>
            </table>
            <fieldset className="sirinaSet">

                <table className="table">
                    <tr>
                        <td colSpan={2}>Radni dani</td>
                        <td colSpan={2}>Subota</td>
                        <td colSpan={2}>Nedelja</td>
                        <td colSpan={2}>Vandredni polazak</td>
                        <td>Upis/Promena</td>
                    </tr>
                    <tr>
                        <td><input type="time" placeholder="Time" name="polazakRadniDan"></input></td>
                        <td><input type="time" placeholder="Time" name="dolazakRadniDan"></input></td>
                        <td><input type="time" placeholder="Time" name="polazakSubota"></input></td>
                        <td><input type="time" placeholder="Time" name="dolazakSubota"></input></td>
                        <td><input type="time" placeholder="Time" name="polazakNedelja"></input></td>
                        <td><input type="time" placeholder="Time" name="dolazakNedelja"></input></td>
                        <td><input type="time" placeholder="Time" name="polazakVandredno"></input></td>
                        <td><input type="time" placeholder="Time" name="dolazakRedovno"></input></td>
                        <td> <button>Upis</button> <button>Promena</button> <button>Brisanje</button> </td>
                    </tr>

                </table>
                

            </fieldset>

        </div>
    </div>    
     );
}
 
export default UpisiRedVoznje;