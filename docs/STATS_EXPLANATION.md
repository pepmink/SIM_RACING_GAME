# 📊 Giải Thích Các Chỉ Số Xe & Driver

## 🏎️ Chỉ Số Xe (Car Setup)

### 1. **powerUnit** (Động cơ)
- **Giá trị:** 1-99
- **Mặc định:** 75
- **Ảnh hưởng:**
  - ✅ **Top Speed** (Tốc độ tối đa)
    - Formula: `speedKmh = SIM_MAX_SPEED_KMH - (SIM_POWER_UNIT_MAX - powerUnit) * SIM_KMH_DROP_PER_PU`
    - Ví dụ: powerUnit = 95 → speedKmh = 370 - (99-95)*2 = 362 km/h
    - Ví dụ: powerUnit = 78 → speedKmh = 370 - (99-78)*2 = 328 km/h
  
  - ✅ **DRS Effectiveness** (Hiệu quả DRS)
    - powerUnit > 90: +4% top speed khi DRS active
    - powerUnit 85-90: +7% top speed khi DRS active
    - powerUnit < 85: +12% top speed khi DRS active
    - *Xe yếu hơn được lợi thế DRS nhiều hơn để cân bằng*

- **Constants liên quan:**
  - `SIM_MAX_SPEED_KMH = 370` (tốc độ tối đa cơ bản)
  - `SIM_POWER_UNIT_MAX = 99` (giá trị powerUnit tối đa)
  - `SIM_KMH_DROP_PER_PU = 2` (mỗi điểm powerUnit = 2 km/h)
  - `SIM_DRS_TOP_SPEED_BOOST_PU_GT_90 = 0.04`
  - `SIM_DRS_TOP_SPEED_BOOST_PU_85_TO_90 = 0.07`
  - `SIM_DRS_TOP_SPEED_BOOST_PU_LT_85 = 0.12`

### 2. **downforce** (Lực ép xuống)
- **Giá trị:** 1-99
- **Mặc định:** 75
- **Ảnh hưởng:**
  - ⚠️ **Chưa được sử dụng trong simulation hiện tại**
  - Dự kiến: Ảnh hưởng tốc độ qua cua

### 3. **chassis** (Khung xe)
- **Giá trị:** 1-99
- **Mặc định:** 75
- **Ảnh hưởng:**
  - ⚠️ **Chưa được sử dụng trong simulation hiện tại**
  - Dự kiến: Ảnh hưởng độ ổn định xe

### 4. **reliability** (Độ tin cậy)
- **Giá trị:** 1-99
- **Mặc định:** 75
- **Ảnh hưởng:**
  - ⚠️ **Chưa được sử dụng trong simulation hiện tại**
  - Dự kiến: Xác suất hỏng xe trong race

### 5. **ersDeploy** (Triển khai ERS)
- **Giá trị:** 1-99
- **Mặc định:** 75
- **Ảnh hưởng:**
  - ✅ **ERS Battery Capacity** (Dung lượng pin ERS)
    - Formula: `capacity = SIM_ERS_BATTERY_CAPACITY_REFERENCE_DEPLOY + (ersDeploy - 85) * SIM_ERS_BATTERY_CAPACITY_STEP_PER_DEPLOY`
    - Ví dụ: ersDeploy = 90 → capacity = 85 + (90-85)*2 = 95%
    - Ví dụ: ersDeploy = 78 → capacity = 85 + (78-85)*2 = 71%
  
  - ✅ **ERS Effectiveness** (Hiệu quả ERS)
    - Qualifying: Accel multiplier = 1.05 (khi speed > 270 km/h)
    - Race: Accel boost & speed boost dựa trên rating
    - Formula phức tạp với nhiều mức:
      - 95-90: giảm 0.005 per point
      - 90-85: giảm 0.05 per point
      - 85-80: giảm 0.02 per point
      - 80-70: giảm 0.01 per point

