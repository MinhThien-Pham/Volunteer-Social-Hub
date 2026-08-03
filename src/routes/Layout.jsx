import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router";
import Avatar from "../components/Avatar.jsx";

function Layout({
  session,
  currentProfile,
  onLogout,
  searchInput,
  onSearchChange,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const accountMenuRef = useRef(null);

  const [isAccountMenuOpen, setIsAccountMenuOpen] =
    useState(false);

  const displayName =
    currentProfile?.display_name ||
    session?.user?.user_metadata?.display_name ||
    session?.user?.email ||
    "Member";

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  const handleSearchChange = (event) => {
    onSearchChange(event.target.value);

    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleBrandClick = () => {
    onSearchChange("");
    setIsAccountMenuOpen(false);
  };

  const handleLogoutClick = async () => {
    setIsAccountMenuOpen(false);
    await onLogout();
  };

  return (
    <div className="app">
      <header className="site-header">
        <div className="site-header-inner">
          <Link
            className="site-title"
            to="/"
            onClick={handleBrandClick}
          >
            <span className="site-title-mark">V</span>

            <span className="site-title-text">
              Volunteer Social Hub
            </span>
          </Link>

          <div className="header-search">
            <label className="sr-only" htmlFor="global-post-search">
              Search posts
            </label>

            <input
              id="global-post-search"
              type="search"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search posts"
            />
          </div>

          <div className="header-actions">
            {session ? (
              <div
                className="account-menu"
                ref={accountMenuRef}
              >
                <button
                  className="account-trigger"
                  type="button"
                  onClick={() =>
                    setIsAccountMenuOpen(
                      (currentValue) => !currentValue,
                    )
                  }
                  aria-label="Open account menu"
                  aria-haspopup="menu"
                  aria-expanded={isAccountMenuOpen}
                >
                  <Avatar
                    className="header-avatar"
                    src={currentProfile?.avatar_url}
                    name={displayName}
                  />
                </button>

                {isAccountMenuOpen && (
                  <div
                    className="account-dropdown"
                    role="menu"
                  >
                    <div className="account-summary">
                      <strong>{displayName}</strong>

                      <span>{session.user.email}</span>
                    </div>

                    <Link
                      to={`/profiles/${session.user.id}`}
                      role="menuitem"
                      onClick={() =>
                        setIsAccountMenuOpen(false)
                      }
                    >
                      View Profile
                    </Link>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogoutClick}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <nav
                className="guest-nav"
                aria-label="Account navigation"
              >
                <Link to="/login">Log In</Link>
                <Link
                  className="signup-link"
                  to="/signup"
                >
                  Sign Up
                </Link>
              </nav>
            )}
          </div>
        </div>
      </header>

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;