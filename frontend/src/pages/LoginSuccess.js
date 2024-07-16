import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function LoginSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");

    if (token) {
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      alert(`Welcome, ${decoded.name}`);
      navigate("/");
    } else {
      alert("Login failed");
      navigate("/login");
    }
  }, [navigate]);

  return null;
}

export default LoginSuccess;
