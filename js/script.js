/**
 * ============================================================
 *  KONFIGURASI – Ubah data di sini untuk menyesuaikan website
 * ============================================================
 */

// Identitas guru & sekolah (digunakan di halaman About)
const KONFIG = {
    guru: 'Bapak/Ibu Guru',
    sekolah: 'SD Negeri 1',
    tahun: '2026',
    // Timer pada ulangan (true = aktif, false = nonaktif)
    timerAktif: true, // set false untuk mematikan timer
    batasLulus: 70 // nilai minimal untuk dinyatakan lulus
};

// ============================================================
//  DATA SOAL – Guru dapat menambah/mengubah soal dengan mudah
// ============================================================

/** Data untuk halaman Contoh Soal */
const contohSoal = [
    {
        pertanyaan: 'Berapa hasil dari 1/2 + 1/4?',
        pilihan: ['1/4', '3/4', '1/2', '2/4'],
        jawaban: 1, // indeks jawaban benar (0-based)
        pembahasan: '1/2 = 2/4, maka 2/4 + 1/4 = 3/4.'
    },
    {
        pertanyaan: 'Pecahan 3/5 lebih besar dari pecahan ...?',
        pilihan: ['1/2', '2/5', '4/5', '1/5'],
        jawaban: 1, // 2/5
        pembahasan: '3/5 = 0,6 ; 2/5 = 0,4. Jadi 3/5 lebih besar dari 2/5.'
    },
    {
        pertanyaan: 'Berapa bagian yang diarsir jika sebuah persegi dibagi 4 dan diarsir 3 bagian?',
        pilihan: ['1/4', '2/4', '3/4', '4/4'],
        jawaban: 2,
        pembahasan: 'Ada 4 bagian sama, diarsir 3, berarti 3/4 bagian.'
    }
];

/** Data untuk Soal Latihan (5 soal) */
const soalLatihan = [
    {
        pertanyaan: 'Hasil dari 2/3 - 1/3 adalah ...',
        pilihan: ['1/3', '2/3', '1', '0'],
        jawaban: 0,
        pembahasan: '2/3 - 1/3 = 1/3 karena penyebut sama.'
    },
    {
        pertanyaan: 'Pecahan yang nilainya paling kecil di antara ini adalah ...',
        pilihan: ['1/2', '1/4', '1/3', '1/5'],
        jawaban: 3,
        pembahasan: 'Semakin besar penyebut (dengan pembilang 1), semakin kecil nilainya. 1/5 terkecil.'
    },
    {
        pertanyaan: '5/8 + 2/8 = ...',
        pilihan: ['7/8', '7/16', '3/8', '5/8'],
        jawaban: 0,
        pembahasan: '5/8 + 2/8 = 7/8 (penyebut tetap 8).'
    },
    {
        pertanyaan: 'Bentuk pecahan dari 0,6 adalah ...',
        pilihan: ['6/10', '3/5', '1/6', '6/100'],
        jawaban: 1,
        pembahasan: '0,6 = 6/10 = 3/5 (disederhanakan).'
    },
    {
        pertanyaan: 'Manakah yang merupakan pecahan senilai dengan 2/4?',
        pilihan: ['1/2', '3/4', '1/4', '2/8'],
        jawaban: 0,
        pembahasan: '2/4 = 1/2 (dibagi 2 pembilang & penyebut).'
    }
];

