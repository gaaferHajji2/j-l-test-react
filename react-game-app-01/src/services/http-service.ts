import Entity from "../models/entity";
import apiClient from "./api-client";

class HttpService {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAllData<T>() {
    const controller = new AbortController();

    const request = apiClient.get<T[]>(this.endpoint, {
      signal: controller.signal,
      timeout: 5000,
    });

    return { request, cancel: () => controller.abort() };
  }

  createNewData(counter: number) {
    //   console.log("The Size Of Users is: " + users.length);

    return apiClient.post(this.endpoint, {
      id: counter + 1,
      name: "Jafar-Loka-01",
      username: "Jafar-Loka-01",
      email: "gaafer.hajji1995@gmail.com",
    });
  }

  updateData<T extends Entity>(entity: T) {
    return apiClient.patch(this.endpoint + entity.id, entity);
  }

  deleteData(id: number) {
    return apiClient.delete(this.endpoint + id);
  }
}

const create = (endpoint: string) => new HttpService(endpoint);

export default create;