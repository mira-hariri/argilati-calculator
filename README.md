# Currency Calculator

Two versions of the same currency calculator app:

## Web App (React + Vite)

Located in `web-app/` directory.

### Setup and Run:
```bash
cd web-app
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production:
```bash
npm run build
```

## Mobile App (React Native + Expo)

Located in `mobile-app/` directory.

### Setup and Run:
```bash
cd mobile-app
npm install
npx expo start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Features

Both apps include:
- Total amount input (in LBP with 000 suffix)
- Customer paid input with USD/LBP toggle
- Built-in calculator popup for quick calculations
- Automatic change calculation
- Returns change in multiples of $5 + remaining LBP
- Handles negative amounts (customer still owes)
- Custom USD amount adjustment
- Mobile responsive design
- Number formatting with commas