/** Data untuk Ulangan Harian (5 soal) */
const soalUlangan = [
    {
        pertanyaan: 'Hasil dari 3/4 + 1/4 adalah ...',
        pilihan: ['1/4', '1', '3/4', '1/2'],
        jawaban: 1,
        pembahasan: '3/4 + 1/4 = 4/4 = 1.'
    },
    {
        pertanyaan: 'Pecahan 2/5 jika diubah menjadi desimal adalah ...',
        pilihan: ['0,2', '0,4', '0,5', '0,25'],
        jawaban: 1,
        pembahasan: '2/5 = 0,4 karena 2 : 5 = 0,4.'
    },
    {
        pertanyaan: 'Urutan pecahan dari yang terkecil: 1/2, 1/3, 1/4 adalah ...',
        pilihan: ['1/2, 1/3, 1/4', '1/4, 1/3, 1/2', '1/3, 1/4, 1/2', '1/2, 1/4, 1/3'],
        jawaban: 1,
        pembahasan: 'Semakin besar penyebut, semakin kecil. Urutan: 1/4, 1/3, 1/2.'
    },
    {
        pertanyaan: '5/6 - 2/6 = ...',
        pilihan: ['3/6', '1/2', '3/0', '7/6'],
        jawaban: 0,
        pembahasan: '5/6 - 2/6 = 3/6 = 1/2 (disederhanakan).'
    },
    {
        pertanyaan: 'Bentuk paling sederhana dari 4/8 adalah ...',
        pilihan: ['1/2', '2/4', '1/4', '3/4'],
        jawaban: 0,
        pembahasan: '4/8 dibagi 4 = 1/2.'
    }
];

// ============================================================
//  END DATA – Jangan ubah di bawah ini kecuali Anda paham JS
// ============================================================

// ===== NAVIGASI SPA =====
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-menu a');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

// Toggle hamburger
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
});

// Navigasi
function navigateTo(pageId) {
    // Sembunyikan semua halaman
    pages.forEach(p => p.classList.remove('active-page'));
    // Tampilkan halaman target
    const target = document.getElementById(`page-${pageId}`);
    if (target) target.classList.add('active-page');

    // Update aktif nav
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId) link.classList.add('active');
    });

    // Tutup menu mobile
    navMenu.classList.remove('open');

    // Simpan halaman terakhir di localStorage (opsional)
    localStorage.setItem('lastPage', pageId);

    // Inisialisasi konten spesifik halaman
    if (pageId === 'contoh') renderContohSoal();
    if (pageId === 'latihan') resetLatihan();
    if (pageId === 'ulangan') resetUlangan();
}

// Event listener untuk nav dan kartu di home
document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        const page = el.dataset.page;
        if (page) navigateTo(page);
    });
});

// Muat halaman terakhir atau home
const lastPage = localStorage.getItem('lastPage') || 'home';
navigateTo(lastPage);

// ===== RENDER CONTOH SOAL =====
function renderContohSoal() {
    const container = document.getElementById('contoh-container');
    container.innerHTML = '';
    contohSoal.forEach((soal, idx) => {
        const div = document.createElement('div');
        div.className = 'contoh-item';
        div.innerHTML = `
            <div class="pertanyaan">${idx+1}. ${soal.pertanyaan}</div>
            <ul class="pilihan">
                ${soal.pilihan.map((p, i) => `<li>${String.fromCharCode(97+i)}. ${p}</li>`).join('')}
            </ul>
            <button class="btn btn-secondary btn-pembahasan" data-index="${idx}">
                <i class="fas fa-eye"></i> Lihat Pembahasan
            </button>
            <div class="pembahasan" id="pembahasan-${idx}">
                <p><span class="jawaban-benar">✅ Jawaban benar: ${soal.pilihan[soal.jawaban]}</span></p>
                <p>📖 ${soal.pembahasan}</p>
            </div>
        `;
        container.appendChild(div);
    });

    // Event toggle pembahasan
    document.querySelectorAll('.btn-pembahasan').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = this.dataset.index;
            const pemb = document.getElementById(`pembahasan-${idx}`);
            pemb.classList.toggle('open');
            this.innerHTML = pemb.classList.contains('open') ?
                '<i class="fas fa-eye-slash"></i> Sembunyikan Pembahasan' :
                '<i class="fas fa-eye"></i> Lihat Pembahasan';
        });
    });
}

// ===== SOAL LATIHAN =====
let latihanState = {
    current: 0,
    jawabanUser: [],
    soal: soalLatihan,
    selesai: false
};

