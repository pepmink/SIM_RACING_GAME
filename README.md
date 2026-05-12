# 🏎️ SIM RACING GAME

Ứng dụng quản lý và mô phỏng đua xe với hỗ trợ nhiều giải đua (F1, WEC, GT).

## 🚀 Bắt Đầu Nhanh

### 1. Chạy web server

```bash
python -m http.server 8000
```

### 2. Mở browser

Truy cập: `http://localhost:8000`

## 📁 Cấu Trúc Dự Án

```
SIM_RACING_GAME/
├── index.html              # Trang chính
├── style.css               # Styles
├── app.js                  # Main application
│
├── js/                     # Modules
│   ├── config/             # Configuration (championships, constants, defaults)
│   └── state/              # State management
│
├── docs/                   # Documentation
│   ├── BAT_DAU.md         # 🇻🇳 Hướng dẫn nhanh
│   └── ...                # Các tài liệu khác
│
└── *.csv                   # Data files
```

## ✨ Tính Năng

- ✅ Quản lý nhiều giải đua (F1, WEC, GT)
- ✅ Quản lý teams và drivers
- ✅ Car setup management
- ✅ Simulation engine (qualifying & race)
- ✅ Real-time visualization
- ✅ DRS & ERS systems
- ✅ Local storage persistence

## 🎯 Sử Dụng Modules

```javascript
// Import config
import { CHAMPIONSHIPS } from './js/config/championships.js';
import { SIM_MAX_SPEED_KMH } from './js/config/constants.js';

// Import state
import { state, simState } from './js/state/state.js';

// Sử dụng
console.log(CHAMPIONSHIPS.f1.name);  // "Formula 1"
console.log(SIM_MAX_SPEED_KMH);      // 370
```

## 📖 Tài Liệu

Xem thư mục `docs/` để biết thêm chi tiết:
- `BAT_DAU.md` - Hướng dẫn nhanh (Tiếng Việt)
- `README_MODULES.md` - Hướng dẫn sử dụng modules
- `REFACTORING_GUIDE.md` - Hướng dẫn refactor

## 🛠️ Tech Stack

- Vanilla JavaScript (ES6+)
- ES6 Modules
- LocalStorage
- SVG + Canvas

## 📝 License

MIT License

---

**Happy Racing! 🏁**
