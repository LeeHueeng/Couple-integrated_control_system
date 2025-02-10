"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "./page.module.css";

export default function AuthPage() {
  const [error, setError] = useState("");

  // Kakao OAuth를 통한 로그인/회원가입 핸들러
  const handleKakaoAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: process.env.KAKAO_REDIRECT_URI, // Supabase와 Kakao OAuth 설정에 맞게 사용
      },
    });
    if (error) {
      setError(error.message);
    }
    // 로그인 요청 시 자동으로 Kakao 로그인 화면으로 리다이렉트됩니다.
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.card}>
        <h1 className={styles.title}>로그인 / 회원가입</h1>
        <p>본 서비스는 카카오톡 로그인만 지원합니다.</p>
        <button className={styles.kakaoButton} onClick={handleKakaoAuth}>
          카카오로 시작하기
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
