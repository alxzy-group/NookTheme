# 🌙 NookTheme — Modern Pterodactyl Theme

**NookTheme** adalah tema gratis dan open-source untuk [Pterodactyl Panel](https://pterodactyl.io) yang dirancang dengan tampilan modern, minimalis, dan bersih.

![NookTheme Preview](https://i.imgur.com/AFjHGBr.png)

<details>
<summary>📸 Lihat Tangkapan Layar</summary>

![Image](https://i.imgur.com/CNxF3iT.png)  
![Image](https://i.imgur.com/IflRtEX.png)  
![Image](https://i.imgur.com/vNLK5jP.png)  
![Image](https://i.imgur.com/dnxV2CS.png)

</details>

---

## ⚠️ Prasyarat Sebelum Memulai

- PHP 8.2 atau lebih baru (**disarankan** PHP 8.3)
- Node.js v16
- Composer dan Yarn terinstal
- Backup penuh direktori `/var/www/pterodactyl`
- Pterodactyl versi terbaru (pastikan kompatibilitas tema)

---

## 🛠️ Langkah Instalasi NookTheme

### 1. Upgrade PHP ke Versi 8.3 (Jika Diperlukan)

<details>
<summary>Langkah-langkah Upgrade PHP</summary>

```bash
sudo apt update
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y php8.3 php8.3-cli php8.3-common php8.3-mysql php8.3-mbstring php8.3-xml php8.3-curl php8.3-zip php8.3-bcmath php8.3-fpm

# Verifikasi versi
php -v
```

</details>

---

### 2. Masuk ke Maintenance Mode

```bash
cd /var/www/pterodactyl
php artisan down
```

---

### 3. Unduh dan Ekstrak NookTheme

```bash
curl -L https://github.com/alands-offc/NookTheme/releases/latest/download/panel.tar.gz | tar -xzv
```

---

### 4. Atur Izin Folder

```bash
chmod -R 755 storage/* bootstrap/cache
```

---

### 5. Perbarui Dependency dan Build Aset

> Pastikan **Node.js v16** digunakan.

```bash
composer install --no-dev --optimize-autoloader

yarn
yarn build:production
```

---

### 6. Bersihkan Cache & Konfigurasi

```bash
php artisan view:clear
php artisan config:clear
```

---

### 7. Migrasi & Seed Database

```bash
php artisan migrate --seed --force
```

---

### 8. Atur Kepemilikan File

```bash
# Ubuntu/Debian dengan NGINX atau Apache:
chown -R www-data:www-data /var/www/pterodactyl/*

# CentOS + NGINX:
chown -R nginx:nginx /var/www/pterodactyl/*

# CentOS + Apache:
chown -R apache:apache /var/www/pterodactyl/*
```

---

### 9. Restart Queue Worker

```bash
php artisan queue:restart
```

---

### 10. Keluar dari Maintenance Mode

```bash
php artisan up
```

---

## 📚 Dokumentasi Terkait

- [Panduan Panel Pterodactyl](https://pterodactyl.io/panel/1.0/getting_started.html)  
- [Instalasi Wings](https://pterodactyl.io/wings/1.0/installing.html)  
- [Panduan Komunitas](https://pterodactyl.io/community/about.html)  
- [Bergabung ke Discord Nookure](https://discord.nookure.com)  

---

## ⭐ Riwayat Bintang GitHub

<a href="https://star-history.com/#Nookure/NookTheme&Timeline">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Nookure/NookTheme&type=Timeline&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Nookure/NookTheme&type=Timeline" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Nookure/NookTheme&type=Timeline" />
  </picture>
</a>

---

## 📄 Lisensi

- **Pterodactyl Panel** © 2015–2023 oleh Dane Everitt dan kontributor.  
  Dirilis di bawah [MIT License](./LICENSE.md).  

- **NookTheme** dikembangkan oleh Nookure.  
  Modifikasi dan desain ulang dirilis di bawah [GNU GPLv3 License](./NookLicense.md).

> ⚠️ **Nookure tidak berafiliasi dengan Pterodactyl Panel atau pengembang resminya.**
