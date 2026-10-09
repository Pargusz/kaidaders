# YKS Planım

TYT ve AYT konularını sınav gününe kadar günlere dağıtan, gün gün tikleyerek takip edilen çalışma takvimi. Telefona "Ana ekrana ekle" ile uygulama gibi kurulabilir.

## Özellikler

- **Bugün:** günün konuları, geciken konular ("Bugüne al" / "Planı yeniden dengele"), kendi görevlerin, odak sayacı (25/5, 50/10), soru sayacı, günlük not
- **Takvim:** aylık görünüm. Her günün konuları, ilerleme çubuğu, deneme ve tekrar günleri. Güne dokununca detayı açılır
- **Konular:** TYT ve AYT konu listesi, ders bazında ilerleme, arama, planlanan güne gitme
- **Deneme:** TYT/AYT net girişi (D − Y/4 otomatik), net grafiği, son/en iyi/ortalama
- **İstatistik:** seri (streak), 6 aylık çalışma ısı haritası, haftalık soru grafiği, ders ilerlemeleri, plana göre önde/geride durumu
- **Aralıklı tekrar:** biten her konu 1 gün, 1 hafta ve 1 ay sonra tekrar olarak karşına çıkar
- **Ayarlar:** alan (SAY/EA/SÖZ), sınav tarihi, günlük konu sayısı, deneme günü, son tekrar dönemi, plana dahil dersler, tema, yedek indir/yükle
- **Bulut:** Google ile giriş yapınca veriler Firebase Realtime Database'e kaydedilir, telefon ve bilgisayar senkron kalır. Giriş yapılmazsa veriler tarayıcıda durur

## Firebase kurulumu (bir kez)

[Firebase Console](https://console.firebase.google.com/project/kaidaders) üzerinden:

1. **Authentication → Sign-in method → Google** sağlayıcısını etkinleştir.
2. **Authentication → Settings → Authorized domains** listesine `KULLANICI_ADI.github.io` adresini ekle.
3. **Realtime Database → Rules** sekmesine `database.rules.json` içeriğini yapıştırıp **Publish** de. Böylece herkes yalnızca kendi verisini okuyup yazabilir.

## GitHub Pages ile yayınlama

1. GitHub'da yeni bir repo aç (ör. `yks-planim`).
2. Bu klasörü o repoya gönder:
   ```bash
   git remote add origin https://github.com/KULLANICI_ADI/yks-planim.git
   git push -u origin main
   ```
3. Repo → **Settings → Pages → Build and deployment**: *Deploy from a branch*, branch `main`, klasör `/ (root)`.
4. Birkaç dakika sonra site `https://KULLANICI_ADI.github.io/yks-planim/` adresinde yayında olur.

## Yerelde çalıştırma

```bash
python3 -m http.server 5173
```

Sonra `http://localhost:5173` adresini aç. (ES modülleri kullanıldığı için dosyayı çift tıklayarak açmak çalışmaz.)

## Dosyalar

- `js/data.js`: konu listesi ve deneme bölümleri. Konu eklerken listenin **sonuna** ekle, çünkü konu kimlikleri sıradan üretiliyor
- `js/app.js`: arayüz ve plan mantığı
- `js/store.js`: yerel kayıt + Firebase senkronizasyonu
- `js/firebase-config.js`: Firebase proje ayarları
