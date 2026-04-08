# My Next.js Template

모바일 전시 초대장용 Next.js + Bun 커스텀 템플릿

## 사용법

### 방법 1: 수동 적용

# 1. bun create next-app@latest my-bun-app로 리포지토리 새로 만들고

# 2. https://github.com/1005jsc/mobile-exhibition-invitation-template을 git clone으로 가져온다

# 3. 2에서 가져온 파일(readme.md 빼고) 다 1에 집어 넣는다

# 4. 스캐폴드 실행

bash scaffold.sh

# 5. 의존성 설치 및 개발 서버 시작

bun install && bun dev

```



## 포함된 구조

```

src/
├── app/
│ ├── layout.tsx # 커스텀 레이아웃 (ThemeProvider, styled-components SSR)
│ └── page.tsx # 빈 페이지
├── components/
│ └── common/ # 공통 컴포넌트
├── data/
│ └── DataManager.ts # 데이터 관리
├── metaData/
│ └── metaData.ts # OG 메타데이터
├── providers/
│ ├── ThemeProvider.tsx
│ └── styledComponents.tsx
├── style/
│ ├── StyleManager.ts
│ ├── StyleTypes.ts
│ ├── globals.css
│ └── sets/
│ ├── colors/
│ └── fonts/
├── types/
│ └── DataType.ts
└── utils/
├── ImagePreview/
└── Notification/

```

## 추가 패키지

- `styled-components` - CSS-in-JS
- `next-themes` - 테마 관리
- `lucide-react` - 아이콘
- `sonner` - 토스트 알림
- `react-zoom-pan-pinch` - 이미지 줌/팬
- `tailwindcss-animate` - Tailwind 애니메이션

## 요구사항

- jq (package.json 병합용): `brew install jq`
```
