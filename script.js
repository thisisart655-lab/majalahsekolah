// ============================================
// DATA DEFAULT
// ============================================
const DEFAULT_MATERI = [{
    id: 'm1',
    judul: 'Pengantar HTML & CSS',
    deskripsi: 'Dasar struktur web dan styling modern.',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=200&fit=crop',
    sub: ['Tag HTML dasar', 'CSS Selector & Properti', 'Box Model & Layout', 'Flexbox Dasar']
}, {
    id: 'm2',
    judul: 'JavaScript Interaktif',
    deskripsi: 'Logika pemrograman, DOM, dan event handling.',
    image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=200&fit=crop',
    sub: ['Variabel & Tipe Data', 'Fungsi & Arrow Function', 'DOM Manipulation', 'Event Listener']
}, {
    id: 'm3',
    judul: 'Desain Responsif',
    deskripsi: 'Teknik membuat web adaptif di semua perangkat.',
    image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=200&fit=crop',
    sub: ['Media Queries', 'Mobile First', 'Grid System', 'Responsive Images']
}];

const DEFAULT_LATIHAN = [{
    id: 'l1',
    judul: 'Latihan HTML Dasar',
    deskripsi: 'Uji pemahaman HTML dasar dengan pilihan ganda.',
    questions: [
        { question: 'Apa fungsi dari tag <h1>?', image: '', options: ['Heading terbesar', 'Heading terkecil', 'Paragraf', 'Link'], answer: 0 },
        { question: 'Tag apa yang digunakan untuk membuat link?', image: '', options: ['<link>', '<a>', '<href>', '<url>'], answer: 1 },
        { question: 'Apa singkatan dari HTML?', image: '', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'],
            answer: 0 }
    ]
}, {
    id: 'l2',
    judul: 'Latihan CSS Flexbox',
    deskripsi: 'Uji pemahaman tentang CSS Flexbox.',
    questions: [
        { question: 'Properti apa untuk mengatur arah flex?', image: '', options: ['flex-direction', 'flex-wrap', 'justify-content', 'align-items'], answer: 0 },
        { question: 'Apa fungsi justify-content: center?', image: '', options: ['Mengatur ke tengah horizontal', 'Mengatur ke tengah vertikal', 'Mengatur jarak antar item', 'Mengatur urutan item'],
            answer: 0 },
        { question: 'Properti apa untuk membungkus item flex?', image: '', options: ['flex-wrap', 'flex-direction', 'align-items', 'flex-flow'], answer: 0 }
    ]
}, {
    id: 'l3',
    judul: 'Latihan JavaScript',
    deskripsi: 'Uji pemahaman dasar JavaScript.',
    questions: [
        { question: 'Bagaimana cara mendeklarasikan variabel di JavaScript?', image: '', options: ['var', 'let', 'const', 'Semua benar'], answer: 3 },
        { question: 'Apa output dari console.log(typeof 42)?', image: '', options: ['number', 'string', 'object', 'undefined'], answer: 0 },
        { question: 'Fungsi apa untuk menampilkan pesan ke konsol?', image: '', options: ['console.log()', 'alert()', 'print()', 'echo()'], answer: 0 }
    ]
}];

// ============================================
// STATE
// ============================================
let materiList = [];
let latihanList = [];
let isAdminMode = false;
let editingMateriId = null;
let editingQuestionData = null;
let tempSubItems = [];
let tempOptions = ['', ''];

// ============================================
// DOM REFS
// ============================================
const materiContainer = document.getElementById('materiContainer');
const latihanContainer = document.getElementById('latihanContainer');
const adminDashboard = document.getElementById('adminDashboard');
const adminLoginArea = document.getElementById('adminLoginArea');
const adminContentArea = document.getElementById('adminContentArea');
const loginMessage = document.getElementById('loginMessage');
const adminListContainer = document.getElementById('adminListContainer');
const adminMessage = document.getElementById('adminMessage');
const subPageOverlay = document.getElementById('subPageOverlay');
const subTitle = document.getElementById('subTitle');
const subDesc = document.getElementById('subDesc');
const subImage = document.getElementById('subImage');
const subContentContainer = document.getElementById('subContentContainer');

