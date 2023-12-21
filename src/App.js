import "./App.css";
import LoginComponent from "./components/login/login.component";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/NavBar/navbar";
import Pocetna from "./components/NavBar/links/Pocetna";
/* import Rezervacija from './components/rezervacija/Rezervacija';
import UpisiRedVoznje from './components/prevoznik/UpisiRedVoznje'; */

import RezervacijaKarte from "./components/NavBar/links/RezervacijaKarte";
import Kontakt from "./components/NavBar/links/Kontakt";
import Footer from "./components/NavBar/Footer/footer";
import RegistrationComponent from "./components/registration/registration.component";
import ResetPassword from "./components/login/reset.password";
import AdminChangeLine from "./components/admin/admin.change.line";
import AdminComponent from "./components/admin/admin.component";
import AdminInitial from "./components/admin/admin.initial";
import BusInitional from "./components/admin/bus.initional";
import BusAdd from "./components/admin/bus.add";
import BusChangeLine from "./components/admin/bus.change.line";
import AdminPanel from "./components/admin/admin.panel";
import KorisniciInitial from "./components/admin/korisniciInitial";
import KorisnikChange from "./components/admin/korisnikChange";
import Korisnik from "./components/NavBar/links/korisnik/korisnik";
import Karta from "./components/NavBar/links/korisnik/karta";
import Stjuardesa from "./components/stjuardesa/stjuardesa";
import StaniceInitial from "./components/admin/stanica/stanice.initial";
import StaniceAdd from "./components/admin/stanica/stanice.add";
import StaniceEdit from "./components/admin/stanica/stanice.edit";
import StjuardesaLinija from "./components/stjuardesa/stjuardesaLinija";
import PasswordReset from "./components/login/passwordReset";
import { AuthProvider } from "./components/autentifikacija/AuthContext";
import ProtectedRoute from "./components/autentifikacija/ProtectedRoute";
import CeneInitial from "./components/admin/cena/cene.initial";
import CeneAdd from "./components/admin/cena/cene.add";
import CeneEdit from "./components/admin/cena/cene.edit";
import Verifikacija from "./components/admin/verifikacija/verifikacija";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />

          <div className="content">
          <AuthProvider>
            <Switch>
              <Route path="/pocetna">
                <Pocetna />
              </Route>
              <Route path="/login.component">
                <LoginComponent />
              </Route>
              <Route path="/rezervacijakarte">
                <RezervacijaKarte />
              </Route>
              <Route path="/:id/rezervacijakarte">
                <RezervacijaKarte />
              </Route>
              <Route path="/kontakt">
                <Kontakt />
              </Route>
              <Route path="/korisnik">
                <Korisnik />
              </Route>
              <Route path="/karta">
                <Karta />
              </Route>
              <Route path="/verifikacija/:id">
              <Verifikacija />
              </Route>
              <Route path="/passwordreset/:token">
              <PasswordReset />
            </Route>
            <Route path="/registration.component">
              <RegistrationComponent />
            </Route>
            <Route path="/reset.password">
              <ResetPassword />
            </Route>
            </Switch>
          </AuthProvider>
          <AuthProvider>
          <Switch>
            <ProtectedRoute
              path="/:id/admin.change.line"
              component={AdminChangeLine}
              adminOnly
            />
            <ProtectedRoute
              path="/admin.component"
              component={AdminComponent}
              adminOnly
            />
            <ProtectedRoute
              path="/admin.initial"
              component={AdminInitial}
              adminOnly
            />
             <ProtectedRoute
                path="/:id/stjuardesalinija"
                component={StjuardesaLinija}
                stjuardesaOnly
              />
               <ProtectedRoute
                path="/adminpanel"
                component={AdminPanel}
                adminOnly
              />
              <ProtectedRoute
                path="/stjuardesa"
                component={Stjuardesa}
                stjuardesaOnly
              />
            <ProtectedRoute
              path="/bus.initial"
              component={BusInitional}
              adminOnly
            />
            <ProtectedRoute
              path="/stanice.initial"
              component={StaniceInitial}
              adminOnly
            />
            <ProtectedRoute path="/bus.add" component={BusAdd} adminOnly />
            <ProtectedRoute
              path="/:idAutobusa/bus.change.line"
              component={BusChangeLine}
              adminOnly
            />
            <ProtectedRoute
              path="/korisniciInitial"
              component={KorisniciInitial}
              adminOnly
            />
            <ProtectedRoute
              path="/:idKorisnik/korisnikChange"
              component={KorisnikChange}
              adminOnly
            />
            <ProtectedRoute
              path="/stanice.add"
              component={StaniceAdd}
              adminOnly
            />
            <ProtectedRoute
              path="/:id/stanice.edit"
              component={StaniceEdit}
              adminOnly
            />
            
            <ProtectedRoute
              path="/cene.initial"
              component={CeneInitial}
              adminOnly
            />
            <ProtectedRoute path="/cene.add" component={CeneAdd} adminOnly />
            <ProtectedRoute
              path="/:id/cene.edit"
              component={CeneEdit}
              adminOnly
            />
             </Switch>
          </AuthProvider>
          </div>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
