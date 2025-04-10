import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { ThemeProvider } from "./lib/theme";

// Lazy load components for better performance
const Login = lazy(() => import("./pages/auth/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const UserDashboard = lazy(() => import("./pages/user/Dashboard"));
const AdminWriteUps = lazy(() => import("./pages/admin/WriteUps"));
const UserWriteUps = lazy(() => import("./pages/user/WriteUps"));

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            Loading...
          </div>
        }
      >
        <>
          <Routes>
            <Route path="/" element={<Navigate to="/auth/login" replace />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/admin/writeups" element={<AdminWriteUps />} />
            <Route path="/user/writeups" element={<UserWriteUps />} />

            {/* Add this before the catchall route */}
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" />
            )}

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