// Editor Materi
const editorOverlay = document.getElementById('editorOverlay');
const editJudul = document.getElementById('editJudul');
const editDeskripsi = document.getElementById('editDeskripsi');
const editImageUrl = document.getElementById('editImageUrl');
const imagePreview = document.getElementById('imagePreview');
const imageFileInput = document.getElementById('imageFileInput');
const imageUploadArea = document.getElementById('imageUploadArea');
const subItemsContainer = document.getElementById('subItemsContainer');
const newSubInput = document.getElementById('newSubInput');

// Editor Soal
const questionEditorOverlay = document.getElementById('questionEditorOverlay');
const editQuestionText = document.getElementById('editQuestionText');
const editQuestionImageUrl = document.getElementById('editQuestionImageUrl');
const questionImagePreview = document.getElementById('questionImagePreview');
const questionImageFile = document.getElementById('questionImageFile');
const questionImageUploadArea = document.getElementById('questionImageUploadArea');
const optionsContainer = document.getElementById('optionsContainer');
const correctAnswerSelect = document.getElementById('correctAnswerSelect');

// ============================================
// HEADER
// ============================================
function loadHeader() {
    const headerData = localStorage.getItem('edulearn_header');
    if (headerData) {
        try {
            const parsed = JSON.parse(headerData);
            document.getElementById('siteLogo').innerHTML = parsed.siteTitle + ' <small>LMS</small>';
            document.getElementById('heroTitle').textContent = parsed.heroTitle;
            document.getElementById('heroSubtitle').textContent = parsed.heroSubtitle;
            return parsed;
        } catch (e) {}
    }
    return {
        siteTitle: 'EduLearn',
        heroTitle: 'Mulai Belajar Sekarang',
        heroSubtitle: 'Platform pembelajaran modern dengan konten dinamis yang dapat dikelola oleh admin. Jelajahi materi dan latihan yang tersedia.'
    };
}

function saveHeader(data) {
    localStorage.setItem('edulearn_header', JSON.stringify(data));
    document.getElementById('siteLogo').innerHTML = data.siteTitle + ' <small>LMS</small>';
    document.getElementById('heroTitle').textContent = data.heroTitle;
    document.getElementById('heroSubtitle').textContent = data.heroSubtitle;
}

// ============================================
// STORAGE
// ============================================
function loadFromStorage() {
    const storedMateri = localStorage.getItem('edulearn_materi');
    const storedLatihan = localStorage.getItem('edulearn_latihan');
    materiList = storedMateri ? JSON.parse(storedMateri) : [];
    latihanList = storedLatihan ? JSON.parse(storedLatihan) : [];
    if (!materiList || materiList.length === 0) materiList = DEFAULT_MATERI.map(m => ({ ...m, id: String(m.id), sub: m.sub || [],
        image: m.image || '' }));
    if (!latihanList || latihanList.length === 0) latihanList = DEFAULT_LATIHAN.map(l => ({ ...l, id: String(l.id),
        questions: l.questions || [] }));
    saveAll();
}

function saveAll() {
    localStorage.setItem('edulearn_materi', JSON.stringify(materiList));
    localStorage.setItem('edulearn_latihan', JSON.stringify(latihanList));
}

// ============================================
// NAVIGASI
// ============================================
function navigateTo(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-links a[data-page]').forEach(a => a.classList.remove('active'));
    const targetPage = document.getElementById('page-' + page);
    if (targetPage) targetPage.classList.add('active');
    const link = document.querySelector(`.nav-links a[data-page="${page}"]`);
    if (link) link.classList.add('active');
    updateStats();
}

// ============================================
// UPDATE STATS
// ============================================
function updateStats() {
    const totalMateri = materiList.length;
    const totalLatihan = latihanList.length;
    const totalSub = materiList.reduce((acc, m) => acc + (m.sub ? m.sub.length : 0), 0) +
        latihanList.reduce((acc, l) => acc + (l.questions ? l.questions.length : 0), 0);
    document.getElementById('totalMateri').textContent = totalMateri;
    document.getElementById('totalLatihan').textContent = totalLatihan;
    document.getElementById('totalSub').textContent = totalSub;
    document.getElementById('materiCount').textContent = totalMateri + ' materi';
    document.getElementById('latihanCount').textContent = totalLatihan + ' latihan';
}

