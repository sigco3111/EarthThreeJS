import { useState, useEffect, useCallback } from 'react';
import { CINEMATIC_PATHS } from './CinematicCamera';

interface ControlPanelProps {
  // Earth
  cloudSpeed: number;
  setCloudSpeed: (v: number) => void;
  cloudOpacity: number;
  setCloudOpacity: (v: number) => void;
  cloudDarkOpacity: number;
  setCloudDarkOpacity: (v: number) => void;
  atmosphereOpacity: number;
  setAtmosphereOpacity: (v: number) => void;
  atmosphereDarkOpacity: number;
  setAtmosphereDarkOpacity: (v: number) => void;
  atmosphereFresnel: number;
  setAtmosphereFresnel: (v: number) => void;
  atmosphereIntensity: number;
  setAtmosphereIntensity: (v: number) => void;
  atmosphereColor: string;
  setAtmosphereColor: (v: string) => void;
  // Lighting
  dayNightProgress: number;
  setDayNightProgress: (v: number) => void;
  sunIntensity: number;
  setSunIntensity: (v: number) => void;
  sunColor: string;
  setSunColor: (v: string) => void;
  sunSize: number;
  setSunSize: (v: number) => void;
  earthDarkSideBrightness: number;
  setEarthDarkSideBrightness: (v: number) => void;
  earthNightLights: number;
  setEarthNightLights: (v: number) => void;
  earthSpeed: number;
  setEarthSpeed: (v: number) => void;
  spaceColor: string;
  setSpaceColor: (v: string) => void;
  starsCount: number;
  setStarsCount: (v: number) => void;
  // Post-processing
  bloomIntensity: number;
  setBloomIntensity: (v: number) => void;
  bloomThreshold: number;
  setBloomThreshold: (v: number) => void;
  bloomRadius: number;
  setBloomRadius: (v: number) => void;
  chromaticAberration: number;
  setChromaticAberration: (v: number) => void;
  vignetteIntensity: number;
  setVignetteIntensity: (v: number) => void;
  // Cinematic
  cinematicMode: boolean;
  setCinematicMode: (v: boolean) => void;
  currentPath: string;
}

type TabId = 'earth' | 'effects' | 'camera';

