import { getColorSet } from "./sets/colors/colorSets";
import { generateGoogleFontsUrl, generateLocalFontFaces } from "./sets/fonts/fontLogics";
import { DefaultFontSet, getFontSet } from "./sets/fonts/fontSets";
import { CSSVariables, GlobalThemeTypes, ThemeSelection } from "./StyleTypes";

// 1 테마 선택

export const themeSelection: ThemeSelection = [DefaultFontSet(1), 1];


// 2 css 변수 생성

export const generateCSSVariables = (theme: GlobalThemeTypes): CSSVariables => {
    const { font, color } = theme;

    const variables: CSSVariables = {
        // 폰트 변수
        '--font-primary': font.fonts.primary.family,
        '--font-secondary': font.fonts.secondary.family,
        '--font-display': font.fonts.display.family,
        '--font-body': font.fonts.body.family,

        // 컬러 변수
        '--color-text-primary': color.colors.textPrimary,
        '--color-text-heading': color.colors.textHeading,
        '--color-text-secondary': color.colors.textSecondary,
        '--color-text-tertiary': color.colors.textTertiary,
        '--color-text-muted': color.colors.textMuted,
        '--color-bg-primary': color.colors.bgPrimary,
        '--color-bg-secondary': color.colors.bgSecondary,
        '--color-divider': color.colors.divider,


    };

    // 선택적 값들
    if (color.colors.accent) {
        variables['--color-accent'] = color.colors.accent;
    }


    return variables;
};


export const getGlobalTheme = (selection: ThemeSelection): GlobalThemeTypes => {
    const [fontId, colorId] = selection;

    return {
        font: getFontSet(fontId),
        color: getColorSet(colorId),

    };
};




// ----------------------


/**
 * 현재 선택된 테마
 */
export const globalTheme: GlobalThemeTypes = getGlobalTheme(themeSelection);
/**
 * 현재 테마의 CSS 변수
 */
export const cssVariables: CSSVariables = generateCSSVariables(globalTheme);




///////////---------------------------------------------------------








/**
 * 현재 선택된 테마의 Google Fonts URL
 * (프로덕션용 - 선택된 세트의 폰트만 로드)
 */
export const googleFontsUrl: string = generateGoogleFontsUrl(globalTheme.font);


/**
 * 현재 선택된 테마의 로컬 폰트 @font-face CSS
 */
export const localFontFaces: string = generateLocalFontFaces(globalTheme.font);


export const cssVariablesAsStyle: React.CSSProperties = Object.entries(cssVariables).reduce(
    (acc, [key, value]) => {
        acc[key as keyof React.CSSProperties] = value;
        return acc;
    },
    {} as Record<string, string>
) as React.CSSProperties;






/////////---------------------------------------------------


// 최종적으로 layout.tsx에서 사용할 데이터


export const themeInfo = {

    cssVariablesAsStyle,
    googleFontsUrl,
    localFontFaces,
};
