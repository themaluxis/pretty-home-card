# Pretty Home Card

A Home Assistant Lovelace custom card that combines the best of two worlds:

- **[clock-weather-card](https://github.com/pkissling/clock-weather-card)** layout — clock, date, and iOS-style multi-day forecast with temperature range bars
- **[atmospheric-weather-card](https://github.com/shpongledsummer/atmospheric-weather-card)** animations — canvas-based dynamic sky, rain, snow, clouds, birds, lightning, and day/night transitions

> Single JS file, no build step, no dependencies. Works with any weather integration.

![alt text]([http://url/to/img.png](http://github.com/themaluxis/pretty-home-card/blob/main/image.png?raw=true))


---

## Features

- **Animated sky background** — dynamic gradients that change based on weather condition and day/night cycle
- **Canvas particle system** — procedurally generated rain, snow, drifting clouds, fog banks, birds, twinkling stars, and lightning flashes
- **Real-time wind influence** — particle speed and drift respond to your weather entity's `wind_speed`
- **iOS-style forecast bars** — color-coded temperature range bars with global min/max scaling and current temp dot indicator
- **Live clock & date** — configurable 12h/24h format, locale-aware date formatting
- **Weather details row** — humidity, wind, pressure, visibility
- **Day/night detection** — reads `sun.sun` entity for accurate sky gradients
- **Modern HA API** — uses `weather/subscribe_forecast` (HA 2023.9+) with automatic attribute fallback
- **HACS compatible** — install in seconds via the Home Assistant Community Store

---

## Installation

### HACS (Recommended)

1. Open **HACS** → **Frontend** → **⋮** (top-right) → **Custom repositories**
2. Add the repository URL and select category **Dashboard**
3. Click **Install**
4. Refresh your browser (hard refresh: `Ctrl+Shift+R`)

### Manual

1. Download `atmospheric-clock-weather-card.js` from the [latest release](https://github.com/your-username/atmospheric-clock-weather-card/releases)
2. Place it in your `config/www/` folder
3. Go to **Settings → Dashboards → ⋮ → Resources**
4. Add resource:
   - **URL:** `/local/atmospheric-clock-weather-card.js`
   - **Type:** JavaScript Module
5. Hard-refresh your browser

---

## Configuration

Add the card to your dashboard via YAML:

```yaml
type: custom:atmospheric-clock-weather-card
entity: weather.home
```

### Full Configuration

```yaml
type: custom:atmospheric-clock-weather-card
entity: weather.home              # Required: your weather entity
sun_entity: sun.sun               # Day/night detection (default: sun.sun)
apparent_temp_entity: sensor.apparent_temperature  # Optional: "feels like" sensor
forecast_rows: 5                  # Number of forecast rows (default: 5)
forecast_type: daily              # 'daily' or 'hourly' (default: daily)
show_clock: true                  # Show clock section (default: true)
show_details: true                # Show humidity/wind/pressure row (default: true)
show_forecast: true               # Show forecast bars (default: true)
animated_background: true         # Enable particle animations (default: true)
locale: en-US                     # Locale for date/time formatting (default: HA locale)
time_format: 24h                  # '12h' or '24h' (default: 24h)
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | **Required** | Weather entity ID (e.g., `weather.home`) |
| `sun_entity` | string | `sun.sun` | Sun entity for day/night detection |
| `apparent_temp_entity` | string | `''` | Sensor entity for "feels like" temperature |
| `forecast_rows` | number | `5` | Number of forecast rows to display (1-7) |
| `forecast_type` | string | `daily` | Forecast type: `daily` or `hourly` |
| `show_clock` | boolean | `true` | Show the clock and date section |
| `show_details` | boolean | `true` | Show the weather details row |
| `show_forecast` | boolean | `true` | Show the forecast section |
| `animated_background` | boolean | `true` | Enable animated sky and particles |
| `locale` | string | HA locale | Language/locale for formatting |
| `time_format` | string | `24h` | Time format: `12h` or `24h` |

---

## Supported Weather Conditions

The card maps all standard Home Assistant weather states to visual effects:

| HA State | Sky | Particles |
|----------|-----|-----------|
| `sunny` | Blue sky gradient | Birds, drifting clouds |
| `clear-night` | Deep night sky | Stars, sparse clouds |
| `partlycloudy` | Soft blue | Moderate clouds, birds |
| `cloudy` | Gray overcast | Dense clouds |
| `fog` | Muted gray | Fog banks, clouds |
| `rainy` | Dark blue-gray | Rain drops, clouds |
| `pouring` | Very dark | Heavy rain, dense clouds |
| `snowy` / `snowy-rainy` | Cool gray | Snowflakes, clouds |
| `lightning` / `lightning-rainy` | Dark storm | Rain, lightning flashes, clouds |
| `windy` / `windy-variant` | Brisk blue | Fast clouds, birds |

---

## How the Forecast Bars Work

The iOS-style bars show the temperature range for each day at a glance:

- The **full track** spans from the global min to global max across all visible forecast days
- The **colored fill** shows that day's low→high range, with color transitioning from blue (cold) to orange (warm)
- The **white dot** on the first row indicates the current temperature position

---

## Requirements

- Home Assistant **2023.9+** (for `weather/subscribe_forecast` API)
- A weather integration (e.g., Open-Meteo, OpenWeatherMap, Met.no)
- The `sun.sun` integration enabled (for day/night detection)

---

## Credits

Inspired by:
- [pkissling/clock-weather-card](https://github.com/pkissling/clock-weather-card) — layout and forecast bar concept
- [shpongledsummer/atmospheric-weather-card](https://github.com/shpongledsummer/atmospheric-weather-card) — animation and atmospheric effects concept

---

## License

MIT
