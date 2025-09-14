import { createContext, useState, type ReactNode } from "react";

interface AppContextType {
  user: string | null;
  setUser: (user: string | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  backendUrl: string;
}
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [user, setUser] = useState<string | null>(null);

  const backendUrl = import.meta.env.VITE_API_URL as string; 

  const value: AppContextType = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;