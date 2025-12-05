import { useGetCurrentUser } from '@/lib/actions/generalQueriesAndMutation'
import { AuthUserContext, ConsultantProfile, PatientProfile, UserContext } from '@/types'
import React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export interface AuthContextState {
    userContext: AuthUserContext;
    profileData?: ConsultantProfile | PatientProfile
    isAuthenticated: boolean;
    setUserInContext: React.Dispatch<React.SetStateAction<AuthUserContext>>;
    isLoading: boolean
}

const INITIAL_STATE: AuthContextState = {
    userContext: {},
    isAuthenticated: false,
    setUserInContext: () => { },
    isLoading: false
}

const AuthContext = createContext<AuthContextState>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [userContext, setUserInContext] = useState<AuthUserContext>({});
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const whiteListedPaths = ['/sign-in', '/sign-up', '/welcome', '/confirm-email', '/email-confirmation', '/landing']

    const { data, error, isPending: authLoading } = useGetCurrentUser(
        !whiteListedPaths.includes(location.pathname)
    );
    useEffect(() => {
        if (error) {
            navigate('/sign-in');
        } else if (data) {
            if (data.user.userStage === 'ONBOARDING') {
                navigate('/onboarding')
            }
            setUserInContext(() => {
                return {
                    user_id: data.user.userId,
                    role: data.user.role,
                    userStage: data.user.userStage,
                    userType: data.user.userType,
                } as AuthUserContext
            });
            setIsAuthenticated(true);
        }
    }, [data, error])

    const value: AuthContextState = {
        userContext,
        isAuthenticated,
        setUserInContext,
        isLoading: authLoading,
        profileData: data?.profile
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}


export default AuthProvider

export const useUserContext = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useUserContext must be used inside an AuthProvider")
    }
    return context;
}