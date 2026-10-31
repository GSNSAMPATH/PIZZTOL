export type CartItem = {
  cartItemId: string;

  productId: number;
  name: string;
  slug: string;

  variantId: number;

  sku: string;

  price: number;
  quantity: number;

  image: string;

  sizeId: number | null;
  sizeName: string | null;

  volumeId: number | null;
  volumeName: string | null;

  colorName: string | null;
  colorCode: string | null;

  stockQty: number;
};

const CART_KEY = "pizztol-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const cart = localStorage.getItem(
      CART_KEY
    );

    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error(
      "Failed to read cart:",
      error
    );

    return [];
  }
}

export function saveCart(
  cart: CartItem[]
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart)
  );
}

export function addToCart(
  item: CartItem
) {
  const cart = getCart();

  const existingIndex =
    cart.findIndex(
      (cartItem) =>
        cartItem.cartItemId ===
        item.cartItemId
    );

  if (existingIndex >= 0) {
    const existingItem =
      cart[existingIndex];

    const newQuantity =
      existingItem.quantity +
      item.quantity;

    cart[existingIndex] = {
      ...existingItem,
      quantity: Math.min(
        newQuantity,
        item.stockQty
      ),
    };
  } else {
    cart.push(item);
  }

  saveCart(cart);

  return cart;
}

export function removeFromCart(
  cartItemId: string
) {
  const cart = getCart();

  const updatedCart =
    cart.filter(
      (item) =>
        item.cartItemId !==
        cartItemId
    );

  saveCart(updatedCart);

  return updatedCart;
}

export function updateCartQuantity(
  cartItemId: string,
  quantity: number
) {
  const cart = getCart();

  const updatedCart =
    cart.map((item) => {
      if (
        item.cartItemId !==
        cartItemId
      ) {
        return item;
      }

      return {
        ...item,
        quantity: Math.max(
          1,
          Math.min(
            quantity,
            item.stockQty
          )
        ),
      };
    });

  saveCart(updatedCart);

  return updatedCart;
}

export function clearCart() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    CART_KEY
  );
}