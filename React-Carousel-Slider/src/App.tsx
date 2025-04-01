import './App.css'

import Img1 from './images/1.jpg';
import Img2 from './images/2.jpg';
import Img3 from './images/3.jpg';
import Img4 from './images/6.jpg';
import Img6 from './images/10.jpg';
import Img7 from './images/11.jpg';
import Carousel from './components/Carousel';

const images= [
  Img1, Img2, Img3, Img4, Img6, Img7
];

function App() {

  return (
    <main>
      <div className='max-w-lg'>
        <Carousel>
          {
            images.map((image, index) =>
                  <img src={image} key={index}  />
            )
          }
        </Carousel>
      </div>
    </main>
  )
}

export default App
