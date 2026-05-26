# 🏁 QUICK START GUIDE

## 🚀 Chạy Ứng Dụng

### Bước 1: Start Web Server
```bash
cd "d:\HUST Documents\Programing\SIM_RACING_GAME"
python -m http.server 8000
```

### Bước 2: Mở Browser
```
http://localhost:8000/index.html
```

### Bước 3: Kiểm Tra Console
Nhấn `F12` → Tab "Console" → Bạn sẽ thấy:
```
✅ ES6 Modules loaded successfully
📦 Wing Setup System: ACTIVE
🏎️ Championships loaded: f1,wec,gt
🏁 F1 Teams with setup: 10
✅ app.js loaded
🚀 Application ready
```

---

## 🏎️ Chạy Simulation

### 1. Select Championship
- Click vào "Formula 1" card

### 2. Start Qualifying
- Click "Start Qualifying"
- Console sẽ hiển thị wing optimization:
```
🔧 Auto-optimizing wing setup for Monza...
  ✅ Oracle Red Bull Racing: Front 18, Rear 16 (93% confidence)
  ✅ Scuderia Ferrari HP: Front 19, Rear 17 (90% confidence)
  ...
```

### 3. Watch Qualifying
- Cars sẽ chạy trên track
- Lap times được tính dựa trên wing setup
- Kết quả hiển thị sau 15 phút (hoặc x2, x3, x4, x5 speed)

### 4. Start Race
- Click "Start Race"
- Grid order dựa trên qualifying results
- Wing setup vẫn được giữ nguyên

---

## 🧪 Test Pages

### Test ES6 Modules
```
http://localhost:8000/test-modules.html
```
Kiểm tra:
- ✅ Modules loaded
- ✅ Wing constants
- ✅ Teams data
- ✅ Wing calculations

### Test Wing Setup
```
http://localhost:8000/test-wing-setup.html
```
Kiểm tra:
- ✅ Manual wing adjustment
- ✅ Auto-optimization
- ✅ Team cards with setup

---

## 📊 Wing Setup Explained

### Front Wing (0-100)
```
0-49:  Low downforce  → +Overtaking, +Defending
50:    Neutral        → No change
51-100: High downforce → +Cornering, +Control
```

### Rear Wing (0-100)
```
0-49:  Low drag       → +Braking
50:    Neutral        → No change
51-100: High stability → +Smooth
```

### Monza Optimal Range
```
Front Wing: 15-35 (low downforce for speed)
Rear Wing:  10-30 (low drag for speed)
```

---

## 🔧 Troubleshooting

### Problem: Console shows errors
**Solution:** Clear cache and reload (`Ctrl+Shift+R`)

### Problem: "Cannot use import statement"
**Solution:** Must use web server, not `file://`

### Problem: Teams don't have setup
**Solution:** Clear localStorage:
```javascript
localStorage.clear()
location.reload()
```

### Problem: Wing setup not applying
**Solution:** Check console for optimization logs

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `index.html` | Main app |
| `js/main.js` | ES6 entry point |
| `app.js` | Main logic |
| `js/utils/wingSetup.js` | Wing calculations |
| `js/config/championships.js` | Teams & drivers data |

---

## 🎯 What's Working

- ✅ ES6 modules architecture
- ✅ Wing setup auto-optimization
- ✅ Skill modifiers from wing setup
- ✅ Qualifying performance affected by setup
- ✅ Console logs for debugging
- ✅ All existing features still work

---

## 📖 More Info

- **Full Migration Details:** `docs/ES6_MODULES_MIGRATION.md`
- **Wing Setup Details:** `WING_SETUP_IMPLEMENTATION.md`
- **Vietnamese Summary:** `MIGRATION_SUMMARY.md`

---

**Ready to race! 🏁**

