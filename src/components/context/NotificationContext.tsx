import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import io from 'socket.io-client';
import { getUserId, getUserRole, getUserSelectedModuleCode } from '../../services/axiosClient';
import { searchListDataFromTable } from '../../services/services';

const NotificationContext = createContext<any>({});
const SOCKET_URL = 'https://mydailylives.com'
// const SOCKET_URL = 'http://localhost:4001'
export const socket = io(SOCKET_URL);

export const useNotifications = () => {
    return useContext(NotificationContext);
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notifications, setNotifications] = useState<any>([]);
    const userId = getUserId();
    const moduleCode = getUserSelectedModuleCode();
    const userRole = getUserRole();
    useEffect(() => {
        if (userId !== 0) {
            socket.emit('join', userId);
            if (userRole === 'DRIVER' || userRole === 'PASSENGER') {
                getTripNotifications();

                socket.on('NEWTRIP', (newNotification) => {
                    getTripNotifications();
                });

                socket.on('TRIPACCEPTED', (newNotification) => {
                    getTripNotifications();
                });
            }
            if (userRole === 'SELLER') {
                getSellerNotifications()
                socket.on('NEWORDER', (newNotification) => {
                    getSellerNotifications();
                });
            }
            if(userRole === 'LOGISTIC') {
                getlogisticNotifications()
                socket.on('ORDERACCEPTED', (newNotification) => {
                    getlogisticNotifications();
                });  
            }

        }


        return () => {
            if (userId !== 0) {
                if (userRole === 'DRIVER' || userRole === 'PASSENGER') {
                    socket.off('NEWTRIP'); // Cleanup listener
                    socket.off('TRIPACCEPTED');
                }
                if (userRole === 'SELLER') {
                    socket.off('NEWORDER');
                }
                if(userRole === 'LOGISTIC'){
                    socket.off('ORDERACCEPTED');
                }
                // if(['MENTORS,INQUISITORS,GUARDIANS'].includes(userRole)){
                //     socket.off('question_synced');
                //     socket.off('answer_synced');
                //     socket.off('answerLikeDislike_synced');
                // }
            }
        };
    }, []);


    const getTripNotifications = () => {
        if (userId !== 0) {
            searchListDataFromTable("tripNotification", { userId, tripNotificationStatus: 'ACTIVE' }).then((result: { data: { data: any; }; }) => {
                setNotifications([...result?.data?.data]);
            }).catch((error: any) => console.error("Error fetching states:", error));
        } else {
            setNotifications([]);
        }
    }

    const getSellerNotifications = () => {
        if (userId !== 0) {
            searchListDataFromTable(`${moduleCode}_sellerNotification`, { userId, sellerNotificationStatus: 'ACTIVE' }).then((result: { data: { data: any; }; }) => {
                setNotifications([...result?.data?.data]);
            }).catch((error: any) => console.error("Error fetching states:", error));
        } else {
            setNotifications([]);
        }
    }


    const getlogisticNotifications = () => {
        if (userId !== 0) {
            searchListDataFromTable(`${moduleCode}_logisticBoyNotification`, { userId, lbnStatus: 'ACTIVE' }).then((result: { data: { data: any; }; }) => {
                setNotifications([...result?.data?.data]);
            }).catch((error: any) => console.error("Error fetching states:", error));
        } else {
            setNotifications([]);
        }
    }


    return (
        <NotificationContext.Provider value={{ notifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

