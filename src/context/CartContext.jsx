import { createContext, useContext, useState, useEffect } from "react";
import orderAPI from "../services/order";
import { useAuth } from "./AuthContext";
import { debounce } from "lodash";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setCartItems([]);
        return;
      }

      try {
        const response = await orderAPI.getAll();
        const userCart = response.data.find(
          (order) => order.userId === user.userId && order.status === "In Cart"
        );

        if (userCart) {
          setCartItems(
            userCart.orderProducts.map((item) => ({
              id: item.productId,
              name: item.productName, // Thêm tên sản phẩm
              image: item.productImage, // Thêm hình ảnh sản phẩm
              price: item.unitPrice,
              quantity: item.quantity,
            }))
          );
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [user]); // Chạy lại khi user thay đổi

  const syncCartWithServer = debounce(async (updatedCart) => {
    if (!user) return;

    try {
      await orderAPI.createOrderAddCart({
        userID: user.userId,
        status: "In Cart",
        products: updatedCart.map((item) => ({
          productID: item.id,
          quantity: item.quantity,
        })),
      });
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
  }, 500);

  const addToCart = async (product) => {
    const updatedCart = [...cartItems];
    const existingItem = updatedCart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCartItems(updatedCart);
    syncCartWithServer(updatedCart);
  };

  const removeFromCart = async (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    syncCartWithServer(updatedCart);
  };

  const updateQuantity = async (id, quantity) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    );

    setCartItems(updatedCart);
    syncCartWithServer(updatedCart);
  };

  const totalPrice =
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
