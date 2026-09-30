# Meta Ads OAuth kurulumu

## 1. Meta uygulaması

1. https://developers.facebook.com/apps/ adresinden bir uygulama oluştur veya mevcut uygulamanı aç.
2. Facebook Login / Facebook Login for Business ürününü yapılandır.
3. OAuth redirect URI olarak tam olarak http://localhost:3000/auth/callback ekle.
4. Uygulamanın App ID ve App Secret değerlerini al.
5. Uygulamaya Marketing API erişimini ekle ve ads_read ile business_management izinlerini yapılandır. Meta, uygulama moduna ve kullanıcılarına göre App Review / Advanced Access isteyebilir.

## 2. Yerel ortam

Proje kökünde .env.example dosyasını .env olarak kopyala ve META_APP_ID ile META_APP_SECRET alanlarını doldur. Secret değerini asla GitHub'a gönderme.

İki ayrı terminal aç:

Terminal 1:
```bash
pnpm dev
```

Terminal 2:
```bash
pnpm dev:server
```

Vite arayüzü http://localhost:3000 adresinde, Express API ise http://localhost:3001 adresinde çalışır. Vite, /api ve /auth isteklerini Express'e yönlendirir.

## 3. Akış

- /api/meta/login: state üretir ve kullanıcıyı Meta OAuth iznine yönlendirir.
- /auth/callback: state kontrolü yapar, code'u token'a dönüştürür ve reklam hesaplarını yükler.
- /api/meta/status: bağlı olma durumunu ve hesapları döndürür.
- /api/meta/accounts: bağlı hesapları döndürür.
- /api/meta/logout: uygulama oturumunu kapatır.

## Önemli sınırlar

Bu ilk sürüm token ve oturumları sunucu belleğinde tutar; sunucu yeniden başlatılırsa bağlantı oturumu kaybolur. Canlı, çok kullanıcılı dağıtım için kalıcı ve şifrelenmiş token saklama, kullanıcı kimliğiyle oturum eşleme, CSRF/rate-limit önlemleri ve güvenli oturum deposu eklenmelidir.

Bağlı hesap ekranı gerçek Meta API verisini kullanır. Dashboard, kampanyalar ve AI içgörü ekranlarındaki diğer demo metrikleri bu değişiklikle henüz gerçek veriye bağlanmış değildir.