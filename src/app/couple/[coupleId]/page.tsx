"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import styles from "./page.module.css";

interface User {
  id: string;
  user_name: string;
  couple_code: string;
  couple_id: string | null;
}

export default function CoupleConnectPage() {
  const { coupleId } = useParams(); // URL에서 coupleId 가져오기
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [partnerCode, setPartnerCode] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from("users")
          .select("id, user_name, couple_code, couple_id")
          .eq("id", session.user.id)
          .single();
        if (error) {
          console.error("유저 정보 불러오기 실패:", error);
        } else {
          setUser(data);
        }
      }
    };

    getUser();
  }, []);

  const handleConnect = async () => {
    if (!user) {
      setMessage("유저 정보를 찾을 수 없습니다.");
      return;
    }

    if (!partnerCode) {
      setMessage("커플 코드를 입력해주세요.");
      return;
    }

    const { data: partner, error: partnerError } = await supabase
      .from("users")
      .select("id, couple_id")
      .eq("couple_code", partnerCode)
      .single();

    if (partnerError || !partner) {
      setMessage("해당 코드의 사용자를 찾을 수 없습니다.");
      return;
    }

    if (partner.couple_id) {
      setMessage("이미 커플로 연동된 사용자입니다.");
      return;
    }

    // 새로운 커플 ID 생성
    const newCoupleId = `COUPLE-${Date.now()}`;

    const { error: updateUserError } = await supabase
      .from("users")
      .update({ couple_id: newCoupleId })
      .eq("id", user.id);

    const { error: updatePartnerError } = await supabase
      .from("users")
      .update({ couple_id: newCoupleId })
      .eq("id", partner.id);

    if (updateUserError || updatePartnerError) {
      setMessage("연동 중 오류가 발생했습니다.");
    } else {
      setMessage("커플 연동이 완료되었습니다! 🎉");
      router.push(`/couple/${newCoupleId}`); // 커플 페이지로 이동
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>💑 커플 연동</h1>
      {user ? (
        <>
          <p className={styles.info}>
            나의 커플 코드: <strong>{user.couple_code}</strong>
          </p>
          <input
            type="text"
            placeholder="상대방의 커플 코드 입력"
            value={partnerCode}
            onChange={(e) => setPartnerCode(e.target.value)}
            className={styles.input}
          />
          <button onClick={handleConnect} className={styles.button}>
            커플 연동하기
          </button>
          {message && <p className={styles.message}>{message}</p>}
        </>
      ) : (
        <p>유저 정보를 불러오는 중...</p>
      )}
    </div>
  );
}