// ============================================
// RENDER PUBLIK
// ============================================
function renderPublic() {
    if (materiList.length === 0) {
        materiContainer.innerHTML =
            `<div style="grid-column:1/-1; text-align:center; padding:40px; color:rgba(255,255,255,0.3);">Belum ada materi.</div>`;
    } else {
        materiContainer.innerHTML = materiList.map(m => `
                <div class="card" data-id="${m.id}" data-type="materi">
                    ${m.image ? `<img class="card-image" src="${escapeHtml(m.image)}" alt="${escapeHtml(m.judul)}">` : '<span class="card-icon">📘</span>'}
                    <h3>${escapeHtml(m.judul)}</h3>
                    <p>${escapeHtml(m.deskripsi)}</p>
                    <div class="card-meta">
                        <span>${m.sub ? m.sub.length : 0} sub materi</span>
                        ${m.image ? '<span class="badge">🖼️ Gambar</span>' : '<span class="badge">Klik untuk lihat</span>'}
                    </div>
                </div>
            `).join('');
    }

    if (latihanList.length === 0) {
        latihanContainer.innerHTML =
            `<div style="grid-column:1/-1; text-align:center; padding:40px; color:rgba(255,255,255,0.3);">Belum ada latihan.</div>`;
    } else {
        latihanContainer.innerHTML = latihanList.map(l => `
                <div class="card" data-id="${l.id}" data-type="latihan">
                    <span class="card-icon">📝</span>
                    <h3>${escapeHtml(l.judul)}</h3>
                    <p>${escapeHtml(l.deskripsi)}</p>
                    <div class="card-meta">
                        <span>${l.questions ? l.questions.length : 0} soal pilihan ganda</span>
                        <span class="badge">Klik untuk kerjakan</span>
                    </div>
                </div>
            `).join('');
    }

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            const id = this.dataset.id;
            const type = this.dataset.type;
            const list = type === 'materi' ? materiList : latihanList;
            const item = list.find(x => x.id === id);
            if (item) {
                if (type === 'materi') {
                    openMateriPage(item);
                } else {
                    openLatihanPage(item);
                }
            }
        });
    });

    updateStats();
}

