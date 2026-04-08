import { FontSetTypes } from "@/style/StyleTypes";

export type FontSetSelector = string;
export const DefaultFontSet = (index: 1 | 2 | 3): FontSetSelector => `default-${index}`;

export const defaultFontSet: FontSetTypes[] = [
    {
        id: 1,
        name: '원본 (main 브랜치 설정)',
        description: 'main 브랜치의 원본 폰트 설정 (Noto Sans KR, Roboto Flex 등)',
        fonts: {
            primary: {
                family: "'Noto Sans KR', sans-serif",
                source: 'google',
                weights: [100, 200, 300, 400, 500, 600, 700],
            },
            secondary: {
                family: "'Roboto Flex', 'Roboto', sans-serif",
                source: 'google',
                weights: [50, 100, 200, 300, 400, 500, 600],
            },
            display: {
                family: "'BookkMyungjo', '부크크 명조', serif",
                source: 'local',
                localPath: '/fonts/부크크명조/BookkMyungjo_Light.ttf',
            },
            body: {
                family: "'Gowun Dodum', sans-serif",
                source: 'google',
                weights: [400],
            },
        },
    },


]



/**
 * 전체 폰트 세트 배열 (폰트 로직에서 순회용)
 */
export const allFontSets: FontSetTypes[] = [
    ...defaultFontSet,

];

/**
 * 폰트 세트 ID로 가져오기
 * 
 * @param id - FontSetSelector 함수 반환값 (예: 'modern-1')
 * @example
 * getFontSet(DefaultFontSet(1)) // 선택 함수로 접근
 * getFontSet(ModernFontSet(3)) // 어반 시크
 */
export const getFontSet = (id: string): FontSetTypes => {
    const [category, indexStr] = id.split('-');
    const index = parseInt(indexStr, 10) - 1; // 0-based index

    let set: FontSetTypes | undefined;

    switch (category) {
        case 'default': set = defaultFontSet[index]; break;

    }

    if (!set) {
        throw new Error(`FontSet ${id} not found.`);
    }
    return set;
};
