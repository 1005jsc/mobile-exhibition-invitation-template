/**
 * 글로벌 CSS 테마 시스템 타입 정의
 * 
 * 사용법: globalCssManager.ts에서 [폰트세트번호, 컬러세트번호, 텍스처세트번호] 배열로 테마 선택
 * 예시: [1, 2, 3] → 폰트 1번 세트, 컬러 2번 세트, 텍스처 3번 세트 적용
 */

// ============================================
// 폰트 관련 타입
// ============================================

/**
 * 폰트 로딩 방식
 * - google: Google Fonts CDN에서 로드
 * - local: public/fonts/ 폴더에서 로드
 * - system: 브라우저 기본 폰트 사용
 */
export type FontSource = 'google' | 'local' | 'system';

/**
 * 개별 폰트 정의
 */
export interface FontDefinition {
    family: string;           // CSS font-family 값 (예: "'Noto Sans KR', sans-serif")
    source: FontSource;       // 폰트 로딩 방식
    weights?: number[];       // 사용할 font-weight 목록 (google 폰트용)
    localPath?: string;       // local 폰트의 경우 파일 경로
}

/**
 * 폰트 세트 - 용도별 폰트 정의
 */
export interface FontSetTypes {
    id: number;
    name: string;
    description: string;
    fonts: {
        primary: FontDefinition;      // 한글 기본 (본문, 제목 등)
        secondary: FontDefinition;    // 영문 기본 (날짜, 메타 정보 등)
        display: FontDefinition;      // 디스플레이용 (대형 타이틀, 작가명)
        body: FontDefinition;         // 긴 본문용 (초대의 글, 평론 등)
    };
}

// ============================================
// 컬러 관련 타입
// ============================================

/**
 * 컬러 세트 - 용도별 색상 정의
 */
export interface ColorSetTypes {
    id: number;
    name: string;
    description: string;
    themeType: 'light' | 'dark';
    colors: {
        textPrimary: string;      // 메인 타이틀, 강조 텍스트 (#111111)
        textHeading: string;      // 서브 타이틀, 섹션 제목 (#333333)
        textSecondary: string;    // 본문 내용, 리스트 아이템 (#555555)
        textTertiary: string;     // 서명, 날짜 등 (#777777)
        textMuted: string;        // 영문 병기, 메타 정보, 캡션 (#888888)
        bgPrimary: string;        // 주요 섹션 배경 (Hero, 작품 등)
        bgSecondary: string;      // 보조 섹션 배경 (약력, 연락처 등)
        divider: string;          // 구분선, 테두리
        accent?: string;          // 강조색 (CTA, 링크 등) - 선택적
    };
}


// ============================================
// 통합 테마 타입
// ============================================

/**
 * 테마 선택 배열 타입
 * [폰트세트번호(문자열), 컬러세트번호, 텍스처세트번호]
 */
export type ThemeSelection = [string, number];

/**
 * 최종 적용될 통합 테마
 */
export interface GlobalThemeTypes {
    font: FontSetTypes;
    color: ColorSetTypes;

}

/**
 * CSS 변수로 변환된 테마 값들
 * (실제 컴포넌트에서 사용할 CSS 변수명과 값)
 */
export interface CSSVariables {
    // 폰트 변수
    '--font-primary': string;
    '--font-secondary': string;
    '--font-display': string;
    '--font-body': string;

    // 컬러 변수
    '--color-text-primary': string;
    '--color-text-heading': string;
    '--color-text-secondary': string;
    '--color-text-tertiary': string;
    '--color-text-muted': string;
    '--color-bg-primary': string;
    '--color-bg-secondary': string;
    '--color-divider': string;
    '--color-accent'?: string;


}
