/**
 * ============================================================
 *  KONFIGURASI – Ubah data di sini untuk menyesuaikan website
 * ============================================================
 */

const KONFIG = {
    guru: 'Bapak/Ibu Guru',
    sekolah: 'SD Negeri 1',
    tahun: '2026',
    timerAktif: true,
    batasLulus: 70,
    adminPassword: 'akuganteng'
};

// ============================================================
//  DATA SOAL
// ============================================================

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
//  DATA REKAP - DISIMPAN DI VARIABEL (TANPA LOCALSTORAGE)
// ============================================================

let dataRekap = [];

// ============================================================
//  ADMIN AUTHENTICATION
// ============================================================

let isAdminLoggedIn = false;

function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    const icons = { success: '✅', error: '❌', warning: '⚠️' };
    toast.innerHTML = `${icons[type] || '📢'} ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(30px) scale(0.9)';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

function checkAdminStatus() {
    const saved = localStorage.getItem('adminLoggedIn');
    if (saved === 'true') {
        isAdminLoggedIn = true;
        showAdminDashboard();
        updateUIForAdmin();
        showToast('👋 Selamat datang, Guru!', 'success');
    }
    updateNavbar();
}

function loginAdmin(password) {
    if (password === KONFIG.adminPassword) {
        isAdminLoggedIn = true;
        localStorage.setItem('adminLoggedIn', 'true');
        document.getElementById('loginError').style.display = 'none';
        document.getElementById('adminPassword').value = '';
        showAdminDashboard();
        updateUIForAdmin();
        updateNavbar();
        showToast('✅ Login berhasil!', 'success');
        navigateTo('rekap');
        return true;
    } else {
        document.getElementById('loginError').style.display = 'block';
        showToast('❌ Password salah!', 'error');
        return false;
    }
}

function logoutAdmin() {
    isAdminLoggedIn = false;
    localStorage.removeItem('adminLoggedIn');
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
    document.getElementById('adminPassword').value = '';
    document.body.classList.remove('admin-logged-in');
    updateNavbar();
    showToast('👋 Logout berhasil.', 'warning');
    navigateTo('home');
}

function showAdminDashboard() {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    document.body.classList.add('admin-logged-in');
    renderRekapNilai();
}

function updateUIForAdmin() {
    document.body.classList.add('admin-logged-in');
    const badge = document.getElementById('adminBadge');
    if (badge) badge.style.display = 'inline-block';
    const logoutNav = document.getElementById('logoutNav');
    if (logoutNav) logoutNav.style.display = 'block';
}

function updateNavbar() {
    const badge = document.getElementById('adminBadge');
    const logoutNav = document.getElementById('logoutNav');
    if (isAdminLoggedIn) {
        if (badge) badge.style.display = 'inline-block';
        if (logoutNav) logoutNav.style.display = 'block';
        document.body.classList.add('admin-logged-in');
    } else {
        if (badge) badge.style.display = 'none';
        if (logoutNav) logoutNav.style.display = 'none';
        document.body.classList.remove('admin-logged-in');
    }
}

// ===== NAVIGASI SPA =====
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-menu a');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', function() {
    this.classList.toggle('active');
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
    if (pageId === 'rekap' && isAdminLoggedIn) renderRekapNilai();

    if (typeof AOS !== 'undefined') {
        setTimeout(() => AOS.refresh(), 100);
    }
}

document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.dataset.page;
        if (page) navigateTo(page);
    });
});

// ============================================================
//  REKAP NILAI - TANPA LOCALSTORAGE
// ============================================================

function addRekapNilai(data) {
    try {
        console.log('Menambahkan data rekap:', data);
        
        // Buat entry baru dengan ID unik
        const entry = {
            id: Date.now() + Math.random() * 1000,
            nama: data.nama || 'Tidak diketahui',
            kelas: data.kelas || '-',
            nilai: data.nilai || 0,
            benar: data.benar || 0,
            salah: data.salah || 0,
            total: data.total || 0,
            lulus: data.lulus || false,
            timestamp: new Date().toISOString(),
            detailJawaban: data.detailJawaban || []
        };
        
        // Tambahkan ke array dataRekap
        dataRekap.push(entry);
        
        console.log('Data rekap berhasil ditambahkan! Total:', dataRekap.length);
        showToast('✅ Data ulangan berhasil disimpan!', 'success');
        return entry;
        
    } catch (error) {
        console.error('Error addRekapNilai:', error);
        showToast('❌ Gagal menyimpan data!', 'error');
        return null;
    }
}

function clearRekapNilai() {
    if (confirm('Apakah Anda yakin ingin menghapus semua data rekap nilai?')) {
        dataRekap = [];
        renderRekapNilai();
        showToast('🗑️ Semua data rekap nilai telah dihapus.', 'warning');
    }
}

function renderRekapNilai() {
    if (!isAdminLoggedIn) {
        const container = document.getElementById('rekap-container');
        if (container) {
            container.innerHTML = `
                <div class="rekap-empty">
                    <i class="fas fa-lock"></i>
                    <h3>Akses Terbatas</h3>
                    <p>Silakan login sebagai guru untuk melihat rekap nilai.</p>
                </div>
            `;
        }
        return;
    }

    const container = document.getElementById('rekap-container');
    if (!container) return;
    
    console.log('Data rekap untuk ditampilkan:', dataRekap.length, 'item');

    if (dataRekap.length === 0) {
        container.innerHTML = `
            <div class="rekap-empty">
                <i class="fas fa-inbox"></i>
                <h3>Belum Ada Data</h3>
                <p>Belum ada siswa yang mengerjakan ulangan. Data akan muncul setelah siswa menyelesaikan ulangan.</p>
            </div>
        `;
        return;
    }

    // Urutkan dari yang terbaru
    const rekap = [...dataRekap].sort((a, b) => b.id - a.id);
    
    let html = `
        <div class="rekap-header">
            <div class="rekap-header-left">
                <h3><i class="fas fa-chart-bar"></i> Rekap Nilai Ulangan</h3>
                <span class="rekap-count">${rekap.length} Siswa</span>
            </div>
            <div class="rekap-header-right admin-only">
                <button class="btn btn-success" id="exportRekapExcelBtn"><i class="fas fa-file-excel"></i> Export Semua</button>
                <button class="btn btn-danger" id="clearRekapBtn"><i class="fas fa-trash"></i> Hapus Semua</button>
            </div>
        </div>
        <div class="rekap-grid">
    `;

    rekap.forEach((item, index) => {
        const date = new Date(item.timestamp);
        const dateStr = date.toLocaleDateString('id-ID');
        const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        html += `
            <div class="rekap-card" data-aos="fade-up" data-aos-delay="${index * 50}">
                <div class="rekap-card-header">
                    <div class="rekap-siswa">
                        <div class="rekap-avatar"><i class="fas fa-user"></i></div>
                        <div>
                            <h4>${item.nama || 'Tidak diketahui'}</h4>
                            <span class="rekap-kelas">${item.kelas || '-'}</span>
                        </div>
                    </div>
                    <div class="rekap-nilai ${item.lulus ? 'lulus' : 'tidak-lulus'}">${item.nilai || 0}</div>
                </div>
                <div class="rekap-card-body">
                    <div class="rekap-stats">
                        <span><i class="fas fa-check-circle" style="color: #00B894;"></i> ${item.benar || 0} Benar</span>
                        <span><i class="fas fa-times-circle" style="color: #E17055;"></i> ${item.salah || 0} Salah</span>
                        <span><i class="fas fa-question-circle" style="color: #FDCB6E;"></i> ${item.total || 0} Soal</span>
                    </div>
                    <div class="rekap-detail-jawaban">
                        <button class="btn btn-secondary btn-sm toggle-detail" data-id="${item.id}">
                            <i class="fas fa-chevron-down"></i> Lihat Detail Jawaban
                        </button>
                        <div class="detail-jawaban-content" id="detail-${item.id}" style="display:none;">
                            <table class="detail-table">
                                <thead><tr><th>No</th><th>Soal</th><th>Jawaban Siswa</th><th>Jawaban Benar</th><th>Status</th></tr></thead>
                                <tbody>
                                    ${(item.detailJawaban || []).map((d, i) => `
                                        <tr class="${d.status && d.status.includes('Benar') ? 'row-benar' : 'row-salah'}">
                                            <td>${i + 1}</td>
                                            <td>${d.soal || '-'}</td>
                                            <td>${d.jawabanSiswa || '-'}</td>
                                            <td>${d.jawabanBenar || '-'}</td>
                                            <td>${d.status || '-'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="rekap-timestamp"><i class="fas fa-clock"></i> ${dateStr} ${timeStr}</div>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;

    document.querySelectorAll('.toggle-detail').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            const content = document.getElementById(`detail-${id}`);
            if (content) {
                content.style.display = content.style.display === 'none' ? 'block' : 'none';
                this.innerHTML = content.style.display === 'none' ?
                    '<i class="fas fa-chevron-down"></i> Lihat Detail Jawaban' :
                    '<i class="fas fa-chevron-up"></i> Sembunyikan Detail Jawaban';
            }
        });
    });

    if (isAdminLoggedIn) {
        document.getElementById('exportRekapExcelBtn')?.addEventListener('click', function() { exportRekapToExcel(rekap); });
        document.getElementById('clearRekapBtn')?.addEventListener('click', clearRekapNilai);
    }

    if (typeof AOS !== 'undefined') AOS.refresh();
}

function exportRekapToExcel(rekapData) {
    try {
        const wb = XLSX.utils.book_new();
        const rekapRows = [
            ['REKAP NILAI ULANGAN HARIAN'],
            [''],
            ['No', 'Nama Siswa', 'Kelas', 'Nilai', 'Benar', 'Salah', 'Total Soal', 'Status', 'Tanggal', 'Waktu']
        ];
        rekapData.forEach((item, idx) => {
            const date = new Date(item.timestamp);
            rekapRows.push([
                idx + 1, item.nama || '-', item.kelas || '-', item.nilai || 0,
                item.benar || 0, item.salah || 0, item.total || 0,
                item.lulus ? 'LULUS' : 'BELUM LULUS',
                date.toLocaleDateString('id-ID'),
                date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            ]);
        });
        const totalSiswa = rekapData.length;
        const rataRata = totalSiswa > 0 ? Math.round(rekapData.reduce((sum, d) => sum + (d.nilai || 0), 0) / totalSiswa) : 0;
        const lulusCount = rekapData.filter(d => d.lulus).length;
        rekapRows.push([''], ['STATISTIK:'], ['Total Siswa', totalSiswa], ['Rata-rata Nilai', rataRata], ['Siswa Lulus', lulusCount], ['Siswa Tidak Lulus', totalSiswa - lulusCount]);
        rekapRows.push([''], ['Dibuat oleh: ' + KONFIG.guru], ['Sekolah: ' + KONFIG.sekolah], ['Tahun: ' + KONFIG.tahun]);

        const ws1 = XLSX.utils.aoa_to_sheet(rekapRows);
        ws1['!cols'] = [{ wch: 6 }, { wch: 20 }, { wch: 10 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 10 }];
        XLSX.utils.book_append_sheet(wb, ws1, 'Rekap Nilai');

        const detailRows = [
            ['DETAIL JAWABAN PER SISWA'],
            [''],
            ['No', 'Nama Siswa', 'Soal ke-', 'Soal', 'Jawaban Siswa', 'Jawaban Benar', 'Status']
        ];
        rekapData.forEach((item, idx) => {
            (item.detailJawaban || []).forEach((d, i) => {
                detailRows.push([idx + 1, item.nama || '-', i + 1, d.soal || '-', d.jawabanSiswa || '-', d.jawabanBenar || '-', d.status || '-']);
            });
        });
        const ws2 = XLSX.utils.aoa_to_sheet(detailRows);
        ws2['!cols'] = [{ wch: 6 }, { wch: 20 }, { wch: 10 }, { wch: 50 }, { wch: 25 }, { wch: 25 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(wb, ws2, 'Detail Jawaban');

        const fileName = `Rekap_Ulangan_${new Date().toISOString().slice(0,10)}.xlsx`;
        XLSX.writeFile(wb, fileName);
        showToast('✅ Data berhasil diexport ke Excel!', 'success');
        return true;
    } catch (error) {
        console.error('Error export Excel:', error);
        showToast('❌ Gagal mengunduh file Excel.', 'error');
        return false;
    }
}

// ============================================================
//  RENDER CONTOH SOAL
// ============================================================

function renderContohSoal() {
    const container = document.getElementById('contoh-container');
    if (!container) return;
    container.innerHTML = '';
    contohSoal.forEach((soal, idx) => {
        const div = document.createElement('div');
        div.className = 'contoh-item';
        div.setAttribute('data-aos', 'fade-up');
        div.setAttribute('data-aos-delay', (idx * 100) + '');
        div.innerHTML = `
            <div class="pertanyaan">${idx+1}. ${soal.pertanyaan}</div>
            <ul class="pilihan">${soal.pilihan.map((p, i) => `<li>${String.fromCharCode(97+i)}. ${p}</li>`).join('')}</ul>
            <button class="btn btn-secondary btn-pembahasan" data-index="${idx}"><i class="fas fa-eye"></i> Lihat Pembahasan</button>
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
            if (pemb) {
                pemb.classList.toggle('open');
                this.innerHTML = pemb.classList.contains('open') ?
                    '<i class="fas fa-eye-slash"></i> Sembunyikan Pembahasan' :
                    '<i class="fas fa-eye"></i> Lihat Pembahasan';
            }
        });
    });
    if (typeof AOS !== 'undefined') setTimeout(() => AOS.refresh(), 200);
}

