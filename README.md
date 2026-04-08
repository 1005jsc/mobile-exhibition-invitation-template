# My Next.js Template

모바일 전시 초대장용 Next.js + Bun 커스텀 템플릿

## 사용법

### 방법 1: 수동 적용

```bash
# 1. 최신 Next.js 앱 생성
bun create next-app@latest my-project

# 2. 프로젝트 디렉토리로 이동
cd my-project

# 3. 템플릿 다운로드 (GitHub에 올린 후)
npx degit your-username/my-next-template .

# 4. 스캐폴드 실행
bash scaffold.sh

# 5. 의존성 설치 및 개발 서버 시작
bun install && bun dev
```

### 방법 2: 원커맨드 (alias 등록)

`~/.zshrc` 또는 `~/.bashrc`에 추가:

```bash
function create-invitation() {
  bun create next-app@latest "$1"
  cd "$1"
  npx degit your-username/my-next-template .
  bash scaffold.sh
  bun install
}
```

사용:

```bash
create-invitation my-new-project
```

## 포함된 구조

```
src/
├── app/
│   ├── layout.tsx      # 커스텀 레이아웃 (ThemeProvider, styled-components SSR)
│   └── page.tsx        # 빈 페이지
├── components/
│   └── common/         # 공통 컴포넌트
├── data/
│   └── DataManager.ts  # 데이터 관리
├── metaData/
│   └── metaData.ts     # OG 메타데이터
├── providers/
│   ├── ThemeProvider.tsx
│   └── styledComponents.tsx
├── style/
│   ├── StyleManager.ts
│   ├── StyleTypes.ts
│   ├── globals.css
│   └── sets/
│       ├── colors/
│       └── fonts/
├── types/
│   └── DataType.ts
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
