
interface RecipeCardProps {
    imageurl: string;
    imgalt: string; 
    titleurl: string; 
    title: string; 
    description: string; 
    time: string; 
    servings: string; 
    level: string
}

export default function RecipeCard(props: RecipeCardProps) {
  return (
    <div className="m-5 shadow-md w-80 rounded overflow-hidden">
        <img src={props.imageurl} alt={props.imgalt} />

        <div className="p-2">
            <div className="font-bold text-lg text-gray-700 leading-snug">
                <a href={props.titleurl} className="hover:underline">{props.title}</a>
            </div>
        </div>
    </div>
  )
}