function resetLatihan() {
    // Kembali ke tampilan awal
    document.getElementById('latihan-start').style.display = 'block';
    document.getElementById('latihan-quiz').style.display = 'none';
    document.getElementById('latihan-hasil').style.display = 'none';
    latihanState.current = 0;
    latihanState.jawabanUser = new Array(latihanState.soal.length).fill(null);
    latihanState.selesai = false;
}

document.getElementById('mulaiLatihanBtn').addEventListener('click', () => {
    document.getElementById('latihan-start').style.display = 'none';
    document.getElementById('latihan-quiz').style.display = 'block';
    document.getElementById('latihan-hasil').style.display = 'none';
    latihanState.current = 0;
    latihanState.jawabanUser = new Array(latihanState.soal.length).fill(null);
    latihanState.selesai = false;
    tampilSoalLatihan();
});

function tampilSoalLatihan() {
    const state = latihanState;
    const soal = state.soal[state.current];
    if (!soal) return;

    document.getElementById('latihan-nomor').textContent = `Soal ${state.current+1} / ${state.soal.length}`;
    const progress = Math.round(((state.current) / state.soal.length) * 100);
    document.getElementById('latihan-progress').textContent = `Progress: ${progress}%`;

    document.getElementById('latihan-soal').textContent = soal.pertanyaan;
    const pilihanDiv = document.getElementById('latihan-pilihan');
    pilihanDiv.innerHTML = '';
    const pilihanLabel = ['A', 'B', 'C', 'D'];
    soal.pilihan.forEach((p, i) => {
        const div = document.createElement('div');
        div.className = 'pilihan-item';
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'latihan-jawaban';
        radio.value = i;
        radio.id = `latihan-pil-${i}`;
        if (state.jawabanUser[state.current] === i) radio.checked = true;
        const label = document.createElement('label');
        label.htmlFor = `latihan-pil-${i}`;
        label.textContent = `${pilihanLabel[i]}. ${p}`;
        div.appendChild(radio);
        div.appendChild(label);
        pilihanDiv.appendChild(div);

        radio.addEventListener('change', function() {
            state.jawabanUser[state.current] = parseInt(this.value);
            document.getElementById('latihan-nextBtn').disabled = false;
        });
    });

    // Cek jika sudah menjawab sebelumnya, aktifkan tombol next
    document.getElementById('latihan-nextBtn').disabled = (state.jawabanUser[state.current] === null);

    // Jika sudah soal terakhir, ubah teks tombol
    if (state.current === state.soal.length - 1) {
        document.getElementById('latihan-nextBtn').innerHTML = '<i class="fas fa-check"></i> Lihat Hasil';
    } else {
        document.getElementById('latihan-nextBtn').innerHTML = '<i class="fas fa-arrow-right"></i> Soal Berikutnya';
    }
}

document.getElementById('latihan-nextBtn').addEventListener('click', function() {
    const state = latihanState;
    if (state.jawabanUser[state.current] === null) return;

    if (state.current === state.soal.length - 1) {
        // Tampilkan hasil
        tampilkanHasilLatihan();
    } else {
        state.current++;
        tampilSoalLatihan();
    }
});

function tampilkanHasilLatihan() {
    const state = latihanState;
    let benar = 0;
    state.jawabanUser.forEach((jaw, idx) => {
        if (jaw === state.soal[idx].jawaban) benar++;
    });
    const total = state.soal.length;
    const nilai = Math.round((benar / total) * 100);

    document.getElementById('latihan-quiz').style.display = 'none';
    const hasilDiv = document.getElementById('latihan-hasil');
    hasilDiv.style.display = 'block';

    let motivasi = '';
    if (nilai >= 80) motivasi = '🌟 Hebat! Kamu sangat pintar!';
    else if (nilai >= 60) motivasi = '💪 Terus belajar, kamu pasti bisa lebih baik!';
    else motivasi = '📚 Ayo belajar lagi, jangan menyerah!';

    hasilDiv.innerHTML = `
        <div class="hasil-card">
            <div class="nilai-besar">${nilai}</div>
            <div class="keterangan">${motivasi}</div>
            <div class="detail">
                <p>✅ Benar: ${benar}</p>
                <p>❌ Salah: ${total - benar}</p>
                <p>📊 Jumlah soal: ${total}</p>
            </div>
            <button class="btn btn-primary" id="latihanUlangiBtn"><i class="fas fa-redo"></i> Coba Lagi</button>
        </div>
    `;
    document.getElementById('latihanUlangiBtn').addEventListener('click', resetLatihan);

    // Simpan nilai ke localStorage (contoh)
    localStorage.setItem('nilaiLatihan', nilai);
}

