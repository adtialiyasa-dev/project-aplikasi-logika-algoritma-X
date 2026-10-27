import { LabExercise } from '../types.ts';

export const LAB_EXERCISES: LabExercise[] = [
  {
    id: 'lab-1',
    title: '1. Halo Dunia & Cetak Identitas Siswa',
    difficulty: 'Dasar',
    category: 'Sekuensial',
    description: 'Buat program C++ sederhana untuk menampilkan teks sambutan dan identitas siswa (Nama dan Kelas) menggunakan perintah std::cout dan std::endl.',
    inputSpecification: 'Tidak memerlukan input keyboard.',
    outputSpecification: 'Tampilkan 3 baris:\nBaris 1: Halo Dunia Informatika!\nBaris 2: Nama: [Nama Siswa]\nBaris 3: Kelas: X Fase E',
    initialCode: `#include <iostream>

int main() {
    // Tulis kode programmu di bawah ini
    std::cout << "Halo Dunia Informatika!" << std::endl;
    
    return 0;
}`,
    solutionCode: `#include <iostream>

int main() {
    std::cout << "Halo Dunia Informatika!" << std::endl;
    std::cout << "Nama: Budi Santoso" << std::endl;
    std::cout << "Kelas: X Fase E" << std::endl;
    return 0;
}`,
    sampleInput: '',
    sampleOutput: 'Halo Dunia Informatika!\nNama: Budi Santoso\nKelas: X Fase E\n',
    hint: 'Gunakan std::cout << "teks..." << std::endl; untuk mencetak teks dan berpindah ke baris baru.',
    testCases: [
      {
        input: '',
        expectedOutput: 'Halo Dunia Informatika!',
        description: 'Verifikasi teks pembuka'
      }
    ]
  },
  {
    id: 'lab-2',
    title: '2. Luas dan Keliling Persegi Panjang',
    difficulty: 'Dasar',
    category: 'Sekuensial',
    description: 'Diberikan masukan panjang (p) dan lebar (l) sebuah persegi panjang. Hitung dan tampilkan luas (p * l) serta keliling (2 * (p + l)).',
    inputSpecification: 'Dua buah bilangan bulat: panjang dan lebar (dipisahkan spasi atau baris baru).',
    outputSpecification: 'Cetak nilai luas dan keliling persegi panjang.',
    initialCode: `#include <iostream>

int main() {
    int panjang, lebar;
    std::cout << "Masukkan panjang dan lebar: ";
    std::cin >> panjang >> lebar;

    // Hitung luas dan keliling
    int luas = 0;
    int keliling = 0;

    std::cout << "Luas: " << luas << std::endl;
    std::cout << "Keliling: " << keliling << std::endl;
    return 0;
}`,
    solutionCode: `#include <iostream>

int main() {
    int panjang, lebar;
    std::cin >> panjang >> lebar;

    int luas = panjang * lebar;
    int keliling = 2 * (panjang + lebar);

    std::cout << "Luas: " << luas << std::endl;
    std::cout << "Keliling: " << keliling << std::endl;
    return 0;
}`,
    sampleInput: '10 5',
    sampleOutput: 'Luas: 50\nKeliling: 30\n',
    hint: 'Gunakan operator perkalian (*) dan penjumlahan (+). Pastikan operasi penjumlahan diapit tanda kurung sebelum dikali 2.',
    testCases: [
      {
        input: '10 5',
        expectedOutput: 'Luas: 50\nKeliling: 30',
        description: 'Uji dengan panjang 10 dan lebar 5'
      },
      {
        input: '8 4',
        expectedOutput: 'Luas: 32\nKeliling: 24',
        description: 'Uji dengan panjang 8 dan lebar 4'
      }
    ]
  },
  {
    id: 'lab-3',
    title: '3. Konversi Suhu Celsius ke Fahrenheit',
    difficulty: 'Dasar',
    category: 'Sekuensial',
    description: 'Buat program untuk mengonversi suhu dari satuan Celsius ke Fahrenheit menggunakan rumus: F = (9.0 / 5.0) * C + 32.0.',
    inputSpecification: 'Satu bilangan desimal atau bulat (suhu Celsius).',
    outputSpecification: 'Tampilkan hasil konversi dalam derajat Fahrenheit.',
    initialCode: `#include <iostream>

int main() {
    double celsius;
    std::cin >> celsius;

    // Tulis rumus perhitungan di sini
    double fahrenheit = 0.0;

    std::cout << "Fahrenheit: " << fahrenheit << std::endl;
    return 0;
}`,
    solutionCode: `#include <iostream>

int main() {
    double celsius;
    std::cin >> celsius;

    double fahrenheit = (9.0 / 5.0) * celsius + 32.0;

    std::cout << "Fahrenheit: " << fahrenheit << std::endl;
    return 0;
}`,
    sampleInput: '100',
    sampleOutput: 'Fahrenheit: 212\n',
    hint: 'Tulis (9.0 / 5.0) dengan desimal agar kompilator C++ tidak melakukan pembagian integer.',
    testCases: [
      {
        input: '0',
        expectedOutput: 'Fahrenheit: 32',
        description: 'Titik beku air (0 C -> 32 F)'
      },
      {
        input: '100',
        expectedOutput: 'Fahrenheit: 212',
        description: 'Titik didih air (100 C -> 212 F)'
      }
    ]
  },
  {
    id: 'lab-4',
    title: '4. Penentu Kelulusan KKM 75',
    difficulty: 'Menengah',
    category: 'Percabangan',
    description: 'Diberikan masukan nilai ujian seorang siswa (0-100). Jika nilai >= 75, tampilkan status "LULUS". Jika nilai < 75, tampilkan "REMEDIAL".',
    inputSpecification: 'Satu bilangan bulat nilai (0 - 100).',
    outputSpecification: 'Teks "LULUS" atau "REMEDIAL".',
    initialCode: `#include <iostream>

int main() {
    int nilai;
    std::cin >> nilai;

    // Lengkapi struktur percabangan if-else
    if (nilai >= 75) {
        std::cout << "LULUS" << std::endl;
    } else {
        std::cout << "REMEDIAL" << std::endl;
    }

    return 0;
}`,
    solutionCode: `#include <iostream>

int main() {
    int nilai;
    std::cin >> nilai;

    if (nilai >= 75) {
        std::cout << "LULUS" << std::endl;
    } else {
        std::cout << "REMEDIAL" << std::endl;
    }

    return 0;
}`,
    sampleInput: '75',
    sampleOutput: 'LULUS\n',
    hint: 'Perhatikan kondisi batas: nilai tepat 75 berstatus LULUS karena menggunakan operator >=.',
    testCases: [
      {
        input: '75',
        expectedOutput: 'LULUS',
        description: 'Nilai batas KKM (75)'
      },
      {
        input: '74',
        expectedOutput: 'REMEDIAL',
        description: 'Nilai di bawah batas KKM (74)'
      },
      {
        input: '90',
        expectedOutput: 'LULUS',
        description: 'Nilai tinggi di atas KKM (90)'
      }
    ]
  },
  {
    id: 'lab-5',
    title: '5. Klasifikasi Bilangan Positif, Negatif, atau Nol',
    difficulty: 'Menengah',
    category: 'Percabangan',
    description: 'Diberikan sebuah bilangan bulat x. Klasifikasikan apakah x bernilai "Positif", "Negatif", atau "Nol" menggunakan struktur if-else if-else.',
    inputSpecification: 'Satu bilangan bulat x.',
    outputSpecification: 'Teks "Positif", "Negatif", atau "Nol".',
    initialCode: `#include <iostream>

int main() {
    int x;
    std::cin >> x;

    // Tulis pengecekan 3 kondisi di sini
    if (x > 0) {
        std::cout << "Positif" << std::endl;
    } else if (x < 0) {
        std::cout << "Negatif" << std::endl;
    } else {
        std::cout << "Nol" << std::endl;
    }

    return 0;
}`,
    solutionCode: `#include <iostream>

int main() {
    int x;
    std::cin >> x;

    if (x > 0) {
        std::cout << "Positif" << std::endl;
    } else if (x < 0) {
        std::cout << "Negatif" << std::endl;
    } else {
        std::cout << "Nol" << std::endl;
    }

    return 0;
}`,
    sampleInput: '-12',
    sampleOutput: 'Negatif\n',
    hint: 'Gunakan operator perbandingan > 0 untuk positif, < 0 untuk negatif, dan else untuk nilai nol.',
    testCases: [
      {
        input: '15',
        expectedOutput: 'Positif',
        description: 'Uji angka positif'
      },
      {
        input: '-7',
        expectedOutput: 'Negatif',
        description: 'Uji angka negatif'
      },
      {
        input: '0',
        expectedOutput: 'Nol',
        description: 'Uji angka nol'
      }
    ]
  },
  {
    id: 'lab-6',
    title: '6. Kasir Kantin dengan Diskon Siswa',
    difficulty: 'Menengah',
    category: 'Percabangan',
    description: 'Hitung total belanja kantin. Jika total belanja >= Rp 50.000, berikan diskon 10% (potongan = total * 0.10). Tampilkan total bayar setelah dipotong diskon.',
    inputSpecification: 'Satu bilangan bulat totalBelanja.',
    outputSpecification: 'Tampilkan total bayar akhir yang harus dibayar siswa.',
    initialCode: `#include <iostream>

int main() {
    int totalBelanja;
    std::cin >> totalBelanja;

    int totalBayar = totalBelanja;
    // Tambahkan kondisi diskon jika totalBelanja >= 50000

    std::cout << "Total Bayar: " << totalBayar << std::endl;
    return 0;
}`,
    solutionCode: `#include <iostream>

int main() {
    int totalBelanja;
    std::cin >> totalBelanja;

    int totalBayar = totalBelanja;
    if (totalBelanja >= 50000) {
        int diskon = totalBelanja * 0.10;
        totalBayar = totalBelanja - diskon;
    }

    std::cout << "Total Bayar: " << totalBayar << std::endl;
    return 0;
}`,
    sampleInput: '60000',
    sampleOutput: 'Total Bayar: 54000\n',
    hint: 'Diskon 10% dari 60.000 adalah 6.000, sehingga total bayar adalah 54.000.',
    testCases: [
      {
        input: '60000',
        expectedOutput: 'Total Bayar: 54000',
        description: 'Belanja di atas Rp 50.000 (dapat diskon 10%)'
      },
      {
        input: '40000',
        expectedOutput: 'Total Bayar: 40000',
        description: 'Belanja di bawah Rp 50.000 (tidak ada diskon)'
      }
    ]
  },
  {
    id: 'lab-7',
    title: '7. Menampilkan Deret Bilangan Genap (2 sampai N)',
    difficulty: 'Menengah',
    category: 'Perulangan',
    description: 'Gunakan perulangan for untuk menampilkan seluruh bilangan genap mulai dari 2 hingga bilangan N.',
    inputSpecification: 'Satu bilangan bulat N (misal 10).',
    outputSpecification: 'Deret bilangan genap dipisahkan spasi.',
    initialCode: `#include <iostream>

int main() {
    int n;
    std::cin >> n;

    for (int i = 2; i <= n; i += 2) {
        std::cout << i << " ";
    }
    std::cout << std::endl;
    return 0;
}`,
    solutionCode: `#include <iostream>

int main() {
    int n;
    std::cin >> n;

    for (int i = 2; i <= n; i += 2) {
        std::cout << i << " ";
    }
    std::cout << std::endl;
    return 0;
}`,
    sampleInput: '10',
    sampleOutput: '2 4 6 8 10 \n',
    hint: 'Inisialisasi counter dengan i = 2 dan lakukan penambahan i += 2 di setiap perulangan.',
    testCases: [
      {
        input: '10',
        expectedOutput: '2 4 6 8 10',
        description: 'Bilangan genap sampai 10'
      },
      {
        input: '6',
        expectedOutput: '2 4 6',
        description: 'Bilangan genap sampai 6'
      }
    ]
  },
  {
    id: 'lab-8',
    title: '8. Akumulator Penjumlahan Deret 1 sampai N',
    difficulty: 'Menengah',
    category: 'Perulangan',
    description: 'Hitung jumlah total dari deret bilangan 1 + 2 + 3 + ... + N menggunakan teknik akumulator dalam perulangan.',
    inputSpecification: 'Satu bilangan bulat positif N.',
    outputSpecification: 'Nilai total penjumlahan deret.',
    initialCode: `#include <iostream>

int main() {
    int n;
    std::cin >> n;

    int total = 0;
    // Tulis perulangan for akumulator di sini

    std::cout << "Jumlah: " << total << std::endl;
    return 0;
}`,
    solutionCode: `#include <iostream>

int main() {
    int n;
    std::cin >> n;

    int total = 0;
    for (int i = 1; i <= n; i++) {
        total += i;
    }

    std::cout << "Jumlah: " << total << std::endl;
    return 0;
}`,
    sampleInput: '5',
    sampleOutput: 'Jumlah: 15\n',
    hint: '1 + 2 + 3 + 4 + 5 = 15. Inisialisasi total = 0 sebelum loop dimulai.',
    testCases: [
      {
        input: '5',
        expectedOutput: 'Jumlah: 15',
        description: 'Deret 1 sampai 5 (hasil 15)'
      },
      {
        input: '10',
        expectedOutput: 'Jumlah: 55',
        description: 'Deret 1 sampai 10 (hasil 55)'
      }
    ]
  },
  {
    id: 'lab-9',
    title: '9. Perhitungan Faktorial Bilangan (N!)',
    difficulty: 'Lanjutan',
    category: 'Perulangan',
    description: 'Hitung nilai faktorial N! = N * (N - 1) * ... * 1. Khusus untuk 0! nilainya adalah 1.',
    inputSpecification: 'Satu bilangan bulat non-negatif N (0 <= N <= 12).',
    outputSpecification: 'Nilai faktorial N.',
    initialCode: `#include <iostream>

int main() {
    int n;
    std::cin >> n;

    int faktorial = 1;
    // Buat perulangan perkalian beruntun

    std::cout << "Faktorial: " << faktorial << std::endl;
    return 0;
}`,
    solutionCode: `#include <iostream>

int main() {
    int n;
    std::cin >> n;

    int faktorial = 1;
    for (int i = 1; i <= n; i++) {
        faktorial *= i;
    }

    std::cout << "Faktorial: " << faktorial << std::endl;
    return 0;
}`,
    sampleInput: '5',
    sampleOutput: 'Faktorial: 120\n',
    hint: 'Variabel penampung faktorial harus diinisialisasi dengan 1 (bukan 0).',
    testCases: [
      {
        input: '5',
        expectedOutput: 'Faktorial: 120',
        description: 'Faktorial dari 5 (5! = 120)'
      },
      {
        input: '4',
        expectedOutput: 'Faktorial: 24',
        description: 'Faktorial dari 4 (4! = 24)'
      }
    ]
  },
  {
    id: 'lab-10',
    title: '10. Pencari Nilai Terbesar dari Tiga Bilangan',
    difficulty: 'Lanjutan',
    category: 'Kombinasi',
    description: 'Diberikan tiga buah bilangan bulat a, b, dan c. Tentukan bilangan yang memiliki nilai paling besar di antara ketiganya.',
    inputSpecification: 'Tiga bilangan bulat a, b, dan c dipisahkan spasi.',
    outputSpecification: 'Nilai terbesar di antara ketiga bilangan.',
    initialCode: `#include <iostream>

int main() {
    int a, b, c;
    std::cin >> a >> b >> c;

    int terbesar = a;
    if (b > terbesar) {
        terbesar = b;
    }
    if (c > terbesar) {
        terbesar = c;
    }

    std::cout << "Terbesar: " << terbesar << std::endl;
    return 0;
}`,
    solutionCode: `#include <iostream>

int main() {
    int a, b, c;
    std::cin >> a >> b >> c;

    int terbesar = a;
    if (b > terbesar) {
        terbesar = b;
    }
    if (c > terbesar) {
        terbesar = c;
    }

    std::cout << "Terbesar: " << terbesar << std::endl;
    return 0;
}`,
    sampleInput: '15 42 27',
    sampleOutput: 'Terbesar: 42\n',
    hint: 'Bandingkan nilai b dan c secara berurutan terhadap variabel penampung terbesar.',
    testCases: [
      {
        input: '15 42 27',
        expectedOutput: 'Terbesar: 42',
        description: 'Nilai terbesar di tengah (42)'
      },
      {
        input: '99 10 50',
        expectedOutput: 'Terbesar: 99',
        description: 'Nilai terbesar di awal (99)'
      }
    ]
  }
];
