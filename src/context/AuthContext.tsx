import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string; //
  iat: string;
  exp: number; // JWT expiration time (if present)
}

interface AuthContextType {
  token: string | null;
  id: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decodedToken: DecodedToken = jwtDecode(storedToken);

      setToken(storedToken);
      setId(decodedToken.id);
    }
  }, []);

  // Fetch username using the user's id from the decoded token
  // const fetchUsername = async (id: string) => {
  //   try {
  //     const response = await fetch(`http://localhost:3000/api/v1/users/${id}`);
  //     const data = await response.json();
  //     console.log({ data });
  //     if (response.ok && data?.data?.user?.username) {
  //       setUsername(data.data.user.username); // Set the username from the backend
  //     } else {
  //       console.error("Failed to fetch username");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching username:", error);
  //   }
  // };

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    const decodedToken = jwtDecode<DecodedToken>(newToken);
    setId(decodedToken.id);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setId(null);
  };

  return (
    <AuthContext.Provider value={{ token, id, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
