import { createContext, useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();


const SocketContextProvider = ({ children }) => {

  const socket = useMemo(() => io("http://localhost:4001"), []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}; 

export { SocketContext, SocketContextProvider };