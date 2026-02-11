/**
 * Pretty Home Card
 * A Home Assistant Lovelace custom card combining:
 *  - clock-weather-card layout (time, date, iOS-style forecast bars)
 *  - canvas particle weather animations (rain, snow, clouds, fog, birds, stars, lightning)
 *
 * Version: 1.0.0
 * License: MIT
 */

const CARD_VERSION = '1.0.2';

// ─── HA Weather State → Internal Condition Mapping ──────────────────────
const CONDITION_MAP = {
  'sunny':            'sunny',
  'clear-night':      'clear-night',
  'partlycloudy':     'partly-cloudy',
  'cloudy':           'cloudy',
  'fog':              'foggy',
  'rainy':            'rainy',
  'pouring':          'pouring',
  'snowy':            'snowy',
  'snowy-rainy':      'snowy',
  'hail':             'rainy',
  'lightning':        'stormy',
  'lightning-rainy':  'stormy',
  'windy':            'windy',
  'windy-variant':    'windy',
  'exceptional':      'cloudy',
};

// ─── Sky Gradient Palettes ──────────────────────────────────────────────
const SKY_GRADIENTS = {
  'sunny':        { day: 'linear-gradient(180deg, #1a8fe3 0%, #56b4f5 35%, #87ceeb 60%, #c5e8f7 100%)',
                    night: 'linear-gradient(180deg, #0a1628 0%, #112240 40%, #1a3055 70%, #243b5e 100%)' },
  'clear-night':  { day: 'linear-gradient(180deg, #1a8fe3 0%, #56b4f5 35%, #87ceeb 60%, #c5e8f7 100%)',
                    night: 'linear-gradient(180deg, #060d1f 0%, #0d1a35 35%, #152545 65%, #1d3050 100%)' },
  'partly-cloudy':{ day: 'linear-gradient(180deg, #3a7cc0 0%, #6da3d4 35%, #a1c5de 65%, #d0e3ef 100%)',
                    night: 'linear-gradient(180deg, #0e1a2e 0%, #1a2d48 40%, #253d55 70%, #304a60 100%)' },
  'cloudy':       { day: 'linear-gradient(180deg, #5a6a7a 0%, #7a8d9e 35%, #9aabba 65%, #bcc8d1 100%)',
                    night: 'linear-gradient(180deg, #151b25 0%, #1e2835 40%, #283545 70%, #354050 100%)' },
  'foggy':        { day: 'linear-gradient(180deg, #7a8590 0%, #95a0aa 35%, #b0bac2 65%, #cdd5db 100%)',
                    night: 'linear-gradient(180deg, #181c22 0%, #22282f 40%, #2e353d 70%, #3a424a 100%)' },
  'rainy':        { day: 'linear-gradient(180deg, #2d3a4a 0%, #455565 30%, #607080 60%, #8090a0 100%)',
                    night: 'linear-gradient(180deg, #0a0f18 0%, #141c28 35%, #1e2835 65%, #283542 100%)' },
  'pouring':      { day: 'linear-gradient(180deg, #1e2832 0%, #354555 30%, #4a5a6a 60%, #607078 100%)',
                    night: 'linear-gradient(180deg, #060a10 0%, #0e151e 35%, #161f2a 65%, #1e2835 100%)' },
  'snowy':        { day: 'linear-gradient(180deg, #6a7a8a 0%, #8a9aaa 35%, #b0bfc9 65%, #d8e2ea 100%)',
                    night: 'linear-gradient(180deg, #141822 0%, #1e2430 40%, #283040 70%, #323c4a 100%)' },
  'stormy':       { day: 'linear-gradient(180deg, #1a1e2e 0%, #2a3040 30%, #3d4555 60%, #556070 100%)',
                    night: 'linear-gradient(180deg, #050810 0%, #0c1018 35%, #141820 65%, #1c2028 100%)' },
  'windy':        { day: 'linear-gradient(180deg, #2a6aaa 0%, #4a8ac5 35%, #70a5d5 65%, #a0c5e5 100%)',
                    night: 'linear-gradient(180deg, #0a1525 0%, #142035 40%, #1e3050 70%, #283a55 100%)' },
};

// ─── Condition Icons (MDI icon names used by HA) ────────────────────────
const CONDITION_ICONS = {
  'sunny':        'mdi:weather-sunny',
  'clear-night':  'mdi:weather-night',
  'partly-cloudy':'mdi:weather-partly-cloudy',
  'cloudy':       'mdi:weather-cloudy',
  'foggy':        'mdi:weather-fog',
  'rainy':        'mdi:weather-rainy',
  'pouring':      'mdi:weather-pouring',
  'snowy':        'mdi:weather-snowy',
  'stormy':       'mdi:weather-lightning',
  'windy':        'mdi:weather-windy',
};

