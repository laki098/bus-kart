const PromenaPasworda = () => {
    return ( 
        <div className="styleHome">
            <div className="wrapper levo">
            <h2>Promena lozinke</h2><br/>
            <p className="tekst">Ako resetujete lozinku, nova lozinka će Vam stići na mail.</p>
            <p className="tekst">Novu lozinku unesite tek pošto unesete staru lozinku.</p>
            <table className="table">
                <tr>
                    <td >Reset pasword-a</td>
                    <td colSpan={3} className="levo"><button>Zaboravljena lozinka</button></td>
                    

                </tr>

                <tr>
                    <td>Stari pasword</td>
                    <td><input placeholder="Unesi stari pasword"></input></td>
                    <td>Novi pasword</td>
                    <td><input placeholder="Unesi novi pasword"></input></td>
                </tr>

            </table>
            </div>
        </div>
     );
}
 
export default PromenaPasworda;