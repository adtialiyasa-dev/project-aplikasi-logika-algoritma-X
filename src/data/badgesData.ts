import { Badge } from '../types.ts';

export const ALL_BADGES: Badge[] = [
  {
    id: 'ahli-algoritma-dasar',
    name: 'Ahli Algoritma Dasar',
    category: 'modul',
    description: 'Menguasai konsep dasar algoritma, karakteristik Knuth, serta penyusunan notasi pseudocode.',
    iconName: 'ScrollText',
    requirement: 'Selesaikan Modul 3 (Notasi Algoritma dan Pseudocode)',
    pointsReward: 100
  },
  {
    id: 'master-cpp-pemula',
    name: 'Master C++ Pemula',
    category: 'modul',
    description: 'Menguasai struktur sekuensial, percabangan kondisional, serta perulangan for, while, dan do-while di C++.',
    iconName: 'Code2',
    requirement: 'Selesaikan Modul 8 (Struktur Perulangan dalam C++)',
    pointsReward: 150
  },
  {
    id: 'pemikir-komputasional',
    name: 'Pemikir Komputasional',
    category: 'modul',
    description: 'Mampu membedah persoalan kompleks dengan 4 pilar: dekomposisi, pengenalan pola, abstraksi, dan algoritma.',
    iconName: 'Brain',
    requirement: 'Selesaikan Modul 2 (Berpikir Komputasional)',
    pointsReward: 80
  },
  {
    id: 'arsitek-diagram-alir',
    name: 'Arsitek Diagram Alir',
    category: 'modul',
    description: 'Mampu memetakan logika pengambilan keputusan dan alur instruksi menggunakan standar grafis ANSI/ISO.',
    iconName: 'GitBranch',
    requirement: 'Selesaikan Modul 4 (Flowchart atau Diagram Alir)',
    pointsReward: 100
  },
  {
    id: 'coder-pertama',
    name: 'Coder Pertama',
    category: 'lab',
    description: 'Berhasil menjalankan dan memverifikasi kode program pertama yang valid di Simulator Lab C++.',
    iconName: 'Terminal',
    requirement: 'Tuntaskan minimal 1 tantangan koding di Lab C++',
    pointsReward: 50
  },
  {
    id: 'debugger-tanggap',
    name: 'Debugger Tanggap',
    category: 'lab',
    description: 'Mampu mengidentifikasi kesalahan sintaksis dan meloloskan berbagai pengujian otomatis di Lab C++.',
    iconName: 'CheckCircle2',
    requirement: 'Tuntaskan minimal 5 tantangan koding di Lab C++',
    pointsReward: 120
  },
  {
    id: 'juara-evaluasi-hots',
    name: 'Juara Evaluasi HOTS',
    category: 'kuis',
    description: 'Mencapai skor tinggi pada uji penalaran analitis, penelusuran logika, dan studi kasus komputasi.',
    iconName: 'Award',
    requirement: 'Raih nilai evaluasi kuis minimal 85 poin',
    pointsReward: 150
  },
  {
    id: 'penjelajah-lengkap',
    name: 'Penjelajah Sempurna',
    category: 'modul',
    description: 'Menuntaskan seluruh 9 modul pembelajaran Informatika Fase E dari pengantar logika hingga implementasi proyek.',
    iconName: 'Trophy',
    requirement: 'Tuntaskan seluruh 9 modul materi pembelajaran',
    pointsReward: 250
  },
  {
    id: 'reflektor-mindful',
    name: 'Reflektor Berkesadaran',
    category: 'eksplorasi',
    description: 'Melatih kemampuan metakognisi dengan menuliskan catatan proses berpikir di jurnal pembelajaran.',
    iconName: 'Sparkles',
    requirement: 'Tuliskan dan simpan minimal 3 jurnal refleksi belajar',
    pointsReward: 80
  },
  {
    id: 'arsitek-solusi-mandiri',
    name: 'Arsitek Solusi Mandiri',
    category: 'eksplorasi',
    description: 'Mendalami perancangan solusi perangkat lunak pada proyek akhir capstone sekolah.',
    iconName: 'Layers',
    requirement: 'Buka dan eksplorasi spesifikasi proyek capstone di menu Proyek',
    pointsReward: 100
  }
];
