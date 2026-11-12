const layar = document.getElementById('layar');
const operator = ['+', '-', '*', '/', '%'];
let selesai = false; // true setelah menekan "="

// Menambahkan angka / operator ke layar
function tambah(nilai) {
  // Setelah hasil keluar: angka memulai ulang, operator melanjutkan hasil
  if (selesai) {
    if (!operator.includes(nilai)) layar.value = '0';
    selesai = false;
  }

  if (layar.value === 'Error') layar.value = '0';

  const terakhir = layar.value.slice(-1);

  // Operator tidak boleh di awal (kecuali minus) dan tidak boleh berturut-turut
  if (operator.includes(nilai)) {
    if (layar.value === '0' && nilai !== '-') return;
    if (operator.includes(terakhir)) {
      layar.value = layar.value.slice(0, -1) + nilai; // ganti operator
      return;
    }
  }

  // Cegah titik ganda dalam satu angka
  if (nilai === '.') {
    const angkaTerakhir = layar.value.split(/[+\-*/%]/).pop();
    if (angkaTerakhir.includes('.')) return;
  }

  // Cegah nol berganda di depan angka (misal "5/05" atau "007")
  if (/^[0-9]$/.test(nilai)) {
    const angkaTerakhir = layar.value.split(/[+\-*/%]/).pop();
    if (angkaTerakhir === '0') {
      layar.value = layar.value.slice(0, -1) + nilai; // ganti nol dengan angka
      return;
    }
  }

  // Ganti "0" awal dengan angka / minus yang ditekan
  if (layar.value === '0' && nilai === '-') {
    layar.value = '-';
  } else if (layar.value === '0' && nilai !== '.') {
    layar.value = nilai;
  } else {
    layar.value += nilai;
  }
}

// Tombol C: reset layar
function hapus() {
  layar.value = '0';
  selesai = false;
}

// Tombol ⌫: hapus satu karakter terakhir
function mundur() {
  if (selesai || layar.value === 'Error') {
    hapus();
    return;
  }
  layar.value = layar.value.length > 1 ? layar.value.slice(0, -1) : '0';
}

// Tombol =: hitung hasil (tambah, kurang, kali, bagi, modulus)
function hitung() {
  let ekspresi = layar.value;

  // Buang operator yang menggantung di akhir (misal "5+")
  if (operator.includes(ekspresi.slice(-1))) ekspresi = ekspresi.slice(0, -1);

  // Keamanan: hanya angka dan operator yang boleh dihitung
  if (!/^[0-9+\-*/%.]+$/.test(ekspresi)) return;

  // Buang nol di depan angka ("05" jadi "5"); "0.5" tetap aman
  ekspresi = ekspresi.replace(/(^|[+\-*/%])0+(?=\d)/g, '$1');

  // Pembagian dengan nol: tampilkan Error
  if (/\/0(?![\d.])/.test(ekspresi)) {
    layar.value = 'Error';
    selesai = true;
    return;
  }

  // Persen: "A%B" berarti A persen dari B, jadi 10%10 = 10/100*10 = 1
  // Diulang agar bentuk berantai seperti "10%10%10" juga terhitung
  const pola = /(\([^()]*\)|\d*\.?\d+)%(-?\d*\.?\d+)/;
  while (pola.test(ekspresi)) {
    ekspresi = ekspresi.replace(pola, '($1/100*$2)');
  }

  // Sisa "%" yang tidak punya angka sesudahnya (misal "10%*2"): anggap A/100
  ekspresi = ekspresi.replace(/(\d*\.?\d+)%/g, '($1/100)');

  try {
    const hasil = Function('"use strict"; return (' + ekspresi + ')')();

    if (!isFinite(hasil)) {
      layar.value = 'Error';
    } else {
      layar.value = String(parseFloat(hasil.toFixed(10))); // rapikan desimal (0.1+0.2)
    }
  } catch (e) {
    layar.value = 'Error';
  }
  selesai = true;
}

// Dukungan keyboard
document.addEventListener('keydown', function (e) {
  if (/^[0-9.]$/.test(e.key) || operator.includes(e.key)) tambah(e.key);
  else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); hitung(); }
  else if (e.key === 'Backspace') mundur();
  else if (e.key === 'Escape') hapus();
});