// ============================================
// OPEN MATERI
// ============================================
function openMateriPage(item) {
    subTitle.textContent = item.judul;
    subDesc.textContent = item.deskripsi;
    if (item.image) {
        subImage.style.display = 'block';
        subImage.src = item.image;
        subImage.alt = item.judul;
    } else {
        subImage.style.display = 'none';
    }
    if (item.sub && item.sub.length > 0) {
        subContentContainer.innerHTML = `
                <ul class="sub-list">
                    ${item.sub.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
                </ul>
            `;
    } else {
        subContentContainer.innerHTML =
            `<p style="color:rgba(255,255,255,0.3); padding:20px 0;">Belum ada sub materi.</p>`;
    }
    subPageOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ============================================
// OPEN LATIHAN
// ============================================
function openLatihanPage(item) {
    subTitle.textContent = item.judul;
    subDesc.textContent = item.deskripsi;
    subImage.style.display = 'none';

    if (item.questions && item.questions.length > 0) {
        let html = `<div class="quiz-container">`;
        let totalQuestions = item.questions.length;

        item.questions.forEach((q, idx) => {
            html += `
                    <div class="quiz-question" data-qindex="${idx}">
                        <div class="question-text">
                            <span>${idx+1}. ${escapeHtml(q.question)}</span>
                            ${isAdminMode ? `
                                <div class="q-actions">
                                    <button class="btn btn-success" onclick="openQuestionEditor('${item.id}', ${idx})">✎ Edit</button>
                                    <button class="btn btn-danger" onclick="deleteQuestion('${item.id}', ${idx})">✕</button>
                                </div>
                            ` : ''}
                        </div>
                        ${q.image ? `<img class="question-image" src="${escapeHtml(q.image)}" alt="Gambar soal">` : ''}
                        <div class="quiz-options">
                            ${q.options.map((opt, oi) => `
                                <div class="quiz-option" data-optindex="${oi}">
                                    <input type="radio" name="q${idx}" value="${oi}" id="q${idx}_${oi}">
                                    <label for="q${idx}_${oi}">${escapeHtml(opt)}</label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
        });

        html += `
                <button class="btn btn-primary" id="submitQuizBtn" style="margin-top:15px;">Kirim Jawaban</button>
                <div id="quizResult" class="quiz-result" style="display:none;"></div>
            `;
        html += `</div>`;
        subContentContainer.innerHTML = html;

        if (isAdminMode) {
            const container = document.getElementById('subContentContainer');
            const addBtn = document.createElement('button');
            addBtn.className = 'btn btn-primary';
            addBtn.textContent = '+ Tambah Soal';
            addBtn.style.marginTop = '15px';
            addBtn.style.marginLeft = '10px';
            addBtn.addEventListener('click', function() {
                addQuestionsToLatihan(item.id);
            });
            container.appendChild(addBtn);
        }

        document.getElementById('submitQuizBtn')?.addEventListener('click', function() {
            let correctCount = 0;
            let total = item.questions.length;
            let allAnswered = true;

            item.questions.forEach((q, idx) => {
                const selected = document.querySelector(`input[name="q${idx}"]:checked`);
                if (selected) {
                    const value = parseInt(selected.value);
                    const isCorrect = value === q.answer;
                    if (isCorrect) correctCount++;
                    const options = document.querySelectorAll(`.quiz-question[data-qindex="${idx}"] .quiz-option`);
                    options.forEach((opt, oi) => {
                        opt.classList.remove('correct', 'wrong');
                        if (oi === q.answer) opt.classList.add('correct');
                        if (oi === value && !isCorrect) opt.classList.add('wrong');
                    });
                } else {
                    allAnswered = false;
                }
            });

            const resultDiv = document.getElementById('quizResult');
            resultDiv.style.display = 'block';
            if (!allAnswered) {
                resultDiv.textContent = '⚠️ Jawab semua soal terlebih dahulu!';
                resultDiv.className = 'quiz-result fail';
                return;
            }

            const percentage = Math.round((correctCount / total) * 100);
            if (percentage >= 70) {
                resultDiv.textContent = `✅ Selamat! Anda menjawab ${correctCount} dari ${total} soal benar (${percentage}%). Lulus!`;
                resultDiv.className = 'quiz-result pass';
            } else {
                resultDiv.textContent = `❌ Anda menjawab ${correctCount} dari ${total} soal benar (${percentage}%). Coba lagi!`;
                resultDiv.className = 'quiz-result fail';
            }
        });

    } else {
        let html = `<p style="color:rgba(255,255,255,0.3); padding:20px 0;">Belum ada soal untuk latihan ini.</p>`;
        if (isAdminMode) {
            html += `
                    <button class="btn btn-primary" id="addQuestionsBtn">+ Tambah Soal</button>
                `;
        }
        subContentContainer.innerHTML = html;
        document.getElementById('addQuestionsBtn')?.addEventListener('click', function() {
            addQuestionsToLatihan(item.id);
        });
    }

    subPageOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ============================================
// QUESTION EDITOR
// ============================================
window.openQuestionEditor = function(latihanId, qIndex) {
    const latihan = latihanList.find(l => l.id === latihanId);
    if (!latihan || !latihan.questions[qIndex]) return;
    const q = latihan.questions[qIndex];

    editingQuestionData = { latihanId, qIndex };
    document.getElementById('questionEditorTitle').textContent = '✏️ Edit Soal';

    editQuestionText.value = q.question || '';
    editQuestionImageUrl.value = q.image || '';
    tempOptions = [...(q.options || ['', ''])];
    renderOptions();

    if (q.image) {
        questionImagePreview.src = q.image;
        questionImagePreview.classList.add('show');
    } else {
        questionImagePreview.classList.remove('show');
        questionImagePreview.src = '';
    }

    correctAnswerSelect.value = q.answer || 0;

    questionEditorOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
};

function closeQuestionEditor() {
    questionEditorOverlay.classList.remove('active');
    document.body.style.overflow = '';
    editingQuestionData = null;
    tempOptions = ['', ''];
}

function renderOptions() {
    optionsContainer.innerHTML = '';
    tempOptions.forEach((opt, idx) => {
        const row = document.createElement('div');
        row.className = 'option-row';
        row.innerHTML = `
                <span class="opt-label">${String.fromCharCode(65 + idx)}.</span>
                <input type="text" value="${escapeHtml(opt)}" placeholder="Pilihan ${idx+1}" data-index="${idx}" onchange="updateOption(${idx}, this.value)">
                ${tempOptions.length > 2 ? `<span class="remove-opt" onclick="removeOption(${idx})">×</span>` : ''}
            `;
        optionsContainer.appendChild(row);
    });

    correctAnswerSelect.innerHTML = '';
    tempOptions.forEach((_, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = `Pilihan ${idx+1}`;
        correctAnswerSelect.appendChild(opt);
    });
    if (editingQuestionData) {
        const latihan = latihanList.find(l => l.id === editingQuestionData.latihanId);
        if (latihan && latihan.questions[editingQuestionData.qIndex]) {
            correctAnswerSelect.value = latihan.questions[editingQuestionData.qIndex].answer || 0;
        }
    }
}

window.updateOption = function(index, value) {
    tempOptions[index] = value;
};

window.addOption = function() {
    tempOptions.push('');
    renderOptions();
};

window.removeOption = function(index) {
    if (tempOptions.length <= 2) {
        alert('Minimal 2 pilihan!');
        return;
    }
    tempOptions.splice(index, 1);
    renderOptions();
};

// Question image upload
questionImageUploadArea.addEventListener('click', function(e) {
    if (e.target.closest('input') || e.target.closest('.image-preview')) return;
    questionImageFile.click();
});

questionImageFile.addEventListener('change', function(e) {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const dataUrl = event.target.result;
            questionImagePreview.src = dataUrl;
            questionImagePreview.classList.add('show');
            editQuestionImageUrl.value = dataUrl;
        };
        reader.readAsDataURL(file);
    }
});

