import { Activity, AlertCircle, LogIn, Shield, Zap, ZapOff } from 'react-feather';
import './App.css'
import { useToast } from './components/ToastService';

function App() {

  const toast = useToast();

  const handleFail = () => {
    toast.open(<div className='flex gap-2 bg-white/90 text-red-800 p-4 rounded-lg shadow-md'>
      <AlertCircle size={45} />
      <div className='mr-5'>
        <h3 className='font-bold'>
          Action Failed
        </h3>

        <p className='text-sm'>This Action Failed</p>
      </div>
    </div>, 6000);
  };

  const handleLogin = () => {
    toast.open(<div className='flex gap-2 bg-green-500 text-gray-800 p-4 rounded-lg shadow-md'>
      <Shield size={45} />
      <div className='mr-8'>
        <h3 className='font-semibold'>
          Login Successfully
        </h3>

        <p className='text-sm'>Login Success</p>
      </div>
    </div>, 6000);
  };

  const handleActivate = ()=> {
    toast.open(<div className='flex gap-2 bg-gray-500 text-white/80 p-4 rounded-lg shadow-md'>
      <Activity size={45} />
      <div className='mr-8'>
        <h3 className='font-semibold'>
          Account Activated
        </h3>

        <p className='text-sm'>Your Account Activated</p>
      </div>
    </div>, 6000);
  }

  return (
    <main>
      <button className={`block btn btn-blue`} onClick={handleFail}>
        <AlertCircle className={`inline-block`} /> Fail
      </button>

      <button className={`block btn btn-red`} onClick={handleLogin}>
        <LogIn className={`inline-block`} /> Login
      </button>

      <button className={`block btn btn-green`} onClick={handleActivate}>
        <Zap className={`inline-block`} /> Activate
      </button>
    </main>
  )
}

export default App
