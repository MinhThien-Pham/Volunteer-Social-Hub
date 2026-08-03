import { Link, Outlet } from "react-router";

function Layout({ session, currentProfile, onLogout }) {
  const displayName =
    currentProfile?.display_name ||
    session?.user?.user_metadata?.display_name ||
    session?.user?.email;

  return (
    <div className="app">
      <header className="site-header">
        <Link className="site-title" to="/">
          Volunteer Social Hub
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/posts/new">Create Post</Link>

          {session ? (
            <>
              <Link to={`/profiles/${session.user.id}`}> {displayName} </Link>

              <button type="button" onClick={onLogout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </nav>
      </header>

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;