import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { StudentListItem, AdminOverviewData } from './authService.ts';

export interface ReportPdfOptions {
  teacher: {
    fullName: string;
    nip?: string;
  };
  students: StudentListItem[];
  selectedClass?: string;
  overview?: AdminOverviewData | null;
}

export function generateStudentsReportPdf({
  teacher,
  students,
  selectedClass = 'all',
  overview
}: ReportPdfOptions): void {
  // Initialize jsPDF with A4 Landscape for comfortable column spacing
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 1. Decorative Top Accent Bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setFillColor(217, 119, 6); // amber-600 accent stripe
  doc.rect(0, 24, pageWidth, 2, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('LABORATORIUM PEMBELAJARAN INFORMATIKA SMA', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('Laporan Rekapitulasi Progres Belajar, Evaluasi HOTS & Capstone Siswa Fase E (Kelas X)', 14, 18);

  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full'
  }).format(new Date());

  doc.setFontSize(8);
  doc.text(`Dicetak: ${formattedDate}`, pageWidth - 14, 18, { align: 'right' });

  // 2. Metadata Information Block
  doc.setTextColor(30, 41, 59); // slate-800
  doc.setFontSize(8.5);

  let currentY = 32;

  // Left Column: Teacher and Class Information
  doc.setFont('helvetica', 'bold');
  doc.text('Guru Pengampu', 14, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${teacher.fullName}`, 45, currentY);

  doc.setFont('helvetica', 'bold');
  doc.text('NIP Guru', 14, currentY + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${teacher.nip || '-'}`, 45, currentY + 5);

  const classLabel = selectedClass === 'all' ? 'Semua Kelas (X-1 s/d X-12)' : `Kelas ${selectedClass}`;
  doc.setFont('helvetica', 'bold');
  doc.text('Rombel Kelas', 14, currentY + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${classLabel}`, 45, currentY + 10);

  // Right Column: Summary KPI Box
  const avgScore = overview?.avgQuizScore ?? (students.length > 0 
    ? Math.round(students.reduce((acc, s) => acc + (s.quizBestScore || 0), 0) / students.length)
    : 0);
  
  const totalCompletedMods = students.reduce((acc, s) => acc + (s.completedModulesCount || 0), 0);
  const finishedProjects = students.filter((s) => s.projectStatus === 'Selesai').length;

  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(pageWidth - 110, currentY - 2, 96, 17, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text('Ringkasan Statistik:', pageWidth - 106, currentY + 2);

  doc.setFont('helvetica', 'normal');
  doc.text(`• Total Siswa Terdata: ${students.length} orang`, pageWidth - 106, currentY + 6.5);
  doc.text(`• Rata-rata Kuis HOTS: ${avgScore}/100 ${avgScore >= 75 ? '(Tuntas KKM)' : ''}`, pageWidth - 106, currentY + 10.5);
  doc.text(`• Proyek Capstone Selesai: ${finishedProjects} siswa | Modul Tuntas: ${totalCompletedMods}`, pageWidth - 106, currentY + 14.5);

  currentY += 19;

  // 3. Prepare Table Data
  const tableHeaders = [
    'No',
    'Nama Lengkap Siswa',
    'Kelas',
    'Username (Email)',
    'Modul (9)',
    'Lab C++ (10)',
    'Kuis HOTS',
    'Total XP',
    'Status Proyek',
    'Status KKM'
  ];

  const tableData = students.map((std, index) => {
    const isPassing = std.quizBestScore >= 75;
    return [
      (index + 1).toString(),
      std.fullName,
      std.className || '-',
      std.email,
      `${std.completedModulesCount || 0} / 9`,
      `${std.completedExercisesCount || 0} / 10`,
      `${std.quizBestScore || 0}`,
      `${std.totalPoints || 0} XP`,
      std.projectStatus || 'Belum Mulai',
      isPassing ? 'TUNTAS' : 'PERLU BIMBINGAN'
    ];
  });

  // 4. Generate AutoTable
  autoTable(doc, {
    startY: currentY,
    head: [tableHeaders],
    body: tableData,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 2.2,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.15
    },
    headStyles: {
      fillColor: [15, 23, 42], // slate-900
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'left', cellWidth: 50, fontStyle: 'bold' },
      2: { halign: 'center', cellWidth: 16 },
      3: { halign: 'left', cellWidth: 55 },
      4: { halign: 'center', cellWidth: 22 },
      5: { halign: 'center', cellWidth: 24 },
      6: { halign: 'center', cellWidth: 20 },
      7: { halign: 'center', cellWidth: 22 },
      8: { halign: 'center', cellWidth: 26 },
      9: { halign: 'center', cellWidth: 25 }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // slate-50
    },
    didParseCell: (data) => {
      // Color-code KKM Status
      if (data.section === 'body' && data.column.index === 9) {
        if (data.cell.raw === 'TUNTAS') {
          data.cell.styles.textColor = [16, 149, 106]; // emerald green
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [217, 119, 6]; // amber-600
        }
      }
      // Highlight high quiz scores
      if (data.section === 'body' && data.column.index === 6) {
        const score = parseInt(String(data.cell.raw), 10);
        if (!isNaN(score) && score >= 75) {
          data.cell.styles.textColor = [16, 149, 106];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
    margin: { left: 14, right: 14, bottom: 25 }
  });

  // 5. Signature Section on the last page
  const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : currentY + 30;
  
  // Check if signature fits on current page, otherwise add new page
  let sigY = finalY;
  if (sigY + 35 > pageHeight - 15) {
    doc.addPage();
    sigY = 25;
  }

  const sigX = pageWidth - 70;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text('Mengetahui / Mengesahkan,', sigX, sigY);
  doc.text('Guru Pengampu Informatika Fase E', sigX, sigY + 4.5);

  // Signature line
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(teacher.fullName, sigX, sigY + 22);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`NIP. ${teacher.nip || '-'}`, sigX, sigY + 26);

  // 6. Page Footers across all pages
  const totalPagesCount = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= totalPagesCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      'Dokumen Resmi Rekapitulasi Nilai & Pembelajaran Informatika - Kurikulum Merdeka Fase E',
      14,
      pageHeight - 8
    );
    doc.text(
      `Halaman ${i} dari ${totalPagesCount}`,
      pageWidth - 14,
      pageHeight - 8,
      { align: 'right' }
    );
  }

  // 7. Save and trigger download
  const sanitizedClass = selectedClass === 'all' ? 'Semua_Kelas' : selectedClass;
  const filename = `Rekap_Pembelajaran_Informatika_${sanitizedClass}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
