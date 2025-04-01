// import { useEffect, useState } from "react";

// import apiClient from "../../services/api-client";

// import { CanceledError } from "../../services/api-client";

import userService from "../../services/user-service";

import User from "../../models/user";
import useUsers from "../../hooks/useUsers";

// interface Props {
//   category: string;
// }

const ProductList = () => {
  // const [products, setProducts] = useState<string[]>([]);

  //   const connect = () => console.log("Connecting");
  //   const disconnect = () => console.log("Disconnecting");

  const { users, message, counter, isLoading, setUsers, setMessage, setCounter } = useUsers();

  function deleteUser(id: number) {
    // console.log("The Deleted Id is: " + id);

    const originalUsers = [...users];
    setUsers(users.filter((user) => user.id !== id));

    userService.deleteData(id).catch((err) => {
      setUsers(originalUsers);

      setMessage(err.message);
    });
  }

  function addUser() {
    const originalUsers = [...users];

    const originalCounter = counter;

    setUsers([
      {
        id: counter + 1,
        name: "Jafar-Loka-01",
        username: "Jafar-Loka-01",
        email: "gaafer.hajji1995@gmail.com",
      },
      ...users,
    ]);

    setCounter(counter + 1);

    userService.createNewData(counter).catch((err) => {
      console.error(err);

      setUsers(originalUsers);

      setCounter(originalCounter);

      setMessage(err.message);
    });
  }

  function updateUser(user: User) {
    const originalUsers = [...users];

    const newUser = {
      id: user.id,
      name: "Updated " + user.name,
      username: "Updated " + user.username,
      email: "Updated " + user.email,
    };

    const newUsers = users.map((u) => (u.id == user.id ? newUser : u));

    setUsers(newUsers);

    userService.updateData<User>(newUser).catch((err) => {
      console.error(err);
      setMessage(err.message);
      setUsers(originalUsers);
    });
  }

  return (
    <>
      {/* <div>ProductList</div>
      {category && (
        <p>
          We have new product: {products.filter((item) => item == category)}{" "}
        </p>
      )} */}

      {isLoading && <p className="spinner-border"></p>}

      {/* {!isLoading && <p className="spinner-border"></p>} */}

      <button className="btn btn-outline-primary mb-3" onClick={addUser}>
        Create New User
      </button>

      <ul className="list-group">
        {users.map((user) => (
          <li
            key={user.id}
            className="list-group-item d-flex justify-content-between align-items-center p-3"
          >
            The Name of User is: {user.name}
            <div>
              <button
                className="btn btn-outline-danger mx-3"
                onClick={() => deleteUser(user.id)}
              >
                Delete
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={() => updateUser(user)}
              >
                Update Data
              </button>
            </div>
          </li>
        ))}
      </ul>

      {users.length == 0 && message == "" && (
        <p className="text-info">We Don't Have any User.</p>
      )}

      {message !== "" && <p className="text-danger">{message}</p>}
    </>
  );
};

export default ProductList;
