import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserId, getUserSelectedModuleCode } from '../../services/axiosClient';
import { getCartItemsCount } from '../../services/services';

const CartContext = createContext<any>({});


export const useCartsCount = () => {
    return useContext(CartContext);
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const moduleCode = getUserSelectedModuleCode();
    const [cartsCount, setCartsCount] = useState<any>(0);
    const [refetchCart, setRefetchCart] = useState<boolean>(false);
    const userId = getUserId();
    useEffect(() => {
        if (userId !== 0) {
            getCarts();
        }
    }, [refetchCart]);


    const getCarts = () => {
        if (userId !== 0) {
            getCartItemsCount({ userId, cartStatus: "ACTIVE"},moduleCode).then((result) => {
                setCartsCount(result?.data?.data || 0);
            });
        } else {
            setCartsCount(0);
        }
    }

    return (
        <CartContext.Provider value={{cartsCount,setRefetchCart,refetchCart}}>
            {children}
        </CartContext.Provider>
    );
};

