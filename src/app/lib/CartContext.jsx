"use client";
import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { authFetch, useAuth } from "./AuthContext";

const CartContext = createContext(null);

const GUEST_KEY = "guest_cart";

const loadGuestCart = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveGuestCart = (items) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_KEY, JSON.stringify(items));
};

// Map a backend cart item -> frontend item shape
const fromServerItem = (i) => ({
  key: i.key,
  itemId: i._id,
  id: i.id,
  slug: i.slug,
  name: i.name,
  image: i.image,
  price: i.price,
  originalPrice: i.originalPrice,
  stock: i.stock,
  variant: i.variant,
  size: i.size,
  qty: i.qty,
});

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const mergedRef = useRef(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const fetchServerCart = useCallback(async () => {
    try {
      const res = await authFetch("/cart");
      setItems((res.data?.items || []).map(fromServerItem));
    } catch {
      // ignore — keep current items
    }
  }, []);

  // Sync cart whenever auth state settles
  useEffect(() => {
    if (authLoading) return;

    if (user) {
      (async () => {
        setLoading(true);
        if (!mergedRef.current) {
          const guestItems = loadGuestCart();
          if (guestItems.length) {
            try {
              await authFetch("/cart/merge", {
                method: "POST",
                body: JSON.stringify({
                  items: guestItems.map((i) => ({
                    productId: i.id, variant: i.variant, size: i.size, qty: i.qty,
                  })),
                }),
              });
              saveGuestCart([]);
            } catch {
              // ignore merge errors
            }
          }
          mergedRef.current = true;
        }
        await fetchServerCart();
        setLoading(false);
      })();
    } else {
      setItems(loadGuestCart());
      setLoading(false);
      mergedRef.current = false;
    }
  }, [user, authLoading, fetchServerCart]);

  const addToCart = useCallback(async (product, { variant = "", size = "", qty = 1 } = {}) => {
    setIsOpen(true);
    if (user) {
      try {
        await authFetch("/cart", {
          method: "POST",
          body: JSON.stringify({ productId: product.id, variant, size, qty }),
        });
        await fetchServerCart();
      } catch (err) {
        console.error("Failed to add to cart:", err);
      }
      return;
    }

    setItems((prev) => {
      const key = `${product.id}-${variant}-${size}`;
      const existing = prev.find((i) => i.key === key);
      let next;
      if (existing) {
        next = prev.map((i) => i.key === key ? { ...i, qty: i.qty + qty } : i);
      } else {
        next = [...prev, {
          key,
          id: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images?.[0] || product.image,
          price: product.price,
          originalPrice: product.originalPrice,
          variant,
          size,
          qty,
        }];
      }
      saveGuestCart(next);
      return next;
    });
  }, [user, fetchServerCart]);

  const updateQty = useCallback(async (key, delta) => {
    if (user) {
      const item = items.find((i) => i.key === key);
      if (!item) return;
      const newQty = Math.max(1, item.qty + delta);
      try {
        await authFetch(`/cart/${item.itemId}`, {
          method: "PUT",
          body: JSON.stringify({ qty: newQty }),
        });
        await fetchServerCart();
      } catch (err) {
        console.error("Failed to update cart:", err);
      }
      return;
    }

    setItems((prev) => {
      const next = prev.map((i) => i.key === key ? { ...i, qty: Math.max(1, i.qty + delta) } : i);
      saveGuestCart(next);
      return next;
    });
  }, [user, items, fetchServerCart]);

  const removeItem = useCallback(async (key) => {
    if (user) {
      const item = items.find((i) => i.key === key);
      if (!item) return;
      try {
        await authFetch(`/cart/${item.itemId}`, { method: "DELETE" });
        await fetchServerCart();
      } catch (err) {
        console.error("Failed to remove from cart:", err);
      }
      return;
    }

    setItems((prev) => {
      const next = prev.filter((i) => i.key !== key);
      saveGuestCart(next);
      return next;
    });
  }, [user, items, fetchServerCart]);

  const clearCart = useCallback(async () => {
    if (user) {
      try {
        await authFetch("/cart", { method: "DELETE" });
        setItems([]);
      } catch (err) {
        console.error("Failed to clear cart:", err);
      }
      return;
    }
    setItems([]);
    saveGuestCart([]);
  }, [user]);

  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, setItems, addToCart, updateQty, removeItem, clearCart, count, loading, isOpen, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
