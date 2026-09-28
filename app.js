import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  deleteDoc, 
  updateDoc,
  doc,
  setDoc,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ==========================================
// 1. KONFIGURASI FIREBASE & IMGBB
// ==========================================

const IMGBB_API_KEY = "a4effc02ebeca624eb55b122f22c8a25";

const firebaseConfig = {
  apiKey: "AIzaSyBJETCKPOLwFnVp8Q8Zev6tL_MJAsxAAJc",
  authDomain: "kelas6b-bfc03.firebaseapp.com",
  databaseURL: "https://kelas6b-bfc03-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kelas6b-bfc03",
  storageBucket: "kelas6b-bfc03.firebasestorage.app",
  messagingSenderId: "632145539568",
  appId: "1:632145539568:web:8a4b76f0dd5314cb97ed35"
};

const ADMIN_EMAILS = ["thisisart655@gmail.com"];

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

let editMateriId = null;
let materiDataCache = {};

let currentQuizId = null;
let currentQuestionsData = [];
let questionCounter = 0;

function isCurrentUserAdmin() {
  const user = auth.currentUser;
  if (!user || !user.email) return false;
  return ADMIN_EMAILS.map(e => e.toLowerCase().trim()).includes(user.email.toLowerCase().trim());
}

// ==========================================
// 2. UPLOAD GAMBAR KE IMGBB
// ==========================================

async function uploadFileToImgBB(file) {
  if (!IMGBB_API_KEY) throw new Error("API Key ImgBB belum dimasukkan!");
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  if (data.success) return data.data.url;
  else throw new Error("Gagal mengunggah gambar: " + (data.error ? data.error.message : "Error tidak diketahui"));
}

// ==========================================
// 3. BACKGROUND DINAMIS
// ==========================================

window.saveBackground = async () => {
  if (!isCurrentUserAdmin()) return alert("Akses Ditolak! Hanya Admin yang dapat mengubah background.");

  const bgType = document.getElementById('bg-type').value;
  const colorInput = document.getElementById('bg-color-val').value;
  const urlInput = document.getElementById('bg-url-val').value;
  const fileInput = document.getElementById('bg-file-val');

  let finalBgValue = "";

  try {
    if (bgType === 'color') {
      finalBgValue = colorInput;
    } else if (bgType === 'url' && urlInput) {
      finalBgValue = `url('${urlInput}')`;
    } else if (bgType === 'file' && fileInput.files.length > 0) {
      alert("Mengunggah latar belakang... Mohon tunggu ⏳");
      const uploadedUrl = await uploadFileToImgBB(fileInput.files[0]);
      finalBgValue = `url('${uploadedUrl}')`;
    } else {
      return alert("Harap masukkan atau pilih latar belakang yang valid!");
    }

    await setDoc(doc(db, "settings", "background"), {
      type: bgType,
      value: finalBgValue,
      updatedAt: new Date()
    });

    alert("Latar belakang web berhasil diperbarui!");
    applyBackground(finalBgValue, bgType);
    toggleAdminForm('bg');
  } catch (e) {
    alert("Gagal mengubah background: " + e.message);
  }
};

async function loadBackground() {
  try {
    const docSnap = await getDoc(doc(db, "settings", "background"));
    if (docSnap.exists()) {
      const data = docSnap.data();
      applyBackground(data.value, data.type);
    }
  } catch (err) {
    console.error("Gagal memuat background:", err);
  }
}

function applyBackground(value, type) {
  if (type === 'color') {
    document.body.style.background = value;
  } else {
    document.body.style.background = `${value} center center / cover no-repeat fixed`;
  }
}

window.handleBgTypeChange = () => {
  const type = document.getElementById('bg-type').value;
  document.getElementById('input-bg-color').style.display = type === 'color' ? 'block' : 'none';
  document.getElementById('input-bg-url').style.display = type === 'url' ? 'block' : 'none';
  document.getElementById('input-bg-file').style.display = type === 'file' ? 'block' : 'none';
};

// ==========================================
// 4. AUTHENTICATION & SWITCH VIEW
// ==========================================

window.loginGoogle = async () => {
  try { 
    await signInWithPopup(auth, provider); 
  } catch (error) { 
    alert("Gagal Login: " + error.message); 
  }
};

