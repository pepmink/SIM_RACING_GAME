# Sim Racing Manager - Cấu trúc dự án mới

## Tổng quan
File `app.js` gốc (2521 dòng) đã được chia thành các module nhỏ hơn để dễ quản lý và bảo trì.

## Cấu trúc thư mục

```
js/
├── config/
│   ├── constants.js          # Các hằng số: Championship configs, simulation constants
│   └── defaults.js            # Dữ liệu mặc định: Default teams & drivers
│
├── core/
│   ├── state.js               # Quản lý state & localStorage
│   └── navigation.js          # Điều hướng & routing
│
├── modules/
│   ├── teams.js               # Quản lý teams (CRUD, validation)
│   ├── drivers.js             # Quản lý drivers (CRUD, skills calculation)
│   ├── carSetup.js            # Quản lý car setup
│   └── simRacing.js           # Race simulation engine (DRS, ERS, physics)
│
├── ui/
│   ├── render.js              # Các hàm render (tables, stats, activity)
│   └── components.js          # UI components (toast, modal, search)
│
├── utils/
│   └── helpers.js             # Utility functions
│
└── main.js                    # Entry point - kết nối tất cả modules
```

## Chi tiết các module

### 1. **config/** - Cấu hình
- **constants.js**: Championships, car defaults, simulation physics constants
- **defaults.js**: Dữ liệu F1 2025 teams & drivers mặc định

### 2. **core/** - Core functionality
- **state.js**: 
  - State management (teams, drivers, activity)
  - localStorage operations
  - Data normalization & seeding
  
- **navigation.js**:
  - Navigation system
  - Championship selection
  - UI updates

### 3. **modules/** - Chức năng chính
- **teams.js**: 
  - Team form & validation
  - Logo/car photo upload
  - Team CRUD operations
  
- **drivers.js**:
  - Driver form & validation
  - Photo upload
  - Skills calculation (pace, consistency, racecraft)
  
- **carSetup.js**:
  - Car stats management
  - Overall rating calculation
  
- **simRacing.js**:
  - Race simulation engine
  - DRS zones & activation
  - ERS system
  - Physics calculations
  - Race results

### 4. **ui/** - Giao diện
- **render.js**:
  - Render teams, drivers, car setups
  - Stats & activity feed
  - Speedometer animation
  
- **components.js**:
  - Toast notifications
  - Modal dialogs
  - Search functionality
  - Color picker
  - Form toggles

### 5. **utils/** - Tiện ích
- **helpers.js**: Các hàm helper (escHtml, timeAgo, getRatingTier, etc.)

### 6. **main.js** - Entry point
- Khởi tạo tất cả modules
- Kết nối các components
- Expose global functions

## Lợi ích của cấu trúc mới

### ✅ Dễ bảo trì
- Mỗi file có trách nhiệm rõ ràng
- Dễ tìm và sửa lỗi
- Code được tổ chức logic

### ✅ Dễ mở rộng
- Thêm features mới không ảnh hưởng code cũ
- Module hóa giúp tái sử dụng code
- Dễ test từng module riêng

### ✅ Hiệu suất tốt hơn
- Browser chỉ load modules cần thiết
- ES6 modules hỗ trợ tree-shaking
- Code splitting tự động

### ✅ Collaboration tốt hơn
- Nhiều người có thể làm việc trên các module khác nhau
- Ít conflict khi merge code
- Dễ review code

## Migration từ app.js cũ

File `app.js` gốc đã được đổi tên thành `app.js.backup` để giữ lại.

### Thay đổi trong index.html:
```html
<!-- Cũ -->
<script src="app.js"></script>

<!-- Mới -->
<script type="module" src="js/main.js"></script>
```

### Tất cả chức năng vẫn hoạt động như cũ:
- ✅ Championship selection
- ✅ Team management
- ✅ Driver management
- ✅ Car setup
- ✅ Sim racing
- ✅ localStorage
- ✅ Search & filters
- ✅ All UI interactions

## Cách sử dụng

### Chạy ứng dụng:
1. Mở `index.html` trong browser
2. Tất cả modules sẽ tự động load
3. Ứng dụng hoạt động như bình thường

### Phát triển thêm:
1. **Thêm team feature mới**: Chỉnh sửa `js/modules/teams.js`
2. **Thêm driver feature mới**: Chỉnh sửa `js/modules/drivers.js`
3. **Thêm simulation feature**: Chỉnh sửa `js/modules/simRacing.js`
4. **Thêm UI component**: Chỉnh sửa `js/ui/components.js`
5. **Thêm constants**: Chỉnh sửa `js/config/constants.js`

### Debug:
- Mở DevTools Console để xem errors
- Mỗi module có thể debug riêng
- Source maps giúp debug dễ dàng

## Notes

- **ES6 Modules**: Sử dụng `import/export` syntax
- **Browser support**: Modern browsers (Chrome, Firefox, Edge, Safari)
- **No build step**: Không cần webpack/babel, chạy trực tiếp
- **Backward compatible**: Tất cả features hoạt động như cũ

## Tác giả
Refactored by Kiro AI Assistant
Original code: Sim Racing Manager
