# 🌍 EarthThreeJS — 인터랙티브 지구

**React Three Fiber + Three.js + 커스텀 GLSL 셰이더 + GSAP** 기반의 **인터랙티브 행성 시각화** 입니다. 절차적 대기 / 오존, 자전하는 구름, 시네마틱 카메라 경로, 블룸 + 색수차 + 비네트 포스트프로세싱을 한 화면에서 GUI 로 실시간 조정할 수 있습니다. 본 저장소는 `achrefelouafi/EarthThreeJS` 의 **sigco3111 한국어 fork** 입니다 — 모든 컨트롤과 안내문을 한글로 제공하며, `src/i18n.ts` 가 한국어/영문 양쪽 키를 모두 보관합니다.

---

## 🌐 라이브 데모

**👉 https://sigco3111.github.io/EarthThreeJS/**

별도 빌드 없이 풀 인터랙티브 데모를 바로 확인하실 수 있습니다.

---

## 📚 저장소

- 🇰🇷 **한국어 fork**: https://github.com/sigco3111/EarthThreeJS
- ⭐ **원본 저장소** (achrefelouafi): https://github.com/achrefelouafi/EarthThreeJS
- 🌐 **라이브 데모**: https://sigco3111.github.io/EarthThreeJS/

---

## ✨ 주요 기능

### 🌍 절차적 행성

- **8K 지구 텍스처** — 주간 / 야간 / 법선 / 스페큘러 / 클라우드 5 종 (8K 해상도) 사용.
- **자전** — 슬라이더로 지구 자전 속도 자유 조정.
- **대기 / 오존 (Atmosphere / Ozone)** — 명면 / 암면 불투명도 + 프레넬 지수 + 광채 강도 + 대기 색상 5 개 컨트롤.
- **구름 (Clouds)** — 명면 / 암면 불투명도 + 회전 속도 3 개 컨트롤. 자전과 독립적으로 회전.

### ☀️ 라이팅 + 시간대

- **낮/밤 (Day/Night)** — 0~1 슬라이더로 태양 위치 즉시 변경.
- **태양 강도 / 크기 / 색상** 3 개 컨트롤.
- **암면 가시성** — 지구 뒷면 밝기 (도시 야경 + 산란광).
- **야간 조명** — 야간 도시 조명 강도.

### ✨ 포스트프로세싱

- **블룸 (Bloom)** — 강도 / 임계값 / 부드러움 3 개 컨트롤.
- **필름 효과** — 색수차 (Chromatic Aberration) + 비네트 (Vignette).
- **환경** — 우주 색상 + 별 개수 (최대 20,000 개).

### 🎬 시네마틱 카메라

- **카메라 경로** — 사전 정의된 시네마틱 카메라 경로 (이름/시간 표시).
- **시네마틱 시작/정지** — 한 번 클릭으로 자동 카메라 무빙 시작.
- **현재 샷 표시** — 시네마틱 진행 중 현재 샷 이름 우상단 표시.
- **레터박스 (Cinematic Bars)** — 시네마틱 진행 시 영화 비율 바 표시.

### 🇰🇷 한국어 UI

- `src/i18n.ts` 가 **45+ 한국어/영문 키** 를 모두 보관.
- 타이틀 화면 / 워터마크 / 3 개 탭 / 40+ 컨트롤 / 모든 안내문 한국어 통일.
- `setLanguage('en')` 으로 영문 토글 가능 (현재 자동 = 한국어).

---

## 🛠️ 기술 스택

| 영역 | 사용 기술 |
|---|---|
| **UI** | React 19 + TypeScript 6 |
| **3D** | React Three Fiber 9 + Three.js r184 + Drei 10 |
| **빌드** | Vite 8 + Babel + React Compiler |
| **포스트프로세싱** | postprocessing 6 + @react-three/postprocessing 3 |
| **애니메이션** | GSAP 3.15 (시네마틱 전환) |
| **텍스처** | 8K PBR (Color / Night / Normal / Specular / Clouds) |

---

## 🚀 로컬 실행

```bash
# 1. 저장소 클론
git clone https://github.com/sigco3111/EarthThreeJS.git
cd EarthThreeJS

# 2. 의존성 설치 (pnpm 권장)
pnpm install

# 3. 개발 서버 (http://localhost:5175)
pnpm dev

# 4. 프로덕션 빌드
pnpm build

# 5. 빌드 결과 미리보기
pnpm preview
```

빌드 산출물은 `dist/` 폴더에 생성되며, GitHub Pages 와 1:1 로 동일하게 작동합니다.

