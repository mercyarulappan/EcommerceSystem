import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/Login.css";
import { toast } from "react-toastify";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    let newErrors = {};

    if (!user.name) newErrors.name = "Name is required";

    if (!user.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(user.email))
      newErrors.email = "Invalid email";

    if (!user.password) newErrors.password = "Password required";
    else if (user.password.length < 6) newErrors.password = "Min 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      toast.success("Registered successfully");

      navigate("/login");
    } catch {
      toast.error("Registration failed");
      setErrors({ general: "Registration failed" });
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleRegister}>
        <h2 className="login-title">Register</h2>

        <input
          className="login-input"
          placeholder="Name"
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}

        <input
          className="login-input"
          placeholder="Email"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}

        {errors.general && <p className="error-text">{errors.general}</p>}

        <button className="login-btn">Register</button>

        <p className="register-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