// ─── Translations ──────────────────────────────────────────────────────
const TRANSLATIONS = {
  'en': {
    'Humidity': 'Humidity',
    'Wind': 'Wind',
    'Pressure': 'Pressure',
    'Visibility': 'Visibility',
    'Feels': 'Feels like',
    'Today': 'Today',
  },
  'fr': {
    'Humidity': 'Humidité',
    'Wind': 'Vent',
    'Pressure': 'Pression',
    'Visibility': 'Visibilité',
    'Feels': 'Ressenti',
    'Today': 'Auj.',
  },
  'de': {
    'Humidity': 'Feuchtigkeit',
    'Wind': 'Wind',
    'Pressure': 'Druck',
    'Visibility': 'Sicht',
    'Feels': 'Gefühlt',
    'Today': 'Heute',
  },
  'es': {
    'Humidity': 'Humedad',
    'Wind': 'Viento',
    'Pressure': 'Presión',
    'Visibility': 'Visibilidad',
    'Feels': 'Sensación',
    'Today': 'Hoy',
  },
  'it': {
    'Humidity': 'Umidità',
    'Wind': 'Vento',
    'Pressure': 'Pressione',
    'Visibility': 'Visibilità',
    'Feels': 'Percepito',
    'Today': 'Oggi',
  },
  'nl': {
    'Humidity': 'Vochtigheid',
    'Wind': 'Wind',
    'Pressure': 'Druk',
    'Visibility': 'Zicht',
    'Feels': 'Voelt als',
    'Today': 'Vandaag',
  },
  'ru': {
    'Humidity': 'Влажность',
    'Wind': 'Ветер',
    'Pressure': 'Давление',
    'Visibility': 'Видимость',
    'Feels': 'Ощущается',
    'Today': 'Сегодня',
  },
};