window.logout = () => {
  signOut(auth).then(() => {
    alert("Berhasil Keluar!");
    window.location.reload();
  });
};

onAuthStateChanged(auth, (user) => {
  const authScreen = document.getElementById("auth-screen");
  const appContent = document.getElementById("app-content");
  const profileContainer = document.getElementById("userProfile");

  if (user) {
    if (authScreen) authScreen.classList.add("hidden");
    if (appContent) appContent.classList.remove("hidden");

    const isAdmin = isCurrentUserAdmin();

    if (isAdmin) document.body.classList.add("is-admin");
    else document.body.classList.remove("is-admin");

    if (profileContainer) {
      profileContainer.innerHTML = `
        <div class="user-profile-pill">
          <img src="${user.photoURL || 'https://via.placeholder.com/32'}" alt="User Profile">
          <span>
            ${user.displayName ? user.displayName.split(" ")[0] : 'Siswa'} 
            ${isAdmin ? '<b style="color: #ef4444;">(Admin)</b>' : ''}
          </span>
          <button onclick="logout()" class="btn-danger" style="padding: 4px 10px; font-size: 0.75rem;">Keluar</button>
        </div>
      `;
    }

    loadMateri();
    loadQuizList();

    if (isAdmin && questionCounter === 0) {
      addQuestionFormBlock();
    }
  } else {
    document.body.classList.remove("is-admin");
    if (authScreen) authScreen.classList.remove("hidden");
    if (appContent) appContent.classList.add("hidden");
  }
});

// ==========================================
// 5. NAVIGASI HALAMAN
// ==========================================

