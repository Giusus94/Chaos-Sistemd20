import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/User/Profile';
import Classes from './pages/Game/Classes';
import Factions from './pages/Game/Factions';
import CharacterCreator from './pages/Game/CharacterCreator';
import Marketplace from './pages/Marketplace/Marketplace';

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/classes' element={<Classes />} />
      <Route path='/factions' element={<Factions />} />
      <Route path='/character' element={<CharacterCreator />} />
      <Route path='/marketplace' element={<Marketplace />} />
    </Routes>
  </Router>
);

export default App;