- **Constants liên quan:**
  - `SIM_ERS_BATTERY_START = 100` (pin bắt đầu 100%)
  - `SIM_ERS_MIN_BATTERY_TO_DEPLOY = 15` (cần ít nhất 15% để dùng)
  - `SIM_ERS_ACCEL_MULTIPLIER = 1.03` (tăng gia tốc 3%)
  - `SIM_ERS_SPEED_BOOST_KMH = 10` (tăng 10 km/h)
  - `SIM_ERS_DRAIN_PERCENT_PER_SEC = 10` (xả 10%/giây)
  - `SIM_ERS_CHARGE_PERCENT_PER_SEC = 5` (sạc 5%/giây)
  - `SIM_RACE_ERS_MIN_SPEED_KMH = 250` (chỉ dùng khi > 250 km/h)
  - `SIM_QUALI_ERS_MIN_SPEED_KMH = 270` (qualifying > 270 km/h)

### 6. **tyreDegradation** (Độ mòn lốp)
- **Giá trị:** 1-99 (càng thấp càng tốt)
- **Mặc định:** 25
- **Ảnh hưởng:**
  - ⚠️ **Chưa được sử dụng trong simulation hiện tại**
  - Dự kiến: Ảnh hưởng tốc độ theo thời gian race

### 📊 Car Overall Rating
```javascript
overall = (powerUnit + downforce + chassis + reliability + ersDeploy + (100 - tyreDegradation)) / 6
```

---

## 👤 Chỉ Số Driver (Driver Skills)

### 1. **cornering** (Khả năng qua cua)
- **Giá trị:** 1-99
- **Mặc định:** 75
- **Ảnh hưởng:**
  - ✅ **Qualifying Performance** (28% weight)
    - Ảnh hưởng lớn nhất đến qualifying
    - Formula: `qualifying = cornering * 0.28 + braking * 0.18 + reactions * 0.24 + accuracy * 0.3`

### 2. **braking** (Khả năng phanh)
- **Giá trị:** 1-99
- **Mặc định:** 75
- **Ảnh hưởng:**
  - ✅ **Qualifying Performance** (18% weight)
    - Ảnh hưởng trung bình đến qualifying

### 3. **reactions** (Phản xạ)
- **Giá trị:** 1-99
- **Mặc định:** 75
- **Ảnh hưởng:**
  - ✅ **Qualifying Performance** (24% weight)
    - Ảnh hưởng khá lớn đến qualifying

### 4. **accuracy** (Độ chính xác)
- **Giá trị:** 1-99
- **Mặc định:** 75
- **Ảnh hưởng:**
  - ✅ **Qualifying Performance** (30% weight)
    - Ảnh hưởng lớn nhất đến qualifying (cùng với cornering)

### 5. **control** (Kiểm soát xe)
- **Giá trị:** 1-99
- **Mặc định:** 75
- **Ảnh hưởng:**
  - ⚠️ **Chưa được sử dụng trong simulation hiện tại**
  - Dự kiến: Ảnh hưởng độ ổn định trong race

### 6. **smooth** (Lái mượt mà)
- **Giá trị:** 1-99
- **Mặc định:** 75
- **Ảnh hưởng:**
  - ⚠️ **Chưa được sử dụng trong simulation hiện tại**
  - Dự kiến: Ảnh hưởng độ mòn lốp

### 7. **adaptability** (Khả năng thích nghi)
- **Giá trị:** 1-99
- **Mặc định:** 75
- **Ảnh hưởng:**
  - ⚠️ **Chưa được sử dụng trong simulation hiện tại**
  - Dự kiến: Ảnh hưởng performance trong điều kiện khác nhau

### 8. **overtaking** (Khả năng vượt)
- **Giá trị:** 1-99
- **Mặc định:** 75
- **Ảnh hưởng:**
  - ⚠️ **Chưa được sử dụng trong simulation hiện tại**
  - Dự kiến: Ảnh hưởng khả năng vượt trong race

### 9. **defending** (Khả năng phòng thủ)
- **Giá trị:** 1-99
- **Mặc định:** 75
- **Ảnh hưởng:**
  - ⚠️ **Chưa được sử dụng trong simulation hiện tại**
  - Dự kiến: Ảnh hưởng khả năng giữ vị trí

