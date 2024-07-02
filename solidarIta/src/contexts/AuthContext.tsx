import { createContext, ReactNode, useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { setCookie, parseCookies, destroyCookie } from "nookies";

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  signIn(credentials: SignInCredentials): void;
  signInAnonymous(): void;
  user: string;
  type: string;
  isAuthenticated: boolean;
  signOut: () => void;
  rolesUser: string[];
  idUser: string;
  imageUser: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    "SolidarIta.token": token,
    type: typ,
    username: usernm,
    cRoles: roles,
    id: idAccount,
    image: imageAccount,
  } = parseCookies();
  let array = [""];
  if (roles) {
    array = roles.split(",");
  }

  const navigate = useNavigate();

  const [user, setUser] = useState(usernm);
  const [type, setType] = useState(typ);
  const [rolesUser, setRolesUser] = useState(array);
  const [idUser, setIdUser] = useState(idAccount);
  const [imageUser, setImageUser] = useState(imageAccount);
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const toast = useToast();

  useEffect(() => {
    // console.log(usernm)
    // console.log(array)
    // console.log(idAccount)
    // console.log(imageAccount)
    if (token) {
      setUser(usernm);
      setType(typ);
      setRolesUser(array);
      setIdUser(idAccount);
      setImageUser(imageAccount);
    }
  }, []);

  //FUNÇÃO DE LOGIN
  function signIn({ email, password }: SignInCredentials) {
    api
      .post("login", { email, password })
      .then((response) => {
        console.log(response.data);
        const { token } = response.data;
        const cRoles = response.data.user.roles;
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setCookie(undefined, "SolidarIta.token", token, {
          maxAge: 60 * 60 * 24, //1 dia
          path: "/",
        });

        setCookie(undefined, "username", response.data.user.username, {
          maxAge: 60 * 60 * 24, //1 dia
          path: "/",
        });

        setCookie(undefined, "type", response.data.user.user_types, {
          maxAge: 60 * 60 * 24, //1 dia
          path: "/",
        });

        setCookie(undefined, "cRoles", cRoles, {
          maxAge: 60 * 60 * 24, //1 dia
          path: "/",
        });

        setCookie(undefined, "id", response.data.user.id, {
          maxAge: 60 * 60 * 24, //1 dia
          path: "/",
        });

        // console.log(response.data.user.image)
        setCookie(undefined, "image", response.data.user.image, {
          maxAge: 60 * 60 * 24, //1 dia
          path: "/",
        });

        setRolesUser(cRoles);
        setIdUser(response.data.user.id);
        setImageUser(response.data.user.image);
        setUser(response.data.user.username);
        setType(response.data.user.user_types);

        setIsAuthenticated(true);

        navigate("/feed", { replace: true });

        toast({
          title: "Credenciais corretas!.",
          description: "Seja bem vindo.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      })
      .catch((error) => {
        if (error.response.status === 401) {
          toast({
            title: "Login recusado",
            description: error.response.data.message,
            status: "error",
            duration: 8000,
            isClosable: true,
          });
        }else{
          toast({
            title: "Nome de usuário ou senha incorretas.",
            description: "Verifique as suas credenciais e tente novamente.",
            status: "error",
            duration: 8000,
            isClosable: true,
          });
        }
      });
  }

  //FUNÇÃO DE LOGIN anonymous
  function signInAnonymous() {
    setCookie(undefined, "type", "0", {
      maxAge: 60 * 60 * 24, //1 dia
      path: "/",
    });
    setCookie(undefined, "cRoles", '["accountability"]', {
      maxAge: 60 * 60 * 24, //1 dia
      path: "/",
    });
    setCookie(undefined, "id", "", {
      maxAge: 60 * 60 * 24, //1 dia
      path: "/",
    });
    setRolesUser( ['accountability']);
    setType("0");

    setIsAuthenticated(true);

    navigate("/feed", { replace: true });

    toast({
      title: "Seja bem vindo!",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
  }

  //FUNÇÃO DE LOGOUT
  function signOut() {
    destroyCookie(undefined, "SolidarIta.token");
    destroyCookie(undefined, "username");
    destroyCookie(undefined, "cRoles");
    destroyCookie(undefined, "id");
    destroyCookie(undefined, "image");
    destroyCookie(undefined, "type");
    setIsAuthenticated(false);

    navigate("/");
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signInAnonymous,
        isAuthenticated,
        user,
        signOut,
        rolesUser,
        idUser,
        imageUser,
        type,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
