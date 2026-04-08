

// ============================================
// Google Fonts URL 생성 함수
// ============================================

import { FontDefinition, FontSetTypes } from "@/style/StyleTypes";
import { allFontSets } from "./fontSets";

/**
 * FontDefinition에서 Google Fonts용 폰트 이름 추출
 * "'Noto Sans KR', sans-serif" → "Noto+Sans+KR"
 */
const extractFontName = (font: FontDefinition): string => {
    return font.family
        .replace(/'/g, '')           // 따옴표 제거
        .split(',')[0]               // 첫 번째 폰트만 (fallback 제외)
        .trim()                      // 공백 제거
        .replace(/ /g, '+');         // 공백을 +로 변환
};

/**
 * 단일 폰트의 Google Fonts family 파라미터 생성
 * { family: "'Noto Sans KR'", weights: [300, 400, 500] } → "Noto+Sans+KR:wght@300;400;500"
 */
const createFontFamilyParam = (font: FontDefinition): string => {
    const fontName = extractFontName(font);
    const weights = font.weights?.join(';') || '400';
    return `${fontName}:wght@${weights}`;
};

/**
 * 특정 FontSet에서 Google Fonts URL 생성
 * source: 'google'인 폰트들만 추출하여 URL 생성
 * 
 * @param fontSet - 폰트 세트 객체
 * @returns Google Fonts CSS URL
 * 
 * @example
 * generateGoogleFontsUrl(fontSet1)
 * // → "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&family=Roboto+Flex:wght@200;400;600&family=Gowun+Dodum:wght@400&display=swap"
 */
export const generateGoogleFontsUrl = (fontSet: FontSetTypes): string => {
    const googleFonts = Object.values(fontSet.fonts)
        .filter((font): font is FontDefinition => font.source === 'google');

    if (googleFonts.length === 0) {
        return '';
    }

    // 중복 폰트 제거 (같은 폰트가 primary와 body에 둘 다 있을 수 있음)
    const uniqueFonts = new Map<string, FontDefinition>();
    googleFonts.forEach(font => {
        const fontName = extractFontName(font);
        const existing = uniqueFonts.get(fontName);
        if (existing) {
            // 기존 폰트가 있으면 weights 합치기
            const mergedWeights = [...new Set([...(existing.weights || []), ...(font.weights || [])])].sort((a, b) => a - b);
            uniqueFonts.set(fontName, { ...existing, weights: mergedWeights });
        } else {
            uniqueFonts.set(fontName, font);
        }
    });

    const families = Array.from(uniqueFonts.values())
        .map(font => `family=${createFontFamilyParam(font)}`)
        .join('&');

    return `https://fonts.googleapis.com/css2?${families}&display=swap`;
};

/**
 * 모든 FontSet의 Google Fonts URL 생성 (개발/프리뷰용)
 * 세트 전환 시 깜빡임 없이 즉시 적용하려면 모든 폰트를 미리 로드해야 함
 * 
 * @returns 모든 세트의 폰트를 포함한 Google Fonts CSS URL
 */
export const generateAllGoogleFontsUrl = (): string => {
    const allGoogleFonts = new Map<string, FontDefinition>();

    // 모든 세트에서 google 폰트 수집 (fontSets[1]부터 시작)
    allFontSets.forEach(fontSet => {
        if (!fontSet) return;
        (Object.values(fontSet.fonts) as FontDefinition[]).forEach(font => {
            if (font.source === 'google') {
                const fontName = extractFontName(font);
                const existing = allGoogleFonts.get(fontName);
                if (existing) {
                    const mergedWeights = [...new Set([...(existing.weights || []), ...(font.weights || [])])].sort((a, b) => a - b);
                    allGoogleFonts.set(fontName, { ...existing, weights: mergedWeights });
                } else {
                    allGoogleFonts.set(fontName, font);
                }
            }
        });
    });

    if (allGoogleFonts.size === 0) {
        return '';
    }

    const families = Array.from(allGoogleFonts.values())
        .map(font => `family=${createFontFamilyParam(font)}`)
        .join('&');

    return `https://fonts.googleapis.com/css2?${families}&display=swap`;
};

/**
 * Local 폰트의 @font-face CSS 생성
 * source: 'local'인 폰트들의 CSS 규칙 생성
 * 
 * @param fontSet - 폰트 세트 객체
 * @returns @font-face CSS 문자열
 * 
 * @example
 * generateLocalFontFaces(fontSet1)
 * // → "@font-face { font-family: 'BookkMyungjo'; src: url('/fonts/부크크명조/BookkMyungjo_Light.ttf') format('truetype'); }"
 */
export const generateLocalFontFaces = (fontSet: FontSetTypes): string => {
    const localFonts = Object.values(fontSet.fonts)
        .filter((font): font is FontDefinition => font.source === 'local' && !!font.localPath);

    if (localFonts.length === 0) {
        return '';
    }

    return localFonts
        .map(font => {
            const fontName = font.family.replace(/'/g, '').split(',')[0].trim();
            return `@font-face {
  font-family: '${fontName}';
  src: url('${font.localPath}') format('truetype');
  font-display: swap;
}`;
        })
        .join('\n\n');
};

/**
 * 모든 Local 폰트의 @font-face CSS 생성 (개발/프리뷰용)
 * 
 * @returns 모든 세트의 로컬 폰트를 포함한 @font-face CSS 문자열
 */
export const generateAllLocalFontFaces = (): string => {
    const allLocalFonts = new Map<string, FontDefinition>();

    allFontSets.forEach(fontSet => {
        if (!fontSet) return;
        (Object.values(fontSet.fonts) as FontDefinition[]).forEach(font => {
            if (font.source === 'local' && font.localPath) {
                const fontName = font.family.replace(/'/g, '').split(',')[0].trim();
                if (!allLocalFonts.has(fontName)) {
                    allLocalFonts.set(fontName, font);
                }
            }
        });
    });

    if (allLocalFonts.size === 0) {
        return '';
    }

    return Array.from(allLocalFonts.values())
        .map(font => {
            const fontName = font.family.replace(/'/g, '').split(',')[0].trim();
            return `@font-face {
  font-family: '${fontName}';
  src: url('${font.localPath}') format('truetype');
  font-display: swap;
}`;
        })
        .join('\n\n');
};