editQuestionImageUrl.addEventListener('input', function() {
    const url = this.value.trim();
    if (url) {
        questionImagePreview.src = url;
        questionImagePreview.classList.add('show');
    } else {
        questionImagePreview.classList.remove('show');
        questionImagePreview.src = '';
    }
});

// Save question
document.getElementById('saveQuestionEdit').addEventListener('click', function() {
    if (!editingQuestionData) return;
    const { latihanId, qIndex } = editingQuestionData;
    const latihan = latihanList.find(l => l.id === latihanId);
    if (!latihan) return;

    const question = editQuestionText.value.trim();
    if (!question) {
        showAdminMessage('⚠️ Soal wajib diisi!', 'rgba(255,200,100,0.7)');
        return;
    }

    const options = tempOptions.filter(o => o.trim() !== '');
    if (options.length < 2) {
        showAdminMessage('⚠️ Minimal 2 pilihan!', 'rgba(255,200,100,0.7)');
        return;
    }

    const answer = parseInt(correctAnswerSelect.value);
    if (isNaN(answer) || answer < 0 || answer >= options.length) {
        showAdminMessage('⚠️ Jawaban benar tidak valid!', 'rgba(255,200,100,0.7)');
        return;
    }

    latihan.questions[qIndex] = {
        question: question,
        image: editQuestionImageUrl.value.trim() || '',
        options: options,
        answer: answer
    };

    saveAll();
    renderPublic();
    renderAdminList();
    closeQuestionEditor();
    closeSubPage();
    setTimeout(() => openLatihanPage(latihan), 300);
    showAdminMessage('✅ Soal berhasil diperbarui!', 'rgba(100,255,100,0.7)');
});

document.getElementById('cancelQuestionEdit').addEventListener('click', closeQuestionEditor);
document.getElementById('closeQuestionEditor').addEventListener('click', closeQuestionEditor);
questionEditorOverlay.addEventListener('click', function(e) {
    if (e.target === this) closeQuestionEditor();
});

// ============================================
// DELETE QUESTION
// ============================================
window.deleteQuestion = function(latihanId, qIndex) {
    if (!confirm('Hapus soal ini?')) return;
    const latihan = latihanList.find(l => l.id === latihanId);
    if (!latihan) return;
    latihan.questions.splice(qIndex, 1);
    saveAll();
    renderPublic();
    renderAdminList();
    closeSubPage();
    setTimeout(() => openLatihanPage(latihan), 300);
    showAdminMessage('🗑️ Soal dihapus.', 'rgba(255,150,150,0.7)');
};

