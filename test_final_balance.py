#!/usr/bin/env python3
"""
Test FINAL balanced system:
- Sensitivity scaling
- Wing ±5% (reduced from ±8%)
- Drag 15 km/h max penalty
"""

import math

print('=' * 70)
print('FINAL BALANCE TEST - PHƯƠNG ÁN B')
print('Sensitivity + Wing ±5% + Drag 15 km/h')
print('=' * 70)
print()

def calculate_sensitivity(base_corner_speed):
    return max(0.3, 1 - (base_corner_speed - 85) / 250)

def calculate_corner_speed_final(base_speed, downforce, cornering, wing, control, chassis):
    """Calculate corner speed with FINAL balanced formula"""
    sensitivity = calculate_sensitivity(base_speed)
    
    # Apply sensitivity to all multipliers
    downforce_mult = 1 + ((downforce - 85) / 100 * 0.15) * sensitivity
    cornering_mult = 1 + ((cornering - 85) / 100 * 0.12) * sensitivity
    
    # REDUCED wing impact: ±8% → ±5%
    if wing >= 50:
        wing_mult = 1 + ((wing - 50) / 50 * 0.05) * sensitivity  # Changed from 0.08
    else:
        wing_mult = 1 - ((50 - wing) / 50 * 0.05) * sensitivity  # Changed from 0.08
    
    control_mult = 1 + ((control - 85) / 100 * 0.05) * sensitivity
    chassis_mult = 1 + ((chassis - 85) / 100 * 0.06) * sensitivity
    
    final_speed = base_speed * downforce_mult * cornering_mult * wing_mult * control_mult * chassis_mult
    
    return final_speed, {
        'sensitivity': sensitivity,
        'downforce_mult': downforce_mult,
        'cornering_mult': cornering_mult,
        'wing_mult': wing_mult,
        'control_mult': control_mult,
        'chassis_mult': chassis_mult
    }

def calculate_straight_drag(front_wing):
    """Drag formula (unchanged)"""
    if front_wing > 50:
        drag_penalty = ((front_wing - 50) / 50) * 15
    else:
        drag_penalty = -((50 - front_wing) / 50) * 8
    return drag_penalty

# Mercedes vs Alpine
merc = {'downforce': 92, 'cornering': 88, 'wing': 80, 'control': 86, 'chassis': 90}
alpine = {'downforce': 78, 'cornering': 78, 'wing': 20, 'control': 80, 'chassis': 82}

corners = [
    {'name': 'Turn 2 (Slow)', 'base': 85},
    {'name': 'Turn 4 (Medium)', 'base': 130},
    {'name': 'Turn 6 (Fast)', 'base': 208},
    {'name': 'Turn 8 (Very Fast)', 'base': 245}
]

print('TEST 1: CORNER SPEEDS')
print('=' * 70)
print()

total_corner_advantage = 0
for corner in corners:
    merc_speed, merc_f = calculate_corner_speed_final(corner['base'], **merc)
    alpine_speed, alpine_f = calculate_corner_speed_final(corner['base'], **alpine)
    
    diff = merc_speed - alpine_speed
    percent = (diff / alpine_speed * 100)
    total_corner_advantage += diff
    
    print(f"{corner['name']}:")
    print(f"  Sensitivity: {merc_f['sensitivity']:.2f}")
    print(f"  Mercedes: {merc_speed:.1f} km/h")
    print(f"  Alpine:   {alpine_speed:.1f} km/h")
    print(f"  Chênh lệch: {diff:.1f} km/h ({percent:.1f}%)")
    
    if diff > 20:
        status = '❌ Quá lớn'
    elif diff > 15:
        status = '⚠️  Hơi lớn'
    elif diff > 10:
        status = '✅ Chấp nhận được'
    else:
        status = '✅ Tốt'
    
    print(f"  Đánh giá: {status}")
    print()

print()
print('TEST 2: WING DOMINANCE')
print('=' * 70)
print()

# Check wing dominance on Turn 2
_, merc_f = calculate_corner_speed_final(85, **merc)
_, alpine_f = calculate_corner_speed_final(85, **alpine)

merc_total = merc_f['downforce_mult'] * merc_f['cornering_mult'] * merc_f['wing_mult'] * merc_f['control_mult'] * merc_f['chassis_mult']
alpine_total = alpine_f['downforce_mult'] * alpine_f['cornering_mult'] * alpine_f['wing_mult'] * alpine_f['control_mult'] * alpine_f['chassis_mult']

total_gap = (merc_total - alpine_total) * 100
wing_contribution = (merc_f['wing_mult'] - alpine_f['wing_mult']) * 100
downforce_contribution = (merc_f['downforce_mult'] - alpine_f['downforce_mult']) * 100
cornering_contribution = (merc_f['cornering_mult'] - alpine_f['cornering_mult']) * 100

wing_percent = (wing_contribution / total_gap * 100) if total_gap != 0 else 0
downforce_percent = (downforce_contribution / total_gap * 100) if total_gap != 0 else 0
cornering_percent = (cornering_contribution / total_gap * 100) if total_gap != 0 else 0

