// YKS konu listesi. Konu kimliği = `${ders.id}:${sıra}` olduğu için
// var olan listelerin sırasını değiştirmek yerine sona ekleme yapın.

export const SUBJECTS = [
  // ---------------- TYT ----------------
  {
    id: 'tyt-tur', exam: 'TYT', name: 'Türkçe', color: '#ef4444',
    topics: [
      'Sözcükte Anlam', 'Cümlede Anlam', 'Paragraf: Ana Düşünce', 'Paragraf: Yardımcı Düşünce',
      'Paragraf Yapısı ve Anlatım Biçimleri', 'Ses Bilgisi', 'Yazım Kuralları', 'Noktalama İşaretleri',
      'Sözcük Yapısı (Kök-Ek)', 'İsim ve Sıfat', 'Zamir ve Zarf', 'Edat, Bağlaç, Ünlem',
      'Fiiller (Kip, Kişi, Ek Fiil)', 'Fiilimsiler', 'Fiilde Çatı', 'Cümlenin Ögeleri',
      'Cümle Türleri', 'Anlatım Bozuklukları',
    ],
  },
  {
    id: 'tyt-mat', exam: 'TYT', name: 'Matematik', color: '#3b82f6',
    topics: [
      'Temel Kavramlar', 'Sayı Basamakları', 'Bölme ve Bölünebilme', 'EBOB - EKOK',
      'Rasyonel Sayılar', 'Basit Eşitsizlikler', 'Mutlak Değer', 'Üslü Sayılar', 'Köklü Sayılar',
      'Çarpanlara Ayırma', 'Oran - Orantı', 'Denklem Çözme', 'Sayı Problemleri', 'Kesir Problemleri',
      'Yaş Problemleri', 'Yüzde, Kâr - Zarar', 'Karışım Problemleri', 'Hareket Problemleri',
      'İşçi - Havuz Problemleri', 'Grafik Problemleri', 'Rutin Olmayan Problemler', 'Kümeler',
      'Mantık', 'Fonksiyonlar', 'Polinomlar', '2. Dereceden Denklemler', 'Permütasyon',
      'Kombinasyon', 'Binom', 'Olasılık', 'Veri - İstatistik',
    ],
  },
  {
    id: 'tyt-geo', exam: 'TYT', name: 'Geometri', color: '#06b6d4',
    topics: [
      'Doğruda ve Üçgende Açılar', 'Dik Üçgen ve Pisagor', 'İkizkenar ve Eşkenar Üçgen',
      'Açıortay ve Kenarortay', 'Üçgende Alan', 'Üçgende Benzerlik', 'Açı - Kenar Bağıntıları',
      'Çokgenler', 'Dörtgenler', 'Yamuk', 'Paralelkenar', 'Eşkenar Dörtgen ve Deltoid',
      'Dikdörtgen ve Kare', 'Çember ve Daire', 'Noktanın ve Doğrunun Analitiği', 'Katı Cisimler',
    ],
  },
  {
    id: 'tyt-fiz', exam: 'TYT', name: 'Fizik', color: '#8b5cf6',
    topics: [
      'Fizik Bilimine Giriş', 'Madde ve Özellikleri', 'Hareket ve Kuvvet', "Newton'un Hareket Yasaları",
      'İş, Güç ve Enerji', 'Isı, Sıcaklık ve Genleşme', 'Basınç', 'Kaldırma Kuvveti', 'Elektrostatik',
      'Elektrik Akımı ve Devreler', 'Manyetizma', 'Dalgalar', 'Optik: Aydınlanma, Gölge, Yansıma',
      'Optik: Aynalar', 'Optik: Kırılma ve Mercekler',
    ],
  },
  {
    id: 'tyt-kim', exam: 'TYT', name: 'Kimya', color: '#10b981',
    topics: [
      'Kimya Bilimi', 'Atom ve Periyodik Sistem', 'Kimyasal Türler Arası Etkileşimler',
      'Maddenin Halleri', 'Doğa ve Kimya', 'Kimyanın Temel Kanunları', 'Mol Kavramı',
      'Kimyasal Tepkimeler ve Hesaplamalar', 'Karışımlar', 'Asitler, Bazlar ve Tuzlar', 'Kimya Her Yerde',
    ],
  },
  {
    id: 'tyt-bio', exam: 'TYT', name: 'Biyoloji', color: '#84cc16',
    topics: [
      'Canlıların Ortak Özellikleri', 'Canlıların Temel Bileşenleri', 'Hücre ve Organeller',
      'Hücre Zarından Madde Geçişi', 'Canlıların Sınıflandırılması', 'Mitoz ve Eşeysiz Üreme',
      'Mayoz ve Eşeyli Üreme', 'Kalıtım', 'Ekosistem Ekolojisi', 'Güncel Çevre Sorunları',
    ],
  },
  {
    id: 'tyt-tar', exam: 'TYT', name: 'Tarih', color: '#f59e0b',
    topics: [
      'Tarih ve Zaman', 'İnsanlığın İlk Dönemleri', "Orta Çağ'da Dünya", 'İlk ve Orta Çağlarda Türk Dünyası',
      'İslam Medeniyetinin Doğuşu', 'İlk Türk-İslam Devletleri', 'Selçuklu Türkiyesi',
      'Beylikten Devlete Osmanlı', 'Dünya Gücü Osmanlı', 'Değişen Dünya Dengeleri ve Osmanlı',
      'Değişim Çağında Avrupa ve Osmanlı', 'Uluslararası İlişkilerde Denge Stratejisi (1774-1914)',
      'XX. Yüzyıl Başlarında Osmanlı ve Dünya', 'Milli Mücadele', 'Atatürkçülük ve Türk İnkılabı',
    ],
  },
  {
    id: 'tyt-cog', exam: 'TYT', name: 'Coğrafya', color: '#b45309',
    topics: [
      'Doğa ve İnsan', "Dünya'nın Şekli ve Hareketleri", 'Coğrafi Konum', 'Harita Bilgisi',
      'Atmosfer ve Sıcaklık', 'Basınç, Rüzgâr ve Nem', 'İklim Tipleri', 'İç ve Dış Kuvvetler',
      'Su, Toprak ve Bitki', 'Nüfus', 'Göç', 'Yerleşme', "Türkiye'nin Yer Şekilleri",
      'Ekonomik Faaliyetler', 'Bölgeler', 'Uluslararası Ulaşım Hatları', 'Doğal Afetler',
    ],
  },
  {
    id: 'tyt-fel', exam: 'TYT', name: 'Felsefe', color: '#ec4899',
    topics: [
      'Felsefeye Giriş', 'Bilgi Felsefesi', 'Varlık Felsefesi', 'Ahlak Felsefesi', 'Sanat Felsefesi',
      'Din Felsefesi', 'Siyaset Felsefesi', 'Bilim Felsefesi',
    ],
  },
  {
    id: 'tyt-din', exam: 'TYT', name: 'Din Kültürü', color: '#64748b',
    topics: [
      'Bilgi ve İnanç', 'İslam ve İbadet', 'Ahlak ve Değerler', 'Allah - İnsan İlişkisi',
      'Hz. Muhammed (s.a.v.)', 'Vahiy ve Akıl', 'İslam Düşüncesinde Yorumlar', 'Din, Kültür ve Medeniyet',
    ],
  },

  // ---------------- AYT ----------------
  {
    id: 'ayt-mat', exam: 'AYT', name: 'Matematik', color: '#2563eb',
    topics: [
      'Fonksiyonlar (İleri)', 'Polinomlar (AYT)', '2. Dereceden Denklemler (AYT)', 'Parabol',
      'Eşitsizlikler', 'Trigonometri 1', 'Trigonometri 2', 'Üstel ve Logaritmik Fonksiyonlar',
      'Diziler', 'Limit ve Süreklilik', 'Türev', 'Türev Uygulamaları', 'Belirsiz İntegral',
      'Belirli İntegral ve Alan', 'Permütasyon, Kombinasyon, Olasılık (AYT)',
    ],
  },
  {
    id: 'ayt-geo', exam: 'AYT', name: 'Geometri', color: '#0891b2',
    topics: [
      'Üçgenler (Tekrar ve İleri)', 'Çokgenler ve Dörtgenler (AYT)', 'Çemberde Açı ve Uzunluk',
      'Dairede Alan', 'Doğrunun Analitiği', 'Dönüşüm Geometrisi', 'Çemberin Analitiği', 'Katı Cisimler (AYT)',
    ],
  },
  {
    id: 'ayt-fiz', exam: 'AYT', name: 'Fizik', color: '#7c3aed',
    topics: [
      'Vektörler', 'Bağıl Hareket', "Newton'un Hareket Yasaları (AYT)", 'Bir Boyutta Sabit İvmeli Hareket',
      'İki Boyutta Hareket (Atışlar)', 'Enerji ve Hareket', 'İtme ve Momentum', 'Tork ve Denge',
      'Kütle Merkezi', 'Basit Makineler', 'Elektriksel Kuvvet ve Alan', 'Elektriksel Potansiyel',
      'Düzgün Elektrik Alan ve Sığa', 'Manyetizma ve Elektromanyetik İndüksiyon',
      'Alternatif Akım ve Transformatörler', 'Çembersel Hareket', 'Basit Harmonik Hareket',
      'Dalga Mekaniği', 'Atom Fiziği ve Radyoaktivite', 'Modern Fizik', 'Modern Fiziğin Teknolojideki Uygulamaları',
    ],
  },
  {
    id: 'ayt-kim', exam: 'AYT', name: 'Kimya', color: '#059669',
    topics: [
      'Modern Atom Teorisi', 'Gazlar', 'Sıvı Çözeltiler ve Çözünürlük', 'Kimyasal Tepkimelerde Enerji',
      'Tepkime Hızları', 'Kimyasal Denge', 'Asit - Baz Dengesi', 'Çözünürlük Dengesi',
      'Kimya ve Elektrik', 'Karbon Kimyasına Giriş', 'Organik Bileşikler',
      'Enerji Kaynakları ve Bilimsel Gelişmeler',
    ],
  },
  {
    id: 'ayt-bio', exam: 'AYT', name: 'Biyoloji', color: '#65a30d',
    topics: [
      'Sinir Sistemi', 'Endokrin Sistem', 'Duyu Organları', 'Destek ve Hareket Sistemi',
      'Sindirim Sistemi', 'Dolaşım ve Bağışıklık Sistemi', 'Solunum Sistemi', 'Boşaltım Sistemi',
      'Üreme Sistemi ve Embriyonik Gelişim', 'Komünite ve Popülasyon Ekolojisi',
      'Nükleik Asitler ve Genetik Şifre', 'Protein Sentezi', 'Canlılık ve Enerji (ATP)', 'Fotosentez',
      'Kemosentez', 'Hücresel Solunum', 'Bitki Biyolojisi', 'Canlılar ve Çevre',
    ],
  },
  {
    id: 'ayt-edb', exam: 'AYT', name: 'Edebiyat', color: '#f97316',
    topics: [
      'Şiir Bilgisi ve Anlam', 'Edebi Sanatlar', 'Nazım Biçimleri ve Türleri', 'Düzyazı Türleri',
      'İslamiyet Öncesi Türk Edebiyatı', 'Geçiş Dönemi Edebiyatı', 'Halk Edebiyatı', 'Divan Edebiyatı',
      'Tanzimat Edebiyatı', 'Servet-i Fünun ve Fecr-i Âti', 'Millî Edebiyat',
      'Cumhuriyet Dönemi (1923-1940)', 'Cumhuriyet Dönemi (1940-1960)', 'Cumhuriyet Dönemi (1960 Sonrası)',
      'Edebi Akımlar', 'Dünya Edebiyatı',
    ],
  },
  {
    id: 'ayt-tar', exam: 'AYT', name: 'Tarih', color: '#d97706',
    topics: [
      'Tarih Bilimi (AYT)', 'İlk Uygarlıklar', 'İlk Türk Devletleri', 'İslam Tarihi ve Türk-İslam Devletleri',
      'Türkiye Tarihi (Selçuklu)', 'Osmanlı Kuruluş ve Yükselme', 'Osmanlı Kültür ve Medeniyeti',
      'Arayış Yılları (XVII. yy)', 'Diplomasi ve Değişim (XVIII. yy)', 'En Uzun Yüzyıl (XIX. yy)',
      'XX. Yüzyıl Başlarında Osmanlı', 'I. Dünya Savaşı', 'Milli Mücadele (AYT)',
      'Atatürk İlke ve İnkılapları', 'İki Savaş Arası Dönem', 'II. Dünya Savaşı', 'Soğuk Savaş Dönemi',
      'Yumuşama Dönemi ve Sonrası', 'Küreselleşen Dünya',
    ],
  },
  {
    id: 'ayt-cog', exam: 'AYT', name: 'Coğrafya', color: '#92400e',
    topics: [
      'Ekosistemler ve Madde Döngüsü', 'Biyoçeşitlilik', 'Nüfus Politikaları',
      "Türkiye'de Nüfus ve Yerleşme", 'Ekonomik Faaliyetler ve Doğal Kaynaklar', 'Türkiye Ekonomisi',
      "Türkiye'nin İşlevsel Bölgeleri", 'Küresel Ticaret', 'Bölgeler ve Ülkeler', 'Çevre ve Toplum',
      'Doğal Afetler (AYT)',
    ],
  },
  {
    id: 'ayt-fgr', exam: 'AYT', name: 'Felsefe Grubu', color: '#d946ef',
    topics: [
      'Psikoloji Bilimini Tanıyalım', 'Psikolojinin Temel Süreçleri', 'Öğrenme, Bellek, Düşünme',
      'Ruh Sağlığının Temelleri', 'Sosyolojiye Giriş', 'Birey ve Toplum', 'Toplumsal Yapı',
      'Toplumsal Değişme ve Gelişme', 'Toplum ve Kültür', 'Toplumsal Kurumlar', 'Mantığa Giriş',
      'Klasik Mantık', 'Mantık ve Dil', 'Sembolik Mantık', 'Felsefe Tarihi (MÖ 6. yy - 20. yy)',
    ],
  },
  {
    id: 'ayt-din', exam: 'AYT', name: 'Din Kültürü', color: '#475569',
    topics: [
      'Dünya ve Ahiret', "Kur'an'a Göre Hz. Muhammed", "Kur'an'da Bazı Kavramlar",
      'İnançla İlgili Meseleler', 'Yahudilik ve Hristiyanlık', 'Hint ve Çin Dinleri',
    ],
  },
];

