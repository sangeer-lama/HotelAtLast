import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Homescreen from './screens/Homescreen';
import Registerscreen from './screens/Registerscreen';
import Loginscreen from './screens/Loginscreen';
import Bookingscreen from './screens/Bookingscreen';
import Adminscreen from './screens/Adminscreen';
import Profilescreen from './screens/Profilescreen';
import Map from './screens/Map';
import Landingscreen from './screens/Landingscreen';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <BrowserRouter>
      <Routes>
        <Route path ="/home" element={<Homescreen/>}/>
        <Route path ="/register" element={<Registerscreen/>}/>
        <Route path ="/login" element={<Loginscreen/>}/>
        <Route path ="/book/:roomid" element={<Bookingscreen/>}/>
        <Route path ="/admin" element={<Adminscreen/>}/>
        <Route path ="/profile" element={<Profilescreen/>}/>
        <Route path ='/map' element={<Map/>}/>
        <Route path ='/' element={<Landingscreen/>}/>
        </Routes>
      </BrowserRouter>
    </div>



  );
}

export default App;
