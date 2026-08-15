import 'dart:convert';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:hive/hive.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:blue_thermal_printer/blue_thermal_printer.dart';
import 'package:http/http.dart' as http;

class SyncRepository {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final AudioPlayer _audioPlayer = AudioPlayer();
  final BlueThermalPrinter _bluetooth = BlueThermalPrinter.instance;
  final String backendUrl = 'https://dnyan-x-business-os.vercel.app';

  late Box _invoicesBox;
  late Box _inventoryBox;

  Future<void> initLocalDatabases() async {
    _invoicesBox = await Hive.openBox('local_invoices');
    _inventoryBox = await Hive.openBox('local_inventory');
  }

  // 1. ATOMIC RECORD TRANSACTION (Local Hive -> Thermal Print -> Soundbox -> Firestore Sync)
  Future<void> recordAndDispatchInvoice({
    required String invoiceId,
    required String customerName,
    required String customerPhone,
    required String itemName,
    required int qty,
    required double grandTotal,
    required double cashReceived,
    required double udhaarBalance,
    required double netProfit,
  }) async {
    final invoiceData = {
      'invoiceId': invoiceId,
      'customerName': customerName,
      'customerPhone': customerPhone,
      'itemName': itemName,
      'qty': qty,
      'grandTotal': grandTotal,
      'cashReceived': cashReceived,
      'udhaarBalance': udhaarBalance,
      'netProfit': netProfit,
      'isSynced': false,
      'timestamp': DateTime.now().toIso8601String(),
    };

    // Step A: Save to Hive (Immediate Offline-First write)
    await _invoicesBox.put(invoiceId, invoiceData);

    // Step B: Deduct Local Stock immediately
    int currentStock = _inventoryBox.get(itemName, defaultValue: 15);
    _inventoryBox.put(itemName, currentStock - qty);

    // Step C: Trigger Thermal Printing asynchronously
    _printReceipt(customerName, itemName, qty, grandTotal, udhaarBalance);

    // Step D: Trigger Audio Confirmation (In-App Soundbox)
    _playAudioSoundbox(cashReceived);

    // Step E: Dispatch WhatsApp Webhook via Node.js Backend
    _dispatchWhatsAppReceipt(customerPhone, customerName, itemName, grandTotal, udhaarBalance);

    // Step F: Silently Sync to Firestore in Background
    _syncToFirestore(invoiceData);
  }

  Future<void> _printReceipt(String name, String item, int qty, double total, double due) async {
    try {
      List<BluetoothDevice> devices = await _bluetooth.getBondedDevices();
      if (devices.isNotEmpty) {
        await _bluetooth.connect(devices.first);
        _bluetooth.printCustom("राधे हार्डवेअर & सप्लायर्स", 3, 1);
        _bluetooth.printLeftRight("ग्राहक:", name, 1);
        _bluetooth.printLeftRight("साहित्य:", "$item ($qty)", 1);
        _bluetooth.printLeftRight("एकूण देय:", "Rs. $total", 2);
        if (due > 0) _bluetooth.printLeftRight("उधारी बाकी:", "Rs. $due", 2);
        _bluetooth.printCustom("खरेदीबद्दल धन्यवाद!", 1, 1);
        _bluetooth.paperCut();
      }
    } catch (_) {
      // Gracefully continue without halting billing
    }
  }

  Future<void> _playAudioSoundbox(double amount) async {
    try {
      await http.post(
        Uri.parse('$backendUrl/api/empire/soundbox-trigger'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'amount': amount}),
      );
    } catch (_) {}
  }

  Future<void> _dispatchWhatsAppReceipt(String phone, String name, String item, double total, double due) async {
    try {
      final msg = "🧾 *अधिकृत बिल पावती*\n\nनमस्कार *$name*,\n• साहित्य: $item\n• एकूण रक्कम: *₹$total*\n• उधारी बाकी: *₹$due*\n\nधन्यवाद!\n_DnyanX Business OS_";
      await http.post(
        Uri.parse('$backendUrl/api/webhooks/whatsapp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'entry': [
            {
              'changes': [
                {
                  'value': {
                    'messages': [
                      {
                        'from': phone,
                        'text': {'body': msg}
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }),
      );
    } catch (_) {}
  }

  Future<void> _syncToFirestore(Map<String, dynamic> invoiceData) async {
    try {
      await _firestore.collection('invoices').doc(invoiceData['invoiceId']).set(
        {...invoiceData, 'isSynced': true},
        SetOptions(merge: true),
      );
      invoiceData['isSynced'] = true;
      await _invoicesBox.put(invoiceData['invoiceId'], invoiceData);
    } catch (_) {
      // Stays marked as isSynced: false in Hive, retried on next background sync cycle
    }
  }
}
