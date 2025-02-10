"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import styles from "./Navbar.module.css";

interface UserData {
  id: string;
  user_name: string;
  couple: boolean;
  couple_code: string | null;
}

export default function Navbar() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserAndCoupleStatus = async () => {
      // 세션 확인
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session && session.user) {
        // user_metadata에 저장된 user_name 또는 nickname, 없으면 email 사용
        const user_name =
          session.user.user_metadata.user_name ||
          session.user.user_metadata.nickname ||
          session.user.email;

        // Supabase의 "users" 테이블에서 해당 사용자의 couple 값 조회
        const { data, error } = await supabase
          .from("users")
          .select("couple, couple_code")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching couple status:", error);
        }

        // 조회된 couple 값이 없으면 false로 기본값 처리
        const couple = data?.couple ?? false;
        const couple_code = data?.couple_code ?? null;

        setUser({ id: session.user.id, user_name, couple, couple_code });
      }
    };

    fetchUserAndCoupleStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && session.user) {
          const user_name =
            session.user.user_metadata.user_name ||
            session.user.user_metadata.nickname ||
            session.user.email;

          const { data, error } = await supabase
            .from("users")
            .select("couple, couple_code")
            .eq("id", session.user.id)
            .single();

          if (error) {
            console.error("Error fetching couple status:", error);
          }

          const couple = data?.couple ?? false;
          const couple_code = data?.couple_code ?? null;
          setUser({ id: session.user.id, user_name, couple, couple_code });
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
          {user.couple ? (
            // couple 값이 true인 경우: 서비스 이용하기 버튼 표시
            <Link href="/service" className={styles.navButton}>
              서비스 이용하기
            </Link>
          ) : (
            // couple 값이 false인 경우: 커플 매칭하기 버튼 표시
            <Link
              href={`/couple/${user.couple_code}`}
              className={styles.navButton}
            >
              커플 매칭하기
            </Link>
          )}
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
