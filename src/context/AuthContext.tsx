import { useGetCurrentUser} from '@/lib/react-query/generalQueriesAndMutation'
import { AuthUserContext, ConsultantProfile, PatientProfile, UserContext } from '@/types'
import React, { Profiler } from 'react'
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
    isLoading:false
}

const AuthContext = createContext<AuthContextState>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [userContext, setUserInContext] = useState<AuthUserContext>({});
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const {data, error, isPending: authLoading} = useGetCurrentUser(
        !location.pathname.includes('/sign-in') &&
        !location.pathname.includes('/sign-up') &&
        !location.pathname.includes('/welcome') &&
        !location.pathname.includes('/confirm-email') &&
        !location.pathname.includes('/email-confirmation/') &&
        !location.pathname.includes('/landing')
    );
    useEffect(() => {
            if (error) {
                // console.error(error)
                // navigate('/sign-in');
            } else if(data) {
                console.log(data)
                setUserInContext(() => {
                    return {
                        user_id: data.user.userId,
                        role: data.user.role,
                        userStage: data.user.user_stage,
                        userType: data.user.user_type
                    } as AuthUserContext
                });
                setIsAuthenticated(true);
            }
    }, [data, error])

    const value:AuthContextState = {
        userContext,
        isAuthenticated,
        setUserInContext,
        isLoading: authLoading,
        profileData: data?.user.user_type ==='CONSULTANT'? data.profile as ConsultantProfile : data?.profile as PatientProfile
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