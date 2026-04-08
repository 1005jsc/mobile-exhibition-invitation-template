import { ColorSetTypes } from "@/style/StyleTypes";


export const colorSet1: ColorSetTypes = {
    id: 1,
    name: 'default 톤',
    description: '디자인플러스 적용 톤',
    themeType: 'light',
    colors: {
        textPrimary: '#111111',     // 메인 타이틀, 강조 텍스트
        textHeading: '#333333',     // 서브 타이틀, 섹션 제목
        textSecondary: '#555555',   // 본문 내용, 리스트 아이템
        textTertiary: '#777777',    // 서명, 날짜 등
        textMuted: '#888888',       // 영문 병기, 메타 정보, 캡션
        bgPrimary: '#FFFFFF',       // Hero, 초대의 글, 작품, Footer 섹션 배경
        bgSecondary: '#FAFAFA',     // 작가 약력, 연락처 섹션 배경
        divider: '#E5E5E5',         // 구분선, 이미지 테두리
    },
};

export const colorSets: (ColorSetTypes | undefined)[] = [
    undefined,
    colorSet1,

];

/**
 * 컬러 세트 ID로 가져오기
 */
export const getColorSet = (id: number): ColorSetTypes => {
    const set = colorSets[id];
    if (!set) {
        throw new Error(`ColorSet ${id} not found. Available: 1-18`);
    }
    return set;
};
