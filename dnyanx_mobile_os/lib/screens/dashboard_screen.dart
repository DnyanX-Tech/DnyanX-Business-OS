import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:uuid/uuid.dart';
import '../providers/theme_provider.dart';
import '../repositories/sync_repository.dart';
import '../widgets/glass_container.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final SyncRepository _syncRepo = SyncRepository();
  int _dailyGalla = 38950;
  int _netProfit = 8400;
  int _liveStock = 15;
  int _udhaarBalance = 12500;

  @override
  void initState() {
    super.initState();
    _syncRepo.initLocalDatabases();
  }

  void _triggerMasterCheckout() async {
    final invoiceId = const Uuid().v4();
    const customerName = "राहुल पाटील";
    const customerPhone = "9823456789";
    const itemName = "अल्ट्राटेक सिमेंट 50kg";
    const qty = 10;
    const grandTotal = 4543.0;
    const cashReceived = 3543.0;
    const udhaar = 1000.0;
    const profit = 650.0;

    setState(() {
      _dailyGalla += cashReceived.toInt();
      _netProfit += profit.toInt();
      _liveStock -= qty;
      _udhaarBalance += udhaar.toInt();
    });

    await _syncRepo.recordAndDispatchInvoice(
      invoiceId: invoiceId,
      customerName: customerName,
      customerPhone: customerPhone,
      itemName: itemName,
      qty: qty,
      grandTotal: grandTotal,
      cashReceived: cashReceived,
      udhaarBalance: udhaar,
      netProfit: profit,
    );

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: Theme.of(context).primaryColor,
          content: const Text('✅ बिल पूर्ण झाले! साऊंडबॉक्स, स्टॉक व WhatsApp सिंक झाले!'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Provider.of<ThemeProvider>(context);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: theme.brandPrimary,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Text('50X', style: TextStyle(fontWeight: FontWeight.w900, color: Colors.black)),
            ),
            const SizedBox(width: 12),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('DnyanX Empire OS', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                Text('Connected Event-Bus Active', style: TextStyle(fontSize: 10, color: Colors.grey)),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(theme.isDarkMode ? Icons.light_mode : Icons.dark_mode),
            onPressed: () => theme.toggleTheme(),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Real-Time Interconnected Metric Cards
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.4,
              children: [
                GlassContainer(
                  border: Border(left: BorderSide(color: theme.brandPrimary, width: 4)),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('💵 आजचा गल्ला', style: TextStyle(fontSize: 12, color: Colors.grey)),
                      Text('₹$_dailyGalla', style: TextStyle(fontSize: 20, fontWeight: FontWeight.black, color: theme.brandPrimary)),
                      const Text('रोख + UPI जमा', style: TextStyle(fontSize: 10, color: Colors.grey)),
                    ],
                  ),
                ),
                GlassContainer(
                  border: const Border(left: BorderSide(color: Color(0xFF06B6D4), width: 4)),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('📈 निव्वळ नफा', style: TextStyle(fontSize: 12, color: Colors.grey)),
                      Text('₹$_netProfit', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.black, color: Color(0xFF06B6D4))),
                      const Text('२१.५% मार्जिन', style: TextStyle(fontSize: 10, color: Color(0xFF06B6D4))),
                    ],
                  ),
                ),
                GlassContainer(
                  border: const Border(left: BorderSide(color: Color(0xFFF59E0B), width: 4)),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('📦 गोडाऊन स्टॉक', style: TextStyle(fontSize: 12, color: Colors.grey)),
                      Text('$_liveStock पोती उरली', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.black, color: Color(0xFFF59E0B))),
                      const Text('Low-Stock Alert On', style: TextStyle(fontSize: 10, color: Colors.redAccent)),
                    ],
                  ),
                ),
                GlassContainer(
                  border: const Border(left: BorderSide(color: Color(0xFFF43F5E), width: 4)),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('🧾 उधारी बाकी', style: TextStyle(fontSize: 12, color: Colors.grey)),
                      Text('₹$_udhaarBalance', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.black, color: Color(0xFFF43F5E))),
                      const Text('EMI ऑटो-अलर्ट्स', style: TextStyle(fontSize: 10, color: Colors.grey)),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Master Chain-Reaction Trigger
            GlassContainer(
              padding: const EdgeInsets.all(20),
              border: Border.all(color: theme.brandPrimary.withOpacity(0.4), width: 2),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('🚀 १-क्लिक कनेक्टेड बिलिंग इंजिन', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  const Text(
                    'ग्राहक: राहुल पाटील • १० पोती सिमेंट (₹४,५४३)\n१ क्लिक = स्टॉक वजा + साऊंडबॉक्स + WhatsApp + GST पावती!',
                    style: TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: theme.brandPrimary,
                        foregroundColor: Colors.black,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      onPressed: _triggerMasterCheckout,
                      icon: const Icon(Icons.flash_on, size: 22),
                      label: const Text('झटपट बिल करा (Trigger Chain)', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 14)),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomAppBar(
        color: Theme.of(context).cardColor,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            IconButton(icon: const Icon(Icons.point_of_sale), onPressed: () {}),
            IconButton(icon: const Icon(Icons.storefront), onPressed: () {}),
            FloatingActionButton.small(
              backgroundColor: const Color(0xFFF43F5E),
              onPressed: () {},
              child: const Icon(Icons.mic, color: Colors.white),
            ),
            IconButton(icon: const Icon(Icons.volume_up), onPressed: () {}),
            IconButton(icon: const Icon(Icons.qr_code), onPressed: () {}),
          ],
        ),
      ),
    );
  }
}
