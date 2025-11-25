import './App.css'
import Alert from './components/Alert'
import { AlertType } from './constant'

function App() {
  return (
    <>
      <div className='card'>
        <Alert title='Create Apps' type={AlertType.information}>
          <p>This message for creating apps</p>
        </Alert>
      </div>

      <br />

      <div className='card'>
        <Alert title='Create JLoka Apps' type={AlertType.warning} closeable>
          <p>This message for creating apps</p>
        </Alert>
      </div>
    </>
  )
}

export default App
