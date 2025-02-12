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
  couple: boolean;
}

export default function CoupleConnectPage() {
  // URL에서 couple 코드 (예: /couple/f72c1f75)
  const { coupleId: codeParam } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [partnerCode, setPartnerCode] = useState("");
  const [message, setMessage] = useState("");

  // 로그인 여부 및 사용자 정보 확인:
  // 로그인하지 않았다면 "/auth"로 리다이렉트합니다.
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push("/auth");
        return;
      }
      // 로그인된 경우 사용자 정보를 가져옵니다.
      const { data, error } = await supabase
        .from("users")
        .select("id, user_name, couple_code, couple_id, couple")
        .eq("id", session.user.id)
        .single();
      if (error) {
        console.error("유저 정보 불러오기 실패:", error);
      } else {
        setUser(data);
      }
    };

    getUser();
  }, [router]);

  // URL 파라미터(codeParam)가 있고 사용자가 로드된 경우 자동 연동 로직 실행
  useEffect(() => {
    if (user && codeParam) {
      // 만약 URL 파라미터가 내 커플 코드와 동일하다면 아무 작업도 하지 않습니다.
      if (codeParam === user.couple_code) {
        setMessage("자신의 커플 링크입니다.");
        return;
      }

      // URL 파라미터와 내 커플 코드가 다르면, 해당 코드를 가진 사용자를 조회하여 자동 연동을 진행합니다.
      const autoCouple = async () => {
        const { data: partner, error: partnerError } = await supabase
          .from("users")
          .select("id, couple, couple_id, couple_code, user_name")
          .eq("couple_code", codeParam)
          .single();

        if (partnerError || !partner) {
          // 없는 코드인 경우: 아무런 작업 없이 메시지를 출력합니다.
          setMessage("입력하신 커플 코드에 해당하는 사용자가 없습니다.");
          return;
        }

        // 만약 파트너가 이미 연동된 상태라면 연동을 진행하지 않습니다.
        if (partner.couple) {
          setMessage("입력하신 커플 코드는 이미 연동된 상태입니다.");
          return;
        }

        // 자동 연동 진행:
        // 새로운 couple_id (UUID)를 생성하고 내 사용자와 파트너의 couple 플래그를 true로, couple_id를 업데이트합니다.
        const newCoupleId = crypto.randomUUID();

        // 내 사용자 업데이트
        const { error: updateMyError } = await supabase
          .from("users")
          .update({ couple: true, couple_id: newCoupleId })
          .eq("id", user.id);

        // 파트너 업데이트
        const { error: updatePartnerError } = await supabase
          .from("users")
          .update({
            couple: true,
            couple_id: newCoupleId,
            couple_code: user.couple_code,
          })
          .eq("id", partner.id);

        if (updateMyError || updatePartnerError) {
          setMessage("연동 중 오류가 발생했습니다.");
          return;
        }

        // user_couple 테이블에 커플 관계 기록 (couple_id를 기본키로 사용)
        const { error: insertCoupleError } = await supabase
          .from("user_couple")
          .insert({
            id: newCoupleId,
            couple_code: user.couple_code, // 필요에 따라 별도의 코드 생성 로직을 적용할 수 있습니다.
            user_id: user.id,
            partner_id: partner.id,
          });

        if (insertCoupleError) {
          setMessage("커플 테이블 업데이트 중 오류가 발생했습니다.");
          return;
        }

        setMessage("자동 커플 연동이 완료되었습니다! 🎉");
        router.push(`/couple/${newCoupleId}`);
      };

      autoCouple();
    }
  }, [user, codeParam, router]);

  // 수동 커플 연동: 사용자가 입력한 커플 코드를 기반으로 연동합니다.
  const handleConnect = async () => {
    if (!user) {
      setMessage("유저 정보를 찾을 수 없습니다.");
      return;
    }
    if (!partnerCode) {
      setMessage("커플 코드를 입력해주세요.");
      return;
    }
    // 자신의 커플 코드와 입력한 커플 코드가 같다면 아무 동작도 하지 않습니다.
    if (partnerCode === user.couple_code) {
      setMessage("자신의 커플 코드는 입력할 수 없습니다.");
      return;
    }
    // 입력한 커플 코드에 해당하는 사용자를 조회합니다.
    const { data: partner, error: partnerError } = await supabase
      .from("users")
      .select("id, couple, couple_id, couple_code, user_name")
      .eq("couple_code", partnerCode)
      .single();

    if (partnerError || !partner) {
      setMessage("입력하신 커플 코드에 해당하는 사용자가 없습니다.");
      return;
    }
    if (partner.couple) {
      setMessage("입력하신 커플 코드는 이미 연동된 상태입니다.");
      return;
    }

    // 확인창을 띄워 연동 여부를 물어봅니다.
    const confirmConnect = window.confirm(
      `${partner.user_name}님과 커플 연동을 하시겠습니까?`
    );
    if (!confirmConnect) return;

    // 새로운 couple_id (UUID)를 생성하고 두 계정의 couple 플래그와 couple_id를 업데이트합니다.
    const newCoupleId = crypto.randomUUID();

    const { error: updateMyError } = await supabase
      .from("users")
      .update({ couple: true, couple_id: newCoupleId })
      .eq("id", user.id);

    const { error: updatePartnerError } = await supabase
      .from("users")
      .update({ couple: true, couple_id: newCoupleId })
      .eq("id", partner.id);

    if (updateMyError || updatePartnerError) {
      setMessage("연동 중 오류가 발생했습니다.");
      return;
    }

    // user_couple 테이블에 새 레코드를 삽입합니다.
    const { error: insertCoupleError } = await supabase
      .from("user_couple")
      .insert({
        id: newCoupleId,
        couple_code: user.couple_code,
        user_id: user.id,
        partner_id: partner.id,
      });

    if (insertCoupleError) {
      setMessage("커플 테이블 업데이트 중 오류가 발생했습니다.");
      return;
    }

    setMessage("커플 연동이 완료되었습니다! 🎉");
    router.push(`/couple/${user.couple_code}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>💑 커플 연동</h1>
      {user ? (
        <>
          <p className={styles.info}>
            내 커플 코드: <strong>{user.couple_code}</strong>
          </p>
          {/* 수동 연동을 위한 입력창은 로그인 후, 아직 연동되지 않은 경우에만 노출 */}
          {!user.couple && (
            <>
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
            </>
          )}
          {message && <p className={styles.message}>{message}</p>}
        </>
      ) : (
        <p>유저 정보를 불러오는 중...</p>
      )}
    </div>
  );
}
