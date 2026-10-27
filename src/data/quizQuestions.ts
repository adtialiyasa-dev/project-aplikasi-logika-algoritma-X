import { QuizQuestion } from '../types.ts';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ===================== KATEGORI 1: PEMAHAMAN KONSEP (10 SOAL) =====================
  {
    id: 1,
    category: 'konsep',
    difficulty: 'Mudah',
    indicator: 'Mengidentifikasi karakteristik finiteness pada algoritma menurut Donald Knuth.',
    topic: 'Karakteristik Algoritma',
    question: 'Menurut Donald E. Knuth, salah satu karakteristik mutlak algoritma adalah "Finiteness". Apa konsekuensi logis jika sebuah program tidak memenuhi syarat finiteness ini?',
    options: [
      'Program akan mengalami error saat kompilasi karena kekurangan tipe data.',
      'Program akan berjalan terus menerus tanpa henti (infinite loop) dan tidak pernah menghasilkan solusi akhir.',
      'Hasil output yang ditampilkan program akan selalu bernilai nol atau kosong.',
      'Program tidak dapat menerima masukan data dari keyboard pengguna.',
      'Kompilator akan otomatis mengubah kode menjadi bahasa assembly.'
    ],
    correctIndex: 1,
    explanation: 'Finiteness berarti keterhinggaan. Suatu algoritma wajib berhenti setelah sejumlah langkah terhingga dikerjakan. Jika syarat ini dilanggar, komputer terjebak dalam perulangan abadi (infinite loop).',
    whyCorrect: 'Pilihan B tepat mendefinisikan bahwa ketiadaan batas keterhinggaan menyebabkan program tidak pernah mencapai terminasi.',
    distractorExplanations: [
      'Pilihan A salah karena infinite loop adalah kesalahan logika runtime, bukan kegagalan kompilasi sintaks.',
      'Pilihan C salah karena ketiadaan henti membuat program tidak sempat menyajikan status akhir.',
      'Pilihan D salah karena program yang infinite loop tetap bisa menerima input di awal sebelum macet.',
      'Pilihan E salah karena konversi ke assembly dilakukan oleh compiler pada tahap translasi, tidak dipengaruhi finiteness logika.'
    ]
  },
  {
    id: 2,
    category: 'konsep',
    difficulty: 'Mudah',
    indicator: 'Membedakan konsep logika, algoritma, dan program komputer.',
    topic: 'Hubungan Logika, Algoritma, dan Program',
    question: 'Di antara pernyataan berikut, manakah analogi dan hubungan yang paling tepat antara logika, algoritma, dan program komputer?',
    options: [
      'Logika adalah bahasa C++, algoritma adalah compiler, dan program adalah file eksekusi .exe.',
      'Logika adalah perangkat keras, algoritma adalah sistem operasi, dan program adalah aplikasi pengguna.',
      'Logika adalah pola pikir penalaran, algoritma adalah rancangan langkah sistematis, dan program adalah implementasi instruksi dalam bahasa komputer.',
      'Algoritma adalah kode sumber yang sudah dikompilasi, sedangkan program adalah diagram alir sebelum diketik.',
      'Logika dan algoritma selalu bergantung pada jenis prosesor komputer yang digunakan.'
    ],
    correctIndex: 2,
    explanation: 'Logika adalah dasar berpikir manusia untuk memecahkan masalah. Algoritma adalah formulasi langkah-langkah solutif. Program adalah perwujudan konkret dari algoritma dalam bahasa pemrograman tertentu yang dapat dimengerti komputer.',
    whyCorrect: 'Pilihan C merepresentasikan hirarki konseptual dari alam pikiran (logika) ke rancangan formal (algoritma) hingga ke eksekusi mesin (program).',
    distractorExplanations: [
      'Pilihan A salah karena C++ adalah bahasa pemrograman konkret, bukan logika abstrak.',
      'Pilihan B salah karena ketiganya merupakan aspek perangkat lunak dan metodologi berpikir, bukan perangkat keras.',
      'Pilihan D salah karena membalik urutan; algoritma dibuat mendahului program kompilasi.',
      'Pilihan E salah karena logika dan algoritma bersifat independen terhadap jenis arsitektur CPU.'
    ]
  },
  {
    id: 3,
    category: 'konsep',
    difficulty: 'Mudah',
    indicator: 'Menjelaskan fungsi dekomposisi dalam berpikir komputasional.',
    topic: 'Berpikir Komputasional',
    question: 'Seorang siswa diminta membuat sistem informasi perpustakaan digital sekolah yang mencakup pendataan buku, kartu anggota, denda, dan laporan peminjaman. Langkah awal yang ia lakukan adalah membagi sistem menjadi modul-modul kecil mandiri. Pilar berpikir komputasional yang diterapkan adalah...',
    options: [
      'Abstraksi',
      'Pengenalan Pola',
      'Perancangan Algoritma',
      'Dekomposisi',
      'Evaluasi Heuristik'
    ],
    correctIndex: 3,
    explanation: 'Dekomposisi adalah teknik memecah masalah besar, rumit, atau kompleks menjadi bagian-bagian yang lebih kecil, sederhana, dan mudah dikelola secara terpisah.',
    whyCorrect: 'Pilihan D secara tepat menamai aktivitas membagi sistem perpustakaan yang besar menjadi sub-modul (buku, anggota, denda).',
    distractorExplanations: [
      'Pilihan A salah karena abstraksi berfokus pada membuang detail yang tidak penting.',
      'Pilihan B salah karena pengenalan pola berfokus pada mencari keteraturan atau kesamaan.',
      'Pilihan C salah karena perancangan algoritma adalah penyusunan urutan instruksi kerja.',
      'Pilihan E salah karena evaluasi heuristik adalah metode audit antarmuka pengguna.'
    ]
  },
  {
    id: 4,
    category: 'konsep',
    difficulty: 'Sedang',
    indicator: 'Menganalisis pilar abstraksi pada penyusunan basis data siswa.',
    topic: 'Abstraksi Komputasional',
    question: 'Dalam merancang sistem pengolahan nilai rapor digital kelas X, informasi seperti hobi menyanyi, ukuran baju seragam, dan warna kesukaan siswa tidak dimasukkan ke dalam program. Alasan komputasional yang melandasi keputusan ini berdasarkan pilar abstraksi adalah...',
    options: [
      'Informasi tersebut melanggar hak cipta data pribadi siswa.',
      'Memori komputer di sekolah tidak akan mampu menyimpan teks nama hobi.',
      'Abstraksi bertujuan menyaring dan hanya mempertahankan data yang esensial serta relevan dengan tujuan kalkulasi akademik.',
      'Bahasa pemrograman C++ tidak memiliki tipe data untuk menyimpan teks hobi.',
      'Informasi tersebut otomatis dienkripsi dan disembunyikan oleh sistem operasi.'
    ],
    correctIndex: 2,
    explanation: 'Abstraksi adalah pilar berpikir komputasional yang memilah informasi krusial dan mengabaikan detail-detail yang tidak ada sangkut pautnya dengan tujuan sistem (perhitungan nilai rapor).',
    whyCorrect: 'Pilihan C menjelaskan esensi abstraksi: fokus pada yang relevan (nilai, mapel, nama) dan mengeliminasi yang tidak relevan (warna favorit, ukuran baju).',
    distractorExplanations: [
      'Pilihan A salah karena relevansi sistem bukan semata-mata masalah regulasi hak cipta.',
      'Pilihan B salah karena memori komputer modern sangat besar untuk menyimpan teks string sederhana.',
      'Pilihan D salah karena C++ memiliki tipe string yang sangat leluasa menampung hobi.',
      'Pilihan E salah karena tidak ada enkripsi otomatis yang menghapus field database.'
    ]
  },
  {
    id: 5,
    category: 'konsep',
    difficulty: 'Mudah',
    indicator: 'Menjelaskan fungsi simbol flowchart belah ketupat (decision).',
    topic: 'Flowchart Standar ISO',
    question: 'Pada diagram alir standar ANSI/ISO, simbol belah ketupat (rhombus / diamond) digunakan untuk mewakili operasi...',
    options: [
      'Input data langsung dari pengguna melalui keyboard.',
      'Awal dan akhir dari suatu diagram alur (Terminator).',
      'Pengambilan keputusan bersyarat yang memiliki minimal dua cabang luaran (Ya / Tidak).',
      'Kalkulasi matematis penambahan dua buah variabel (Proses).',
      'Penyimpanan data ke dalam media hard disk sekunder.'
    ],
    correctIndex: 2,
    explanation: 'Simbol belah ketupat (decision) digunakan untuk pengujian kondisi logika yang menghasilkan nilai boolean (True/False atau Ya/Tidak) sehingga alur program bercabang.',
    whyCorrect: 'Pilihan C sesuai dengan konvensi standar internasional flowchart untuk percabangan kondisional.',
    distractorExplanations: [
      'Pilihan A salah karena input/output dilambangkan dengan jajaran genjang.',
      'Pilihan B salah karena awal/akhir dilambangkan dengan oval/kapsul terminator.',
      'Pilihan D salah karena proses kalkulasi dilambangkan dengan persegi panjang.',
      'Pilihan E salah karena penyimpanan disk menggunakan simbol tabung silinder.'
    ]
  },
  {
    id: 6,
    category: 'konsep',
    difficulty: 'Sedang',
    indicator: 'Menjelaskan fungsi preprocessor directive #include <iostream>.',
    topic: 'Struktur C++',
    question: 'Mengapa setiap program C++ yang menggunakan std::cout dan std::cin hampir selalu menyertakan baris `#include <iostream>` di bagian paling atas kodenya?',
    options: [
      'Karena iostream adalah file eksekusi sistem operasi yang menjalankan compiler C++.',
      'Karena tanda pagar (#) menandakan bahwa baris tersebut adalah komentar yang tidak dieksekusi.',
      'Karena baris tersebut memerintahkan preprocessor untuk mengimpor header pustaka stream input dan output standar C++.',
      'Karena tanpa iostream, komputer tidak dapat menghidupkan monitor dan keyboard.',
      'Karena iostream adalah fungsi utama yang menggantikan peran fungsi main().'
    ],
    correctIndex: 2,
    explanation: 'Directive `#include <iostream>` menginstruksikan preprocessor compiler untuk menyertakan pustaka header iostream yang berisi deklarasi objek stream seperti cout, cin, cerr, dan endl.',
    whyCorrect: 'Pilihan C secara teknis mendefinisikan peran header file dan preprocessor directive dalam kompilasi C++.',
    distractorExplanations: [
      'Pilihan A salah karena iostream adalah pustaka header teks, bukan compiler binary.',
      'Pilihan B salah karena tanda pagar menandakan preprocessor directive, sedangkan komentar menggunakan // atau /* */.',
      'Pilihan D salah karena pengaktifan perangkat keras adalah tugas BIOS/Sistem Operasi, bukan kode aplikasi.',
      'Pilihan E salah karena fungsi utama tetaplah int main(), bukan iostream.'
    ]
  },
  {
    id: 7,
    category: 'konsep',
    difficulty: 'Mudah',
    indicator: 'Mengidentifikasi perbedaan tipe data int dan double pada C++.',
    topic: 'Tipe Data C++',
    question: 'Jika kamu ingin menyimpan data rata-rata nilai rapor siswa yang memiliki angka desimal di belakang koma (misalnya 87.65), tipe data C++ yang paling tepat untuk digunakan adalah...',
    options: [
      'int',
      'double',
      'char',
      'bool',
      'short'
    ],
    correctIndex: 1,
    explanation: 'Tipe data `double` (floating-point precision ganda) dirancang untuk menampung bilangan riil pecahan atau desimal. Sebaliknya, `int` akan memotong angka di belakang koma (truncation).',
    whyCorrect: 'Pilihan B mampu menyimpan angka berpresisi desimal seperti 87.65 secara akurat.',
    distractorExplanations: [
      'Pilihan A salah karena int hanya dapat menyimpan bilangan bulat (87.65 akan terpotong menjadi 87).',
      'Pilihan C salah karena char hanya dapat menyimpan 1 karakter simbol huruf tunggal.',
      'Pilihan D salah karena bool hanya bernilai true (1) atau false (0).',
      'Pilihan E salah karena short juga tipe data bilangan bulat pendek.'
    ]
  },
  {
    id: 8,
    category: 'konsep',
    difficulty: 'Sedang',
    indicator: 'Menjelaskan perbedaan perulangan for dan while.',
    topic: 'Struktur Perulangan',
    question: 'Dalam perancangan algoritma pemrograman, kapan seorang programmer lebih disarankan menggunakan perulangan `while` dibandingkan perulangan `for`?',
    options: [
      'Saat program membutuhkan kecepatan kompilasi 10 kali lebih cepat.',
      'Saat jumlah perulangan sudah diketahui secara pasti sejak awal penulisan kode.',
      'Saat jumlah perulangan belum dapat dipastikan di awal dan sangat bergantung pada kondisi data dinamis saat program berjalan.',
      'Saat perulangan hanya melibatkan variabel bertipe string.',
      'Saat program tidak boleh menggunakan tanda kurung kurawal sama sekali.'
    ],
    correctIndex: 2,
    explanation: '`for loop` biasanya digunakan untuk *counter-controlled loops* (jumlah iterasi diketahui di awal, misal 1 sampai N). Sedangkan `while loop` cocok untuk *condition-controlled loops* di mana perulangan terus berlangsung selama kondisi bernilai true (misal: selama saldo mencukupi atau selama user belum mengetik "keluar").',
    whyCorrect: 'Pilihan C mendefinisikan skenario ideal penggunaan perulangan while berbasis kondisi dinamis.',
    distractorExplanations: [
      'Pilihan A salah karena jenis perulangan tidak secara inheren melipatgandakan kecepatan kompilasi.',
      'Pilihan B salah karena itu adalah skenario khas untuk perulangan for.',
      'Pilihan D salah karena while bekerja dengan semua tipe data primitif maupun objek.',
      'Pilihan E salah karena while tetap menggunakan kurung kurawal untuk membungkus blok instruksi.'
    ]
  },
  {
    id: 9,
    category: 'konsep',
    difficulty: 'Mudah',
    indicator: 'Mengidentifikasi perbedaan kesalahan sintaksis dan kesalahan logika.',
    topic: 'Debugging dan Jenis Error',
    question: 'Seorang siswa membuat program C++ yang berhasil dikompilasi tanpa satupun pesan error merah. Namun, saat program dijalankan dan siswa menginput panjang = 10 dan lebar = 5, program menampilkan hasil Luas = 30 (bukan 50). Jenis kesalahan yang terjadi adalah...',
    options: [
      'Syntax Error (Kesalahan Sintaksis)',
      'Logical Error (Kesalahan Logika)',
      'Hardware Failure (Kerusakan Perangkat Keras)',
      'Linker Error (Kesalahan Penaut Pustaka)',
      'Segmentation Fault (Akses Memori Ilegal)'
    ],
    correctIndex: 1,
    explanation: 'Syntax error dicegah oleh kompilator jika ada pengetikan yang salah. Jika program berhasil dikompilasi dan berjalan lancar namun menghasilkan output yang salah dari segi formula, kesalahan tersebut adalah Logical Error (misal salah rumus luas = 2*(p+l) bukannya p*l).',
    whyCorrect: 'Pilihan B secara tepat mengklasifikasikan kesalahan formula rumus di mana program tetap jalan namun keluarannya meleset dari fakta.',
    distractorExplanations: [
      'Pilihan A salah karena jika ada syntax error, kompilator akan menolak dan program tidak bisa dijalankan.',
      'Pilihan C salah karena rumus salah adalah murni rekayasa perangkat lunak logika manusia.',
      'Pilihan D salah karena linker error terjadi pada fase linking sebelum file binary terbentuk.',
      'Pilihan E salah karena tidak terjadi crash memori fatal saat runtime.'
    ]
  },
  {
    id: 10,
    category: 'konsep',
    difficulty: 'Sedang',
    indicator: 'Menjelaskan peran fungsi main() sebagai titik masuk (entry point).',
    topic: 'Fungsi Utama C++',
    question: 'Apa peran krusial dari fungsi `int main()` dalam setiap aplikasi berbasis bahasa pemrograman C++?',
    options: [
      'Sebagai fungsi opsional yang hanya dipanggil jika ada kesalahan memori.',
      'Sebagai titik awal (entry point) eksekusi program di mana sistem operasi pertama kali menyerahkan kendali jalannya instruksi.',
      'Sebagai tempat khusus untuk mendeklarasikan nama pembuat aplikasi dan hak cipta.',
      'Sebagai fungsi cadangan jika file header iostream hilang dari direktori instalasi.',
      'Sebagai fungsi penutup yang dijalankan setelah komputer dimatikan.'
    ],
    correctIndex: 1,
    explanation: 'Standar ISO C++ menetapkan bahwa fungsi `main()` adalah titik masuk utama (*entry point*). Ketika program diluncurkan, runtime loader sistem operasi langsung memanggil fungsi `main()`.',
    whyCorrect: 'Pilihan B secara akurat menjelaskan kedudukan arsitektural fungsi main dalam siklus hidup program C++.',
    distractorExplanations: [
      'Pilihan A salah karena main() bersifat wajib mutlak, bukan opsional.',
      'Pilihan C salah karena nama pembuat program biasanya ditulis di komentar, bukan fungsi main.',
      'Pilihan D salah karena ketiadaan iostream tetap memicu error kompilasi jika memakai cout.',
      'Pilihan E salah karena main() dieksekusi saat aplikasi dibuka, bukan saat OS shutdown.'
    ]
  },

  // ===================== KATEGORI 2: PENERAPAN ALGORITMA (10 SOAL) =====================
  {
    id: 11,
    category: 'penerapan',
    difficulty: 'Mudah',
    indicator: 'Menentukan urutan langkah logis perhitungan total belanja di kasir.',
    topic: 'Penerapan Sekuensial',
    question: 'Perhatikan langkah-langkah acak menghitung total belanja kantin berikut:\n1. Hitung totalBayar = totalHarga - diskon\n2. Baca jumlahBeli dan hargaSatuan\n3. Hitung diskon berdasarkan totalHarga\n4. Cetak struk totalBayar\n5. Hitung totalHarga = jumlahBeli * hargaSatuan\nUrutan algoritma yang logis dan benar adalah...',
    options: [
      '2 - 5 - 3 - 1 - 4',
      '2 - 1 - 3 - 5 - 4',
      '5 - 2 - 3 - 1 - 4',
      '1 - 2 - 3 - 4 - 5',
      '2 - 3 - 5 - 1 - 4'
    ],
    correctIndex: 0,
    explanation: 'Data jumlah dan harga harus diinput terlebih dahulu (2), baru dikalikan menjadi total kotor (5). Dari total kotor, hitung diskon (3). Kurangkan total dengan diskon (1), lalu cetak hasilnya ke struk (4).',
    whyCorrect: 'Urutan 2 - 5 - 3 - 1 - 4 memenuhi hukum dependensi data: suatu variabel hanya bisa dihitung jika data masukkannya sudah tersedia.',
    distractorExplanations: [
      'Pilihan B salah karena menghitung totalBayar (1) mendahului perhitungan totalHarga (5).',
      'Pilihan C salah karena menghitung totalHarga sebelum variabel jumlahBeli dibaca dari user.',
      'Pilihan D salah karena langkah 1 dijalankan di awal tanpa data input apapun.',
      'Pilihan E salah karena menghitung diskon sebelum totalHarga dihitung pada langkah 5.'
    ]
  },
  {
    id: 12,
    category: 'penerapan',
    difficulty: 'Sedang',
    indicator: 'Menerapkan operator modulus (%) untuk menentukan bilangan ganjil-genap.',
    topic: 'Penerapan Modulus Percabangan',
    question: 'Diberikan pseudocode:\n```\nJIKA (bilangan % 2 != 0) MAKA\n    TAMPILKAN "Kategori X"\nJIKA TIDAK\n    TAMPILKAN "Kategori Y"\n```\nJika pengguna memasukkan `bilangan = 17`, apa yang akan tampil di layar dan apa arti Kategori X?',
    options: [
      'Kategori Y, yang berarti bilangan genap.',
      'Kategori X, yang berarti bilangan ganjil karena 17 dibagi 2 bersisa 1 (bukan 0).',
      'Kategori X, yang berarti bilangan prima negatif.',
      'Kategori Y, karena 17 habis dibagi 2 tanpa sisa.',
      'Tidak ada output karena terjadi kesalahan tipe data integer.'
    ],
    correctIndex: 1,
    explanation: '17 dibagi 2 menghasilkan 8 dengan sisa pembagian (modulus) 1. Karena 1 != 0 bernilai benar (True), maka blok percabangan pertama yang dijalankan, yaitu "Kategori X", yang merepresentasikan bilangan ganjil.',
    whyCorrect: 'Pilihan B secara akurat menghitung nilai sisa bagi (17 % 2 = 1) dan mengevaluasi kondisi 1 != 0 sebagai True.',
    distractorExplanations: [
      'Pilihan A salah karena kondisi bernilai True, sehingga blok JIKA TIDAK (else) diabaikan.',
      'Pilihan C salah karena 17 adalah bilangan bulat positif, bukan negatif.',
      'Pilihan D salah karena 17 dibagi 2 bersisa 1, bukan habis dibagi tanpa sisa.',
      'Pilihan E salah karena operasi modulus integer pada 17 adalah operasi standar yang valid.'
    ]
  },
  {
    id: 13,
    category: 'penerapan',
    difficulty: 'Sedang',
    indicator: 'Menerapkan operator logika AND (&&) dalam penentuan beasiswa berprestasi.',
    topic: 'Penerapan Logika Majemuk',
    question: 'Kriteria beasiswa olimpiade Informatika menetapkan syarat:\n`Nilai_Akademik >= 85 DAN Kehadiran >= 95% DAN Pelanggaran == 0`\nPerhatikan data 4 calon siswa berikut:\n- Arya: Nilai = 90, Kehadiran = 96%, Pelanggaran = 1\n- Bima: Nilai = 84, Kehadiran = 98%, Pelanggaran = 0\n- Citra: Nilai = 88, Kehadiran = 95%, Pelanggaran = 0\n- Dini: Nilai = 85, Kehadiran = 92%, Pelanggaran = 0\nSiswa yang dinyatakan lolos beasiswa adalah...',
    options: [
      'Arya dan Citra',
      'Hanya Citra',
      'Bima dan Dini',
      'Seluruh siswa lolos',
      'Hanya Arya'
    ],
    correctIndex: 1,
    explanation: 'Operator AND (&&) mensyaratkan KETIGA kondisi harus terpenuhi sekaligus. Evaluasi:\n- Arya gagal karena Pelanggaran = 1 (syarat harus 0).\n- Bima gagal karena Nilai = 84 (< 85).\n- Citra: Nilai 88 (>= 85: Benar), Kehadiran 95% (>= 95: Benar), Pelanggaran 0 (== 0: Benar) -> LOLOS.\n- Dini gagal karena Kehadiran = 92% (< 95%).',
    whyCorrect: 'Hanya Citra yang memenuhi ketiga kriteria secara utuh tanpa ada satu pun yang dilanggar.',
    distractorExplanations: [
      'Pilihan A salah karena Arya memiliki 1 poin pelanggaran.',
      'Pilihan C salah karena nilai Bima kurang 1 poin dan kehadiran Dini kurang 3%.',
      'Pilihan D salah karena 3 siswa lainnya melanggar setidaknya satu syarat.',
      'Pilihan E salah karena Arya didiskualifikasi oleh catatan pelanggarannya.'
    ]
  },
  {
    id: 14,
    category: 'penerapan',
    difficulty: 'Sedang',
    indicator: 'Menerapkan algoritma pencarian nilai maksimum dalam daftar angka.',
    topic: 'Algoritma Nilai Ekstrem',
    question: 'Untuk mencari bilangan terbesar dari sekumpulan 5 angka acak: [14, 28, 9, 45, 21], algoritma standar memulainya dengan menetapkan variabel `maks = angkaPertama (14)`. Apa yang dilakukan algoritma saat memeriksa angka berikutnya?',
    options: [
      'Menjumlahkan angka saat ini dengan nilai maks sebelumnya.',
      'Membandingkan apakah angka saat ini > maks; jika ya, perbarui nilai maks menjadi angka tersebut.',
      'Mengalikan angka saat ini dengan 2 jika angkanya lebih kecil dari maks.',
      'Menghapus angka yang lebih besar dari daftar agar tersisa angka terkecil.',
      'Menghentikan program seketika karena angka 14 sudah lebih besar dari 9.'
    ],
    correctIndex: 1,
    explanation: 'Algoritma penentuan nilai maksimum bekerja dengan membandingkan elemen saat ini dengan variabel penampung maks. Jika ditemukan elemen yang lebih besar (`elemen > maks`), maka `maks = elemen`.',
    whyCorrect: 'Pilihan B secara tepat menggambarkan algoritma linear search untuk nilai maksimum.',
    distractorExplanations: [
      'Pilihan A salah karena penjumlahan digunakan untuk menghitung total rata-rata, bukan mencari nilai terbesar.',
      'Pilihan C salah karena perkalian tidak ada hubungannya dengan perbandingan ekstremum.',
      'Pilihan D salah karena menghapus elemen yang lebih besar justru akan menghilangkan kandidat maksimum.',
      'Pilihan E salah karena seluruh elemen harus ditelusuri hingga akhir daftar.'
    ]
  },
  {
    id: 15,
    category: 'penerapan',
    difficulty: 'Sedang',
    indicator: 'Menerapkan perulangan menghitung total deret aritmetika.',
    topic: 'Akumulasi Variabel (Accumulator)',
    question: 'Perhatikan algoritma akumulator perulangan berikut:\n```\ntotal = 0\nUNTUK i = 1 SAMPAI 4 LAKUKAN:\n    total = total + (i * 2)\nAKHIR UNTUK\n```\nNilai akhir dari variabel `total` setelah perulangan selesai adalah...',
    options: [
      '10',
      '20',
      '8',
      '16',
      '24'
    ],
    correctIndex: 1,
    explanation: 'Telusuri nilai i dari 1 sampai 4:\n- Saat i = 1: total = 0 + (1*2) = 2\n- Saat i = 2: total = 2 + (2*2) = 2 + 4 = 6\n- Saat i = 3: total = 6 + (3*2) = 6 + 6 = 12\n- Saat i = 4: total = 12 + (4*2) = 12 + 8 = 20.',
    whyCorrect: 'Perhitungan penjumlahan deret 2 + 4 + 6 + 8 menghasilkan nilai tepat 20.',
    distractorExplanations: [
      'Pilihan A (10) salah karena hanya menjumlahkan 1 + 2 + 3 + 4 tanpa dikalikan 2.',
      'Pilihan C (8) salah karena itu hanya nilai tambahan pada iterasi terakhir (4*2).',
      'Pilihan D (16) salah karena ada kekeliruan perhitungan pada akumulasi iterasi.',
      'Pilihan E (24) salah karena menghitung perulangan hingga iterasi ke-5.'
    ]
  },
  {
    id: 16,
    category: 'penerapan',
    difficulty: 'Mudah',
    indicator: 'Menerapkan konversi satuan suhu sekuensial.',
    topic: 'Perhitungan Sekuensial Rumus',
    question: 'Rumus konversi suhu dari Celsius (C) ke Reamur (R) adalah `R = (4.0 / 5.0) * C`. Jika suhu ruangan kelas terukur `C = 30`, berapakah suhu dalam derajat Reamur yang dihasilkan oleh program?',
    options: [
      '24 derajat Reamur',
      '37.5 derajat Reamur',
      '20 derajat Reamur',
      '34 derajat Reamur',
      '12 derajat Reamur'
    ],
    correctIndex: 0,
    explanation: 'R = (4.0 / 5.0) * 30 = 0.8 * 30 = 24.0 derajat Reamur.',
    whyCorrect: 'Kalkulasi matematis (4 * 30) / 5 = 120 / 5 = 24.',
    distractorExplanations: [
      'Pilihan B (37.5) salah karena menggunakan rumus terbalik (5.0 / 4.0) * 30.',
      'Pilihan C (20) salah karena kesalahan perhitungan pembagian.',
      'Pilihan D (34) salah karena keliru menambahkan angka konstanta 4.',
      'Pilihan E (12) salah karena keliru mengalikan dengan 2.'
    ]
  },
  {
    id: 17,
    category: 'penerapan',
    difficulty: 'Sedang',
    indicator: 'Menerapkan percabangan bertingkat (nested if) pada tarif parkir sekolah.',
    topic: 'Percabangan Bertingkat',
    question: 'Tarif parkir diatur sebagai berikut: 1 jam pertama Rp 2.000. Setiap jam berikutnya bertambah Rp 1.000. Jika lama parkir lebih dari 5 jam, diberikan diskon potongan tetap Rp 1.000. Jika Budi parkir selama 6 jam, berapakah total biaya yang harus dibayar?',
    options: [
      'Rp 7.000',
      'Rp 6.000',
      'Rp 8.000',
      'Rp 5.000',
      'Rp 9.000'
    ],
    correctIndex: 1,
    explanation: 'Perhitungan langkah per langkah:\n- Jam ke-1: Rp 2.000\n- 5 jam berikutnya: 5 x Rp 1.000 = Rp 5.000\n- Total tarif normal: Rp 2.000 + Rp 5.000 = Rp 7.000\n- Karena lama parkir (6 jam) > 5 jam, dapat diskon Rp 1.000\n- Total akhir = Rp 7.000 - Rp 1.000 = Rp 6.000.',
    whyCorrect: 'Pilihan B (Rp 6.000) adalah hasil kalkulasi tarif dasar ditambah tambahan jam dan dikurangi diskon batas waktu.',
    distractorExplanations: [
      'Pilihan A (Rp 7.000) salah karena lupa mengurangkan diskon potongan Rp 1.000.',
      'Pilihan C (Rp 8.000) salah karena menghitung 6 jam x Rp 1.000 + Rp 2.000 tanpa diskon.',
      'Pilihan D (Rp 5.000) salah karena menghitung tarif flat 5 jam saja.',
      'Pilihan E (Rp 9.000) salah karena kesalahan akumulasi biaya jam pertama.'
    ]
  },
  {
    id: 18,
    category: 'penerapan',
    difficulty: 'Sulit',
    indicator: 'Menerapkan perulangan while untuk menghitung digit angka.',
    topic: 'Penelusuran Algoritma Angka',
    question: 'Perhatikan algoritma pemotongan angka integer berikut:\n```\nbil = 472\njumlahDigit = 0\nSELAMA (bil > 0) LAKUKAN:\n    jumlahDigit = jumlahDigit + 1\n    bil = bil / 10   // pembagian integer membuang pecahan\nAKHIR SELAMA\n```\nBerapa kali perulangan terjadi dan apa nilai akhir `jumlahDigit`?',
    options: [
      'Perulangan 1 kali, jumlahDigit = 1',
      'Perulangan 3 kali, jumlahDigit = 3',
      'Perulangan 472 kali, jumlahDigit = 472',
      'Perulangan tidak pernah berhenti (infinite loop)',
      'Perulangan 2 kali, jumlahDigit = 2'
    ],
    correctIndex: 1,
    explanation: 'Trace perulangan:\n- Awal: bil = 472, jumlahDigit = 0\n- Iterasi 1: bil > 0 (Benar). jumlahDigit = 1, bil = 472 / 10 = 47\n- Iterasi 2: bil > 0 (Benar). jumlahDigit = 2, bil = 47 / 10 = 4\n- Iterasi 3: bil > 0 (Benar). jumlahDigit = 3, bil = 4 / 10 = 0\n- Iterasi 4: bil > 0 (0 > 0 adalah Salah). Perulangan berhenti.\nNilai akhir jumlahDigit = 3 (menghitung jumlah digit dari 472).',
    whyCorrect: 'Pilihan B tepat memetakan 3 iterasi pembagian integer yang mereduksi 472 -> 47 -> 4 -> 0.',
    distractorExplanations: [
      'Pilihan A salah karena perulangan masih berlanjut setelah digit pertama.',
      'Pilihan C salah karena bil dibagi 10 di setiap langkah, bukan dikurangi 1.',
      'Pilihan D salah karena nilai bil terus berkurang hingga mencapai 0.',
      'Pilihan E salah karena angka 472 memiliki 3 digit, bukan 2.'
    ]
  },
  {
    id: 19,
    category: 'penerapan',
    difficulty: 'Sedang',
    indicator: 'Menerapkan struktur switch-case untuk memilih menu kasir.',
    topic: 'Struktur Switch-Case',
    question: 'Dalam menu kantin terprogram:\n```cpp\nswitch(pilihan) {\n    case 1: harga = 10000; break;\n    case 2: harga = 15000; break;\n    case 3: harga = 8000; break;\n    default: harga = 0;\n}\n```\nJika siswa memasukkan input `pilihan = 2`, apa yang terjadi jika kata kunci `break;` pada baris `case 2` dihilangkan (*fall-through*)?',
    options: [
      'Kompilator akan menolak kode dengan pesan fatal syntax error.',
      'Variabel harga akan bernilai 15000 sesuai yang dipilih.',
      'Eksekusi akan merembes turun mengeksekusi case 3 sehingga nilai akhir harga menjadi 8000.',
      'Program akan otomatis mengulang kembali ke case 1.',
      'Komputer akan otomatis menutup program seketika.'
    ],
    correctIndex: 2,
    explanation: 'Di dalam C++, jika suatu `case` tidak diakhiri pernyataan `break;`, terjadi efek *fall-through*, di mana instruksi pada case di bawahnya (case 3) akan tetap dieksekusi tanpa mempedulikan kondisi pilihan.',
    whyCorrect: 'Pilihan C menjelaskan fenomena penting fall-through pada switch-case C++.',
    distractorExplanations: [
      'Pilihan A salah karena fall-through diperbolehkan secara sintaksis oleh C++ (bukan syntax error).',
      'Pilihan B salah karena tanpa break, harga akan tertimpa oleh instruksi di bawahnya.',
      'Pilihan D salah karena switch tidak melompat ke atas.',
      'Pilihan E salah karena program tetap berjalan linier ke baris berikutnya.'
    ]
  },
  {
    id: 20,
    category: 'penerapan',
    difficulty: 'Mudah',
    indicator: 'Menerapkan penukaran nilai dua variabel menggunakan variabel bantu (swapping).',
    topic: 'Algoritma Pertukaran Variabel',
    question: 'Diberikan variabel `gelasA = "Sirup Merah"` dan `gelasB = "Susu Putih"`. Untuk menukar isi kedua gelas tersebut agar `gelasA` berisi Susu dan `gelasB` berisi Sirup, algoritma komputasional membutuhkan variabel penampung sementara (`gelasC`). Urutan pertukaran yang benar adalah...',
    options: [
      'gelasA = gelasB; gelasB = gelasA;',
      'gelasC = gelasA; gelasA = gelasB; gelasB = gelasC;',
      'gelasB = gelasC; gelasC = gelasA; gelasA = gelasB;',
      'gelasC = gelasB; gelasB = gelasA; gelasA = gelasB;',
      'gelasA = gelasC; gelasB = gelasC;'
    ],
    correctIndex: 1,
    explanation: 'Logika penukaran 3 langkah (*swapping*):\n1. Simpan isi gelasA ke wadah sementara gelasC (`gelasC = gelasA`).\n2. Tuang isi gelasB ke gelasA (`gelasA = gelasB`).\n3. Tuang isi wadah sementara ke gelasB (`gelasB = gelasC`).',
    whyCorrect: 'Pilihan B menjaga agar data asli gelasA tidak terhapus saat ditimpa oleh data gelasB.',
    distractorExplanations: [
      'Pilihan A salah karena pada baris pertama nilai asli gelasA langsung tertimpa dan hilang selamanya.',
      'Pilihan C salah karena gelasC masih kosong/undefined saat disalin ke gelasB.',
      'Pilihan D salah karena menimpa gelasA dengan gelasB di akhir langkah.',
      'Pilihan E salah karena gelasC belum diisi data apa pun.'
    ]
  },

  // ===================== KATEGORI 3: ANALISIS KODE C++ (10 SOAL) =====================
  {
    id: 21,
    category: 'analisis',
    difficulty: 'Sedang',
    indicator: 'Menganalisis hasil pembagian bilangan bulat (integer division) di C++.',
    topic: 'Operasi Aritmetika Integer',
    question: 'Perhatikan potongan kode program C++ berikut:\n```cpp\n#include <iostream>\nint main() {\n    int a = 7;\n    int b = 2;\n    double hasil = a / b;\n    std::cout << hasil << std::endl;\n    return 0;\n}\n```\nApa yang akan dicetak ke layar terminal?',
    options: [
      '3.5',
      '3',
      '4',
      '3.0',
      'Error kompilasi'
    ],
    correctIndex: 1,
    explanation: 'Variabel `a` dan `b` keduanya bertipe `int`. Dalam bahasa C++, pembagian antara dua bilangan bulat menghasilkan bilangan bulat (*integer division*), yaitu 7 / 2 = 3 (angka pecahan 0.5 langsung dibuang). Saat dimasukkan ke `double hasil`, nilainya menjadi 3 (atau 3.0), dan std::cout secara default mencetak `3` jika tidak ada angka desimal penting.',
    whyCorrect: 'Pilihan B benar karena C++ melakukan integer division terlebih dahulu sebelum konversi tipe ke double.',
    distractorExplanations: [
      'Pilihan A (3.5) salah karena salah satu operan harus berupa double (misal 7.0 / b atau static_cast<double>(a) / b) agar menghasilkan 3.5.',
      'Pilihan C (4) salah karena pembagian bulat di C++ memotong desimal (floor toward zero), bukan membulatkan ke atas.',
      'Pilihan D (3.0) salah karena std::cout tidak menampilkan desimal nol tanpa manipulator std::fixed.',
      'Pilihan E salah karena kodenya valid secara sintaksis dan dapat dikompilasi.'
    ]
  },
  {
    id: 22,
    category: 'analisis',
    difficulty: 'Sedang',
    indicator: 'Menganalisis perbedaan pre-increment (++x) dan post-increment (x++).',
    topic: 'Operator Increment',
    question: 'Perhatikan kode C++ berikut:\n```cpp\nint x = 5;\nint y = ++x;\nint z = x++;\nstd::cout << x << " " << y << " " << z;\n```\nBerapakah nilai yang dicetak untuk x, y, dan z?',
    options: [
      '7 6 6',
      '6 6 5',
      '7 5 6',
      '5 6 7',
      '6 5 6'
    ],
    correctIndex: 0,
    explanation: 'Penelusuran:\n1. Awal: x = 5\n2. `y = ++x`: pre-increment menambah x menjadi 6 dulu, lalu dimasukkan ke y. (x = 6, y = 6)\n3. `z = x++`: post-increment memasukkan nilai x yang sekarang (6) ke z terlebih dahulu, baru kemudian x bertambah menjadi 7. (x = 7, z = 6)\nOutput akhir: x=7, y=6, z=6.',
    whyCorrect: 'Pilihan A mencerminkan urutan evaluasi pre-increment vs post-increment secara presisi.',
    distractorExplanations: [
      'Pilihan B salah karena tidak memperhitungkan kenaikan x pada baris z = x++.',
      'Pilihan C salah karena nilai y seharusnya 6, bukan 5.',
      'Pilihan D salah karena urutan variabel terbalik.',
      'Pilihan E salah karena nilai akhir x adalah 7 setelah dua kali increment.'
    ]
  },
  {
    id: 23,
    category: 'analisis',
    difficulty: 'Sulit',
    indicator: 'Menganalisis jalannya nested loop (perulangan bersarang).',
    topic: 'Nested Loop',
    question: 'Perhatikan potongan kode perulangan bersarang berikut:\n```cpp\nint hitung = 0;\nfor (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= 2; j++) {\n        hitung += i;\n    }\n}\nstd::cout << hitung;\n```\nNilai akhir yang ditampilkan pada layar adalah...',
    options: [
      '6',
      '12',
      '18',
      '24',
      '9'
    ],
    correctIndex: 1,
    explanation: 'Loop luar berjalan untuk i = 1, 2, 3. Di setiap nilai i, loop dalam berputar sebanyak 2 kali (j = 1, 2):\n- Saat i = 1: hitung += 1 (2 kali) -> bertambah 2\n- Saat i = 2: hitung += 2 (2 kali) -> bertambah 4\n- Saat i = 3: hitung += 3 (2 kali) -> bertambah 6\nTotal akhir hitung = 2 + 4 + 6 = 12.',
    whyCorrect: 'Pilihan B (12) adalah hasil penjumlahan akurat dari perkalian 2 * (1 + 2 + 3).',
    distractorExplanations: [
      'Pilihan A (6) salah karena hanya menghitung penjumlahan 1 + 2 + 3 satu kali saja.',
      'Pilihan C (18) salah karena menghitung loop dalam sebanyak 3 kali.',
      'Pilihan D (24) salah karena menjumlahkan nilai i * j.',
      'Pilihan E (9) salah karena ada kesalahan penjumlahan pada iterasi ke-2.'
    ]
  },
  {
    id: 24,
    category: 'analisis',
    difficulty: 'Sedang',
    indicator: 'Menganalisis prioritas operator logika dan relasional.',
    topic: 'Operator Precedence',
    question: 'Perhatikan ekspresi logika C++ berikut:\n```cpp\nbool hasil = (5 + 3 * 2 > 10) && !(4 == 5);\n```\nBerapakah nilai dari variabel `hasil`?',
    options: [
      'false (0)',
      'true (1)',
      'Error karena tanda seru (!) tidak boleh di depan tanda kurung',
      'Error kompilasi karena perkalian dan penjumlahan tercampur',
      'Undefined'
    ],
    correctIndex: 1,
    explanation: 'Evaluasi berdasarkan urutan prioritas:\n1. Perkalian didahulukan: 3 * 2 = 6, lalu 5 + 6 = 11.\n2. Relasional: 11 > 10 bernilai true (1).\n3. Negasi logika: 4 == 5 adalah false (0), sehingga !(false) menjadi true (1).\n4. Operator AND: true && true menghasilkan true (1).',
    whyCorrect: 'Pilihan B benar karena kedua bagian ekspresi relasional mengevaluasi ke true.',
    distractorExplanations: [
      'Pilihan A salah karena kedua sisi ekspresi bernilai benar, sehingga AND menghasilkan true.',
      'Pilihan C salah karena operator NOT (!) sah diletakkan di depan ekspresi kurung.',
      'Pilihan D salah karena ekspresi aritmetika dan logika dapat dikombinasikan dengan aman di C++.',
      'Pilihan E salah karena seluruh variabel dan operan terdefinisi pasti.'
    ]
  },
  {
    id: 25,
    category: 'analisis',
    difficulty: 'Sedang',
    indicator: 'Menganalisis kondisi berhenti perulangan do-while.',
    topic: 'Do-While Loop',
    question: 'Perhatikan kode berikut:\n```cpp\nint angka = 10;\ndo {\n    std::cout << angka << " ";\n    angka += 5;\n} while (angka < 10);\n```\nApa yang akan dicetak oleh program saat dijalankan?',
    options: [
      'Program tidak mencetak apa pun karena kondisi angka < 10 sejak awal sudah salah.',
      'Program mencetak: 10',
      'Program mencetak: 10 15',
      'Program mengalami perulangan tak berujung (infinite loop).',
      'Program menghasilkan syntax error pada tanda titik koma setelah while.'
    ],
    correctIndex: 1,
    explanation: 'Karakteristik utama perulangan `do-while` adalah badan perulangan **pasti dijalankan minimal satu kali** sebelum kondisi di dalam `while` diuji. Angka 10 dicetak, angka menjadi 15, lalu kondisi (15 < 10) bernilai false sehingga perulangan langsung berhenti.',
    whyCorrect: 'Pilihan B benar karena badan dieksekusi 1 kali sehingga angka 10 dicetak sebelum evaluasi kondisi berhenti.',
    distractorExplanations: [
      'Pilihan A salah karena perilaku tidak mencetak apa pun adalah sifat dari while loop biasa, bukan do-while.',
      'Pilihan C salah karena setelah mencetak 10, kondisi 15 < 10 bernilai false sehingga iterasi kedua tidak terjadi.',
      'Pilihan D salah karena kondisi berhenti false menghentikan eksekusi secara normal.',
      'Pilihan E salah karena standar C++ mewajibkan tanda titik koma (;) di akhir konstruksi do-while.'
    ]
  },
  {
    id: 26,
    category: 'analisis',
    difficulty: 'Sulit',
    indicator: 'Menganalisis manipulasi string dan fungsi panjang teks.',
    topic: 'Manipulasi String',
    question: 'Perhatikan potongan kode program C++ berikut:\n```cpp\n#include <iostream>\n#include <string>\nint main() {\n    std::string kata = "INFORMATIKA";\n    std::cout << kata[0] << kata[kata.length() - 1];\n    return 0;\n}\n```\nApa keluaran yang ditampilkan di layar?',
    options: [
      'IA',
      'IN',
      'IK',
      'AA',
      'Error kompilasi'
    ],
    correctIndex: 0,
    explanation: 'Dalam C++, indeks string berbasis 0 (*zero-based indexing*):\n- `kata[0]` mengambil karakter pertama, yaitu "I".\n- `kata.length()` bernilai 11.\n- `kata[kata.length() - 1]` adalah `kata[10]`, yang mengambil karakter terakhir, yaitu "A".\nGabungan output: "IA".',
    whyCorrect: 'Pilihan A secara tepat memadukan karakter pertama (indeks 0) dan karakter terakhir (indeks length-1).',
    distractorExplanations: [
      'Pilihan B salah karena kata[1] adalah N, bukan karakter terakhir.',
      'Pilihan C salah karena kata[kata.length() - 2] adalah K.',
      'Pilihan D salah karena karakter pertama adalah I, bukan A.',
      'Pilihan E salah karena header <string> sudah disertakan dan pengindeksan array valid.'
    ]
  },
  {
    id: 27,
    category: 'analisis',
    difficulty: 'Sedang',
    indicator: 'Menganalisis instruksi break di dalam perulangan for.',
    topic: 'Kontrol Alur Break',
    question: 'Perhatikan kode perulangan berikut:\n```cpp\nfor (int i = 1; i <= 10; i++) {\n    if (i == 4) break;\n    std::cout << i << " ";\n}\n```\nApa deret angka yang dicetak oleh program?',
    options: [
      '1 2 3 4 5 6 7 8 9 10',
      '1 2 3',
      '1 2 3 5 6 7 8 9 10',
      '4 5 6 7 8 9 10',
      '1 2 3 4'
    ],
    correctIndex: 1,
    explanation: 'Instruksi `break;` langsung menghentikan dan keluar dari seluruh blok perulangan secara permanen. Ketika i = 1, dicetak 1. Ketika i = 2, dicetak 2. Ketika i = 3, dicetak 3. Ketika i = 4, kondisi if terpenuhi dan `break;` dieksekusi sebelum perintah cout dijalankan.',
    whyCorrect: 'Pilihan B (1 2 3) benar karena perulangan segera dihentikan tepat saat i mencapai 4.',
    distractorExplanations: [
      'Pilihan A salah karena mengabaikan instruksi break.',
      'Pilihan C salah karena itu adalah output jika menggunakan `continue;` bukan `break;`.',
      'Pilihan D salah karena perulangan dimulai dari 1 bukan 4.',
      'Pilihan E salah karena break terjadi sebelum angka 4 sempat dicetak.'
    ]
  },
  {
    id: 28,
    category: 'analisis',
    difficulty: 'Sedang',
    indicator: 'Menganalisis instruksi continue pada perulangan.',
    topic: 'Kontrol Alur Continue',
    question: 'Perhatikan kode berikut:\n```cpp\nfor (int i = 1; i <= 5; i++) {\n    if (i == 3) continue;\n    std::cout << i << " ";\n}\n```\nPerbedaan utama `continue` dibandingkan `break` yang terlihat dari output kode ini adalah...',
    options: [
      'Program mencetak 1 2 4 5 karena continue hanya melompati iterasi saat ini dan lanjut ke iterasi berikutnya.',
      'Program mencetak 1 2 saja karena continue menghentikan perulangan sama seperti break.',
      'Program mencetak 3 4 5 karena continue mengulang nilai i = 3 berkali-kali.',
      'Program mengalami error karena continue hanya berlaku pada fungsi rekursif.',
      'Program tidak mencetak apa pun.'
    ],
    correctIndex: 0,
    explanation: '`continue;` hanya melompati sisa instruksi pada putaran (iterasi) saat ini dan langsung melompat ke pembaruan counter (i++) untuk iterasi berikutnya. Sehingga saat i = 3 dilompati, dan perulangan berlanjut mencetak 4 dan 5.',
    whyCorrect: 'Pilihan A tepat membedakan efek continue (skip 1 iterasi) vs break (keluar permanen).',
    distractorExplanations: [
      'Pilihan B salah karena mengira continue memiliki perilaku mematikan loop seperti break.',
      'Pilihan C salah karena continue tidak menahan program pada nilai yang sama.',
      'Pilihan D salah karena continue adalah kata kunci standar untuk semua jenis loop di C++.',
      'Pilihan E salah karena angka 1, 2, 4, dan 5 tetap dicetak normal.'
    ]
  },
  {
    id: 29,
    category: 'analisis',
    difficulty: 'Sulit',
    indicator: 'Menganalisis evaluasi kondisi bertumpuk dengan operator logika OR (||).',
    topic: 'Evaluasi Logika OR',
    question: 'Diberikan kode C++ berikut:\n```cpp\nint nilai = 65;\nint presensi = 95;\nif (nilai >= 75 || presensi >= 90) {\n    std::cout << "Kualifikasi Terpenuhi";\n} else {\n    std::cout << "Gagal Kualifikasi";\n}\n```\nMengapa teks "Kualifikasi Terpenuhi" berhasil dicetak meskipun nilai siswa (65) berada di bawah 75?',
    options: [
      'Karena kompilator C++ mengabaikan kondisi pertama jika nilai bertipe integer.',
      'Karena operator OR (||) bernilai true jika salah satu saja dari kondisi bernilai true.',
      'Karena presensi 95 otomatis menggantikan nilai ujian yang kurang.',
      'Karena tanda kurung pada if otomatis membalik logika perbandingan.',
      'Karena program mengalami overflow memori pada variabel presensi.'
    ],
    correctIndex: 1,
    explanation: 'Tabel kebenaran operator logika OR (`||`) menyatakan bahwa hasil evaluasi bernilai `true` jika MINIMAL SATU kondisi bernilai benar. Kondisi 1 (65 >= 75) bernilai false, namun Kondisi 2 (95 >= 90) bernilai true. Maka false || true menghasilkan true.',
    whyCorrect: 'Pilihan B secara akurat menjelaskan sifat logika disjungsi inklusif (OR) dalam pemrograman.',
    distractorExplanations: [
      'Pilihan A salah karena kompilator tetap mengevaluasi kondisi pertama.',
      'Pilihan C salah karena variabel presensi tidak memanipulasi variabel nilai.',
      'Pilihan D salah karena kurung hanya berfungsi mengelompokkan urutan evaluasi.',
      'Pilihan E salah karena angka 95 berada dalam batas aman integer yang valid.'
    ]
  },
  {
    id: 30,
    category: 'analisis',
    difficulty: 'Sedang',
    indicator: 'Menganalisis pencetakan format baris menggunakan std::endl vs \\n.',
    topic: 'Format Output Stream',
    question: 'Perhatikan dua instruksi berikut:\nInstruksi 1: `std::cout << "Halo" << std::endl;`\nInstruksi 2: `std::cout << "Halo\\n";`\nPernyataan yang benar mengenai kesamaan dan perbedaan kedua instruksi tersebut adalah...',
    options: [
      'Keduanya menghasilkan teks "Halo" diikuti baris baru, namun std::endl sekaligus melakukan flush pada buffer output.',
      'Instruksi 1 mencetak di layar monitor, sedangkan Instruksi 2 mencetak ke printer.',
      'Instruksi 2 menghasilkan error kompilasi karena simbol garis miring terbalik (\\) tidak diizinkan di C++.',
      'std::endl membuat teks menjadi huruf besar semua, sedangkan \\n membuat teks menjadi miring.',
      'Keduanya sama sekali tidak memiliki perbedaan teknis dalam implementasi internal C++.'
    ],
    correctIndex: 0,
    explanation: 'Baik `std::endl` maupun escape sequence `\\n` menyisipkan karakter baris baru (*newline*). Perbedaannya, `std::endl` secara eksplisit memanggil fungsi flush (`std::flush`) yang memaksa buffer stream dikosongkan dan langsung ditulis ke terminal.',
    whyCorrect: 'Pilihan A tepat memaparkan kesamaan fungsional dan perbedaan teknis flushing buffer.',
    distractorExplanations: [
      'Pilihan B salah karena keduanya mengalir ke perangkat output standar (konsol).',
      'Pilihan C salah karena escape character \\n adalah standar internasional bahasa C/C++.',
      'Pilihan D salah karena manipulasi kapitalisasi font tidak diatur oleh newline.',
      'Pilihan E salah karena ada perbedaan flush buffer yang berdampak pada performa program berkecepatan tinggi.'
    ]
  },

  // ===================== KATEGORI 4: IDENTIFIKASI & DEBUGGING KESALAHAN (10 SOAL) =====================
  {
    id: 31,
    category: 'debugging',
    difficulty: 'Mudah',
    indicator: 'Menemukan kesalahan operator penugasan (=) vs pembanding (==) dalam if statement.',
    topic: 'Debugging Logika Assignment dalam If',
    question: 'Perhatikan kode yang ditulis siswa untuk memeriksa apakah nilai sama dengan 100:\n```cpp\nint nilai = 85;\nif (nilai = 100) {\n    std::cout << "Nilai Sempurna!";\n}\n```\nSaat dijalankan, teks "Nilai Sempurna!" justru selalu muncul. Apa penyebab kesalahan logika tersebut?',
    options: [
      'Siswa menggunakan operator penugasan (=) bukannya operator pembanding kesetaraan (==).',
      'Variabel nilai harus bertipe data float agar bisa dibandingkan.',
      'Fungsi std::cout tidak dapat mencetak tanda seru (!).',
      'Nilai 85 otomatis dibulatkan oleh sistem menjadi 100.',
      'Perintah if tidak boleh digunakan untuk angka di atas 80.'
    ],
    correctIndex: 0,
    explanation: 'Ekspresi `nilai = 100` adalah operasi penugasan (*assignment*), bukan perbandingan (*equality*). Ekspresi ini mengubah variabel nilai menjadi 100, dan karena 100 bukan nol, nilai kondisi dianggap `true`. Seharusnya ditulis `if (nilai == 100)`.',
    whyCorrect: 'Pilihan A secara akurat mendiagnosis bug klasik C++ antara operator `=` dan `==`.',
    distractorExplanations: [
      'Pilihan B salah karena tipe int sah dan paling umum digunakan untuk bilangan bulat.',
      'Pilihan C salah karena string literal dapat mencetak tanda seru tanpa masalah.',
      'Pilihan D salah karena tidak ada auto-rounding pada variabel terdefinisi.',
      'Pilihan E salah karena if dapat menguji nilai numerik dalam rentang tak terbatas.'
    ]
  },
  {
    id: 32,
    category: 'debugging',
    difficulty: 'Mudah',
    indicator: 'Mengidentifikasi syntax error ketiadaan titik koma (semicolon).',
    topic: 'Semicolon Error',
    question: 'Saat mengompilasi program C++, muncul pesan kesalahan:\n`error: expected \';\' before \'return\'`\nApa langkah perbaikan yang harus dilakukan oleh siswa?',
    options: [
      'Menambahkan tanda titik koma (;) pada baris kode tepat sebelum kata kunci return.',
      'Mengganti kata return dengan kata exit(0).',
      'Menghapus seluruh pustaka #include <iostream>.',
      'Menutup aplikasi dan melakukan restart pada laptop.',
      'Menambahkan tanda kurung siku pada fungsi main.'
    ],
    correctIndex: 0,
    explanation: "Setiap pernyataan (*statement*) dalam bahasa C++ wajib diakhiri dengan tanda titik koma (`;`). Pesan `expected ';' before 'return'` memberitahukan kompilator menemukan baris baru sebelum pernyataan sebelumnya ditutup dengan titik koma.",
    whyCorrect: 'Pilihan A adalah perbaikan langsung sesuai instruksi pesan kompilator.',
    distractorExplanations: [
      'Pilihan B salah karena return 0 adalah standar resmi C++ untuk fungsi main.',
      'Pilihan C salah karena menghapus iostream justru menimbulkan puluhan error baru terkait cout.',
      'Pilihan D salah karena kesalahan terletak pada teks kode sumber, bukan sistem operasi laptop.',
      'Pilihan E salah karena fungsi menggunakan tanda kurung kurawal, bukan kurung siku.'
    ]
  },
  {
    id: 33,
    category: 'debugging',
    difficulty: 'Sedang',
    indicator: 'Mengidentifikasi bug perulangan tak berujung (infinite loop).',
    topic: 'Debugging Infinite Loop',
    question: 'Perhatikan kode perulangan yang menyebabkan program membeku (*hang*):\n```cpp\nint i = 1;\nwhile (i <= 5) {\n    std::cout << "Belajar C++" << std::endl;\n}\n```\nMengapa program di atas mengalami infinite loop dan bagaimana cara memperbaikinya?',
    options: [
      'Kondisi i <= 5 salah; harus diubah menjadi i == 5.',
      'Teks string terlalu panjang sehingga memori penuh.',
      'Variabel counter `i` tidak pernah dinaikkan nilainya (tidak ada `i++`), sehingga nilai i selalu 1 dan kondisi i <= 5 selalu bernilai true.',
      'Perulangan while tidak boleh menggunakan tipe data int.',
      'Kata std::endl harus diganti menjadi std::cin.'
    ],
    correctIndex: 2,
    explanation: 'Di dalam badan perulangan while, nilai `i` tidak pernah diubah nilainya. Karena `i` selalu bernilai 1, kondisi `1 <= 5` akan selamanya bernilai true, menyebabkan program mencetak tanpa henti. Solusinya: tambahkan `i++;` di dalam kurung kurawal.',
    whyCorrect: 'Pilihan C secara tepat menjelaskan ketiadaan *loop update expression* (inkremen counter).',
    distractorExplanations: [
      'Pilihan A salah karena i == 5 hanya akan menjalankan perulangan jika nilai awal i memang 5.',
      'Pilihan B salah karena teks pendek tersebut hanya menggunakan beberapa byte RAM.',
      'Pilihan D salah karena variabel integer adalah tipe standar untuk counter perulangan.',
      'Pilihan E salah karena cin digunakan untuk menerima masukan, bukan mencetak baris baru.'
    ]
  },
  {
    id: 34,
    category: 'debugging',
    difficulty: 'Sedang',
    indicator: 'Mengidentifikasi runtime error pembagian dengan nol (division by zero).',
    topic: 'Debugging Division by Zero',
    question: 'Perhatikan potongan kode C++ berikut:\n```cpp\nint totalNilai = 0;\nint jumlahSiswa = 0;\nint rataRata = totalNilai / jumlahSiswa;\n```\nSaat dijalankan, program tiba-tiba crash dengan pesan error seperti `Floating point exception` atau program tertutup paksa. Apa penyebabnya dan bagaimana cara penanganannya?',
    options: [
      'Terjadi pembagian dengan nol (division by zero) yang tidak terdefinisi secara matematis; solusinya periksa jumlahSiswa > 0 sebelum melakukan pembagian.',
      'Variabel rataRata seharusnya bertipe string.',
      'Tanda garis miring (/) hanya boleh digunakan untuk komentar kode.',
      'Nilai nol tidak boleh disimpan dalam tipe data integer.',
      'Jumlah variabel dalam satu program tidak boleh melebihi dua buah.'
    ],
    correctIndex: 0,
    explanation: 'Pembagian bilangan bulat dengan angka nol (`x / 0`) menghasilkan kondisi tak terdefinisi di CPU dan memicu sinyal interupsi runtime exception yang mematikan aplikasi seketika. Pemrogram harus selalu memvalidasi pembagi bukan nol sebelum operasi dilakukan.',
    whyCorrect: 'Pilihan A mendiagnosis pembagian dengan nol dan memberikan solusi pencegahan percabangan if (jumlahSiswa > 0).',
    distractorExplanations: [
      'Pilihan B salah karena rata-rata adalah besaran numerik, bukan teks string.',
      'Pilihan C salah karena satu garis miring (/) adalah operator pembagian aritmetika resmi.',
      'Pilihan D salah karena integer sangat sah menyimpan nilai 0.',
      'Pilihan E salah karena program dapat memiliki ribuan variabel sesuai kapasitas memori.'
    ]
  },
  {
    id: 35,
    category: 'debugging',
    difficulty: 'Sedang',
    indicator: 'Mengidentifikasi kesalahan case sensitivity pada penamaan variabel di C++.',
    topic: 'Case Sensitivity C++',
    question: 'Seorang siswa mendeklarasikan variabel: `int totalBelanja = 50000;`\nLalu pada baris berikutnya ia menulis: `std::cout << TotalBelanja;`\nKompilator mengeluarkan error: `\'TotalBelanja\' was not declared in this scope`. Apa penyebab dari kesalahan ini?',
    options: [
      'Nilai 50000 melebihi kapasitas memori komputer.',
      'C++ adalah bahasa pemrograman yang bersifat case-sensitive (membedakan huruf besar dan huruf kecil), sehingga totalBelanja dan TotalBelanja dianggap dua entitas yang berbeda.',
      'Nama variabel tidak boleh terdiri dari dua kata yang digabung.',
      'Tanda kutip harus ditambahkan pada TotalBelanja.',
      'Variabel integer tidak dapat ditampilkan oleh std::cout.'
    ],
    correctIndex: 1,
    explanation: 'Bahasa C++ sangat membedakan huruf kapital dan huruf kecil (*case-sensitive*). Variabel `totalBelanja` (huruf t kecil) berbeda dengan `TotalBelanja` (huruf T kapital). Kompilator menganggap `TotalBelanja` belum pernah dibuat.',
    whyCorrect: 'Pilihan B secara tepat merujuk pada prinsip case sensitivity dalam penamaan identifier C++.',
    distractorExplanations: [
      'Pilihan A salah karena tipe data int dapat menampung angka hingga 2 milyar (2.147.483.647).',
      'Pilihan C salah karena penulisan camelCase (totalBelanja) adalah konvensi resmi yang sangat dianjurkan.',
      'Pilihan D salah karena menambahkan tanda kutip akan mencetak tulisan "TotalBelanja" bukannya nilai angkanya.',
      'Pilihan E salah karena cout dirancang untuk menampilkan semua tipe data primitif.'
    ]
  },
  {
    id: 36,
    category: 'debugging',
    difficulty: 'Sulit',
    indicator: 'Mengidentifikasi kesalahan urutan evaluasi kondisi if-else if.',
    topic: 'Debugging Urutan Percabangan',
    question: 'Perhatikan logika pengelompokan usia berikut:\n```cpp\nint usia = 16;\nif (usia >= 5) {\n    std::cout << "Anak-anak";\n} else if (usia >= 13) {\n    std::cout << "Remaja";\n} else if (usia >= 18) {\n    std::cout << "Dewasa";\n}\n```\nSiswa yang berusia 16 tahun justru mendapatkan output "Anak-anak". Mengapa kesalahan logika ini terjadi?',
    options: [
      'Karena kompilator C++ memilih kondisi pertama yang menghasilkan nilai true (16 >= 5 adalah true), sehingga blok else if di bawahnya tidak pernah diperiksa.',
      'Karena angka 16 secara otomatis digolongkan sebagai anak-anak oleh sistem operasi.',
      'Karena kata kunci else if tidak boleh diulang dua kali dalam satu program.',
      'Karena variabel usia harus diinput melalui keyboard dan tidak boleh diinisialisasi langsung.',
      'Karena tanda kurung kurawal pada if kurang dari tiga buah.'
    ],
    correctIndex: 0,
    explanation: 'Struktur `if-else if` bekerja dengan mekanisme seleksi eksklusif: begitu sebuah kondisi terpenuhi (`usia >= 5` bernilai true untuk usia 16), blok kode tersebut langsung dieksekusi dan seluruh percabangan berikutnya langsung dilewati. Oleh karena itu, pengujian rentang harus disusun dari nilai terbesar ke terkecil (`>= 18` dulu, lalu `>= 13`, baru `>= 5`).',
    whyCorrect: 'Pilihan A menjelaskan secara ilmiah cara kerja evaluasi beruntun pada rantai if-else if.',
    distractorExplanations: [
      'Pilihan B salah karena pengelompokan usia murni hasil eksekusi kode yang ditulis pemrogram.',
      'Pilihan C salah karena else if dapat digunakan sebanyak yang dibutuhkan.',
      'Pilihan D salah karena inisialisasi langsung (`int usia = 16`) sepenuhnya sah di C++.',
      'Pilihan E salah karena jumlah kurung kurawal sudah sepasang untuk tiap blok.'
    ]
  },
  {
    id: 37,
    category: 'debugging',
    difficulty: 'Sedang',
    indicator: 'Mengidentifikasi kesalahan tanda kutip ganda vs tanda kutip tunggal.',
    topic: 'Karakter vs String Literal',
    question: 'Diberikan baris kode C++:\n```cpp\nchar inisial = "A";\n```\nKompilator memberikan pesan error: `invalid conversion from \'const char*\' to \'char\'`. Bagaimana cara memperbaiki kode tersebut?',
    options: [
      'Mengubah tanda kutip ganda ("A") menjadi tanda kutip tunggal (\'A\').',
      'Mengganti nama variabel inisial menjadi angka.',
      'Menghapus tanda titik koma di akhir baris.',
      'Menambahkan tanda pagar (#) sebelum kata char.',
      'Mengganti tanda sama dengan (=) menjadi tanda panah (<-).'
    ],
    correctIndex: 0,
    explanation: 'Dalam C++, tipe data `char` hanya menyimpan satu karakter tunggal dan wajib diapit oleh tanda kutip tunggal (`\'A\'`). Tanda kutip ganda (`"A"`) merepresentasikan string literal (`const char*` yang berakhiran karakter null `\\0`), sehingga kompilator menolak konversinya ke tipe `char`.',
    whyCorrect: 'Pilihan A memberikan sintaks yang tepat untuk literal karakter tunggal di C++.',
    distractorExplanations: [
      'Pilihan B salah karena nama variabel bebas selama mematuhi aturan penamaan identifier.',
      'Pilihan C salah karena titik koma wajib ada di akhir setiap deklarasi.',
      'Pilihan D salah karena kata kunci char bukan preprocessor directive.',
      'Pilihan E salah karena operator assignment C++ adalah tanda sama dengan tunggal (=).'
    ]
  },
  {
    id: 38,
    category: 'debugging',
    difficulty: 'Sedang',
    indicator: 'Mengidentifikasi variabel yang belum diinisialisasi (uninitialized variable bug).',
    topic: 'Uninitialized Variable',
    question: 'Perhatikan kode akumulator berikut:\n```cpp\nint total;\nfor (int i = 1; i <= 5; i++) {\n    total += i;\n}\nstd::cout << total;\n```\nSaat dijalankan, program menampilkan angka aneh seperti `32773` bukannya `15`. Apa yang menyebabkan hal tersebut?',
    options: [
      'Variabel `total` belum diinisialisasi dengan nilai awal nol (`int total = 0;`), sehingga ia memuat nilai acak (garbage value) yang tersisa di memori RAM.',
      'Kompilator C++ mengalami kerusakan saat menjumlahkan angka 1 sampai 5.',
      'Perulangan for hanya dapat menjumlahkan bilangan ganjil.',
      'Variabel total seharusnya dinamai jumlah agar sistem mengenalinya.',
      'Operator `+=` tidak didukung oleh prosesor 64-bit.'
    ],
    correctIndex: 0,
    explanation: 'Di dalam C++, variabel lokal yang dideklarasikan tanpa nilai inisialisasi tidak otomatis bernilai 0. Variabel tersebut akan menampung nilai sisa (*garbage value*) yang berada di alamat memori tersebut. Menambahkan nilai ke garbage value menghasilkan angka yang tidak terduga.',
    whyCorrect: 'Pilihan A dengan tepat menjelaskan fenomena garbage value pada variabel tanpa inisialisasi.',
    distractorExplanations: [
      'Pilihan B salah karena kompilator bekerja secara deterministik sesuai instruksi yang diberikan.',
      'Pilihan C salah karena for loop dapat memproses bilangan bulat apa pun.',
      'Pilihan D salah karena nama variabel tidak mempengaruhi logika akumulasi sistem.',
      'Pilihan E salah karena operator compound assignment `+=` didukung di seluruh arsitektur prosesor.'
    ]
  },
  {
    id: 39,
    category: 'debugging',
    difficulty: 'Sulit',
    indicator: 'Mengidentifikasi kesalahan operator stream extraction (>>) vs insertion (<<).',
    topic: 'Operator Stream C++',
    question: 'Siswa menulis baris kode input-output berikut:\n```cpp\nint nilai;\nstd::cin << nilai;\nstd::cout >> "Hasil: " >> nilai;\n```\nKompilator menampilkan pesan error pada kedua baris tersebut. Apa koreksi yang tepat?',
    options: [
      'Tukar arah operator: gunakan `std::cin >> nilai;` untuk input dan `std::cout << "Hasil: " << nilai;` untuk output.',
      'Hapus kata std::cin dan gantikan dengan fungsi scanf.',
      'Gunakan tanda panah dua arah (<>) untuk semua operasi stream.',
      'Tambahkan tanda ampersand (&) di depan kata nilai.',
      'Gunakan huruf kapital pada CIN dan COUT.'
    ],
    correctIndex: 0,
    explanation: 'Arah operator stream di C++ mengikuti aliran data:\n- `std::cin >> var;`: *Stream extraction operator*, aliran data dari keyboard masuk ke dalam variabel.\n- `std::cout << data;`: *Stream insertion operator*, aliran data dari variabel dialirkan keluar menuju layar monitor.',
    whyCorrect: 'Pilihan A membetulkan arah panah operator stream sesuai standar baku C++.',
    distractorExplanations: [
      'Pilihan B salah karena std::cin adalah cara modern dan aman dalam C++ tanpa harus mundur ke fungsi C kuno.',
      'Pilihan C salah karena operator `<>` tidak ada dalam sintaksis stream C++.',
      'Pilihan D salah karena ampersand digunakan pada scanf atau referensi pointer, bukan operator cin standar.',
      'Pilihan E salah karena kata kunci C++ harus berupa huruf kecil (cin dan cout).'
    ]
  },
  {
    id: 40,
    category: 'debugging',
    difficulty: 'Sedang',
    indicator: 'Mengidentifikasi kesalahan indeks di luar batas (off-by-one error pada perulangan).',
    topic: 'Off-by-One Loop Error',
    question: 'Siswa diminta membuat program untuk mencetak angka 1 sampai 10 tepat sepuluh kali. Namun kodenya hanya mencetak angka 1 sampai 9:\n```cpp\nfor (int i = 1; i < 10; i++) {\n    std::cout << i << " ";\n}\n```\nBagian mana yang harus diperbaiki agar angka 10 ikut tercetak?',
    options: [
      'Ubah kondisi menjadi `i <= 10` atau `i < 11`.',
      'Ubah inisialisasi awal menjadi `int i = 0`.',
      'Ganti inkremen menjadi `i += 2`.',
      'Ganti for dengan perulangan do-while tanpa kondisi.',
      'Ubah tipe data i menjadi double.'
    ],
    correctIndex: 0,
    explanation: 'Kesalahan *off-by-one* ini terjadi karena operator `< 10` menghentikan loop begitu nilai `i` mencapai 10 (karena 10 < 10 bernilai false). Mengubahnya menjadi `i <= 10` memastikan iterasi ke-10 tetap dijalankan.',
    whyCorrect: 'Pilihan A memperluas batas inklusif kondisi perulangan agar mencakup angka 10.',
    distractorExplanations: [
      'Pilihan B salah karena memulai dari 0 justru akan mencetak angka 0 sampai 9 (tetap tidak ada angka 10).',
      'Pilihan C salah karena melompati angka genap dan hanya mencetak bilangan ganjil.',
      'Pilihan D salah karena do-while tanpa kondisi memicu infinite loop.',
      'Pilihan E salah karena perubahan tipe data tidak menyelesaikan kesalahan operator relasional.'
    ]
  },

  // ===================== KATEGORI 5: SOAL HOTS BERBASIS STUDI KASUS (10 SOAL) =====================
  {
    id: 41,
    category: 'hots',
    difficulty: 'Sulit',
    indicator: 'Menganalisis kompleksitas waktu efisiensi algoritma pengecekan bilangan prima.',
    topic: 'Efisiensi Algoritma Bilangan Prima',
    question: 'Untuk mengecek apakah bilangan bulat besar N adalah bilangan prima, Algoritma A memeriksa keterbagian N dari 2 sampai N-1. Sedangkan Algoritma B hanya memeriksa dari 2 sampai akar kuadrat dari N (sqrt(N)). Jika N bernilai 1.000.000, berapa perbandingan perkiraan jumlah langkah pengujian antara Algoritma A dan Algoritma B?',
    options: [
      'Algoritma A melakukan ~1.000.000 pengujian, sedangkan Algoritma B hanya melakukan ~1.000 pengujian (1.000 kali lebih efisien).',
      'Kedua algoritma melakukan jumlah pengujian yang persis sama karena nilai N identik.',
      'Algoritma B membutuhkan waktu lebih lama karena harus menghitung akar kuadrat di setiap iterasi.',
      'Algoritma A 2 kali lebih cepat daripada Algoritma B.',
      'Algoritma B tidak valid karena bilangan prima tidak boleh diuji dengan akar matematika.'
    ],
    correctIndex: 0,
    explanation: 'Faktor pembagi suatu bilangan selalu berpasangan (jika d membagi N, maka N/d juga membagi N). Salah satu dari pasangan tersebut pasti bernilai <= sqrt(N). Untuk N = 1.000.000, sqrt(N) = 1.000. Algoritma B hanya butuh maksimal 1.000 langkah, jauh lebih efisien dibanding 1.000.000 langkah pada Algoritma A.',
    whyCorrect: 'Pilihan A mencerminkan analisis Berpikir Komputasional tingkat tinggi (HOTS) terkait optimasi kompleksitas waktu O(N) vs O(sqrt(N)).',
    distractorExplanations: [
      'Pilihan B salah karena ruang pencarian faktor pembagi dipangkas secara drastis pada Algoritma B.',
      'Pilihan C salah karena pemangkasan 999.000 iterasi jauh melampaui biaya komputasi satu fungsi akar kuadrat.',
      'Pilihan D salah karena efisiensinya bukan 2 kali melainkan ratusan hingga ribuan kali lipat.',
      'Pilihan E salah karena metode uji batas akar prima adalah teorema matematika fundamental yang terbukti sah.'
    ]
  },
  {
    id: 42,
    category: 'hots',
    difficulty: 'Sulit',
    indicator: 'Mengevaluasi logika algoritma penentuan tarif listrik bersubsidi progresif.',
    topic: 'Studi Kasus Tarif Progresif',
    question: 'Sebuah desa menerapkan aturan tarif listrik pintar:\n- 50 kWh pertama: Rp 1.000 / kWh\n- 50 kWh berikutnya (51-100 kWh): Rp 1.500 / kWh\n- Di atas 100 kWh: Rp 2.000 / kWh untuk setiap kelebihan kWh.\nJika sebuah keluarga memakai daya listrik sebesar 120 kWh dalam sebulan, rumus manakah yang menghasilkan perhitungan tagihan yang benar dan berapa total tagihannya?',
    options: [
      'Tagihan = 120 * Rp 2.000 = Rp 240.000',
      'Tagihan = (50 * 1000) + (50 * 1500) + (20 * 2000) = Rp 165.000',
      'Tagihan = (50 * 1000) + (70 * 1500) = Rp 155.000',
      'Tagihan = 120 * Rp 1.500 = Rp 180.000',
      'Tagihan = (100 * 1000) + (20 * 2000) = Rp 140.000'
    ],
    correctIndex: 1,
    explanation: 'Perhitungan tarif progresif dipecah per lapisan (*tier/bracket*):\n- Tier 1 (50 kWh pertama): 50 x Rp 1.000 = Rp 50.000\n- Tier 2 (50 kWh kedua): 50 x Rp 1.500 = Rp 75.000\n- Tier 3 (sisa 20 kWh): 20 x Rp 2.000 = Rp 40.000\nTotal tagihan = Rp 50.000 + Rp 75.000 + Rp 40.000 = Rp 165.000.',
    whyCorrect: 'Pilihan B merefleksikan prinsip berpikir komputasional dekomposisi rentang tarif bertingkat secara tepat.',
    distractorExplanations: [
      'Pilihan A salah karena memperlakukan seluruh kWh dengan tarif tertinggi (bukan progresif berlapis).',
      'Pilihan C salah karena menggabungkan sisa pemakaian ke tier 2.',
      'Pilihan D salah karena memakai tarif rata-rata tunggal tanpa pemisahan tier.',
      'Pilihan E salah karena tier 1 hanya dibatasi 50 kWh, bukan 100 kWh.'
    ]
  },
  {
    id: 43,
    category: 'hots',
    difficulty: 'Sulit',
    indicator: 'Menganalisis skenario boundary value testing pada sistem penentuan kelulusan.',
    topic: 'Boundary Value Testing',
    question: 'Seorang programmer diminta menguji sistem kelulusan dengan syarat KKM 75: `if (nilai >= 75) Lulus; else Remedial;`. Dalam pengujian perangkat lunak (*software testing*), kumpulan data nilai manakah yang paling representatif untuk menguji titik kritis (*boundary value*) dari program tersebut?',
    options: [
      'Data: 0, 50, 100',
      'Data: 74, 75, 76 (nilai tepat sebelum batas, tepat di batas, dan tepat setelah batas)',
      'Data: 10, 20, 30',
      'Data: "Tujuh Puluh Lima", "Lulus", "Gagal"',
      'Data: 100, 200, 300'
    ],
    correctIndex: 1,
    explanation: 'Teknik pengujian batas (*Boundary Value Analysis*) membuktikan bahwa kesalahan logika (bug) paling sering muncul di sekitar titik pergantian keputusan. Untuk syarat `>= 75`, nilai kritisnya adalah:\n- 74 (tepat di bawah batas -> harus Remedial)\n- 75 (tepat di titik batas -> harus Lulus)\n- 76 (tepat di atas batas -> harus Lulus).',
    whyCorrect: 'Pilihan B adalah set data boundary testing paling metodis untuk memvalidasi operator `>=`.',
    distractorExplanations: [
      'Pilihan A salah karena data terlalu jauh dari titik batas 75.',
      'Pilihan C salah karena seluruh data berada di rentang yang sama (gagal) tanpa menguji kelulusan.',
      'Pilihan D salah karena menguji tipe data string yang tidak relevan dengan formula numerik.',
      'Pilihan E salah karena mencakup angka di luar rentang valid rapor (0-100).'
    ]
  },
  {
    id: 44,
    category: 'hots',
    difficulty: 'Sulit',
    indicator: 'Menganalisis rancangan algoritma antrean prioritas (Priority Queue) di UKS sekolah.',
    topic: 'Algoritma Penjadwalan & Prioritas',
    question: 'Di ruang UKS sekolah, pasien yang datang dilayani berdasarkan tingkat kegawatan medis (Kritis, Sedang, Ringan), bukan berdasarkan urutan waktu siapa yang datang paling pertama. Jika terdapat 2 siswa dengan tingkat kegawatan yang sama, barulah mereka dilayani berdasarkan waktu kedatangan. Struktur logika percabangan manakah yang memodelkan penanganan ini secara komputasional?',
    options: [
      'First-In First-Out (FIFO) murni tanpa memandang tingkat penyakit.',
      'Pengurutan multikriteria: Prioritas utama berdasarkan Tingkat_Kegawatan (descending); jika Tingkat_Kegawatan bernilai sama, bandingkan Waktu_Kedatangan (ascending).',
      'Pengurutan acak menggunakan fungsi rand() agar adil bagi semua siswa.',
      'Melayani seluruh pasien ringan terlebih dahulu agar antrean cepat habis.',
      'Menolak semua pasien baru sampai pasien lama sembuh total.'
    ],
    correctIndex: 1,
    explanation: 'Ini adalah model algoritma *Priority Queue with Secondary Key* (Antrean Berprioritas dengan Kunci Sekunder). Kriteria penentu pertama adalah bobot urgensi medis. Jika terjadi *tie-breaker* (urgensi sama), sistem menggunakan kriteria sekunder waktu kedatangan (FIFO).',
    whyCorrect: 'Pilihan B mencerminkan rancangan algoritma perbandingan multi-kondisi yang etis dan tepat secara komputasional.',
    distractorExplanations: [
      'Pilihan A salah karena pasien kritis dapat terlambat ditolong jika hanya mengandalkan urutan kedatangan.',
      'Pilihan C salah karena penanganan medis tidak boleh diundi secara probabilistik acak.',
      'Pilihan D salah karena mendahulukan pasien ringan mengancam nyawa pasien kritis.',
      'Pilihan E salah karena menghentikan operasional pelayanan kesehatan darurat.'
    ]
  },
  {
    id: 45,
    category: 'hots',
    difficulty: 'Sulit',
    indicator: 'Menganalisis refactoring kode perulangan untuk mencegah duplikasi kode (DRY Principle).',
    topic: 'Refactoring & Prinsip Desain DRY',
    question: 'Seorang siswa menulis kode untuk mencetak menu kantin dengan cara menyalin instruksi `std::cout` sebanyak 20 kali secara manual. Guru Informatika menyarankan siswa menerapkan prinsip DRY (*Don\'t Repeat Yourself*) dengan menggunakan perulangan array. Keuntungan utama dari perubahan (refactoring) tersebut adalah...',
    options: [
      'Ukuran file kode menjadi lebih ringkas, mudah diperbarui jika ada harga yang berubah, dan meminimalkan resiko kesalahan ketik (human error).',
      'Program akan berjalan otomatis tanpa membutuhkan listrik.',
      'Kompilator C++ akan memberi bonus nilai pada file binary.',
      'Program dapat dijalankan di televisi tanpa komputer.',
      'Teks menu akan otomatis diterjemahkan ke dalam 5 bahasa asing.'
    ],
    correctIndex: 0,
    explanation: 'Prinsip rekayasa perangkat lunak DRY (*Don\'t Repeat Yourself*) bertujuan menghilangkan redundansi instruksi. Dengan perulangan dan struktur data (array/vektor), penambahan menu baru cukup mengubah data tanpa menyalin-tempel puluhan baris cout.',
    whyCorrect: 'Pilihan A merangkum esensi maintainability, modularitas, dan keterbacaan kode dalam rekayasa perangkat lunak.',
    distractorExplanations: [
      'Pilihan B salah karena aplikasi tetap membutuhkan daya komputasi perangkat keras.',
      'Pilihan C salah karena compiler hanya memproduksi instruksi mesin tanpa preferensi bonus nilai.',
      'Pilihan D salah karena perangkat target bergantung pada ketersediaan runtime C++.',
      'Pilihan E salah karena refactoring struktur tidak otomatis menambahkan modul translasi bahasa.'
    ]
  },
  {
    id: 46,
    category: 'hots',
    difficulty: 'Sulit',
    indicator: 'Menganalisis skenario pencarian biner (Binary Search) vs pencarian linear.',
    topic: 'Perbandingan Algoritma Pencarian',
    question: 'Terdapat buku induk perpustakaan yang memuat 1.024 data siswa yang sudah terurut rapi berdasarkan Nomor Induk Siswa (NIS). Petugas ingin mencari data siswa dengan NIS tertentu.\n- Metode A: Memeriksa satu per satu dari halaman 1 sampai 1.024 (Pencarian Linear).\n- Metode B: Membuka halaman tengah, memeriksa apakah NIS lebih besar atau lebih kecil, lalu membuang setengah halaman yang tidak mungkin, berulang kali (Pencarian Biner).\nBerapa jumlah maksimal perbandingan yang dibutuhkan oleh Metode B pada skenario terburuk (*worst case*)?',
    options: [
      '1.024 kali perbandingan',
      '512 kali perbandingan',
      '10 kali perbandingan (karena 2 pangkat 10 = 1.024)',
      '100 kali perbandingan',
      '1 kali perbandingan'
    ],
    correctIndex: 2,
    explanation: 'Algoritma Pencarian Biner (*Binary Search*) memiliki kompleksitas logaritmik O(log2 N). Karena data sudah terurut, setiap langkah membagi ruang pencarian menjadi setengahnya: 1024 -> 512 -> 256 -> 128 -> 64 -> 32 -> 16 -> 8 -> 4 -> 2 -> 1. Total langkah maksimal adalah log2(1024) = 10 kali.',
    whyCorrect: 'Pilihan C menunjukkan penguasaan konsep efisiensi logaritmik biner yang menjadi fondasi ilmu komputer modern.',
    distractorExplanations: [
      'Pilihan A salah karena 1.024 adalah jumlah perbandingan terburuk untuk Pencarian Linear (Metode A).',
      'Pilihan B salah karena itu hanya langkah pemotongan pertama.',
      'Pilihan D salah karena perkiraan angka yang tidak berdasar pada basis logaritma 2.',
      'Pilihan E salah karena 1 kali perbandingan hanya terjadi jika data kebetulan persis di tengah pada langkah pertama (*best case*).'
    ]
  },
  {
    id: 47,
    category: 'hots',
    difficulty: 'Sulit',
    indicator: 'Mengevaluasi algoritma validasi input angka untuk mencegah program crash.',
    topic: 'Robustness & Validasi Input Masukan',
    question: 'Sebuah program kasir meminta pengguna memasukkan jumlah porsi makanan. Namun siswa yang iseng memasukkan angka negatif `-5`. Program yang tidak memiliki validasi akan menghitung total belanja menjadi minus (koperasi malah berutang ke pembeli!). Struktur algoritma yang paling tangguh untuk mencegah masalah ini adalah...',
    options: [
      'Mengabaikan input dan langsung mematikan komputer sekolah.',
      'Menggunakan perulangan validasi do-while: Minta input jumlah porsi, jika jumlah <= 0 tampilkan peringatan "Jumlah harus lebih besar dari 0!" dan ulangi permintaan input sampai data valid.',
      'Mengasumsikan setiap angka negatif otomatis diubah menjadi 100.',
      'Menghapus variabel harga satuan dari memori.',
      'Mengganti tipe data int menjadi char tanpa mengubah logika program.'
    ],
    correctIndex: 1,
    explanation: 'Prinsip ketangguhan sistem (*software robustness*) mewajibkan program memvalidasi setiap data dari pengguna (*Input Validation Loop*). Menggunakan loop `do { cin >> porsi; } while (porsi <= 0);` menjamin kalkulasi bisnis selanjutnya hanya memproses data yang secara logis masuk akal.',
    whyCorrect: 'Pilihan B menerapkan teknik input sanitization dan validation loop yang ramah pengguna dan andal.',
    distractorExplanations: [
      'Pilihan A salah karena merusak *user experience* dan mengganggu kenyamanan pengguna.',
      'Pilihan C salah karena asumsi sembarangan mengubah porsi menjadi 100 merugikan pembeli.',
      'Pilihan D salah karena ketiadaan harga menyebabkan program gagal menghitung sama sekali.',
      'Pilihan E salah karena tipe char tidak dapat dikalikan secara aritmetika dengan nominal rupiah.'
    ]
  },
  {
    id: 48,
    category: 'hots',
    difficulty: 'Sulit',
    indicator: 'Menganalisis trade-off penggunaan memori vs kecepatan pada algoritma memoization sederhana.',
    topic: 'Trade-off Waktu vs Memori',
    question: 'Untuk menghitung nilai deret Fibonacci ke-40, fungsi rekursif biasa membutuhkan waktu beberapa detik karena menghitung cabang yang sama berulang-ulang miliaran kali. Namun jika hasil perhitungan setiap angka disimpan ke dalam sebuah array (teknik memoization / tabel ingatan), program dapat menyelesaikannya dalam waktu kurang dari 0,001 detik. Konsep fundamental ilmu komputer yang tercermin di sini adalah...',
    options: [
      'Trade-off (pertukaran) antara ruang memori (Space) dan kecepatan waktu komputasi (Time Complexity).',
      'Bahwa komputer hanya bisa bekerja cepat jika tidak menggunakan array.',
      'Bahwa memori komputer tidak pernah berpengaruh terhadap kecepatan aplikasi.',
      'Bahwa fungsi perulangan selalu lebih lambat daripada mengetik kode secara manual.',
      'Bahwa angka 40 adalah batas maksimum angka matematika di dunia digital.'
    ],
    correctIndex: 0,
    explanation: 'Salah satu prinsip inti dalam desain algoritma adalah *Space-Time Trade-off*. Dengan mengorbankan sedikit ruang memori ekstra untuk menyimpan hasil antara (memoization/tabel), kita dapat menghemat jutaan operasi CPU yang redundant, meningkatkan kecepatan program secara drastis.',
    whyCorrect: 'Pilihan A merumuskan konsep mendasar Space vs Time Complexity yang sangat krusial dalam pemecahan masalah algoritma.',
    distractorExplanations: [
      'Pilihan B salah karena array justru menjadi kunci percepatan penyimpanan data antara.',
      'Pilihan C salah karena arsitektur cache dan memori sangat menentukan waktu akses CPU.',
      'Pilihan D salah karena perulangan dirancang untuk eksekusi repetitif secepat mungkin oleh mesin.',
      'Pilihan E salah karena sistem 64-bit dapat memproses angka hingga puluhan digit.'
    ]
  },
  {
    id: 49,
    category: 'hots',
    difficulty: 'Sulit',
    indicator: 'Menganalisis perancangan algoritma sistem kunci pintu otomatis pintar (Smart Lock).',
    topic: 'Studi Kasus State Machine Logika IoT',
    question: 'Pintu lab komputer sekolah dipasangi sistem kunci elektronik pintar dengan aturan:\n1. Pintu terbuka jika PIN benar ATAU Kartu RFID guru ditempelkan.\n2. NAMUN jika Tombol_Darurat_Kebakaran ditekan, pintu WAJIB langsung terbuka seketika tanpa memedulikan status PIN maupun kartu.\n3. Jika salah memasukkan PIN sebanyak 3 kali berturut-turut, sistem terkunci selama 60 detik.\nEkspresi logika boolean untuk kondisi "Pintu_Terbuka" yang paling aman sesuai aturan nomor 1 dan 2 adalah...',
    options: [
      'Pintu_Terbuka = Tombol_Darurat_Kebakaran || (!Sistem_Terkunci && (PIN_Benar || RFID_Guru))',
      'Pintu_Terbuka = PIN_Benar && RFID_Guru && Tombol_Darurat_Kebakaran',
      'Pintu_Terbuka = PIN_Benar || Sistem_Terkunci',
      'Pintu_Terbuka = !Tombol_Darurat_Kebakaran && RFID_Guru',
      'Pintu_Terbuka = (PIN_Benar && !RFID_Guru) || Sistem_Terkunci'
    ],
    correctIndex: 0,
    explanation: 'Analisis logika keselamatan:\n- Keadaan darurat (`Tombol_Darurat_Kebakaran`) harus menjadi *override* tertinggi melalui operator OR `||` di paling luar.\n- Pada kondisi normal (ketika tidak ada kebakaran), pintu hanya boleh terbuka jika sistem TIDAK sedang terkunci (`!Sistem_Terkunci`) DAN salah satu kredensial valid (`PIN_Benar || RFID_Guru`).',
    whyCorrect: 'Pilihan A menjamin keselamatan jiwa (prioritas darurat) sekaligus menjaga keamanan akses laboratorium pada kondisi normal.',
    distractorExplanations: [
      'Pilihan B salah karena operator AND mensyaratkan kebakaran harus terjadi dan kartu guru harus ada bersamaan agar pintu terbuka.',
      'Pilihan C salah karena pintu akan terbuka jika sistem terkunci, yang berlawanan dengan keamanan.',
      'Pilihan D salah karena pintu justru terkunci rapat saat terjadi kebakaran.',
      'Pilihan E salah karena logika memblokir akses jika kartu guru valid.'
    ]
  },
  {
    id: 50,
    category: 'hots',
    difficulty: 'Sulit',
    indicator: 'Mengevaluasi etika dan dampak sosial dari algoritma pembagian kuota internet belajar.',
    topic: 'Etika Komputasional & Keadilan Algoritma',
    question: 'Sebuah sekolah mengembangkan algoritma untuk membagi bantuan kuota internet belajar bagi siswa secara adil. Jika algoritma hanya mempertimbangkan siswa yang mengirim formulir pengajuan paling cepat (*First-Come First-Served*), siswa dari daerah pelosok dengan sinyal internet lemah akan selalu kalah cepat dan tidak pernah mendapatkan bantuan. Sebagai pengembang algoritma yang berkesadaran etis (*mindful*), solusi perbaikan algoritma terbaik adalah...',
    options: [
      'Tetap mempertahankan sistem cepat-cepatan karena komputer bekerja berdasarkan waktu milidetik.',
      'Mengubah algoritma berbasis skor bobot kebutuhan (Kondisi Ekonomi + Akses Transportasi + Rekomendasi Guru BK) dengan membuka periode pengumpulan berkas yang fleksibel sebelum perangkingan dilakukan.',
      'Menghapus program bantuan kuota agar tidak ada komplain dari pihak manapun.',
      'Memberikan kuota hanya kepada siswa yang memiliki nilai rapor tertinggi saja.',
      'Memilih penerima bantuan menggunakan generator angka acak tanpa syarat apa pun.'
    ],
    correctIndex: 1,
    explanation: 'Prinsip Pembelajaran Mendalam (*Deep Learning: Mindful & Meaningful*) mengajarkan bahwa teknologi dan algoritma harus melayani kemanusiaan dengan adil (*Algorithmic Fairness*). Membedah bias algoritma *First-Come First-Served* yang mendiskriminasi siswa bersinyal lambat dan menggantinya dengan sistem pembobotan kebutuhan multi-kriteria memastikan keadilan sosial.',
    whyCorrect: 'Pilihan B mencerminkan kematangan berpikir tingkat tinggi (HOTS) yang mengintegrasikan kecakapan teknis komputasional dengan empati dan kepekaan etika sosial.',
    distractorExplanations: [
      'Pilihan A salah karena melanggengkan ketidakadilan sistemik akibat bias teknologi.',
      'Pilihan C salah karena sikap apatis membatalkan solusi bermanfaat bagi mereka yang membutuhkan.',
      'Pilihan D salah karena bantuan kuota didasarkan pada kebutuhan sarana belajar, bukan semata hadiah prestasi akademik.',
      'Pilihan E salah karena pemilihan acak tidak menyasar kelompok rentan yang paling membutuhkan bantuan.'
    ]
  }
];
