#!/bin/bash

# 현재 디렉토리가 Next.js 프로젝트인지 확인
if [ ! -f "package.json" ]; then
  echo "❌ package.json이 없습니다. Next.js 프로젝트 루트에서 실행하세요."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 커스텀 템플릿 적용 중..."

# 1. 불필요한 기본 파일들 삭제
echo "🗑️  기본 파일 정리..."
rm -f public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
rm -f src/app/favicon.ico
rm -f src/app/globals.css

# 2. 커스텀 폴더/파일 복사
echo "📁 커스텀 구조 복사..."
cp -r "$SCRIPT_DIR/template/"* .

# 3. 기존 파일 덮어쓰기
echo "📝 앱 파일 오버라이드..."
cp -r "$SCRIPT_DIR/overrides/"* .

# 4. package.json에 추가 dependencies 병합
echo "📦 package.json 병합..."
if command -v jq &> /dev/null; then
  jq -s '.[0] * .[1]' package.json "$SCRIPT_DIR/package.partial.json" > package.tmp.json
  mv package.tmp.json package.json
else
  echo "⚠️  jq가 설치되어 있지 않습니다. package.partial.json을 수동으로 병합하세요."
  echo "   설치: brew install jq"
fi

# 5. 완료
echo ""
echo "✅ 템플릿 적용 완료!"
echo ""
echo "다음 단계:"
echo "  1. bun install"
echo "  2. bun dev"
