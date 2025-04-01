import React, { createContext, useCallback, useEffect, useState } from "react";
import { BASE_URL, postRequest } from "../utils/services";
// import { AxiosError } from "axios";

interface Props {
    children: React.ReactElement;
}

export interface User {
    name: string;
    email: string;
    password?: string;
}

interface RegisterInfo {
    name: string;
    email: string;
    password?: string;
}

interface LoginInfo {
    email: string;
    password: string;
}

interface UserContextType {
    user: User|null;
    // setUser: React.Dispatch<React.SetStateAction<User>>;
    updateUserData: (user: User) => void;

    registerInfo: RegisterInfo|null;

    // setRegisterInfo: React.Dispatch<React.SetStateAction<RegisterInfo>>;
    updateRegisterInfo: (info: RegisterInfo) => void;

    errMsg: string;

    // updateErrMsg: (msg: string)=>void;

    isLoading: boolean;

    updateLoading: (val: boolean) => void;

    token: string|null;

    registerUser: () => Promise<React.Dispatch<React.SetStateAction<string>> | void>;

    logoutUser: ()=>void;

    loginInfo: LoginInfo | null;

    updateLoginInfo: (info: LoginInfo) => void;

    loginUser: () => Promise<React.Dispatch<React.SetStateAction<string>>|void>
}



export const AuthContext = createContext<UserContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: Props) => {
    const [user, setUser] = useState<User|null>(null);

    const [registerInfo, setRegisterInfo] = useState<RegisterInfo|null>(null);

    const [errMsg, setErrMsg] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [token, setToken] = useState<string|null>("");

    const [loginInfo, setLoginInfo] = useState<LoginInfo|null>(null);

    const updateRegisterInfo = useCallback((info: RegisterInfo) => {
        setRegisterInfo(info);
    }, []);

    const updateUserData = useCallback((user: User) => {
        setUser(user);
    }, []);

    // const updateErrMsg = useCallback((msg: string)=> {
    //     setErrMsg(msg);
    // }, []);

    const updateLoading = useCallback((val: boolean) => {
        setIsLoading(val);
    }, []);

    const registerUser = useCallback(async () => {
        try {
            // console.log("The Current Register Info is: ", registerInfo);

            setIsLoading(true);
            setErrMsg("");

            const response = await postRequest(`${BASE_URL}/users/register-new-user`, registerInfo!);

            if (response.data.status == false) {
                // console.log("The Data of Error is: ", response.data);

                setIsLoading(false);

                return setErrMsg(`Please Check The Data: ${response.data.msg}`);
            }

            localStorage.setItem("Token", response.data.token);

            response.data.user.password = "";

            localStorage.setItem("User", JSON.stringify(response.data.user));

            setToken(response.data.token);

            setUser(response.data.user);

            setIsLoading(false);

            setErrMsg("");

        } catch (ex: any) {
            // console.error(typeof ex);

            // console.error(Object.keys(ex));

            // console.log(ex?.response?.data.msg);

            // console.error((ex as AxiosError).status);

            setIsLoading(false);

            if(ex.response != null)
                return setErrMsg(ex.response.data.msg);

                return setErrMsg("Please Check Your Internet Connection...");
        }
    }, [registerInfo]);

    const updateLoginInfo = useCallback((info: LoginInfo) => {
        setLoginInfo(info);
    }, []);

    const loginUser = useCallback(async ()=>{
        try {
            setIsLoading(true);
            const response = await postRequest(`${BASE_URL}/users/login-user-to-account`, loginInfo!);

            if(response.data.status == false){
                setIsLoading(false);

                return setErrMsg(response.data.msg);
            }

            response.data.user.password = "";

            setToken(response.data.token);
            setUser(response.data.user);

            localStorage.setItem("User", JSON.stringify(response.data.user));
            localStorage.setItem("Token", response.data.token);

            setIsLoading(false);
        } catch (ex: any) {
            setIsLoading(false);

            console.error(ex);

            if(ex?.response)
                return setErrMsg(ex?.response.data.msg);
            else 
                return setErrMsg("Please Check Your Internet Connection, And Try Again");
        }
    }, [loginInfo]);

    useEffect(() => {
        let user = localStorage.getItem("User");
        let token = localStorage.getItem("Token");

        if (user != null)
            setUser(JSON.parse(user));

        if (token != null)
            setToken(token);

        // console.log("The User From AuthContext is: ", user);
        // console.log("The Token From AuthContext is: ", token);
    }, []);

    const logoutUser = () => {
        localStorage.removeItem("User");
        setUser(null);

        localStorage.removeItem("Token");
        setToken(null);
    }

    return <AuthContext.Provider value={{
        user, updateUserData,
        registerInfo, updateRegisterInfo,
        errMsg,
        isLoading, updateLoading,

        token,

        registerUser,

        logoutUser,

        loginInfo, 
        updateLoginInfo,

        loginUser,
    }}>
        {children}
    </AuthContext.Provider>
}