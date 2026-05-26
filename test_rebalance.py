#!/usr/bin/env python3
"""
Test rebalanced Dynamic Cornering Speed System with:
1. Speed-based Scaling (sensitivity)
2. Straight-line Drag Formula
"""

import math

print('=' * 70)
print('KIỂM TRA GIẢI PHÁP REBALANCE')
print('=' * 70)
print()

# ============================================================
# GIẢI PHÁP 1: SPEED-BASED SCALING (SENSITIVITY)
# ============================================================

def calculate_sensitivity(base_corner_speed):
    """
    Cua càng nhanh thì sensitivity càng thấp
    85 km/h -> 1.0 (full impact)
    245 km/h -> 0.36 (reduced impact)
    """
    return max(0.3, 1 - (base_corner_speed - 85) / 250)

print('GIẢI PHÁP 1: SPEED-BASED SCALING')
print('=' * 70)
print()

corners = [
    {'name': 'Turn 2 (Slow)', 'base': 85},
    {'name': 'Turn 4 (Medium)', 'base': 130},
    {'name': 'Turn 6 (Fast)', 'base': 208},
    {'name': 'Turn 8 (Very Fast)', 'base': 245}
]

print('Sensitivity by Corner Speed:')
print()
for corner in corners:
    sens = calculate_sensitivity(corner['base'])
    print(f"{corner['name']} ({corner['base']} km/h):")
    print(f"  Sensitivity: {sens:.2f} ({sens*100:.0f}% of full impact)")
    print()

# Test với Mercedes vs Alpine
print('-' * 70)
print('Mercedes vs Alpine với Sensitivity:')
print('-' * 70)
print()

# Mercedes setup
merc_downforce = 92
merc_cornering = 88
merc_wing = 80
merc_control = 86
merc_chassis = 90

# Alpine setup
alpine_downforce = 78
alpine_cornering = 78
alpine_wing = 20
alpine_control = 80
alpine_chassis = 82

def calculate_corner_speed_with_sensitivity(base_speed, downforce, cornering, wing, control, chassis):
    """Calculate corner speed with sensitivity scaling"""
    sensitivity = calculate_sensitivity(base_speed)
    
    # Apply sensitivity to all multipliers
    downforce_mult = 1 + ((downforce - 85) / 100 * 0.15) * sensitivity
    cornering_mult = 1 + ((cornering - 85) / 100 * 0.12) * sensitivity
    
    if wing >= 50:
        wing_mult = 1 + ((wing - 50) / 50 * 0.08) * sensitivity
    else:
        wing_mult = 1 - ((50 - wing) / 50 * 0.08) * sensitivity
    
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

for corner in corners:
    merc_speed, merc_factors = calculate_corner_speed_with_sensitivity(
        corner['base'], merc_downforce, merc_cornering, merc_wing, merc_control, merc_chassis
    )
    alpine_speed, alpine_factors = calculate_corner_speed_with_sensitivity(
        corner['base'], alpine_downforce, alpine_cornering, alpine_wing, alpine_control, alpine_chassis
    )
    
    diff = merc_speed - alpine_speed
    percent = (diff / alpine_speed * 100)
    
    print(f"{corner['name']}:")
    print(f"  Sensitivity: {merc_factors['sensitivity']:.2f}")
    print(f"  Mercedes: {merc_speed:.1f} km/h")
    print(f"  Alpine:   {alpine_speed:.1f} km/h")
    print(f"  Chênh lệch: {diff:.1f} km/h ({percent:.1f}%)")
    
    if diff > 30:
        status = '❌ QUÁ LỚN'
    elif diff > 20:
        status = '⚠️  Hơi lớn'
    elif diff > 15:
        status = '✅ Chấp nhận được'
    else:
        status = '✅ Tốt'
    
    print(f"  Đánh giá: {status}")
    print()

# ============================================================
# GIẢI PHÁP 2: STRAIGHT-LINE DRAG FORMULA
# ============================================================

print()
print('=' * 70)
print('GIẢI PHÁP 2: STRAIGHT-LINE DRAG FORMULA')
print('=' * 70)
print()

def calculate_straight_drag(front_wing):
    """
    Calculate drag penalty/bonus for straight-line speed
    Wing > 50: Penalty (slower on straights)
    Wing < 50: Bonus (faster on straights)
    """
    if front_wing > 50:
        # High wing = High drag = Slower straights
        drag_penalty = ((front_wing - 50) / 50) * 15  # Max 15 km/h penalty
    else:
        # Low wing = Low drag = Faster straights
        drag_penalty = -((50 - front_wing) / 50) * 8  # Max 8 km/h bonus
    
    return drag_penalty

print('Wing Setup Trade-offs:')
print()

wing_setups = [0, 20, 40, 50, 60, 80, 100]

for wing in wing_setups:
    drag = calculate_straight_drag(wing)
    
    # Calculate corner advantage (using Turn 2 as example)
    corner_speed_50, _ = calculate_corner_speed_with_sensitivity(85, 85, 85, 50, 85, 85)
    corner_speed_wing, _ = calculate_corner_speed_with_sensitivity(85, 85, 85, wing, 85, 85)
    corner_advantage = corner_speed_wing - corner_speed_50
    
    print(f"Wing {wing}:")
    print(f"  Corner advantage: {corner_advantage:+.1f} km/h (vs neutral 50)")
    print(f"  Straight penalty:  {drag:+.1f} km/h")
    print(f"  Net effect: {'Balanced' if abs(corner_advantage + drag) < 3 else 'Imbalanced'}")
    print()

# ============================================================
# KIỂM TRA CÂN BẰNG TỔNG THỂ
# ============================================================

print()
print('=' * 70)
print('KIỂM TRA CÂN BẰNG TỔNG THỂ')
print('=' * 70)
print()

