# 🏎️ PHÂN TÍCH LATERAL MOVEMENT (DI CHUYỂN NGANG) TRONG GAME

**Ngày phân tích:** May 27, 2026  
**Phiên bản game:** Current  
**Người phân tích:** Kiro AI Assistant

---

## 📊 KẾT LUẬN CHÍNH

### ❌ **GAME HIỆN TẠI KHÔNG HỖ TRỢ LATERAL MOVEMENT**

Các xe **KHÔNG THỂ** di chuyển ngang (thay đổi lane) trong quá trình đua để:
- ❌ Vượt xe khác
- ❌ Phòng thủ vị trí
- ❌ Tìm racing line tốt hơn
- ❌ Tránh va chạm

---

## 🔍 CHI TIẾT PHÂN TÍCH

### 1. **Lane System - Cố Định Từ Đầu**

#### Code Evidence:
```javascript
// Trong buildSimTeamRuns() - app.js line 2886
return {
  laneIndex: idx % SIM_LANE_COUNT,  // ← Chỉ set 1 lần khi khởi tạo
  gridOffset: Math.floor(idx / SIM_LANE_COUNT) * SIM_ROW_GAP,
  uniqueLaneNudge: (idx - center) * 0.18  // ← Offset nhỏ, cố định
};
```

**Ý nghĩa:**
- `laneIndex` được gán **1 lần duy nhất** khi tạo run
- Dựa trên vị trí grid ban đầu (`idx % SIM_LANE_COUNT`)
- **KHÔNG BAO GIỜ** thay đổi trong suốt race

#### Lane Configuration:
```javascript
SIM_LANE_COUNT = 3        // 3 lanes (0, 1, 2)
SIM_LANE_SPACING = 2.4    // 2.4 units giữa các lanes
```

**Phân bổ lanes:**
- Xe 0, 3, 6, 9... → Lane 0 (trái)
- Xe 1, 4, 7, 10... → Lane 1 (giữa)
- Xe 2, 5, 8, 11... → Lane 2 (phải)

### 2. **Position Calculation - Theo Racing Line Cố Định**

#### Code Evidence:
```javascript
// Trong getPointWithLaneOffset() - app.js line 2897
function getPointWithLaneOffset(path, distanceOnPath, laneOffset, lapLength) {
  const d1 = ((distanceOnPath % lapLength) + lapLength) % lapLength;
  const d2 = (d1 + 1) % lapLength;
  const p1 = path.getPointAtLength(d1);
  const p2 = path.getPointAtLength(d2);

  // Tính vector vuông góc với racing line
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;

  // Offset cố định theo lane
  return {
    x: p1.x + nx * laneOffset,  // ← laneOffset KHÔNG ĐỔI
    y: p1.y + ny * laneOffset
  };
}
```

**Ý nghĩa:**
- Mỗi xe theo 1 **racing line song song** với track center
- Offset được tính từ `laneIndex` (cố định)
- Xe chỉ di chuyển **dọc theo** racing line, không di chuyển **ngang**

### 3. **Rendering - Vị Trí Tĩnh**

#### Code Evidence:
```javascript
// Trong renderRaceDotsAtTime() - app.js line 2105
const laneOffset = (run.laneIndex - laneCenter) * SIM_LANE_SPACING + run.uniqueLaneNudge;
const point = getPointWithLaneOffset(path, wrappedDistance, laneOffset, lapLength);
```

**Ý nghĩa:**
- `laneOffset` được tính từ `laneIndex` (không đổi)
- `uniqueLaneNudge` là offset nhỏ để tránh xe chồng lên nhau (0.18 units)
- Cả 2 đều **CỐ ĐỊNH** suốt race

### 4. **Overtaking Logic - Chỉ Swap Positions**

#### Code Evidence:
```javascript
// Trong processOvertakingAttempts() - app.js
if (result.success) {
  carBehind.overtakesCompleted++;
  carAhead.defensesFailed++;

  // Swap positions in array
  window.overtakingSystem.swapPositions(orderedRuns, carBehind, carAhead);
  
  // ← KHÔNG CÓ CODE THAY ĐỔI laneIndex
}
```

**Ý nghĩa:**
- Overtaking chỉ **swap vị trí trong array**
- **KHÔNG** thay đổi `laneIndex`
- Xe vẫn chạy trên lane cũ sau khi vượt

---

## 🎮 HÀNH VI THỰC TẾ TRONG GAME

### Khi Overtaking Xảy Ra:

```
TRƯỚC KHI VƯỢT:
  Xe A (P2, Lane 1) -----> [racing line 1]
  Xe B (P3, Lane 2) -----> [racing line 2]

SAU KHI XE B VƯỢT XE A:
  Xe B (P2, Lane 2) -----> [racing line 2]  ← Vẫn lane 2!
  Xe A (P3, Lane 1) -----> [racing line 1]  ← Vẫn lane 1!
```

**Kết quả:**
- Vị trí trong bảng xếp hạng thay đổi (P2 ↔ P3)
- Nhưng xe **KHÔNG** thay đổi lane trên track
- Xe vượt "ma thuật" (teleport) qua xe khác

---

## 📈 SO SÁNH VỚI F1 THỰC TẾ

### F1 Thực Tế:
```
Overtaking Process:
1. Xe sau bám sát (slipstream)
2. Di chuyển sang bên (inside/outside line)
3. Vượt song song (side-by-side)
4. Hoàn thành vượt (ahead)
5. Quay về racing line
```

