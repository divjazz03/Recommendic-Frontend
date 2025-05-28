import { getCurrentUser } from '@/lib/api/backend_api'
import { useGetCurrentUser } from '@/lib/react-query/queriiesAndMutation'
import { AuthContextState, UserContext } from '@/types'
import React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


export const INITIAL_USER: UserContext = {
    user_id: '',
    first_name: '',
    last_name: '',
    role: '',
    address: {
        city: '',
        state: '',
        country: ''
    },
    userStage: 'ONBOARDING',
    userType:'PATIENT',
}

const INITIAL_STATE: AuthContextState = {
    userContext: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUserInContext: () => { },
    setIsAuthenticated: () => { },
    checkUserIsAuthenticated: async () => false as boolean,
}

const AuthContext = createContext<AuthContextState>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [userContext, setUserInContext] = useState<UserContext>(INITIAL_USER);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const {data, isPending:isGettingUser} = useGetCurrentUser();

    const checkUserIsAuthenticated = async () => {
        setIsLoading(true);
        try {
            const currentAccount = await getCurrentUser();
            if (currentAccount) {
                setUserInContext({
                    user_id: currentAccount.data.userId,
                    first_name: currentAccount.data.firstName,
                    last_name: currentAccount.data.lastName,
                    role: currentAccount.data.role,
                    address: {
                        city: currentAccount.data.address.city,
                        state: currentAccount.data.address.state,
                        country: currentAccount.data.address.country
                    },
                    userStage: currentAccount.data.userStage,
                    userType: currentAccount.data.userType
                })
                setIsAuthenticated(true);

                return true;
            } 
            return false
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect(() => {
    //     if (checkUserIsAuthenticated()) {
    //         navigate('/sign-in');
    //     }
    // }, [])

    const value = {
        userContext,
        isLoading,
        isAuthenticated,
        setUserInContext,
        setIsAuthenticated,
        checkUserIsAuthenticated
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}


export default AuthProvider

export const useUserContext = () => useContext(AuthContext);