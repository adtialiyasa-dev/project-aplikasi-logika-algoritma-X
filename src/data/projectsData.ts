import { CapstoneProject } from '../types.ts';

export const CAPSTONE_PROJECTS: CapstoneProject[] = [
  {
    id: 'proyek-1',
    title: '1. Sistem Kasir Kantin Sehat Sekolah Digital',
    description: 'Membangun aplikasi konsol kasir interaktif untuk stan kantin sekolah yang mendukung pemilihan menu, perhitungan porsi, kalkulasi diskon siswa berdasarkan ambang batas belanja, dan penentuan uang kembalian.',
    objective: 'Mengintegrasikan struktur sekuensial, percabangan if-else majemuk, serta validasi pembayaran dalam menyelesaikan masalah transaksi ekonomi di sekolah.',
    inputOutputRequirements: [
      'Input: Kode menu pilihan makanan/minuman (1-4).',
      'Input: Jumlah porsi pembelian (integer positif).',
      'Input: Jumlah uang tunai yang diserahkan pembeli.',
      'Output: Rincian struk kasir yang memuat nama item, harga satuan, subtotal kotor, potongan diskon (10% jika belanja >= Rp 40.000), total tagihan, dan uang kembalian.',
      'Penanganan Kesalahan: Peringatan jika kode menu tidak terdaftar atau jika uang pembayaran kurang dari total tagihan.'
    ],
    algorithmSteps: [
      '1. Tampilkan daftar menu makanan dan minuman beserta harganya ke layar.',
      '2. Minta siswa memasukkan nomor menu pilihan.',
      '3. Validasi nomor menu: Jika nomor di luar rentang, cetak pesan error dan akhiri program.',
      '4. Minta input jumlah porsi yang dibeli.',
      '5. Hitung total kotor = hargaSatuan * porsi.',
      '6. Periksa syarat diskon: Jika total kotor >= 40.000, diskon = total kotor * 0.10; Jika tidak, diskon = 0.',
      '7. Hitung total bayar = total kotor - diskon.',
      '8. Tampilkan rincian tagihan kepada pembeli.',
      '9. Minta input uang yang dibayarkan oleh pembeli.',
      '10. Periksa kecukupan uang: Jika uangBayar >= totalBayar, hitung kembalian = uangBayar - totalBayar dan cetak ucapan terima kasih; jika kurang, tampilkan nominal kekurangan uang.'
    ],
    pseudocode: `ALGORITMA KasirKantinSekolah
DEKLARASI:
    pilihan, porsi, hargaSatuan : integer
    namaMenu : string
    totalKotor, diskon, totalBayar, uangBayar, kembalian : integer

DESKRIPSI:
    MULAI
    Tampilkan "=== KASIR KANTIN SEHAT SMA ==="
    Tampilkan "1. Nasi Soto Ayam (Rp 15.000)"
    Tampilkan "2. Nasi Goreng Spesial (Rp 13.000)"
    Tampilkan "3. Siomay Ikan Segar (Rp 10.000)"
    Tampilkan "4. Es Teh Manis Segar (Rp 4.000)"
    Input pilihan

    PILIH (pilihan):
        1: namaMenu = "Nasi Soto Ayam"; hargaSatuan = 15000
        2: namaMenu = "Nasi Goreng Spesial"; hargaSatuan = 13000
        3: namaMenu = "Siomay Ikan Segar"; hargaSatuan = 10000
        4: namaMenu = "Es Teh Manis Segar"; hargaSatuan = 4000
        DEFAULT: Tampilkan "Menu tidak tersedia!"; SELESAI
    AKHIR PILIH

    Input porsi
    totalKotor = hargaSatuan * porsi

    JIKA totalKotor >= 40000 MAKA
        diskon = totalKotor * 0.10
    JIKA TIDAK
        diskon = 0
    AKHIR JIKA

    totalBayar = totalKotor - diskon
    Tampilkan "Total Tagihan: Rp ", totalBayar
    Input uangBayar

    JIKA uangBayar >= totalBayar MAKA
        kembalian = uangBayar - totalBayar
        Tampilkan "Uang Kembalian: Rp ", kembalian
    JIKA TIDAK
        Tampilkan "Uang Anda kurang Rp ", (totalBayar - uangBayar)
    AKHIR JIKA
    SELESAI`,
    flowchartSummary: 'Mulai -> Tampilkan Menu -> Input Pilihan -> Decision (Pilihan Valid?) -> [False: Cetak Pesan Error -> Selesai] -> [True: Input Porsi -> Hitung Subtotal -> Decision (Subtotal >= 40.000?) -> Hitung Diskon -> Input Pembayaran -> Decision (Uang Cukup?) -> Tampilkan Kembalian -> Selesai]',
    referenceCppCode: `#include <iostream>
#include <string>

int main() {
    std::cout << "========================================" << std::endl;
    std::cout << "        KASIR KANTIN SEHAT SMA          " << std::endl;
    std::cout << "========================================" << std::endl;
    std::cout << "1. Nasi Soto Ayam      : Rp 15.000" << std::endl;
    std::cout << "2. Nasi Goreng Spesial : Rp 13.000" << std::endl;
    std::cout << "3. Siomay Ikan Segar   : Rp 10.000" << std::endl;
    std::cout << "4. Es Jeruk Peras      : Rp 5.000" << std::endl;
    std::cout << "----------------------------------------" << std::endl;

    int pilihan;
    std::cout << "Pilih nomor menu (1-4): ";
    std::cin >> pilihan;

    std::string namaMenu;
    int hargaSatuan = 0;

    if (pilihan == 1) {
        namaMenu = "Nasi Soto Ayam";
        hargaSatuan = 15000;
    } else if (pilihan == 2) {
        namaMenu = "Nasi Goreng Spesial";
        hargaSatuan = 13000;
    } else if (pilihan == 3) {
        namaMenu = "Siomay Ikan Segar";
        hargaSatuan = 10000;
    } else if (pilihan == 4) {
        namaMenu = "Es Jeruk Peras";
        hargaSatuan = 5000;
    } else {
        std::cout << "Error: Nomor menu yang dimasukkan tidak valid!" << std::endl;
        return 0;
    }

    int porsi;
    std::cout << "Jumlah porsi yang dipesan: ";
    std::cin >> porsi;

    if (porsi <= 0) {
        std::cout << "Error: Jumlah porsi harus lebih besar dari 0!" << std::endl;
        return 0;
    }

    int totalKotor = hargaSatuan * porsi;
    int diskon = 0;

    // Diskon 10% jika belanja mencapai minimal Rp 40.000
    if (totalKotor >= 40000) {
        diskon = totalKotor * 0.10;
    }

    int totalBayar = totalKotor - diskon;

    std::cout << "\\n---------- STRUK PEMBELIAN ----------" << std::endl;
    std::cout << "Menu Dipesan : " << namaMenu << std::endl;
    std::cout << "Harga Satuan : Rp " << hargaSatuan << std::endl;
    std::cout << "Jumlah Porsi : " << porsi << std::endl;
    std::cout << "Total Kotor  : Rp " << totalKotor << std::endl;
    std::cout << "Diskon (10%) : Rp " << diskon << std::endl;
    std::cout << "TOTAL BAYAR  : Rp " << totalBayar << std::endl;
    std::cout << "--------------------------------------" << std::endl;

    int uangDiberikan;
    std::cout << "Masukkan uang pembayaran: Rp ";
    std::cin >> uangDiberikan;

    if (uangDiberikan >= totalBayar) {
        int kembalian = uangDiberikan - totalBayar;
        std::cout << "Kembalian    : Rp " << kembalian << std::endl;
        std::cout << "Terima kasih telah berbelanja di Kantin Sekolah!" << std::endl;
    } else {
        int kekurangan = totalBayar - uangDiberikan;
        std::cout << "Maaf, uang pembayaran kurang sebesar Rp " << kekurangan << std::endl;
    }

    return 0;
}`,
    testScenarios: [
      {
        scenario: 'Pemesanan 3 porsi Soto Ayam (diskon terpenuhi karena 45.000 >= 40.000), bayar Rp 50.000',
        input: '1 3 50000',
        expectedOutput: 'Total Bayar: Rp 40500, Kembalian: Rp 9500'
      },
      {
        scenario: 'Pemesanan 2 porsi Siomay (20.000 < 40.000, tanpa diskon), bayar Rp 20.000',
        input: '3 2 20000',
        expectedOutput: 'Total Bayar: Rp 20000, Kembalian: Rp 0'
      },
      {
        scenario: 'Input kode menu tidak valid (misal 9)',
        input: '9',
        expectedOutput: 'Pesan error nomor menu tidak valid'
      }
    ],
    rubric: [
      {
        criteria: '1. Analisis Masalah',
        weight: 20,
        description: 'Kemampuan mengidentifikasi kebutuhan entitas transaksi kantin, rumus diskon, dan skenario pembayaran.',
        levelExcellent: 'Menganalisis kebutuhan I/O, kondisi diskon, dan potensi kegagalan pembayaran secara komprehensif (18-20 poin).',
        levelGood: 'Menganalisis variabel utama dengan baik, namun ada skenario batas yang belum terpetakan (14-17 poin).',
        levelDeveloping: 'Hanya mencatat input output dasar tanpa memperhatikan alur kegagalan transaksi (0-13 poin).'
      },
      {
        criteria: '2. Ketepatan Algoritma & Flowchart',
        weight: 25,
        description: 'Penyusunan langkah algoritma, pseudocode terstandar, dan kejelasan alur logika flowchart.',
        levelExcellent: 'Pseudocode dan flowchart sangat terstruktur, simbol standar tepat, dan alur percabangan jelas tanpa ambigu (23-25 poin).',
        levelGood: 'Algoritma logis namun simbol flowchart atau notasi pseudocode ada yang kurang presisi (18-22 poin).',
        levelDeveloping: 'Langkah algoritma meloncat-loncat dan logika percabangan membingungkan (0-17 poin).'
      },
      {
        criteria: '3. Kebenaran Program C++',
        weight: 25,
        description: 'Sintaksis kode valid, penggunaan variabel dan tipe data tepat, serta implementasi logika percabangan benar.',
        levelExcellent: 'Kode rapi, terindentasi sempurna, menggunakan tipe data yang efisien, dan berhasil dikompilasi tanpa warning (23-25 poin).',
        levelGood: 'Kode berfungsi sesuai spesifikasi, terdapat sedikit ketidakkonsistenan penamaan variabel (18-22 poin).',
        levelDeveloping: 'Kode mengalami kesalahan sintaks atau rumus diskon salah hitung (0-17 poin).'
      },
      {
        criteria: '4. Pengujian & Penanganan Kesalahan',
        weight: 15,
        description: 'Ketangguhan program dalam menangani input batas (boundary testing) dan masukan tidak valid.',
        levelExcellent: 'Program memvalidasi kode menu tidak valid, jumlah porsi negatif, dan uang kurang dengan pesan informatif (14-15 poin).',
        levelGood: 'Program menangani uang kurang namun belum memvalidasi porsi bernilai negatif (10-13 poin).',
        levelDeveloping: 'Tidak ada validasi; program crash atau menghasilkan total minus jika diberi data tak wajar (0-9 poin).'
      },
      {
        criteria: '5. Dokumentasi & Refleksi Pembelajaran',
        weight: 15,
        description: 'Komentar penjelasan pada kode sumber dan kedalaman refleksi mindful mengenai proses berpikir.',
        levelExcellent: 'Dokumentasi baris kode jelas, menyertakan catatan refleksi bermakna mengenai etika transaksi jujur (14-15 poin).',
        levelGood: 'Dokumentasi ada namun singkat, refleksi bersifat umum (10-13 poin).',
        levelDeveloping: 'Tidak ada dokumentasi kode maupun catatan refleksi (0-9 poin).'
      }
    ]
  },
  {
    id: 'proyek-2',
    title: '2. Program Pengolahan Nilai Rapor & Ranking Siswa',
    description: 'Aplikasi untuk guru mata pelajaran dalam merekapitulasi nilai tugas, UTS, dan UAS sejumlah N siswa, menghitung nilai akhir terbobot, menentukan predikat kelulusan (A/B/C/D/E), serta mencari nilai tertinggi dan terendah di kelas.',
    objective: 'Mengintegrasikan perulangan for/while, array penampung nilai, perhitungan rata-rata akumulatif, dan pencarian nilai ekstrem dalam pengelolaan data akademik.',
    inputOutputRequirements: [
      'Input: Jumlah siswa di kelas (N).',
      'Input berulang untuk setiap siswa: Nama, Nilai Tugas (bobot 30%), Nilai UTS (bobot 30%), dan Nilai UAS (bobot 40%).',
      'Output: Tabel rekapitulasi nilai akhir: NilaiAkhir = (0.3 * Tugas) + (0.3 * UTS) + (0.4 * UAS).',
      'Output: Predikat mutu dan status kelulusan (Lulus jika NilaiAkhir >= 75).',
      'Output Ringkasan Kelas: Rata-rata nilai kelas, nilai tertinggi, dan nilai terendah.'
    ],
    algorithmSteps: [
      '1. Baca jumlah siswa N.',
      '2. Inisialisasi totalNilaiKelas = 0, nilaiTertinggi = 0, nilaiTerendah = 100.',
      '3. Lakukan perulangan dari siswa 1 sampai N.',
      '4. Baca nama, nilai tugas, UTS, dan UAS.',
      '5. Hitung nilai akhir berbobot.',
      '6. Tentukan predikat huruf menggunakan percabangan if-else.',
      '7. Akumulasikan nilai akhir ke totalNilaiKelas.',
      '8. Perbarui nilaiTertinggi jika nilaiAkhir > nilaiTertinggi; perbarui nilaiTerendah jika nilaiAkhir < nilaiTerendah.',
      '9. Setelah perulangan selesai, hitung rata-rata kelas = totalNilaiKelas / N.',
      '10. Tampilkan laporan statistik performa kelas.'
    ],
    pseudocode: `ALGORITMA PengolahanNilaiRapor
DEKLARASI:
    n, i : integer
    tugas, uts, uas, akhir : double
    totalKelas, rataKelas, maks, min : double
    predikat, status : string

DESKRIPSI:
    MULAI
    Input n
    totalKelas = 0; maks = -1; min = 101

    UNTUK i = 1 SAMPAI n LAKUKAN:
        Input tugas, uts, uas
        akhir = (0.3 * tugas) + (0.3 * uts) + (0.4 * uas)
        totalKelas = totalKelas + akhir

        JIKA akhir >= 90 MAKA predikat = "A"
        LAIN JIKA akhir >= 80 MAKA predikat = "B"
        LAIN JIKA akhir >= 75 MAKA predikat = "C"
        LAIN JIKA akhir >= 60 MAKA predikat = "D"
        LAIN predikat = "E"

        JIKA akhir > maks MAKA maks = akhir
        JIKA akhir < min MAKA min = akhir
    AKHIR UNTUK

    rataKelas = totalKelas / n
    Tampilkan "Rata-rata Kelas: ", rataKelas
    Tampilkan "Nilai Tertinggi: ", maks
    Tampilkan "Nilai Terendah : ", min
    SELESAI`,
    flowchartSummary: 'Mulai -> Input N Siswa -> Inisialisasi Akumulator & Ekstremum -> Loop (i = 1 to N) -> Input 3 Komponen Nilai -> Kalkulasi Bobot -> Update Statistik -> Selesai Loop -> Tampilkan Rekapitulasi Rapor -> Selesai',
    referenceCppCode: `#include <iostream>
#include <iomanip>

int main() {
    int jumlahSiswa;
    std::cout << "Masukkan jumlah siswa: ";
    std::cin >> jumlahSiswa;

    if (jumlahSiswa <= 0) {
        std::cout << "Jumlah siswa harus lebih dari 0!" << std::endl;
        return 0;
    }

    double totalNilaiKelas = 0.0;
    double nilaiTertinggi = 0.0;
    double nilaiTerendah = 100.0;

    for (int i = 1; i <= jumlahSiswa; i++) {
        std::cout << "\\n--- Data Siswa ke-" << i << " ---" << std::endl;
        double tugas, uts, uas;
        std::cout << "Nilai Tugas (bobot 30%): ";
        std::cin >> tugas;
        std::cout << "Nilai UTS   (bobot 30%): ";
        std::cin >> uts;
        std::cout << "Nilai UAS   (bobot 40%): ";
        std::cin >> uas;

        double nilaiAkhir = (0.30 * tugas) + (0.30 * uts) + (0.40 * uas);
        totalNilaiKelas += nilaiAkhir;

        if (nilaiAkhir > nilaiTertinggi) nilaiTertinggi = nilaiAkhir;
        if (nilaiAkhir < nilaiTerendah) nilaiTerendah = nilaiAkhir;

        char predikat;
        if (nilaiAkhir >= 90) predikat = 'A';
        else if (nilaiAkhir >= 80) predikat = 'B';
        else if (nilaiAkhir >= 75) predikat = 'C';
        else if (nilaiAkhir >= 60) predikat = 'D';
        else predikat = 'E';

        std::cout << "Nilai Akhir: " << nilaiAkhir << " | Predikat: " << predikat;
        if (nilaiAkhir >= 75) {
            std::cout << " [LULUS]" << std::endl;
        } else {
            std::cout << " [REMEDIAL]" << std::endl;
        }
    }

    double rataKelas = totalNilaiKelas / jumlahSiswa;
    std::cout << "\\n========================================" << std::endl;
    std::cout << "         STATISTIK KELAS                " << std::endl;
    std::cout << "========================================" << std::endl;
    std::cout << "Rata-rata Kelas : " << rataKelas << std::endl;
    std::cout << "Nilai Tertinggi : " << nilaiTertinggi << std::endl;
    std::cout << "Nilai Terendah  : " << nilaiTerendah << std::endl;

    return 0;
}`,
    testScenarios: [
      {
        scenario: 'Input 2 siswa: Siswa 1 (80, 80, 90 -> 84), Siswa 2 (70, 70, 80 -> 74)',
        input: '2 80 80 90 70 70 80',
        expectedOutput: 'Siswa 1 Lulus (84), Siswa 2 Remedial (74), Rata-rata 79'
      }
    ],
    rubric: [
      {
        criteria: '1. Analisis Masalah',
        weight: 20,
        description: 'Pemahaman bobot penilaian akademik dan statistik dasar.',
        levelExcellent: 'Pemahaman mendalam tentang kalkulasi bobot desimal dan akumulasi nilai (18-20 poin).',
        levelGood: 'Formula bobot benar namun pembulatan belum terperinci (14-17 poin).',
        levelDeveloping: 'Tidak memperhitungkan pembobotan nilai (0-13 poin).'
      },
      {
        criteria: '2. Ketepatan Algoritma',
        weight: 25,
        description: 'Desain perulangan N kali dan pembaruan nilai ekstrem.',
        levelExcellent: 'Inisialisasi ekstremum dan struktur perulangan tepat sasaran (23-25 poin).',
        levelGood: 'Perulangan berjalan namun penentuan nilai terendah kurang tepat saat awal (18-22 poin).',
        levelDeveloping: 'Terjadi infinite loop atau akumulasi rata-rata salah bagi (0-17 poin).'
      },
      {
        criteria: '3. Kebenaran Program C++',
        weight: 25,
        description: 'Penggunaan tipe double, stream I/O terformat, dan modularitas.',
        levelExcellent: 'Kode menggunakan tipe double dan sintaks bersih tanpa cacat kompilasi (23-25 poin).',
        levelGood: 'Kode berjalan normal dengan sedikit kelemahan formatting (18-22 poin).',
        levelDeveloping: 'Terjadi integer division bug (misal 30/100 = 0) (0-17 poin).'
      },
      {
        criteria: '4. Pengujian & Penanganan Kesalahan',
        weight: 15,
        description: 'Validasi input jumlah siswa dan rentang nilai (0-100).',
        levelExcellent: 'Mampu menangani jumlah siswa 0 dan nilai di luar batas 100 (14-15 poin).',
        levelGood: 'Menangani jumlah siswa positif (10-13 poin).',
        levelDeveloping: 'Program error saat siswa dimasukkan angka 0 (division by zero) (0-9 poin).'
      },
      {
        criteria: '5. Dokumentasi & Refleksi',
        weight: 15,
        description: 'Pencatatan proses belajar dan refleksi keadilan evaluasi siswa.',
        levelExcellent: 'Refleksi komprehensif tentang transparansi penilaian pendidikan (14-15 poin).',
        levelGood: 'Refleksi standar tentang fungsi perulangan (10-13 poin).',
        levelDeveloping: 'Tidak ada refleksi tertulis (0-9 poin).'
      }
    ]
  },
  {
    id: 'proyek-3',
    title: '3. Mesin Kalkulator Aritmetika Lengkap Berbasis Menu',
    description: 'Aplikasi kalkulator konsol serbaguna yang menyajikan menu interaktif berulang (menggunakan do-while) untuk operasi penjumlahan, pengurangan, perkalian, pembagian riil, modulus bilangan bulat, dan pemangkatan sederhana.',
    objective: 'Menguasai penggunaan konstruksi do-while loop untuk menu interaktif, switch-case, dan pencegahan runtime error pembagian dengan nol.',
    inputOutputRequirements: [
      'Input: Pilihan operasi dari menu (1: Tambah, 2: Kurang, 3: Kali, 4: Bagi, 5: Sisa Bagi, 0: Keluar).',
      'Input: Dua buah operan angka (a dan b).',
      'Output: Hasil perhitungan yang tepat dan rapi.',
      'Penanganan Khusus: Peringatan jika pembagi bernilai nol pada operasi pembagian dan modulus.'
    ],
    algorithmSteps: [
      '1. Tampilkan menu pilihan operasi kalkulator.',
      '2. Baca nomor pilihan pengguna.',
      '3. Jika pilihan == 0, tampilkan pesan pamit dan hentikan program.',
      '4. Baca dua buah bilangan dari pengguna.',
      '5. Evaluasi operasi menggunakan struktur switch-case.',
      '6. Jika operasi bagi (4) atau modulus (5) dan angka kedua adalah 0, tampilkan pesan "Error: Pembagian dengan nol tidak terdefinisi!".',
      '7. Tampilkan hasil kalkulasi.',
      '8. Tanyakan apakah ingin menghitung kembali, ulangi selama pilihan != 0.'
    ],
    pseudocode: `ALGORITMA KalkulatorMenu
DEKLARASI:
    pilih : integer
    a, b, hasil : double

DESKRIPSI:
    MULAI
    LAKUKAN:
        Tampilkan Menu Pilihan (1. Tambah, 2. Kurang, 3. Kali, 4. Bagi, 0. Keluar)
        Input pilih
        JIKA pilih == 0 MAKA SELESAI
        Input a, b
        PILIH (pilih):
            1: hasil = a + b; Cetak hasil
            2: hasil = a - b; Cetak hasil
            3: hasil = a * b; Cetak hasil
            4: JIKA b != 0 MAKA hasil = a / b; Cetak hasil
               LAIN Cetak "Error: Bagi Nol"
        AKHIR PILIH
    SELAMA pilih != 0
    SELESAI`,
    flowchartSummary: 'Loop do-while -> Cetak Menu -> Input Pilihan -> Decision (Pilihan == 0?) -> [True: Keluar] -> [False: Input A dan B -> Switch (Pilihan) -> Evaluasi & Validasi Zero Division -> Cetak Hasil -> Loop]',
    referenceCppCode: `#include <iostream>

int main() {
    int pilihan;

    do {
        std::cout << "\\n=================================" << std::endl;
        std::cout << "      KALKULATOR ARITMETIKA      " << std::endl;
        std::cout << "=================================" << std::endl;
        std::cout << "1. Penjumlahan (+)" << std::endl;
        std::cout << "2. Pengurangan (-)" << std::endl;
        std::cout << "3. Perkalian   (*)" << std::endl;
        std::cout << "4. Pembagian   (/)" << std::endl;
        std::cout << "5. Modulus Sisa Bagi (%)" << std::endl;
        std::cout << "0. Keluar dari Program" << std::endl;
        std::cout << "Pilih operasi (0-5): ";
        std::cin >> pilihan;

        if (pilihan == 0) {
            std::cout << "Terima kasih telah menggunakan kalkulator!" << std::endl;
            break;
        }

        if (pilihan < 0 || pilihan > 5) {
            std::cout << "Pilihan tidak valid, silakan ulangi." << std::endl;
            continue;
        }

        double bil1, bil2;
        std::cout << "Masukkan bilangan pertama: ";
        std::cin >> bil1;
        std::cout << "Masukkan bilangan kedua  : ";
        std::cin >> bil2;

        switch (pilihan) {
            case 1:
                std::cout << "Hasil " << bil1 << " + " << bil2 << " = " << (bil1 + bil2) << std::endl;
                break;
            case 2:
                std::cout << "Hasil " << bil1 << " - " << bil2 << " = " << (bil1 - bil2) << std::endl;
                break;
            case 3:
                std::cout << "Hasil " << bil1 << " * " << bil2 << " = " << (bil1 * bil2) << std::endl;
                break;
            case 4:
                if (bil2 == 0) {
                    std::cout << "Error Matematika: Pembagian dengan nol tidak terdefinisi!" << std::endl;
                } else {
                    std::cout << "Hasil " << bil1 << " / " << bil2 << " = " << (bil1 / bil2) << std::endl;
                }
                break;
            case 5:
                if (static_cast<int>(bil2) == 0) {
                    std::cout << "Error Matematika: Modulus dengan nol tidak diperbolehkan!" << std::endl;
                } else {
                    int mod = static_cast<int>(bil1) % static_cast<int>(bil2);
                    std::cout << "Hasil " << static_cast<int>(bil1) << " % " << static_cast<int>(bil2) << " = " << mod << std::endl;
                }
                break;
        }
    } while (pilihan != 0);

    return 0;
}`,
    testScenarios: [
      {
        scenario: 'Pembagian normal 15 / 3 menghasilkan 5',
        input: '4 15 3 0',
        expectedOutput: 'Hasil 15 / 3 = 5'
      },
      {
        scenario: 'Pembagian dengan nol 10 / 0',
        input: '4 10 0 0',
        expectedOutput: 'Pesan Error: Pembagian dengan nol tidak terdefinisi'
      }
    ],
    rubric: [
      {
        criteria: '1. Analisis Masalah',
        weight: 20,
        description: 'Pemetaan operasi aritmetika dan penanganan skenario khusus pembagian nol.',
        levelExcellent: 'Analisis menyeluruh mencakup tipe data bilangan bulat vs riil dan zero division (18-20 poin).',
        levelGood: 'Memetakan operasi dasar dengan baik (14-17 poin).',
        levelDeveloping: 'Belum memperhitungkan resiko crash pembagian nol (0-13 poin).'
      },
      {
        criteria: '2. Ketepatan Algoritma',
        weight: 25,
        description: 'Perancangan menu berulang (do-while) dan seleksi percabangan switch-case.',
        levelExcellent: 'Struktur menu modular, kondisi berhenti perulangan tepat, dan alur jelas (23-25 poin).',
        levelGood: 'Menu berulang berjalan baik, terdapat sedikit redundancy kode (18-22 poin).',
        levelDeveloping: 'Program hanya berjalan satu kali lalu langsung mati (0-17 poin).'
      },
      {
        criteria: '3. Kebenaran Program C++',
        weight: 25,
        description: 'Sintaksis switch-case dengan break yang benar dan konversi tipe data yang aman.',
        levelExcellent: 'Switch-case menggunakan break di setiap cabang, casting aman, dan bersih dari error (23-25 poin).',
        levelGood: 'Berfungsi dengan baik tanpa fall-through yang tidak disengaja (18-22 poin).',
        levelDeveloping: 'Ada bug fall-through karena lupa mengetikkan break; (0-17 poin).'
      },
      {
        criteria: '4. Pengujian & Penanganan Kesalahan',
        weight: 15,
        description: 'Pengujian operasi pembagian nol dan pilihan menu di luar angka yang disediakan.',
        levelExcellent: 'Uji pembagian nol berhasil ditangani secara anggun dengan pesan edukatif (14-15 poin).',
        levelGood: 'Mencegah pembagian nol pada opsi 4 (10-13 poin).',
        levelDeveloping: 'Program crash saat dicoba membagi dengan angka 0 (0-9 poin).'
      },
      {
        criteria: '5. Dokumentasi & Refleksi',
        weight: 15,
        description: 'Komentar penjelasan di setiap case dan refleksi pentingnya pencegahan runtime exception.',
        levelExcellent: 'Refleksi mendalam tentang stabilitas sistem aplikasi komputasi (14-15 poin).',
        levelGood: 'Dokumentasi memadai (10-13 poin).',
        levelDeveloping: 'Tidak ada dokumentasi (0-9 poin).'
      }
    ]
  },
  {
    id: 'proyek-4',
    title: '4. Sistem Pencatatan Peminjaman Buku Perpustakaan',
    description: 'Aplikasi pencatatan sirkulasi perpustakaan sekolah yang menghitung durasi peminjaman buku, mendeteksi keterlambatan pengembalian melebihi batas 7 hari, dan mengakumulasikan denda harian secara otomatis.',
    objective: 'Menggabungkan manipulasi data input tanggal/hari, percabangan perhitungan denda bertingkat, dan pembuatan rekapitulasi ringkasan perpustakaan.',
    inputOutputRequirements: [
      'Input: Judul buku, nama peminjam, lama peminjaman aktual (dalam satuan hari).',
      'Batas Peminjaman Bebas Denda: 7 hari pertama.',
      'Aturan Denda: Rp 1.000 per hari untuk keterlambatan 1-3 hari; Rp 2.000 per hari untuk hari ke-4 dan seterusnya.',
      'Output: Rincian status pengembalian, status tepat waktu / terlambat, jumlah hari keterlambatan, dan total denda yang harus dibayar.'
    ],
    algorithmSteps: [
      '1. Input nama peminjam, judul buku, dan lama pinjam (hari).',
      '2. Periksa apakah lama pinjam <= 7.',
      '3. Jika YA: status = "Tepat Waktu", denda = 0.',
      '4. Jika TIDAK: hitung hariTelat = lamaPinjam - 7.',
      '5. Jika hariTelat <= 3, denda = hariTelat * 1000.',
      '6. Jika hariTelat > 3, denda = (3 * 1000) + ((hariTelat - 3) * 2000).',
      '7. Tampilkan tanda bukti pengembalian buku dan status denda.'
    ],
    pseudocode: `ALGORITMA SirkulasiPerpustakaan
DEKLARASI:
    nama, judul : string
    lamaPinjam, hariTelat, denda : integer

DESKRIPSI:
    MULAI
    Input nama, judul, lamaPinjam
    JIKA lamaPinjam <= 7 MAKA
        denda = 0
        Tampilkan "Pengembalian Tepat Waktu. Denda: Rp 0"
    JIKA TIDAK
        hariTelat = lamaPinjam - 7
        JIKA hariTelat <= 3 MAKA
            denda = hariTelat * 1000
        JIKA TIDAK
            denda = 3000 + ((hariTelat - 3) * 2000)
        AKHIR JIKA
        Tampilkan "Terlambat ", hariTelat, " hari. Denda: Rp ", denda
    AKHIR JIKA
    SELESAI`,
    flowchartSummary: 'Input Data -> Decision (Lama <= 7 Hari?) -> [True: Denda 0 -> Cetak Tepat Waktu] -> [False: Hitung Hari Telat -> Decision (Telat <= 3?) -> Hitung Denda Tarif 1 / Tarif 2 -> Cetak Denda] -> Selesai',
    referenceCppCode: `#include <iostream>
#include <string>

int main() {
    std::cout << "=== SISTEM SIRKULASI PERPUSTAKAAN SEKOLAH ===" << std::endl;
    std::string namaSiswa, judulBuku;
    int lamaPinjam;

    std::cout << "Nama Peminjam : ";
    std::cin >> namaSiswa;
    std::cout << "Judul Buku    : ";
    std::cin >> judulBuku;
    std::cout << "Lama Pinjam (hari): ";
    std::cin >> lamaPinjam;

    const int BATAS_HARI = 7;
    int denda = 0;
    int hariTelat = 0;

    std::cout << "\\n--- BUKTI PENGEMBALIAN BUKU ---" << std::endl;
    std::cout << "Nama Siswa   : " << namaSiswa << std::endl;
    std::cout << "Judul Buku   : " << judulBuku << std::endl;
    std::cout << "Durasi Pinjam: " << lamaPinjam << " hari" << std::endl;

    if (lamaPinjam <= BATAS_HARI) {
        std::cout << "Status       : Tepat Waktu (Tidak Dikenakan Denda)" << std::endl;
        std::cout << "Total Denda  : Rp 0" << std::endl;
    } else {
        hariTelat = lamaPinjam - BATAS_HARI;
        if (hariTelat <= 3) {
            denda = hariTelat * 1000;
        } else {
            denda = (3 * 1000) + ((hariTelat - 3) * 2000);
        }

        std::cout << "Status       : TERLAMBAT (" << hariTelat << " hari)" << std::endl;
        std::cout << "Total Denda  : Rp " << denda << std::endl;
        std::cout << "Harap segera melunasi denda di meja pustakawan." << std::endl;
    }

    return 0;
}`,
    testScenarios: [
      {
        scenario: 'Pengembalian hari ke-5 (kurang dari 7 hari) -> Denda Rp 0',
        input: 'Ahmad Biologi 5',
        expectedOutput: 'Status: Tepat Waktu, Denda Rp 0'
      },
      {
        scenario: 'Pengembalian hari ke-9 (telat 2 hari) -> Denda 2 x Rp 1.000 = Rp 2.000',
        input: 'Siti Fisika 9',
        expectedOutput: 'Terlambat 2 hari, Denda Rp 2000'
      },
      {
        scenario: 'Pengembalian hari ke-12 (telat 5 hari) -> Denda 3.000 + (2 x 2.000) = Rp 7.000',
        input: 'Doni Kimia 12',
        expectedOutput: 'Terlambat 5 hari, Denda Rp 7000'
      }
    ],
    rubric: [
      {
        criteria: '1. Analisis Masalah',
        weight: 20,
        description: 'Pemahaman batasan sirkulasi buku dan formula denda bertingkat.',
        levelExcellent: 'Pemahaman tepat tentang denda tier 1 dan tier 2 (18-20 poin).',
        levelGood: 'Analisis baik namun perhitungan tier 2 masih kurang presisi (14-17 poin).',
        levelDeveloping: 'Hanya menggunakan denda tarif tunggal (0-13 poin).'
      },
      {
        criteria: '2. Ketepatan Algoritma',
        weight: 25,
        description: 'Struktur percabangan kondisional keterlambatan.',
        levelExcellent: 'Algoritma percabangan bersarang rapi dan logis (23-25 poin).',
        levelGood: 'Algoritma dapat berjalan sesuai aturan (18-22 poin).',
        levelDeveloping: 'Terjadi tumpang tindih kondisi (0-17 poin).'
      },
      {
        criteria: '3. Kebenaran Program C++',
        weight: 25,
        description: 'Penggunaan konstanta BATAS_HARI dan format output.',
        levelExcellent: 'Menggunakan konstanta, penamaan bermakna, kode modular (23-25 poin).',
        levelGood: 'Kode berjalan normal sesuai output (18-22 poin).',
        levelDeveloping: 'Ada kesalahan penulisan rumus perhitungan (0-17 poin).'
      },
      {
        criteria: '4. Pengujian & Penanganan Kesalahan',
        weight: 15,
        description: 'Pengujian kasus tepat waktu, telat tier 1, dan telat tier 2.',
        levelExcellent: 'Ketiga skenario diuji tuntas dan hasilnya diverifikasi (14-15 poin).',
        levelGood: 'Menguji dua skenario (10-13 poin).',
        levelDeveloping: 'Hanya menguji satu skenario normal (0-9 poin).'
      },
      {
        criteria: '5. Dokumentasi & Refleksi',
        weight: 15,
        description: 'Refleksi komputasional mengenai kedisiplinan dan tanggung jawab fasilitas bersama.',
        levelExcellent: 'Catatan reflektif yang kuat tentang kedisiplinan siswa (14-15 poin).',
        levelGood: 'Catatan reflektif cukup baik (10-13 poin).',
        levelDeveloping: 'Tanpa dokumentasi (0-9 poin).'
      }
    ]
  },
  {
    id: 'proyek-5',
    title: '5. Estimator Anggaran Biaya Kegiatan Kelas (Study Tour / Pentas Seni)',
    description: 'Program perencanaan finansial untuk pengurus kelas dalam menyusun estimasi kebutuhan dana kegiatan luar kelas, menghitung iuran per siswa, mengalokasikan pos konsumsi, transportasi, dan tiket, serta mengantisipasi dana darurat.',
    objective: 'Mengintegrasikan formulasi aritmetika pembagian dengan pembulatan ke atas, persentase dana cadangan, serta transparansi pelaporan keuangan kelas.',
    inputOutputRequirements: [
      'Input: Jumlah siswa yang berpartisipasi (N).',
      'Input: Biaya sewa transportasi bus total, biaya tiket masuk per siswa, dan anggaran konsumsi per siswa.',
      'Dana Tak Terduga: Ditambahkan otomatis 10% dari total pengeluaran kotor.',
      'Output: Total anggaran keseluruhan kegiatan dan besaran iuran per siswa yang harus dikumpulkan.'
    ],
    algorithmSteps: [
      '1. Baca jumlah siswa peserta.',
      '2. Baca biaya sewa bus total, tiket per siswa, dan konsumsi per siswa.',
      '3. Hitung total konsumsi = konsumsi * siswa.',
      '4. Hitung total tiket = tiket * siswa.',
      '5. Hitung subtotal pengeluaran = biayaBus + totalKonsumsi + totalTiket.',
      '6. Hitung dana tak terduga = subtotal * 0.10.',
      '7. Hitung total anggaran kegiatan = subtotal + danaTakTerduga.',
      '8. Hitung iuran per siswa = totalAnggaran / jumlahSiswa.',
      '9. Tampilkan rincian laporan anggaran transparan.'
    ],
    pseudocode: `ALGORITMA EstimatorAnggaranKelas
DEKLARASI:
    siswa : integer
    biayaBus, tiket, konsumsi : double
    subtotal, takTerduga, totalAnggaran, iuranPerSiswa : double

DESKRIPSI:
    MULAI
    Input siswa, biayaBus, tiket, konsumsi
    subtotal = biayaBus + (tiket * siswa) + (konsumsi * siswa)
    takTerduga = subtotal * 0.10
    totalAnggaran = subtotal + takTerduga
    iuranPerSiswa = totalAnggaran / siswa

    Tampilkan "Subtotal: Rp ", subtotal
    Tampilkan "Dana Cadangan (10%): Rp ", takTerduga
    Tampilkan "Total Anggaran: Rp ", totalAnggaran
    Tampilkan "Iuran per Siswa: Rp ", iuranPerSiswa
    SELESAI`,
    flowchartSummary: 'Input Parameter Anggaran -> Hitung Subtotal -> Tambahkan Dana Cadangan 10% -> Hitung Iuran Per Kepala -> Tampilkan Laporan Keuangan Transparan -> Selesai',
    referenceCppCode: `#include <iostream>

int main() {
    std::cout << "=== ESTIMATOR ANGGARAN KEGIATAN KELAS X ===" << std::endl;
    int jumlahSiswa;
    std::cout << "Jumlah siswa peserta       : ";
    std::cin >> jumlahSiswa;

    if (jumlahSiswa <= 0) {
        std::cout << "Error: Jumlah siswa harus minimal 1 orang!" << std::endl;
        return 0;
    }

    double biayaBus, tiketPerSiswa, konsumsiPerSiswa;
    std::cout << "Biaya sewa bus total (Rp)  : ";
    std::cin >> biayaBus;
    std::cout << "Harga tiket masuk/siswa (Rp): ";
    std::cin >> tiketPerSiswa;
    std::cout << "Biaya konsumsi/siswa (Rp)  : ";
    std::cin >> konsumsiPerSiswa;

    double totalTiket = tiketPerSiswa * jumlahSiswa;
    double totalKonsumsi = konsumsiPerSiswa * jumlahSiswa;
    double subtotal = biayaBus + totalTiket + totalKonsumsi;

    // Alokasi dana cadangan tak terduga 10%
    double danaCadangan = subtotal * 0.10;
    double totalAnggaran = subtotal + danaCadangan;
    double iuranPerSiswa = totalAnggaran / jumlahSiswa;

    std::cout << "\\n==========================================" << std::endl;
    std::cout << "        PROPOSAL ANGGARAN KELAS           " << std::endl;
    std::cout << "==========================================" << std::endl;
    std::cout << "Total Peserta        : " << jumlahSiswa << " siswa" << std::endl;
    std::cout << "Sewa Transportasi    : Rp " << biayaBus << std::endl;
    std::cout << "Total Tiket Masuk    : Rp " << totalTiket << std::endl;
    std::cout << "Total Konsumsi Siswa : Rp " << totalKonsumsi << std::endl;
    std::cout << "Subtotal Biaya       : Rp " << subtotal << std::endl;
    std::cout << "Dana Cadangan (10%)  : Rp " << danaCadangan << std::endl;
    std::cout << "------------------------------------------" << std::endl;
    std::cout << "TOTAL ANGGARAN       : Rp " << totalAnggaran << std::endl;
    std::cout << "IURAN PER SISWA      : Rp " << iuranPerSiswa << std::endl;
    std::cout << "==========================================" << std::endl;

    return 0;
}`,
    testScenarios: [
      {
        scenario: '20 siswa, Bus Rp 1.000.000, Tiket Rp 25.000, Konsumsi Rp 20.000',
        input: '20 1000000 25000 20000',
        expectedOutput: 'Subtotal Rp 1.900.000, Total Anggaran Rp 2.090.000, Iuran per siswa Rp 104.500'
      }
    ],
    rubric: [
      {
        criteria: '1. Analisis Masalah',
        weight: 20,
        description: 'Ketepatan mengidentifikasi biaya tetap vs biaya variabel per kepala.',
        levelExcellent: 'Mampu membedakan biaya tetap (bus) dan biaya variabel (tiket & makan) secara tepat (18-20 poin).',
        levelGood: 'Memahami komponen biaya dengan baik (14-17 poin).',
        levelDeveloping: 'Keliru membedakan biaya tetap dan variabel (0-13 poin).'
      },
      {
        criteria: '2. Ketepatan Algoritma',
        weight: 25,
        description: 'Urutan penghitungan subtotal, dana cadangan, dan pembagian iuran.',
        levelExcellent: 'Algoritma sekuensial mengalir logis tanpa redundansi kalkulasi (23-25 poin).',
        levelGood: 'Algoritma berfungsi dengan baik (18-22 poin).',
        levelDeveloping: 'Urutan penghitungan terbalik atau rumus persentase keliru (0-17 poin).'
      },
      {
        criteria: '3. Kebenaran Program C++',
        weight: 25,
        description: 'Akurasi penggunaan tipe data double untuk menghindari pemotongan sen rupiah.',
        levelExcellent: 'Perhitungan presisi, menggunakan double, dan output tersusun rapi (23-25 poin).',
        levelGood: 'Kode berfungsi sesuai spesifikasi (18-22 poin).',
        levelDeveloping: 'Terjadi pemotongan desimal karena menggunakan integer (0-17 poin).'
      },
      {
        criteria: '4. Pengujian & Penanganan Kesalahan',
        weight: 15,
        description: 'Validasi jumlah siswa tidak boleh 0 atau negatif (mencegah division by zero).',
        levelExcellent: 'Validasi pembagi aman dan diuji dengan variasi nilai (14-15 poin).',
        levelGood: 'Validasi dasar ada (10-13 poin).',
        levelDeveloping: 'Program crash jika jumlah siswa dimasukkan 0 (0-9 poin).'
      },
      {
        criteria: '5. Dokumentasi & Refleksi',
        weight: 15,
        description: 'Refleksi transparansi pelaporan anggaran kelas dan etika kepengurusan.',
        levelExcellent: 'Refleksi mendalam tentang akuntabilitas pengurus organisasi kelas (14-15 poin).',
        levelGood: 'Refleksi standar (10-13 poin).',
        levelDeveloping: 'Tanpa refleksi (0-9 poin).'
      }
    ]
  }
];