// ===== ULANGAN HARIAN =====
let ulanganState = {
    current: 0,
    jawabanUser: [],
    soal: soalUlangan,
    selesai: false,
    timer: null,
    detik: 0,
    nama: '',
    kelas: ''
};

function resetUlangan() {
    // Kembali ke form
    document.getElementById('ulangan-form').style.display = 'block';
    document.getElementById('ulangan-quiz').style.display = 'none';
    document.getElementById('ulangan-hasil').style.display = 'none';
    ulanganState.current = 0;
    ulanganState.jawabanUser = [];
    ulanganState.selesai = false;
    if (ulanganState.timer) {
        clearInterval(ulanganState.timer);
        ulanganState.timer = null;
    }
    ulanganState.detik = 0;
    document.getElementById('ulangan-timer').style.display = KONFIG.timerAktif ? 'inline' : 'none';
    document.getElementById('ulangan-nama').value = localStorage.getItem('namaSiswa') || '';
    document.getElementById('ulangan-kelas').value = localStorage.getItem('kelasSiswa') || '';
}

document.getElementById('mulaiUlanganBtn').addEventListener('click', function() {
    const nama = document.getElementById('ulangan-nama').value.trim();
    const kelas = document.getElementById('ulangan-kelas').value.trim();
    if (!nama || !kelas) {
        alert('Silakan isi nama dan kelas terlebih dahulu!');
        return;
    }
    ulanganState.nama = nama;
    ulanganState.kelas = kelas;
    localStorage.setItem('namaSiswa', nama);
    localStorage.setItem('kelasSiswa', kelas);

    document.getElementById('ulangan-form').style.display = 'none';
    document.getElementById('ulangan-quiz').style.display = 'block';
    document.getElementById('ulangan-hasil').style.display = 'none';

    ulanganState.current = 0;
    ulanganState.jawabanUser = new Array(ulanganState.soal.length).fill(null);
    ulanganState.selesai = false;
    ulanganState.detik = 0;

    // Timer
    if (KONFIG.timerAktif) {
        document.getElementById('ulangan-timer').style.display = 'inline';
        if (ulanganState.timer) clearInterval(ulanganState.timer);
        ulanganState.timer = setInterval(() => {
            ulanganState.detik++;
            const m = String(Math.floor(ulanganState.detik / 60)).padStart(2, '0');
            const d = String(ulanganState.detik % 60).padStart(2, '0');
            document.getElementById('ulangan-timerDisplay').textContent = `${m}:${d}`;
        }, 1000);
    } else {
        document.getElementById('ulangan-timer').style.display = 'none';
    }

    tampilSoalUlangan();
});

