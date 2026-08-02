import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import { supabase } from "./client.js";
import Layout from "./routes/Layout.jsx";
import RequireAuth from "./routes/RequireAuth.jsx";
import ReadPosts from "./pages/ReadPosts.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import EditPost from "./pages/EditPost.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import NotFound from "./pages/NotFound.jsx";
import "./App.css";

function App() {
  const [session, setSession] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const userId = session?.user?.id;

  useEffect(() => {
    let isActive = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Failed to load session:", error.message);
      }

      if (isActive) {
        setSession(data.session ?? null);
        setAuthLoading(false);
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (isActive) {
        setSession(nextSession);
        setAuthLoading(false);
      }
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadProfile = async () => {
      if (!userId) {
        setCurrentProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (!isActive) {
        return;
      }

      if (error) {
        console.error("Failed to load profile:", error.message);
        setCurrentProfile(null);
        return;
      }

      setCurrentProfile(data);
    };

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [userId]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      window.alert(error.message);
    }
  };

  if (authLoading) {
    return (
      <main>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout
            session={session}
            currentProfile={currentProfile}
            onLogout={handleLogout}
          />
        }
      >
        <Route index element={<ReadPosts />} />

        <Route
          path="posts/new"
          element={
            <RequireAuth session={session}>
              <CreatePost session={session} />
            </RequireAuth>
          }
        />

        <Route path="posts/:id" element={<PostDetail session={session} />} />

        <Route
          path="posts/:id/edit"
          element={
            <RequireAuth session={session}>
              <EditPost session={session} />
            </RequireAuth>
          }
        />

        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;