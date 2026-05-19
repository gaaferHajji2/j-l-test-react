import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faSignal } from "@fortawesome/free-solid-svg-icons";
import { faUtensils } from "@fortawesome/free-solid-svg-icons/faUtensils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    <div className="m-5 shadow-md w-75 rounded-2xl overflow-hidden md:max-lg:w-90">
        <img className="h-75 object-cover w-full" src={props.imageurl} alt={props.imgalt}/>

        <div className="p-2">
            <div className="font-bold text-lg text-gray-700 leading-snug">
                <a href={props.titleurl} className="hover:underline">{props.title}</a>
            </div>
            
            <p className="text-xs leading-tight tracking-wide my-2">{props.description}</p>

            <div className="flex pt-2 border-t border-gray-300 text-sm text-gray-700 divide-x-2">
                <div className="flex-1 text-center">
                    <FontAwesomeIcon icon={faClock} />
                    <p>{props.time}</p>
                </div>

                <div className="flex-1 text-center">
                    <FontAwesomeIcon icon={faUtensils} />
                    <p>{props.servings}</p>
                </div>

                <div className="flex-1 text-center">
                    <FontAwesomeIcon icon={faSignal} />
                    <p>{props.level}</p>
                </div>
            </div>
        </div>
    </div>
  )
}
