import { createContext, useState, type ReactNode } from "react";

interface AppContextType {
  user: string | null;
  setUser: (user: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{user, setUser}}>
        {children}
    </AppContext.Provider>
  )
};