// ============================================================
//  SOAL LATIHAN
// ============================================================

let latihanState = { current: 0, jawabanUser: [], soal: soalLatihan, selesai: false };

function resetLatihan() {
    document.getElementById('latihan-start').style.display = 'block';
    document.getElementById('latihan-quiz').style.display = 'none';
    document.getElementById('latihan-hasil').style.display = 'none';
    latihanState.current = 0;
    latihanState.jawabanUser = new Array(latihanState.soal.length).fill(null);
    latihanState.selesai = false;
}

document.getElementById('mulaiLatihanBtn')?.addEventListener('click', function() {
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
    const pilihanEl = document.getElementById('latihan-pilihan');
    pilihanEl.innerHTML = '';
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
        pilihanEl.appendChild(div);
        radio.addEventListener('change', function() {
            state.jawabanUser[state.current] = parseInt(this.value);
            document.getElementById('latihan-nextBtn').disabled = false;
        });
    });
    const nextBtn = document.getElementById('latihan-nextBtn');
    nextBtn.disabled = (state.jawabanUser[state.current] === null);
    nextBtn.innerHTML = state.current === state.soal.length - 1 ?
        '<i class="fas fa-check"></i> Lihat Hasil' :
        '<i class="fas fa-arrow-right"></i> Soal Berikutnya';
}

