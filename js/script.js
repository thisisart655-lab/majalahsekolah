/**
 * ============================================================
 *  KONFIGURASI – Ubah data di sini untuk menyesuaikan website
 * ============================================================
 */

// Identitas guru & sekolah
const KONFIG = {
    Created : 'JAC Media',
    City : 'Pontianak',
    tahun: '2026',
    timerAktif: true,
    batasLulus: 70
};

// ============================================================
//  DATA SOAL
// ============================================================

/** Data untuk halaman Contoh Soal */
const contohSoal = [
    {
        pertanyaan: 'Berapa hasil dari 1/2 + 1/4?',
        pilihan: ['1/4', '3/4', '1/2', '2/4'],
        jawaban: 1,
        pembahasan: '1/2 = 2/4, maka 2/4 + 1/4 = 3/4.'
    },
    {
        pertanyaan: 'Pecahan 3/5 lebih besar dari pecahan ...?',
        pilihan: ['1/2', '2/5', '4/5', '1/5'],
        jawaban: 1,
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
//  END DATA
// ============================================================

// ===== NAVIGASI SPA =====
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-menu a');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
});

function navigateTo(pageId) {
    pages.forEach(p => p.classList.remove('active-page'));
    const target = document.getElementById(`page-${pageId}`);
    if (target) target.classList.add('active-page');

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId) link.classList.add('active');
    });

    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
    localStorage.setItem('lastPage', pageId);

    if (pageId === 'contoh') renderContohSoal();
    if (pageId === 'latihan') resetLatihan();
    if (pageId === 'ulangan') resetUlangan();
}

document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        const page = el.dataset.page;
        if (page) navigateTo(page);
    });
});

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
    document.getElementById('latihan-progress').textContent = `${progress}%`;
    document.getElementById('latihan-progress-fill').style.width = `${progress}%`;

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

    document.getElementById('latihan-nextBtn').disabled = (state.jawabanUser[state.current] === null);

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
    kelas: '',
    // Simpan detail jawaban untuk rekap
    detailJawaban: []
};

function resetUlangan() {
    document.getElementById('ulangan-form').style.display = 'block';
    document.getElementById('ulangan-quiz').style.display = 'none';
    document.getElementById('ulangan-hasil').style.display = 'none';
    ulanganState.current = 0;
    ulanganState.jawabanUser = [];
    ulanganState.detailJawaban = [];
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
    ulanganState.detailJawaban = [];
    ulanganState.selesai = false;
    ulanganState.detik = 0;

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
    document.getElementById('ulangan-progress').textContent = `${progress}%`;
    document.getElementById('ulangan-progress-fill').style.width = `${progress}%`;

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
    if (confirm('Apakah kamu yakin ingin menyelesaikan ulangan?')) {
        selesaikanUlangan();
    }
});

/**
 * ============================================================
 *  FUNGSI EXPORT KE EXCEL
 * ============================================================
 */
function exportToExcel(data) {
    try {
        // Buat workbook
        const wb = XLSX.utils.book_new();
        
        // Data untuk sheet
        const wsData = [
            ['REKAP NILAI ULANGAN HARIAN'],
            [''],
            ['Nama Siswa', data.nama],
            ['Kelas', data.kelas],
            ['Tanggal', new Date().toLocaleDateString('id-ID')],
            ['Waktu', new Date().toLocaleTimeString('id-ID')],
            [''],
            ['Total Soal', data.total],
            ['Jumlah Benar', data.benar],
            ['Jumlah Salah', data.salah],
            ['Nilai', data.nilai + ' (' + (data.lulus ? 'LULUS' : 'BELUM LULUS') + ')'],
            [''],
            ['DETAIL JAWABAN:'],
            ['No', 'Soal', 'Jawaban Siswa', 'Jawaban Benar', 'Status']
        ];

        // Tambahkan detail jawaban per soal
        data.detailJawaban.forEach((item, idx) => {
            wsData.push([
                idx + 1,
                item.soal,
                item.jawabanSiswa,
                item.jawabanBenar,
                item.status
            ]);
        });

        // Tambahkan baris kosong dan keterangan
        wsData.push(['']);
        wsData.push(['Keterangan:']);
        wsData.push(['✅ = Jawaban Benar']);
        wsData.push(['❌ = Jawaban Salah']);
        wsData.push(['']);
        wsData.push(['Dibuat oleh: ' + KONFIG.guru]);
        wsData.push(['Sekolah: ' + KONFIG.sekolah]);
        wsData.push(['Tahun: ' + KONFIG.tahun]);

        // Buat worksheet
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        
        // Set lebar kolom
        ws['!cols'] = [
            { wch: 8 },   // No
            { wch: 50 },  // Soal
            { wch: 25 },  // Jawaban Siswa
            { wch: 25 },  // Jawaban Benar
            { wch: 15 }   // Status
        ];

        // Merge cell untuk judul
        ws['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }
        ];

        // Tambahkan worksheet ke workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Rekap Nilai');

        // Generate file
        const fileName = `Rekap_Ulangan_${data.nama}_${new Date().toISOString().slice(0,10)}.xlsx`;
        XLSX.writeFile(wb, fileName);
        
        return true;
    } catch (error) {
        console.error('Error export Excel:', error);
        return false;
    }
}