// ============================================
// TAMBAH SOAL
// ============================================
function addQuestionsToLatihan(latihanId) {
    const latihan = latihanList.find(l => l.id === latihanId);
    if (!latihan) return;

    editingQuestionData = { latihanId, qIndex: latihan.questions.length };
    document.getElementById('questionEditorTitle').textContent = '➕ Tambah Soal Baru';

    editQuestionText.value = '';
    editQuestionImageUrl.value = '';
    tempOptions = ['', ''];
    renderOptions();
    questionImagePreview.classList.remove('show');
    questionImagePreview.src = '';
    correctAnswerSelect.value = 0;

    questionEditorOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ============================================
// EDITOR MATERI
// ============================================
function openMateriEditor(materiId) {
    const materi = materiList.find(m => m.id === materiId);
    if (!materi) return;

    editingMateriId = materiId;
    document.getElementById('editorTitle').textContent = '✏️ Edit Materi';
    editJudul.value = materi.judul || '';
    editDeskripsi.value = materi.deskripsi || '';
    editImageUrl.value = materi.image || '';
    tempSubItems = [...(materi.sub || [])];

    if (materi.image) {
        imagePreview.src = materi.image;
        imagePreview.classList.add('show');
    } else {
        imagePreview.classList.remove('show');
        imagePreview.src = '';
    }

    renderSubItems();
    editorOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMateriEditor() {
    editorOverlay.classList.remove('active');
    document.body.style.overflow = '';
    editingMateriId = null;
    tempSubItems = [];
}

function renderSubItems() {
    subItemsContainer.innerHTML = '';
    tempSubItems.forEach((item, index) => {
        const tag = document.createElement('span');
        tag.className = 'sub-item-tag';
        tag.innerHTML = `${escapeHtml(item)} <span class="remove" data-index="${index}">×</span>`;
        tag.querySelector('.remove').addEventListener('click', function(e) {
            e.stopPropagation();
            const idx = parseInt(this.dataset.index);
            tempSubItems.splice(idx, 1);
            renderSubItems();
        });
        subItemsContainer.appendChild(tag);
    });
}

function addSubItem() {
    const text = newSubInput.value.trim();
    if (text) {
        tempSubItems.push(text);
        newSubInput.value = '';
        renderSubItems();
    }
}

// Materi image upload
imageUploadArea.addEventListener('click', function(e) {
    if (e.target.closest('input') || e.target.closest('.image-preview')) return;
    imageFileInput.click();
});

imageFileInput.addEventListener('change', function(e) {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const dataUrl = event.target.result;
            imagePreview.src = dataUrl;
            imagePreview.classList.add('show');
            editImageUrl.value = dataUrl;
        };
        reader.readAsDataURL(file);
    }
});

editImageUrl.addEventListener('input', function() {
    const url = this.value.trim();
    if (url) {
        imagePreview.src = url;
        imagePreview.classList.add('show');
    } else {
        imagePreview.classList.remove('show');
        imagePreview.src = '';
    }
});

// Save materi
document.getElementById('saveMateriEdit').addEventListener('click', function() {
    if (!editingMateriId) return;
    const judul = editJudul.value.trim();
    if (!judul) {
        showAdminMessage('⚠️ Judul wajib diisi!', 'rgba(255,200,100,0.7)');
        return;
    }
    const materi = materiList.find(m => m.id === editingMateriId);
    if (materi) {
        materi.judul = judul;
        materi.deskripsi = editDeskripsi.value.trim() || 'Deskripsi';
        materi.image = editImageUrl.value.trim() || '';
        materi.sub = [...tempSubItems];
        saveAll();
        renderPublic();
        renderAdminList();
        closeMateriEditor();
        showAdminMessage('✅ Materi berhasil diperbarui!', 'rgba(100,255,100,0.7)');
    }
});

document.getElementById('cancelMateriEdit').addEventListener('click', closeMateriEditor);
document.getElementById('closeEditor').addEventListener('click', closeMateriEditor);
editorOverlay.addEventListener('click', function(e) {
    if (e.target === this) closeMateriEditor();
});

newSubInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addSubItem();
    }
});

document.getElementById('addSubBtn').addEventListener('click', addSubItem);

