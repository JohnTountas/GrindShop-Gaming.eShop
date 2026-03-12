/**
 * Public guest-cart facade that re-exports guest and authenticated cart helpers.
 */
export {
  addGuestCartItem,
  clearGuestCart,
  guestCartHasItems,
  readGuestCart,
  removeGuestCartItem,
  subscribeToGuestCart,
  updateGuestCartItem,
} from './guest/guestCartService';
export { syncGuestCartToServer } from './auth/syncGuestCartToServer';
