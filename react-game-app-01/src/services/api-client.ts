import axios from "axios";

import { CanceledError } from "axios";

import TEST_URL from "../Common_Constants";

export default axios.create({
    baseURL: TEST_URL,
});

export { CanceledError };