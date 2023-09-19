
import { BrowserRouter , Routes ,Route, Navigate} from 'react-router-dom' 
import './App.css'
import Product from "./pages/Product";
// import Home from './pages/Home';
import Pricing from './pages/Pricing';
import AppLayout from './pages/AppLayout';
import PageNotFound from './pages/PageNotFound';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import CityList from './components/CityList';
import CountryList from './components/CountryList';
import City from './components/City';
import Form from './components/Form';
import { CitiesProvider } from './Contexts/CitiesContext';
import { AuthProvider } from './Contexts/FakeAuthContext';
import ProtectedRoute from './pages/ProtectedRoute';


function App() {
  return (
    <AuthProvider>
    <CitiesProvider>
      <BrowserRouter>
      <Routes>
        <Route index element={<Homepage/>}/>
        <Route path='Product' element={<Product/>}/>
        <Route path='Pricing' element={<Pricing/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='app' element={<ProtectedRoute>
          <AppLayout/>
        </ProtectedRoute>
          }>
          <Route index element={<Navigate replace to="cities"/>}/>
          <Route path='cities' element={<CityList />}/>
          <Route path='cities/:id' element={<City/>}/>
          <Route path='contries' element={<CountryList />}/>
          <Route path='form' element={<Form/>}/>
        </Route>
        <Route path='*' element={<PageNotFound/>}/>
      </Routes>
      </BrowserRouter>
    </CitiesProvider>
    </AuthProvider>
      
  )
}

export default App
