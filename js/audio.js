// Web Audio API 기반의 완전 자립형 사운드 합성기
class SoundEffects {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.initialized = false;

        // 가을 자연 배경음 (귀뚜라미, 메뚜기, 솔바람, 가을 풍경 차임)
        this.bgmEnabled = true;
        this.bgmPlaying = false;
        this.bgmGain = null;
        this.bgmTimer = null;
        this.noiseBuffer = null;
        this.windSource = null;
        this.windGain = null;
        this.lastFxTime = {};
    }

    init() {
        if (this.initialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.initialized = true;

            // 배경음 마스터 게인 노드
            this.bgmGain = this.ctx.createGain();
            this.bgmGain.gain.setValueAtTime(0.32, this.ctx.currentTime);
            this.bgmGain.connect(this.ctx.destination);

            // 바람 및 풀벌레용 노이즈 버퍼 생성 (2초 스테레오/모노 버퍼)
            this.generateNoiseBuffer();
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }

    generateNoiseBuffer() {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * 2;
        this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = this.noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        // 핑크빛 노이즈 근사 (부드러운 가을 바람과 풀벌레 질감)
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5; // 증폭
        }
    }

    ensureContext() {
        if (!this.initialized) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    // 1. 물주기 소리 (찰방찰방 물방울)
    playWater() {
        if (this.muted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const freqs = [650, 850, 1050, 1300];
        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startTime = now + idx * 0.06;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.4, startTime + 0.09);

            gain.gain.setValueAtTime(0.18, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.11);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.12);
        });
    }

    // 2. 햇빛 비추기 (영롱하고 따스한 하프 아르페지오)
    playSun() {
        if (this.muted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + i * 0.05;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.15, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.32);
        });
    }

    // 3. 사랑의 쓰담쓰담 (귀여운 웃음소리 & 하트 뿅뿅 차임)
    playLovePet() {
        if (this.muted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6
        notes.forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + idx * 0.06;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, t);
            osc.frequency.exponentialRampToValueAtTime(f * 1.08, t + 0.15);

            gain.gain.setValueAtTime(0.2, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.3);
        });
    }

    // 4. 오리농법 (꽥! 꽥!)
    playDuck() {
        if (this.muted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        [0, 0.12].forEach((offset) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + offset;

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(360, t);
            osc.frequency.exponentialRampToValueAtTime(180, t + 0.1);

            gain.gain.setValueAtTime(0.22, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.12);
        });
    }

    // 5. 우렁이 냠냠 먹방 (아삭아삭)
    playSnail() {
        if (this.muted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        [0, 0.08, 0.16].forEach((offset) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + offset;

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(320 + Math.random() * 100, t);
            osc.frequency.exponentialRampToValueAtTime(160, t + 0.06);

            gain.gain.setValueAtTime(0.14, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.07);
        });
    }

    // 6. 허수아비 탭 (방울 딸랑딸랑)
    playScarecrowTap() {
        if (this.muted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const bellPitches = [1318.51, 1567.98, 1760.00, 2093.00];
        const pitch = bellPitches[Math.floor(Math.random() * bellPitches.length)];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, now);

        gain.gain.setValueAtTime(0.24, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.19);
    }

    // 7. 참새 날아가기
    playSparrowFly() {
        if (this.muted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(2400, now);
        osc.frequency.linearRampToValueAtTime(3200, now + 0.05);
        osc.frequency.linearRampToValueAtTime(2100, now + 0.1);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.13);
    }

    // 8. 중간 물 떼기 / 솔솔 바람
    playDrainBreeze() {
        if (this.muted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.35);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.42);
    }

    // 9. 잘못된 도구 클릭 시 갸우뚱 소리 (부부~ 가벼운 귀여운 톤)
    playWrongChoice() {
        if (this.muted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.linearRampToValueAtTime(260, now + 0.18);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.22);
    }

    // 10. 도정기 맷돌 롤러 소리
    playMilling() {
        if (this.muted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.linearRampToValueAtTime(160, now + 0.25);

        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    // 11. 가마솥 밥 짓기 (보글보글)
    playCooking() {
        if (this.muted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        for (let i = 0; i < 5; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + i * 0.07;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(380 + Math.random() * 200, t);

            gain.gain.setValueAtTime(0.14, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.07);
        }
    }

    // 12. 요구사항 적중! 골든 타이밍 퍼펙트
    playPerfect() {
        if (this.muted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const chord = [523.25, 659.25, 783.99, 1046.50];
        chord.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + i * 0.05;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.22, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.4);
        });
    }

    // 13. 승리 팡파르
    playFanfare() {
        if (this.muted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const melody = [
            { f: 523.25, d: 0.12, t: 0 },
            { f: 659.25, d: 0.12, t: 0.12 },
            { f: 783.99, d: 0.12, t: 0.24 },
            { f: 1046.50, d: 0.4, t: 0.36 }
        ];

        melody.forEach(item => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startT = now + item.t;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(item.f, startT);

            gain.gain.setValueAtTime(0.25, startT);
            gain.gain.exponentialRampToValueAtTime(0.001, startT + item.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startT);
            osc.stop(startT + item.d + 0.05);
        });
    }

    // 농부의 손길 (따뜻하고 정성 가득한 마림바 & 차임 아르페지오)
    playFarmerTouch() {
        if (this.muted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
        notes.forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + idx * 0.05;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, t);

            gain.gain.setValueAtTime(0.18, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.38);
        });
    }

    // 탈곡 (콤바인 & 탈곡기 회전 및 낟알 털어내는 경쾌한 소리)
    playThreshing() {
        if (this.muted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        for (let i = 0; i < 4; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + i * 0.06;

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(260 + i * 40, t);
            osc.frequency.exponentialRampToValueAtTime(140, t + 0.08);

            gain.gain.setValueAtTime(0.16, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.09);
        }
    }

    // 건조 (열풍 건조기 따스한 바람)
    playDryBreeze() {
        if (this.muted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.35);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
    }

    // 저장 (저온 사일로 찰칵 안심 보관음)
    playSiloStore() {
        if (this.muted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const chord = [330.00, 440.00, 660.00];
        chord.forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + idx * 0.04;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, t);

            gain.gain.setValueAtTime(0.18, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.3);
        });
    }

    // 선별 (광학 센서 레이저 스캔 띵동음)
    playColorSort() {
        if (this.muted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const beeps = [880, 1174.66, 1760];
        beeps.forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + idx * 0.05;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, t);

            gain.gain.setValueAtTime(0.14, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.2);
        });
    }

    // 포장 (햅쌀 포대 담기 & 완성 축하)
    playPacking() {
        if (this.muted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + idx * 0.06;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, t);

            gain.gain.setValueAtTime(0.2, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.28);
        });
    }

    playClick() {
        if (this.muted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.05);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
    }

    // ==========================================
    // 가을 자연 배경음 (Autumn Nature BGM)
    // 귀뚜라미(귀뚤귀뚤), 메뚜기/여치(찌르르), 가을 솔바람, 목가적 펜타토닉 차임
    // ==========================================
    startBGM() {
        if (!this.bgmEnabled || this.bgmPlaying) return;
        this.ensureContext();
        if (!this.ctx) return;

        this.bgmPlaying = true;
        this.startWind();

        // 오디오 스케줄링 루프 (250ms마다 다음 구간 예약)
        let nextCricketTime = this.ctx.currentTime + 0.2;
        let nextGrasshopperTime = this.ctx.currentTime + 1.2;
        let nextChimeTime = this.ctx.currentTime + 0.5;

        const scheduleCycle = () => {
            if (!this.bgmPlaying || !this.ctx) return;
            const now = this.ctx.currentTime;
            const lookAhead = now + 0.8;

            // 1. 귀뚜라미 귀뚤귀뚤 소리 예약
            while (nextCricketTime < lookAhead) {
                this.playCricket(nextCricketTime);
                nextCricketTime += 1.8 + Math.random() * 1.4; // 1.8~3.2초 주기
            }

            // 2. 메뚜기 / 여치 찌르르- 소리 예약
            while (nextGrasshopperTime < lookAhead) {
                this.playGrasshopper(nextGrasshopperTime);
                nextGrasshopperTime += 3.2 + Math.random() * 2.5; // 3.2~5.7초 주기
            }

            // 3. 은은한 가을 펜타토닉 차임 (목가적인 평화로운 선율)
            while (nextChimeTime < lookAhead) {
                this.playAutumnChime(nextChimeTime);
                nextChimeTime += 3.5 + Math.random() * 3.0; // 3.5~6.5초 주기
            }
        };

        scheduleCycle();
        this.bgmTimer = setInterval(scheduleCycle, 250);
    }

    stopBGM() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearInterval(this.bgmTimer);
            this.bgmTimer = null;
        }
        if (this.windGain && this.ctx) {
            try {
                this.windGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
                setTimeout(() => {
                    if (this.windSource) {
                        try { this.windSource.stop(); } catch (e) {}
                        this.windSource = null;
                    }
                }, 350);
            } catch (e) {}
        }
    }

    toggleBGM() {
        this.bgmEnabled = !this.bgmEnabled;
        if (this.bgmEnabled) {
            this.startBGM();
        } else {
            this.stopBGM();
        }

        const btn = document.getElementById('btnBgmToggle');
        if (btn) {
            if (this.bgmEnabled) {
                btn.classList.add('active');
                btn.classList.remove('muted');
                btn.innerText = '🎵 가을BGM 켜짐';
            } else {
                btn.classList.remove('active');
                btn.classList.add('muted');
                btn.innerText = '🔇 가을BGM 꺼짐';
            }
        }
        return this.bgmEnabled;
    }

    // 1) 가을 솔바람 (Pink Noise Looping Wind with slow LFO filter)
    startWind() {
        if (!this.ctx || !this.noiseBuffer || this.windSource) return;

        try {
            this.windSource = this.ctx.createBufferSource();
            this.windSource.buffer = this.noiseBuffer;
            this.windSource.loop = true;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(320, this.ctx.currentTime);
            filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

            // 바람 소리 숨결 (느린 사인파 변조)
            const lfo = this.ctx.createOscillator();
            lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime); // 5초 주기
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
            lfo.connect(lfoGain);
            lfoGain.connect(filter.frequency);
            lfo.start();

            this.windGain = this.ctx.createGain();
            this.windGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
            this.windGain.gain.linearRampToValueAtTime(0.025, this.ctx.currentTime + 1.2);

            this.windSource.connect(filter);
            filter.connect(this.windGain);
            this.windGain.connect(this.bgmGain);

            this.windSource.start();
        } catch (e) {
            console.warn('Wind ambience start failed:', e);
        }
    }

    // 2) 귀뚜라미 울음소리 (귀뚤- 귀뚤- 3~4회 고주파 펄스)
    playCricket(time) {
        if (!this.ctx || !this.bgmEnabled || !this.bgmGain) return;
        const pulses = 3 + Math.floor(Math.random() * 2); // 3~4회 빠른 펄스
        const baseFreq = 4450 + (Math.random() - 0.5) * 200; // ~4450Hz

        for (let i = 0; i < pulses; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = time + i * 0.042;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(baseFreq + i * 30, t);

            gain.gain.setValueAtTime(0.0001, t);
            gain.gain.linearRampToValueAtTime(0.045, t + 0.008);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.032);

            osc.connect(gain);
            gain.connect(this.bgmGain);

            osc.start(t);
            osc.stop(t + 0.035);
        }
    }

    // 3) 메뚜기 / 여치 마찰음 (찌르르르르- 30Hz 트레몰로 질감)
    playGrasshopper(time) {
        if (!this.ctx || !this.bgmEnabled || !this.bgmGain || !this.noiseBuffer) return;
        try {
            const duration = 0.5 + Math.random() * 0.35;
            const src = this.ctx.createBufferSource();
            src.buffer = this.noiseBuffer;

            const band = this.ctx.createBiquadFilter();
            band.type = 'bandpass';
            band.frequency.setValueAtTime(6800 + (Math.random() - 0.5) * 600, time);
            band.Q.setValueAtTime(5.0, time);

            // 빠른 떨림(Tremolo) 진폭 변조 (32Hz)
            const tremoloOsc = this.ctx.createOscillator();
            tremoloOsc.frequency.setValueAtTime(32, time);
            const tremoloGain = this.ctx.createGain();
            tremoloGain.gain.setValueAtTime(0.4, time);
            tremoloOsc.connect(tremoloGain);

            const ampGain = this.ctx.createGain();
            ampGain.gain.setValueAtTime(0.001, time);
            ampGain.gain.linearRampToValueAtTime(0.035, time + 0.08);
            ampGain.gain.setValueAtTime(0.035, time + duration - 0.1);
            ampGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

            src.connect(band);
            band.connect(ampGain);
            ampGain.connect(this.bgmGain);

            tremoloOsc.start(time);
            tremoloOsc.stop(time + duration);
            src.start(time);
            src.stop(time + duration);
        } catch (e) {
            // fallback
        }
    }

    // 4) 가을 들판 펜타토닉 차임 (따뜻하고 평화로운 음색)
    playAutumnChime(time) {
        if (!this.ctx || !this.bgmEnabled || !this.bgmGain) return;
        // 궁상각치우 가을 오음음계 (F4, G4, A4, C5, D5, F5, G5)
        const notes = [349.23, 392.00, 440.00, 523.25, 587.33, 698.46, 783.99];
        const freq = notes[Math.floor(Math.random() * notes.length)];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // 맑은 벨 소리를 위한 사인+오버톤 조합
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.linearRampToValueAtTime(0.038, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.8);

        osc.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(time);
        osc.stop(time + 2.0);
    }
}

window.soundFx = new SoundEffects();