window.switchPage = (pageName, event) => {
  if (event) event.preventDefault();

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(nav => nav.classList.remove('active'));

  const targetPage = document.getElementById(`page-${pageName}`);
  if (targetPage) targetPage.classList.add('active');

  const activeNav = document.querySelector(`.nav-links a[data-page="${pageName}"]`);
  if (activeNav) activeNav.classList.add('active');

  if (pageName === 'materi') loadMateri();
  if (pageName === 'kuis') loadQuizList();

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.toggleAdminForm = (type) => {
  if (!isCurrentUserAdmin()) return alert("Fitur ini khusus untuk Admin!");
  const container = document.getElementById(`form-${type}-container`);
  if (container) container.classList.toggle('hidden');
};

window.resetFormMateri = () => {
  editMateriId = null;
  const titleElem = document.getElementById('form-materi-title');
  if (titleElem) titleElem.innerText = "Tambah Materi Baru";
  document.getElementById('materi-mapel').value = "Bahasa Indonesia";
  document.getElementById('materi-title').value = '';
  document.getElementById('materi-img').value = '';
  if (document.getElementById('materi-file')) document.getElementById('materi-file').value = '';
  document.getElementById('materi-desc').value = '';
};

// ==========================================
// 6. MANAJEMEN MATERI (KHUSUS ADMIN & SISWA)
// ==========================================

window.saveMateri = async () => {
  if (!isCurrentUserAdmin()) return alert("Akses Ditolak! Hanya Admin yang dapat menyimpan materi.");

  const mapel = document.getElementById('materi-mapel').value;
  const title = document.getElementById('materi-title').value;
  const imgInput = document.getElementById('materi-img').value;
  const fileInput = document.getElementById('materi-file');
  const desc = document.getElementById('materi-desc').value;

  if (!title || !desc) return alert("Harap isi Judul dan Deskripsi Materi!");

  let images = [];
  try {
    if (fileInput && fileInput.files.length > 0) {
      alert("Mengunggah gambar... Mohon tunggu ⏳");
      for (let i = 0; i < fileInput.files.length; i++) {
        const uploadedUrl = await uploadFileToImgBB(fileInput.files[i]);
        images.push(uploadedUrl);
      }
    } else if (imgInput) {
      images = imgInput.split(',').map(url => url.trim()).filter(u => u.length > 0);
    }

    if (images.length === 0 && editMateriId && materiDataCache[editMateriId]) {
      images = materiDataCache[editMateriId].images || [];
    }

    if (images.length === 0) {
      images = ["https://img.freepik.com/free-vector/cute-animals-holding-numbers-banner_1308-43306.jpg"];
    }

    const payload = { mapel, title, images, desc, updatedAt: new Date() };

    if (editMateriId) {
      await updateDoc(doc(db, "materi", editMateriId), payload);
      alert("Materi berhasil diperbarui!");
    } else {
      payload.createdAt = new Date();
      await addDoc(collection(db, "materi"), payload);
      alert("Materi baru berhasil disimpan!");
    }

    resetFormMateri();
    toggleAdminForm('materi');
    loadMateri();
  } catch (e) {
    alert("Gagal menyimpan materi: " + e.message);
  }
};

window.editMateri = (id) => {
  if (!isCurrentUserAdmin()) return alert("Fitur edit materi hanya untuk Admin!");
  const data = materiDataCache[id];
  if (!data) return;

  editMateriId = id;
  const titleElem = document.getElementById('form-materi-title');
  if (titleElem) titleElem.innerText = "Edit Materi Pembelajaran";
  
  document.getElementById('materi-mapel').value = data.mapel || "Bahasa Indonesia";
  document.getElementById('materi-title').value = data.title || "";
  document.getElementById('materi-img').value = (data.images || []).join(', ');
  document.getElementById('materi-desc').value = data.desc || "";

  const container = document.getElementById('form-materi-container');
  if (container.classList.contains('hidden')) {
    container.classList.remove('hidden');
  }

  window.scrollTo({ top: container.offsetTop - 80, behavior: 'smooth' });
};

window.loadMateri = async () => {
  const listContainer = document.getElementById("materi-list");
  const filterMapel = document.getElementById("filter-mapel-materi").value;
  if (!listContainer) return;

  try {
    listContainer.innerHTML = "<p style='text-align:center; grid-column:1/-1;'>Memuat materi... ⏳</p>";
    
    const querySnapshot = await getDocs(collection(db, "materi"));
    listContainer.innerHTML = "";
    materiDataCache = {};

    let filteredDocs = [];
    querySnapshot.forEach(docSnap => {
      const data = docSnap.data();
      materiDataCache[docSnap.id] = data;
      if (filterMapel === "semua" || data.mapel === filterMapel) {
        filteredDocs.push({ id: docSnap.id, ...data });
      }
    });

    if (filteredDocs.length === 0) {
      listContainer.innerHTML = "<p style='text-align:center; grid-column: 1/-1;'>Belum ada materi untuk mata pelajaran ini.</p>";
      return;
    }

    const isAdmin = isCurrentUserAdmin();

    filteredDocs.forEach((data) => {
      const id = data.id;
      const imgList = data.images && data.images.length > 0 ? data.images : ["https://img.freepik.com/free-vector/cute-animals-holding-numbers-banner_1308-43306.jpg"];
      const dataString = JSON.stringify({ title: data.title, desc: data.desc, images: imgList }).replace(/"/g, '&quot;');

      listContainer.innerHTML += `
        <div class="card glass">
          <div class="image-slider-container">
            ${imgList.length > 1 ? `<button class="slide-btn left" onclick="scrollSlider('${id}', -1)">❮</button>` : ''}
            <div class="image-slider" id="slider-${id}">
              ${imgList.map(url => `<img src="${url}" alt="${data.title}" onclick="openMateriModal('${dataString}')" style="cursor:pointer;">`).join('')}
            </div>
            ${imgList.length > 1 ? `<button class="slide-btn right" onclick="scrollSlider('${id}', 1)">❯</button>` : ''}
          </div>

          <div class="card-body">
            <span class="badge-mapel">${data.mapel || 'Umum'}</span>
            <h3 style="margin-top: 8px;">${data.title}</h3>
            <p style="font-size:0.9rem; color:#64748b; margin-top:4px;">${data.desc.substring(0, 80)}...</p>
            <div class="card-footer" style="display:flex; justify-content:space-between; align-items:center; margin-top:15px;">
              <button class="btn-primary" onclick="openMateriModal('${dataString}')" style="padding:6px 12px; font-size:0.85rem;">📖 Buka Materi</button>
              
              ${isAdmin ? `
                <div class="admin-actions" style="display:flex; gap:5px;">
                  <button onclick="editMateri('${id}')" style="background:#f39c12; color:white; border:none; padding:6px 10px; border-radius:5px; cursor:pointer;" title="Edit Materi">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button onclick="deleteData('materi', '${id}')" style="background:#e74c3c; color:white; border:none; padding:6px 10px; border-radius:5px; cursor:pointer;" title="Hapus Materi">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    });
  } catch (err) {
    console.error("Error load materi:", err);
    listContainer.innerHTML = "<p style='text-align:center; color:red; grid-column:1/-1;'>Gagal memuat materi.</p>";
  }
};

window.scrollSlider = (id, direction) => {
  const container = document.getElementById(`slider-${id}`);
  if (container) container.scrollBy({ left: direction * 280, behavior: 'smooth' });
};

window.openMateriModal = (jsonString) => {
  const data = JSON.parse(jsonString);
  document.getElementById('modal-title').innerText = data.title;
  document.getElementById('modal-desc').innerText = data.desc;

  const modalCarousel = document.getElementById('modal-carousel');
  modalCarousel.innerHTML = `
    <div class="image-slider-container">
      ${data.images.length > 1 ? `<button class="slide-btn left" onclick="scrollSlider('modal', -1)">❮</button>` : ''}
      <div class="image-slider" id="slider-modal">
        ${data.images.map(url => `<img src="${url}" style="width:100%; max-height:380px; object-fit:contain;">`).join('')}
      </div>
      ${data.images.length > 1 ? `<button class="slide-btn right" onclick="scrollSlider('modal', 1)">❯</button>` : ''}
    </div>
  `;
  document.getElementById('materi-modal').classList.remove('hidden');
};

window.closeMateriModal = () => {
  document.getElementById('materi-modal').classList.add('hidden');
};

// ==========================================
// 7. MANAJEMEN KUIS PILIHAN GANDA (FIRESTORE)
// ==========================================

const questionsContainer = document.getElementById("questionsContainer");
const addQuestionBtn = document.getElementById("addQuestionBtn");
const saveQuizBtn = document.getElementById("saveQuizBtn");

function addQuestionFormBlock() {
  if (!questionsContainer) return;
  questionCounter++;
  const qDiv = document.createElement("div");
  qDiv.className = "question-block";
  qDiv.id = `qBlock_${questionCounter}`;
  qDiv.innerHTML = `
    <label style="margin-top: 10px;"><b>Soal ${questionCounter}</b></label>
    <input type="text" class="q-text" placeholder="Masukkan pertanyaan..." required>
    
    <label style="font-size: 0.8rem; margin-top: 0.5rem; display:block;">Pilihan Jawaban:</label>
    <input type="text" class="opt-0" placeholder="Pilihan A" required>
    <input type="text" class="opt-1" placeholder="Pilihan B" required>
    <input type="text" class="opt-2" placeholder="Pilihan C" required>
    <input type="text" class="opt-3" placeholder="Pilihan D" required>

    <label style="font-size: 0.8rem; display:block; margin-top:0.3rem;">Kunci Jawaban Benar:</label>
    <select class="correct-opt input-select" style="width: 100%; margin-bottom: 0.5rem;">
      <option value="0">A</option>
      <option value="1">B</option>
      <option value="2">C</option>
      <option value="3">D</option>
    </select>
  `;
  questionsContainer.appendChild(qDiv);
}

if (addQuestionBtn) {
  addQuestionBtn.addEventListener("click", addQuestionFormBlock);
}

if (saveQuizBtn) {
  saveQuizBtn.addEventListener("click", async () => {
    if (!isCurrentUserAdmin()) return alert("Akses Ditolak!");

    const title = document.getElementById("quizTitleInput").value.trim();
    if (!title) return alert("Harap isi judul kuis!");

    const qBlocks = document.querySelectorAll(".question-block");
    if (qBlocks.length === 0) return alert("Harap tambahkan minimal 1 soal!");

    const questions = [];
    qBlocks.forEach(block => {
      const qText = block.querySelector(".q-text").value.trim();
      const opt0 = block.querySelector(".opt-0").value.trim();
      const opt1 = block.querySelector(".opt-1").value.trim();
      const opt2 = block.querySelector(".opt-2").value.trim();
      const opt3 = block.querySelector(".opt-3").value.trim();
      const correct = parseInt(block.querySelector(".correct-opt").value);

      if (qText && opt0 && opt1 && opt2 && opt3) {
        questions.push({
          questionText: qText,
          options: [opt0, opt1, opt2, opt3],
          correctAnswer: correct
        });
      }
    });

    if (questions.length === 0) return alert("Harap lengkapi isi soal dan semua pilihan!");

    try {
      await addDoc(collection(db, "quizzes"), {
        title: title,
        questions: questions,
        createdAt: serverTimestamp()
      });
      alert("Kuis berhasil disimpan dan diterbitkan!");
      document.getElementById("quizTitleInput").value = "";
      questionsContainer.innerHTML = "";
      questionCounter = 0;
      addQuestionFormBlock();
      loadQuizList();
    } catch (err) {
      alert("Gagal menyimpan kuis: " + err.message);
    }
  });
}

async function loadQuizList() {
  const quizListDiv = document.getElementById("quizList");
  const selectQuizReport = document.getElementById("selectQuizReport");
  if (!quizListDiv) return;

  try {
    const snap = await getDocs(collection(db, "quizzes"));
    quizListDiv.innerHTML = "";
    if (selectQuizReport) selectQuizReport.innerHTML = `<option value="">-- Pilih Kuis --</option>`;

    if (snap.empty) {
      quizListDiv.innerHTML = "<p>Belum ada kuis yang tersedia.</p>";
      return;
    }

    snap.forEach(docSnap => {
      const data = docSnap.data();
      const qId = docSnap.id;

      const item = document.createElement("div");
      item.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 0.8rem 0; border-bottom: 1px solid var(--border);";
      item.innerHTML = `
        <div>
          <strong>${data.title}</strong>
          <div style="font-size: 0.8rem; color: #64748b;">${data.questions ? data.questions.length : 0} Soal Pilihan Ganda</div>
        </div>
        <button class="btn-primary" onclick="startQuiz('${qId}')">Kerjakan Kuis</button>
      `;
      quizListDiv.appendChild(item);

      if (selectQuizReport) {
        const opt = document.createElement("option");
        opt.value = qId;
        opt.textContent = data.title;
        selectQuizReport.appendChild(opt);
      }
    });
  } catch (err) {
    quizListDiv.innerHTML = "<p style='color:red;'>Gagal memuat daftar kuis.</p>";
  }
}

window.startQuiz = async (quizId) => {
  try {
    const docRef = doc(db, "quizzes", quizId);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return alert("Kuis tidak ditemukan!");

    const quiz = snap.data();
    currentQuizId = quizId;
    currentQuestionsData = quiz.questions || [];

    document.getElementById("activeQuizTitle").innerText = quiz.title;
    const activeQuestionsContainer = document.getElementById("activeQuestionsContainer");
    activeQuestionsContainer.innerHTML = "";

    currentQuestionsData.forEach((q, idx) => {
      const qBlock = document.createElement("div");
      qBlock.className = "question-block";
      qBlock.style.cssText = "margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px dashed #cbd5e1;";
      qBlock.innerHTML = `
        <p style="font-weight: 700; margin-bottom: 0.8rem; font-size: 1.05rem;">${idx + 1}. ${q.questionText}</p>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${q.options.map((opt, optIdx) => `
            <label class="option-label">
              <input type="radio" name="q_${idx}" value="${optIdx}" required>
              <span><b>${String.fromCharCode(65 + optIdx)}.</b>${opt}</span>
            </label>
          `).join('')}
        </div>
      `;
      activeQuestionsContainer.appendChild(qBlock);
    });

    document.getElementById("quizListPanel").classList.add("hidden");
    document.getElementById("quizTakingPanel").classList.remove("hidden");
  } catch (err) {
    alert("Gagal memuat kuis: " + err.message);
  }
};

const quizForm = document.getElementById("quizForm");
if (quizForm) {
  quizForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return alert("Silakan login terlebih dahulu!");

    let correctCount = 0;
    currentQuestionsData.forEach((q, idx) => {
      const selected = document.querySelector(`input[name="q_${idx}"]:checked`);
      if (selected && parseInt(selected.value) === q.correctAnswer) {
        correctCount++;
      }
    });

    const total = currentQuestionsData.length;
    const finalScore = Math.round((correctCount / total) * 100);

    try {
      await addDoc(collection(db, "quiz_results"), {
        quizId: currentQuizId,
        quizTitle: document.getElementById("activeQuizTitle").innerText,
        studentEmail: user.email,
        studentName: user.displayName || "Siswa",
        score: finalScore,
        correctCount: correctCount,
        totalQuestions: total,
        completedAt: serverTimestamp()
      });

      document.getElementById("scoreDisplay").innerText = `Nilai: ${finalScore}`;
      document.getElementById("scoreDetailMessage").innerText = `Anda menjawab benar ${correctCount} dari ${total} soal.`;
      
      document.getElementById("quizTakingPanel").classList.add("hidden");
      document.getElementById("quizResultPanel").classList.remove("hidden");
    } catch (err) {
      alert("Gagal menyimpan hasil kuis: " + err.message);
    }
  });
}

