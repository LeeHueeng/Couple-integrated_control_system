"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import styles from "./Navbar.module.css";

interface UserData {
  id: string;
  user_name: string;
}

export default function Navbar() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session && session.user) {
        // user_metadata에 닉네임(nickname) 또는 user_name이 저장되어 있다고 가정합니다.
        const user_name =
          session.user.user_metadata.nickname || session.user.email;
        setUser({ id: session.user.id, user_name });
      }
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && session.user) {
          const user_name =
            session.user.user_metadata.user_name || session.user.email;
          setUser({ id: session.user.id, user_name });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav className={styles.nav}>
      {user ? (
        <>
          <span className={styles.nickname}>{user.user_name}</span>

          <Link href="/calendar" className={styles.navButton}>
            서비스 사용하기
          </Link>
          <button onClick={handleLogout} className={styles.logoutButton}>
            로그아웃
          </button>
        </>
      ) : (
        <>
          <Link href="/auth" className={styles.navButton}>
            로그인
          </Link>
          <Link href="/about" className={styles.navButton}>
            서비스 소개
          </Link>
        </>
      )}
    </nav>
  );
}