# Test Mercedes vs Alpine với cả corner và straight
print('Mercedes (Wing 80) vs Alpine (Wing 20):')
print()

# Corner advantage (tổng 9 cua)
total_corner_advantage = 0
for corner in corners:
    merc_speed, _ = calculate_corner_speed_with_sensitivity(
        corner['base'], merc_downforce, merc_cornering, merc_wing, merc_control, merc_chassis
    )
    alpine_speed, _ = calculate_corner_speed_with_sensitivity(
        corner['base'], alpine_downforce, alpine_cornering, alpine_wing, alpine_control, alpine_chassis
    )
    total_corner_advantage += (merc_speed - alpine_speed)

print(f"Total corner advantage: {total_corner_advantage:.1f} km/h (9 corners)")
print(f"Average per corner: {total_corner_advantage/9:.1f} km/h")
print()

# Straight penalty
merc_drag = calculate_straight_drag(merc_wing)
alpine_drag = calculate_straight_drag(alpine_wing)
straight_disadvantage = merc_drag - alpine_drag

print(f"Mercedes straight penalty: {merc_drag:+.1f} km/h")
print(f"Alpine straight bonus: {alpine_drag:+.1f} km/h")
print(f"Net straight disadvantage: {straight_disadvantage:+.1f} km/h")
print()

# Monza track composition (estimate)
monza_corners_percent = 30  # 30% corners
monza_straights_percent = 70  # 70% straights

weighted_corner = total_corner_advantage * (monza_corners_percent / 100)
weighted_straight = straight_disadvantage * (monza_straights_percent / 100)
net_advantage = weighted_corner + weighted_straight

print(f"Monza track composition: {monza_corners_percent}% corners, {monza_straights_percent}% straights")
print(f"Weighted corner advantage: {weighted_corner:.1f} km/h")
print(f"Weighted straight disadvantage: {weighted_straight:.1f} km/h")
print(f"Net advantage: {net_advantage:+.1f} km/h")
print()

if abs(net_advantage) < 5:
    print("✅ CÂN BẰNG TỐT: Mercedes vẫn nhanh hơn nhưng không quá dominant")
elif abs(net_advantage) < 10:
    print("⚠️  CÂN BẰNG CHẤP NHẬN ĐƯỢC: Có chênh lệch nhưng reasonable")
else:
    print("❌ MẤT CÂN BẰNG: Cần điều chỉnh thêm")

print()
print('=' * 70)
print('KẾT LUẬN')
print('=' * 70)
print()

# Check Turn 8 specifically
merc_turn8, _ = calculate_corner_speed_with_sensitivity(245, merc_downforce, merc_cornering, merc_wing, merc_control, merc_chassis)
alpine_turn8, _ = calculate_corner_speed_with_sensitivity(245, alpine_downforce, alpine_cornering, alpine_wing, alpine_control, alpine_chassis)
turn8_diff = merc_turn8 - alpine_turn8

print(f"Vấn đề 1 - High-Speed Amplification:")
print(f"  Turn 8 chênh lệch: {turn8_diff:.1f} km/h (was 33.6 km/h)")
if turn8_diff < 20:
    print(f"  ✅ GIẢI QUYẾT: Chênh lệch giảm xuống mức chấp nhận được!")
elif turn8_diff < 25:
    print(f"  ⚠️  CẢI THIỆN: Tốt hơn nhưng vẫn hơi cao")
else:
    print(f"  ❌ CHƯA ĐỦ: Vẫn còn quá cao")

print()

# Check wing dominance
merc_total_mult = 1.0
alpine_total_mult = 1.0

for corner in corners[:1]:  # Use Turn 2 as example
    _, merc_f = calculate_corner_speed_with_sensitivity(corner['base'], merc_downforce, merc_cornering, merc_wing, merc_control, merc_chassis)
    _, alpine_f = calculate_corner_speed_with_sensitivity(corner['base'], alpine_downforce, alpine_cornering, alpine_wing, alpine_control, alpine_chassis)
    
    merc_total_mult = merc_f['downforce_mult'] * merc_f['cornering_mult'] * merc_f['wing_mult'] * merc_f['control_mult'] * merc_f['chassis_mult']
    alpine_total_mult = alpine_f['downforce_mult'] * alpine_f['cornering_mult'] * alpine_f['wing_mult'] * alpine_f['control_mult'] * alpine_f['chassis_mult']
    
    total_gap = (merc_total_mult - alpine_total_mult) * 100
    wing_contribution = (merc_f['wing_mult'] - alpine_f['wing_mult']) * 100
    wing_percent = (wing_contribution / total_gap * 100) if total_gap != 0 else 0
    
    print(f"Vấn đề 2 - Wing Setup Dominance (Turn 2):")
    print(f"  Wing contribution: {wing_percent:.1f}% of total gap (was 70.1%)")
    if wing_percent < 50:
        print(f"  ✅ GIẢI QUYẾT: Wing không còn quá dominant!")
    elif wing_percent < 60:
        print(f"  ⚠️  CẢI THIỆN: Tốt hơn nhưng vẫn hơi cao")
    else:
        print(f"  ❌ CHƯA ĐỦ: Vẫn còn quá dominant")

print()
print(f"Vấn đề 3 - Wing Setup Strategy:")
print(f"  Straight-line drag: {abs(straight_disadvantage):.1f} km/h penalty for high wing")
if abs(straight_disadvantage) > 10:
    print(f"  ✅ GIẢI QUYẾT: Trade-off rõ ràng, có ý nghĩa chiến thuật!")
else:
    print(f"  ⚠️  CHƯA ĐỦ: Trade-off chưa đủ mạnh")

print()
print('=' * 70)
