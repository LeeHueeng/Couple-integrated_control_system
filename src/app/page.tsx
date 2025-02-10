// app/page.tsx
import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.homepage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1>커플 계획표</h1>
          <h2>함께하는 하루, 특별한 추억으로</h2>
          <p>
            커플 계획표와 함께 소중한 순간들을 기록하고, 더욱 가까워지는
            우리만의 일정을 만들어보세요.
          </p>
          <Link href="/auth" className={styles.ctaButton}>
            지금 시작하기
          </Link>
        </div>
        {/* Animated SVG Elements */}
        <div className={styles.animatedSvgs}>
          <svg
            className={`${styles.heart} ${styles.heart1}`}
            viewBox="0 0 32 29.6"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23.6,0c-3.4,0-6.4,1.7-8,4.3C13.8,1.7,10.8,0,7.4,0C3.3,0,0,3.3,0,7.4c0,4.3,3.8,7.8,9.6,13.1l4,3.7
              l4-3.7C28.2,15.2,32,11.7,32,7.4C32,3.3,28.7,0,24.6,0H23.6z"
              fill="#FF6B6B"
            />
          </svg>
          <svg
            className={`${styles.heart} ${styles.heart2}`}
            viewBox="0 0 32 29.6"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23.6,0c-3.4,0-6.4,1.7-8,4.3C13.8,1.7,10.8,0,7.4,0C3.3,0,0,3.3,0,7.4c0,4.3,3.8,7.8,9.6,13.1l4,3.7
              l4-3.7C28.2,15.2,32,11.7,32,7.4C32,3.3,28.7,0,24.6,0H23.6z"
              fill="#FF6B6B"
            />
          </svg>
          <svg
            className={`${styles.heart} ${styles.heart3}`}
            viewBox="0 0 32 29.6"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23.6,0c-3.4,0-6.4,1.7-8,4.3C13.8,1.7,10.8,0,7.4,0C3.3,0,0,3.3,0,7.4c0,4.3,3.8,7.8,9.6,13.1l4,3.7
              l4-3.7C28.2,15.2,32,11.7,32,7.4C32,3.3,28.7,0,24.6,0H23.6z"
              fill="#FF6B6B"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2>우리의 서비스</h2>
        <p className={styles.featuresDesc}>
          커플 계획표는 카카오 로그인 기반 간편 인증부터 캘린더 연동, TODO 관리,
          지도 기록, 그리고 인스타 스크랩까지 다양한 기능을 통해 커플만의 특별한
          일상을 만들어갑니다.
        </p>
        <div className={styles.featureGrid}>
          <div className={styles.featureItem}>
            <svg className={styles.featureIcon} viewBox="0 0 64 64">
              <circle cx="32" cy="20" r="12" fill="#FF6B6B" />
              <path
                d="M16 52c0-8.8 7.2-16 16-16s16 7.2 16 16"
                stroke="#FF6B6B"
                strokeWidth="4"
                fill="none"
              />
            </svg>
            <h3>간편 로그인</h3>
            <p>카카오 로그인을 통해 쉽고 빠른 회원가입 및 인증</p>
          </div>
          <div className={styles.featureItem}>
            <svg className={styles.featureIcon} viewBox="0 0 64 64">
              <rect x="8" y="14" width="48" height="40" rx="4" fill="#FF6B6B" />
              <line
                x1="8"
                y1="26"
                x2="56"
                y2="26"
                stroke="#fff"
                strokeWidth="4"
              />
            </svg>
            <h3>캘린더 연동</h3>
            <p>구글 및 애플 캘린더와 손쉽게 연결하여 일정 관리</p>
          </div>
          <div className={styles.featureItem}>
            <svg className={styles.featureIcon} viewBox="0 0 64 64">
              <rect
                x="14"
                y="18"
                width="36"
                height="32"
                rx="4"
                fill="#FF6B6B"
              />
              <path
                d="M22 30h20M22 38h20"
                stroke="#fff"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            <h3>커플 TODO</h3>
            <p>함께하는 할 일 목록으로 소통과 협력을 강화</p>
          </div>
          <div className={styles.featureItem}>
            <svg className={styles.featureIcon} viewBox="0 0 64 64">
              <path
                d="M32 2C20 2 12 10 12 22c0 16 20 40 20 40s20-24 20-40c0-12-8-20-20-20z"
                fill="#FF6B6B"
              />
              <circle cx="32" cy="22" r="6" fill="#fff" />
            </svg>
            <h3>장소 기록</h3>
            <p>갔던 곳과 가고 싶은 곳을 기록하고 네이버 지도 연동</p>
          </div>
          <div className={styles.featureItem}>
            <svg className={styles.featureIcon} viewBox="0 0 64 64">
              <rect
                x="14"
                y="14"
                width="36"
                height="36"
                rx="8"
                fill="#FF6B6B"
              />
              <circle cx="32" cy="32" r="6" fill="#fff" />
            </svg>
            <h3>커플 스크랩</h3>
            <p>인스타그램 연동으로 소중한 순간을 쉽게 저장</p>
          </div>
        </div>
      </section>
    </div>
  );
}