function tampilSoalUlangan() {
    const state = ulanganState;
    const soal = state.soal[state.current];
    if (!soal) return;

    document.getElementById('ulangan-nomor').textContent = `Soal ${state.current+1} / ${state.soal.length}`;
    const progress = Math.round(((state.current) / state.soal.length) * 100);
    document.getElementById('ulangan-progress').textContent = `Progress: ${progress}%`;

    document.getElementById('ulangan-soal').textContent = soal.pertanyaan;
    const pilihanDiv = document.getElementById('ulangan-pilihan');
    pilihanDiv.innerHTML = '';
    const pilihanLabel = ['A', 'B', 'C', 'D'];
    soal.pilihan.forEach((p, i) => {
        const div = document.createElement('div');
        div.className = 'pilihan-item';
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'ulangan-jawaban';
        radio.value = i;
        radio.id = `ulangan-pil-${i}`;
        if (state.jawabanUser[state.current] === i) radio.checked = true;
        const label = document.createElement('label');
        label.htmlFor = `ulangan-pil-${i}`;
        label.textContent = `${pilihanLabel[i]}. ${p}`;
        div.appendChild(radio);
        div.appendChild(label);
        pilihanDiv.appendChild(div);

        radio.addEventListener('change', function() {
            state.jawabanUser[state.current] = parseInt(this.value);
            document.getElementById('ulangan-nextBtn').disabled = false;
            // Jika sudah menjawab semua, tampilkan tombol selesai
            const semuaTerjawab = state.jawabanUser.every(j => j !== null);
            document.getElementById('ulangan-selesaiBtn').style.display = semuaTerjawab ? 'inline-flex' : 'none';
        });
    });

    document.getElementById('ulangan-nextBtn').disabled = (state.jawabanUser[state.current] === null);
    const semuaTerjawab = state.jawabanUser.every(j => j !== null);
    document.getElementById('ulangan-selesaiBtn').style.display = semuaTerjawab ? 'inline-flex' : 'none';

    if (state.current === state.soal.length - 1) {
        document.getElementById('ulangan-nextBtn').style.display = 'none';
    } else {
        document.getElementById('ulangan-nextBtn').style.display = 'inline-flex';
    }
}

document.getElementById('ulangan-nextBtn').addEventListener('click', function() {
    const state = ulanganState;
    if (state.jawabanUser[state.current] === null) return;
    if (state.current < state.soal.length - 1) {
        state.current++;
        tampilSoalUlangan();
    }
});

document.getElementById('ulangan-selesaiBtn').addEventListener('click', function() {
    // Konfirmasi
    if (confirm('Apakah kamu yakin ingin menyelesaikan ulangan?')) {
        selesaikanUlangan();
    }
});

function selesaikanUlangan() {
    const state = ulanganState;
    if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
    }
    let benar = 0;
    state.jawabanUser.forEach((jaw, idx) => {
        if (jaw === state.soal[idx].jawaban) benar++;
    });
    const total = state.soal.length;
    const nilai = Math.round((benar / total) * 100);
    const lulus = nilai >= KONFIG.batasLulus;

    document.getElementById('ulangan-quiz').style.display = 'none';
    const hasilDiv = document.getElementById('ulangan-hasil');
    hasilDiv.style.display = 'block';

    hasilDiv.innerHTML = `
        <div class="hasil-card">
            <h3>📋 Hasil Ulangan</h3>
            <p><strong>Nama:</strong> ${state.nama}</p>
            <p><strong>Kelas:</strong> ${state.kelas}</p>
            <div class="nilai-besar">${nilai}</div>
            <div class="keterangan" style="color: ${lulus ? '#27ae60' : '#e74c3c'}">
                ${lulus ? '✅ Lulus' : '❌ Belum Lulus'}
            </div>
            <div class="detail">
                <p>📝 Jumlah soal: ${total}</p>
                <p>✅ Benar: ${benar}</p>
                <p>❌ Salah: ${total - benar}</p>
                <p>🎯 Batas lulus: ${KONFIG.batasLulus}</p>
            </div>
            <button class="btn btn-primary" id="ulanganUlangiBtn"><i class="fas fa-redo"></i> Ulangi Ulangan</button>
        </div>
    `;
    document.getElementById('ulanganUlangiBtn').addEventListener('click', resetUlangan);

    // Simpan riwayat (contoh)
    localStorage.setItem('nilaiUlangan', nilai);
}

// ===== ABOUT – Isi dari konfigurasi =====
document.getElementById('about-guru').textContent = KONFIG.guru;
document.getElementById('about-sekolah').textContent = KONFIG.sekolah;
document.getElementById('about-tahun').textContent = KONFIG.tahun;

// ===== INISIALISASI AWAL =====
// Render contoh soal jika halaman contoh aktif saat load
if (document.getElementById('page-contoh').classList.contains('active-page')) {
    renderContohSoal();
}