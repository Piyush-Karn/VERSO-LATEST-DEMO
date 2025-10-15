# Verso Mobile Access & Interaction Guide

## 🚨 Important: This is a Web App, Not Native Mobile

Verso is built with **Vite + React** (web technologies), not Expo React Native. This means:
- ✅ Access via browser on any device (mobile, tablet, desktop)
- ❌ No QR code for Expo Go (not an Expo app)
- ✅ Works perfectly on mobile browsers (Safari, Chrome, Firefox)

---

## 📱 How to Access on Mobile

### Option 1: QR Code (Easiest)
1. Visit: `https://your-preview-url.com/qr`
2. Scan the QR code with your phone camera
3. Opens directly in your mobile browser

### Option 2: Direct URL
Simply open this URL in your mobile browser:
```
https://cinematic-trips.preview.emergentagent.com
```

### Option 3: Share Link
Copy the URL and:
- Text/email it to yourself
- Open on mobile
- Add to home screen for app-like experience

---

## 🎯 Swipe Interaction - Now Fixed!

### Mobile Touch Gestures
- **Swipe Up**: Next activity/cafe
- **Swipe Down**: Previous activity (or exit if on first card)
- **Tap "View Details"**: See full experience details
- **Tap Heart**: Save to favorites

### Desktop Controls
- **Arrow Keys**: ↑/↓ or ←/→ to navigate
- **Mouse Drag**: Click and drag up/down to swipe
- **ESC Key**: Exit back to previous view

### What Was Fixed
1. **Touch Action**: Changed from `pan-y` to `none` for better touch control
2. **Mouse Events**: Added `onMouseDown`/`onMouseUp` for desktop testing
3. **Keyboard Navigation**: Added arrow key and ESC support
4. **Selection Prevention**: Added `userSelect: none` to prevent text selection during swipe

---

## 🧪 Testing Swipe Interaction

### Test on Mobile
1. Go to Collections → Select a vault (e.g., "Japan")
2. Tap on a city (e.g., "Tokyo")
3. You'll see the full-screen activity feed
4. **Swipe up/down** to navigate between activities
5. Toggle between "Activities" and "Cafes" tabs

### Test on Desktop
1. Same navigation as above
2. Use **arrow keys** or **click-and-drag** to test swipe
3. Open DevTools → Toggle device toolbar (Ctrl+Shift+M)
4. Select mobile device preset for realistic testing

---

## 📍 Where Swipe Works

Swipe navigation is active on:
- `/vault/:vaultId/city/:cityName` - City-specific activities
- `/vault/:vaultId/category/:categoryName` - Category feeds (Things To Do, Seasons)

Both routes use the `CityFeedView` component with the fixed swipe handlers.

---

## 🐛 If Swipe Still Doesn't Work

1. **Clear Browser Cache**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. **Check Console**: Open DevTools → Console for errors
3. **Try Different Browser**: Safari, Chrome, or Firefox
4. **Check Touch Support**: Some desktop browsers may not simulate touch properly

---

## 🎨 Add to Home Screen (iOS)

For app-like experience:
1. Open URL in Safari
2. Tap Share button (box with arrow)
3. Scroll and tap "Add to Home Screen"
4. Name it "Verso" → Add
5. Opens in full-screen mode (no browser UI)

---

## 🔧 Technical Details

### Fixed Files
- `/app/frontend/src/pages/CityFeedView.tsx`
  - Enhanced touch handlers
  - Added mouse event support
  - Added keyboard navigation
  - Fixed `touchAction` and `userSelect` CSS

### New Features
- `/app/frontend/src/pages/QRCodePage.tsx`
  - QR code generator for easy mobile access
  - Route: `/qr`

### Dependencies Added
- `qrcode` - QR code generation
- `@types/qrcode` - TypeScript types

---

## 📊 Current Status

| Feature | Status | Notes |
|---------|--------|-------|
| Mobile Browser Access | ✅ Working | Safari, Chrome, Firefox |
| Swipe Interaction | ✅ Fixed | Touch + Mouse + Keyboard |
| QR Code Page | ✅ New | Visit `/qr` |
| Desktop Testing | ✅ Working | Arrow keys, mouse drag |
| Responsive Design | ✅ Working | All screen sizes |

---

## 🚀 Next Steps (Optional Enhancements)

1. **PWA Support**: Add manifest.json for installable web app
2. **Service Worker**: Offline support and caching
3. **Haptic Feedback**: Vibration on swipe (mobile)
4. **Gesture Velocity**: Faster swipes = faster transitions
5. **Swipe Progress Indicator**: Visual feedback during swipe

---

## 📞 Support

If issues persist:
1. Check browser console for errors
2. Verify network connectivity
3. Try incognito/private mode
4. Test on different device/browser

**App URL**: https://cinematic-trips.preview.emergentagent.com  
**QR Code**: https://cinematic-trips.preview.emergentagent.com/qr
