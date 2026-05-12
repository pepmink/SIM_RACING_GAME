# 🚀 Bắt Đầu Sử Dụng Module

## ✅ Đã Hoàn Thành

Tôi đã chia file `app.js` (3017 dòng) thành các module nhỏ:

```
js/
├── config/
│   ├── championships.js    ✅ Cấu hình giải đua, teams, drivers
│   ├── constants.js        ✅ Tất cả hằng số simulation (100+)
│   ├── defaults.js         ✅ Giá trị mặc định
│   └── index.js            ✅ Import tất cả từ một chỗ
│
└── state/
    └── state.js            ✅ State management
```

## 📖 Tài Liệu

1. **`BAT_DAU.md`** (file này) - Hướng dẫn nhanh
2. **`SUMMARY.md`** - Tóm tắt chi tiết
3. **`README_MODULES.md`** - Hướng dẫn sử dụng đầy đủ
4. **`REFACTORING_GUIDE.md`** - Hướng dẫn refactor toàn bộ
5. **`STRUCTURE.txt`** - Sơ đồ cấu trúc

## 🎯 Cách Sử Dụng Ngay

### Bước 1: Tạo file test

Tạo file `test.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Modules</title>
</head>
<body>
    <h1>Test Modules</h1>
    <div id="output"></div>

    <script type="module">
        // Import modules
        import { CHAMPIONSHIPS } from './js/config/championships.js';
        import { SIM_MAX_SPEED_KMH, SIM_RACE_TOTAL_LAPS } from './js/config/constants.js';
        import { state } from './js/state/state.js';

        // Test
        const output = document.getElementById('output');
        output.innerHTML = `
            <p>✅ Championships: ${Object.keys(CHAMPIONSHIPS).join(', ')}</p>
            <p>✅ Max Speed: ${SIM_MAX_SPEED_KMH} km/h</p>
            <p>✅ Race Laps: ${SIM_RACE_TOTAL_LAPS}</p>
            <p>✅ Teams: ${state.teams.length}</p>
        `;
    </script>
</body>
</html>
```

### Bước 2: Chạy web server

```bash
# Mở terminal trong thư mục dự án
python -m http.server 8000
```

### Bước 3: Mở browser

Truy cập: `http://localhost:8000/test.html`

Nếu thấy:
- ✅ Championships: f1, wec, gt
- ✅ Max Speed: 370 km/h
- ✅ Race Laps: 3
- ✅ Teams: 0

→ **Thành công!** Modules đang hoạt động!

## 💡 Ví Dụ Sử Dụng

### Import một item

```javascript
import { CHAMPIONSHIPS } from './js/config/championships.js';

console.log(CHAMPIONSHIPS.f1.name); // "Formula 1"
```

### Import nhiều items

```javascript
import { 
    SIM_MAX_SPEED_KMH, 
    SIM_RACE_TOTAL_LAPS,
    SIM_SESSION_PHASES 
} from './js/config/constants.js';

console.log(SIM_MAX_SPEED_KMH);     // 370
console.log(SIM_RACE_TOTAL_LAPS);   // 3
```

### Import tất cả

```javascript
import * as CONFIG from './js/config/index.js';

console.log(CONFIG.CHAMPIONSHIPS.f1.name);  // "Formula 1"
console.log(CONFIG.SIM_MAX_SPEED_KMH);      // 370
```

## 🎓 Lợi Ích

### Trước (app.js - 3017 dòng)
```javascript
// Phải scroll tìm trong 3000 dòng
const SIM_MAX_SPEED_KMH = 370;
// ... 2000 dòng khác ...
const SIM_RACE_TOTAL_LAPS = 3;
```

### Sau (constants.js - 120 dòng)
```javascript
// Tất cả constants ở một chỗ, dễ tìm!
export const SIM_MAX_SPEED_KMH = 370;
export const SIM_RACE_TOTAL_LAPS = 3;
```

## ⚠️ Lưu Ý

1. **Phải chạy qua web server** (không mở trực tiếp file://)
2. **Phải dùng `type="module"`** trong script tag
3. **Phải dùng relative path** (`./js/...` không phải `js/...`)

## 🔧 Troubleshooting

### Lỗi: "Cannot use import statement"
**Giải pháp:** Thêm `type="module"` vào script tag
```html
<script type="module" src="app.js"></script>
```

### Lỗi: "CORS policy"
**Giải pháp:** Chạy qua web server
```bash
python -m http.server 8000
```

### Lỗi: "Module not found"
**Giải pháp:** Kiểm tra path
```javascript
// ❌ Sai
import { state } from 'js/state/state.js';

// ✅ Đúng
import { state } from './js/state/state.js';
```

## 📚 Đọc Thêm

- **`README_MODULES.md`** - Hướng dẫn chi tiết, ví dụ, tips & tricks
- **`REFACTORING_GUIDE.md`** - Hướng dẫn chia toàn bộ app.js
- **`SUMMARY.md`** - Tóm tắt đầy đủ
- **`STRUCTURE.txt`** - Sơ đồ cấu trúc visual

## 🚀 Bước Tiếp Theo

1. ✅ Test modules (làm theo hướng dẫn trên)
2. 📖 Đọc `README_MODULES.md` để hiểu sâu hơn
3. 🔧 Bắt đầu sử dụng modules trong code của bạn
4. 🎯 (Optional) Chạy `split_app.py` để chia toàn bộ

---

**Chúc bạn code vui vẻ! 🎉**
