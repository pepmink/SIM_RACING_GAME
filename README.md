# 🏎️ SIM RACING GAME

Ứng dụng quản lý và mô phỏng đua xe với hỗ trợ nhiều giải đua (F1, WEC, GT) và hệ thống wing setup tự động.

## ✨ Tính Năng Mới (v2.0)

### 🔧 Wing Setup System
- ✅ **Auto-optimization** cho track Monza
- ✅ **Front Wing** (0-100): Thấp = +Overtaking/Defending, Cao = +Cornering/Control
- ✅ **Rear Wing** (0-100): Thấp = +Braking, Cao = +Smooth
- ✅ **Ảnh hưởng thực tế** đến qualifying và race performance
- ✅ **Console logs** hiển thị quá trình optimization

### � ES6 Modules Architecture
- ✅ Cấu trúc code modular trong folder `js/`
- ✅ Tách biệt rõ ràng các concerns
- ✅ Dễ maintain và mở rộng

## �🚀 Bắt Đầu Nhanh

### 1. Chạy web server

```bash
cd "path/to/SIM_RACING_GAME"
python -m http.server 8000
```

### 2. Mở browser

```
http://localhost:8000/index.html
```

### 3. Kiểm tra Console (F12)

Bạn sẽ thấy:

```
✅ ES6 Modules loaded successfully
📦 Wing Setup System: ACTIVE
🏎️ Championships loaded: f1,wec,gt
🏁 F1 Teams with setup: 10
✅ app.js loaded
🚀 Application ready
```

### 4. Bắt đầu đua!

- Chọn championship "Formula 1"
- Click "Start Qualifying"
- Xem console để thấy wing optimization logs
- Thưởng thức simulation!

## 📊 Wing Setup Hoạt Động Như Thế Nào?

### Khi bắt đầu session

Hệ thống tự động optimize wing setup cho từng team:

```
Teams Mạnh (Red Bull, Ferrari):
  Front Wing: 18-20 (aggressive, low downforce)
  Rear Wing: 16-18 (low drag)
  → Tốt hơn cho overtaking, braking, top speed

Teams Yếu (Alpine, Sauber):
  Front Wing: 22-24 (conservative, more downforce)
  Rear Wing: 19-21 (more stability)
  → Tốt hơn cho cornering, control, consistency
```

### Ảnh hưởng đến Performance

Wing setup thay đổi driver skills:

- **Low Front Wing** → +Overtaking, +Defending
- **High Front Wing** → +Cornering, +Control
- **Low Rear Wing** → +Braking
- **High Rear Wing** → +Smooth

Modified skills ảnh hưởng đến qualifying pace và lap times!

## 📁 Cấu Trúc Dự Án

```
SIM_RACING_GAME/
├── index.html              # Main application
├── app.js                  # Main logic (3000+ lines)
├── style.css               # Styling
├── js/                     # ES6 Modules
│   ├── main.js            # Entry point
│   ├── config/
│   │   ├── championships.js  # Teams & drivers data
│   │   ├── constants.js      # All constants
│   │   ├── defaults.js       # Default values
│   │   └── index.js          # Barrel export
│   ├── state/
│   │   └── state.js          # State management
│   └── utils/
│       └── wingSetup.js      # Wing calculations
├── docs/                   # Documentation
│   ├── ARCHITECTURE.md        # System architecture
│   ├── ES6_MODULES_MIGRATION.md  # Migration details
│   ├── STATS_EXPLANATION.md   # Stats usage
│   └── ...
├── test-modules.html       # Module tests
├── test-wing-setup.html    # Wing setup demo
├── QUICK_START.md          # Quick start guide
└── MIGRATION_SUMMARY.md    # Migration summary (Vietnamese)
```

## 🧪 Testing

### Test ES6 Modules

```
http://localhost:8000/test-modules.html
```

### Test Wing Setup

```
http://localhost:8000/test-wing-setup.html
```

## 📖 Tài Liệu

- **[Quick Start Guide](QUICK_START.md)** - Bắt đầu trong 5 phút
- **[Architecture Overview](docs/ARCHITECTURE.md)** - Thiết kế hệ thống và data flow
- **[ES6 Migration](docs/ES6_MODULES_MIGRATION.md)** - Chi tiết technical migration
- **[Wing Setup Implementation](WING_SETUP_IMPLEMENTATION.md)** - Chi tiết wing system
- **[Migration Summary (Vietnamese)](MIGRATION_SUMMARY.md)** - Tóm tắt tiếng Việt

## 🔧 Troubleshooting

### "Cannot use import statement outside a module"

**Giải pháp:** Dùng web server, không dùng `file://` protocol

### "CORS error when loading modules"

**Giải pháp:** Chạy qua `python -m http.server`, không double-click HTML

### Teams không có wing setup

**Giải pháp:** Clear localStorage: `localStorage.clear()` và reload

### Wing setup không apply

**Giải pháp:** Kiểm tra browser console để xem optimization logs

## 🎯 Roadmap

### Phase 1: ✅ DONE

- ES6 modules architecture
- Wing setup system
- Monza auto-optimization
- Skill modifiers

### Phase 2: In Progress

- [ ] Thêm tracks (Monaco, Silverstone, Spa)
- [ ] Manual setup UI
- [ ] Setup comparison tool
- [ ] Weather conditions

### Phase 3: Future

- [ ] AI learning from races
- [ ] Multiplayer support
- [ ] Advanced telemetry
- [ ] Custom track editor

## 🛠️ Tech Stack

- Vanilla JavaScript (ES6+)
- ES6 Modules
- LocalStorage
- SVG + Canvas

## 📝 License

MIT License

---

**Version:** 2.0  
**Last Updated:** 2026-05-14  
**Status:** ✅ Production Ready  
**Wing Setup:** ✅ Active

## 🏁 Happy Racing! 🏁
