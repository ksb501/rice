// 글로벌 HTML 파일 다운로드 헬퍼 (단일 파일 평생 소장 및 오프라인 보관 지원)
if (!window.downloadHtmlFile) {
    window.downloadHtmlFile = function(filename, htmlContent) {
        try {
            const blob = new Blob(['\uFEFF' + htmlContent], { type: 'text/html;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 1500);
            return true;
        } catch (err) {
            console.error('HTML 파일 다운로드 실패:', err);
            return false;
        }
    };
}

// 메인 애플리케이션 제어기 (타임어택, 7대 도구 연동, 기록 관리)
class RiceGameApp {
    constructor() {
        this.startTime = null;
        this.timerInterval = null;
        this.elapsedSeconds = 0;
        this.timeBonusSeconds = 0;
        this.combo = 0;

        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.bindEvents();
            this.loadRecords();
            if (window.encycloUI) window.encycloUI.renderEncyclopedia();
            this.prepareGame();

            const queryStr = window.location.search || (window.location.hash ? window.location.hash.substring(1) : '');
            const params = new URLSearchParams(queryStr);
            const modalId = params.get('modal');
            const awardParam = params.get('award');
            const quizFormParam = params.get('quizForm');
            const autostartParam = params.get('autostart');
            if (awardParam && window.encycloUI) {
                this.closeModal('gameStartModal');
                this.openModal('quizModal');
                window.encycloUI.generateAward();
            } else if (quizFormParam && window.encycloUI) {
                this.closeModal('gameStartModal');
                this.openModal('quizModal');
                window.encycloUI.quizScore = 5;
                window.encycloUI.currentQuizIndex = 5;
                window.encycloUI.renderQuiz();
            }

            // 전자칠판 모드 초기화 (저장된 모드 또는 URL 파라미터 확인)
            const modeParam = params.get('mode');
            const savedMode = localStorage.getItem('rice_screen_mode');
            if (modeParam === 'smartboard' || savedMode === 'smartboard') {
                this.setSmartboardMode(true, false);
            }

            const stageParam = params.get('stage');
            if (stageParam && window.storyMode) {
                this.closeModal('gameStartModal');
                window.storyMode.currentStage = parseInt(stageParam, 10);
                window.storyMode.renderStage();
            } else if (modalId === 'certModal') {
                this.closeModal('gameStartModal');
                this.elapsedSeconds = 52;
                this.finishGame();
            } else if (modalId) {
                this.closeModal('gameStartModal');
                this.openModal(modalId);
            } else if (autostartParam === 'true') {
                this.startGame();
            }
        });
    }

    bindEvents() {
        const startAudioOnGesture = () => {
            if (window.soundFx) {
                window.soundFx.ensureContext();
                if (window.soundFx.bgmEnabled && !window.soundFx.bgmPlaying) {
                    window.soundFx.startBGM();
                }
            }
        };

        document.addEventListener('click', startAudioOnGesture, { once: true });
        document.addEventListener('touchstart', startAudioOnGesture, { once: true });

        // 가을 자연 배경음 토글 버튼
        const bgmBtn = document.getElementById('btnBgmToggle');
        if (bgmBtn) {
            bgmBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.soundFx) {
                    window.soundFx.toggleBGM();
                }
            });
        }

        const soundBtn = document.getElementById('btnSoundToggle');
        if (soundBtn) {
            soundBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const muted = window.soundFx.toggleMute();
                soundBtn.innerText = muted ? '🔇 효과음 켜기' : '🔊 효과음';
            });
        }

        // 전체화면 변경 감지
        document.addEventListener('fullscreenchange', () => {
            const fsBtn = document.getElementById('btnFullscreenToggle');
            if (fsBtn) {
                const isFs = !!document.fullscreenElement;
                fsBtn.innerText = isFs ? '✖ 화면축소' : '⛶ 전체화면';
                if (isFs) fsBtn.classList.add('active');
                else fsBtn.classList.remove('active');
            }
        });

        // 교실 전자칠판 모드 시 터치/클릭 링 시각 피드백
        window.addEventListener('pointerdown', (e) => {
            if (!document.body.classList.contains('smartboard-mode')) return;
            this.createTouchRipple(e.clientX, e.clientY);
        }, { passive: true });
    }

    toggleSmartboardMode() {
        const isNowActive = !document.body.classList.contains('smartboard-mode');
        this.setSmartboardMode(isNowActive, true);
    }

    setSmartboardMode(enable, showFeedback = true) {
        const btn = document.getElementById('btnSmartboardToggle');
        if (enable) {
            document.body.classList.add('smartboard-mode');
            localStorage.setItem('rice_screen_mode', 'smartboard');
            if (btn) {
                btn.innerText = '🖥️ 전자칠판 ON';
                btn.classList.add('active');
            }
            if (showFeedback) {
                if (window.soundFx) window.soundFx.playSuccess();
                this.showToast('🖥️ 교실 전자칠판 모드 켜짐! (대형 터치버튼 · 큰 글씨 · 터치 링)');
            }
        } else {
            document.body.classList.remove('smartboard-mode');
            localStorage.setItem('rice_screen_mode', 'standard');
            if (btn) {
                btn.innerText = '🖥️ 전자칠판 모드';
                btn.classList.remove('active');
            }
            if (showFeedback) {
                if (window.soundFx) window.soundFx.playTap();
                this.showToast('💻 일반 PC/노트북 모드로 전환되었습니다.');
            }
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(() => {});
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            }
        }
    }

    createTouchRipple(x, y) {
        const ring = document.createElement('div');
        ring.className = 'smartboard-touch-ring';
        ring.style.left = `${x}px`;
        ring.style.top = `${y}px`;
        document.body.appendChild(ring);
        setTimeout(() => {
            if (ring.parentNode) ring.parentNode.removeChild(ring);
        }, 550);
    }

    showToast(message) {
        let toast = document.getElementById('gameToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'gameToast';
            document.body.appendChild(toast);
        }
        toast.innerText = message;
        toast.className = 'game-toast show';
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
            toast.className = 'game-toast';
        }, 2800);
    }

    prepareGame() {
        this.isGameStarted = false;
        this.elapsedSeconds = 0;
        this.timeBonusSeconds = 0;
        this.combo = 0;

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.updateTimerDisplay();

        // 1단계 스토리모드 초기 씬 준비
        if (window.storyMode) {
            window.storyMode.currentStage = 1;
            window.storyMode.stageProgress = 0;
            window.storyMode.totalRipeningPct = 0;
            window.storyMode.start();
        }

        // 도전자 프로필 표시 갱신
        this.updateProfileUI();

        // 게임 시작 모달 보이기
        const startModal = document.getElementById('gameStartModal');
        if (startModal) {
            startModal.style.display = 'flex';
        }
    }

    startGame() {
        if (this.isGameStarted) return;
        this.isGameStarted = true;

        // 시작 모달 닫기
        const startModal = document.getElementById('gameStartModal');
        if (startModal) {
            startModal.style.display = 'none';
        }

        // 사운드 및 가을 BGM 개시 (사용자 직접 클릭 제스처로 자동재생 완벽 통과)
        if (window.soundFx) {
            window.soundFx.ensureContext();
            window.soundFx.playSuccess();
            if (window.soundFx.bgmEnabled && !window.soundFx.bgmPlaying) {
                window.soundFx.startBGM();
            }
        }

        // 타이머 시작 (00:00부터 정밀 측정)
        this.startTime = Date.now();
        this.elapsedSeconds = 0;
        this.timeBonusSeconds = 0;
        this.combo = 0;

        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
            this.updateTimerDisplay();
        }, 1000);

        this.updateTimerDisplay();
        this.showToast('⏱️ 벼 키우기 시작! 시간이 측정됩니다!');
    }

    updateTimerDisplay() {
        const timerEl = document.getElementById('gameTimer');
        if (!timerEl) return;
        if (!this.isGameStarted) {
            timerEl.innerText = '⏱️ 00:00 (대기)';
            timerEl.classList.add('is-waiting');
            return;
        }
        timerEl.classList.remove('is-waiting');
        const effectiveSec = Math.max(0, this.elapsedSeconds - this.timeBonusSeconds);
        const mins = String(Math.floor(effectiveSec / 60)).padStart(2, '0');
        const secs = String(effectiveSec % 60).padStart(2, '0');
        timerEl.innerText = `⏱️ ${mins}:${secs}`;
    }

    handleWishAction(toolType) {
        // 게임이 시작되지 않은 상태에서 도구 클릭 시 즉시 타이머 작동 및 시작
        if (!this.isGameStarted) {
            this.startGame();
        }
        window.storyMode.applyToolAction(toolType);
    }

    openProfileEditFromStart() {
        this.openModal('recordModal');
        const form = document.getElementById('profileEditForm');
        if (form) form.style.display = 'block';
    }

    getUserProfile() {
        try {
            const saved = JSON.parse(localStorage.getItem('rice_user_profile') || 'null');
            if (saved && saved.name) return saved;
        } catch (e) {}
        return {
            school: '햇살초등학교',
            grade: '3학년 1반',
            name: '김벼리'
        };
    }

    saveUserProfile(profile) {
        try {
            localStorage.setItem('rice_user_profile', JSON.stringify(profile));
        } catch (e) {}
        this.updateProfileUI();
    }

    updateProfileUI() {
        const p = this.getUserProfile();
        const tag = document.getElementById('currentProfileTag');
        if (tag) tag.innerText = `${p.school} ${p.grade} ${p.name}`;

        const profSchool = document.getElementById('profSchoolInput');
        const profGrade = document.getElementById('profGradeInput');
        const profName = document.getElementById('profNameInput');
        if (profSchool) profSchool.value = p.school;
        if (profGrade) profGrade.value = p.grade;
        if (profName) profName.value = p.name;

        const certSchool = document.getElementById('certUserSchool');
        const certGrade = document.getElementById('certUserGrade');
        const certName = document.getElementById('certUserName');
        if (certSchool && !certSchool.value) certSchool.value = p.school;
        if (certGrade && !certGrade.value) certGrade.value = p.grade;
        if (certName && !certName.value) certName.value = p.name;

        const startProfile = document.getElementById('startProfileDisplay');
        if (startProfile) startProfile.innerText = `${p.school} ${p.grade} ${p.name}`;
    }

    toggleProfileEdit() {
        const form = document.getElementById('profileEditForm');
        if (!form) return;
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }

    saveProfileFromModal() {
        const school = (document.getElementById('profSchoolInput')?.value || '').trim() || '햇살초등학교';
        const grade = (document.getElementById('profGradeInput')?.value || '').trim() || '3학년 1반';
        const name = (document.getElementById('profNameInput')?.value || '').trim() || '김벼리';

        this.saveUserProfile({ school, grade, name });
        const form = document.getElementById('profileEditForm');
        if (form) form.style.display = 'none';

        if (window.soundFx) window.soundFx.playPerfect();
        this.loadRecords();
    }

    finishGame() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        const finalSeconds = Math.max(10, this.elapsedSeconds - this.timeBonusSeconds);
        const mins = Math.floor(finalSeconds / 60);
        const secs = finalSeconds % 60;
        const timeString = `${mins > 0 ? mins + '분 ' : ''}${secs}초`;

        let medal = '🥉 동벼 메달 (성실한 새싹 농부)';
        if (finalSeconds <= 60) {
            medal = '🥇 금벼 메달 (전설의 황금쌀 마스터!)';
        } else if (finalSeconds <= 110) {
            medal = '🥈 은벼 메달 (부지런한 으뜸 농부!)';
        }

        const date = new Date().toLocaleDateString('ko-KR');

        this.latestResult = {
            seconds: finalSeconds,
            timeString: timeString,
            medal: medal,
            date: date
        };

        // 현재 프로필로 1차 자동 등록 후 수료증 표시
        const p = this.getUserProfile();
        this.updateRecord({
            school: p.school,
            grade: p.grade,
            name: p.name,
            ...this.latestResult
        });

        this.showCertificate(timeString, medal);
    }

    showCertificate(timeString, medal) {
        const modal = document.getElementById('certModal');
        const p = this.getUserProfile();

        const schoolInp = document.getElementById('certUserSchool');
        const gradeInp = document.getElementById('certUserGrade');
        const nameInp = document.getElementById('certUserName');
        if (schoolInp) schoolInp.value = p.school;
        if (gradeInp) gradeInp.value = p.grade;
        if (nameInp) nameInp.value = p.name;

        const fb = document.getElementById('certRegisterFeedback');
        if (fb) {
            fb.style.display = 'block';
            fb.className = 'cert-register-feedback';
            fb.innerHTML = `✅ <strong>${p.school} ${p.name}</strong> 농부의 기록이 명예의 전당에 자동 등록되었습니다! 다른 이름으로 등록하려면 위 정보를 수정 후 등록 버튼을 누르세요.`;
        }

        document.getElementById('certTimeText').innerText = timeString;
        document.getElementById('certMedalText').innerText = medal;
        document.getElementById('certBonusText').innerText = `성실한 보살핌으로 맛있는 쌀밥 완성!`;
        if (modal) modal.style.display = 'flex';
        window.soundFx.playFanfare();
        window.effectMgr.createConfetti(window.innerWidth / 2, window.innerHeight / 3, 70);
    }

    registerCurrentRecord() {
        if (!this.latestResult) return;

        const school = (document.getElementById('certUserSchool')?.value || '').trim() || '햇살초등학교';
        const grade = (document.getElementById('certUserGrade')?.value || '').trim() || '3학년 1반';
        const name = (document.getElementById('certUserName')?.value || '').trim() || '김벼리';

        const res = this.updateRecord({
            school,
            grade,
            name,
            ...this.latestResult
        });

        const fb = document.getElementById('certRegisterFeedback');
        if (fb) {
            fb.style.display = 'block';
            if (res.status === 'new_best') {
                fb.className = 'cert-register-feedback best';
                fb.innerHTML = `🎉 <strong>[최고 기록 갱신!]</strong> 기존 ${res.oldTime} ➔ <strong>${res.newTime}</strong>으로 단축 성공! (총 ${res.attempts}회 수확)`;
            } else if (res.status === 'kept_best') {
                fb.className = 'cert-register-feedback';
                fb.innerHTML = `👏 기록 등록 완료! (이번: ${this.latestResult.timeString} / 나의 최고 기록: <strong>${res.bestTime}</strong>, 누적 ${res.attempts}회 수확)`;
            } else {
                fb.className = 'cert-register-feedback best';
                fb.innerHTML = `✨ <strong>${school} ${name}</strong> 꼬마 농부의 첫 기록(<strong>${this.latestResult.timeString}</strong>)이 명예의 전당에 등록되었습니다!`;
            }
        }

        if (window.soundFx) window.soundFx.playPerfect();
        if (window.effectMgr) window.effectMgr.createGoldSparkles();
    }

    // 꼬마 농부 명예 수료증을 독립 HTML 파일로 내보내기
    saveCertAsHtml() {
        const p = this.getUserProfile();
        const school = (document.getElementById('certUserSchool')?.value || '').trim() || p.school;
        const grade = (document.getElementById('certUserGrade')?.value || '').trim() || p.grade;
        const name = (document.getElementById('certUserName')?.value || '').trim() || p.name;
        const medal = (document.getElementById('certMedalText')?.innerText || '').trim() || '🥇 금벼 메달';
        const timeText = (document.getElementById('certTimeText')?.innerText || '').trim() || '01분 05초';

        const safeSchool = school.replace(/[\\/:*?"<>|]/g, '_');
        const safeName = name.replace(/[\\/:*?"<>|]/g, '_');
        const filename = `꼬마농부_명예수료증_${safeSchool}_${safeName}.html`;

        const today = new Date();
        const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
        const issuerSchool = school.endsWith('학교') ? `${school}장` : (school.endsWith('초등') ? `${school}학교장` : `${school}장`);

        const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>꼬마 농부 명예 수료증 - ${name}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500;700;900&family=Nanum+Gothic:wght@400;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #F5F0EB;
    font-family: 'Noto Serif KR', 'Batang', 'Gungsuh', serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 16px;
    min-height: 100vh;
    color: #212121;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .no-print-toolbar {
    background: #FFFFFF;
    padding: 12px 26px;
    border-radius: 50px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.12);
    display: flex;
    gap: 14px;
    margin-bottom: 26px;
    font-family: 'Nanum Gothic', sans-serif;
    align-items: center;
  }
  .toolbar-tip {
    font-size: 0.95rem;
    font-weight: 800;
    color: #2E7D32;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .tool-btn {
    padding: 9px 20px;
    border: none;
    border-radius: 25px;
    font-weight: 800;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .btn-print { background: #2E7D32; color: #FFF; }
  .btn-print:hover { background: #1B5E20; transform: translateY(-1px); }
  .btn-close { background: #ECEFF1; color: #455A64; }
  .btn-close:hover { background: #CFD8DC; }

  .cert-wrapper {
    width: 100%;
    max-width: 660px;
    padding: 14px;
    background: #EFE8DE;
    border-radius: 18px;
    box-shadow: 0 12px 36px rgba(0,0,0,0.14);
  }
  .cert-card {
    background: #FFFEFA;
    border: 7px double #D4AF37;
    border-radius: 12px;
    padding: 46px 40px 38px;
    position: relative;
    box-shadow: inset 0 0 25px rgba(212, 175, 55, 0.12);
    text-align: center;
  }
  .cert-badge {
    font-size: 3.6rem;
    margin-bottom: 8px;
  }
  .cert-title {
    font-size: 2.7rem;
    font-weight: 900;
    letter-spacing: 0.25em;
    text-indent: 0.25em;
    color: #2E7D32;
    margin-bottom: 6px;
  }
  .cert-sub-title {
    font-size: 1.2rem;
    font-weight: 800;
    color: #E65100;
    letter-spacing: 0.1em;
    margin-bottom: 24px;
  }
  .cert-recipient {
    margin: 18px 0 24px;
    font-size: 1.25rem;
    line-height: 1.9;
  }
  .cert-recipient .student-name {
    font-size: 1.55rem;
    font-weight: 900;
    color: #B71C1C;
    text-decoration: underline;
    text-underline-offset: 5px;
  }
  .cert-body-text {
    font-size: 1.08rem;
    line-height: 2.05;
    color: #3E2723;
    margin: 20px 0 24px;
    padding: 0 10px;
    word-break: keep-all;
  }
  .cert-record-box {
    background: #FFF8E1;
    border: 2px dashed #FFB300;
    border-radius: 14px;
    padding: 16px;
    margin: 20px 10px;
    font-family: 'Nanum Gothic', sans-serif;
  }
  .cert-record-medal {
    font-size: 1.15rem;
    font-weight: 800;
    color: #E65100;
  }
  .cert-record-time {
    font-size: 2rem;
    font-weight: 900;
    color: #2E7D32;
    margin: 4px 0;
  }
  .cert-bottom-area {
    margin-top: 28px;
  }
  .cert-date {
    font-size: 1.05rem;
    color: #5D4037;
    margin-bottom: 18px;
    font-weight: 600;
  }
  .cert-issuer-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }
  .cert-issuer-name {
    font-size: 1.6rem;
    font-weight: 900;
    color: #212121;
    letter-spacing: 0.08em;
  }
  .cert-seal-stamp {
    width: 60px;
    height: 60px;
    border: 4px solid #D32F2F;
    color: #D32F2F;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.92rem;
    font-weight: 900;
    line-height: 1.15;
    text-align: center;
    letter-spacing: 1px;
    transform: rotate(-6deg);
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(211, 47, 47, 0.4);
    background: #FFF8F8;
  }

  @media print {
    body {
      background: none;
      padding: 0;
    }
    .no-print-toolbar {
      display: none !important;
    }
    .cert-wrapper {
      max-width: 100%;
      background: none;
      box-shadow: none;
      padding: 0;
      border-radius: 0;
    }
    .cert-card {
      border: 6px double #D4AF37;
      box-shadow: none;
      padding: 38px 28px;
      page-break-inside: avoid;
    }
    @page {
      size: A4 portrait;
      margin: 15mm;
    }
  }
</style>
</head>
<body>
  <div class="no-print-toolbar">
    <span class="toolbar-tip">🎖️ 꼬마 농부 수료증이 HTML 파일로 저장되었습니다!</span>
    <button class="tool-btn btn-print" onclick="window.print()">🖨️ 수료증 인쇄 / PDF 저장</button>
    <button class="tool-btn btn-close" onclick="window.close()">✕ 닫기</button>
  </div>
  <div class="cert-wrapper">
    <div class="cert-card">
      <div class="cert-badge">🎖️</div>
      <h1 class="cert-title">수&nbsp;&nbsp;료&nbsp;&nbsp;증</h1>
      <div class="cert-sub-title">[ 자랑스러운 꼬마 농부 명예 수료증 ]</div>
      <div class="cert-recipient">
        <div>소속: <strong>${school} ${grade}</strong></div>
        <div>성명: <span class="student-name">${name}</span></div>
      </div>
      <div class="cert-body-text">
        위 어린이는 벼의 요구사항을 귀 기울여 들으며<br>
        사랑과 정성으로 벼를 가꾸고, 건조와 도정(왕겨➔현미➔백미)을 거쳐<br>
        맛있는 가마솥 쌀밥을 훌륭히 완성하였으므로<br>
        <strong>[자랑스러운 꼬마 농부]</strong>로 인정하며 본 수료증을 수여합니다.
      </div>
      <div class="cert-record-box">
        <div class="cert-record-medal">${medal}</div>
        <div class="cert-record-time">${timeText}</div>
        <div style="font-size: 0.9rem; color: #757575;">사랑과 정성으로 가꾼 황금벼 수확 성공!</div>
      </div>
      <div class="cert-bottom-area">
        <div class="cert-date">${dateString}</div>
        <div class="cert-issuer-row">
          <span class="cert-issuer-name">${issuerSchool}</span>
          <div class="cert-seal-stamp">영양<br>박사</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

        window.downloadHtmlFile(filename, htmlContent);
        if (window.soundFx) window.soundFx.playPerfect();
        this.showToast(`💾 [${name}] 수료증이 HTML 파일로 저장되었습니다!`);
    }

    printCert() {
        const modal = document.getElementById('certModal');
        if (modal) modal.classList.add('print-target-modal');
        window.print();
        setTimeout(() => {
            if (modal) modal.classList.remove('print-target-modal');
        }, 1000);
    }

    updateRecord(entry) {
        try {
            this.saveUserProfile({
                school: entry.school,
                grade: entry.grade,
                name: entry.name
            });

            let records = JSON.parse(localStorage.getItem('rice_growth_records') || '[]');
            
            // 동일한 학생(학교명 + 학생 이름 일치) 검색
            const existing = records.find(r => 
                (r.school || '').trim() === entry.school.trim() && 
                (r.name || '').trim() === entry.name.trim()
            );

            let resultStatus = 'registered';
            let oldTime = null;

            if (existing) {
                existing.attempts = (existing.attempts || 1) + 1;
                existing.grade = entry.grade; // 학년반 업데이트

                if (entry.seconds < existing.seconds) {
                    oldTime = existing.timeString;
                    existing.seconds = entry.seconds;
                    existing.timeString = entry.timeString;
                    existing.medal = entry.medal;
                    existing.date = entry.date;
                    resultStatus = 'new_best';
                } else {
                    resultStatus = 'kept_best';
                }
            } else {
                records.push({
                    id: Date.now(),
                    school: entry.school,
                    grade: entry.grade,
                    name: entry.name,
                    seconds: entry.seconds,
                    timeString: entry.timeString,
                    medal: entry.medal,
                    date: entry.date,
                    attempts: 1
                });
                resultStatus = 'created';
            }

            // 가장 빠른 기록 순으로 랭킹 정렬
            records.sort((a, b) => a.seconds - b.seconds);
            records = records.slice(0, 25); // Top 25 유지
            localStorage.setItem('rice_growth_records', JSON.stringify(records));

            this.loadRecords();

            return {
                status: resultStatus,
                oldTime: oldTime,
                newTime: entry.timeString,
                bestTime: existing ? existing.timeString : entry.timeString,
                attempts: existing ? existing.attempts : 1
            };
        } catch (e) {
            console.warn(e);
            return { status: 'error' };
        }
    }

    loadRecords() {
        try {
            this.updateProfileUI();

            const p = this.getUserProfile();
            let records = JSON.parse(localStorage.getItem('rice_growth_records') || '[]');
            if (records.length === 0) {
                records = [
                    { id: 1, school: '햇살초등학교', grade: '3학년 1반', name: '김벼리', seconds: 52, timeString: '52초', medal: '🥇 금벼 메달', date: new Date().toLocaleDateString('ko-KR'), attempts: 3 },
                    { id: 2, school: '푸른초등학교', grade: '2학년 2반', name: '이하늘', seconds: 68, timeString: '1분 08초', medal: '🥈 은벼 메달', date: new Date().toLocaleDateString('ko-KR'), attempts: 1 },
                    { id: 3, school: '새싹초등학교', grade: '4학년 3반', name: '박나락', seconds: 85, timeString: '1분 25초', medal: '🥈 은벼 메달', date: new Date().toLocaleDateString('ko-KR'), attempts: 2 }
                ];
                localStorage.setItem('rice_growth_records', JSON.stringify(records));
            }
            const listEl = document.getElementById('recordList');

            // 현재 프로필 학생의 최고 기록 찾기
            const myRecord = records.find(r => 
                (r.school || '').trim() === p.school.trim() && 
                (r.name || '').trim() === p.name.trim()
            );

            const bestTimeEl = document.getElementById('myBestTimeText');
            const attemptsEl = document.getElementById('myAttemptsText');
            const medalEl = document.getElementById('myBestMedalText');

            if (myRecord) {
                if (bestTimeEl) bestTimeEl.innerText = myRecord.timeString;
                if (attemptsEl) attemptsEl.innerText = `${myRecord.attempts || 1}회`;
                if (medalEl) medalEl.innerText = (myRecord.medal || '').split(' ')[0] || '🥇';
            } else {
                if (bestTimeEl) bestTimeEl.innerText = '-';
                if (attemptsEl) attemptsEl.innerText = '0회';
                if (medalEl) medalEl.innerText = '-';
            }

            if (!listEl) return;

            if (records.length === 0) {
                listEl.innerHTML = `
                    <div class="no-record-box">
                        <span style="font-size: 2.2rem;">🌾</span>
                        <div style="font-size: 0.95rem; font-weight: 800; color: #5D4037; margin: 6px 0;">아직 등록된 꼬마 농부 기록이 없어요!</div>
                        <div style="font-size: 0.82rem; color: #757575;">벼농사를 지어 맛있는 쌀밥을 완성하면 여기에 내 학교와 이름이 실시간으로 랭킹에 올라갑니다!</div>
                    </div>
                `;
                return;
            }

            listEl.innerHTML = records.map((r, i) => {
                const isMe = (r.school || '').trim() === p.school.trim() && (r.name || '').trim() === p.name.trim();
                let rankLabel = `${i + 1}위`;
                let rankClass = '';
                if (i === 0) { rankLabel = '👑 1위'; rankClass = 'gold'; }
                else if (i === 1) { rankLabel = '🥈 2위'; rankClass = 'silver'; }
                else if (i === 2) { rankLabel = '🥉 3위'; rankClass = 'bronze'; }

                return `
                    <div class="record-row ${isMe ? 'is-my-record' : ''}">
                        <span class="record-rank ${rankClass}">${rankLabel}</span>
                        <div class="record-user-info">
                            <span class="rec-school">${r.school || '초등학교'}</span>
                            <span class="rec-grade">${r.grade || ''}</span>
                            <strong class="rec-name">${r.name || '꼬마농부'}</strong>
                            ${isMe ? '<span class="rec-me-badge">나</span>' : ''}
                        </div>
                        <span class="record-medal">${(r.medal || '').split(' ')[0]}</span>
                        <span class="record-time">⏱️ <strong>${r.timeString}</strong></span>
                        <span class="record-attempts">🌾 ${r.attempts || 1}회 수확</span>
                        <span class="record-date">${r.date || ''}</span>
                    </div>
                `;
            }).join('');
        } catch (e) {
            console.warn(e);
        }
    }

    clearAllRecords() {
        if (confirm('명예의 전당에 등록된 모든 기록을 초기화하시겠습니까?')) {
            localStorage.removeItem('rice_growth_records');
            if (window.soundFx) window.soundFx.playClick();
            this.loadRecords();
        }
    }

    // 명예의 전당 순위 기록을 단일 HTML 파일로 내려받기
    saveRecordsAsHtml() {
        let records = [];
        try {
            records = JSON.parse(localStorage.getItem('rice_growth_records') || '[]');
        } catch (e) {}

        const today = new Date();
        const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
        const filename = `꼬마농부_명예의전당_기록순위표.html`;

        const rowsHtml = records.map((r, i) => {
            let rankBadge = `${i + 1}위`;
            if (i === 0) rankBadge = '👑 1위';
            else if (i === 1) rankBadge = '🥈 2위';
            else if (i === 2) rankBadge = '🥉 3위';

            return `<tr>
              <td style="text-align: center; font-weight: 800;">${rankBadge}</td>
              <td>${r.school || '-'}</td>
              <td>${r.grade || '-'}</td>
              <td style="font-weight: 800; color: #2E7D32;">${r.name || '-'}</td>
              <td style="text-align: center;">${(r.medal || '').split(' ')[0] || '🏅'}</td>
              <td style="text-align: center; font-weight: 800; color: #E65100;">${r.timeString || '-'}</td>
              <td style="text-align: center;">${r.attempts || 1}회</td>
              <td style="text-align: center; font-size: 0.88rem; color: #666;">${r.date || '-'}</td>
            </tr>`;
        }).join('');

        const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>꼬마 농부 명예의 전당 기록 순위표</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #F4F6F8;
    font-family: 'Nanum Gothic', sans-serif;
    padding: 30px 20px;
    color: #333;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .container {
    max-width: 820px;
    margin: 0 auto;
    background: #FFFFFF;
    border-radius: 16px;
    padding: 36px 32px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  }
  .no-print-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #ECEFF1;
  }
  .tool-btn {
    padding: 9px 20px;
    border: none;
    border-radius: 25px;
    font-weight: 800;
    font-size: 0.95rem;
    cursor: pointer;
    background: #2E7D32;
    color: #FFF;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .tool-btn:hover {
    background: #1B5E20;
  }
  .title-area {
    text-align: center;
    margin-bottom: 28px;
  }
  .title-area h1 {
    font-size: 2rem;
    color: #1B5E20;
    margin-bottom: 8px;
  }
  .title-area p {
    color: #666;
    font-size: 0.95rem;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  th {
    background: #E8F5E9;
    color: #2E7D32;
    font-weight: 800;
    padding: 12px 10px;
    border-top: 2px solid #81C784;
    border-bottom: 2px solid #81C784;
    font-size: 0.95rem;
    text-align: left;
  }
  th:first-child, th:nth-child(5), th:nth-child(6), th:nth-child(7), th:nth-child(8) {
    text-align: center;
  }
  td {
    padding: 12px 10px;
    border-bottom: 1px solid #EEEEEE;
    font-size: 0.95rem;
  }
  tr:hover {
    background: #FAFAFA;
  }
  @media print {
    body { background: none; padding: 0; }
    .no-print-toolbar { display: none !important; }
    .container { box-shadow: none; padding: 10px; max-width: 100%; }
    @page { size: A4 portrait; margin: 15mm 10mm; }
  }
</style>
</head>
<body>
  <div class="container">
    <div class="no-print-toolbar">
      <span style="font-weight: 800; color: #2E7D32;">🌾 꼬마 농부 명예의 전당 기록 순위표</span>
      <button class="tool-btn" onclick="window.print()">🖨️ 인쇄 / PDF 저장</button>
    </div>
    <div class="title-area">
      <h1>🏆 꼬마 농부 명예의 전당 순위표</h1>
      <p>벼의 한살이 및 6대 가공 공정을 통과한 꼬마 농부들의 도전 기록입니다. (출력일: ${dateString})</p>
    </div>
    <table>
      <thead>
        <tr>
          <th>순위</th>
          <th>학교명</th>
          <th>학년/반</th>
          <th>이름</th>
          <th>메달</th>
          <th>소요 시간</th>
          <th>수확 횟수</th>
          <th>달성일</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  </div>
</body>
</html>`;

        window.downloadHtmlFile(filename, htmlContent);
        if (window.soundFx) window.soundFx.playPerfect();
        this.showToast('💾 명예의 전당 기록 순위표가 HTML 파일로 저장되었습니다!');
    }

    openModal(id) {
        window.soundFx.playClick();
        if (id === 'quizModal' && window.encycloUI) {
            window.encycloUI.renderQuiz();
        }
        if (id === 'encyclopediaModal' && window.encycloUI) {
            window.encycloUI.renderEncyclopedia();
        }
        const modal = document.getElementById(id);
        if (modal) modal.style.display = 'flex';
    }

    closeModal(id) {
        window.soundFx.playClick();
        const modal = document.getElementById(id);
        if (modal) modal.style.display = 'none';
    }

    restartGame() {
        this.closeModal('certModal');
        this.prepareGame();
    }
}

window.gameApp = new RiceGameApp();