### 10. **qualifying** (Khả năng qualifying)
- **Giá trị:** 1-99
- **Mặc định:** 75 (hoặc tính từ 4 skills trên)
- **Ảnh hưởng:**
  - ✅ **Qualifying Speed & Acceleration**
    - Pace Multiplier: `effectiveness = 1 - (99 - rating) * 0.02`
    - Accel Multiplier: `1 + 0.04 * effectiveness`
    - Speed Boost: `20 * effectiveness` km/h
    - Ví dụ: qualifying = 95 → effectiveness = 0.92 → +18.4 km/h
    - Ví dụ: qualifying = 75 → effectiveness = 0.52 → +10.4 km/h

- **Formula tính từ skills khác:**
```javascript
qualifying = Math.round(
  cornering * 0.28 +
  braking * 0.18 +
  reactions * 0.24 +
  accuracy * 0.3
)
```

---

## 📈 Tóm Tắt: Chỉ Số Nào Được Dùng?

### ✅ Đang Được Sử Dụng Trong Simulation

#### Car Stats:
1. **powerUnit** → Top speed & DRS effectiveness
2. **ersDeploy** → ERS battery capacity & effectiveness

#### Driver Skills:
1. **cornering** → Qualifying (28%)
2. **braking** → Qualifying (18%)
3. **reactions** → Qualifying (24%)
4. **accuracy** → Qualifying (30%)
5. **qualifying** → Qualifying speed & acceleration boost

### ⚠️ Chưa Được Sử Dụng (Dự Kiến Tương Lai)

#### Car Stats:
- **downforce** → Tốc độ qua cua
- **chassis** → Độ ổn định
- **reliability** → Xác suất hỏng xe
- **tyreDegradation** → Mòn lốp theo thời gian

#### Driver Skills:
- **control** → Độ ổn định trong race
- **smooth** → Độ mòn lốp
- **adaptability** → Performance trong điều kiện khác nhau
- **overtaking** → Khả năng vượt
- **defending** → Khả năng giữ vị trí

---

## 🎯 Ví Dụ Thực Tế

### Ví Dụ 1: Mercedes vs Alpine

**Mercedes (Top Team):**
```javascript
carSetup: {
  powerUnit: 95,      // → 362 km/h top speed
  ersDeploy: 90       // → 95% battery capacity
}
```

**Alpine (Mid Team):**
```javascript
carSetup: {
  powerUnit: 78,      // → 328 km/h top speed
  ersDeploy: 86       // → 87% battery capacity
}
```

**Chênh lệch:** 34 km/h top speed, 8% battery capacity

### Ví Dụ 2: Verstappen vs Colapinto

**Verstappen (Top Driver):**
```javascript
skills: {
  cornering: 95,      // 28% weight
  braking: 96,        // 18% weight
  reactions: 90,      // 24% weight
  accuracy: 87        // 30% weight
}
// → qualifying = 95*0.28 + 96*0.18 + 90*0.24 + 87*0.3 = 91.2
// → +18.2 km/h qualifying boost
```

**Colapinto (Rookie):**
```javascript
skills: {
  cornering: 78,
  braking: 77,
  reactions: 75,
  accuracy: 86
}
// → qualifying = 78*0.28 + 77*0.18 + 75*0.24 + 86*0.3 = 79.7
// → +11.9 km/h qualifying boost
```

**Chênh lệch:** 6.3 km/h qualifying boost

---

## 💡 Tips Để Tối Ưu

### Cho Qualifying:
1. **Tăng powerUnit** → Tốc độ cao hơn
2. **Tăng ersDeploy** → Pin ERS nhiều hơn
3. **Tăng qualifying skills** (cornering, accuracy) → Boost lớn hơn

### Cho Race (Tương lai):
1. **Cân bằng tyreDegradation** → Ít pit stop hơn
2. **Tăng reliability** → Ít hỏng xe
3. **Tăng overtaking/defending** → Tốt hơn trong battle

---

**Lưu ý:** Simulation đang trong giai đoạn phát triển. Nhiều chỉ số sẽ được implement trong tương lai!
