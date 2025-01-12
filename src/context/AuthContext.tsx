import { getCurrentUser } from '@/lib/backend_api'
import { AuthContextState, UserContext } from '@/types'
import React, { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


export const INITIAL_USER: UserContext = {
    user_id: '',
    first_name: '',
    last_name: '',
    role: '',
    address: {
        zip_code: '',
        city: '',
        state: '',
        country: ''
    }
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

    const checkUserIsAuthenticated = async () => {
        try {
            const currentAccount = await getCurrentUser();
            if (currentAccount) {
                setUserInContext({
                    user_id: currentAccount.user_id,
                    first_name: currentAccount.first_name,
                    last_name: currentAccount.last_name,
                    role: currentAccount.role,
                    address: {
                        zip_code: currentAccount.address.zip_code,
                        city: currentAccount.address.city,
                        state: currentAccount.address.state,
                        country: currentAccount.address.country
                    }
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

    useEffect(() => {
        if (!checkUserIsAuthenticated) {
            navigate('/sign-in');
        }
    }, [])

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