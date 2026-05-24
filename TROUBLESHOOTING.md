# 🔧 TROUBLESHOOTING GUIDE

## ❌ Vấn Đề: "Ấn Enter Không Được"

### Các Nguyên Nhân Có Thể:

#### 1. **Web Server Chưa Chạy**
**Triệu chứng:** Trang không load, hoặc hiển thị lỗi "Cannot connect"

**Giải pháp:**
```bash
# Mở terminal/command prompt
cd "d:\HUST Documents\Programing\SIM_RACING_GAME"
python -m http.server 8000

# Bạn sẽ thấy:
# Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

Sau đó mở browser: `http://localhost:8000/index.html`

---

#### 2. **Chạy Từ file:// Protocol**
**Triệu chứng:** URL bắt đầu bằng `file:///`

**Giải pháp:** KHÔNG double-click vào index.html. Phải dùng web server!

---

#### 3. **JavaScript Errors**
**Triệu chứng:** Buttons không hoạt động, console có lỗi

**Cách kiểm tra:**
1. Mở browser (Chrome/Edge/Firefox)
2. Nhấn `F12` để mở Developer Tools
3. Click tab "Console"
4. Reload trang (`Ctrl+R`)
5. Xem có lỗi màu đỏ không

**Các lỗi thường gặp:**

##### Lỗi A: "Failed to load module"
```
Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/plain"
```

**Nguyên nhân:** Web server không đúng

**Giải pháp:** Dùng Python web server như hướng dẫn ở trên

---

##### Lỗi B: "CORS policy"
```
Access to script at 'file:///...' from origin 'null' has been blocked by CORS policy
```

**Nguyên nhân:** Đang chạy từ file://

**Giải pháp:** Dùng web server

---

##### Lỗi C: "Cannot find module"
```
Failed to resolve module specifier "./config/championships.js"
```

**Nguyên nhân:** File không tồn tại hoặc path sai

**Giải pháp:** Kiểm tra file structure:
```
SIM_RACING_GAME/
├── index.html
├── app.js
└── js/
    ├── main.js
    ├── config/
    │   └── championships.js
    └── utils/
        └── wingSetup.js
```

---

##### Lỗi D: "window.CHAMPIONSHIPS_DATA is undefined"
```
Cannot read property 'f1' of undefined
```

**Nguyên nhân:** Modules chưa load xong

**Giải pháp:** Đã fix trong main.js (wait for DOM ready)

---

#### 4. **Cache Issues**
**Triệu chứng:** Code mới không chạy, vẫn thấy code cũ

**Giải pháp:**
1. Hard reload: `Ctrl+Shift+R` (Windows) hoặc `Cmd+Shift+R` (Mac)
2. Hoặc clear cache:
   - Chrome: `F12` → Right-click reload button → "Empty Cache and Hard Reload"
   - Firefox: `Ctrl+Shift+Delete` → Clear cache

---

#### 5. **Event Listeners Không Attach**
**Triệu chứng:** Buttons không respond khi click

**Nguyên nhân:** app.js load trước khi DOM ready

**Giải pháp:** Đã fix trong main.js (check DOM ready state)

---

## 🧪 Debug Steps

### Step 1: Test Simple HTML
```bash
# Mở test-simple.html
http://localhost:8000/test-simple.html
```

Click button "Click Me". Nếu alert hiện ra → JavaScript hoạt động OK.

---

### Step 2: Test Module Loading
```bash
# Mở debug.html
http://localhost:8000/debug.html
```

Xem logs:
- ✅ Tất cả xanh → Modules load OK
- ❌ Có đỏ → Xem error message

---

### Step 3: Test Main App
```bash
# Mở index.html
http://localhost:8000/index.html
```

Mở Console (`F12`), bạn phải thấy:
```
✅ ES6 Modules loaded successfully
📦 Wing Setup System: ACTIVE
🏎️ Championships loaded: f1,wec,gt
🏁 F1 Teams with setup: 10
✅ app.js loaded
🚀 Application ready
```

Nếu KHÔNG thấy → Có lỗi trong quá trình load.

---

### Step 4: Test Championship Selection
1. Click vào "Formula 1" card
2. Console phải hiển thị: "Championship selected: f1"
3. Sidebar phải hiển thị "Formula 1"

---

### Step 5: Test Qualifying
1. Click "Start Qualifying"
2. Console phải hiển thị:
```
🔧 Auto-optimizing wing setup for Monza...
  ✅ Oracle Red Bull Racing: Front 18, Rear 16 (93% confidence)
  ... (all teams)
```
3. Cars phải xuất hiện trên track

---

## 🔍 Common Issues & Solutions

### Issue: "Nothing happens when I click"

**Debug:**
```javascript
// Mở Console, gõ:
console.log(typeof CHAMPIONSHIPS);
// Phải thấy: "object"

console.log(state);
// Phải thấy: { teams: [...], drivers: [...], ... }
```

**Nếu undefined:**
- Modules chưa load
- Check console for errors
- Try hard reload

---

### Issue: "Teams không có setup property"

**Debug:**
```javascript
// Mở Console, gõ:
console.log(window.DEFAULT_TEAMS_BY_CHAMP.f1[0].setup);
// Phải thấy: { frontWing: 50, rearWing: 50 }
```

**Nếu undefined:**
```javascript
// Clear localStorage
localStorage.clear();
location.reload();
```

---

### Issue: "Wing setup không apply"

**Debug:**
1. Start Qualifying
2. Check console for optimization logs
3. Nếu KHÔNG thấy logs:
```javascript
// Check if wingSetup exists
console.log(window.wingSetup);
// Phải thấy: { calculateOptimalSetupForMonza: f, ... }
```

---

## 📋 Checklist

Trước khi báo lỗi, hãy check:

- [ ] Web server đang chạy (`python -m http.server 8000`)
- [ ] URL là `http://localhost:8000/...` (KHÔNG phải `file://`)
- [ ] Console không có lỗi màu đỏ
- [ ] Hard reload đã thử (`Ctrl+Shift+R`)
- [ ] Cache đã clear
- [ ] File structure đúng (có folder `js/`)
- [ ] Tất cả files tồn tại (main.js, championships.js, wingSetup.js)

---

## 🆘 Still Not Working?

### Collect Debug Info:

1. **Browser & Version:**
   - Chrome/Edge/Firefox?
   - Version number?

2. **Console Errors:**
   - Copy toàn bộ errors từ Console
   - Screenshot nếu cần

3. **Network Tab:**
   - `F12` → Tab "Network"
   - Reload page
   - Check if all files load (status 200)
   - Screenshot nếu có file màu đỏ (failed)

4. **Test Results:**
   - test-simple.html works? ✅/❌
   - debug.html shows what?
   - index.html console output?

---

## 🔄 Reset Everything

Nếu mọi thứ rối, reset lại:

```javascript
// 1. Clear localStorage
localStorage.clear();

// 2. Hard reload
// Ctrl+Shift+R

// 3. Restart web server
// Ctrl+C (stop server)
// python -m http.server 8000 (start again)

// 4. Clear browser cache
// Chrome: Settings → Privacy → Clear browsing data
```

---

## 📞 Contact

Nếu vẫn không được, cung cấp:
1. Browser console screenshot
2. Network tab screenshot
3. Output từ debug.html
4. Steps bạn đã làm

---

**Last Updated:** 2026-05-14  
**Version:** 2.0