export const ALANLAR = {
  say: { name: 'Sayısal', ayt: ['ayt-mat', 'ayt-geo', 'ayt-fiz', 'ayt-kim', 'ayt-bio'] },
  ea:  { name: 'Eşit Ağırlık', ayt: ['ayt-mat', 'ayt-geo', 'ayt-edb', 'ayt-tar', 'ayt-cog'] },
  soz: { name: 'Sözel', ayt: ['ayt-edb', 'ayt-tar', 'ayt-cog', 'ayt-fgr', 'ayt-din'] },
};

// Deneme bölümleri: [anahtar, ad, soru sayısı]
export const DENEME = {
  TYT: [['tur', 'Türkçe', 40], ['sos', 'Sosyal', 20], ['mat', 'Matematik', 40], ['fen', 'Fen', 20]],
  'AYT-say': [['mat', 'Matematik', 40], ['fiz', 'Fizik', 14], ['kim', 'Kimya', 13], ['bio', 'Biyoloji', 13]],
  'AYT-ea': [['mat', 'Matematik', 40], ['edb', 'Edebiyat', 24], ['tar', 'Tarih-1', 10], ['cog', 'Coğrafya-1', 6]],
  'AYT-soz': [['edb', 'Edebiyat', 24], ['tar1', 'Tarih-1', 10], ['cog1', 'Coğrafya-1', 6], ['tar2', 'Tarih-2', 11],
    ['cog2', 'Coğrafya-2', 11], ['fel', 'Felsefe Grubu', 12], ['din', 'Din', 6]],
};

export const MOTIVASYON = [
  'Küçük adımlar, büyük sonuçlar.',
  'Bugün yaptığın, yarınki sıralamanı belirler.',
  'Disiplin, motivasyon bittiğinde devreye girer.',
  'Bir konu daha = bir adım daha yakın.',
  'Yorulunca dinlen, ama bırakma.',
  'Her soru bir şey öğretir, yanlışlar bile.',
  'Seri bozulmasın, bugün de tikle!',
  'Netler bir gecede artmaz ama her gün artar.',
];
