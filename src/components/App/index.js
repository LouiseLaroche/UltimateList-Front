// == Import
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// == Import component
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';
import Login from 'src/components/Login';
import SignUp from 'src/components/SignUp';
import List from 'src/components/Lists/List';
import Error404 from 'src/components/Errors/Error404';
import Error401 from 'src/components/Errors/Error401';
import Home from 'src/components/Home';
import Add from 'src/components/Lists/Add/Add';
import User from 'src/components/User';
import Contact from '../Annex/Contact';
import Team from '../Annex/Team';

// == Import actions
import { getItemsFromApi } from '../../actions/items';
import { getUserItemsFromApi } from '../../actions/userItems';

// == Import style
import './styles.scss';
import { getModeFromApi } from '../../actions/modes';

// == Composant
const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getItemsFromApi());
    dispatch(getUserItemsFromApi());
    dispatch(getModeFromApi());
  }, []);

  const logged = useSelector((state) => state.login.logged);

  return (
    <div className="container-app">
      <Header />
      <div className="app">
        <User />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<SignUp />} />

          {/* delete those lines when token is store in a cookie */}
          <Route path="/:slug/liste" element={<List />} />
          <Route path="/:slug/ajouter" element={<Add />} />

          {logged && <Route path="/:slug/liste" element={<List />} />}
          {logged && <Route path="/:slug/ajouter" element={<Add />} />}
          {logged && <Route path="/*" element={<Error404 />} />}
          {!logged && <Route path="/*" element={<Error401 />} />}
          <Route path="/contact" element={<Contact />} />
          <Route path="/a-propos" element={<Team />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

// == Export
export default App;
