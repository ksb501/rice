// Canvas 기반의 고성능 파티클 및 시각 효과 (벡터 패스 렌더링 & 스프라이트 캐싱 & 유휴 루프 정지)
class EffectManager {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.sparrows = [];
        this.ducks = [];
        this.snails = [];
        this.isLooping = false;

        // 오프스크린 스프라이트 캐시 (이모지 폰트 래스터라이제이션 병목 제거)
        this.duckSprite = null;
        this.snailSprite = null;
        this.sparrowSprite = null;

        this.init();
    }

    init() {
        this.canvas = document.getElementById('effectCanvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'effectCanvas';
            document.body.appendChild(this.canvas);
        }
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '999';

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.initSprites();
        this.animate = this.animate.bind(this);
    }

    // 이모지 스프라이트를 오프스크린 캔버스에 1회 사전 렌더링 (매 프레임 fillText 호출 제거)
    initSprites() {
        this.duckSprite = this.createEmojiSprite('🦆', 54);
        this.snailSprite = this.createEmojiSprite('🐌', 48);
        this.sparrowSprite = this.createEmojiSprite('🐦', 44);
    }

    createEmojiSprite(emoji, size) {
        try {
            const off = document.createElement('canvas');
            off.width = size;
            off.height = size;
            const octx = off.getContext('2d');
            octx.font = `${Math.round(size * 0.75)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
            octx.textAlign = 'center';
            octx.textBaseline = 'middle';
            octx.fillText(emoji, size / 2, size / 2 + 2);
            return off;
        } catch (e) {
            return null;
        }
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    startLoopIfNeeded() {
        if (!this.isLooping) {
            this.isLooping = true;
            requestAnimationFrame(this.animate);
        }
    }

    trimParticles() {
        if (this.particles.length > 70) {
            this.particles.splice(0, this.particles.length - 50);
        }
    }

    // 1. 축하 꽃가루 폭죽 (Confetti)
    createConfetti(x = window.innerWidth / 2, y = window.innerHeight / 3, count = 40) {
        this.trimParticles();
        const colors = ['#FF5722', '#FFC107', '#4CAF50', '#03A9F4', '#E91E63', '#9C27B0', '#FFEB3B'];
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 4 + Math.random() * 7;
            this.particles.push({
                type: 'confetti',
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 3,
                size: 6 + Math.random() * 8,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 14,
                gravity: 0.22,
                opacity: 1,
                life: 70 + Math.random() * 30
            });
        }
        this.startLoopIfNeeded();
    }

    // 2. 사랑의 쓰담쓰담 (손길과 하트 뿅뿅 & 핑크빛 반짝이)
    createLovePet(x = window.innerWidth / 2, y = window.innerHeight * 0.45, count = 12) {
        this.trimParticles();
        for (let i = 0; i < count; i++) {
            this.particles.push({
                type: 'heart',
                x: x + (Math.random() - 0.5) * 70,
                y: y + (Math.random() - 0.5) * 40,
                vx: (Math.random() - 0.5) * 2.5,
                vy: -2 - Math.random() * 3,
                size: 20 + Math.random() * 14,
                opacity: 1,
                life: 55 + Math.random() * 20
            });
        }
        this.startLoopIfNeeded();
    }

    // 3. 시원한 물주기 (찰방찰방 튀는 물방울)
    createWaterDrops(x = window.innerWidth / 2, y = window.innerHeight * 0.45, count = 16) {
        this.trimParticles();
        for (let i = 0; i < count; i++) {
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
            const speed = 3 + Math.random() * 5;
            this.particles.push({
                type: 'water',
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 5 + Math.random() * 6,
                color: '#29B6F6',
                gravity: 0.28,
                opacity: 0.95,
                life: 40 + Math.random() * 15
            });
        }
        this.startLoopIfNeeded();
    }

    // 4. 햇빛쬐기 (황금빛 햇살과 반짝이)
    createGoldSparkles(x = window.innerWidth / 2, y = window.innerHeight * 0.4, count = 16) {
        this.trimParticles();
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 5;
            this.particles.push({
                type: 'sparkle',
                x: x + (Math.random() - 0.5) * 40,
                y: y + (Math.random() - 0.5) * 40,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 16 + Math.random() * 16,
                opacity: 1,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 18,
                life: 45 + Math.random() * 15
            });
        }
        this.startLoopIfNeeded();
    }

    // 5. 오리농법: 귀여운 오리들이 헤엄치며 꽥꽥!
    spawnDucks(count = 3) {
        if (this.ducks.length > 5) this.ducks.splice(0, 3);
        const startY = window.innerHeight * 0.62;
        for (let i = 0; i < count; i++) {
            const goingRight = Math.random() > 0.5;
            this.ducks.push({
                x: goingRight ? -50 - i * 50 : window.innerWidth + 50 + i * 50,
                y: startY + (Math.random() - 0.5) * 30,
                vx: goingRight ? (3.2 + Math.random() * 1.2) : -(3.2 + Math.random() * 1.2),
                scaleX: goingRight ? 1 : -1,
                wavePhase: Math.random() * 10,
                life: 120
            });
        }
        this.startLoopIfNeeded();
    }

    // 6. 우렁이농법: 우렁이가 논바닥을 기어가며 잡초를 냠냠!
    spawnSnails(count = 3) {
        if (this.snails.length > 5) this.snails.splice(0, 3);
        const startY = window.innerHeight * 0.68;
        for (let i = 0; i < count; i++) {
            this.snails.push({
                x: window.innerWidth * 0.25 + Math.random() * (window.innerWidth * 0.5),
                y: startY + (Math.random() - 0.5) * 25,
                vx: (Math.random() - 0.5) * 0.8,
                life: 110
            });
        }
        this.startLoopIfNeeded();
    }

    // 7. 참새 도망치기 (허수아비 탭 시)
    scareSparrows() {
        if (this.sparrows.length > 5) this.sparrows.splice(0, 3);
        for (let i = 0; i < 3; i++) {
            this.sparrows.push({
                x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 100,
                y: window.innerHeight * 0.4 + (Math.random() - 0.5) * 50,
                vx: (Math.random() > 0.5 ? 1 : -1) * (6 + Math.random() * 3),
                vy: -5 - Math.random() * 3,
                opacity: 1,
                life: 55
            });
        }
        this.startLoopIfNeeded();
    }

    // 8. 솔솔 바람 (중간 물 떼기)
    createBreeze(x = window.innerWidth / 2, y = window.innerHeight * 0.55) {
        this.trimParticles();
        for (let i = 0; i < 6; i++) {
            this.particles.push({
                type: 'breeze',
                x: x - 80 + Math.random() * 160,
                y: y + (Math.random() - 0.5) * 35,
                vx: 4 + Math.random() * 3.5,
                vy: -0.4 + Math.random() * 0.8,
                length: 25 + Math.random() * 25,
                opacity: 0.9,
                life: 35
            });
        }
        this.startLoopIfNeeded();
    }

    // 9. 농부의 손길 (따뜻한 손길과 연두빛 새싹 잎새)
    createFarmerTouch(x = window.innerWidth / 2, y = window.innerHeight * 0.45, count = 12) {
        this.trimParticles();
        for (let i = 0; i < count; i++) {
            this.particles.push({
                type: 'farmer',
                x: x + (Math.random() - 0.5) * 75,
                y: y + (Math.random() - 0.5) * 45,
                vx: (Math.random() - 0.5) * 2.2,
                vy: -1.5 - Math.random() * 2.5,
                size: 16 + Math.random() * 12,
                rotation: Math.random() * 360,
                opacity: 1,
                life: 50 + Math.random() * 15
            });
        }
        this.startLoopIfNeeded();
    }

    // 10. 탈곡 효과 (후두둑 쏟아지는 황금빛 나락 낟알들)
    createThreshShower(x = window.innerWidth / 2, y = window.innerHeight * 0.45, count = 18) {
        this.trimParticles();
        for (let i = 0; i < count; i++) {
            this.particles.push({
                type: 'grain',
                x: x + (Math.random() - 0.5) * 70,
                y: y + (Math.random() - 0.5) * 35,
                vx: (Math.random() - 0.5) * 5,
                vy: -2 - Math.random() * 3.5,
                gravity: 0.28,
                size: 14 + Math.random() * 8,
                rotation: Math.random() * 360,
                opacity: 1,
                life: 45 + Math.random() * 12
            });
        }
        this.startLoopIfNeeded();
    }

    // 11. 선별 레이저 빔 (색채선별기 광학 센서 반짝임)
    createSortingBeams(x = window.innerWidth / 2, y = window.innerHeight * 0.45) {
        this.trimParticles();
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                type: 'sparkle',
                x: x + (Math.random() - 0.5) * 100,
                y: y + (Math.random() - 0.5) * 50,
                vx: (Math.random() - 0.5) * 3.5,
                vy: (Math.random() - 0.5) * 3.5,
                size: 18 + Math.random() * 14,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 20,
                opacity: 1,
                life: 40
            });
        }
        this.startLoopIfNeeded();
    }

    // 고성능 벡터 렌더러
    drawHeart(x, y, size, alpha) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = '#FF4081';
        const s = size * 0.45;
        this.ctx.beginPath();
        this.ctx.moveTo(0, s * 0.3);
        this.ctx.bezierCurveTo(-s, -s * 0.6, -s * 1.6, s * 0.5, 0, s * 1.5);
        this.ctx.bezierCurveTo(s * 1.6, s * 0.5, s, -s * 0.6, 0, s * 0.3);
        this.ctx.fill();
        this.ctx.restore();
    }

    drawSparkle(x, y, size, rotation, alpha) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate((rotation * Math.PI) / 180);
        this.ctx.globalAlpha = alpha;
        const r = size * 0.5;
        this.ctx.fillStyle = '#FFD54F';
        this.ctx.beginPath();
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            this.ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
            const halfAngle = angle + Math.PI / 4;
            this.ctx.lineTo(Math.cos(halfAngle) * (r * 0.28), Math.sin(halfAngle) * (r * 0.28));
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.fillStyle = '#FFF9C4';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    drawFarmerSprout(x, y, size, rotation, alpha) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate((rotation * Math.PI) / 180);
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, size * 0.32, size * 0.6, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#81C784';
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, size * 0.18, size * 0.45, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    drawGrain(x, y, size, rotation, alpha) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate((rotation * Math.PI) / 180);
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = '#FFCA28';
        this.ctx.strokeStyle = '#E65100';
        this.ctx.lineWidth = 1.6;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, size * 0.32, size * 0.62, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    }

    animate() {
        if (!this.ctx) return;

        // 아무런 요소도 없으면 루프를 멈추고 캔버스를 완전히 비워 GPU/CPU 0% 유지
        if (this.particles.length === 0 && this.ducks.length === 0 && this.snails.length === 0 && this.sparrows.length === 0) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.isLooping = false;
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 1. 기본 파티클 렌더링
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            if (p.gravity) p.vy += p.gravity;
            p.life--;
            p.opacity = Math.max(0, p.life / 35);

            if (p.type === 'confetti') {
                p.rotation += p.rotSpeed;
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate((p.rotation * Math.PI) / 180);
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.opacity;
                this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                this.ctx.restore();
            } else if (p.type === 'heart') {
                this.drawHeart(p.x, p.y, p.size, p.opacity);
            } else if (p.type === 'water') {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.opacity;
                this.ctx.fill();
                this.ctx.restore();
            } else if (p.type === 'sparkle') {
                p.rotation += (p.rotSpeed || 10);
                this.drawSparkle(p.x, p.y, p.size, p.rotation, p.opacity);
            } else if (p.type === 'farmer') {
                p.rotation = (p.rotation || 0) + 4;
                this.drawFarmerSprout(p.x, p.y, p.size, p.rotation, p.opacity);
            } else if (p.type === 'grain') {
                p.rotation = (p.rotation || 0) + 6;
                this.drawGrain(p.x, p.y, p.size, p.rotation, p.opacity);
            } else if (p.type === 'breeze') {
                this.ctx.save();
                this.ctx.globalAlpha = p.opacity;
                this.ctx.strokeStyle = '#81D4FA';
                this.ctx.lineWidth = 2.5;
                this.ctx.lineCap = 'round';
                this.ctx.beginPath();
                this.ctx.moveTo(p.x, p.y);
                this.ctx.quadraticCurveTo(p.x + p.length * 0.5, p.y - 5, p.x + p.length, p.y);
                this.ctx.stroke();
                this.ctx.restore();
            }

            if (p.life <= 0 || p.y > this.canvas.height + 50) {
                this.particles.splice(i, 1);
            }
        }

        // 2. 오리 렌더링 (사전 캐시된 스프라이트 drawImage)
        for (let i = this.ducks.length - 1; i >= 0; i--) {
            const d = this.ducks[i];
            d.x += d.vx;
            d.wavePhase += 0.16;
            const waveY = d.y + Math.sin(d.wavePhase) * 4;
            d.life--;

            if (this.duckSprite) {
                this.ctx.save();
                this.ctx.translate(d.x, waveY);
                this.ctx.scale(d.scaleX, 1);
                this.ctx.drawImage(this.duckSprite, -27, -27);
                this.ctx.restore();
            }

            if (d.life <= 0 || d.x < -100 || d.x > this.canvas.width + 100) {
                this.ducks.splice(i, 1);
            }
        }

        // 3. 우렁이 렌더링 (사전 캐시된 스프라이트 drawImage)
        for (let i = this.snails.length - 1; i >= 0; i--) {
            const s = this.snails[i];
            s.x += s.vx;
            s.life--;
            const opacity = Math.min(1, s.life / 25);

            if (this.snailSprite) {
                this.ctx.save();
                this.ctx.translate(s.x, s.y);
                this.ctx.globalAlpha = opacity;
                this.ctx.drawImage(this.snailSprite, -24, -24);
                this.ctx.restore();
            }

            if (s.life <= 0) {
                this.snails.splice(i, 1);
            }
        }

        // 4. 참새 렌더링 (사전 캐시된 스프라이트 drawImage)
        for (let i = this.sparrows.length - 1; i >= 0; i--) {
            const s = this.sparrows[i];
            s.x += s.vx;
            s.y += s.vy;
            s.life--;
            s.opacity = Math.max(0, s.life / 25);

            if (this.sparrowSprite) {
                this.ctx.save();
                this.ctx.translate(s.x, s.y);
                if (s.vx < 0) this.ctx.scale(-1, 1);
                this.ctx.globalAlpha = s.opacity;
                this.ctx.drawImage(this.sparrowSprite, -22, -22);
                this.ctx.restore();
            }

            if (s.life <= 0 || s.x < -100 || s.x > this.canvas.width + 100 || s.y < -50) {
                this.sparrows.splice(i, 1);
            }
        }

        requestAnimationFrame(this.animate);
    }
}

window.effectMgr = new EffectManager();
