import { NavLink } from "react-router-dom";
import type { User } from "@/shared/types";
import {
  BRAND_LOGO_SRC,
  BRAND_NAME,
  BRAND_POSITIONING,
  BRAND_TAGLINE,
} from "@/shared/brand/identity";
import PrimaryNavigation from "./PrimaryNavigation";

interface LayoutHeaderProps {
  authed: boolean;
  user: User | null;
  displayName: string;
  cartCountLabel: string;
  isHeaderVisible: boolean;
  wishlistCountLabel: string;
  onLogout: () => void;
  onScrollToTop: () => void;
}

// Renders the sticky global header, including brand messaging and primary navigation.
function LayoutHeader({
  authed,
  user,
  displayName,
  cartCountLabel,
  isHeaderVisible,
  wishlistCountLabel,
  onLogout,
  onScrollToTop,
}: LayoutHeaderProps) {
  return (
    <header
      className={`sticky top-0 z-40 border-primary-300/55 bg-primary-50/88 transition-transform duration-300 ${
        isHeaderVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container py-3 sm:py-4">
        <div className="surface-card border-primary-300/60 bg-primary-100/72 px-3 py-3 shadow-raised backdrop-blur-2xl sm:px-6 sm:py-5 lg:px-8 lg:py-6">
          <div className="flex flex-wrap items-start gap-3 sm:items-center sm:gap-4">
            <NavLink
              to="/"
              onClick={onScrollToTop}
              className="group inline-flex max-w-full items-center gap-2.5 text-primary-900 sm:gap-3"
            >
              <img
                src={BRAND_LOGO_SRC}
                alt={`${BRAND_NAME} logo`}
                className="h-11 w-auto max-w-[180px] object-contain sm:h-14 sm:max-w-[300px]"
              />
              <span className="block max-w-[8rem] text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-accent-700 sm:max-w-none sm:text-[0.7rem] sm:tracking-[0.26em]">
                {BRAND_TAGLINE}
              </span>
            </NavLink>

            <p className="ml-auto hidden max-w-md text-xs font-medium text-primary-600 lg:block">
              {BRAND_POSITIONING}
            </p>
          </div>

          <div
            aria-hidden
            className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-primary-400/65 to-transparent"
          />

          <PrimaryNavigation
            authed={authed}
            user={user}
            displayName={displayName}
            cartCountLabel={cartCountLabel}
            wishlistCountLabel={wishlistCountLabel}
            onLogout={onLogout}
            onScrollToTop={onScrollToTop}
          />
        </div>
      </div>
    </header>
  );
}

export default LayoutHeader;
