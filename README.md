# Smart Sensor Control System Documentation

## Overview
This project is a full-stack IoT solution for monitoring and controlling environmental parameters (temperature, humidity, soil moisture, and light) using ESP8266 NodeMCU, sensors, relays, an LCD display, and a mobile app. The system is powered by a 5V USB supply and communicates over WiFi with an Express.js backend and MongoDB database. The mobile app provides real-time monitoring, manual control, and threshold configuration.

---

## System Architecture

![System Architecture Diagram](./assets/images/architecture.png)

- **ESP8266 NodeMCU**: Reads data from sensors (DHT11, LDR, Soil), controls relays, and updates an LCD display. Communicates with the backend via WiFi.
- **Sensors**: DHT11 (temperature/humidity), LDR (light), Soil moisture sensor.
- **Relays**: Control outputs for fan, motor, bulb/heater, etc.
- **LCD Display**: Shows live sensor readings.
- **Power Supply**: 15W 5V USB.
- **Backend**: Express.js server with REST API, connected to MongoDB for data storage.
- **Frontend**: React Native mobile app (Expo) for user interaction.

---

## Backend (Express.js + MongoDB)
- **API Endpoints**:
  - `GET /api/v1/sensor` — Get the latest 20 sensor readings (temperature, humidity, soil moisture, lightDetected, timestamp, etc.)
  - `GET /api/v1/threshold` — Get current threshold values for temperature, humidity, soil moisture, and light control.
  - `POST /api/v1/threshold` — Update threshold values (used by the app's settings page).
- **CORS**: Configured to allow requests from the mobile app.
- **Database**: MongoDB stores all sensor readings and threshold settings.
- **Health Check**: `GET /health` returns `{ status: "OK" }`.

---

## ESP8266 NodeMCU Firmware
- Reads sensors and sends data to the backend via HTTP POST.
- Receives threshold values and control commands from the backend.
- Controls relays for fan, motor, and bulb/heater based on logic and thresholds.
- Updates LCD display with current readings.

---

## Mobile App (React Native + Expo)
- **Home/Status Page**: Shows current sensor values and device status (On/Off for each relay, with color coding).
- **Values Page**: Displays line charts for the latest 20 readings of temperature, humidity, and soil moisture. Tabs allow switching between charts. Layout adapts to portrait/landscape.
- **Settings Page**: Allows the user to adjust threshold values for temperature, humidity, soil moisture, and light control. Sliders and switches are used. Save/Cancel buttons appear only when changes are made.
- **Manual Control**: (If implemented) Allows toggling relays directly from the app.
- **Authentication**: (If implemented) Uses context for protected routes.
- **Global Context**: Provides sensor and threshold data throughout the app, with auto-refresh every 10 seconds.

---

## How It Works
1. **Sensors** collect environmental data and send it to the ESP8266.
2. **ESP8266** processes the data, updates the LCD, and sends readings to the backend.
3. **Backend** stores readings in MongoDB and provides REST API for the app.
4. **Mobile App** fetches sensor and threshold data, displays it, and allows user control.
5. **Thresholds** set in the app are sent to the backend and used by the ESP8266 to control relays.

---

## Setup Instructions

### Backend
1. Install dependencies:
   ```sh
   cd backend
   npm install
   ```
2. Configure MongoDB connection in `config/db.js` and environment variables in `.env`.
3. Start the server:
   ```sh
   npm start
   ```

### Frontend (Mobile App)
1. Install dependencies:
   ```sh
   cd frontend
   npm install
   ```
2. Start the Expo app:
   ```sh
   npx expo start
   ```
3. Make sure your device/emulator and PC are on the same WiFi network.
4. Update the API base URL in `frontend/context/GlobalContext.tsx` to your PC's local IP address.

### ESP8266 Firmware
- Flash the firmware with your WiFi credentials and backend API URL.
- Connect sensors, relays, and LCD as per the schematic.

---

## File Structure
- `backend/` — Express.js server, routes, controllers, models
- `frontend/` — React Native app (Expo), context, screens, assets
- `frontend/context/GlobalContext.tsx` — Central data provider for sensor and threshold data
- `frontend/app/(app)/(tabs)/values.tsx` — Line charts for sensor data
- `frontend/app/(app)/(tabs)/settings.tsx` — Threshold configuration UI
- `frontend/app/(app)/(tabs)/status.tsx` — Device status display

---

## Customization & Extensibility
- Add more sensors or relays by updating the ESP8266 firmware and backend models/routes.
- Add authentication or user management as needed.
- Extend the mobile app with notifications, history, or analytics.

---

## Troubleshooting
- **Network request failed**: Ensure backend is running, device and PC are on the same network, and CORS is configured.
- **No data in app**: Check MongoDB connection and that ESP8266 is sending data.
- **UI not updating**: Check interval fetching in `GlobalContext.tsx` and API URLs.

---

## Credits
- Hardware: ESP8266 NodeMCU, DHT11, LDR, Soil Sensor, Relays, LCD
- Backend: Express.js, MongoDB
- Frontend: React Native (Expo), NativeWind, react-native-gifted-charts

---

## License
This project is for educational and prototyping purposes.
