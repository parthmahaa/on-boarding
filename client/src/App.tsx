import './App.css'
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import OnboardingForm from './Components/OnBoardingForm';
import Admin from './Components/Admin/Admin';
import Login from './Components/Login';
import Home from './Components/Home';
import Navbar from './Components/Navbar';

function Layout() {
  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-white">
        <Outlet />
      </main>
    </>
  );
}
function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
        limit={1}
        style={{ zIndex: 9999 }}
      />
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<OnboardingForm />} />
          </Route>
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login/>} />
          <Route path='/home' element={<Home/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App
