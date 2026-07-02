# PHASE 2 — Auth, ENV & Supabase Client Fix

> **Tujuan:** Fix env key mismatch, perkuat auth flow, tambah role-based redirect, update `useAuth` dengan profile creation yang robust.
> **Estimasi:** 20–30 menit
> **Prasyarat:** Phase 1 selesai (database sudah di-push)

---

## 2.1 — Buat file `.env` yang benar

File `agrou/agrou/.env`:

```env
VITE_SUPABASE_URL=https://hodtuvbkrshvtjesacab.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_XBrg2E-1EwKSf2XZhPolxg_nlQxpRjv
```

> **PENTING:** `supabase.ts` membaca `VITE_SUPABASE_ANON_KEY`. Saat ini `.env.example` memakai `VITE_SUPABASE_PUBLISHABLE_KEY` — ini mismatch yang menyebabkan client tidak terhubung.

---

## 2.2 — Update `agrou/agrou/src/lib/supabase.ts`

```typescript
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "[Agrou] Missing Supabase env vars. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env"
  );
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
export type { Database };
```

---

## 2.3 — Update `agrou/agrou/src/hooks/useAuth.tsx`

```typescript
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import supabase from "../lib/supabase";
import type { Profile, UserRole } from "../lib/database.types";

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.error("Error fetching profile:", error.message);
    return null;
  }
  return data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string) => {
    const p = await fetchProfile(userId);
    setProfile(p);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) await loadProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });
    if (error) throw error;

    // Upsert profile — trigger handles INSERT but we upsert to be safe
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").upsert(
        { id: data.user.id, full_name: fullName, role },
        { onConflict: "id" }
      );
      if (profileError) console.warn("Profile upsert warning:", profileError.message);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = useCallback(async () => {
    if (user) await loadProfile(user.id);
  }, [user, loadProfile]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) throw new Error("Not authenticated");
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);
    if (error) throw error;
    await loadProfile(user.id);
  }, [user, loadProfile]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, refreshProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
```

---

## 2.4 — Update `agrou/agrou/src/App.tsx` — role-based redirect setelah login

Tambahkan logic di `ProtectedRoute` agar dashboard bisa detect role.
Cari bagian `ProtectedRoute` dan update:

```typescript
// Di dalam ProtectedRoute — tambah role redirect
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/masuk" state={{ from: location }} replace />;
  return <>{children}</>;
}

// Di dalam AuthRoute — redirect ke dashboard jika sudah login
function AuthRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
```

---

## 2.5 — Tambah `agrou/agrou/src/lib/queries/profiles.ts` (file baru)

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../supabase";
import type { Profile } from "../database.types";

export function useProfile(userId: string) {
  return useQuery<Profile | null>({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Profile>;
    }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["profile", variables.id] });
    },
  });
}

export function useUploadAvatar() {
  return useMutation({
    mutationFn: async ({ userId, file }: { userId: string; file: File }) => {
      const ext = file.name.split(".").pop();
      const path = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      return data.publicUrl;
    },
  });
}
```

---

## 2.6 — Tambah `agrou/agrou/src/lib/queries/notifications.ts` (file baru)

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";

export interface Notification {
  id: string;
  user_id: string;
  type: "order" | "shield" | "system" | "promo" | "member";
  title: string;
  message: string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export function useNotifications(userId: string) {
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  const query = useQuery<Notification[]>({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as Notification[];
    },
    enabled: !!userId,
  });

  // Realtime subscription
  useEffect(() => {
    if (!userId) return;
    channelRef.current = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        () => queryClient.invalidateQueries({ queryKey: ["notifications", userId] })
      )
      .subscribe();

    return () => {
      channelRef.current?.unsubscribe();
    };
  }, [userId, queryClient]);

  return query;
}

export function useUnreadCount(userId: string) {
  return useQuery<number>({
    queryKey: ["notifications-unread", userId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_read", false);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!userId,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
    },
  });
}
```

---

## Checklist Phase 2

- [ ] `.env` dibuat dengan `VITE_SUPABASE_ANON_KEY`
- [ ] `supabase.ts` diupdate (health check log)
- [ ] `useAuth.tsx` diupdate (refreshProfile + updateProfile)
- [ ] `profiles.ts` query file dibuat
- [ ] `notifications.ts` query file dibuat
- [ ] Test: buka browser, buka console — tidak ada error "Missing Supabase env vars"
- [ ] Test: register akun baru → profile terbuat di tabel `profiles`

**Setelah selesai → lanjut ke PHASE-3-KOPERASI-DASHBOARD.md**
