import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // 1. Inicializa el estado del carrito desde localStorage
    const [cartItems, setCartItems] = useState(() => {
        const localData = localStorage.getItem('cartItems');
        return localData ? JSON.parse(localData) : [];
    });

    // 2. Guarda los cambios del carrito en localStorage
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // 3. Función para añadir un producto al carrito
    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === product._id);

            if (existingItem) {
                // Si el producto ya existe, incrementa la cantidad
                return prevItems.map(item =>
                    item._id === product._id
                        ? { ...item, qty: item.qty + 1 }
                        : item
                );
            } else {
                // Si el producto es nuevo, agrégalo con cantidad 1
                return [...prevItems, { ...product, qty: 1 }];
            }
        });
    };

    // 4. Función para remover completamente un producto
    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== id));
    };

    // 5. Función para actualizar la cantidad
    const updateQuantity = (id, newQty) => {
        setCartItems(prevItems => {
            if (newQty <= 0) {
                // Si la cantidad es 0 o menos, simplemente lo remueve
                return prevItems.filter(item => item._id !== id);
            }
            return prevItems.map(item =>
                item._id === id
                    ? { ...item, qty: newQty }
                    : item
            );
        });
    };
    
    // 6. Cálculo del total de items y precio total
    const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.precio, 0);


    return (
        <CartContext.Provider 
            value={{ 
                cartItems, 
                addToCart, 
                removeFromCart, 
                updateQuantity,
                totalItems,
                totalPrice
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
