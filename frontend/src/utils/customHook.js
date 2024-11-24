import isEqual from "lodash/isEqual";
import { useCallback, useEffect, useState } from "react";

export default function useCartSync(cart, syncCart) {
  const [initialCart, setInitialCart] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const syncCartData = useCallback(async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      console.log("Cart is empty or not valid. Skipping initial cart setup.");
      return;
    }

    if (!initialCart) {
      console.log("Setting initial cart...");
      setInitialCart(JSON.parse(JSON.stringify(cart))); // Deep copy of cart
      return; // Skip sync on initial setup
    }

    if (!isEqual(initialCart, cart)) {
      console.log("Cart content has changed. Syncing...");
      setIsSyncing(true);
      try {
        await syncCart(cart).unwrap();
        console.log("Cart synchronized successfully.");
        setInitialCart(JSON.parse(JSON.stringify(cart))); // Update the reference after sync
      } catch (error) {
        console.error("Failed to sync cart:", error);
      } finally {
        setIsSyncing(false);
      }
    } else {
      console.log("Cart is unchanged. Skipping sync.");
    }
  }, [cart, initialCart, syncCart]);

  useEffect(() => {
    syncCartData();
  }, [syncCartData]);

  return { isSyncing };
}
