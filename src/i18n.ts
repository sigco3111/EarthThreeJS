// ============================================================================
//  한국어 / English i18n — UI 문자열만 노출, 식별자는 절대 건드리지 않음
// ============================================================================

const KO = {
  // ---- 앱 / 타이틀 ----
  appTitle: '🌍 인터랙티브 지구 (한글판)',
  titleThe: 'The',
  titleEarth: 'Earth',
  titleSubtitle: '인터랙티브 행성 시각화',
  titleTech: 'Three.js • React • 커스텀 GLSL 셰이더로 제작',
  exploreButton: '지구 둘러보기',
  statDiameter: '지름 (km)',
  statAge: '나이',
  statInhabitants: '인구',

  // ---- 워터마크 ----
  watermark: '지구',
  watermarkTech: 'Three.js',

  // ---- 시네마틱 오버레이 ----
  cinematicLabel: '시네마틱',
  currentShot: '현재 샷',

  // ---- 컨트롤 패널 헤더 ----
  panelTitle: '컨트롤',
  togglePanel: '패널 토글',

  // ---- 탭 ----
  tabEarth: '지구',
  tabEffects: '효과',
  tabCamera: '카메라',

  // ---- Earth 탭: Time of Day ----
  sectionTimeOfDay: '시간대',
  dayNight: '낮/밤',
  sunIntensity: '태양 강도',
  sunSize: '태양 크기',
  earthSpeed: '지구 자전 속도',
  darkSideVis: '암면 가시성',
  nightLights: '야간 조명',
  sunColor: '태양 색상',

  // ---- Earth 탭: Atmosphere ----
  sectionAtmosphere: '대기 / 오존',
  atmosphereLitOpacity: '명면 불투명도',
  atmosphereDarkOpacity: '암면 불투명도',
  atmosphereFresnel: '프레넬 지수',
  atmosphereGlow: '광채 강도',
  atmosphereColor: '대기 색상',

  // ---- Earth 탭: Clouds ----
  sectionClouds: '구름',
  cloudLitOpacity: '명면 불투명도',
  cloudDarkOpacity: '암면 불투명도',
  cloudSpeed: '구름 속도',

  // ---- Effects 탭: Environment ----
  sectionEnvironment: '환경',
  spaceColor: '우주 색상',
  starsCount: '별 개수',

  // ---- Effects 탭: Bloom ----
  sectionBloom: '블룸',
  bloomIntensity: '강도',
  bloomThreshold: '임계값',
  bloomSmoothing: '부드러움',

  // ---- Effects 탭: Film Effects ----
  sectionFilmEffects: '필름 효과',
  chromaticAberration: '색수차',
  vignette: '비네트',

  // ---- Camera 탭 ----
  startCinematic: '시네마틱 시작',
  stopCinematic: '시네마틱 정지',
  currentShotLabel: '현재 샷:',
  cameraPaths: '카메라 경로',
  cameraTip: '마우스로 궤도 회전, 스크롤로 줌. <kbd>H</kbd> 키로 컨트롤 숨기기.',

  // ---- 섹션 타이틀 ----
  sectionEarth: '지구',
};

const EN = {
  appTitle: '🌍 The Earth (Korean fork)',
  titleThe: 'The',
  titleEarth: 'Earth',
  titleSubtitle: 'An Interactive Planetary Visualization',
  titleTech: 'Built with Three.js • React • Custom GLSL Shaders',
  exploreButton: 'Explore Our World',
  statDiameter: 'Diameter (km)',
  statAge: 'Years Old',
  statInhabitants: 'Inhabitants',

  watermark: 'Earth',
  watermarkTech: 'Three.js',

  cinematicLabel: 'CINEMATIC',
  currentShot: 'Current Shot',

  panelTitle: 'Controls',
  togglePanel: 'Toggle panel',

  tabEarth: 'Earth',
  tabEffects: 'Effects',
  tabCamera: 'Camera',

  sectionTimeOfDay: 'Time of Day',
  dayNight: 'Day/Night',
  sunIntensity: 'Sun Intensity',
  sunSize: 'Sun Size',
  earthSpeed: 'Earth Speed',
  darkSideVis: 'Dark Side Vis.',
  nightLights: 'Night Lights',
  sunColor: 'Sun Color',

  sectionAtmosphere: 'Atmosphere / Ozone',
  atmosphereLitOpacity: 'Lit Opacity',
  atmosphereDarkOpacity: 'Dark Opacity',
  atmosphereFresnel: 'Fresnel Power',
  atmosphereGlow: 'Glow Intensity',
  atmosphereColor: 'Atmos Color',

  sectionClouds: 'Clouds',
  cloudLitOpacity: 'Lit Opacity',
  cloudDarkOpacity: 'Dark Opacity',
  cloudSpeed: 'Speed',

  sectionEnvironment: 'Environment',
  spaceColor: 'Space Color',
  starsCount: 'Stars Count',

  sectionBloom: 'Bloom',
  bloomIntensity: 'Intensity',
  bloomThreshold: 'Threshold',
  bloomSmoothing: 'Smoothing',

  sectionFilmEffects: 'Film Effects',
  chromaticAberration: 'Chromatic Aberration',
  vignette: 'Vignette',

  startCinematic: 'Start Cinematic',
  stopCinematic: 'Stop Cinematic',
  currentShotLabel: 'Current Shot:',
  cameraPaths: 'Camera Paths',
  cameraTip: 'Use mouse to orbit, scroll to zoom. Press <kbd>H</kbd> to hide controls.',

  sectionEarth: 'Earth',
};

let current: typeof KO = KO;

export function setLanguage(lang: 'ko' | 'en'): void {
  current = lang === 'en' ? EN : KO;
}

export function t<K extends keyof typeof KO>(key: K): typeof KO[K] {
  const v = current[key];
  if (v !== undefined) return v;
  const e = (EN as any)[key];
  if (e !== undefined) return e;
  return (KO as any)[key];
}

export const L = {
  KO,
  EN,
  current: () => current,
};
