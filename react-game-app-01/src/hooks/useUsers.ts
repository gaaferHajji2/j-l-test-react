import { useEffect, useState } from "react";
import User from "../models/user";
import userService from "../services/user-service";
import { CanceledError } from "axios";


const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  const [message, setMessage] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);

  const [counter, setCounter] = useState(10);

  // const clearUsers= () => {
  //     console.log('Clearing Users Data');
  //     // setUsers([]);

  //     // controller.abort();
  // };

  // useEffect(() => {
  //   console.log("Fetching Data in category: ", category);
  //   setProducts(["Jafar-Loka-01", "Jafar-Loka-02", "Jafar-Loka-03"]);
  //   // connect();
  //   return () => setProducts([]);
  // }, [category]);

  useEffect(() => {
    setIsLoading(true);

    const { request, cancel } = userService.getAllData<User>();

    request
      .then((response) => {
        console.log(response);
        setUsers(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) {
          console.log("We Have Cancelled The Request");

          return;
        }

        console.log(err);
        setMessage("Error During Connection To Server");
        setIsLoading(false);
      });

    return () => {
      console.log("Clearing OR Cancelling the User Request");

      setUsers([]);

      cancel();
    };
  }, []);

  return { users, message, isLoading, counter, setUsers, setMessage, setCounter };
};

export default useUsers;