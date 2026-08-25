import { useGetCurrentUser } from "@/lib/actions/generalQueriesAndMutation";
import { refreshAccessToken } from "@/lib/api/general_api";
import { getItemInLocalStorage } from "@/lib/utils/localStorageUtil";
import { useTokenStore } from "@/store/TokenStore";
import { AuthUserContext } from "@/types";
import React, { useRef } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
  const location = useLocation();
  const navigate = useNavigate();
  const refreshIntervalRef = useRef<number | null>(null);
  const whiteListedPaths = [
    "/sign-in",
    "/sign-up",
    "/welcome",
    "/confirm-email",
    "/email-confirmation",
    "/landing",
    "/test",
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
      if (
        data.data.userStage === "ONBOARDING" &&
        !location.pathname.includes("/onboarding")
      ) {
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
  }, [data, error, location.pathname, navigate]);
  function startRefreshUtility(refreshToken: string) {
    setRefreshToken(refreshToken);
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
    refreshIntervalRef.current = window.setInterval(
      async () => {
        try {
          const response = await refreshAccessToken(refreshToken);
          if (response.code === 200) {
            const { accessToken: newAccessToken } = response.data;
            setAccessToken(newAccessToken);
          } else {
            console.error("Failed to refresh token:", response.message);
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      },
      15 * 60 * 1000,
    ); // Refresh every 15 minutes
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
