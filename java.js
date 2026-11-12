const layar = document.getElementById('layar');
const operator = ['+', '-', '*', '/', '%'];
let selesai = false; // true setelah menekan "="

// Menambahkan angka / operator ke layar
function tambah(nilai) {
  const terakhir = layar.value.slice(-1);

  // Setelah hasil keluar: angka memulai ulang, operator melanjutkan hasil
  if (selesai) {
    if (!operator.includes(nilai)) layar.value = '0';
    selesai = false;
  }

  if (layar.value === 'Error') layar.value = '0';

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

  // Ganti "0" awal dengan angka yang ditekan
  if (layar.value === '0' && !operator.includes(nilai) && nilai !== '.') {
    layar.value = nilai;
  } else if (layar.value === '0' && operator.includes(nilai) && nilai === '-') {
    layar.value = '-';
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

  try {
    const hasil = Function('"use strict"; return (' + ekspresi + ')')();

    if (!isFinite(hasil)) {
      layar.value = 'Error'; // misal pembagian dengan 0
    } else {
      layar.value = String(parseFloat(hasil.toFixed(10))); // rapikan desimal (0.1+0.2)
    }
  } catch (e) {
    layar.value = 'Error';
  }
  selesai = true;
}

// Bonus: dukungan keyboard
document.addEventListener('keydown', function (e) {
  if (/^[0-9.]$/.test(e.key) || operator.includes(e.key)) tambah(e.key);
  else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); hitung(); }
  else if (e.key === 'Backspace') mundur();
  else if (e.key === 'Escape') hapus();
});