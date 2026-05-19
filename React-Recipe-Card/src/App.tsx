import './App.css'
import RecipeCard from './componnets/RecipeCard'

function App() {

  return (
    <div className='grid gap-2 justify-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      <RecipeCard 
          imageurl="https://images.unsplash.com/photo-1598023696416-0193a0bcd302?q=80&w=936&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          imgalt='Pizza Margherita image' 
          titleurl='#' title='Pizza Margherita' 
          description='Invented in Naples in honor of the first queen of Italy, the Margherita pizza is
          the triumph of Italian cuisine in the world.' 
          time='1h 15m' servings='4 Servings' level='Easy'
        />

        <RecipeCard 
          imageurl="https://plus.unsplash.com/premium_photo-1673439304183-8840bd0dc1bf?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          imgalt='Pizza Margherita image' 
          titleurl='#' title='Pizza Margherita' 
          description='Invented in Naples in honor of the first queen of Italy, the Margherita pizza is
          the triumph of Italian cuisine in the world.' 
          time='1h 15m' servings='4 Servings' level='Easy'
        />

        <RecipeCard 
          imageurl="https://plus.unsplash.com/premium_photo-1667682942148-a0c98d1d70db?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          imgalt='Pizza Margherita image' 
          titleurl='#' title='Pizza Margherita' 
          description='Invented in Naples in honor of the first queen of Italy, the Margherita pizza is
          the triumph of Italian cuisine in the world.' 
          time='1h 15m' servings='4 Servings' level='Easy'
        />

        <RecipeCard 
          imageurl="https://media.istockphoto.com/id/2257215754/photo/pinsa-bianca-white-pizza-with-oregano-on-wooden-table.webp?s=1024x1024&w=is&k=20&c=-aBjr53nmJFaf4mO7FZwVrcKCtV-1fqG71p87T-FpIU=" 
          imgalt='Pizza Margherita image' 
          titleurl='#' title='Pizza Margherita' 
          description='Invented in Naples in honor of the first queen of Italy, the Margherita pizza is
          the triumph of Italian cuisine in the world.' 
          time='1h 15m' servings='4 Servings' level='Easy'
        />
    </div>
      
  )
}

export default App
