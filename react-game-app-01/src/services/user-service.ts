// import apiClient from "./api-client";

// import User from "../models/user";
import create from "./http-service";
// import TEST_URL from "../Common_Constants";

// class UserService {
//   getAllData() {
//     const controller = new AbortController();

//     const request = apiClient.get<User[]>("/", {
//       signal: controller.signal,
//       timeout: 5000,
//     });

//     return { request, cancel: () => controller.abort() };
//   }

//   createNewData(users: User[], counter: number) {
//     console.log("The Size Of Users is: " + users.length);

//     return apiClient.post("/", {
//       id: counter + 1,
//       name: "Jafar-Loka-01",
//       username: "Jafar-Loka-01",
//       email: "gaafer.hajji1995@gmail.com",
//     });
//   }

//   updateUserData(newUser: User) {
    

//     return apiClient.patch("/" + newUser.id, newUser);
//   }

//   deleteUserData(id: number){
//     return apiClient.delete("/" + id);
//   }
// }

export default create("/");
