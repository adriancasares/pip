import React, { createContext, ReactNode, useState } from "react";
import { motion } from "framer-motion";

export const AlertContext = createContext({
  addAlert: (arg0: AlertProviderProps) => {},
});

export type AlertProviderProps = {
  name: string;
  callback: (arg0: boolean) => void;
};

export default function AlertProvider(props: { children: any }) {
  const [alerts, setAlerts] = useState<AlertProviderProps[]>([]);

  const addAlert = (alert: AlertProviderProps) => {
    setAlerts((prevAlerts: any) => [...prevAlerts, alert]);
  };

  return (
    <AlertContext.Provider value={{ addAlert }}>
      {alerts.length > 0 && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center">
          <motion.div
            className="bg-white max-w-lg w-full font-os flex flex-col gap-4 p-4 rounded-lg shadow-lg"
            animate={{
              opacity: 1,
              translateY: 0,
            }}
            initial={{
              opacity: 0.5,
              translateY: -20,
            }}
          >
            <div>
              <h3 className="text-sm text-mono-c">Alert</h3>
              <h1 className="text-lg text-black">{alerts[0].name}</h1>
            </div>
            <div className="flex gap-2 child:rounded-md font-sans">
              <button
                className="bg-red-500 text-white py-1 px-4"
                onClick={() => {
                  setAlerts((prevAlerts: any) => prevAlerts.slice(1));
                  alerts[0].callback(true);
                }}
              >
                Yes
              </button>
              <button
                className="bg-white border border-mono-border-light text-mono-c py-1 px-4"
                onClick={() => {
                  setAlerts((prevAlerts: any) => prevAlerts.slice(1));
                  alerts[0].callback(false);
                }}
              >
                No
              </button>
            </div>
          </motion.div>
        </div>
      )}
      <div>{props.children}</div>
    </AlertContext.Provider>
  );
}
