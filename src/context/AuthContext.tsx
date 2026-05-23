import { useGetCurrentUser } from "@/lib/actions/generalQueriesAndMutation";
import { refreshAccessToken } from "@/lib/api/general_api";
import {
  getItemInLocalStorage,
  setItemInLocalStorage,
} from "@/lib/utils/localStorageUtil";
import { useTokenStore } from "@/store/TokenStore";
import { AuthUserContext } from "@/types";
import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface AuthContextState {
  userContext: AuthUserContext;
  setUserInContext: React.Dispatch<React.SetStateAction<AuthUserContext>>;
  isLoading: boolean;
  startRefreshUtility: (refreshToken: string) => void;
}

const INITIAL_STATE: AuthContextState = {
  userContext: {},
  setUserInContext: () => {},
  startRefreshUtility: () => {},
  isLoading: false,
};

const AuthContext = createContext<AuthContextState>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userContext, setUserInContext] = useState<AuthUserContext>({});
  const { accessToken, setAccessToken, setRefreshToken } = useTokenStore();
  const navigate = useNavigate();
  const whiteListedPaths = [
    "/sign-in",
    "/sign-up",
    "/welcome",
    "/confirm-email",
    "/email-confirmation",
    "/landing",
  ];

  const {
    data,
    error,
    isPending: authLoading,
  } = useGetCurrentUser(
    !whiteListedPaths.includes(location.pathname),
    accessToken,
  );

  useEffect(() => {
    if (error) {
      if (!whiteListedPaths.includes(location.pathname)) {
        navigate("/sign-in", { replace: true });
      }
      return;
    } else if (data) {
      if (data.data.userStage === "ONBOARDING") {
        navigate("/onboarding");
      }
      setUserInContext(() => {
        return {
          user_id: data.data.userId,
          userStage: data.data.userStage,
          userType: data.data.userType,
          gender: data.data.gender,
          lastLogin: data.data.lastLogin,
          userPrincipal: data.data.userPrincipal,
        } as AuthUserContext;
      });
    }
  }, [data, error]);
  function startRefreshUtility(refreshToken: string) {
    setRefreshToken(refreshToken);
    setInterval(
      async () => {
        const retrievedToken = getItemInLocalStorage("refresh-token");
        if (retrievedToken) {
          const response = await refreshAccessToken(retrievedToken);
          setAccessToken(response.data.accessToken);
        }
      },
      60 * 60 * 1000,
    );
  }

  const value: AuthContextState = {
    userContext,
    setUserInContext,
    isLoading: authLoading,
    startRefreshUtility,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useUserContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUserContext must be used inside an AuthProvider");
  }
  return context;
};
