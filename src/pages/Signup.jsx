import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../client.js";

function Signup() {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedDisplayName = displayName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedDisplayName) {
      setMessage("Display name is required.");
      return;
    }

    setMessage("");
    setIsSubmitting(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: { data: { display_name: trimmedDisplayName } },
    });

    setIsSubmitting(false);

    if (authError) {
      setMessage(authError.message);
      return;
    }

    if (!authData.user) {
      setMessage("Account could not be created.");
      return;
    }

    if (!authData.session) {
      setMessage("Account created. Check your email before logging in.");
      return;
    }

    navigate("/");
  };

  return (
    <section>
      <h1>Sign Up</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="signup-display-name">Display Name</label>
          <input
            id="signup-display-name"
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            autoComplete="nickname"
            required
          />
        </div>

        <div>
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      {message && <p role="alert">{message}</p>}

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}

export default Signup;