function selesaikanUlangan() {
    const state = ulanganState;
    if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
    }
    
    let benar = 0;
    const detailJawaban = [];
    
    state.jawabanUser.forEach((jaw, idx) => {
        const soal = state.soal[idx];
        const isBenar = jaw === soal.jawaban;
        if (isBenar) benar++;
        
        detailJawaban.push({
            soal: soal.pertanyaan,
            jawabanSiswa: jaw !== null ? soal.pilihan[jaw] : '(Tidak dijawab)',
            jawabanBenar: soal.pilihan[soal.jawaban],
            status: isBenar ? '✅ Benar' : '❌ Salah'
        });
    });
    
    const total = state.soal.length;
    const salah = total - benar;
    const nilai = Math.round((benar / total) * 100);
    const lulus = nilai >= KONFIG.batasLulus;

    // Simpan data untuk export
    const exportData = {
        nama: state.nama,
        kelas: state.kelas,
        total: total,
        benar: benar,
        salah: salah,
        nilai: nilai,
        lulus: lulus,
        detailJawaban: detailJawaban
    };

    document.getElementById('ulangan-quiz').style.display = 'none';
    const hasilDiv = document.getElementById('ulangan-hasil');
    hasilDiv.style.display = 'block';

    hasilDiv.innerHTML = `
        <div class="hasil-card">
            <h3>📋 Hasil Ulangan</h3>
            <p><strong>Nama:</strong> ${state.nama}</p>
            <p><strong>Kelas:</strong> ${state.kelas}</p>
            <div class="nilai-besar">${nilai}</div>
            <div class="keterangan" style="color: ${lulus ? '#00B894' : '#E17055'}">
                ${lulus ? '✅ Lulus' : '❌ Belum Lulus'}
            </div>
            <div class="detail">
                <p>📝 Jumlah soal: ${total}</p>
                <p>✅ Benar: ${benar}</p>
                <p>❌ Salah: ${salah}</p>
                <p>🎯 Batas lulus: ${KONFIG.batasLulus}</p>
            </div>
            <div class="hasil-actions">
                <button class="btn btn-success" id="exportExcelBtn">
                    <i class="fas fa-file-excel"></i> Download Excel
                </button>
                <button class="btn btn-primary" id="ulanganUlangiBtn">
                    <i class="fas fa-redo"></i> Ulangi Ulangan
                </button>
            </div>
        </div>
    `;

    // Event untuk export Excel
    document.getElementById('exportExcelBtn').addEventListener('click', function() {
        const success = exportToExcel(exportData);
        if (success) {
            this.innerHTML = '<i class="fas fa-check"></i> Berhasil Diunduh!';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-file-excel"></i> Download Excel';
            }, 3000);
        } else {
            alert('Gagal mengunduh file Excel. Silakan coba lagi.');
        }
    });

    document.getElementById('ulanganUlangiBtn').addEventListener('click', resetUlangan);
    localStorage.setItem('nilaiUlangan', nilai);
}

// ===== ABOUT =====
document.getElementById('about-guru').textContent = KONFIG.guru;
document.getElementById('about-sekolah').textContent = KONFIG.sekolah;
document.getElementById('about-tahun').textContent = KONFIG.tahun;

// ===== INISIALISASI =====
if (document.getElementById('page-contoh').classList.contains('active-page')) {
    renderContohSoal();
}
