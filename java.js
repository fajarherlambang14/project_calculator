const layar = document.getElementById('layar');
const operator = ['+', '-', '*', '/', '%'];
let selesai = false; // 

function tambah(nilai) {
  const terakhir = layar.value.slice(-1);

  if (selesai) {
    if (!operator.includes(nilai)) layar.value = '0';
    selesai = false;
  }

  if (layar.value === 'Error') layar.value = '0';

  if (operator.includes(nilai)) {
    if (layar.value === '0' && nilai !== '-') return;
    if (operator.includes(terakhir)) {
      layar.value = layar.value.slice(0, -1) + nilai; // ganti operator
      return;
    }
  }

  if (nilai === '.') {
    const angkaTerakhir = layar.value.split(/[+\-*/%]/).pop();
    if (angkaTerakhir.includes('.')) return;
  }
  if (layar.value === '0' && !operator.includes(nilai) && nilai !== '.') {
    layar.value = nilai;
  } else if (layar.value === '0' && operator.includes(nilai) && nilai === '-') {
    layar.value = '-';
  } else {
    layar.value += nilai;
  }
}

function hapus() {
  layar.value = '0';
  selesai = false;
}

function mundur() {
  if (selesai || layar.value === 'Error') {
    hapus();
    return;
  }
  layar.value = layar.value.length > 1 ? layar.value.slice(0, -1) : '0';
}

function hitung() {
  let ekspresi = layar.value;

  if (operator.includes(ekspresi.slice(-1))) ekspresi = ekspresi.slice(0, -1);

  if (!/^[0-9+\-*/%.]+$/.test(ekspresi)) return;

  try {
    const hasil = Function('"use strict"; return (' + ekspresi + ')')();

    if (!isFinite(hasil)) {
      layar.value = 'Error'; 
    } else {
      layar.value = String(parseFloat(hasil.toFixed(10))); 
    }
  } catch (e) {
    layar.value = 'Error';
  }
  selesai = true;
}
document.addEventListener('keydown', function (e) {
  if (/^[0-9.]$/.test(e.key) || operator.includes(e.key)) tambah(e.key);
  else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); hitung(); }
  else if (e.key === 'Backspace') mundur();
  else if (e.key === 'Escape') hapus();
});