// ============================================
// CLOSE SUB
// ============================================
function closeSubPage() {
    subPageOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// RENDER ADMIN LIST
// ============================================
function renderAdminList() {
    if (!adminListContainer) return;
    const allItems = [
        ...materiList.map(m => ({ ...m, type: 'materi', icon: '📘' })),
        ...latihanList.map(l => ({ ...l, type: 'latihan', icon: '📝' }))
    ];

    if (allItems.length === 0) {
        adminListContainer.innerHTML =
            `<div style="color:rgba(255,255,255,0.3); padding:15px 0;">Belum ada konten.</div>`;
        return;
    }

    let html = '';
    allItems.forEach(item => {
        const subCount = item.type === 'materi' ? (item.sub ? item.sub.length : 0) : (item.questions ? item
            .questions.length : 0);
        html += `
                <div class="admin-item">
                    <span class="item-title">${item.icon} ${escapeHtml(item.judul)}</span>
                    <span class="item-desc">${escapeHtml(item.deskripsi)}</span>
                    <span class="item-type">${item.type} (${subCount})</span>
                    <div class="btn-group">
                        ${item.type === 'latihan' ? `<button class="btn btn-success" data-id="${item.id}" data-type="${item.type}" data-action="addquestion">+ Soal</button>` : ''}
                        <button class="btn btn-primary" data-id="${item.id}" data-type="${item.type}" data-action="edit">✎</button>
                        <button class="btn btn-danger" data-id="${item.id}" data-type="${item.type}" data-action="hapus">✕</button>
                    </div>
                </div>
            `;
    });
    adminListContainer.innerHTML = html;

    adminListContainer.querySelectorAll('[data-action="edit"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = this.dataset.id;
            const type = this.dataset.type;
            if (type === 'materi') {
                openMateriEditor(id);
            } else {
                const list = latihanList;
                const item = list.find(x => x.id === id);
                if (!item) return;
                const newJudul = prompt('Edit judul:', item.judul);
                if (newJudul !== null && newJudul.trim() !== '') {
                    const newDeskripsi = prompt('Edit deskripsi:', item.deskripsi);
                    if (newDeskripsi !== null) {
                        item.judul = newJudul.trim();
                        item.deskripsi = newDeskripsi.trim() || item.deskripsi;
                        saveAll();
                        renderPublic();
                        renderAdminList();
                        showAdminMessage('✅ Latihan berhasil diedit.', 'rgba(100,255,100,0.7)');
                    }
                }
            }
        });
    });

    adminListContainer.querySelectorAll('[data-action="addquestion"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = this.dataset.id;
            addQuestionsToLatihan(id);
        });
    });

    adminListContainer.querySelectorAll('[data-action="hapus"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = this.dataset.id;
            const type = this.dataset.type;
            if (confirm(`Hapus ${type} ini?`)) {
                if (type === 'materi') {
                    materiList = materiList.filter(m => m.id !== id);
                } else {
                    latihanList = latihanList.filter(l => l.id !== id);
                }
                saveAll();
                renderPublic();
                renderAdminList();
                showAdminMessage('🗑️ Konten dihapus.', 'rgba(255,150,150,0.7)');
            }
        });
    });
}

// ============================================
// UTILITY
// ============================================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showAdminMessage(msg, color = 'rgba(255,255,255,0.7)') {
    if (adminMessage) {
        adminMessage.textContent = msg;
        adminMessage.style.color = color;
        setTimeout(() => { adminMessage.textContent = ''; }, 3500);
    }
}

// ============================================
// ADMIN LOGIN
// ============================================
function loginAdmin(password) {
    if (password === 'akuganteng') {
        isAdminMode = true;
        loginMessage.textContent = '';
        adminLoginArea.style.display = 'none';
        adminContentArea.style.display = 'block';
        renderAdminList();
        adminDashboard.classList.add('active');
        adminDashboard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showAdminMessage('🔓 Mode admin aktif.', 'rgba(100,255,100,0.7)');
        return true;
    } else {
        loginMessage.textContent = '❌ Password salah.';
        loginMessage.style.color = 'rgba(255,150,150,0.8)';
        return false;
    }
}

