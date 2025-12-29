"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { doc, getDoc, getFirestore } from "firebase/firestore";

// Extend Firebase User to include role
export interface AppUser extends User {
  role: "admin" | "customer";
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const LOGOUT_TIME = 10 * 60 * 1000; // 10 minutes

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Memoized logout function
  const logout = useCallback(async () => {
    await signOut(auth);
    queueMicrotask(() => {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("lastActivity");
      router.push("/login");
    });
  }, [router]);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        localStorage.removeItem("user");
        return;
      }

      try {
        const db = getFirestore();
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        const role = docSnap.exists() ? (docSnap.data().role as "admin" | "customer") : "customer";

        // Attach role to user
        setUser({ ...firebaseUser, role });
        localStorage.setItem("user", JSON.stringify({ ...firebaseUser, role }));
        localStorage.setItem("lastActivity", Date.now().toString());
      } catch (err) {
        console.error("Failed to fetch user role:", err);
        setUser({ ...firebaseUser, role: "customer" });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Auto logout after inactivity
  useEffect(() => {
    const interval = setInterval(() => {
      const last = Number(localStorage.getItem("lastActivity") || 0);
      if (user && Date.now() - last > LOGOUT_TIME) {
        logout();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user, logout]);

  // Reset lastActivity on user interaction
  useEffect(() => {
    const reset = () => localStorage.setItem("lastActivity", Date.now().toString());
    window.addEventListener("mousemove", reset);
    window.addEventListener("keydown", reset);
    return () => {
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("keydown", reset);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
