// ==============================================================================
// 🚀 DNYANX ULTIMATE BUSINESS OS - FLUTTER ONE-THUMB UI/UX SPECIFICATION
// ==============================================================================
// Dependencies required in pubspec.yaml:
//   flutter_animate: ^4.5.0
//   lottie: ^3.1.2
//   shimmer: ^3.0.0
//   glassmorphism_ui: ^0.3.0
//   google_fonts: ^6.2.1
//   vibration: ^2.0.1
// ==============================================================================

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

// -----------------------------------------------------------------------------
// 1. DYNAMIC THEME ENGINE & WCAG AAA CONTRAST PALETTE
// -----------------------------------------------------------------------------
class DnyanXTheme {
  static const Color backgroundDark = Color(0xFF030712);
  static const Color surfaceDark = Color(0xFF0F172A);
  static const Color borderDark = Color(0x1FFFFFFF);

  static ThemeData getDarkTheme(Color primaryColor) {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: backgroundDark,
      primaryColor: primaryColor,
      colorScheme: ColorScheme.dark(
        primary: primaryColor,
        secondary: const Color(0xFF0EA5E9),
        surface: surfaceDark,
      ),
      fontFamily: 'Plus Jakarta Sans',
    );
  }
}

// -----------------------------------------------------------------------------
// 2. 60FPS GLASSMORPHISM CARD WIDGET
// -----------------------------------------------------------------------------
class DnyanXGlassCard extends StatelessWidget {
  final Widget child;
  final VoidCallback? onTap;
  final EdgeInsetsGeometry padding;

  const DnyanXGlassCard({
    super.key,
    required this.child,
    this.onTap,
    this.padding = const EdgeInsets.all(16),
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        if (onTap != null) {
          HapticFeedback.lightImpact(); // Micro-interaction haptic feedback
          onTap!();
        }
      },
      child: Container(
        padding: padding,
        decoration: BoxDecoration(
          color: const Color(0xFF0F172A).withOpacity(0.65),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white.withOpacity(0.08)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.35),
              blurRadius: 24,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: child,
      ),
    );
  }
}

// -----------------------------------------------------------------------------
// 3. ONE-THUMB BOTTOM NAVIGATION (FITTS'S LAW OPTIMIZED)
// -----------------------------------------------------------------------------
class DnyanXOneThumbDock extends StatelessWidget {
  final int selectedIndex;
  final Function(int) onTabChanged;
  final VoidCallback onQuickBillPressed;

  const DnyanXOneThumbDock({
    super.key,
    required this.selectedIndex,
    required this.onTabChanged,
    required this.onQuickBillPressed,
  });

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Container(
        height: 72,
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: const Color(0xFF0B132B).withOpacity(0.85),
          borderRadius: BorderRadius.circular(36),
          border: Border.all(color: Colors.white.withOpacity(0.1)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildNavItem(0, Icons.home_rounded, "होम"),
            _buildNavItem(1, Icons.receipt_long_rounded, "बिलिंग"),
            
            // Central Elevated Quick Bill Button (+)
            Transform.translate(
              offset: const Offset(0, -14),
              child: GestureDetector(
                onTap: () {
                  HapticFeedback.heavyImpact();
                  onQuickBillPressed();
                },
                child: Container(
                  width: 58,
                  height: 58,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const LinearGradient(
                      colors: [Color(0xFF10B981), Color(0xFF06B6D4)],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF10B981).withOpacity(0.4),
                        blurRadius: 18,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: const Icon(Icons.add, color: Color(0xFF030712), size: 34),
                ),
              ),
            ),

            _buildNavItem(2, Icons.qr_code_2_rounded, "QR पे"),
            _buildNavItem(3, Icons.chat_bubble_outline_rounded, "व्हॉट्सॲप"),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    final isSelected = selectedIndex == index;
    return GestureDetector(
      onTap: () {
        HapticFeedback.selectionClick();
        onTabChanged(index);
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            color: isSelected ? const Color(0xFF10B981) : const Color(0xFF64748B),
            size: 22,
          ),
          const SizedBox(height: 3),
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              color: isSelected ? const Color(0xFF10B981) : const Color(0xFF64748B),
            ),
          ),
        ],
      ),
    );
  }
}
