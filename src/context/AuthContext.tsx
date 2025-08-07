import { useGetCurrentUser } from '@/lib/react-query/generalQueriesAndMutation'
import { AuthContextState, AuthUserContext, UserContext } from '@/types'
import React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


export const INITIAL_USER: AuthUserContext = {
    user_id: '',
    role: '',
    userStage: 'ONBOARDING',
    userType:'PATIENT',
}

const INITIAL_STATE: AuthContextState = {
    userContext: INITIAL_USER,
    isAuthenticated: false,
    setUserInContext: () => { }
}

const AuthContext = createContext<AuthContextState>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [userContext, setUserInContext] = useState<AuthUserContext>(INITIAL_USER);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const {data, error, isPending: isGettingUser} = useGetCurrentUser(
        !location.pathname.includes('/sign-in') &&
        !location.pathname.includes('/sign-up')
    );

    useEffect(() => {
            if (error) {
                console.error(error)
                navigate('/sign-in');
            } else if(data) {
                console.log(data)
                setUserInContext((prev) => {
                    return {
                        user_id: data.userId,
                        role: data.role,
                        userStage: data.user_stage,
                        userType: data.user_type
                    } as AuthUserContext
                });
                setIsAuthenticated(true);
            }
    }, [data, error])

    const value = {
        userContext,
        isAuthenticated,
        setUserInContext
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}


export default AuthProvider

export const useUserContext = () => useContext(AuthContext);