> ⚠️ 원본의 `pnpm build:strict` 는 `tsc -b && vite build` — TypeScript strict mode 에서 미사용 변수 등이 에러로 잡힙니다. 기본 `pnpm build` 는 vite 만 실행 (strict skip).

---

## 📁 프로젝트 구조

```
EarthThreeJS/
├─ src/
│  ├─ main.tsx             # React 엔트리
│  ├─ App.tsx              # 메인 컴포넌트 (타이틀 + 워터마크 + 시네마틱 + t() 라벨)
│  ├─ i18n.ts              # 🇰🇷 KO + 🇺🇸 EN 키 (45+)
│  ├─ components/
│  │  ├─ EarthScene.tsx    # Canvas + 씬 통합
│  │  ├─ Earth.tsx         # 지구 + 텍스처 + 자전
│  │  ├─ Atmosphere.tsx    # 대기 / 오존 셰이더
│  │  ├─ Clouds.tsx        # 절차적 구름
│  │  ├─ Sun.tsx           # 태양 셰이더
│  │  ├─ CinematicCamera.tsx # 시네마틱 카메라 경로
│  │  └─ ControlPanel.tsx  # 3 탭 컨트롤 패널 (40+ 컨트롤, t() 적용)
│  ├─ App.css              # 스타일
│  ├─ index.css            # 글로벌 스타일
│  └─ vite.config.ts       # base: '/EarthThreeJS/' (GitHub Pages 경로)
├─ public/                 # 정적 자산 (8K 텍스처, favicon)
├─ index.html              # <html lang="ko"> + 한글 title
└─ README.md               # 본 파일
```

---

## 🎮 사용 방법

1. **타이틀 화면** — "지구 둘러보기" 버튼 클릭으로 시작
2. **궤도 카메라** — 마우스 드래그 (또는 터치 드래그) 로 카메라 회전
3. **줌** — 마우스 휠 (또는 핀치)
4. **컨트롤 패널 (H 키로 숨기기)**:
   - 🌍 **지구 탭** — 시간대 / 대기 / 구름 3 섹션 슬라이더
   - ✨ **효과 탭** — 환경 / 블룸 / 필름 효과 3 섹션
   - 🎬 **카메라 탭** — 시네마틱 시작 + 카메라 경로 + 팁
5. **시네마틱** — 카메라 탭에서 "시네마틱 시작" 버튼으로 자동 무빙 시작

---

## 🌐 다국어 토글

기본은 한국어. 콘솔에서 영문으로 전환:

```javascript
import { setLanguage } from './src/i18n.ts';
setLanguage('en');
// 이후 모든 라벨이 영문으로 갱신됨
```

새 라벨을 추가할 때는 `src/i18n.ts` 의 `KO` / `EN` 양쪽에 키를 추가하면 양쪽 언어에 동시 반영됩니다.

---

## 🎯 한국어 fork 컬렉션 (sigco3111)

같은 작성자 `achrefelouafi` 의 다른 한국어 fork 들:

| # | 라이브 데모 | GitHub |
|---|---|---|
| 1 | https://waterthreejs.vercel.app | sigco3111/WaterThreeJS |
| 2 | https://basicproceduralbuilding.vercel.app | sigco3111/BasicProceduralBuilding |
| 3 | https://polegeneratortwothreejs.vercel.app | sigco3111/PoleGeneratorThreeJS |
| 4 | https://bookcasethreejs.vercel.app | sigco3111/BookcaseThreeJS |
| 5 | https://vegetationgeneratortwothreejs.vercel.app | sigco3111/VegetationGeneratorThreeJS |
| 6 | https://buildinggeneratortwothreejs.vercel.app | sigco3111/BuildingGeneratorThreeJS |
| 7 | https://grasssystemthreejs.vercel.app | sigco3111/GrassSystemThreeJS |
| 8 | https://rainsystemthreejs.vercel.app | sigco3111/RainSystemThreeJS |
| 9 | https://sigco3111.github.io/SnowSystemThreeJS/ | sigco3111/SnowSystemThreeJS |
| 10 | https://sigco3111.github.io/OceanThreejs/ | sigco3111/OceanThreejs |
| 11 | https://sigco3111.github.io/NameWriterThreeJS/ | sigco3111/NameWriterThreeJS |
| 12 | **https://sigco3111.github.io/EarthThreeJS/** ← 본 저장소 |

모두 동일한 풀폴드 + 풀 한글화 + Vite + i18n.js 패턴을 공유합니다.

---

## 📜 라이선스

원본 저장소와 동일 — **Apache License 2.0** ([LICENSE](./LICENSE) 참조).

원본 저작권: © achrefelouafi
한국어 fork 및 i18n.ts 추가: © sigco3111
