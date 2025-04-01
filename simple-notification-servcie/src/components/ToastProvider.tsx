import React, { useState } from "react";
import ToastContext from "./ToastService";
import { X } from "react-feather";

export interface Props { 
    children: React.ReactElement;
}

export interface IComponentInterface {
    id: number;
    component: React.ReactElement;
}

export default function ToastProvider({ children }: Props) {

    const [toasts, setToasts] = useState<IComponentInterface[]>([]);

    const open = (component: React.ReactElement, timeout : number=3000) => {
        const id = Date.now();

        setToasts(toasts => [...toasts, {id, component}]);

        setTimeout(() => closeToast(id), timeout);
    }

    const closeToast = (id: number) => setToasts(toasts => toasts.filter(toast => toast.id !== id));

    return <ToastContext.Provider value={{open, closeToast}}>
        {children}

        <div className="space-y-2 absolute bottom-4 right-4">
            { toasts.map((toast) => 
                <div key={toast.id} className='relative'>
                    <button

                        onClick={() => closeToast(toast.id)}

                        className={`absolute top-2 right-2 p-1 rounded-lg bg-gray-200/20 text-gray-800/60`}>
                        <X size={25}/>
                    </button>

                    {toast.component}
                </div>
            )}
        </div>
    </ToastContext.Provider>
}