document.getElementById('latihan-nextBtn')?.addEventListener('click', function() {
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
    state.jawabanUser.forEach((jaw, idx) => { if (jaw === state.soal[idx].jawaban) benar++; });
    const total = state.soal.length;
    const nilai = Math.round((benar / total) * 100);
    document.getElementById('latihan-quiz').style.display = 'none';
    const hasilEl = document.getElementById('latihan-hasil');
    hasilEl.style.display = 'block';
    let motivasi = nilai >= 80 ? '🌟 Hebat! Kamu sangat pintar!' : nilai >= 60 ? '💪 Terus belajar, kamu pasti bisa lebih baik!' : '📚 Ayo belajar lagi, jangan menyerah!';
    hasilEl.innerHTML = `
        <div class="hasil-card">
            <div class="nilai-besar">${nilai}</div>
            <div class="keterangan">${motivasi}</div>
            <div class="detail"><p>✅ Benar: ${benar}</p><p>❌ Salah: ${total - benar}</p><p>📊 Jumlah soal: ${total}</p></div>
            <button class="btn btn-primary" id="latihanUlangiBtn"><i class="fas fa-redo"></i> Coba Lagi</button>
        </div>
    `;
    document.getElementById('latihanUlangiBtn')?.addEventListener('click', resetLatihan);
    localStorage.setItem('nilaiLatihan', nilai);
}

// ============================================================
//  ULANGAN HARIAN
// ============================================================

let ulanganState = { 
    current: 0, 
    jawabanUser: [], 
    soal: soalUlangan, 
    selesai: false, 
    timer: null, 
    detik: 0, 
    nama: '', 
    kelas: '', 
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

document.getElementById('mulaiUlanganBtn')?.addEventListener('click', function() {
    const nama = document.getElementById('ulangan-nama').value.trim();
    const kelas = document.getElementById('ulangan-kelas').value.trim();
    if (!nama || !kelas) { 
        showToast('⚠️ Silakan isi nama dan kelas terlebih dahulu!', 'warning'); 
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
    const pilihanEl = document.getElementById('ulangan-pilihan');
    pilihanEl.innerHTML = '';
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
        pilihanEl.appendChild(div);
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
    document.getElementById('ulangan-nextBtn').style.display = state.current === state.soal.length - 1 ? 'none' : 'inline-flex';
}

document.getElementById('ulangan-nextBtn')?.addEventListener('click', function() {
    const state = ulanganState;
    if (state.jawabanUser[state.current] === null) return;
    if (state.current < state.soal.length - 1) { 
        state.current++;
        tampilSoalUlangan(); 
    }
});

document.getElementById('ulangan-selesaiBtn')?.addEventListener('click', function() {
    if (confirm('Apakah kamu yakin ingin menyelesaikan ulangan?')) { 
        selesaikanUlangan(); 
    }
});

// ===== FUNGSI UTAMA SELESAIKAN ULANGAN =====
function selesaikanUlangan() {
    console.log('=== MEMULAI PROSES SELESAIKAN ULANGAN ===');
    
    const state = ulanganState;
    console.log('State ulangan:', state);
    
    // Hentikan timer
    if (state.timer) { 
        clearInterval(state.timer);
        state.timer = null; 
    }
    
    // Hitung nilai
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
    
    console.log('Hasil perhitungan:', { benar, salah, total, nilai, lulus });
    
    // Buat data rekap
    const rekapData = {
        nama: state.nama,
        kelas: state.kelas,
        nilai: nilai,
        benar: benar,
        salah: salah,
        total: total,
        lulus: lulus,
        detailJawaban: detailJawaban
    };
    
    console.log('Data rekap yang akan disimpan:', rekapData);
    
    // === SIMPAN KE REKAP (TANPA LOCALSTORAGE) ===
    const result = addRekapNilai(rekapData);
    console.log('Hasil penyimpanan:', result);
    
    // Tampilkan hasil ulangan
    document.getElementById('ulangan-quiz').style.display = 'none';
    const hasilEl = document.getElementById('ulangan-hasil');
    hasilEl.style.display = 'block';
    
    // Cek apakah admin sudah login untuk menampilkan tombol export
    const isAdmin = isAdminLoggedIn;
    
    const exportButtonHtml = isAdmin ? 
        `<button class="btn btn-success" id="exportExcelBtn"><i class="fas fa-file-excel"></i> Download Excel</button>` : '';
    
    hasilEl.innerHTML = `
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
                ${exportButtonHtml}
                <button class="btn btn-primary" id="ulanganUlangiBtn"><i class="fas fa-redo"></i> Ulangi Ulangan</button>
            </div>
            <div class="rekap-link">
                <a href="#" data-page="rekap" class="btn btn-secondary"><i class="fas fa-chart-bar"></i> Lihat Rekap Nilai</a>
            </div>
        </div>
    `;
    
    // Event listener untuk tombol export (hanya untuk admin)
    if (isAdmin) {
        document.getElementById('exportExcelBtn')?.addEventListener('click', function() {
            const success = exportRekapToExcel([rekapData]);
            if (success) {
                this.innerHTML = '<i class="fas fa-check"></i> Berhasil Diunduh!';
                setTimeout(() => { 
                    this.innerHTML = '<i class="fas fa-file-excel"></i> Download Excel'; 
                }, 3000);
            }
        });
    }
    
    // Event listener untuk tombol ulangi
    document.getElementById('ulanganUlangiBtn')?.addEventListener('click', resetUlangan);
    
    // Event listener untuk link ke rekap
    document.querySelector('.rekap-link a')?.addEventListener('click', function(e) {
        e.preventDefault();
        if (!isAdminLoggedIn) {
            showToast('🔒 Silakan login sebagai guru untuk melihat rekap nilai.', 'warning');
            navigateTo('ulangan');
            setTimeout(() => {
                const loginEl = document.getElementById('admin-login');
                if (loginEl) loginEl.scrollIntoView({ behavior: 'smooth' });
            }, 300);
            return;
        }
        navigateTo('rekap');
        setTimeout(() => {
            const rekapEl = document.getElementById('rekap-container');
            if (rekapEl) rekapEl.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    });
    
    // Simpan nilai ke localStorage untuk sementara (opsional)
    localStorage.setItem('nilaiUlangan', nilai);
    console.log('=== PROSES SELESAIKAN ULANGAN SELESAI ===');
}

// ============================================================
//  ABOUT
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('about-guru').textContent = KONFIG.guru;
    document.getElementById('about-sekolah').textContent = KONFIG.sekolah;
    document.getElementById('about-tahun').textContent = KONFIG.tahun;

    // Login Admin
    document.getElementById('loginAdminBtn')?.addEventListener('click', function() {
        const password = document.getElementById('adminPassword').value;
        loginAdmin(password);
    });
    document.getElementById('adminPassword')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') loginAdmin(this.value);
    });
    document.getElementById('logoutAdminBtn')?.addEventListener('click', logoutAdmin);
    document.getElementById('logoutBtnNav')?.addEventListener('click', function(e) {
        e.preventDefault();
        logoutAdmin();
    });
    
    checkAdminStatus();
    if (document.getElementById('page-contoh')?.classList.contains('active-page')) renderContohSoal();
});

// ============================================================
//  INISIALISASI
// ============================================================

AOS.init({ duration: 800, once: false, offset: 100, easing: 'ease-in-out' });

(function() {
    const container = document.getElementById('particles-container');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 2;
        particle.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${Math.random()*100}%;animation-duration:${Math.random()*20+10}s;animation-delay:${Math.random()*10}s;background:hsla(${Math.random()*360},70%,60%,${Math.random()*0.3+0.1})`;
        container.appendChild(particle);
    }
})();

document.querySelectorAll('.stat-number').forEach(counter => {
    const target = parseInt(counter.dataset.count);
    let current = 0;
    const step = target / 125;
    const update = () => {
        current += step;
        if (current >= target) { 
            counter.textContent = target + (target > 50 ? '+' : ''); 
            return; 
        }
        counter.textContent = Math.floor(current);
        requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { 
            if (entry.isIntersecting) { 
                update();
                observer.disconnect(); 
            } 
        });
    });
    observer.observe(counter);
});