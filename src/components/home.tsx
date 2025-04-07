import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page
    navigate("/auth/login");
  }, [navigate]);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <p>Redirecting to login...</p>
    </div>
  );
}

export default Home;
