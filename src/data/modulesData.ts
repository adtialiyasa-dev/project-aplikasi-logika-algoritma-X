import { LearningModule } from '../types.ts';

export const MODULES_DATA: LearningModule[] = [
  {
    id: 'modul-1',
    number: 1,
    title: 'Pengantar Logika dan Algoritma',
    subtitle: 'Membangun Pola Pikir Komputasional dan Logika Terstruktur',
    duration: '2 JP (90 Menit)',
    description: 'Memahami hakikat logika, algoritma, perbedaannya dengan program, serta karakteristik algoritma efektif dalam menyelesaikan persoalan kehidupan sehari-hari.',
    objectives: [
      'Menjelaskan pengertian logika dan algoritma dalam konteks pemecahan masalah (problem solving).',
      'Membedakan logika, algoritma, dan program komputer secara konseptual.',
      'Mengidentifikasi lima karakteristik algoritma yang baik menurut Donald Knuth (Finiteness, Definiteness, Input, Output, Effectiveness).',
      'Menyusun urutan langkah penyelesaian masalah logis dari kehidupan nyata.'
    ],
    keyTerms: ['Logika', 'Algoritma', 'Program', 'Finiteness', 'Definiteness', 'Effectiveness'],
    sections: [
      {
        title: '1. Pengertian Logika dan Algoritma',
        content: `**Logika** berasal dari kata Yunani *logos* yang berarti hasil pertimbangan akal pikiran yang diutarakan lewat kata dan dinyatakan dalam bahasa. Dalam informatika, logika adalah kemampuan berpikir lurus, tepat, dan teratur untuk menarik kesimpulan yang benar dari premis-premis yang ada.

**Algoritma** adalah urutan langkah-langkah logis dan terhingga yang disusun secara sistematis untuk menyelesaikan suatu masalah atau mencapai tujuan tertentu. Istilah ini berakar dari nama ilmuwan matematika Muslim terkemuka, **Muhammad ibn Musa al-Khwarizmi** (abad ke-9).`
      },
      {
        title: '2. Perbedaan Logika, Algoritma, dan Program',
        content: `Untuk memahami hubungan ketiganya, perhatikan analogi membuat kue:
- **Logika**: Pola pikir mengapa bahan seperti ragi harus dicampur dengan air hangat bukan mendidih agar adonan mengembang.
- **Algoritma**: Resep langkah-demi-langkah (1. Campur tepung, 2. Masukkan ragi, 3. Uleni selama 10 menit, 4. Panggang pada 180°C).
- **Program**: Eksekusi resep tersebut menggunakan oven dan loyang tertentu (dalam komputer: instruksi yang ditulis dalam bahasa pemrograman seperti C++ dan dapat dieksekusi oleh mesin).`
      },
      {
        title: '3. Karakteristik Algoritma yang Baik (Kriteria Donald Knuth)',
        content: `Menurut pakar ilmu komputer Donald E. Knuth, sebuah algoritma wajib memenuhi lima syarat mutlak:
1. **Finiteness (Keterhinggaan)**: Algoritma harus berakhir setelah melakukan sejumlah langkah terhingga. Tidak boleh berjalan selamanya (infinite loop).
2. **Definiteness (Kepastian)**: Setiap langkah harus didefinisikan secara tepat, jelas, dan tidak menimbulkan makna ganda (tidak ambigu).
3. **Input (Masukan)**: Memiliki nol atau lebih data masukan yang valid.
4. **Output (Keluaran)**: Menghasilkan minimal satu luaran sebagai solusi dari persoalan.
5. **Effectiveness (Efektivitas)**: Setiap langkah harus sederhana, terarah, dan dapat dikerjakan dalam waktu yang masuk akal.`
      }
    ],
    realWorldCases: [
      {
        title: 'Kasus 1: Algoritma Membuat Minuman Hangat Manis',
        problem: 'Siswa ingin membuat segelas teh manis hangat yang pas dan higienis saat istirahat belajar.',
        algorithmSteps: [
          'Siapkan cangkir bersih, 1 kantong teh celup, 2 sendok teh gula pasir, dan 200 ml air panas.',
          'Masukkan 2 sendok teh gula pasir ke dalam cangkir.',
          'Masukkan kantong teh celup ke dasar cangkir.',
          'Tuangkan air panas 200 ml secara perlahan ke dalam cangkir.',
          'Aduk larutan menggunakan sendok searah jarum jam selama 30 detik hingga gula larut sempurna.',
          'Angkat kantong teh celup dan tiriskan.',
          'Teh hangat manis siap diminum.'
        ],
        expectedResult: 'Segelas teh manis hangat dengan rasa yang rata dan gula larut sempurna.',
        logicalExplanation: 'Urutan menuang air panas setelah gula dan teh memastikan teh terekstraksi optimal dan gula larut lebih cepat karena suhu air yang masih tinggi.'
      },
      {
        title: 'Kasus 2: Penentuan Kelulusan Berdasarkan Nilai KKM 75',
        problem: 'Guru ingin menentukan apakah seorang siswa berstatus Lulus atau Remedial berdasarkan nilai ujian yang dimasukkan.',
        algorithmSteps: [
          'Baca nilai ujian siswa (misalkan variabel N).',
          'Periksa apakah N valid (berada di rentang 0 hingga 100).',
          'Jika N >= 75, maka tetapkan status = "LULUS".',
          'Jika N < 75, maka tetapkan status = "REMEDIAL".',
          'Tampilkan hasil status ke layar.'
        ],
        expectedResult: 'Keputusan objektif Lulus atau Remedial sesuai batas KKM.',
        logicalExplanation: 'Kondisi perbandingan N >= 75 memastikan tidak ada kerancuan antara nilai pas KKM (75) dan di bawahnya.'
      },
      {
        title: 'Kasus 3: Algoritma Menghitung Total Belanja dengan Diskon 10%',
        problem: 'Sebuah koperasi sekolah memberi potongan harga 10% jika total belanja siswa mencapai Rp 50.000 atau lebih.',
        algorithmSteps: [
          'Hitung total belanja kotor dari barang yang dibeli.',
          'Periksa apakah total belanja >= 50.000.',
          'Jika YA, hitung diskon = 10% * total belanja, lalu total bayar = total belanja - diskon.',
          'Jika TIDAK, diskon = 0, lalu total bayar = total belanja.',
          'Cetak struk belanja dengan rincian total belanja, potongan diskon, dan total yang harus dibayar.'
        ],
        expectedResult: 'Nominal pembayaran akhir yang akurat dan transparan.',
        logicalExplanation: 'Pemberian diskon bersyarat membutuhkan evaluasi boolean untuk menentukan formula pemotongan harga yang adil.'
      },
      {
        title: 'Kasus 4: Rute Perjalanan Paling Efisien ke Sekolah',
        problem: 'Siswa ingin memilih rute jalan dari rumah ke sekolah dengan waktu tempuh tercepat dengan mempertimbangkan titik macet.',
        algorithmSteps: [
          'Daftar seluruh alternatif jalur (Rute A: jalan arteri 4 km, Rute B: jalan pintas pemukiman 3 km).',
          'Periksa kondisi jam sibuk pagi hari (Rute A macet 20 menit; Rute B lancar 10 menit).',
          'Hitung estimasi total waktu tempuh untuk setiap rute.',
          'Bandingkan waktu tempuh: pilih rute dengan nilai waktu minimum.',
          'Mulai perjalanan melalui rute terpilih.'
        ],
        expectedResult: 'Tiba di sekolah tepat waktu dengan penggunaan energi dan waktu paling hemat.',
        logicalExplanation: 'Jarak terpendek belum tentu menghasilkan waktu tercepat bila terdapat hambatan; algoritma harus memperhitungkan faktor waktu dinamis.'
      }
    ],
    mindfulReflection: {
      question: 'Refleksi Berkesadaran (Mindful Reflection):',
      promptText: 'Pikirkan salah satu kegiatan harianmu (misalnya merapikan tas, berangkat ke sekolah, atau mencuci sepatu). Apakah urutan yang kamu lakukan selama ini sudah efisien? Jika satu langkah diubah posisinya, apa dampak logisnya?'
    }
  },
  {
    id: 'modul-2',
    number: 2,
    title: 'Berpikir Komputasional (Computational Thinking)',
    subtitle: '4 Pilar Pemecahan Masalah Efektif di Era Digital',
    duration: '2 JP (90 Menit)',
    description: 'Mendalami 4 pilar Berpikir Komputasional: Dekomposisi, Pengenalan Pola, Abstraksi, dan Perancangan Algoritma untuk membedah masalah kompleks menjadi solusi terstruktur.',
    objectives: [
      'Menguraikan 4 elemen utama Berpikir Komputasional (Dekomposisi, Pengenalan Pola, Abstraksi, Perancangan Algoritma).',
      'Menerapkan dekomposisi pada masalah nyata di lingkungan sekolah.',
      'Menemukan pola perulangan atau kemiripan pada sekumpulan data.',
      'Melakukan abstraksi dengan memisahkan informasi penting dari detail yang tidak relevan.'
    ],
    keyTerms: ['Dekomposisi', 'Pengenalan Pola', 'Abstraksi', 'Perancangan Algoritma', 'Computational Thinking'],
    sections: [
      {
        title: '1. Empat Pilar Berpikir Komputasional',
        content: `Berpikir Komputasional (*Computational Thinking* / CT) adalah metode pemecahan masalah yang melibatkan perumusan masalah dan solusinya sedemikian rupa sehingga solusi tersebut dapat direpresentasikan dalam bentuk yang dapat dieksekusi secara efektif oleh agen pemroses informasi (seperti komputer atau manusia).

Empat pilar pokok CT:
1. **Dekomposisi (Decomposition)**: Memecah masalah besar atau kompleks menjadi bagian-bagian yang lebih kecil dan lebih mudah dikelola.
2. **Pengenalan Pola (Pattern Recognition)**: Mengamati kesamaan, keteraturan, atau tren di antara masalah-masalah kecil tersebut.
3. **Abstraksi (Abstraction)**: Memfokuskan perhatian pada informasi inti dan penting, serta mengabaikan detail-detail yang tidak relevan.
4. **Perancangan Algoritma (Algorithm Design)**: Menyusun serangkaian aturan atau langkah berurutan untuk menyelesaikan masalah.`
      },
      {
        title: '2. Studi Kasus Kontekstual: Mengatur Jadwal Belajar Ujian Akhir',
        content: `Bagaimana siswa menerapkan 4 pilar CT untuk menyiapkan ujian 6 mata pelajaran dalam 1 minggu?
- **Dekomposisi**: Bagi persiapan menjadi 6 sub-tugas berdasarkan mata pelajaran (Informatika, Matematika, Bahasa Indonesia, dll), lalu bagi per bab.
- **Pengenalan Pola**: Kenali bahwa mata pelajaran hitungan (Matematika, Fisika) butuh latihan soal di pagi hari saat pikiran segar, sedangkan mata pelajaran hafalan lebih optimal diulas sore hari.
- **Abstraksi**: Fokus pada kisi-kisi dan kompetensi dasar yang diujikan; abaikan halaman buku yang berisi pengantar sejarah penerbit.
- **Perancangan Algoritma**: Buat jadwal harian terstruktur: Jam 08.00-10.00 review materi, 10.15-11.30 kuis latihan, 19.00 evaluasi mandiri.`
      }
    ],
    realWorldCases: [
      {
        title: 'Studi Kasus 1: Mengelola Data Nilai Kelas',
        problem: 'Wali kelas harus merekap nilai 36 siswa dari 8 mata pelajaran dan menentukan ranking serta predikat.',
        algorithmSteps: [
          'Dekomposisi: Pisahkan data nilai per siswa dan per mata pelajaran.',
          'Pola: Setiap siswa membutuhkan kalkulasi yang identik: Total = Sum(Nilai), Rata-rata = Total / 8.',
          'Abstraksi: Abaikan nomor sepatu, hobi, atau warna favorit siswa; hanya gunakan Nama, NIS, dan Angka Nilai.',
          'Algoritma: Looping dari siswa ke-1 hingga ke-36 untuk menghitung rata-rata dan menetapkan predikat.'
        ],
        expectedResult: 'Rekapitulasi nilai yang rapi, transparan, dan bebas dari bias emosional.',
        logicalExplanation: 'Abstraksi menghilangkan data sampah sehingga pemrosesan perhitungan nilai berjalan cepat dan akurat.'
      },
      {
        title: 'Studi Kasus 2: Sistem Antrean Cepat Kantin Sekolah',
        problem: 'Antrean kantin menumpuk saat istirahat 30 menit karena pemesanan, pemasakan, dan pembayaran dilakukan di satu meja.',
        algorithmSteps: [
          'Dekomposisi: Pisahkan proses menjadi 3 pos: (1) Pemesanan & Pembayaran kasir, (2) Pengambilan makanan, (3) Meja makan.',
          'Pola: Menu favorit yang dipesan 80% siswa adalah Nasi Goreng dan Es Teh.',
          'Abstraksi: Fokus pada kuantitas porsi, abaikan apakah siswa makan di tempat atau dibungkus selama proses masak awal.',
          'Algoritma: Masak dalam batch besar untuk menu favorit, berikan nomor antrean digital, panggil saat pesanan siap.'
        ],
        expectedResult: 'Waktu tunggu berkurang dari 15 menit menjadi 3 menit per siswa.',
        logicalExplanation: 'Menghilangkan *bottleneck* melalui pembagian beban kerja paralel (dekomposisi proses).'
      }
    ],
    mindfulReflection: {
      question: 'Pertanyaan Reflektif:',
      promptText: 'Saat kamu menghadapi tugas sekolah yang terasa sangat sulit dan menumpuk, pilar Berpikir Komputasional mana yang paling sering kamu abaikan? Bagaimana dekomposisi dapat membantumu mengurangi rasa cemas?'
    }
  },
  {
    id: 'modul-3',
    number: 3,
    title: 'Notasi Algoritma dan Pseudocode',
    subtitle: 'Menulis Logika Pemrograman Tanpa Terikat Sintaks Spesifik',
    duration: '2 JP (90 Menit)',
    description: 'Mempelajari cara menuliskan algoritma menggunakan bahasa natural dan pseudocode standar, memahami struktur sekuensial, percabangan, dan perulangan.',
    objectives: [
      'Menjelaskan fungsi dan kegunaan pseudocode dalam rekayasa perangkat lunak.',
      'Menerapkan aturan penulisan pseudocode yang bersih, konsisten, dan mudah dipahami.',
      'Mengidentifikasi deklarasi variabel, konstanta, input, proses, dan output.',
      'Menuliskan pseudocode untuk struktur sekuensial, percabangan (IF-THEN-ELSE), dan perulangan (FOR/WHILE).'
    ],
    keyTerms: ['Pseudocode', 'Variabel', 'Konstanta', 'Input/Output', 'Operator Aritmetika', 'Percabangan', 'Perulangan'],
    sections: [
      {
        title: '1. Apa itu Pseudocode?',
        content: `**Pseudocode** (kode semu) adalah representasi teks informal berstandar tinggi dari algoritma pemrograman. Pseudocode menggunakan konvensi struktural bahasa pemrograman umum, namun dirancang untuk dibaca oleh manusia bukan dikompilasi langsung oleh komputer.

**Manfaat Pseudocode:**
- Membantu programmer merancang logika sebelum terjebak pada kesalahan pengetikan tanda kurung atau titik koma (sintaks).
- Mudah diterjemahkan ke bahasa pemrograman apa pun (C++, Python, Java, JavaScript).
- Menjadi jembatan komunikasi antara analis sistem, guru, dan pemrogram.`
      },
      {
        title: '2. Komponen Dasar Pseudocode',
        content: `Sebuah pseudocode yang baik terdiri atas 3 bagian utama:
1. **Header (Judul Algoritma)**: Berisi nama algoritma dan penjelasan singkat.
2. **Kamus / Deklarasi**: Bagian pengenalan variabel dan tipe datanya.
3. **Deskripsi**: Bagian inti yang memuat langkah-langkah logika (Input -> Proses -> Output).`
      },
      {
        title: '3. Contoh Notasi Penentuan Kelulusan',
        content: `Berikut contoh pseudocode penentuan kelulusan siswa:`,
        codeExample: `ALGORITMA PenentuKelulusan
DEKLARASI:
    nama : string
    nilai : integer

DESKRIPSI:
    MULAI
    Tampilkan "Masukkan Nama Siswa: "
    Input nama
    Tampilkan "Masukkan Nilai Siswa (0-100): "
    Input nilai

    Jika nilai >= 75 Maka
        Tampilkan nama, " dinyatakan LULUS!"
    Jika Tidak
        Tampilkan nama, " dinyatakan BELUM LULUS (Harap Mengikuti Remedial)"
    AkhirJika
    SELESAI`
      }
    ],
    realWorldCases: [
      {
        title: 'Notasi Algoritma: Menghitung Keliling dan Luas Lingkaran',
        problem: 'Menghitung luas dan keliling lingkaran dengan jari-jari r.',
        algorithmSteps: [
          'Tetapkan konstanta PHI = 3.14159',
          'Input jariJari',
          'Hitung luas = PHI * jariJari * jariJari',
          'Hitung keliling = 2 * PHI * jariJari',
          'Tampilkan nilai luas dan keliling'
        ],
        expectedResult: 'Nilai luas dan keliling akurat dengan desimal presisi.',
        logicalExplanation: 'Konstanta tidak boleh diubah nilainya selama runtime program untuk menjaga kebenaran formula matematika.'
      }
    ],
    mindfulReflection: {
      question: 'Pertanyaan Refleksi:',
      promptText: 'Mengapa menulis pseudocode terlebih dahulu sebelum mengetik kode C++ menghemat waktu kita dan mencegah terjadinya frustrasi karena error?'
    }
  },
  {
    id: 'modul-4',
    number: 4,
    title: 'Flowchart atau Diagram Alir',
    subtitle: 'Visualisasi Grafis Standar ISO untuk Alur Logika Pemrograman',
    duration: '2 JP (90 Menit)',
    description: 'Mengenal simbol-simbol standar diagram alir (terminator, proses, input/output, decision, konektor) dan memetakan alur logika secara visual yang komprehensif.',
    objectives: [
      'Menyebutkan nama dan fungsi 6 simbol standar diagram alir (Flowchart ANSI/ISO).',
      'Menggambar diagram alir yang tepat untuk masalah sekuensial, percabangan, dan perulangan.',
      'Menganalisis keterkaitan langsung antara Pseudocode, Flowchart, dan Kode C++.'
    ],
    keyTerms: ['Flowchart', 'Terminator', 'Process', 'Input/Output', 'Decision', 'Flowline', 'Connector'],
    sections: [
      {
        title: '1. Simbol Standar Diagram Alir',
        content: `Diagram alir (*flowchart*) memvisualisasikan urutan operasi menggunakan simbol grafis standar:
- **Terminator (Oval / Kapsul)**: Menandai awal (*MULAI/START*) dan akhir (*SELESAI/STOP*) program.
- **Jajaran Genjang (Parallelogram)**: Operasi Input data (*READ/INPUT*) atau Output data (*PRINT/WRITE*).
- **Persegi Panjang (Rectangle)**: Langkah Pemrosesan data atau kalkulasi matematis (*PROCESS*).
- **Belah Ketupat (Diamond / Rhombus)**: Pengambilan keputusan (*DECISION*) dengan dua cabang jawaban: Ya (True) / Tidak (False).
- **Garis Alir (Flowline)**: Panah yang menunjukkan arah jalannya program.
- **Lingkaran Kecil (Connector)**: Penghubung alur di halaman yang sama jika diagram terlalu panjang.`
      },
      {
        title: '2. Menghubungkan 3 Representasi Logika',
        content: `Setiap solusi komputasi dapat dilihat dari 3 sudut pandang:
1. **Pseudocode**: Berbentuk teks deskriptif terstruktur.
2. **Flowchart**: Berbentuk diagram visual visualisasi alur percabangan.
3. **Kode C++**: Implementasi nyata dalam bahasa pemrograman formal.`
      }
    ],
    realWorldCases: [
      {
        title: 'Kasus: Penentuan Bilangan Ganjil atau Genap',
        problem: 'Diberikan sebuah bilangan bulat positif X, tentukan apakah X ganjil atau genap.',
        algorithmSteps: [
          'MULAI (Terminator)',
          'Input bilangan bulat X (Input/Output)',
          'Hitung sisa = X mod 2 (Proses)',
          'Uji apakah sisa == 0 ? (Decision)',
          'Jika YA: Cetak "GENAP"; Jika TIDAK: Cetak "GANJIL" (Input/Output)',
          'SELESAI (Terminator)'
        ],
        expectedResult: 'Output klasifikasi ganjil atau genap yang tepat.',
        logicalExplanation: 'Operasi modulus (%) membagi bilangan dengan 2; jika tidak menyisakan sisa (0), bilangan pasti habis dibagi dua alias genap.'
      }
    ],
    mindfulReflection: {
      question: 'Pertanyaan Refleksi:',
      promptText: 'Saat kamu melihat diagram alir yang memiliki alur panah berputar kembali ke langkah sebelumnya, apa arti perputaran tersebut dalam kehidupan nyata?'
    }
  },
  {
    id: 'modul-5',
    number: 5,
    title: 'Pengenalan Bahasa Pemrograman C++',
    subtitle: 'Fondasi, Anatomi Kode, Variabel, Tipe Data, dan I/O',
    duration: '2 JP (90 Menit)',
    description: 'Memulai pemrograman C++: fungsi main(), header iostream, cout untuk output, cin untuk input, deklarasi variabel, tipe data dasar, serta anatomi kesalahan koding.',
    objectives: [
      'Menjelaskan struktur dasar program C++ (preprocessor directive, namespace, main function).',
      'Menggunakan perintah std::cout untuk menampilkan data dan std::cin untuk menerima masukan.',
      'Memilih tipe data yang tepat (int, double, char, string, bool) sesuai kebutuhan variabel.',
      'Membedakan kesalahan sintaks (syntax error), kesalahan run-time, dan kesalahan logika (logical error).'
    ],
    keyTerms: ['#include <iostream>', 'main()', 'std::cout', 'std::cin', 'Tipe Data', 'Syntax Error', 'Logic Error'],
    sections: [
      {
        title: '1. Anatomi Program C++ Pertama',
        content: `Mari bedah baris demi baris program C++ paling klasik:`,
        codeExample: `#include <iostream>

int main() {
    std::cout << "Halo, Informatika Fase E!" << std::endl;
    return 0;
}`
      },
      {
        title: '2. Penjelasan Baris Kode',
        content: `- \`#include <iostream>\`: Memberitahu kompilator untuk menyertakan pustaka *Input/Output Stream*, yang memungkinkan program menampilkan teks ke layar atau membaca masukan keyboard.
- \`int main()\`: Fungsi utama (*entry point*). Setiap program C++ dieksekusi mulai dari baris pertama fungsi ini.
- \`{\` dan \`}\`: Tanda kurung kurawal menandai batas blok badan fungsi.
- \`std::cout << ...\`: *Character output*, mengalirkan teks atau nilai variabel ke konsol terminal. Operator \`<<\` disebut *stream insertion operator*.
- \`std::endl\`: Menyisipkan baris baru (*end-line*) dan mengosongkan buffer output.
- \`return 0;\`: Mengembalikan nilai 0 ke sistem operasi sebagai tanda bahwa program selesai dieksekusi secara normal dan sukses.`
      },
      {
        title: '3. Tipe Data Primitif C++',
        content: `C++ adalah bahasa *statically typed*, artinya setiap variabel harus dideklarasikan tipe datanya sebelum digunakan:
- \`int\`: Bilangan bulat (contoh: 17, -5, 100).
- \`double\`: Bilangan desimal presisi ganda (contoh: 3.14159, 87.5).
- \`char\`: Satu karakter tunggal diapit tanda kutip tunggal (contoh: 'A', 'K').
- \`string\`: Kumpulan karakter teks diapit tanda kutip ganda (contoh: "SMA Negeri 1").
- \`bool\`: Nilai kebenaran logika (\`true\` atau \`false\`).`
      }
    ],
    realWorldCases: [
      {
        title: 'Kasus: Menampilkan Biodata Siswa',
        problem: 'Membuat program untuk mencetak kartu identitas siswa digital.',
        algorithmSteps: [
          'Deklarasikan variabel nama, kelas, umur, dan nilaiRataRata',
          'Isi nilai variabel sesuai data siswa',
          'Tampilkan format kartu identitas yang rapi menggunakan cout'
        ],
        expectedResult: 'Format kartu identitas siswa di konsol terminal.',
        logicalExplanation: 'Menghindari hardcoding langsung pada teks dengan menggunakan variabel memungkinkan program digunakan kembali untuk ribuan siswa berbeda.'
      }
    ],
    mindfulReflection: {
      question: 'Pertanyaan Refleksi:',
      promptText: 'Ketika kompilator melaporkan pesan error merah di layarmu, apakah itu tanda kegagalan? Bagaimana pola pikir programmer profesional memandang pesan error sebagai petunjuk belajar?'
    }
  },
  {
    id: 'modul-6',
    number: 6,
    title: 'Struktur Sekuensial dalam C++',
    subtitle: 'Eksekusi Instruksi Langkah demi Langkah Berurutan',
    duration: '2 JP (90 Menit)',
    description: 'Menguasai struktur sekuensial (runtunan), di mana setiap perintah dijalankan secara beruntun dari atas ke bawah tanpa percabangan atau lompatan.',
    objectives: [
      'Menjelaskan karakteristik struktur sekuensial dalam komputasi.',
      'Menuliskan program C++ untuk kalkulasi aritmetika terstruktur (luas, rata-rata, konversi suhu).',
      'Menganalisis ketergantungan urutan baris terhadap hasil keluaran program.'
    ],
    keyTerms: ['Struktur Sekuensial', 'Urutan Eksekusi', 'Operator Aritmetika', 'cin', 'cout'],
    sections: [
      {
        title: '1. Karakteristik Struktur Sekuensial',
        content: `Struktur sekuensial adalah struktur algoritma paling mendasar. Setiap instruksi dikerjakan tepat satu kali, tepat setelah instruksi sebelumnya selesai, dan tepat sebelum instruksi berikutnya dimulai.

Jika urutan instruksi dibalik, hasil program dapat menjadi keliru atau bahkan memicu kesalahan kompilasi (misalnya menggunakan variabel sebelum variabel tersebut diisi data oleh \`cin\`).`
      },
      {
        title: '2. Contoh: Konversi Suhu Celsius ke Fahrenheit',
        content: `Rumus konversi suhu: F = (9.0 / 5.0) * C + 32`,
        codeExample: `#include <iostream>

int main() {
    double celsius;
    std::cout << "Masukkan suhu dalam Celsius: ";
    std::cin >> celsius;

    double fahrenheit = (9.0 / 5.0) * celsius + 32.0;

    std::cout << "Suhu dalam Fahrenheit = " << fahrenheit << " F" << std::endl;
    return 0;
}`
      }
    ],
    realWorldCases: [
      {
        title: 'Kasus: Menghitung Luas dan Keliling Lapangan Sekolah',
        problem: 'Lapangan basket sekolah berbentuk persegi panjang dengan panjang P dan lebar L.',
        algorithmSteps: [
          'Input panjang (P)',
          'Input lebar (L)',
          'Hitung luas = P * L',
          'Hitung keliling = 2 * (P + L)',
          'Tampilkan luas dan keliling ke layar'
        ],
        expectedResult: 'Nilai luas dan keliling yang benar.',
        logicalExplanation: 'Kedua rumus membutuhkan nilai P dan L yang sudah diinput sebelumnya; oleh karena itu input harus mendahului perhitungan.'
      }
    ],
    mindfulReflection: {
      question: 'Pertanyaan Refleksi:',
      promptText: 'Apa yang terjadi jika baris kalkulasi ditulis SEBELUM baris perintah cin? Mengapa urutan langkah menjadi hal yang sangat krusial dalam pemrograman?'
    }
  },
  {
    id: 'modul-7',
    number: 7,
    title: 'Struktur Percabangan dalam C++',
    subtitle: 'Pengambilan Keputusan Cerdas dengan if, else if, else, dan switch',
    duration: '2 JP (90 Menit)',
    description: 'Memprogram logika pengambilan keputusan berdasarkan kondisi boolean, menggunakan operator relasional (==, !=, <, >, <=, >=) dan operator logika (&&, ||, !).',
    objectives: [
      'Menerapkan struktur percabangan tunggal (if), ganda (if-else), dan majemuk (else if / switch).',
      'Mengombinasikan beberapa kondisi menggunakan operator logika AND (&&), OR (||), dan NOT (!).',
      'Menghindari kesalahan logika pada evaluasi rentang nilai.'
    ],
    keyTerms: ['if', 'if-else', 'else if', 'switch-case', 'Operator Relasional', 'Operator Logika', 'Boolean'],
    sections: [
      {
        title: '1. Konsep Percabangan',
        content: `Dalam kehidupan nyata, tindakan kita sering kali bergantung pada suatu syarat: *"Jika hujan, bawa payung; jika tidak, bawa topi"*.

Di dalam C++, kita menggunakan kata kunci \`if\`, \`else if\`, dan \`else\`. Blok kode di dalam kurung kurawal hanya akan dieksekusi apabila kondisi di dalam kurung bernilai \`true\` (benar).`
      },
      {
        title: '2. Contoh Program: Kategori Nilai Rapor Siswa',
        content: `Program berikut menentukan predikat mutu nilai siswa (A, B, C, D, E):`,
        codeExample: `#include <iostream>

int main() {
    int nilai;
    std::cout << "Masukkan nilai ujian (0 - 100): ";
    std::cin >> nilai;

    if (nilai >= 90) {
        std::cout << "Predikat: A (Sangat Memuaskan)" << std::endl;
    } else if (nilai >= 80) {
        std::cout << "Predikat: B (Baik)" << std::endl;
    } else if (nilai >= 70) {
        std::cout << "Predikat: C (Cukup)" << std::endl;
    } else if (nilai >= 60) {
        std::cout << "Predikat: D (Kurang)" << std::endl;
    } else {
        std::cout << "Predikat: E (Sangat Kurang / Remedial)" << std::endl;
    }

    return 0;
}`
      }
    ],
    realWorldCases: [
      {
        title: 'Kasus: Verifikasi Syarat Mengikuti Ekstrakurikuler Robotik',
        problem: 'Siswa dapat mendaftar jika nilai Informatika >= 80 DAN kehadiran kelas >= 90%.',
        algorithmSteps: [
          'Input nilaiInformatika dan persentaseKehadiran',
          'Uji: if (nilaiInformatika >= 80 && persentaseKehadiran >= 90)',
          'Jika benar: Tampilkan "Memenuhi syarat pendaftaran Robotik"',
          'Jika salah: Tampilkan "Belum memenuhi syarat pendaftaran"'
        ],
        expectedResult: 'Keputusan adil berdasarkan kombinasi dua kriteria sekaligus.',
        logicalExplanation: 'Operator logika && (AND) mensyaratkan kedua premis bernilai benar agar keseluruhan ekspresi bernilai benar.'
      }
    ],
    mindfulReflection: {
      question: 'Pertanyaan Refleksi:',
      promptText: 'Mengapa urutan pengujian kondisi dari nilai terbesar ke nilai terkecil pada if-else if (misal 90 lalu 80) sangat penting? Apa akibatnya jika kondisi nilai >= 60 diletakkan di paling atas?'
    }
  },
  {
    id: 'modul-8',
    number: 8,
    title: 'Struktur Perulangan dalam C++',
    subtitle: 'Otomatisasi Komputasi Repetitif dengan for, while, dan do-while',
    duration: '2 JP (90 Menit)',
    description: 'Menguasai tiga jenis perulangan di C++, memahami konsep inisialisasi, kondisi berhenti, dan inkremen, serta strategi mencegah perulangan tak berujung (infinite loop).',
    objectives: [
      'Membedakan sintaks dan fungsi perulangan for, while, dan do-while.',
      'Membuat program penjumlahan deret, faktorial, dan tabel perkalian.',
      'Menelusuri perubahan nilai variabel counter pada setiap iterasi menggunakan trace table.'
    ],
    keyTerms: ['for loop', 'while loop', 'do-while', 'Counter', 'Iterasi', 'Infinite Loop', 'Trace Table'],
    sections: [
      {
        title: '1. Tiga Bentuk Perulangan',
        content: `Komputer sangat unggul dalam melakukan pekerjaan yang berulang ribuan kali tanpa pernah lelah atau melakukan kesalahan hitung:
1. **for**: Cocok digunakan ketika **jumlah perulangan sudah diketahui pasti** sejak awal (misal mencetak 10 kali).
2. **while**: Menguji kondisi di awal sebelum menjalankan badan perulangan; cocok saat jumlah perulangan belum pasti bergantung kondisi runtime.
3. **do-while**: Menjalankan badan perulangan minimal satu kali, baru kemudian memeriksa kondisi berhenti di akhir.`
      },
      {
        title: '2. Contoh Perulangan for: Penjumlahan 1 sampai N',
        content: `Berikut program menghitung 1 + 2 + 3 + ... + N:`,
        codeExample: `#include <iostream>

int main() {
    int n;
    std::cout << "Hitung jumlah 1 sampai N. Masukkan N: ";
    std::cin >> n;

    int total = 0;
    for (int i = 1; i <= n; i++) {
        total += i; // total = total + i
    }

    std::cout << "Jumlah total = " << total << std::endl;
    return 0;
}`
      }
    ],
    realWorldCases: [
      {
        title: 'Kasus: Menghitung Nilai Faktorial (N!)',
        problem: 'Menghitung perkalian beruntun N! = N * (N-1) * ... * 1 untuk N positif.',
        algorithmSteps: [
          'Input bilangan bulat N (misal 5)',
          'Inisialisasi faktorial = 1',
          'Lakukan loop for dari i = 1 hingga N: faktorial = faktorial * i',
          'Tampilkan hasil faktorial'
        ],
        expectedResult: 'Hasil 5! = 120.',
        logicalExplanation: 'Nilai awal perkalian harus 1, karena jika 0 maka hasil perkalian beruntun akan selalu bernilai 0.'
      }
    ],
    mindfulReflection: {
      question: 'Pertanyaan Refleksi:',
      promptText: 'Bayangkan kamu lupa menuliskan instruksi i++ di dalam perulangan while. Apa yang akan terjadi pada komputermu? Bagaimana sikap hati-hati seorang programmer dalam mengendalikan kondisi berhenti perulangan?'
    }
  },
  {
    id: 'modul-9',
    number: 9,
    title: 'Implementasi Algoritma Menjadi Program C++',
    subtitle: 'Studi Kasus Menyeluruh: Dari Identifikasi Masalah Menuju Program Utuh',
    duration: '2 JP (90 Menit)',
    description: 'Mengintegrasikan sekuensial, percabangan, dan perulangan melalui metodologi 10 langkah (A-J) pemecahan masalah dunia nyata dengan standar industri.',
    objectives: [
      'Menerapkan tahapan pemecahan masalah komputasional A sampai J secara disiplin.',
      'Menerjemahkan spesifikasi masalah menjadi pseudocode, flowchart, dan kode C++ fungsional.',
      'Melakukan pengujian black-box dengan berbagai variasi input (normal, batas/boundary, dan ekstrem).'
    ],
    keyTerms: ['Studi Kasus Terpadu', 'Black-Box Testing', 'Boundary Cases', 'Refactoring', 'Problem-Based Learning'],
    sections: [
      {
        title: '1. Sepuluh Tahapan Rekayasa Solusi (A-J)',
        content: `Dalam dunia profesional, pembuatan program melalui tahapan terstandar:
A. Identifikasi masalah secara mendalam.
B. Tentukan masukan (Input), pemrosesan (Process), dan luaran (Output).
C. Susun algoritma verbal langkah demi langkah.
D. Buat pseudocode terstandar.
E. Gambarkan diagram alir (Flowchart) untuk memvisualkan alur percabangan.
F. Implementasikan algoritma ke dalam bahasa C++.
G. Uji program menggunakan data pengujian bervariasi.
H. Analisis performa dan ketepatan hasil pengujian.
I. Identifikasi kemungkinan bug atau kelemahan logika.
J. Kembangkan program agar lebih tangguh, efisien, dan ramah pengguna.`
      },
      {
        title: '2. Contoh Studi Kasus: Kasir Kantin Sekolah Digital',
        content: `Program kasir menghitung total harga berbagai menu, menjumlahkan total, mengecek syarat diskon siswa, dan menghitung uang kembalian.`,
        codeExample: `#include <iostream>

int main() {
    std::cout << "=== KASIR KANTIN SEHAT SMA ===" << std::endl;
    int pilihan, jumlah;
    int harga = 0;

    std::cout << "1. Nasi Soto Ayam (Rp 15.000)\\n";
    std::cout << "2. Mie Ayam Bakso (Rp 12.000)\\n";
    std::cout << "3. Gado-Gado Sehat (Rp 10.000)\\n";
    std::cout << "Pilih menu (1-3): ";
    std::cin >> pilihan;

    if (pilihan == 1) harga = 15000;
    else if (pilihan == 2) harga = 12000;
    else if (pilihan == 3) harga = 10000;
    else {
        std::cout << "Pilihan tidak valid!" << std::endl;
        return 0;
    }

    std::cout << "Masukkan porsi: ";
    std::cin >> jumlah;

    int totalKotor = harga * jumlah;
    int diskon = 0;
    if (totalKotor >= 30000) {
        diskon = totalKotor * 0.10; // Diskon 10%
    }
    int totalBayar = totalKotor - diskon;

    std::cout << "Total Belanja : Rp " << totalKotor << std::endl;
    std::cout << "Potongan      : Rp " << diskon << std::endl;
    std::cout << "Total Bayar   : Rp " << totalBayar << std::endl;

    int uangBayar;
    std::cout << "Uang Pembeli  : Rp ";
    std::cin >> uangBayar;

    if (uangBayar >= totalBayar) {
        std::cout << "Kembalian     : Rp " << (uangBayar - totalBayar) << std::endl;
        std::cout << "Terima kasih sudah belanja di Kantin Sekolah!" << std::endl;
    } else {
        std::cout << "Maaf, uang pembayaran kurang Rp " << (totalBayar - uangBayar) << std::endl;
    }

    return 0;
}`
      }
    ],
    realWorldCases: [
      {
        title: 'Uji Program Kasir Kantin',
        problem: 'Siswa membeli 3 porsi Soto Ayam (3 x Rp 15.000 = Rp 45.000) dan membayar dengan uang Rp 50.000.',
        algorithmSteps: [
          'Hitung total kotor = 45.000',
          'Karena 45.000 >= 30.000, diskon = 10% * 45.000 = 4.500',
          'Total bayar = 45.000 - 4.500 = 40.500',
          'Kembalian = 50.000 - 40.500 = 9.500'
        ],
        expectedResult: 'Kembalian Rp 9.500 terhitung otomatis dan tepat.',
        logicalExplanation: 'Sistem komputasi kasir menghilangkan resiko salah hitung kasir manual saat kondisi kantin sedang ramai.'
      }
    ],
    mindfulReflection: {
      question: 'Pertanyaan Refleksi Akhir:',
      promptText: 'Bagaimana perasaanmu setelah melihat masalah dunia nyata yang rumit berhasil kamu ubah menjadi baris-baris kode program C++ yang berjalan dengan sempurna?'
    }
  }
];
