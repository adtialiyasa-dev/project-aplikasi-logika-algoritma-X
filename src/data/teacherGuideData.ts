export interface TeacherGuideSection {
  title: string;
  badge: string;
  content: string;
}

export const TEACHER_GUIDE_DATA: TeacherGuideSection[] = [
  {
    title: '1. Capaian Pembelajaran (CP) & Alur Tujuan Pembelajaran (ATP)',
    badge: 'Kurikulum Merdeka - Fase E',
    content: `### Capaian Pembelajaran Elemen Algoritma dan Pemrograman (AP) & Berpikir Komputasional (BK)

Pada akhir Fase E (Kelas X SMA), peserta didik diharapkan mampu:
- **Berpikir Komputasional (BK)**: Memahami strategi algoritmik standar untuk memecahkan persoalan sehari-hari dengan menerapkan 4 pilar utama: dekomposisi persoalan, pengenalan pola, abstraksi representasi data, dan penyusunan urutan instruksi terarah.
- **Algoritma dan Pemrograman (AP)**: Menerapkan notasi algoritma deskriptif, pseudocode terstruktur, dan diagram alir (*flowchart*); membaca, menelusuri (*trace*), memodifikasi, serta mengimplementasikan kode program dalam bahasa pemrograman prosedural tingkat tinggi (C++) yang memuat instruksi sekuensial, percabangan kondisional, dan perulangan secara tepat guna.

### Alur Tujuan Pembelajaran (ATP)
1. **ATP 10.1**: Menganalisis perbedaan logika, algoritma, dan program serta mendemonstrasikan 5 karakteristik algoritma efektif (Finiteness, Definiteness, Input, Output, Effectiveness).
2. **ATP 10.2**: Menerapkan 4 pilar berpikir komputasional pada kasus nyata di lingkungan sekolah dan masyarakat.
3. **ATP 10.3**: Merumuskan masalah kontekstual ke dalam notasi pseudocode standar dan diagram alir (flowchart ANSI/ISO).
4. **ATP 10.4**: Mengidentifikasi anatomi dasar kode C++ (#include, main, cin, cout, tipe data, operator, kesalahan sintaks vs logika).
5. **ATP 10.5**: Mengembangkan program C++ dengan struktur kontrol sekuensial untuk pemecahan masalah kuantitatif.
6. **ATP 10.6**: Mengembangkan program C++ dengan struktur kontrol percabangan (if, else if, else, switch-case) untuk pengambilan keputusan bersyarat.
7. **ATP 10.7**: Mengembangkan program C++ dengan struktur perulangan (for, while, do-while) untuk otomatisasi repetitif.
8. **ATP 10.8**: Melakukan pengujian sistematis (*software testing*), analisis penelusuran variabel (*trace table*), dan debugging pada kode program yang memiliki bug logika.
9. **ATP 10.9**: Menuntaskan proyek mini terpadu (*Capstone Project*) berbasis solusi nyata yang memadukan seluruh struktur pemrograman.`
  },
  {
    title: '2. Peta Konsep Pembelajaran & Alokasi Waktu',
    badge: 'Distribusi 18 JP',
    content: `### Peta Konsep Pembelajaran
\`\`\`
                           [ MASALAH DUNIA NYATA ]
                                     |
                                     v
                       [ BERPIKIR KOMPUTASIONAL ]
                  (Dekomposisi, Pola, Abstraksi, Algoritma)
                                     |
                    +----------------+----------------+
                    |                                 |
                    v                                 v
              [ PSEUDOCODE ]                    [ FLOWCHART ]
           (Notasi Teks Logika)             (Visual Simbol Grafis)
                    |                                 |
                    +----------------+----------------+
                                     |
                                     v
                          [ PEMROGRAMAN C++ ]
             +-----------------------+-----------------------+
             |                       |                       |
             v                       v                       v
     [ 1. SEKUENSIAL ]       [ 2. PERCABANGAN ]      [ 3. PERULANGAN ]
      Input-Proses-Output       if, else if, switch     for, while, do-while
             |                       |                       |
             +-----------------------+-----------------------+
                                     |
                                     v
                      [ PROYEK AKHIR & REFLEKSI ]
                     (Aplikasi Nyata & Berkesadaran)
\`\`\`

### Rekomendasi Alokasi Waktu (18 Jam Pelajaran / JP)
- **Pertemuan 1 (2 JP)**: Pengantar Logika, Algoritma, dan Karakteristik Solusi Efektif.
- **Pertemuan 2 (2 JP)**: Eksplorasi 4 Pilar Berpikir Komputasional dan Refleksi Kasus Nyata.
- **Pertemuan 3 (2 JP)**: Perancangan Pseudocode dan Visualisasi Diagram Alir (Flowchart).
- **Pertemuan 4 (2 JP)**: Pengenalan Sintaks C++, Anatomi Kode, Lingkungan Simulator, dan Operator.
- **Pertemuan 5 (2 JP)**: Struktur Sekuensial: I/O Konsol dan Perhitungan Aritmetika Terstruktur.
- **Pertemuan 6 (2 JP)**: Struktur Percabangan: Pengambilan Keputusan if, else-if, switch, dan Logika Boolean.
- **Pertemuan 7 (2 JP)**: Struktur Perulangan: Otomatisasi for/while, Trace Table, dan Pencegahan Infinite Loop.
- **Pertemuan 8 (2 JP)**: Praktik Lab Koding Terbimbing, Bug Hunting, dan Evaluasi HOTS.
- **Pertemuan 9 (2 JP)**: Pameran Karya Proyek Akhir (Showcase), Presentasi Siswa, Asesmen Sumatif, dan Refleksi Mindful.`
  },
  {
    title: '3. Panduan Aktivitas Model PBL dan PjBL',
    badge: 'Pedagogi Deep Learning',
    content: `### Problem-Based Learning (PBL) untuk Pemahaman Konsep & Debugging
- **Fase 1: Orientasi Masalah**: Guru menampilkan kasus nyata di mana program mengalami bug logika (misal: kasir kantin yang salah menghitung diskon atau pembagian dengan nol).
- **Fase 2: Organisasi Belajar**: Siswa dalam kelompok berpasangan (*pair programming*) menelusuri baris kode menggunakan lembar penelusuran (*trace sheet*).
- **Fase 3: Penyelidikan Mandiri/Kelompok**: Siswa memprediksi nilai variabel pada setiap langkah di Simulator C++ dan mengidentifikasi baris penyebab error.
- **Fase 4: Pengembangan & Penyajian Solusi**: Siswa menuliskan perbaikan algoritma dan memverifikasinya melalui test cases.
- **Fase 5: Analisis & Refleksi**: Guru memfasilitasi diskusi reflektif: *"Mengapa kesalahan itu bisa terjadi? Apa hikmahnya dalam ketelitian hidup sehari-hari?"*

### Project-Based Learning (PjBL) untuk Proyek Akhir
- **Penentuan Pertanyaan Mendasar**: Siswa memilih salah satu dari 5 tema proyek (Kasir Kantin, Nilai Rapor, Kalkulator Menu, Pustaka Sekolah, Anggaran Kelas).
- **Mendesain Perencanaan Proyek**: Siswa menuliskan analisis I/O, pseudocode, dan flowchart sebelum mulai mengetik baris kode C++.
- **Menyusun Jadwal Pembuatan**: Membagi waktu: perancangan algoritma (30 menit), koding modul (40 menit), pengujian ekstrem (15 menit), penyusunan laporan (15 menit).
- **Memonitor Keaktifan & Progres**: Guru berkeliling membimbing siswa yang mengalami kebuntuan sintaksis atau bug logika.
- **Menguji Hasil**: Siswa menguji program dengan test cases batas (*boundary cases*).
- **Evaluasi Pengalaman Belajar**: Siswa mengisi jurnal refleksi berkesadaran di aplikasi.`
  },
  {
    title: '4. Bank Pertanyaan Pemantik (Driving Questions)',
    badge: 'Membangun Daya Kritis',
    content: `Gunakan pertanyaan pemantik berikut di awal setiap sesi untuk memicu rasa ingin tahu (*curiosity*) dan kesadaran (*mindfulness*):

1. **Tentang Logika**: *"Pernahkah kamu berniat membuat mi instan, tetapi bumbunya dimasukkan sebelum air mendidih? Apa bedanya rasa yang dihasilkan? Mengapa urutan langkah sangat menentukan keberhasilan tujuan?"*
2. **Tentang Berpikir Komputasional**: *"Jika kamu diberikan tugas merapikan satu lemari buku perpustakaan yang berantakan dalam waktu 15 menit, strategi apa yang akan kamu gunakan agar tidak merasa kewalahan?"*
3. **Tentang Pseudocode & Flowchart**: *"Mengapa arsitek selalu menggambar cetak biru rumah sebelum tukang bangunan meletakkan batu bata pertama? Apa bahayanya programmer yang langsung mengetik kode C++ tanpa merancang algoritma terlebih dahulu?"*
4. **Tentang Percabangan**: *"Bagaimana sistem aplikasi perbankan atau ATM tahu persis kapan harus mengeluarkan uang dan kapan harus menolak kartu ATM yang dimasukkan?"*
5. **Tentang Perulangan**: *"Jika kamu disuruh mencatat nomor absen 1 sampai 1.000 dengan tangan, apa yang kamu rasakan? Bagaimana komputer dapat melakukan hal tersebut dalam waktu sekejap mata tanpa kesalahan?"*
6. **Tentang Kesalahan Koding**: *"Ketika programmu error dan layarmu dipenuhi peringatan merah, apakah itu berarti komputermu rusak atau pikiranmu yang sedang diajak berkomunikasi lebih jujur?"*`
  },
  {
    title: '5. Lembar Kerja Peserta Didik (LKPD)',
    badge: 'Siap Cetak & Diskusi',
    content: `### LKPD: "Menganalisis Alur dan Membedah Bug Logika Program C++"

**Nama Kelompok**: .............................................
**Anggota**: 1. ..................... 2. .....................
**Kelas / Fase**: X / E

#### A. Instruksi Penelusuran (Tracing)
Diberikan algoritma perulangan berikut:
\`\`\`cpp
int total = 0;
for (int i = 1; i <= 4; i++) {
    total += (i * 3);
}
\`\`\`
Lengkapilah Tabel Penelusuran (*Trace Table*) di bawah ini:
| Iterasi ke- | Nilai variabel 'i' | Ekspresi (i * 3) | Nilai 'total' Lama | Nilai 'total' Baru |
|:-----------:|:------------------:|:----------------:|:------------------:|:------------------:|
| 1           | 1                  | 3                | 0                  | 3                  |
| 2           | 2                  | ...              | 3                  | ...                |
| 3           | 3                  | ...              | ...                | ...                |
| 4           | 4                  | ...              | ...                | ...                |

#### B. Misi Bedah Bug (Bug Hunting)
Perhatikan kode berikut yang bermaksud memeriksa apakah nilai lulus (>= 75):
\`\`\`cpp
int nilai = 80;
if (nilai = 75) {
    cout << "Anda Berhasil Lulus!" << endl;
}
\`\`\`
1. Apa kelemahan fatal pada baris ke-2?
2. Bagaimana perilaku program saat dijalankan dengan kode tersebut?
3. Tuliskan perbaikan kode yang benar!`
  },
  {
    title: '6. Panduan Remedial dan Pengayaan',
    badge: 'Diferensiasi Pembelajaran',
    content: `### Panduan Pembelajaran Berdiferensiasi

#### A. Program Remedial (Bagi Siswa dengan Nilai < 75)
- **Fokus Masalah**: Umumnya siswa kesulitan membedakan antara operator penugasan (\`=\`) dan operator kesetaraan (\`==\`), atau bingung membaca urutan perulangan.
- **Strategi Remedial**:
  1. *Unplugged Activity*: Menggunakan kartu peran fisik (siswa memegang kertas bertuliskan nilai variabel dan mengubah angkanya secara fisik di papan tulis).
  2. *Bimbingan Terfokus*: Mengerjakan latihan Lab Koding level "Dasar" (Lab 1 sampai Lab 3) yang hanya melibatkan struktur sekuensial sederhana.
  3. *Tutor Sebaya*: Memasangkan siswa remedial dengan rekan sekelas yang telah tuntas pada tahap pengayaan.

#### B. Program Pengayaan (Bagi Siswa dengan Nilai >= 85)
- **Fokus Tantangan**: Mengembangkan algoritma dengan kompleksitas lebih tinggi dan efisiensi waktu.
- **Tantangan Pengayaan**:
  1. Menambahkan fitur *Loop Validasi Input* pada Proyek Akhir agar program kebal terhadap input teks sampah atau angka negatif (*Input Sanitization*).
  2. Mengimplementasikan struktur array satu dimensi untuk menyimpan daftar nilai 10 siswa sekaligus dan mengurutkannya dari nilai tertinggi ke terendah (*Bubble Sort sederhana*).
  3. Membuat menu berbasis teks dengan sub-menu bertingkat.`
  },
  {
    title: '7. Kisi-Kisi Asesmen & Rubrik Guru',
    badge: 'Evaluasi Otentik',
    content: `### Kisi-Kisi Asesmen Sumatif Akhir Topik Logika & C++
- **Indikator 1**: Peserta didik dapat menganalisis karakteristik algoritma Donald Knuth (Soal Pilihan Ganda No. 1-10).
- **Indikator 2**: Peserta didik dapat menerapkan operator relasional dan logika dalam pseudocode kontekstual (Soal Pilihan Ganda No. 11-20).
- **Indikator 3**: Peserta didik dapat menelusuri jalannya eksekusi program C++ dan memprediksi output terminal (Soal Pilihan Ganda No. 21-30).
- **Indikator 4**: Peserta didik dapat mendeteksi syntax error, runtime error, dan logical error serta merumuskan solusinya (Soal Pilihan Ganda No. 31-40).
- **Indikator 5 (HOTS)**: Peserta didik dapat mengevaluasi efisiensi algoritma dan merancang arsitektur sistem berbasis studi kasus nyata (Soal Pilihan Ganda No. 41-50).

### Rekomendasi Format Penilaian Akhir (Skala 100)
- **Asesmen Formatif (Keaktifan Lab Koding & LKPD)**: Bobot 30%
- **Asesmen Kuis Pengetahuan & Analisis HOTS**: Bobot 30%
- **Asesmen Proyek Akhir C++ (Karya Nyata)**: Bobot 40%
- **Total Skor Akhir**: 100%`
  }
];
