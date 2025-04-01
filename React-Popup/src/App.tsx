import { useState } from 'react'
import './App.css'
import Modal from './components/Modal'

function App() {

  const [visible, setVisible] = useState<boolean>(false);

    return (
      <div className='bg-blue-400 bg-opacity-30 min-h-lvh'>
        <div className='max-w-3xl mx-auto'>
          <div className='text-center py-3'>
            <button className='bg-red-400 rounded-lg text-white 
              px-3 py-2 hover:scale-95 transition-transform text-xl'
              onClick={() => setVisible(prev => !prev)}>
                Open Modal
              </button>

            <div className='text-lg py-12'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit cumque 
              voluptatum eum dolorum dignissimos. Officia maiores, quod incidunt id 
              repellat quas cumque numquam sed, quia architecto expedita pariatur perferendis quasi tempore ipsa iure quo dolorum. Non, laboriosam culpa quibusdam rem, quidem enim commodi necessitatibus eius, architecto consequuntur repellendus similique quod possimus dolore minima odio accusamus temporibus beatae. Doloribus enim placeat magnam vitae illo sint? Esse consequuntur nam omnis ipsam quis tempora optio, ex, eum vitae maxime, unde porro ducimus quia dignissimos recusandae. Illum magni aliquam voluptatibus enim aliquid assumenda vero quaerat repellat. Magnam, saepe hic. Earum, in vero. Dolorem reprehenderit eveniet dolore, ipsa eius officia vitae nulla et eligendi cupiditate doloremque corrupti, mollitia sit inventore odio ex omnis quae porro molestias nisi adipisci libero. Dolorum fugiat atque esse recusandae eos voluptatum? Debitis temporibus autem nobis deleniti officiis consequuntur sed velit alias eveniet tempore id libero obcaecati, distinctio sapiente aut tempora laboriosam. Illum unde ducimus velit repellat, recusandae iste molestiae vel, eum facere ipsum aperiam necessitatibus ex quo esse vero perferendis laudantium sunt! Facilis quo placeat, temporibus possimus ullam ab sint non laudantium id libero. Ut dolor quod delectus rem, esse distinctio doloremque consequatur molestias incidunt aut saepe quas ratione possimus corporis id ab. Veritatis accusamus eum labore maxime ratione inventore? Laudantium possimus culpa sapiente vero, ex vitae quia quam expedita facere? Et facere nemo voluptatum unde corporis officiis accusantium fugit, asperiores doloremque, illo sint adipisci natus, non porro optio eaque magni fugiat! Odit, quaerat. Suscipit quam nobis quod voluptatem necessitatibus!
            </div>
          </div>
        </div>

        <Modal visible={visible} setVisible={setVisible} />
      </div>
    )
}

export default App
