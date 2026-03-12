import { NavLink } from "react-router-dom";
import type { User } from "@/shared/types";

interface PrimaryNavigationProps {
  authed: boolean;
  user: User | null;
  displayName: string;
  cartCountLabel: string;
  wishlistCountLabel: string;
  onLogout: () => void;
  onScrollToTop: () => void;
}

// Centralizes active/inactive navigation styling so route links stay visually consistent.
const linkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold tracking-[0.08em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-700 ${
    isActive
      ? "bg-primary-800 text-white shadow-neon"
      : "border border-primary-300/60 bg-primary-100/60 text-primary-700 hover:-translate-y-0.5 hover:border-accent-700/60 hover:text-primary-900"
  }`;

// Renders the main application navigation and account actions inside the shared header.
function PrimaryNavigation({
  authed,
  user,
  displayName,
  cartCountLabel,
  wishlistCountLabel,
  onLogout,
  onScrollToTop,
}: PrimaryNavigationProps) {
  return (
    <nav
      aria-label="Primary navigation"
      className="mt-3 flex flex-wrap items-center gap-2 rounded-2xl border border-primary-300/60 bg-primary-100/74 p-2"
    >
      <NavLink to="/" className={linkClass} end onClick={onScrollToTop}>
        Home
      </NavLink>
      <NavLink to="/cart" className={linkClass}>
        <span className="inline-flex items-center gap-2">
          <span>Cart</span>
          <span
            className="inline-flex min-w-[1.45rem] items-center justify-center rounded-full  border-current/30 bg-white px-1.5 py-0.5 text-[11
          px] font-bold leading-none text-red-600 shadow-sm"
          >
            {cartCountLabel}
          </span>
        </span>
      </NavLink>

      {authed && (
        <NavLink to="/orders" className={linkClass}>
          Orders
        </NavLink>
      )}

      {authed && (
        <NavLink to="/wishlist" className={linkClass}>
          <span className="inline-flex items-center gap-2">
            <span>Wishlist</span>
            <span
              className="inline-flex min-w-[1.45rem] items-center justify-center rounded-full  border-current/30 bg-white px-1.5 py-0.5 text-[11
          px] font-bold leading-none text-red-600 shadow-sm"
            >
              {wishlistCountLabel}
            </span>
          </span>
        </NavLink>
      )}

      {user?.role === "ADMIN" && (
        <NavLink to="/admin" className={linkClass}>
          Admin
        </NavLink>
      )}

      <div className="ml-auto flex items-center gap-2">
        {authed ? (
          <>
            <div className="hidden items-center gap-2 rounded-full border border-accent-700/45 bg-primary-100/70 px-3 py-1.5 text-xs font-semibold text-primary-700 sm:inline-flex">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent-600" />
              {displayName || user?.email}
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center justify-center rounded-full border border-primary-400/75 bg-primary-100/78 px-4 py-2 text-sm font-semibold text-primary-800 transition hover:-translate-y-0.5 hover:border-accent-700/75 hover:text-primary-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
            <NavLink to="/register" className={linkClass}>
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default PrimaryNavigation;
