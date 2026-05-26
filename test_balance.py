#!/usr/bin/env python3
"""
Test balance issues in Dynamic Cornering Speed System
"""

# Mercedes setup
mercedes_multiplier = 1.0668
alpine_multiplier = 0.9298

print('=' * 60)
print('KIỂM TRA VẤN ĐỀ 1: HIGH-SPEED AMPLIFICATION')
print('=' * 60)
print()

# Test trên các cua khác nhau
corners = [
    {'name': 'Turn 2 (Slow)', 'base': 85},
    {'name': 'Turn 4 (Medium)', 'base': 130},
    {'name': 'Turn 6 (Fast)', 'base': 208},
    {'name': 'Turn 8 (Very Fast)', 'base': 245}
]

for corner in corners:
    merc = corner['base'] * mercedes_multiplier
    alpine = corner['base'] * alpine_multiplier
    diff = merc - alpine
    percent = (diff / alpine * 100)
    
    print(f"{corner['name']}:")
    print(f"  Mercedes: {merc:.1f} km/h")
    print(f"  Alpine:   {alpine:.1f} km/h")
    print(f"  Chênh lệch: {diff:.1f} km/h ({percent:.1f}%)")
    
    if diff > 30:
        status = '❌ QUÁ LỚN - PHI THỰC TẾ!'
    elif diff > 20:
        status = '⚠️  Hơi lớn'
    elif diff > 10:
        status = '✅ Chấp nhận được'
    else:
        status = '✅ OK'
    
    print(f"  Đánh giá: {status}")
    print()

print()
print('=' * 60)
print('KIỂM TRA VẤN ĐỀ 2: WING SETUP DOMINANCE')
print('=' * 60)
print()

# Breakdown các yếu tố
factors = {
    'Downforce': {'merc': 1.0105, 'alpine': 0.9895},
    'Cornering': {'merc': 1.0036, 'alpine': 0.9916},
    'Wing Setup': {'merc': 1.048, 'alpine': 0.952},
    'Control': {'merc': 1.0005, 'alpine': 0.9975},
    'Chassis': {'merc': 1.003, 'alpine': 0.9982}
}

print('Mercedes vs Alpine - Contribution Analysis:')
print()

contributions = []
for name, f in factors.items():
    merc_impact = (f['merc'] - 1) * 100
    alpine_impact = (f['alpine'] - 1) * 100
    diff = (f['merc'] - f['alpine']) * 100
    
    contributions.append((name, diff))
    
    print(f'{name}:')
    print(f"  Mercedes: {merc_impact:+.2f}% | Alpine: {alpine_impact:+.2f}%")
    print(f"  Contribution to gap: {diff:.2f}%")
    print()

# Tính tổng contribution
total_gap = (mercedes_multiplier - alpine_multiplier) * 100
wing_contribution = (factors['Wing Setup']['merc'] - factors['Wing Setup']['alpine']) * 100
wing_percent = (wing_contribution / total_gap * 100)

print('-' * 60)
print(f'Total gap: {total_gap:.2f}%')
print(f'Wing contribution: {wing_contribution:.2f}% ({wing_percent:.1f}% of total)')
print()

if wing_percent > 60:
    status = '❌ QUÁ CAO - KHÔNG CÂN BẰNG!'
elif wing_percent > 40:
    status = '⚠️  Hơi cao'
else:
    status = '✅ OK'

print(f'Wing dominance: {status}')
print()

# Ranking contributions
print('=' * 60)
print('RANKING CONTRIBUTIONS (Highest to Lowest):')
print('=' * 60)
print()

contributions.sort(key=lambda x: x[1], reverse=True)
for i, (name, contrib) in enumerate(contributions, 1):
    percent_of_total = (contrib / total_gap * 100)
    print(f"{i}. {name}: {contrib:.2f}% ({percent_of_total:.1f}% of total gap)")

print()
print('=' * 60)
print('KẾT LUẬN')
print('=' * 60)
print()

# Issue 1 conclusion
max_diff = max(corner['base'] * (mercedes_multiplier - alpine_multiplier) for corner in corners)
print(f"Vấn đề 1 - High-Speed Amplification:")
print(f"  Chênh lệch tối đa: {max_diff:.1f} km/h (Turn 8)")
if max_diff > 30:
    print(f"  ❌ NGHIÊM TRỌNG: Chênh lệch quá lớn, phi thực tế!")
    print(f"  💡 Giải pháp: Giảm impact ranges hoặc dùng additive thay vì multiplicative")
elif max_diff > 20:
    print(f"  ⚠️  CẢNH BÁO: Chênh lệch hơi lớn")
else:
    print(f"  ✅ OK: Chênh lệch chấp nhận được")

print()

# Issue 2 conclusion
print(f"Vấn đề 2 - Wing Setup Dominance:")
print(f"  Wing chiếm {wing_percent:.1f}% tổng gap")
if wing_percent > 60:
    print(f"  ❌ NGHIÊM TRỌNG: Wing setup quá dominant!")
    print(f"  💡 Giải pháp: Giảm wing impact range từ ±8% xuống ±4-5%")
elif wing_percent > 40:
    print(f"  ⚠️  CẢNH BÁO: Wing setup hơi dominant")
else:
    print(f"  ✅ OK: Wing setup cân bằng")

print()
print('=' * 60)
