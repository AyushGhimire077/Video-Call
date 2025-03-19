import { createContext, useMemo, useState } from "react";
import { AuthContextProvider } from "./AuthContex";
import axios from "axios";
import { SocketContextProvider } from "./SocketContext";
import { PeerContextProvider } from "./Peer";

const MainContext = createContext();

const MainContextProvider = ({ children }) => {

    const [ fetchedUsers, setFetchedUsers ] = useState([]);
    const [ search, setSearch ] = useState("");

    //fetch all users
    const fetchAllUsers = async () => {
        try {
            
          const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/users`, { withCredentials: true });

          if( data.success ) {
              setFetchedUsers(data.users);   
          } else {
            console.log(data.message);
          }

        } catch (error) {
            console.log(error);
        }
    }

    //Search functionality
     const filteredUsers = useMemo(() => {
         return Array.isArray(fetchedUsers) 
        ? fetchedUsers.filter(user => user.userName.toLowerCase().includes(search.toLowerCase())) : [];
     }, [fetchedUsers, search]);

    
    //calling fetchAllUsers on component mount
    useMemo(() => {
        fetchAllUsers();
    }, []);

    const value = {
        filteredUsers,
        search,
        fetchAllUsers,
        setSearch
    };

    return (
      <MainContext.Provider value={value}>
        <PeerContextProvider>
          <AuthContextProvider>
            <SocketContextProvider>{children}</SocketContextProvider>
          </AuthContextProvider>
        </PeerContextProvider>
      </MainContext.Provider>
    );
};

export { MainContextProvider, MainContext };