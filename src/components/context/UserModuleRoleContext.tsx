import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserId } from '../../services/axiosClient';
import { getUserModuleRole } from '../../services/services';

const UserModuleRoleContext = createContext<any>({});


export const useUserModuleRoles = () => {
    return useContext(UserModuleRoleContext);
};

interface UserModuleRoleProviderProps {
    children: ReactNode;
}

export const UserModuleRoleProvider: React.FC<UserModuleRoleProviderProps> = ({ children }) => {
    const [userModuleRoles, setUserModuleRoles] = useState<any>([]);
    const userId = getUserId();
    useEffect(() => {
        if (userId !== 0) {
            getUserModuleRoles();
        }
    }, []);


    const getUserModuleRoles = () => {
        if (userId !== 0) {
            getUserModuleRole(userId).then((result) => {
                setUserModuleRoles(result?.data?.data || []);
            });
        } else {
            setUserModuleRoles([]);
        }
    }

    return (
        <UserModuleRoleContext.Provider value={{ userModuleRoles }}>
            {children}
        </UserModuleRoleContext.Provider>
    );
};

