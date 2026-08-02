import { Link, Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="app">
      <header className="site-header">
        <Link className="site-title" to="/">
          Volunteer Social Hub
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/posts/new">Create Post</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </nav>
      </header>

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;