const backToQuizListBtn = document.getElementById("backToQuizListBtn");
if (backToQuizListBtn) {
  backToQuizListBtn.addEventListener("click", () => {
    document.getElementById("quizResultPanel").classList.add("hidden");
    document.getElementById("quizListPanel").classList.remove("hidden");
    loadQuizList();
  });
}

// ==========================================
// 8. REKAPITULASI NILAI UNTUK GURU
// ==========================================

const selectQuizReport = document.getElementById("selectQuizReport");
if (selectQuizReport) {
  selectQuizReport.addEventListener("change", async (e) => {
    const quizId = e.target.value;
    const tbody = document.getElementById("reportTableBody");
    if (!tbody) return;

    if (!quizId) {
      tbody.innerHTML = `<tr><td colspan="4" style="padding: 1rem; color: #94a3b8; text-align: center;">Silakan pilih kuis terlebih dahulu.</td></tr>`;
      return;
    }

    try {
      tbody.innerHTML = `<tr><td colspan="4" style="padding: 1rem; text-align: center;">Memuat rekapitulasi nilai... ⏳</td></tr>`;
      const q = query(collection(db, "quiz_results"), where("quizId", "==", quizId));
      const snap = await getDocs(q);

      tbody.innerHTML = "";
      if (snap.empty) {
        tbody.innerHTML = `<tr><td colspan="4" style="padding: 1rem; text-align: center;">Belum ada siswa yang mengerjakan kuis ini.</td></tr>`;
        return;
      }

      snap.forEach(docSnap => {
        const res = docSnap.data();
        const dateStr = res.completedAt ? new Date(res.completedAt.toDate()).toLocaleString("id-ID") : "-";
        const tr = document.createElement("tr");
        tr.style.borderBottom = "1px solid #e2e8f0";
        tr.innerHTML = `
          <td style="padding: 0.85rem;"><strong>${res.studentName}</strong><br><small style="color:#64748b;">${res.studentEmail}</small></td>
          <td style="padding: 0.85rem;">${res.correctCount} / ${res.totalQuestions}</td>
          <td style="padding: 0.85rem; font-weight: bold; color: ${res.score >= 70 ? '#10b981' : '#ef4444'};">${res.score}</td>
          <td style="padding: 0.85rem; font-size: 0.85rem; color: #64748b;">${dateStr}</td>
        `;
        tbody.appendChild(tr);
      });
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="4" style="padding: 1rem; color: red; text-align: center;">Gagal memuat data rekapitulasi.</td></tr>`;
    }
  });
}

// ==========================================
// 9. HAPUS DATA (KHUSUS ADMIN)
// ==========================================

window.deleteData = async (colName, id) => {
  if (!isCurrentUserAdmin()) return alert("Akses Ditolak! Hanya Admin yang dapat menghapus data.");

  if (confirm("Yakin ingin menghapus data ini?")) {
    try {
      await deleteDoc(doc(db, colName, id));
      alert("Data berhasil dihapus!");
      if (colName === 'materi') loadMateri();
      else loadQuizList();
    } catch (e) {
      alert("Gagal menghapus data: " + e.message);
    }
  }
};

// Auto Load awal saat web dibuka
loadBackground();