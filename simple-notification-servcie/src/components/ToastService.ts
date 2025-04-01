import { createContext, useContext } from "react";

export interface IToastContext {
    open: (component: React.ReactElement, timeout: number) => void;

    closeToast: (id: number) => void;
}

const ToastContext = createContext<IToastContext>({open: () => {}, closeToast: () => {}});

export const useToast = () => useContext(ToastContext);

export default ToastContext;