import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ThemeProvider extends ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.dark;
  Color _brandPrimary = const Color(0xFF10B981); // Default Emerald

  ThemeMode get themeMode => _themeMode;
  Color get brandPrimary => _brandPrimary;

  bool get isDarkMode => _themeMode == ThemeMode.dark;

  void toggleTheme() {
    _themeMode = isDarkMode ? ThemeMode.light : ThemeMode.dark;
    notifyListeners();
  }

  void setBrandColor(Color newColor) {
    _brandPrimary = newColor;
    notifyListeners();
  }

  ThemeData get currentTheme {
    final baseTheme = isDarkMode ? ThemeData.dark() : ThemeData.light();
    return baseTheme.copyWith(
      scaffoldBackgroundColor: isDarkMode ? const Color(0xFF030712) : const Color(0xFFF8FAFC),
      primaryColor: _brandPrimary,
      cardColor: isDarkMode ? const Color(0xFF0F172A) : const Color(0xFFFFFFFF),
      textTheme: GoogleFonts.plusJakartaSansTextTheme(baseTheme.textTheme),
      colorScheme: ColorScheme.fromSeed(
        seedColor: _brandPrimary,
        brightness: isDarkMode ? Brightness.dark : Brightness.light,
        primary: _brandPrimary,
        surface: isDarkMode ? const Color(0xFF0F172A) : const Color(0xFFFFFFFF),
      ),
    );
  }
}
