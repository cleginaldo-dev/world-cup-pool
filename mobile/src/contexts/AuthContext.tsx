import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { createContext, ReactNode, useEffect, useState } from "react";

import { api } from "../services/api";

WebBrowser.maybeCompleteAuthSession();

interface IUserProps {
  name: string;
  avatarUrl: string;
}

export interface IAuthContextDataProps {
  user: IUserProps;
  signIn: () => Promise<void>;
  // signOut: () => Promise<void>;
  isLoading: boolean;
}

interface IAuthContextProps {
  children: ReactNode;
}
const { CLIENT_ID } = process.env;

export const AuthContext = createContext({} as IAuthContextDataProps);

export function AuthContextProvider({ children }: IAuthContextProps) {
  const [user, setUser] = useState({} as IUserProps);
  const [isLoading, setIsLoading] = useState(false);

  console.log("CLIENT_ID", CLIENT_ID);
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: CLIENT_ID,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ["profile", "email"],
  });

  const signIn = async () => {
    try {
      setIsLoading(true);
      await promptAsync();
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // const signOut = async () => {
  //   console.log("logout");
  // };

  const signInWithGoogle = async (access_token: string) => {
    try {
      setIsLoading(true);
      const { data: tokenResponse } = await api.post("/users", {
        access_token,
      });

      api.defaults.headers.common.Authorization = `Bearer ${tokenResponse.token}`;

      const { data: userInfosResponse } = await api.get("/me");

      setUser(userInfosResponse.user);
    } catch (error) {
      console.log(JSON.stringify(error));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (response?.type === "success" && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication?.accessToken);
    }
  }, [response]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        // signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