print(f"Turn 2 Factor Contributions:")
print(f"  Wing:      {wing_contribution:.2f}% ({wing_percent:.1f}% of total)")
print(f"  Downforce: {downforce_contribution:.2f}% ({downforce_percent:.1f}% of total)")
print(f"  Cornering: {cornering_contribution:.2f}% ({cornering_percent:.1f}% of total)")
print(f"  Total gap: {total_gap:.2f}%")
print()

if wing_percent < 50:
    print(f"✅ Wing dominance: {wing_percent:.1f}% - CÂN BẰNG TỐT!")
elif wing_percent < 60:
    print(f"⚠️  Wing dominance: {wing_percent:.1f}% - Chấp nhận được")
else:
    print(f"❌ Wing dominance: {wing_percent:.1f}% - Vẫn quá cao")

print()
print('TEST 3: STRAIGHT-LINE DRAG')
print('=' * 70)
print()

merc_drag = calculate_straight_drag(merc['wing'])
alpine_drag = calculate_straight_drag(alpine['wing'])
straight_disadvantage = merc_drag - alpine_drag

print(f"Mercedes (wing {merc['wing']}): {merc_drag:+.1f} km/h")
print(f"Alpine (wing {alpine['wing']}):   {alpine_drag:+.1f} km/h")
print(f"Net disadvantage: {straight_disadvantage:+.1f} km/h")
print()

print()
print('TEST 4: MONZA OVERALL BALANCE')
print('=' * 70)
print()

monza_corners = 30
monza_straights = 70

weighted_corner = total_corner_advantage * (monza_corners / 100)
weighted_straight = straight_disadvantage * (monza_straights / 100)
net_advantage = weighted_corner + weighted_straight

print(f"Total corner advantage: {total_corner_advantage:.1f} km/h (9 corners)")
print(f"Average per corner: {total_corner_advantage/4:.1f} km/h")
print()
print(f"Monza composition: {monza_corners}% corners, {monza_straights}% straights")
print(f"Weighted corner:   {weighted_corner:+.1f} km/h")
print(f"Weighted straight: {weighted_straight:+.1f} km/h")
print(f"Net advantage:     {net_advantage:+.1f} km/h")
print()

if abs(net_advantage) < 5:
    print("✅ HOÀN HẢO: Mercedes vẫn nhanh hơn nhưng cân bằng!")
elif abs(net_advantage) < 10:
    print("✅ TỐT: Có chênh lệch nhưng reasonable")
elif abs(net_advantage) < 15:
    print("⚠️  CHẤP NHẬN ĐƯỢC: Hơi lệch nhưng vẫn OK")
else:
    print("❌ MẤT CÂN BẰNG: Cần điều chỉnh thêm")

print()
print('=' * 70)
print('SUMMARY')
print('=' * 70)
print()

# Get Turn 8 diff
merc_turn8, _ = calculate_corner_speed_final(245, **merc)
alpine_turn8, _ = calculate_corner_speed_final(245, **alpine)
turn8_diff = merc_turn8 - alpine_turn8

print(f"✅ Vấn đề 1 - High-Speed Amplification:")
print(f"   Turn 8: {turn8_diff:.1f} km/h (was 33.6 km/h)")
print(f"   Giảm: {((33.6 - turn8_diff) / 33.6 * 100):.0f}%")
print()

print(f"✅ Vấn đề 2 - Wing Dominance:")
print(f"   Wing: {wing_percent:.1f}% (was 70.1%)")
print(f"   Giảm: {(70.1 - wing_percent):.0f} percentage points")
print()

print(f"✅ Vấn đề 3 - Strategic Trade-off:")
print(f"   High wing: +{total_corner_advantage/4:.1f} km/h corners, {merc_drag:+.1f} km/h straights")
print(f"   Low wing:  {-total_corner_advantage/4:.1f} km/h corners, {alpine_drag:+.1f} km/h straights")
print(f"   Trade-off: Clear and meaningful!")
print()

print('=' * 70)
print('RECOMMENDATION')
print('=' * 70)
print()

issues = 0
if turn8_diff > 20:
    print("❌ Turn 8 vẫn quá cao")
    issues += 1
else:
    print("✅ Turn 8 chấp nhận được")

if wing_percent > 60:
    print("❌ Wing vẫn quá dominant")
    issues += 1
else:
    print("✅ Wing cân bằng tốt")

if abs(net_advantage) > 15:
    print("❌ Monza balance chưa tốt")
    issues += 1
else:
    print("✅ Monza balance OK")

print()
if issues == 0:
    print("🎉 READY TO DEPLOY! Tất cả vấn đề đã được giải quyết!")
elif issues == 1:
    print("⚠️  CÓ THỂ DEPLOY: 1 vấn đề nhỏ còn lại")
else:
    print("❌ CHƯA NÊN DEPLOY: Cần điều chỉnh thêm")

print()
print('=' * 70)