### Game Hiện Tại:
```
Overtaking Process:
1. Xe sau bám sát (gap < 0.5s)
2. Probability check (success/fail)
3. Swap positions in array
4. Xe "teleport" qua nhau
5. Vẫn ở lane cũ
```

---

## 🔧 TẠI SAO THIẾT KẾ NHƯ VẬY?

### Lý do kỹ thuật:

1. **Đơn giản hóa simulation**
   - Không cần collision detection
   - Không cần path planning
   - Không cần AI decision making

2. **Performance**
   - Tính toán nhanh hơn
   - Ít logic phức tạp
   - Dễ debug

3. **Visual simplicity**
   - Dễ render (3 lanes cố định)
   - Không cần animation phức tạp
   - Tránh xe chồng lên nhau

### Trade-offs:

✅ **Ưu điểm:**
- Code đơn giản, dễ maintain
- Performance tốt
- Ít bugs
- Dễ hiểu cho người chơi

❌ **Nhược điểm:**
- Không realistic
- Overtaking "ma thuật"
- Không có side-by-side racing
- Không có defensive driving visual

---

## 🚀 ĐỀ XUẤT CẢI TIẾN (FUTURE)

### Phase 1: Dynamic Lane Assignment (Cơ bản)

```javascript
// Thêm vào overtaking logic
if (result.success) {
  // Swap lanes khi vượt
  const tempLane = carBehind.laneIndex;
  carBehind.laneIndex = carAhead.laneIndex;
  carAhead.laneIndex = tempLane;
  
  // Animate transition (0.5s)
  animateLaneChange(carBehind, tempLane, carAhead.laneIndex);
  animateLaneChange(carAhead, carAhead.laneIndex, tempLane);
}
```

**Kết quả:**
- Xe thực sự đổi lane khi vượt
- Visual realistic hơn
- Vẫn đơn giản (chỉ swap lanes)

### Phase 2: Multi-Line Racing (Trung bình)

```javascript
// Thêm logic chọn racing line
function chooseBestLine(car, carAhead, zone) {
  if (zone.difficulty === 'easy') {
    // Straight: chọn inside/outside line
    return carAhead.laneIndex === 1 
      ? (Math.random() > 0.5 ? 0 : 2)  // Tránh lane giữa
      : 1;  // Về lane giữa
  } else {
    // Corner: chọn optimal racing line
    return getOptimalCornerLine(zone);
  }
}
```

**Kết quả:**
- Xe chọn line tốt nhất để vượt
- Defending bằng cách block line
- Realistic hơn nhiều

### Phase 3: Full Lateral Movement (Nâng cao)

```javascript
// Thêm continuous lateral movement
car.targetLaneIndex = chooseBestLine(...);
car.currentLaneOffset = lerp(
  car.currentLaneOffset,
  car.targetLaneIndex * SIM_LANE_SPACING,
  deltaTime * LANE_CHANGE_SPEED
);
```

**Kết quả:**
- Xe di chuyển mượt mà giữa các lanes
- Side-by-side racing
- Collision detection cần thiết
- Phức tạp nhất

---

## 📊 IMPACT ANALYSIS

### Nếu Implement Dynamic Lanes:

#### Code Changes:
- **Nhỏ (Phase 1):** ~50 lines
- **Trung bình (Phase 2):** ~200 lines
- **Lớn (Phase 3):** ~500 lines

#### Performance Impact:
- **Phase 1:** Negligible (<1% CPU)
- **Phase 2:** Low (~2-3% CPU)
- **Phase 3:** Medium (~5-10% CPU)

#### Visual Impact:
- **Phase 1:** Xe đổi lane rõ ràng
- **Phase 2:** Racing line realistic
- **Phase 3:** Hoàn toàn như F1 thật

#### Complexity:
- **Phase 1:** Low (chỉ swap lanes)
- **Phase 2:** Medium (AI decision)
- **Phase 3:** High (collision, animation)

---

## 🎯 KHUYẾN NGHỊ

### Cho Phiên Bản Hiện Tại:
✅ **GIỮ NGUYÊN** thiết kế hiện tại
- Đã hoạt động tốt
- Overtaking system mới vừa deploy
- Cần thời gian test và balance

### Cho Tương Lai:
📅 **Phase 1** (1-2 tuần sau)
- Implement lane swapping khi overtake
- Animation đơn giản
- Test với user feedback

📅 **Phase 2** (1-2 tháng sau)
- Multi-line racing
- AI chọn line
- Defensive driving

📅 **Phase 3** (3-6 tháng sau)
- Full lateral movement
- Collision detection
- Advanced AI

---

## 📝 KẾT LUẬN

### Trả lời câu hỏi:

> **"Game có cho phép xe di chuyển giữa bề rộng track để vượt/phòng thủ không?"**

**Câu trả lời: KHÔNG ❌**

**Chi tiết:**
- Xe được gán **lane cố định** từ đầu race
- `laneIndex` **KHÔNG BAO GIỜ** thay đổi
- Overtaking chỉ **swap positions** trong array
- Xe **KHÔNG** di chuyển ngang trên track
- Visual: Xe "teleport" qua nhau

**Nhưng:**
- Thiết kế này **HỢP LÝ** cho giai đoạn hiện tại
- Đơn giản, ổn định, dễ maintain
- Có thể nâng cấp sau (Phase 1-3)

---

**Tài liệu này:** Phân tích kỹ thuật  
**Mục đích:** Hiểu rõ hệ thống hiện tại  
**Hành động:** Không cần thay đổi ngay  
**Tương lai:** Có roadmap rõ ràng để nâng cấp

---

**Phân tích bởi:** Kiro AI Assistant  
**Ngày:** May 27, 2026