function logoutAdmin() {
    isAdminMode = false;
    adminLoginArea.style.display = 'flex';
    adminContentArea.style.display = 'none';
    loginMessage.textContent = '';
    adminDashboard.classList.remove('active');
    document.getElementById('adminPassword').value = '';
    showAdminMessage('👋 Keluar dari mode admin.', 'rgba(255,255,255,0.4)');
    closeSubPage();
    closeMateriEditor();
    closeQuestionEditor();
}

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFromStorage();
    renderPublic();

    document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
        link.addEventListener('click', function() {
            const page = this.dataset.page;
            navigateTo(page);
        });
    });

    document.getElementById('adminToggle').addEventListener('click', function(e) {
        e.preventDefault();
        adminDashboard.classList.toggle('active');
        if (!adminDashboard.classList.contains('active')) {
            if (!isAdminMode) {
                adminLoginArea.style.display = 'flex';
                adminContentArea.style.display = 'none';
                loginMessage.textContent = '';
            }
        } else {
            if (isAdminMode) {
                adminLoginArea.style.display = 'none';
                adminContentArea.style.display = 'block';
                renderAdminList();
            } else {
                adminLoginArea.style.display = 'flex';
                adminContentArea.style.display = 'none';
            }
        }
    });

    document.getElementById('loginAdminBtn').addEventListener('click', function() {
        const pwd = document.getElementById('adminPassword').value;
        loginAdmin(pwd);
    });

    document.getElementById('adminPassword').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') document.getElementById('loginAdminBtn').click();
    });

    document.getElementById('logoutAdminBtn').addEventListener('click', function() {
        logoutAdmin();
        adminDashboard.classList.remove('active');
    });

    document.getElementById('saveHeaderBtn').addEventListener('click', function() {
        const siteTitle = document.getElementById('editSiteTitle').value.trim() || 'EduLearn';
        const heroTitle = document.getElementById('editHeroTitle').value.trim() || 'Mulai Belajar Sekarang';
        const heroSubtitle = document.getElementById('editHeroSubtitle').value.trim() ||
            'Platform pembelajaran modern dengan konten dinamis yang dapat dikelola oleh admin.';
        saveHeader({ siteTitle, heroTitle, heroSubtitle });
        showAdminMessage('✅ Header berhasil diperbarui!', 'rgba(100,255,100,0.7)');
        document.getElementById('editSiteTitle').value = '';
        document.getElementById('editHeroTitle').value = '';
        document.getElementById('editHeroSubtitle').value = '';
    });

    document.getElementById('tambahMateriBtn').addEventListener('click', function() {
        if (!isAdminMode) { showAdminMessage('⚠️ Login admin dulu.', 'rgba(255,200,100,0.7)'); return; }
        const judul = document.getElementById('newMateriJudul').value.trim();
        const deskripsi = document.getElementById('newMateriDeskripsi').value.trim();
        const image = document.getElementById('newMateriImage').value.trim();
        const subText = document.getElementById('newMateriSub').value.trim();
        if (!judul) { showAdminMessage('⚠️ Judul wajib diisi.', 'rgba(255,200,100,0.7)'); return; }
        const sub = subText ? subText.split(',').map(s => s.trim()).filter(s => s) : [];
        materiList.push({ id: 'm' + Date.now(), judul, deskripsi: deskripsi || 'Deskripsi', image: image || '',
            sub });
        document.getElementById('newMateriJudul').value = '';
        document.getElementById('newMateriDeskripsi').value = '';
        document.getElementById('newMateriImage').value = '';
        document.getElementById('newMateriSub').value = '';
        saveAll();
        renderPublic();
        renderAdminList();
        showAdminMessage('✅ Materi ditambahkan.', 'rgba(100,255,100,0.7)');
    });

    document.getElementById('tambahLatihanBtn').addEventListener('click', function() {
        if (!isAdminMode) { showAdminMessage('⚠️ Login admin dulu.', 'rgba(255,200,100,0.7)'); return; }
        const judul = document.getElementById('newLatihanJudul').value.trim();
        const deskripsi = document.getElementById('newLatihanDeskripsi').value.trim();
        if (!judul) { showAdminMessage('⚠️ Judul wajib diisi.', 'rgba(255,200,100,0.7)'); return; }
        latihanList.push({ id: 'l' + Date.now(), judul, deskripsi: deskripsi || 'Deskripsi', questions: [] });
        document.getElementById('newLatihanJudul').value = '';
        document.getElementById('newLatihanDeskripsi').value = '';
        saveAll();
        renderPublic();
        renderAdminList();
        showAdminMessage('✅ Latihan ditambahkan. Klik latihan untuk tambah soal.', 'rgba(100,255,100,0.7)');
    });

    document.getElementById('closeSubPage').addEventListener('click', closeSubPage);
    subPageOverlay.addEventListener('click', function(e) {
        if (e.target === this) closeSubPage();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSubPage();
            closeMateriEditor();
            closeQuestionEditor();
        }
    });

    navigateTo('beranda');
});

// ============================================
// EXPOSE FUNCTIONS GLOBAL
// ============================================
window.openQuestionEditor = openQuestionEditor;
window.deleteQuestion = deleteQuestion;
window.updateOption = updateOption;
window.addOption = addOption;
window.removeOption = removeOption;
window.addSubItem = addSubItem;