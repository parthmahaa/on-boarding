import './App.css'
import OnboardingForm from './Components/OnBoardingForm'
import { ToastContainer} from 'react-toastify';
function App() {

  return (
    <>
    <ToastContainer
      position="top-center"
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
      style={{zIndex: 9999}} // Ensure toasts are always on top
    />
      <main className="min-h-screen bg-white">
        <OnboardingForm />
      </main>
    
    </>
  )
}

export default App
