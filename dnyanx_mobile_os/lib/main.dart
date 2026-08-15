import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:provider/provider.dart';
import 'providers/theme_provider.dart';
import 'screens/dashboard_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Hive.initFlutter();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
      ],
      child: const DnyanXEmpireApp(),
    ),
  );
}

class DnyanXEmpireApp extends StatelessWidget {
  const DnyanXEmpireApp({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Provider.of<ThemeProvider>(context);

    return MaterialApp(
      title: '50-in-1 DnyanX Business Empire OS',
      debugShowCheckedModeBanner: false,
      theme: theme.currentTheme,
      home: const DashboardScreen(),
    );
  }
}
