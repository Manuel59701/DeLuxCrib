const GOLD = [197, 168, 128];
const INK = [17, 17, 17];
const GRAY = [100, 100, 100];
const LIGHT_GRAY = [244, 243, 241];
const WHITE = [255, 255, 255];

function formatDate(value) {
  if (!value) return '—';
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return value;
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export async function downloadBookingReceipt(booking) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 56;
  const contentWidth = pageWidth - margin * 2;

  const total = Number(booking.totalPrice) || 0;
  const nights = Number(booking.nights) || 0;
  const rate = nights > 0 ? total / nights : total;
  const receiptNo = `DLX-${booking.roomNumber}-${String(booking.date || '').replace(/\D/g, '') || Date.now().toString().slice(-6)}`;

  // ---- Header band ----
  doc.setFillColor(INK[0], INK[1], INK[2]);
  doc.rect(0, 0, pageWidth, 96, 'F');
  doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.rect(0, 96, pageWidth, 6, 'F');

  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.text('DE LUX CRIB', margin, 52);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(WHITE[0], WHITE[1], WHITE[2]);
  doc.text('BOUTIQUE HOTEL & SUITES', margin, 68);
  doc.text('777 GOLDEN BOULEVARD • CONCIERGE@DELUXCRIB.COM', margin, 80);

  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(WHITE[0], WHITE[1], WHITE[2]);
  doc.text('BOOKING RECEIPT', pageWidth - margin, 52, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.text(`Receipt No. ${receiptNo}`, pageWidth - margin, 68, { align: 'right' });

  // ---- Booking details ----
  const rows = [
    ['Suite', `Room ${booking.roomNumber}`],
    ['Room Type', booking.type || '—'],
    ['Guest Name', booking.name || '—'],
    ['Check-in Date', formatDate(booking.date)],
    ['Duration', `${nights} Night(s)`],
    ['Rate Per Night', `$${rate.toFixed(2)}`]
  ];

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(INK[0], INK[1], INK[2]);
  doc.text('BOOKING DETAILS', margin, 148);

  doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.setLineWidth(1);
  doc.line(margin, 158, pageWidth - margin, 158);

  let y = 182;
  const rowHeight = 32;
  rows.forEach(([label, value], index) => {
    if (index % 2 === 0) {
      doc.setFillColor(LIGHT_GRAY[0], LIGHT_GRAY[1], LIGHT_GRAY[2]);
      doc.rect(margin, y - 20, contentWidth, rowHeight, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(GRAY[0], GRAY[1], GRAY[2]);
    doc.text(label.toUpperCase(), margin + 16, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(INK[0], INK[1], INK[2]);
    doc.text(String(value), pageWidth - margin - 16, y, { align: 'right' });
    y += rowHeight;
  });

  // ---- Total box ----
  doc.setFillColor(INK[0], INK[1], INK[2]);
  doc.rect(margin, y + 4, contentWidth, 58, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2]);
  doc.text('TOTAL AMOUNT SETTLED', margin + 16, y + 32);
  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.text(`$${total.toFixed(2)}`, pageWidth - margin - 16, y + 38, { align: 'right' });

  // ---- Footer ----
  doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.setLineWidth(1);
  doc.line(margin, pageHeight - 96, pageWidth - margin, pageHeight - 96);
  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(INK[0], INK[1], INK[2]);
  doc.text('Thank you for choosing De Lux Crib — where luxury meets heritage.', pageWidth / 2, pageHeight - 68, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2]);
  doc.text('+1 (800) DE-LUX-CRIB  •  CONCIERGE@DELUXCRIB.COM  •  DELUXCRIB.COM', pageWidth / 2, pageHeight - 50, { align: 'center' });
  doc.text('This is a computer-generated receipt and does not require a signature.', pageWidth / 2, pageHeight - 36, { align: 'center' });

  doc.save(`DeLuxCrib-Receipt-Room${booking.roomNumber}.pdf`);
}
