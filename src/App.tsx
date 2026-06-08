import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { EarthScene } from './components/EarthScene';
import { ControlPanel } from './components/ControlPanel';
import './App.css';

function App() {
  // Earth params
  const [cloudSpeed, setCloudSpeed] = useState(0.0003);
  const [cloudOpacity, setCloudOpacity] = useState(0.65);
  const [atmosphereOpacity, setAtmosphereOpacity] = useState(0.7);
  const [atmosphereFresnel, setAtmosphereFresnel] = useState(3.5);
  const [atmosphereIntensity, setAtmosphereIntensity] = useState(1.8);
  const [atmosphereColor, setAtmosphereColor] = useState('#4a9eff');

  // Lighting
  const [dayNightProgress, setDayNightProgress] = useState(0.0);
  const [sunIntensity, setSunIntensity] = useState(2.0);
  const [sunColor, setSunColor] = useState('#fff5e6');
  const [sunSize, setSunSize] = useState(15.0);

  // Post-processing
  const [bloomIntensity, setBloomIntensity] = useState(1.5);
  const [bloomThreshold, setBloomThreshold] = useState(0.3);
  const [bloomRadius, setBloomRadius] = useState(0.6);
  const [chromaticAberration, setChromaticAberration] = useState(0.001);
  const [vignetteIntensity, setVignetteIntensity] = useState(0.7);

  // Cinematic
  const [cinematicMode, setCinematicMode] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [showTitle, setShowTitle] = useState(true);

  const handlePathChange = useCallback((name: string) => {
    setCurrentPath(name);
  }, []);

  const handleCinematicEnd = useCallback(() => {
    setCinematicMode(false);
    setCurrentPath('');
  }, []);

  const handleStart = useCallback(() => {
    setShowTitle(false);
  }, []);

  return (
    <div className="app">
      <Canvas
        camera={{
          position: [0, 0.5, 2.8],
          fov: 55,
          near: 0.1,
          far: 300,
        }}
        gl={{
          antialias: true,
          toneMapping: 3, // ACESFilmicToneMapping for cinematic look
          toneMappingExposure: 1.0,
          alpha: false,
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#000005']} />
        <EarthScene
          cloudSpeed={cloudSpeed}
          cloudOpacity={cloudOpacity}
          atmosphereOpacity={atmosphereOpacity}
          atmosphereFresnel={atmosphereFresnel}
          atmosphereIntensity={atmosphereIntensity}
          atmosphereColor={atmosphereColor}
          dayNightProgress={dayNightProgress}
          sunIntensity={sunIntensity}
          sunColor={sunColor}
          sunSize={sunSize}
          bloomIntensity={bloomIntensity}
          bloomThreshold={bloomThreshold}
          bloomRadius={bloomRadius}
          chromaticAberration={chromaticAberration}
          vignetteIntensity={vignetteIntensity}
          cinematicMode={cinematicMode}
          onPathChange={handlePathChange}
          onCinematicEnd={handleCinematicEnd}
          setDayNightProgress={setDayNightProgress}
        />
      </Canvas>

      {/* Title Screen Overlay */}
      {showTitle && (
        <div className="title-overlay">
          <div className="title-content">
            <h1 className="title-main">
              <span className="title-the">The</span>
              <span className="title-earth">Earth</span>
            </h1>
            <p className="title-subtitle">An Interactive Planetary Visualization</p>
            <p className="title-tech">Built with Three.js • React • Custom GLSL Shaders</p>
            <button className="title-button" onClick={handleStart}>
              <span className="button-glow" />
              <span className="button-text">Explore Our World</span>
            </button>
          </div>
          <div className="title-stats">
            <div className="stat">
              <span className="stat-value">12,742</span>
              <span className="stat-label">Diameter (km)</span>
            </div>
            <div className="stat">
              <span className="stat-value">4.5B</span>
              <span className="stat-label">Years Old</span>
            </div>
            <div className="stat">
              <span className="stat-value">8B+</span>
              <span className="stat-label">Inhabitants</span>
            </div>
          </div>
        </div>
      )}

      {/* Cinematic Overlay */}
      {cinematicMode && (
        <div className="cinematic-overlay">
          <div className="cinematic-bars">
            <div className="cinematic-bar top" />
            <div className="cinematic-bar bottom" />
          </div>
          {currentPath && (
            <div className="cinematic-info">
              <span className="cinematic-label">CINEMATIC</span>
              <span className="cinematic-path-name">{currentPath}</span>
            </div>
          )}
        </div>
      )}

      {/* Control Panel */}
      {!showTitle && (
        <ControlPanel
          cloudSpeed={cloudSpeed}
          setCloudSpeed={setCloudSpeed}
          cloudOpacity={cloudOpacity}
          setCloudOpacity={setCloudOpacity}
          atmosphereOpacity={atmosphereOpacity}
          setAtmosphereOpacity={setAtmosphereOpacity}
          atmosphereFresnel={atmosphereFresnel}
          setAtmosphereFresnel={setAtmosphereFresnel}
          atmosphereIntensity={atmosphereIntensity}
          setAtmosphereIntensity={setAtmosphereIntensity}
          atmosphereColor={atmosphereColor}
          setAtmosphereColor={setAtmosphereColor}
          dayNightProgress={dayNightProgress}
          setDayNightProgress={setDayNightProgress}
          sunIntensity={sunIntensity}
          setSunIntensity={setSunIntensity}
          sunColor={sunColor}
          setSunColor={setSunColor}
          sunSize={sunSize}
          setSunSize={setSunSize}
          bloomIntensity={bloomIntensity}
          setBloomIntensity={setBloomIntensity}
          bloomThreshold={bloomThreshold}
          setBloomThreshold={setBloomThreshold}
          bloomRadius={bloomRadius}
          setBloomRadius={setBloomRadius}
          chromaticAberration={chromaticAberration}
          setChromaticAberration={setChromaticAberration}
          vignetteIntensity={vignetteIntensity}
          setVignetteIntensity={setVignetteIntensity}
          cinematicMode={cinematicMode}
          setCinematicMode={setCinematicMode}
          currentPath={currentPath}
        />
      )}

      {/* Watermark */}
      {!showTitle && (
        <div className="watermark">
          <span className="watermark-text">Earth</span>
          <span className="watermark-dot">•</span>
          <span className="watermark-tech">Three.js</span>
        </div>
      )}
    </div>
  );
}

export default App;