export function ControlPanel(props: ControlPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('earth');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'h' || e.key === 'H') {
        if (e.target instanceof HTMLInputElement) return;
        setIsVisible(v => !v);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCinematicToggle = useCallback(() => {
    props.setCinematicMode(!props.cinematicMode);
  }, [props]);

  if (!isVisible) return null;

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'earth', label: 'Earth', icon: '🌍' },
    { id: 'effects', label: 'Effects', icon: '✨' },
    { id: 'camera', label: 'Camera', icon: '🎬' },
  ];

  return (
    <div className="control-panel" data-open={isOpen}>
      <div className="panel-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="panel-title">
          <span className="panel-icon">⚙</span>
          <span>Controls</span>
        </div>
        <button className="panel-toggle" aria-label="Toggle panel">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="panel-content">
          <div className="panel-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`panel-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTab === 'earth' && (
            <div className="tab-content">
              <div className="section-title">Time of Day</div>
              <SliderControl
                label="Day/Night"
                value={props.dayNightProgress}
                min={0}
                max={1}
                step={0.005}
                onChange={props.setDayNightProgress}
              />
              <SliderControl
                label="Sun Intensity"
                value={props.sunIntensity}
                min={0}
                max={5}
                step={0.1}
                onChange={props.setSunIntensity}
              />
              <SliderControl
                label="Sun Size"
                value={props.sunSize}
                min={2}
                max={40}
                step={1}
                onChange={props.setSunSize}
              />
              <SliderControl
                label="Earth Speed"
                value={props.earthSpeed}
                min={0}
                max={0.005}
                step={0.0001}
                onChange={props.setEarthSpeed}
                format={(v) => v.toFixed(4)}
              />
              <SliderControl
                label="Dark Side Vis."
                value={props.earthDarkSideBrightness}
                min={0}
                max={1}
                step={0.01}
                onChange={props.setEarthDarkSideBrightness}
                format={(v) => v.toFixed(2)}
              />
              <SliderControl
                label="Night Lights"
                value={props.earthNightLights}
                min={0}
                max={10}
                step={0.1}
                onChange={props.setEarthNightLights}
              />
              <div className="control-group">
                <div className="color-controls">
                  <ColorPicker label="Sun Color" value={props.sunColor} onChange={props.setSunColor} />
                </div>
              </div>

              <div className="control-divider" />
              <div className="section-title">Atmosphere / Ozone</div>
              <SliderControl
                label="Lit Opacity"
                value={props.atmosphereOpacity}
                min={0}
                max={1}
                step={0.05}
                onChange={props.setAtmosphereOpacity}
              />
              <SliderControl
                label="Dark Opacity"
                value={props.atmosphereDarkOpacity}
                min={0}
                max={1}
                step={0.05}
                onChange={props.setAtmosphereDarkOpacity}
              />
              <SliderControl
                label="Fresnel Power"
                value={props.atmosphereFresnel}
                min={0.5}
                max={8}
                step={0.1}
                onChange={props.setAtmosphereFresnel}
              />
              <SliderControl
                label="Glow Intensity"
                value={props.atmosphereIntensity}
                min={0}
                max={5}
                step={0.1}
                onChange={props.setAtmosphereIntensity}
              />
              <div className="control-group">
                <div className="color-controls">
                  <ColorPicker label="Atmos Color" value={props.atmosphereColor} onChange={props.setAtmosphereColor} />
                </div>
              </div>

              <div className="control-divider" />
              <div className="section-title">Clouds</div>
              <SliderControl
                label="Lit Opacity"
                value={props.cloudOpacity}
                min={0}
                max={1}
                step={0.05}
                onChange={props.setCloudOpacity}
              />
              <SliderControl
                label="Dark Opacity"
                value={props.cloudDarkOpacity}
                min={0}
                max={1}
                step={0.05}
                onChange={props.setCloudDarkOpacity}
              />
              <SliderControl
                label="Speed"
                value={props.cloudSpeed}
                min={0}
                max={0.005}
                step={0.0001}
                onChange={props.setCloudSpeed}
                format={(v) => v.toFixed(4)}
              />
            </div>
          )}

          {activeTab === 'effects' && (
            <div className="tab-content">
              <div className="section-title">Environment</div>
              <div className="control-group">
                <div className="color-controls">
                  <ColorPicker label="Space Color" value={props.spaceColor} onChange={props.setSpaceColor} />
                </div>
              </div>
              <SliderControl
                label="Stars Count"
                value={props.starsCount}
                min={0}
                max={20000}
                step={100}
                onChange={props.setStarsCount}
              />
              <div className="control-divider" />
              <div className="section-title">Bloom</div>
              <SliderControl
                label="Intensity"
                value={props.bloomIntensity}
                min={0}
                max={5}
                step={0.1}
                onChange={props.setBloomIntensity}
              />
              <SliderControl
                label="Threshold"
                value={props.bloomThreshold}
                min={0}
                max={2}
                step={0.05}
                onChange={props.setBloomThreshold}
              />
              <SliderControl
                label="Smoothing"
                value={props.bloomRadius}
                min={0}
                max={2}
                step={0.05}
                onChange={props.setBloomRadius}
              />

              <div className="control-divider" />
              <div className="section-title">Film Effects</div>
              <SliderControl
                label="Chromatic Aberration"
                value={props.chromaticAberration}
                min={0}
                max={0.01}
                step={0.0005}
                onChange={props.setChromaticAberration}
                format={(v) => v.toFixed(4)}
              />
              <SliderControl
                label="Vignette"
                value={props.vignetteIntensity}
                min={0}
                max={1.5}
                step={0.05}
                onChange={props.setVignetteIntensity}
              />
            </div>
          )}

          {activeTab === 'camera' && (
            <div className="tab-content">
              <button
                className={`cinematic-button ${props.cinematicMode ? 'active' : ''}`}
                onClick={handleCinematicToggle}
              >
                <span className="cinematic-icon">{props.cinematicMode ? '⏸' : '▶'}</span>
                <span>{props.cinematicMode ? 'Stop Cinematic' : 'Start Cinematic'}</span>
              </button>

              {props.cinematicMode && props.currentPath && (
                <div className="current-path">
                  <span className="path-label">Current Shot:</span>
                  <span className="path-name">{props.currentPath}</span>
                </div>
              )}

              <div className="camera-paths">
                <div className="section-title">Camera Paths</div>
                {CINEMATIC_PATHS.map((path, i) => (
                  <div key={i} className="path-item">
                    <span className="path-number">{String(i + 1).padStart(2, '0')}</span>
                    <span className="path-info">
                      <span className="path-name-small">{path.name}</span>
                      <span className="path-duration">{path.duration}s</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="control-divider" />
              <div className="camera-tip">
                <span className="tip-icon">💡</span>
                <span>Use mouse to orbit, scroll to zoom. Press <kbd>H</kbd> to hide controls.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SliderControl({
  label, value, min, max, step, onChange, format,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; format?: (v: number) => string;
}) {
  const displayValue = format ? format(value) : value % 1 === 0 ? value.toString() : value.toFixed(2);
  return (
    <div className="control-group">
      <div className="control-header">
        <label className="control-label">{label}</label>
        <span className="control-value">{displayValue}</span>
      </div>
      <input
        type="range"
        className="control-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

function ColorPicker({
  label, value, onChange,
}: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="color-picker">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="color-input"
      />
      <span className="color-label">{label}</span>
    </div>
  );
}