// ─── Particle System ────────────────────────────────────────────────────
class ParticleEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.clouds = [];
    this.stars = [];
    this.birds = [];
    this.fogBanks = [];
    this.condition = 'sunny';
    this._lastCondition = null;
    this._lastIsNight = null;
    this.isNight = false;
    this.windSpeed = 0;
    this._targetWindSpeed = 0;
    this.animFrame = null;
    this.lastTime = 0;
    this._initialized = false;
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const oldW = this.w || 0;
    const oldH = this.h || 0;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = rect.width;
    this.h = rect.height;

    // Rescale existing particle positions (only X) to prevent squashing/reloading effect
    if (oldW > 0 && oldH > 0 && (oldW !== this.w || oldH !== this.h)) {
      const sx = this.w / oldW;
      // Note: We intentionally do NOT scale Y (sy) or dimensions (w/h/r) to keep the scene stable during collapse
      this.stars.forEach(s => { s.x *= sx; });
      this.clouds.forEach(c => { c.x *= sx; });
      this.particles.forEach(p => { p.x *= sx; });
      this.fogBanks.forEach(f => { f.x *= sx; });
      this.birds.forEach(b => { b.x *= sx; });
    }

    // Fix: If particles were never initialized (e.g. created before layout), init now
    if (this.w > 0 && this.h > 0 && !this._initialized) {
      this._initParticles();
    }
  }

  setCondition(condition, isNight, windSpeed) {
    this._targetWindSpeed = windSpeed || 0;
    const conditionChanged = condition !== this._lastCondition;
    const nightChanged = isNight !== this._lastIsNight;
    this.condition = condition;
    this.isNight = isNight;

    // Only reinitialize particles when condition or day/night actually changes
    if (conditionChanged || nightChanged) {
      this._lastCondition = condition;
      this._lastIsNight = isNight;
      this.windSpeed = this._targetWindSpeed;
      this._initParticles();
    }
  }

  _initParticles() {
    const w = this.w, h = this.h;
    if (!w || !h) return;

    const windFactor = Math.min(this.windSpeed / 30, 1);

    // Stars
    this.stars = Array.from({ length: 50 }, () => ({
      x: Math.random() * w, y: Math.random() * h * 0.55,
      r: Math.random() * 1.5 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
    }));

    // Clouds
    const cloudDensity = {
      'sunny': 2, 'clear-night': 1, 'partly-cloudy': 3, 'cloudy': 6,
      'foggy': 4, 'rainy': 5, 'pouring': 7, 'snowy': 4,
      'stormy': 7, 'windy': 4,
    };
    const count = cloudDensity[this.condition] || 3;
    this.clouds = Array.from({ length: count }, () => {
      const wCloud = Math.random() * 110 + 70;
      const hCloud = Math.random() * 25 + 15;
      const puffs = Array.from({ length: Math.floor(Math.random() * 3) + 5 }, () => ({
        dx: (Math.random() - 0.5) * wCloud,
        dy: (Math.random() - 0.5) * hCloud * 0.6,
        r: Math.random() * 15 + 10,
      }));
      return {
        x: Math.random() * w * 1.5 - w * 0.25,
        y: Math.random() * h * 0.35 + 5,
        w: wCloud,
        h: hCloud,
        puffs,
        speed: (Math.random() * 0.3 + 0.1) * (1 + windFactor),
        opacity: Math.random() * 0.2 + (['rainy','pouring','stormy','cloudy','foggy'].includes(this.condition) ? 0.3 : 0.12),
      };
    });

    // Rain
    if (['rainy', 'pouring', 'stormy'].includes(this.condition)) {
      const dropCount = this.condition === 'pouring' ? 200 : this.condition === 'stormy' ? 160 : 90;
      this.particles = Array.from({ length: dropCount }, () => ({
        type: 'rain',
        x: Math.random() * w * 1.2, y: Math.random() * h,
        len: Math.random() * 18 + 8,
        speed: Math.random() * 5 + 7 + windFactor * 4,
        drift: (Math.random() * 1.5 - 0.3) + windFactor * 2,
        opacity: Math.random() * 0.25 + 0.12,
      }));
    }
    // Snow
    else if (this.condition === 'snowy') {
      this.particles = Array.from({ length: 55 }, () => ({
        type: 'snow',
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 2.5 + 1,
        speed: Math.random() * 0.8 + 0.4,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.03 + 0.01,
        opacity: Math.random() * 0.5 + 0.3,
      }));
    } else {
      this.particles = [];
    }

    // Fog banks
    if (this.condition === 'foggy') {
      this.fogBanks = Array.from({ length: 4 }, () => ({
        x: Math.random() * w * 2 - w * 0.5,
        y: h * 0.3 + Math.random() * h * 0.5,
        w: Math.random() * 200 + 150,
        h: Math.random() * 40 + 20,
        speed: Math.random() * 0.15 + 0.05,
        opacity: Math.random() * 0.15 + 0.08,
      }));
    } else {
      this.fogBanks = [];
    }

    // Birds (daytime clear-ish weather)
    if (!this.isNight && ['sunny', 'partly-cloudy', 'windy'].includes(this.condition)) {
      this.birds = Array.from({ length: 3 }, () => ({
        x: -30 - Math.random() * 120,
        y: Math.random() * h * 0.25 + 15,
        speed: Math.random() * 0.5 + 0.3 + windFactor * 0.5,
        wing: Math.random() * Math.PI * 2,
        wingSpeed: Math.random() * 0.07 + 0.04,
      }));
    } else {
      this.birds = [];
    }

    this._initialized = true;
  }

  start() {
    if (this.animFrame) return;
    this.lastTime = 0;
    const loop = (ts) => {
      this._draw(ts);
      this.animFrame = requestAnimationFrame(loop);
    };
    this.animFrame = requestAnimationFrame(loop);
  }

  stop() {
    if (this.animFrame) {
      cancelAnimationFrame(this.animFrame);
      this.animFrame = null;
    }
  }

  _draw(ts) {
    const ctx = this.ctx, w = this.w, h = this.h;
    if (!w || !h) return;

    // Delta-time calculation normalized to 60fps (16.67ms per frame)
    if (!this.lastTime) this.lastTime = ts;
    const rawDt = ts - this.lastTime;
    this.lastTime = ts;
    // Cap dt to prevent huge jumps after tab switch or long pause (max ~3 frames)
    const dt = Math.min(rawDt, 50) / 16.667;

    // Smoothly interpolate wind speed toward target
    this.windSpeed += (this._targetWindSpeed - this.windSpeed) * 0.02 * dt;

    ctx.clearRect(0, 0, w, h);

    // Stars (visible when night or stormy)
    const starAlphaBase = this.isNight ? 0.6 :
      ['stormy','pouring'].includes(this.condition) ? 0.15 : 0.0;
    if (starAlphaBase > 0) {
      this.stars.forEach(s => {
        s.twinkle += s.speed * dt;
        const alpha = (Math.sin(s.twinkle) * 0.5 + 0.5) * starAlphaBase;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Clouds
    this.clouds.forEach(c => {
      c.x += c.speed * dt;
      // Wrap around
      if (c.x > w + c.w) {
        c.x = -c.w * 1.5;
        c.y = Math.random() * h * 0.35 + 5;
      }

      const cloudColor = this.isNight ? `rgba(60,70,90,${c.opacity})` : `rgba(255,255,255,${c.opacity})`;
      ctx.fillStyle = cloudColor;

      // Draw fluffy cloud puffs
      ctx.beginPath();
      c.puffs.forEach(p => {
        ctx.moveTo(c.x + p.dx + p.r, c.y + p.dy);
        ctx.arc(c.x + p.dx, c.y + p.dy, p.r, 0, Math.PI * 2);
      });
      ctx.fill();
    });

    // Fog banks
    this.fogBanks.forEach(f => {
      f.x += f.speed * dt;
      if (f.x > w + f.w) { f.x = -f.w * 1.5; }
      const fogColor = this.isNight ? `rgba(40,45,55,${f.opacity})` : `rgba(220,225,230,${f.opacity})`;
      ctx.fillStyle = fogColor;
      ctx.beginPath();
      ctx.ellipse(f.x, f.y, f.w, f.h, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Rain drops
    this.particles.forEach(p => {
      if (p.type === 'rain') {
        p.y += p.speed * dt;
        p.x += p.drift * dt;
        if (p.y > h) { p.y = -p.len; p.x = Math.random() * w * 1.2; }
        ctx.strokeStyle = `rgba(180,210,240,${p.opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.drift * 2, p.y + p.len);
        ctx.stroke();
      } else if (p.type === 'snow') {
        p.y += p.speed * dt;
        p.wobble += p.wobbleSpeed * dt;
        p.x += Math.sin(p.wobble) * 0.5 * dt;
        if (p.y > h) { p.y = -5; p.x = Math.random() * w; }
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Birds
    this.birds.forEach(b => {
      b.x += b.speed * dt;
      b.wing += b.wingSpeed * dt;
      if (b.x > w + 30) { b.x = -30; b.y = Math.random() * h * 0.25 + 15; }
      const wingY = Math.sin(b.wing) * 3.5;
      ctx.strokeStyle = this.isNight ? 'rgba(180,180,200,0.25)' : 'rgba(40,40,50,0.3)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(b.x - 5, b.y + wingY);
      ctx.quadraticCurveTo(b.x - 2, b.y - 2 + wingY * 0.5, b.x, b.y);
      ctx.quadraticCurveTo(b.x + 2, b.y - 2 + wingY * 0.5, b.x + 5, b.y + wingY);
      ctx.stroke();
    });

    // Lightning flash (random for stormy, dt-normalized probability)
    if (this.condition === 'stormy' && Math.random() < 0.003 * dt) {
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fillRect(0, 0, w, h);
    }
  }
}

// ─── Main Card Element ──────────────────────────────────────────────────
class PrettyHomeCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass = null;
    this._config = {};
    this._forecast = [];
    this._forecastUnsub = null;
    this._clockInterval = null;
    this._particleEngine = null;
    this._resizeObserver = null;
    this._rendered = false;
    this._isForecastCollapsed = true;
  }

  // ── HA Interface ────────────────────────────────────────────────────
  static getConfigElement() {
    // Visual editor not yet implemented — YAML only for now
    return undefined;
  }

  static getStubConfig() {
    return {
      entity: 'weather.home',
      forecast_rows: 5,
      forecast_type: 'daily',
      show_clock: true,
      show_details: true,
      show_forecast: true,
      locale: '',
      time_format: '24h',
      animated_background: true,
    };
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('Please define a weather entity (entity: weather.your_entity)');
    }
    this._config = {
      entity: config.entity,
      sun_entity: config.sun_entity || 'sun.sun',
      apparent_temp_entity: config.apparent_temp_entity || '',
      forecast_rows: config.forecast_rows ?? 5,
      forecast_type: config.forecast_type || 'daily',
      show_clock: config.show_clock !== false,
      show_details: config.show_details !== false,
      show_forecast: config.show_forecast !== false,
      animated_background: config.animated_background !== false,
      locale: config.locale || '',
      time_format: config.time_format || '24h',
      date_pattern: config.date_pattern || '',
    };

    // If already connected, re-subscribe
    if (this._hass) {
      this._subscribeForecast();
    }
  }

  set hass(hass) {
    const oldHass = this._hass;
    this._hass = hass;

    if (!this._rendered) {
      this._render();
      this._rendered = true;
    }

    // Subscribe to forecast on first hass or entity change
    if (!oldHass || oldHass.states[this._config.entity] !== hass.states[this._config.entity]) {
      this._subscribeForecast();
    }

    this._update();
  }

  getCardSize() {
    let size = 3; // base for clock + current weather
    if (this._config.show_details) size += 1;
    if (this._config.show_forecast) size += Math.min(this._config.forecast_rows, 6);
    return size;
  }

  connectedCallback() {
    // Start clock
    this._clockInterval = setInterval(() => this._updateClock(), 1000);
  }

  disconnectedCallback() {
    if (this._clockInterval) clearInterval(this._clockInterval);
    if (this._forecastUnsub) { this._forecastUnsub(); this._forecastUnsub = null; }
    if (this._particleEngine) this._particleEngine.stop();
    if (this._resizeObserver) this._resizeObserver.disconnect();
  }

  // ── Forecast Subscription (modern HA API) ───────────────────────────
  async _subscribeForecast() {
    if (this._forecastUnsub) {
      this._forecastUnsub();
      this._forecastUnsub = null;
    }
    if (!this._hass || !this._config.entity) return;

    try {
      this._forecastUnsub = await this._hass.connection.subscribeMessage(
        (msg) => {
          this._forecast = msg.forecast || [];
          this._updateForecast();
        },
        {
          type: 'weather/subscribe_forecast',
          forecast_type: this._config.forecast_type,
          entity_id: this._config.entity,
        }
      );
    } catch (e) {
      // Fallback: try reading forecast from attributes (older HA versions)
      console.warn('Pretty Home Card: forecast subscription failed, using attribute fallback', e);
      const entity = this._hass.states[this._config.entity];
      if (entity && entity.attributes.forecast) {
        this._forecast = entity.attributes.forecast;
        this._updateForecast();
      }
    }
  }

  // ── Render Card Structure ───────────────────────────────────────────
  _render() {
    const shadow = this.shadowRoot;
    shadow.innerHTML = `
      <style>${this._getStyles()}</style>
      <ha-card>
        <div class="card-container">
          <div class="sky-bg" id="skyBg"></div>
          <canvas class="particle-canvas" id="particleCanvas"></canvas>
          <div class="content">
            ${this._config.show_clock ? `
            <div class="top-section">
              <div class="clock-side">
                <div class="time" id="clockTime">--:--</div>
                <div class="date" id="clockDate"></div>
              </div>
              <div class="temp-side">
                <div class="current-temp" id="currentTemp">--°</div>
                <div class="current-desc" id="currentDesc"></div>
              </div>
            </div>
            ` : ''}
            ${this._config.show_details ? `
            <div class="details-row" id="detailsRow"></div>
            ` : ''}
            ${this._config.show_forecast ? `
            <div class="forecast-container collapsed" id="forecastContainer">
              <div class="forecast-header" id="forecastHeader">
                <ha-icon icon="mdi:chevron-down" id="forecastIcon"></ha-icon>
              </div>
              <div class="forecast-rows" id="forecastRows"></div>
            </div>
            ` : ''}
          </div>
        </div>
      </ha-card>
    `;

    // Setup forecast toggle
    if (this._config.show_forecast) {
      const header = shadow.getElementById('forecastHeader');
      if (header) {
        // Use bind to ensure 'this' refers to the component instance
        header.addEventListener('click', this._toggleForecast.bind(this));
      }
    }

    // Init particle engine
    if (this._config.animated_background) {
      const canvas = shadow.getElementById('particleCanvas');
      if (canvas) {
        this._particleEngine = new ParticleEngine(canvas);
        // Resize observer — only rescales canvas, does not reinit particles
        this._resizeObserver = new ResizeObserver(() => {
          this._particleEngine.resize();
          // Initialize particles if not yet done (first resize after creation)
          if (this._particleEngine._lastCondition === null) {
            const entity = this._hass?.states[this._config.entity];
            if (entity) {
              const cond = CONDITION_MAP[entity.state] || 'cloudy';
              const isNight = this._isNight();
              const wind = entity.attributes.wind_speed || 0;
              this._particleEngine.setCondition(cond, isNight, wind);
            }
          }
        });
        this._resizeObserver.observe(shadow.querySelector('.card-container'));
        this._particleEngine.start();
      }
    }
  }

  // ── Update Helpers ──────────────────────────────────────────────────
  _update() {
    if (!this._hass || !this._config.entity) return;
    const entity = this._hass.states[this._config.entity];
    if (!entity) return;

    const condition = CONDITION_MAP[entity.state] || 'cloudy';
    const isNight = this._isNight();
    const temp = entity.attributes.temperature;
    const windSpeed = entity.attributes.wind_speed;
    const description = this._localizeCondition(entity.state);

    // Apparent temperature from custom sensor
    let apparentTemp = null;
    if (this._config.apparent_temp_entity) {
      const atEntity = this._hass.states[this._config.apparent_temp_entity];
      if (atEntity) apparentTemp = parseFloat(atEntity.state);
    }

    // Update sky background
    const skyBg = this.shadowRoot.getElementById('skyBg');
    if (skyBg) {
      const gradients = SKY_GRADIENTS[condition] || SKY_GRADIENTS['cloudy'];
      skyBg.style.background = isNight ? gradients.night : gradients.day;
    }

    // Update particles (setCondition handles change detection internally)
    if (this._particleEngine) {
      this._particleEngine.setCondition(condition, isNight, windSpeed || 0);
    }

    // Update temperature display
    const tempEl = this.shadowRoot.getElementById('currentTemp');
    if (tempEl && temp !== undefined) {
      const unit = entity.attributes.temperature_unit || this._hass.config.unit_system?.temperature || '°C';
      tempEl.textContent = `${Math.round(temp)}${unit.includes('F') ? '°F' : '°'}`;
    }

    // Update description
    const descEl = this.shadowRoot.getElementById('currentDesc');
    if (descEl) {
      let desc = description;
      if (apparentTemp !== null) {
        desc = `${this._t('Feels')} ${Math.round(apparentTemp)}° · ${description}`;
      }
      descEl.textContent = desc;
    }

    // Update clock
    this._updateClock();

    // Update details row
    this._updateDetails(entity);

    // Update forecast if we have data
    if (this._forecast.length) this._updateForecast();
  }

  _updateClock() {
    const timeEl = this.shadowRoot?.getElementById('clockTime');
    const dateEl = this.shadowRoot?.getElementById('clockDate');
    if (!timeEl) return;

    const now = new Date();
    const locale = this._config.locale || this._hass?.locale?.language || navigator.language || 'en';

    // Time
    const is24h = this._config.time_format === '24h';
    const timeOpts = { hour: '2-digit', minute: '2-digit', hour12: !is24h };
    timeEl.textContent = now.toLocaleTimeString(locale, timeOpts);

    // Date
    if (dateEl) {
      if (this._config.date_pattern) {
        // Simple pattern support (basic)
        dateEl.textContent = now.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' });
      } else {
        dateEl.textContent = now.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' });
      }
    }
  }

  _updateDetails(entity) {
    const row = this.shadowRoot?.getElementById('detailsRow');
    if (!row) return;

    const attrs = entity.attributes;
    const windUnit = attrs.wind_speed_unit || 'km/h';
    const pressureUnit = attrs.pressure_unit || 'hPa';

    const details = [];
    if (attrs.humidity !== undefined)    details.push({ icon: 'mdi:water-percent', label: this._t('Humidity'), value: `${attrs.humidity}%` });
    if (attrs.wind_speed !== undefined)  details.push({ icon: 'mdi:weather-windy', label: this._t('Wind'), value: `${Math.round(attrs.wind_speed)} ${windUnit}` });
    if (attrs.pressure !== undefined)    details.push({ icon: 'mdi:gauge', label: this._t('Pressure'), value: `${Math.round(attrs.pressure)} ${pressureUnit}` });
    if (attrs.visibility !== undefined)  details.push({ icon: 'mdi:eye', label: this._t('Visibility'), value: `${attrs.visibility} km` });

    row.innerHTML = details.slice(0, 4).map(d => `
      <div class="detail-item">
        <ha-icon icon="${d.icon}" class="detail-icon"></ha-icon>
        <span class="detail-label">${d.label}</span>
        <span class="detail-value">${d.value}</span>
      </div>
    `).join('');
  }

  _toggleForecast() {
    this._isForecastCollapsed = !this._isForecastCollapsed;
    const container = this.shadowRoot.getElementById('forecastContainer');
    const icon = this.shadowRoot.getElementById('forecastIcon');

    if (container && icon) {
      if (this._isForecastCollapsed) {
        container.classList.add('collapsed');
        icon.setAttribute('icon', 'mdi:chevron-down');
      } else {
        container.classList.remove('collapsed');
        icon.setAttribute('icon', 'mdi:chevron-up');
      }
    }
  }

  _updateForecast() {
    const container = this.shadowRoot?.getElementById('forecastRows');
    if (!container || !this._forecast.length) return;

    const rows = this._config.forecast_rows;
    const isDaily = this._config.forecast_type === 'daily';
    const locale = this._config.locale || this._hass?.locale?.language || navigator.language || 'en';

    // Slice forecast to configured rows
    const items = this._forecast.slice(0, rows);

    // Compute global min/max for temp bar scaling
    let globalMin = Infinity, globalMax = -Infinity;
    items.forEach(f => {
      const low = parseFloat(f.templow ?? f.temperature);
      const high = parseFloat(f.temperature ?? f.templow);
      if (!isNaN(low) && low < globalMin) globalMin = low;
      if (!isNaN(high) && high > globalMax) globalMax = high;
    });

    const currentTemp = this._hass?.states[this._config.entity]?.attributes?.temperature;

    container.innerHTML = items.map((f, i) => {
      const dt = new Date(f.datetime);
      let label;
      if (isDaily) {
        const isToday = new Date().toDateString() === dt.toDateString();
        label = isToday ? this._t('Today') : dt.toLocaleDateString(locale, { weekday: 'short' });
      } else {
        label = dt.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false });
      }

      const rawLow = parseFloat(f.templow ?? f.temperature);
      const rawHigh = parseFloat(f.temperature ?? f.templow);
      const low = Math.round(rawLow);
      const high = Math.round(rawHigh);
      const condition = CONDITION_MAP[f.condition] || 'cloudy';
      const icon = CONDITION_ICONS[condition] || 'mdi:weather-cloudy';

      // Temperature bar calculation
      const range = globalMax - globalMin || 1;
      const leftPct = ((rawLow - globalMin) / range) * 100;
      const widthPct = ((rawHigh - rawLow) / range) * 100;

      // Color gradient endpoints
      const coldR = 70, coldG = 140, coldB = 220;
      const hotR = 255, hotG = 160, hotB = 40;
      const lowRatio = (low - globalMin) / range;
      const highRatio = (high - globalMin) / range;
      const lR = Math.round(coldR + lowRatio * (hotR - coldR));
      const lG = Math.round(coldG + lowRatio * (hotG - coldG));
      const lB = Math.round(coldB + lowRatio * (hotB - coldB));
      const hR = Math.round(coldR + highRatio * (hotR - coldR));
      const hG = Math.round(coldG + highRatio * (hotG - coldG));
      const hB = Math.round(coldB + highRatio * (hotB - coldB));

      // Current temp dot (only for first daily row)
      let dotHtml = '';
      if (i === 0 && isDaily && currentTemp !== null && currentTemp !== undefined) {
        const dotPct = ((currentTemp - globalMin) / range) * 100;
        dotHtml = `<div class="temp-dot" style="left: ${dotPct}%"></div>`;
      }

      return `
        <div class="forecast-row${i === 0 ? ' today' : ''}">
          <span class="forecast-day">${label}</span>
          <ha-icon icon="${icon}" class="forecast-icon"></ha-icon>
          <span class="forecast-low">${low}°</span>
          <div class="temp-bar-track">
            <div class="temp-bar-fill" style="
              left: ${leftPct}%;
              width: ${widthPct}%;
              background: linear-gradient(90deg, rgb(${lR},${lG},${lB}), rgb(${hR},${hG},${hB}));
              box-shadow: 0 0 6px rgba(${hR},${hG},${hB}, 0.3);
            "></div>
            ${dotHtml}
          </div>
          <span class="forecast-high">${high}°</span>
        </div>
      `;
    }).join('');
  }

  _isNight() {
    if (!this._hass) return false;
    const sun = this._hass.states[this._config.sun_entity];
    if (sun) return sun.state === 'below_horizon';
    // Fallback: check current hour
    const h = new Date().getHours();
    return h < 6 || h > 20;
  }

  _t(key) {
    const locale = this._config.locale || this._hass?.locale?.language || navigator.language || 'en';
    const lang = locale.toLowerCase().split(/[_-]/)[0];
    return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) || key;
  }

  _localizeCondition(state) {
    // Use HA's localization if available
    if (this._hass && this._hass.localize) {
      const localized = this._hass.localize(`component.weather.entity_component._.state.${state}`);
      if (localized) return localized;
    }
    // Fallback: prettify the state string
    return state.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // ── Styles ──────────────────────────────────────────────────────────
  _getStyles() {
    return `
      :host {
        display: block;
      }
      ha-card {
        overflow: hidden;
        border: none;
        background: none !important;
      }
      .card-container {
        position: relative;
        overflow: hidden;
        border-radius: var(--ha-card-border-radius, 12px);
      }
      .sky-bg {
        position: absolute;
        inset: 0;
        transition: background 1.5s ease;
        z-index: 0;
      }
      .particle-canvas {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 1;
      }
      .content {
        position: relative;
        z-index: 2;
        padding: 24px 24px 18px;
        font-family: var(--primary-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
      }

      /* ── Top Section: Clock + Current ── */
      .top-section {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2px;
      }
      .clock-side {
        flex: 1;
        min-width: 0;
      }
      .time {
        font-size: 52px;
        font-weight: 200;
        color: #fff;
        line-height: 1;
        letter-spacing: -1.5px;
        text-shadow: 0 2px 10px rgba(0,0,0,0.2);
      }
      .date {
        font-size: 13px;
        color: rgba(255,255,255,0.72);
        margin-top: 4px;
        font-weight: 400;
        letter-spacing: 0.2px;
      }
      .temp-side {
        text-align: right;
        flex-shrink: 0;
        margin-top: 2px;
      }
      .current-temp {
        font-size: 42px;
        font-weight: 200;
        color: #fff;
        line-height: 1;
        text-shadow: 0 2px 8px rgba(0,0,0,0.15);
      }
      .current-desc {
        font-size: 12.5px;
        color: rgba(255,255,255,0.68);
        margin-top: 4px;
      }

      /* ── Details Row ── */
      .details-row {
        display: flex;
        gap: 12px;
        margin-top: 14px;
        margin-bottom: 16px;
        padding-top: 12px;
        border-top: 1px solid rgba(255,255,255,0.1);
      }
      .detail-item {
        flex: 1;
        text-align: center;
      }
      .detail-icon {
        color: rgba(255,255,255,0.85);
        --mdc-icon-size: 22px;
        margin-bottom: 4px;
        display: block;
        margin-left: auto;
        margin-right: auto;
      }
      .detail-label {
        display: block;
        font-size: 10px;
        color: rgba(255,255,255,0.45);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 2px;
      }
      .detail-value {
        display: block;
        font-size: 14px;
        color: rgba(255,255,255,0.92);
        font-weight: 500;
      }

      /* ── Forecast Container ── */
      .forecast-container {
        background: rgba(0,0,0,0.14);
        border-radius: 14px;
        padding: 4px 14px 10px;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.05);
        transition: all 0.3s ease;
      }
      .forecast-container.collapsed {
        padding-bottom: 4px;
      }
      .forecast-container.collapsed .forecast-rows {
        display: none;
      }
      .forecast-header {
        text-align: center;
        cursor: pointer;
        padding-bottom: 4px;
        opacity: 0.6;
        transition: opacity 0.2s;
      }
      .forecast-header:hover {
        opacity: 1;
      }
      .forecast-row {
        display: grid;
        grid-template-columns: 46px 22px 34px 1fr 34px;
        align-items: center;
        gap: 8px;
        padding: 7px 0;
        border-bottom: 1px solid rgba(255,255,255,0.05);
      }
      .forecast-row:last-child {
        border-bottom: none;
      }
      .forecast-day {
        font-size: 12.5px;
        color: rgba(255,255,255,0.65);
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .forecast-row.today .forecast-day {
        color: #fff;
        font-weight: 600;
      }
      .forecast-icon {
        text-align: center;
        color: rgba(255,255,255,0.9);
        --mdc-icon-size: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .forecast-low {
        font-size: 12.5px;
        color: rgba(255,255,255,0.45);
        text-align: right;
        font-variant-numeric: tabular-nums;
      }
      .forecast-high {
        font-size: 12.5px;
        color: rgba(255,255,255,0.92);
        font-weight: 500;
        font-variant-numeric: tabular-nums;
      }

      /* ── Temperature Bar ── */
      .temp-bar-track {
        position: relative;
        height: 5px;
        border-radius: 3px;
        background: rgba(255,255,255,0.1);
      }
      .temp-bar-fill {
        position: absolute;
        top: 0;
        height: 100%;
        border-radius: 3px;
        transition: left 0.5s ease, width 0.5s ease;
      }
      .temp-dot {
        position: absolute;
        top: 50%;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: #fff;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 4px rgba(0,0,0,0.3), 0 0 8px rgba(255,255,255,0.4);
        border: 1.5px solid rgba(0,0,0,0.12);
        transition: left 0.5s ease;
      }
    `;
  }
}

// ─── Register Card ──────────────────────────────────────────────────────
customElements.define('pretty-home-card', PrettyHomeCard);

// Register in card picker
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'pretty-home-card',
  name: 'Pretty Home Card',
  description: 'A weather card with animated sky, clock, and iOS-style forecast bars.',
  preview: true,
  documentationURL: 'https://github.com/themaluxis/pretty-home-card',
});

console.info(
  `%c PRETTY-HOME-CARD %c v${CARD_VERSION} `,
  'color: #fff; background: #1a8fe3; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;',
  'color: #1a8fe3; background: #e8f4fd; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;'
);
