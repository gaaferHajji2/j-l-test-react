import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export interface ITodo {
  id: number;
  title: string;
  completed: boolean;
}

const Demo = () => {

  const queryClient = useQueryClient();

  const {
    data: todos,
    isLoading: todosLoading,
    isError,
    isFetching,
  } = useQuery({
    queryFn: () => {
      console.log("Fetched Todos Again")
      return axios.get<ITodo[]>("https://jsonplaceholder.typicode.com/todos/")
    },
    queryKey: ["todos"],
    staleTime: 2000,
    gcTime: 2,
  });

  const { mutateAsync: addTodoMutation } = useMutation({
    mutationFn: (title: string) =>
      axios.post("https://jsonplaceholder.typicode.com/todos", {
        id: todos?.data != undefined ? todos?.data?.length + 1 : 500,
        title: title,
        completed: true,
      }),

			mutationKey: ["todos_mutation"],

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['todos']});
      },
      
  });

	const [title, setTitle] = useState<string>("");

  const [tId, setTId] = useState<number>(1);

  const {
    data: todo,
    isLoading: dataLoading,
    isError: errSt,
    error: errData
  } = useQuery({
    queryFn: () => {

      console.log("Fetch One Todo Only");

      return axios.get<ITodo>("https://jsonplaceholder.typicode.com/todos/" + tId);

    },
    queryKey: ["todo", { tId }],   
  });

  return (
    <>
      {isError && <div> Error Happened: {errData?.message}</div>}

			<div>
				<input onChange={(e) => setTitle(e.target.value)} value={title} type="text" />
				<button onClick={async () => {
					try {
						await addTodoMutation(title);
						setTitle("");
					} catch (e) {
						console.log("The Error is: ", e);
						setTitle("");
					}
				}}>Add New Title</button>
			</div>

      {todosLoading || isFetching && <div>Loading Data Begin...</div>}

      <ul>
        {todos?.data?.slice(0, 5).map((todo, index) => {

            return (
              <li key={index}>
                <div>{todo.id}</div>
                <div>{todo.title}</div>
                <div>{todo.completed == true ? "Completed OK" : "Not Completed"}</div>
              </li>
            );
            
          
        })}
      </ul>

      <div>
        { dataLoading && <div> Data For Parameter is Loading...</div>}

        <div>
          <input type="number" value={tId} onChange={(e) => setTId(parseInt(e.target.value))} />
        </div>

        <div>
          <p>The Todo Data is: </p>
          <p>The Id is: {todo?.data.id}</p>
          <p>The title is: {todo?.data.title}</p>
          <p>{todo?.data.completed == true ? "Todo Completed" : "Todo Not Completed"}</p>
          <p>{errSt && <span>We Have Error</span>}</p>
        </div>
      </div>
    </>
  );
};

export default Demo;
