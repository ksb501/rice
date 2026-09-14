// 두피디아(Doopedia) 초등 과학 "벼의 한살이" 기반 6단계 엔진
// 요구사항 기반 성장, 고화질 디테일 그래픽, 왕겨>현미>백미>가마솥밥 상세 단계 완비!
class StoryMode {
    constructor() {
        this.currentStage = 1;
        this.totalStages = 6;
        this.stageProgress = 0; // 0 ~ 100%
        this.totalRipeningPct = 0; // 전체 0 ~ 100%
        
        // 벼가 현재 요구하는 도구 (요구사항을 들어줄 때만 성장!)
        this.currentNeed = null;

        // 화면 렉 및 고속 클릭 경합 방지용 락 & 쓰로틀
        this.isAdvancingStage = false;
        this.lastClickTimestamp = 0;

        this.stageInfo = [
            {
                id: 1,
                name: '1단계: 볍씨 (씨앗과 싹 트기)',
                season: '🌱 4월 봄날',
                day: 15,
                goal: '볍씨의 말풍선을 보고 원하는 것을 챙겨주어 파릇파릇 싹을 틔워보세요!',
                tip: '💡 좋은 볍씨는 물에 가라앉고, 따뜻한 물과 사랑을 받으면 싹이 쏙 나와요!'
            },
            {
                id: 2,
                name: '2단계: 어린 모 (모판과 모내기)',
                season: '🌿 5월 모내기철',
                day: 50,
                goal: '어린 모가 원하는 물과 햇빛, 사랑을 주어 논에 튼튼히 뿌리내리게 해요!',
                tip: '💡 싹튼 벼를 키운 어린 식물을 "모"라고 하고, 논에 옮겨 심는 것을 "모내기"라고 해요!'
            },
            {
                id: 3,
                name: '3단계: 여름 벼 (새끼치기와 생태논)',
                season: '☀️ 6~7월 한여름',
                day: 100,
                goal: '친환경 오리와 우렁이를 불러 해충과 잡초를 없애고 벼 줄기를 튼튼히 늘려요! (오리와 우렁이 각 2회)',
                tip: '💡 [오리농법]은 해충을 먹고 발장구로 잡초를 억제하며, [우렁이농법]은 화학 제초제 없이 잡초를 먹어치워 생태계를 지켜줘요!'
            },
            {
                id: 4,
                name: '4단계: 벼꽃과 이삭 (출수)',
                season: '🌸 8월 늦여름',
                day: 130,
                goal: '하얀 벼꽃과 고개 숙인 이삭이 목마르거나 햇빛을 원할 때 바로 챙겨주세요!',
                tip: '💡 줄기 끝에서 이삭이 나오는 것을 "출수"라고 해요! 작고 하얀 벼꽃이 피어 수정을 한답니다.'
            },
            {
                id: 5,
                name: '5단계: 황금 벼로 익어가기 (등숙)',
                season: '🌾 9월 풍요로운 가을',
                day: 155,
                goal: '낟알이 무거워질 때 참새를 쫓고, 햇빛과 허수아비로 황금 들판을 완성해요!',
                tip: '💡 낟알이 차오르는 과정을 "등숙"이라고 해요. 허수아비가 참새를 쫓아주면 낟알이 황금빛으로 익어요!'
            },
            {
                id: 6,
                name: '2단계: 벼알의 6단계 가공 여정 (탈곡·건조·저장·도정·선별·포장)',
                shortName: '2단계: 벼알의 6단계 가공 여정',
                season: '🍚 10월 결실의 계절',
                day: 170,
                goal: '벼알의 설명을 잘 듣고 아래 섞여 있는 가공 도구 중 알맞은 버튼을 찾아 눌러요!',
                tip: '💡 벼알 ➔ 탈곡 ➔ 건조 ➔ 저장 ➔ 도정(왕겨/현미/백미) ➔ 선별 ➔ 포장 & 쌀밥 완성!'
            }
        ];

        // 3단계: 여름 벼 친환경 생태논 집중 체험 (오리와 우렁이 각 2회 보살핌)
        this.stage3SubIndex = 0;
        this.stage3EcoSteps = [
            {
                tool: 'duck',
                bubble: '해충(벼멸구)이 줄기를 갉아먹어요! 친환경으로 벌레를 잡아먹는 [🦆 오리농법]을 보내줘요!',
                icon: '🦆',
                speech: '"오리는 벼를 해치는 벼멸구와 잎벌레를 꿀꺽 잡아먹고, 흙탕물을 일으켜 잡초 씨앗이 햇빛을 못 받게 막아줘요! [🦆 오리농법]을 눌러주세요!"',
                tip: '💡 [오리농법 1차] 해충 퇴치: 화학 농약 없이 오리가 벼멸구와 벌레들을 싹 잡아먹어요!'
            },
            {
                tool: 'snail',
                bubble: '논바닥에 잡초가 무성해요! 농약 대신 부드러운 잡초를 싹 뜯어먹는 [🐌 우렁이농법]을 불러줘요!',
                icon: '🐌',
                speech: '"왕우렁이는 벼는 건드리지 않고 연한 잡초만 골라 먹어치워 화학 제초제가 전혀 필요 없어요! [🐌 우렁이농법]을 눌러주세요!"',
                tip: '💡 [우렁이농법 1차] 제초 효과: 풀을 좋아하는 왕우렁이가 잡초를 맛있게 먹어치워요!'
            },
            {
                tool: 'duck',
                bubble: '오리들이 신나게 발장구를 치며 잡초를 억제하고 유기농 거름을 줘요! 한 번 더 [🦆 오리농법] 출동!',
                icon: '🦆',
                speech: '"오리의 활발한 헤엄은 논물에 산소를 듬뿍 넣고, 오리의 배설물은 벼가 자라는 최고의 유기농 영양분이 돼요! [🦆 오리농법] 한 번 더!"',
                tip: '💡 [오리농법 2차] 산소 공급 & 유기 거름: 발장구로 논바닥을 숨 쉬게 하고 거름을 공급해요!'
            },
            {
                tool: 'snail',
                bubble: '왕우렁이 군단이 벼 포기 사이사이 남은 잡초까지 말끔히 청소해요! 한 번 더 [🐌 우렁이농법]!',
                icon: '🐌',
                speech: '"우렁이들 덕분에 제초제 한 방울 없이 잡초가 싹 사라졌어요! 깨끗한 친환경 생태논 완성을 위해 [🐌 우렁이농법] 한 번 더!"',
                tip: '💡 [우렁이농법 2차] 완벽한 생태 청소: 우렁이 덕분에 건강하고 깨끗한 생태논이 완성돼요!'
            }
        ];

        // 6단계(2단계: 벼알의 가공 여정) 초등 저학년 맞춤 6대 단계 정의
        this.s6_subStep = 0;
        this.part2Steps = [
            {
                step: 0,
                tool: 'thresh',
                toolLabel: '탈곡',
                toolIcon: '🚜',
                name: '탈곡 (벼알 톡톡 털기)',
                bubble: '벼 줄기에서 알알이 매달린 나를 "톡톡!" 털어내 분리해 줘! 무엇이 필요할까?',
                speech: '"안녕 친구야! 벼 줄기에 매달린 벼알 친구들을 톡톡! 털어내는 작업이야! 아래 섞여 있는 버튼 중에서 [탈곡]을 찾아 꾹 눌러보자!"',
                tip: '💡 [탈곡] 톡톡 털기! 벼 줄기에서 벼알 친구들을 톡톡 털어내요!'
            },
            {
                step: 1,
                tool: 'dry',
                toolLabel: '건조',
                toolIcon: '♨️',
                name: '건조 (뽀송뽀송 말리기)',
                bubble: '방금 따서 물기가 축축해요! 따뜻한 바람으로 뽀송뽀송하게 말려줄래?',
                speech: '"방금 수확한 벼알은 축축해서 그대로 두면 상해요! 따뜻한 바람으로 뽀송뽀송 말려주는 [건조] 버튼을 찾아보자!"',
                tip: '💡 [건조] 뽀송뽀송 말리기! 물기를 잘 말려서 튼튼하고 신선하게 보관해요!'
            },
            {
                step: 2,
                tool: 'store',
                toolLabel: '저장',
                toolIcon: '🏭',
                name: '저장 (시원한 창고 보관)',
                bubble: '잘 말랐으니 시원한 비밀 창고에 쏙 넣어서 소중히 보관해 줘!',
                speech: '"쥐나 벌레가 다가오지 못하게, 시원하고 깨끗한 창고에 쏙 넣어두는 [저장] 버튼을 찾아 꾹 눌러보자!"',
                tip: '💡 [저장] 시원한 창고 보관! 1년 내내 싱싱하고 맛있게 지켜주는 안전 창고예요!'
            },
            {
                step: 3,
                tool: 'mill',
                toolLabel: '도정',
                toolIcon: '⚙️',
                name: '도정 (노란 옷 벗겨 쌀 만들기)',
                bubble: '노란 겉옷(왕겨) 벗으면 갈색 [현미]! 속옷(쌀겨)까지 깎으면 하얀 [백미]가 돼!',
                speech: '"딱딱한 노란 겉껍질을 벗겨 갈색 [현미]로, 하얗게 깎아 부드러운 [백미]로 찧어주는 [도정] 버튼을 찾아보자!"',
                tip: '💡 [도정] 옷 벗겨 쌀 만들기! 겉옷 벗기면 [현미] ➔ 하얗게 깎으면 맛있는 [백미] 완성!'
            },
            {
                step: 4,
                tool: 'sort',
                toolLabel: '선별',
                toolIcon: '🔍',
                name: '선별 (예쁜 쌀 골라내기)',
                bubble: '깨진 쌀이나 작은 돌멩이는 안녕! 반짝반짝 예쁜 쌀만 쏙쏙 골라내 줄래?',
                speech: '"깨진 쌀이나 작은 돌멩이를 쏙쏙 골라내고 최고로 예쁜 쌀만 남기는 [선별] 버튼을 찾아 눌러보자!"',
                tip: '💡 [선별] 예쁜 쌀 골라내기! 깨진 쌀과 돌멩이를 쏙 골라내고 최고 품질 쌀만 모아요!'
            },
            {
                step: 5,
                tool: 'pack',
                toolLabel: '포장',
                toolIcon: '📦',
                name: '포장 (포대에 쏙 담아 밥짓기)',
                bubble: '우리가 키운 최고의 쌀을 예쁜 포대에 쏙 담고, 윤기 나는 쌀밥을 짓자!',
                speech: '"완성된 쌀을 예쁜 쌀 포대에 쏙 담아 포장하고, 가마솥에 김이 모락모락 밥을 짓는 마지막 [포장] 버튼을 눌러줘!"',
                tip: '💡 [포장 & 쌀밥] 예쁜 포대에 쏙! 김이 모락모락 윤기 나는 따끈한 쌀밥 완성!'
            }
        ];

        // 가능한 요구사항 목록 (1단계: 벼의 한살이 도구 키와 매칭)
        this.needListByStage = {
            1: [
                { tool: 'water', bubble: '목이 말라요! 시원한 물을 주세요! 💧', icon: '💧' },
                { tool: 'sun', bubble: '따스한 봄 햇살을 쬐고 싶어요! ☀️', icon: '☀️' },
                { tool: 'love', bubble: '사랑의 쓰담쓰담으로 예뻐해 줘요! 💖', icon: '💖' },
                { tool: 'farmer', bubble: '흙을 부드럽게 북돋우고 씨앗을 다독여줘요! 🤲', icon: '🤲' }
            ],
            2: [
                { tool: 'water', bubble: '논물이 마르면 안 돼요! 물을 대줘요! 💧', icon: '💧' },
                { tool: 'sun', bubble: '햇빛을 듬뿍 받아 푸르게 자랄래요! ☀️', icon: '☀️' },
                { tool: 'love', bubble: '무럭무럭 자라라고 쓰담쓰담 안아줘요! 💖', icon: '💖' },
                { tool: 'farmer', bubble: '모가 잘 서도록 흙을 북돋우고 손길로 다져줘요! 🤲', icon: '🤲' },
                { tool: 'drain', bubble: '뿌리가 숨 쉬게 살짝 바람을 통하게 해줘요! 🚪', icon: '🚪' }
            ],
            3: [
                { tool: 'duck', bubble: '벌레가 줄기를 갉아먹어요! 오리야 도와줘! 🦆', icon: '🦆' },
                { tool: 'snail', bubble: '잡초가 간지러워요! 우렁이를 보내줘요! 🐌', icon: '🐌' },
                { tool: 'farmer', bubble: '숨어있는 잡초를 꼼꼼히 뽑아주세요! 농부의 손길! 🤲', icon: '🤲' },
                { tool: 'water', bubble: '줄기가 쑥쑥 크려면 시원한 물이 필요해요! 💧', icon: '💧' },
                { tool: 'love', bubble: '새끼치기 잘했다고 칭찬 쓰담쓰담! 💖', icon: '💖' },
                { tool: 'drain', bubble: '헛새끼 방지! 중간 물 떼기를 해줘요! 🚪', icon: '🚪' }
            ],
            4: [
                { tool: 'sun', bubble: '벼꽃이 피었어요! 따스한 햇빛이 필요해요! ☀️', icon: '☀️' },
                { tool: 'water', bubble: '이삭에 영양이 차오르도록 맑은 물을 주세요! 💧', icon: '💧' },
                { tool: 'farmer', bubble: '이삭이 무거워 쓰러지지 않게 줄기를 보살펴줘요! 🤲', icon: '🤲' },
                { tool: 'love', bubble: '예쁜 벼꽃에 사랑의 쓰담쓰담을 보내줘요! 💖', icon: '💖' }
            ],
            5: [
                { tool: 'scarecrow', bubble: '참새 떼가 낟알을 쪼아먹으려 해요! 허수아비 춤춰줘! 🧑‍🌾', icon: '🧑‍🌾' },
                { tool: 'sun', bubble: '낟알이 황금빛으로 무르익게 햇빛을 비춰줘요! ☀️', icon: '☀️' },
                { tool: 'farmer', bubble: '황금빛으로 고개 숙인 벼를 농부의 손길로 살펴줘요! 🤲', icon: '🤲' },
                { tool: 'love', bubble: '황금 벼야 잘 익어라~ 사랑의 쓰담쓰담! 💖', icon: '💖' }
            ]
        };
    }

    start(initialStage = 1, initialSub = 0) {
        const queryStr = window.location.search || (window.location.hash ? window.location.hash.substring(1) : '');
        const urlParams = new URLSearchParams(queryStr);
        const stageParam = parseInt(urlParams.get('stage'), 10);
        const subParam = parseInt(urlParams.get('sub'), 10);

        this.currentStage = (!isNaN(stageParam) && stageParam >= 1 && stageParam <= 6) ? stageParam : initialStage;
        this.stageProgress = 0;
        this.totalRipeningPct = 0;
        this.s6_subStep = (!isNaN(subParam) && subParam >= 0 && subParam <= 5) ? subParam : initialSub;
        this.pickNewNeed();
        this.renderStage();
    }

    pickNewNeed() {
        if (this.currentStage >= 6) {
            this.currentNeed = null;
            return;
        }
        if (this.currentStage === 3) {
            if (this.stage3SubIndex < this.stage3EcoSteps.length) {
                this.currentNeed = this.stage3EcoSteps[this.stage3SubIndex];
            } else {
                this.currentNeed = this.stage3EcoSteps[this.stage3EcoSteps.length - 1];
            }
            return;
        }
        const pool = this.needListByStage[this.currentStage] || this.needListByStage[1];
        // 이전 요구사항과 다른 것 선택
        let next = pool[Math.floor(Math.random() * pool.length)];
        if (this.currentNeed && pool.length > 1) {
            while (next.tool === this.currentNeed.tool) {
                next = pool[Math.floor(Math.random() * pool.length)];
            }
        }
        this.currentNeed = next;
    }

    renderStage() {
        const info = this.stageInfo[this.currentStage - 1];

        // 상단 헤더 HUD
        const stagePill = document.getElementById('stagePillName');
        if (stagePill) stagePill.innerText = info.shortName || info.name;
        const month = document.getElementById('monthBadge');
        if (month) month.innerText = info.season;
        const day = document.getElementById('farmDay');
        if (day) day.innerText = `${info.day}일째`;
        const badge = document.getElementById('stageBadge');
        if (badge) badge.innerText = `${this.currentStage} / ${this.totalStages} 단계`;

        // 1단계(8대 도구) vs 2단계(6대 도구) 하단 툴바 토글
        const bar1 = document.getElementById('toolbarPart1');
        const bar2 = document.getElementById('toolbarPart2');
        if (this.currentStage <= 5) {
            if (bar1) bar1.style.display = 'flex';
            if (bar2) bar2.style.display = 'none';
        } else {
            if (bar1) bar1.style.display = 'none';
            if (bar2) bar2.style.display = 'flex';
            this.stageProgress = Math.min(100, Math.round((this.s6_subStep / 6) * 100));
        }

        this.calculateTotalRipening();

        const view = document.getElementById('mainStageCanvasArea');
        if (!view) return;

        view.innerHTML = `
            <div class="game-stage-layout">
                <!-- 1. [좌측] 벼가 익어가기까지의 세로형 게이지 타워 -->
                <aside class="ripening-gauge-tower" title="벼 익어감 전체 진행도">
                    <div class="tower-header">
                        <span class="tower-icon">🌾</span>
                        <div class="tower-title">벼 익어감</div>
                        <div class="tower-pct" id="sideGaugePctText">${Math.round(this.totalRipeningPct)}%</div>
                    </div>

                    <div class="gauge-tube-container">
                        <div class="gauge-tube">
                            <div class="gauge-liquid" id="sideGaugeLiquid" style="height: ${this.totalRipeningPct}%;"></div>
                        </div>

                        <div class="gauge-milestones">
                            <div class="milestone-item ${this.currentStage >= 6 ? 'reached' : ''}" style="bottom: 88%;">
                                <span class="m-icon">🍚</span><span class="m-txt">쌀밥</span>
                            </div>
                            <div class="milestone-item ${this.currentStage >= 5 ? 'reached' : ''}" style="bottom: 70%;">
                                <span class="m-icon">🌾</span><span class="m-txt">황금벼</span>
                            </div>
                            <div class="milestone-item ${this.currentStage >= 4 ? 'reached' : ''}" style="bottom: 52%;">
                                <span class="m-icon">🌸</span><span class="m-txt">벼꽃·이삭</span>
                            </div>
                            <div class="milestone-item ${this.currentStage >= 3 ? 'reached' : ''}" style="bottom: 35%;">
                                <span class="m-icon">🌿</span><span class="m-txt">여름벼</span>
                            </div>
                            <div class="milestone-item ${this.currentStage >= 2 ? 'reached' : ''}" style="bottom: 18%;">
                                <span class="m-icon">🌱</span><span class="m-txt">어린모</span>
                            </div>
                            <div class="milestone-item ${this.currentStage >= 1 ? 'reached' : ''}" style="bottom: 2%;">
                                <span class="m-icon">🌰</span><span class="m-txt">볍씨</span>
                            </div>
                        </div>
                    </div>
                </aside>

                <!-- 2. [중앙 & 우측] 메인 벼 캐릭터 & 농장 씬 -->
                <section class="farm-center-stage">
                    <div class="stage-guide-card">
                        <div class="guide-title">
                            <span class="guide-badge">${info.name}</span>
                            <span class="guide-goal">${info.goal}</span>
                        </div>
                        <div class="guide-tip">${info.tip}</div>
                    </div>

                    <!-- 벼 그래픽 씬 (크고 풍성한 뷰) -->
                    <div class="rice-display-canvas" id="riceDisplayCanvas">
                        <div class="scenic-sun">☀️</div>
                        <div class="scenic-cloud">☁️</div>

                        <!-- 벼 및 벼알 머리 위에 항상 떠 있는 실시간 요구사항 말풍선 -->
                        ${this.currentStage < 6 ? (this.currentNeed ? `
                            <div class="rice-need-callout bounce-anim" id="riceNeedCallout">
                                <span class="need-icon">${this.currentNeed.icon}</span>
                                <span class="need-text">${this.currentNeed.bubble}</span>
                            </div>
                        ` : '') : (this.s6_subStep < 6 ? `
                            <div class="rice-need-callout bounce-anim" id="riceNeedCallout">
                                <span class="need-icon">${this.part2Steps[this.s6_subStep].toolIcon}</span>
                                <span class="need-text">${this.part2Steps[this.s6_subStep].bubble}</span>
                            </div>
                        ` : '')}

                        ${this.getBigRiceGraphic(this.currentStage)}
                    </div>

                    <!-- 대화 및 반응 피드백 알림바 -->
                    <div class="character-speech-bubble" id="characterSpeech">
                        ${this.getInitialSpeech(this.currentStage)}
                    </div>

                    <!-- 단계별 하단 진행도 바 -->
                    <div class="stage-progress-card">
                        <div class="step-progress-label">
                            <span id="stepProgressTitle">${this.currentStage === 6 ? '벼알의 6단계 가공 진행도:' : '현재 단계 정성도:'}</span>
                            <strong id="stepPctText">${this.stageProgress}%</strong>
                        </div>
                        <div class="step-track">
                            <div class="step-fill" id="stepFillBar" style="width: ${this.stageProgress}%;"></div>
                        </div>
                    </div>
                </section>
            </div>
        `;

        this.updateGauges();
    }

    calculateTotalRipening() {
        const base = ((this.currentStage - 1) / this.totalStages) * 100;
        const currentStepContribution = (this.stageProgress / 100) * (100 / this.totalStages);
        this.totalRipeningPct = Math.min(100, Math.round(base + currentStepContribution));
        
        const topBar = document.getElementById('overallProgressBar');
        if (topBar) topBar.style.width = `${this.totalRipeningPct}%`;
    }

    getBigRiceGraphic(stage) {
        if (stage === 1) {
            // 1단계: 귀여운 볍씨와 연두빛 새싹
            const sproutScale = Math.max(0.3, (this.stageProgress / 100) * 1.3);
            return `
                <div class="svg-rice-wrapper stage-1-scene">
                    <svg viewBox="0 0 380 305" class="rice-hero-svg">
                        <!-- 반투명 유리 물 대야 -->
                        <ellipse cx="190" cy="180" rx="145" ry="50" fill="#90CAF9" stroke="#1976D2" stroke-width="5"/>
                        <ellipse cx="190" cy="172" rx="135" ry="38" fill="#E1F5FE"/>
                        <path d="M 75 170 Q 130 158 190 170 T 305 170" stroke="#42A5F5" stroke-width="4" fill="none" opacity="0.85"/>

                        <!-- 큼직하고 사랑스러운 볍씨 캐릭터 -->
                        <g class="bouncing-seed" id="mainSeedGraphic" transform="translate(190, 150)">
                            <ellipse cx="0" cy="0" rx="58" ry="40" fill="#FFB300" stroke="#E65100" stroke-width="4.5" transform="rotate(-10)"/>
                            <path d="M -40 -10 Q 0 8 40 4" stroke="#FFA000" stroke-width="4" fill="none"/>
                            <path d="M -32 -22 Q 0 -6 32 -10" stroke="#FFA000" stroke-width="3" fill="none"/>

                            <!-- 큰 눈망울 & 입 -->
                            <circle cx="-18" cy="-6" r="6" fill="#3E2723"/>
                            <circle cx="-16" cy="-8" r="2.2" fill="#FFFFFF"/>
                            <circle cx="14" cy="-10" r="6" fill="#3E2723"/>
                            <circle cx="16" cy="-12" r="2.2" fill="#FFFFFF"/>
                            <path d="M -6 6 Q 0 15 6 5" stroke="#D84315" stroke-width="3.5" fill="none" stroke-linecap="round"/>

                            <circle cx="-26" cy="4" r="8" fill="#FF8A80" opacity="0.85"/>
                            <circle cx="24" cy="-2" r="8" fill="#FF8A80" opacity="0.85"/>

                            <!-- 연두색 싹 -->
                            <g class="sprout-grow" id="seedSproutElement" transform="scale(${sproutScale})" style="opacity: ${this.stageProgress > 5 ? '1' : '0'};">
                                <path d="M -8 -36 Q -28 -85 0 -100" stroke="#4CAF50" stroke-width="10" fill="none" stroke-linecap="round"/>
                                <path d="M 0 -95 Q 26 -112 38 -95 Q 20 -85 0 -95" fill="#81C784" stroke="#388E3C" stroke-width="2.5"/>
                                <circle cx="0" cy="-100" r="4.5" fill="#C8E6C9"/>
                            </g>
                        </g>

                        <!-- 싹 틔우는 중 상태 캡슐 (접시 밑으로 충분한 간격을 두어 시원하게 배치) -->
                        <g class="seed-progress-group" transform="translate(190, 276)">
                            <rect x="-135" y="-14" width="270" height="28" rx="14" fill="#FFFFFF" fill-opacity="0.94" stroke="#90CAF9" stroke-width="1.8"/>
                            <text x="0" y="5" id="seedProgressLabel" text-anchor="middle" font-size="13.5" font-weight="900" fill="#0D47A1">
                                💧 따뜻한 물에서 싹을 틔우는 중 (${this.stageProgress}%)
                            </text>
                        </g>
                    </svg>
                </div>
            `;
        } else if (stage === 2) {
            // 2단계: 어린 모 (모내기)
            return `
                <div class="svg-rice-wrapper stage-2-scene">
                    <svg viewBox="0 0 380 270" class="rice-hero-svg">
                        <rect x="25" y="185" width="330" height="65" rx="16" fill="#5D4037"/>
                        <rect x="30" y="178" width="320" height="28" rx="10" fill="#29B6F6" opacity="0.6"/>

                        <g class="swaying-plant" transform="translate(90, 190)">
                            <path d="M 0 0 Q -18 -65 -32 -115" stroke="#4CAF50" stroke-width="6.5" fill="none" stroke-linecap="round"/>
                            <path d="M 0 0 Q 0 -80 0 -130" stroke="#66BB6A" stroke-width="7.5" fill="none" stroke-linecap="round"/>
                            <path d="M 0 0 Q 20 -60 38 -105" stroke="#4CAF50" stroke-width="6.5" fill="none" stroke-linecap="round"/>
                        </g>

                        <g class="swaying-plant main-plant" id="mainPlantElem" transform="translate(190, 190)">
                            <path d="M 0 0 Q -30 -75 -52 -145" stroke="#388E3C" stroke-width="7.5" fill="none" stroke-linecap="round"/>
                            <path d="M 0 0 Q 0 -95 4 -168" stroke="#4CAF50" stroke-width="9.5" fill="none" stroke-linecap="round"/>
                            <path d="M 0 0 Q 30 -70 52 -135" stroke="#66BB6A" stroke-width="7.5" fill="none" stroke-linecap="round"/>
                            <!-- 눈망울, 반짝이 하이라이트, 방긋 입, 발그레한 볼 -->
                            <circle cx="-11" cy="-60" r="5.5" fill="#1B5E20"/>
                            <circle cx="-9" cy="-62" r="2" fill="#FFFFFF"/>
                            <circle cx="13" cy="-60" r="5.5" fill="#1B5E20"/>
                            <circle cx="15" cy="-62" r="2" fill="#FFFFFF"/>
                            <circle cx="-18" cy="-52" r="6" fill="#FF8A80" opacity="0.85"/>
                            <circle cx="20" cy="-52" r="6" fill="#FF8A80" opacity="0.85"/>
                            <path d="M -3 -48 Q 2 -40 7 -48" stroke="#1B5E20" stroke-width="3" fill="none" stroke-linecap="round"/>
                        </g>

                        <g class="swaying-plant" transform="translate(290, 190)">
                            <path d="M 0 0 Q -18 -60 -30 -110" stroke="#4CAF50" stroke-width="6.5" fill="none" stroke-linecap="round"/>
                            <path d="M 0 0 Q 0 -75 0 -125" stroke="#66BB6A" stroke-width="7.5" fill="none" stroke-linecap="round"/>
                            <path d="M 0 0 Q 18 -55 35 -100" stroke="#4CAF50" stroke-width="6.5" fill="none" stroke-linecap="round"/>
                        </g>
                    </svg>
                </div>
            `;
        } else if (stage === 3) {
            // 3단계: 여름 벼 (새끼치기 & 오리/우렁이)
            return `
                <div class="svg-rice-wrapper stage-3-scene">
                    <svg viewBox="0 0 380 270" class="rice-hero-svg">
                        <ellipse cx="190" cy="220" rx="155" ry="32" fill="#0288D1" opacity="0.4"/>
                        <ellipse cx="190" cy="228" rx="145" ry="24" fill="#4E342E"/>

                        <g class="swaying-bush" id="mainPlantElem" transform="translate(190, 215)">
                            <path d="M 0 0 Q -55 -85 -92 -165" stroke="#2E7D32" stroke-width="7.5" fill="none" stroke-linecap="round"/>
                            <path d="M 0 0 Q -32 -105 -60 -185" stroke="#388E3C" stroke-width="8.5" fill="none" stroke-linecap="round"/>
                            <path d="M 0 0 Q -14 -115 -20 -200" stroke="#4CAF50" stroke-width="9.5" fill="none" stroke-linecap="round"/>
                            <path d="M 0 0 Q 14 -115 20 -200" stroke="#4CAF50" stroke-width="9.5" fill="none" stroke-linecap="round"/>
                            <path d="M 0 0 Q 32 -105 60 -185" stroke="#388E3C" stroke-width="8.5" fill="none" stroke-linecap="round"/>
                            <path d="M 0 0 Q 55 -85 92 -165" stroke="#2E7D32" stroke-width="7.5" fill="none" stroke-linecap="round"/>
                            <path d="M 0 0 Q -75 -65 -112 -135" stroke="#43A047" stroke-width="6.5" fill="none"/>
                            <path d="M 0 0 Q 75 -65 112 -135" stroke="#43A047" stroke-width="6.5" fill="none"/>

                            <!-- 초롱초롱 눈, 하이라이트, 활짝 웃는 입, 볼터치 -->
                            <circle cx="-14" cy="-80" r="6" fill="#1B5E20"/>
                            <circle cx="-12" cy="-82" r="2.2" fill="#FFFFFF"/>
                            <circle cx="14" cy="-80" r="6" fill="#1B5E20"/>
                            <circle cx="16" cy="-82" r="2.2" fill="#FFFFFF"/>
                            <circle cx="-23" cy="-72" r="7" fill="#FF8A80" opacity="0.85"/>
                            <circle cx="23" cy="-72" r="7" fill="#FF8A80" opacity="0.85"/>
                            <path d="M -7 -66 Q 0 -58 7 -66" stroke="#1B5E20" stroke-width="3.5" fill="none" stroke-linecap="round"/>
                        </g>

                        <!-- 직접 탭할 수 있는 오리와 우렁이 생태 친구들 -->
                        <text x="30" y="222" font-size="38" class="interactive-animal" onclick="window.storyMode.applyToolAction('duck')" title="오리 탭!">🦆</text>
                        <text x="305" y="226" font-size="32" class="interactive-animal" onclick="window.storyMode.applyToolAction('snail')" title="우렁이 탭!">🐌</text>
                    </svg>
                </div>
            `;
        } else if (stage === 4) {
            // 4단계: 벼꽃과 이삭 패기 (출수)
            return `
                <div class="svg-rice-wrapper stage-4-scene">
                    <svg viewBox="0 0 380 270" class="rice-hero-svg">
                        <g opacity="0.4" stroke="#FBC02D" stroke-width="2.5">
                            <line x1="190" y1="0" x2="65" y2="155"/>
                            <line x1="190" y1="0" x2="190" y2="165"/>
                            <line x1="190" y1="0" x2="315" y2="155"/>
                        </g>
                        <ellipse cx="190" cy="225" rx="155" ry="30" fill="#0288D1" opacity="0.3"/>

                        <g class="swaying-bush" id="mainPlantElem" transform="translate(190, 215)">
                            <path d="M 0 0 Q -28 -105 -16 -185 Q -9 -218 -48 -228" stroke="#4CAF50" stroke-width="8.5" fill="none"/>
                            <path d="M 0 0 Q 22 -105 16 -185 Q 24 -218 58 -222" stroke="#4CAF50" stroke-width="8.5" fill="none"/>
                            <path d="M 0 0 Q -55 -85 -85 -150" stroke="#388E3C" stroke-width="7.5" fill="none"/>
                            <path d="M 0 0 Q 55 -85 85 -150" stroke="#388E3C" stroke-width="7.5" fill="none"/>

                            <!-- 주렁주렁 매달린 연두빛 이삭 낟알들 -->
                            <g fill="#81C784" stroke="#2E7D32" stroke-width="2">
                                <ellipse cx="-45" cy="-226" rx="7.5" ry="4.5" transform="rotate(25 -45 -226)"/>
                                <ellipse cx="-36" cy="-218" rx="7.5" ry="4.5" transform="rotate(30 -36 -218)"/>
                                <ellipse cx="-27" cy="-207" rx="7.5" ry="4.5" transform="rotate(35 -27 -207)"/>
                                <ellipse cx="-19" cy="-195" rx="7.5" ry="4.5" transform="rotate(40 -19 -195)"/>

                                <ellipse cx="55" cy="-220" rx="7.5" ry="4.5" transform="rotate(-25 55 -220)"/>
                                <ellipse cx="46" cy="-212" rx="7.5" ry="4.5" transform="rotate(-30 46 -212)"/>
                                <ellipse cx="37" cy="-201" rx="7.5" ry="4.5" transform="rotate(-35 37 -201)"/>
                                <ellipse cx="28" cy="-189" rx="7.5" ry="4.5" transform="rotate(-40 28 -189)"/>
                            </g>

                            <!-- 하얀 벼꽃들 🌸 -->
                            <g fill="#FFFFFF" stroke="#FFF9C4" stroke-width="1.5">
                                <circle cx="-48" cy="-234" r="4"/>
                                <circle cx="-38" cy="-226" r="4"/>
                                <circle cx="58" cy="-228" r="4"/>
                                <circle cx="48" cy="-220" r="4"/>
                            </g>

                            <!-- 벼 캐릭터 얼굴 -->
                            <g transform="translate(0, -90)">
                                <circle cx="-14" cy="0" r="6" fill="#1B5E20"/>
                                <circle cx="-12" cy="-2" r="2.2" fill="#FFFFFF"/>
                                <circle cx="14" cy="0" r="6" fill="#1B5E20"/>
                                <circle cx="16" cy="-2" r="2.2" fill="#FFFFFF"/>
                                <circle cx="-23" cy="8" r="7" fill="#FF8A80" opacity="0.85"/>
                                <circle cx="23" cy="8" r="7" fill="#FF8A80" opacity="0.85"/>
                                <path d="M -6 12 Q 0 20 6 12" stroke="#1B5E20" stroke-width="3.5" fill="none" stroke-linecap="round"/>
                            </g>
                        </g>
                    </svg>
                </div>
            `;
        } else if (stage === 5) {
            // 5단계: 황금 벼 (허수아비 그래픽 제거 및 황금벼 중앙 정렬)
            return `
                <div class="svg-rice-wrapper stage-5-scene">
                    <svg viewBox="0 0 380 270" class="rice-hero-svg">
                        <circle cx="190" cy="115" r="110" fill="#FFF9C4" opacity="0.65"/>

                        <g class="swaying-bush" id="mainPlantElem" transform="translate(190, 220)">
                            <path d="M 0 0 Q -28 -105 -16 -180 Q 6 -220 -60 -210" stroke="#FBC02D" stroke-width="9.5" fill="none"/>
                            <path d="M 0 0 Q 22 -105 16 -180 Q 38 -220 80 -205" stroke="#FBC02D" stroke-width="9.5" fill="none"/>
                            <path d="M 0 0 Q -55 -75 -85 -140" stroke="#F57F17" stroke-width="7.5" fill="none"/>
                            <path d="M 0 0 Q 55 -75 85 -140" stroke="#F57F17" stroke-width="7.5" fill="none"/>

                            <!-- 황금 낟알들 -->
                            <g fill="#FFD700" stroke="#E65100" stroke-width="2.5">
                                <ellipse cx="-60" cy="-210" rx="9.5" ry="6" transform="rotate(30 -60 -210)"/>
                                <ellipse cx="-47" cy="-201" rx="9.5" ry="6" transform="rotate(35 -47 -201)"/>
                                <ellipse cx="-34" cy="-190" rx="9.5" ry="6" transform="rotate(40 -34 -190)"/>
                                <ellipse cx="-21" cy="-178" rx="9.5" ry="6" transform="rotate(45 -21 -178)"/>

                                <ellipse cx="80" cy="-205" rx="9.5" ry="6" transform="rotate(-30 80 -205)"/>
                                <ellipse cx="67" cy="-196" rx="9.5" ry="6" transform="rotate(-35 67 -196)"/>
                                <ellipse cx="54" cy="-185" rx="9.5" ry="6" transform="rotate(-40 54 -185)"/>
                                <ellipse cx="40" cy="-172" rx="9.5" ry="6" transform="rotate(-45 40 -172)"/>
                            </g>

                            <!-- 황금 벼 캐릭터 얼굴 -->
                            <g transform="translate(0, -90)">
                                <circle cx="-14" cy="0" r="6" fill="#E65100"/>
                                <circle cx="-12" cy="-2" r="2.2" fill="#FFFFFF"/>
                                <circle cx="14" cy="0" r="6" fill="#E65100"/>
                                <circle cx="16" cy="-2" r="2.2" fill="#FFFFFF"/>
                                <circle cx="-23" cy="8" r="7" fill="#FF8A80" opacity="0.85"/>
                                <circle cx="23" cy="8" r="7" fill="#FF8A80" opacity="0.85"/>
                                <path d="M -6 12 Q 0 22 6 12" stroke="#E65100" stroke-width="3.5" fill="none" stroke-linecap="round"/>
                            </g>
                        </g>
                    </svg>
                </div>
            `;
        } else {
            // 6단계: 2단계 벼알의 6단계 가공 여정 그래픽
            return this.getPart2GrainGraphic();
        }
    }

    // 2단계: 벼알의 6단계 가공 여정 고화질 인터랙티브 씬
    getPart2GrainGraphic() {
        switch (this.s6_subStep) {
            case 0:
                // 1. 탈곡 (Threshing) 대기
                return `
                    <div class="svg-rice-wrapper stage-6-scene">
                        <svg viewBox="0 0 380 270" class="rice-hero-svg">
                            <circle cx="190" cy="120" r="110" fill="#FFF9C4" opacity="0.6"/>
                            <!-- 콤바인 트랙터 실루엣 -->
                            <g transform="translate(45, 140) scale(0.65)" opacity="0.85">
                                <rect x="0" y="20" width="80" height="50" rx="8" fill="#D32F2F"/>
                                <rect x="50" y="30" width="40" height="30" rx="4" fill="#B71C1C"/>
                                <circle cx="20" cy="75" r="16" fill="#37474F"/>
                                <circle cx="70" cy="75" r="16" fill="#37474F"/>
                                <circle cx="20" cy="75" r="8" fill="#ECEFF1"/>
                                <circle cx="70" cy="75" r="8" fill="#ECEFF1"/>
                                <text x="40" y="48" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">콤바인</text>
                            </g>
                            <!-- 황금 이삭 줄기 -->
                            <g transform="translate(190, 240)">
                                <path d="M -50 0 Q -25 -100 0 -170" stroke="#FBC02D" stroke-width="7" fill="none"/>
                                <path d="M 50 0 Q 25 -100 0 -170" stroke="#FBC02D" stroke-width="7" fill="none"/>
                            </g>
                            <!-- 주인공: 깜찍하고 사랑스러운 황금 벼알(나락) 캐릭터 -->
                            <g class="bouncing-seed" transform="translate(190, 115)" onclick="window.storyMode.hintClickPart2()" cursor="pointer">
                                <ellipse cx="0" cy="0" rx="46" ry="62" fill="#FFD54F" stroke="#E65100" stroke-width="4.5" transform="rotate(-15)"/>
                                <path d="M -8 -60 Q 0 -72 10 -60" stroke="#E65100" stroke-width="3.5" fill="none"/>
                                <circle cx="-14" cy="-8" r="6" fill="#3E2723"/>
                                <circle cx="-12" cy="-10" r="2.2" fill="#FFFFFF"/>
                                <circle cx="14" cy="-8" r="6" fill="#3E2723"/>
                                <circle cx="16" cy="-10" r="2.2" fill="#FFFFFF"/>
                                <circle cx="-22" cy="5" r="7" fill="#FF8A80" opacity="0.9"/>
                                <circle cx="22" cy="5" r="7" fill="#FF8A80" opacity="0.9"/>
                                <path d="M -8 10 Q 0 20 8 10" stroke="#D84315" stroke-width="3.5" fill="none" stroke-linecap="round"/>
                                <text x="0" y="42" font-size="12" font-weight="900" fill="#E65100" text-anchor="middle">벼알 (나락)</text>
                            </g>
                        </svg>
                        <div class="step-interactive-badge">💡 1단계 퀴즈: 벼 줄기에서 벼알 친구들을 '톡톡' 털어내는 작업은? (아래 버튼 누르기)</div>
                    </div>
                `;
            case 1:
                // 2. 건조 (Drying) 대기
                return `
                    <div class="svg-rice-wrapper stage-6-scene">
                        <svg viewBox="0 0 380 270" class="rice-hero-svg">
                            <circle cx="190" cy="120" r="115" fill="#FFE0B2" opacity="0.6"/>
                            <path d="M 60 70 Q 120 50 180 70 T 300 70" stroke="#FF7043" stroke-width="3" fill="none" stroke-dasharray="8 4"/>
                            <path d="M 70 170 Q 130 150 190 170 T 310 170" stroke="#FF7043" stroke-width="3" fill="none" stroke-dasharray="8 4"/>
                            <g class="bouncing-seed" transform="translate(190, 115)" onclick="window.storyMode.hintClickPart2()" cursor="pointer">
                                <ellipse cx="0" cy="0" rx="46" ry="62" fill="#FFCA28" stroke="#E65100" stroke-width="4.5"/>
                                <circle cx="-14" cy="-8" r="6" fill="#3E2723"/>
                                <circle cx="-12" cy="-10" r="2.2" fill="#FFFFFF"/>
                                <circle cx="14" cy="-8" r="6" fill="#3E2723"/>
                                <circle cx="16" cy="-10" r="2.2" fill="#FFFFFF"/>
                                <circle cx="-22" cy="5" r="7" fill="#FF8A80" opacity="0.9"/>
                                <circle cx="22" cy="5" r="7" fill="#FF8A80" opacity="0.9"/>
                                <path d="M -8 10 Q 0 18 8 10" stroke="#D84315" stroke-width="3.5" fill="none" stroke-linecap="round"/>
                                <circle cx="32" cy="-28" r="5" fill="#42A5F5" opacity="0.8"/>
                                <circle cx="-30" cy="-24" r="4" fill="#42A5F5" opacity="0.8"/>
                                <text x="0" y="44" font-size="12" font-weight="900" fill="#E65100" text-anchor="middle">수분 24% ➔ 15%</text>
                            </g>
                        </svg>
                        <div class="step-interactive-badge">💡 2단계 퀴즈: 축축한 물기를 말려 뽀송뽀송하게 해주는 작업은? (아래 버튼 누르기)</div>
                    </div>
                `;
            case 2:
                // 3. 저장 (Storage) 대기
                return `
                    <div class="svg-rice-wrapper stage-6-scene">
                        <svg viewBox="0 0 380 270" class="rice-hero-svg">
                            <circle cx="190" cy="120" r="115" fill="#E1F5FE" opacity="0.6"/>
                            <g transform="translate(60, 60)" opacity="0.85">
                                <rect x="0" y="40" width="80" height="120" rx="10" fill="#90CAF9" stroke="#1976D2" stroke-width="3"/>
                                <polygon points="-5,40 40,5 85,40" fill="#64B5F6" stroke="#1976D2" stroke-width="3"/>
                                <text x="40" y="90" font-size="12" font-weight="900" fill="#0D47A1" text-anchor="middle">시원한 창고</text>
                                <text x="40" y="115" font-size="11" font-weight="bold" fill="#1565C0" text-anchor="middle">❄️ 시원함 유지</text>
                            </g>
                            <g class="bouncing-seed" transform="translate(235, 125)" onclick="window.storyMode.hintClickPart2()" cursor="pointer">
                                <ellipse cx="0" cy="0" rx="42" ry="56" fill="#FFD54F" stroke="#F57F17" stroke-width="4"/>
                                <circle cx="-12" cy="-6" r="5.5" fill="#3E2723"/>
                                <circle cx="12" cy="-6" r="5.5" fill="#3E2723"/>
                                <circle cx="-18" cy="5" r="6" fill="#FF8A80" opacity="0.85"/>
                                <circle cx="18" cy="5" r="6" fill="#FF8A80" opacity="0.85"/>
                                <path d="M -7 9 Q 0 16 7 9" stroke="#D84315" stroke-width="3" fill="none" stroke-linecap="round"/>
                                <text x="0" y="38" font-size="11" font-weight="900" fill="#E65100" text-anchor="middle">신선 보관 벼알</text>
                            </g>
                        </svg>
                        <div class="step-interactive-badge">💡 3단계 퀴즈: 시원하고 깨끗한 창고에 안전하게 보관하는 작업은? (아래 버튼 누르기)</div>
                    </div>
                `;
            case 3:
                // 4. 도정 (Milling: 왕겨➔현미➔백미) 대기
                return `
                    <div class="svg-rice-wrapper stage-6-scene">
                        <svg viewBox="0 0 380 270" class="rice-hero-svg">
                            <g transform="translate(190, 110)" onclick="window.storyMode.hintClickPart2()" cursor="pointer">
                                <!-- ① 왕겨 (노란 겉껍질) -->
                                <ellipse cx="0" cy="0" rx="120" ry="52" fill="#FFCA28" stroke="#E65100" stroke-width="3.5" stroke-dasharray="8 4"/>
                                <!-- ② 쌀겨 (연갈색 속껍질) -->
                                <ellipse cx="0" cy="0" rx="98" ry="42" fill="#D7CCC8" stroke="#795548" stroke-width="2.5"/>
                                <!-- ④ 백미 (새하얀 쌀 알맹이 배유) -->
                                <ellipse cx="10" cy="0" rx="78" ry="32" fill="#FFFFFF" stroke="#B0BEC5" stroke-width="2"/>
                                <text x="12" y="5" font-size="14" font-weight="900" fill="#263238" text-anchor="middle">④ 백미 (하얀 쌀)</text>
                                <!-- ③ 쌀눈 (영양의 보고 배아) -->
                                <ellipse cx="-64" cy="0" rx="14" ry="18" fill="#FFD54F" stroke="#FF8F00" stroke-width="2.5"/>
                                <text x="-64" y="4" font-size="10" font-weight="900" fill="#5D4037" text-anchor="middle">③쌀눈</text>
                                <!-- 라벨 지시선 -->
                                <line x1="70" y1="-38" x2="105" y2="-55" stroke="#E65100" stroke-width="2"/>
                                <text x="110" y="-52" font-size="11" font-weight="900" fill="#E65100">① 노란 겉옷 벗으면 ➔ [현미]</text>
                                <line x1="60" y1="36" x2="95" y2="55" stroke="#5D4037" stroke-width="2"/>
                                <text x="100" y="58" font-size="11" font-weight="900" fill="#5D4037">② 속옷 깎아내면 ➔ [백미]</text>
                            </g>
                        </svg>
                        <div class="step-interactive-badge">💡 4단계 퀴즈: 노란 겉옷을 벗겨 현미로, 하얗게 깎아 백미로 찧는 작업은? (아래 버튼 누르기)</div>
                    </div>
                `;
            case 4:
                // 5. 선별 (Color Sorting) 대기
                return `
                    <div class="svg-rice-wrapper stage-6-scene">
                        <svg viewBox="0 0 380 270" class="rice-hero-svg">
                            <rect x="50" y="60" width="280" height="130" rx="12" fill="#E0F2F1" stroke="#00897B" stroke-width="3" opacity="0.6"/>
                            <line x1="50" y1="125" x2="330" y2="125" stroke="#00BFA5" stroke-width="2" stroke-dasharray="10 5"/>
                            <g transform="translate(190, 125)" onclick="window.storyMode.hintClickPart2()" cursor="pointer">
                                <g class="bouncing-seed" transform="translate(-65, 0)">
                                     <ellipse cx="0" cy="0" rx="20" ry="32" fill="#FFFFFF" stroke="#00897B" stroke-width="2.5" transform="rotate(-15)"/>
                                    <circle cx="-5" cy="-4" r="3" fill="#263238"/>
                                    <circle cx="5" cy="-4" r="3" fill="#263238"/>
                                    <path d="M -3 4 Q 0 8 3 4" stroke="#00897B" stroke-width="2" fill="none"/>
                                </g>
                                <g class="bouncing-seed" transform="translate(0, -10)">
                                    <ellipse cx="0" cy="0" rx="24" ry="38" fill="#FFFFFF" stroke="#00897B" stroke-width="3"/>
                                    <circle cx="-6" cy="-5" r="3.5" fill="#263238"/>
                                    <circle cx="6" cy="-5" r="3.5" fill="#263238"/>
                                    <circle cx="-10" cy="3" r="4" fill="#FF8A80" opacity="0.8"/>
                                    <circle cx="10" cy="3" r="4" fill="#FF8A80" opacity="0.8"/>
                                    <path d="M -4 5 Q 0 11 4 5" stroke="#00897B" stroke-width="2.2" fill="none"/>
                                    <text x="0" y="28" font-size="10" font-weight="900" fill="#00695C" text-anchor="middle">예쁜 쌀</text>
                                </g>
                                <g class="bouncing-seed" transform="translate(65, 0)">
                                    <ellipse cx="0" cy="0" rx="20" ry="32" fill="#FFFFFF" stroke="#00897B" stroke-width="2.5" transform="rotate(15)"/>
                                    <circle cx="-5" cy="-4" r="3" fill="#263238"/>
                                    <circle cx="5" cy="-4" r="3" fill="#263238"/>
                                    <path d="M -3 4 Q 0 8 3 4" stroke="#00897B" stroke-width="2" fill="none"/>
                                </g>
                            </g>
                        </svg>
                        <div class="step-interactive-badge">💡 5단계 퀴즈: 깨진 쌀과 작은 돌을 쏙 골라내고 예쁜 쌀만 모으는 작업은? (아래 버튼 누르기)</div>
                    </div>
                `;
            case 5:
                // 6. 포장 (Packing) 대기 & 밥짓기
                return `
                    <div class="svg-rice-wrapper stage-6-scene">
                        <svg viewBox="0 0 380 270" class="rice-hero-svg">
                            <g transform="translate(100, 110)" onclick="window.storyMode.hintClickPart2()" cursor="pointer">
                                <rect x="-35" y="-45" width="70" height="90" rx="8" fill="#FFF8E1" stroke="#8D6E63" stroke-width="3.5"/>
                                <path d="M -35 -30 L 35 -30" stroke="#D7CCC8" stroke-width="2.5"/>
                                <text x="0" y="-12" font-size="11" font-weight="900" fill="#D84315" text-anchor="middle">2026 햅쌀</text>
                                <text x="0" y="10" font-size="14" font-weight="900" fill="#2E7D32" text-anchor="middle">특등 백미</text>
                                <text x="0" y="28" font-size="10" font-weight="bold" fill="#795548" text-anchor="middle">쌀 포대</text>
                            </g>
                            <g transform="translate(255, 120)">
                                <ellipse cx="0" cy="15" rx="55" ry="32" fill="#37474F" stroke="#212121" stroke-width="4"/>
                                <ellipse cx="0" cy="0" rx="58" ry="18" fill="#455A64" stroke="#212121" stroke-width="3.5"/>
                                <circle cx="0" cy="-6" r="8" fill="#263238"/>
                                <path d="M -15 -18 Q -30 -45 -10 -65" stroke="#B0BEC5" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.85"/>
                                <path d="M 0 -22 Q 15 -50 0 -72" stroke="#B0BEC5" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.85"/>
                                <path d="M 15 -18 Q 30 -45 10 -65" stroke="#B0BEC5" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.85"/>
                                <path d="M -25 46 Q 0 25 25 46 Q 0 58 -25 46" fill="#FF5722"/>
                                <path d="M -14 46 Q 0 32 14 46 Q 0 54 -14 46" fill="#FFEB3B"/>
                            </g>
                        </svg>
                        <div class="step-interactive-badge">💡 6단계 퀴즈: 예쁜 포대에 쏙 담고, 김이 모락모락 밥을 짓는 마지막 작업은? (아래 버튼 누르기)</div>
                    </div>
                `;
            default:
                // 7. 최종 완성 (쌀밥 축하 카드)
                return `
                    <div class="milling-detailed-card celebration-card">
                        <div class="milling-icon-row bounce-anim" style="font-size: 4.5rem;">🍚</div>
                        <h2>김이 모락모락~ 따끈한 쌀밥 완성!</h2>
                        <p style="font-size: 1.05rem; line-height: 1.6; color: #37474F;">
                            벼 한 톨이 우리 밥상에 오기까지<br>
                            <strong>탈곡 ➔ 건조 ➔ 저장 ➔ 도정 ➔ 선별 ➔ 포장</strong>의 모든 정성을 다 마쳤어요!<br>
                            <strong>"농부님, 맛있는 밥을 지어주셔서 감사합니다!"</strong>
                        </p>
                        <button class="stage-action-btn primary pulse-btn" onclick="window.gameApp.finishGame()">
                            🏆 꼬마 농부 명예 수료증 & 최종 기록 보기! 🏆
                        </button>
                    </div>
                `;
        }
    }

    hintClickPart2() {
        if (window.soundFx) window.soundFx.playClick();
        const speechEl = document.getElementById('characterSpeech');
        if (speechEl && this.s6_subStep < this.part2Steps.length) {
            speechEl.innerText = `"아래에 섞여 있는 가공 도구 버튼 중에서 지금 꼭 필요한 과정을 찾아 눌러주세요! 👇"`;
            speechEl.classList.remove('bounce-speech');
            void speechEl.offsetWidth;
            speechEl.classList.add('bounce-speech');
        }
    }

    getPart2ToolName(toolType) {
        const map = {
            thresh: '🚜 탈곡',
            dry: '♨️ 건조',
            store: '🏭 저장',
            mill: '⚙️ 도정',
            sort: '🔍 선별',
            pack: '📦 포장'
        };
        return map[toolType] || toolType;
    }

    getInitialSpeech(stage) {
        if (stage === 6) {
            if (this.s6_subStep < this.part2Steps.length) {
                return this.part2Steps[this.s6_subStep].speech;
            }
            return '"만세! 6단계 가공을 완벽히 마쳐서 따끈따끈한 쌀밥이 완성되었어요! 🍚✨"';
        }
        if (stage === 3 && this.currentNeed && this.currentNeed.speech) {
            return this.currentNeed.speech;
        }
        return `"${this.currentNeed ? this.currentNeed.bubble : '사랑과 정성으로 벼를 가꿔주세요!'}"`;
    }

    // ====================================================
    // 도구 클릭 시: 요구사항을 딱 들어줄 때만 성장!
    // ====================================================
    applyToolAction(toolType) {
        // 광클 및 다중 타이머 경합에 의한 렉/버퍼링 원천 방지
        const now = Date.now();
        if (now - this.lastClickTimestamp < 75) return;
        this.lastClickTimestamp = now;
        if (this.isAdvancingStage) return;

        if (this.currentStage === 6) {
            if (this.s6_subStep >= this.part2Steps.length) {
                window.gameApp.finishGame();
                return;
            }

            const currentTarget = this.part2Steps[this.s6_subStep];

            // 1. 도구별 시각/청각 피드백 (항상 재생)
            if (toolType === 'thresh') {
                window.soundFx.playThreshing();
                window.effectMgr.createThreshShower();
            } else if (toolType === 'dry') {
                window.soundFx.playDryBreeze();
                window.effectMgr.createBreeze();
            } else if (toolType === 'store') {
                window.soundFx.playSiloStore();
                window.effectMgr.createGoldSparkles();
            } else if (toolType === 'mill') {
                window.soundFx.playMilling();
                window.effectMgr.createGoldSparkles();
            } else if (toolType === 'sort') {
                window.soundFx.playColorSort();
                window.effectMgr.createSortingBeams();
            } else if (toolType === 'pack') {
                window.soundFx.playPacking();
                window.effectMgr.createConfetti();
            } else {
                window.soundFx.playClick();
            }

            const speechEl = document.getElementById('characterSpeech');

            // 2. 도구 매칭 검증
            if (toolType === currentTarget.tool) {
                // [정답!]
                window.soundFx.playPerfect();
                window.effectMgr.createGoldSparkles(window.innerWidth / 2, window.innerHeight * 0.45, 25);

                this.s6_subStep++;
                this.stageProgress = Math.min(100, Math.round((this.s6_subStep / 6) * 100));
                this.calculateTotalRipening();

                if (this.s6_subStep >= 6) {
                    window.soundFx.playCooking();
                    window.soundFx.playFanfare();
                    window.effectMgr.createConfetti();
                }

                this.renderStage();

                if (speechEl) {
                    if (this.s6_subStep >= 6) {
                        speechEl.innerText = `"와아! 우리가 함께 햅쌀을 포장하고 김이 모락모락 맛있는 쌀밥을 지었어요! 🍚✨"`;
                    } else {
                        speechEl.innerText = `"멋져요! 참 잘했어요! [${currentTarget.toolLabel}] 과정을 무사히 마쳤어요! 다음으로 출발! 🌟"`;
                    }
                    speechEl.classList.remove('bounce-speech');
                    void speechEl.offsetWidth;
                    speechEl.classList.add('bounce-speech');
                }
            } else {
                // [오답!]
                window.soundFx.playWrongChoice();
                const callout = document.getElementById('riceNeedCallout');
                if (callout) {
                    callout.classList.remove('shake-attention');
                    void callout.offsetWidth;
                    callout.classList.add('shake-attention');
                }
                if (speechEl) {
                    const clickedName = this.getPart2ToolName(toolType);
                    speechEl.innerText = `"지금은 [${clickedName}] 과정이 아니에요! 벼알 친구의 설명을 다시 읽고 알맞은 도구를 찾아보자! 💡"`;
                    speechEl.classList.remove('bounce-speech');
                    void speechEl.offsetWidth;
                    speechEl.classList.add('bounce-speech');
                }
            }
            return;
        }

        const speechEl = document.getElementById('characterSpeech');

        // 1. 도구별 시각/청각 인터랙션 (항상 재생되어 조작 반응성 제공)
        if (toolType === 'water') {
            window.soundFx.playWater();
            window.effectMgr.createWaterDrops();
        } else if (toolType === 'sun') {
            window.soundFx.playSun();
            window.effectMgr.createGoldSparkles();
        } else if (toolType === 'love') {
            window.soundFx.playLovePet();
            window.effectMgr.createLovePet();
        } else if (toolType === 'farmer') {
            window.soundFx.playFarmerTouch();
            window.effectMgr.createFarmerTouch();
        } else if (toolType === 'duck') {
            window.soundFx.playDuck();
            window.effectMgr.spawnDucks();
        } else if (toolType === 'snail') {
            window.soundFx.playSnail();
            window.effectMgr.spawnSnails();
        } else if (toolType === 'scarecrow') {
            window.soundFx.playScarecrowTap();
            window.soundFx.playSparrowFly();
            window.effectMgr.scareSparrows();
        } else if (toolType === 'drain') {
            window.soundFx.playDrainBreeze();
            window.effectMgr.createBreeze();
        }

        // Stage 3 특화: 친환경 오리와 우렁이 각 2회씩 집중 체험 (오리 ➔ 우렁이 ➔ 오리 ➔ 우렁이)
        if (this.currentStage === 3) {
            if (this.currentNeed && this.currentNeed.tool === toolType) {
                window.soundFx.playPerfect();
                window.effectMgr.createGoldSparkles(window.innerWidth / 2, window.innerHeight * 0.45, 20);

                this.stage3SubIndex++;
                this.addProgress(25);

                if (speechEl) {
                    if (toolType === 'duck') {
                        speechEl.innerText = `"오리가 논을 누비며 해충들을 싹 잡아먹고 논에 거름을 주었어요! 🦆✨"`;
                    } else {
                        speechEl.innerText = `"왕우렁이가 논바닥의 잡초를 맛있게 먹어치워 생태논이 깨끗해졌어요! 🐌✨"`;
                    }
                    speechEl.classList.remove('bounce-speech');
                    void speechEl.offsetWidth;
                    speechEl.classList.add('bounce-speech');
                }

                if (this.stageProgress < 100) {
                    this.pickNewNeed();
                    const callout = document.getElementById('riceNeedCallout');
                    if (callout && this.currentNeed) {
                        callout.innerHTML = `
                            <span class="need-icon">${this.currentNeed.icon}</span>
                            <span class="need-text">${this.currentNeed.bubble}</span>
                        `;
                    }
                    if (speechEl && this.currentNeed && this.currentNeed.speech) {
                        setTimeout(() => {
                            if (this.currentStage === 3 && this.currentNeed) {
                                speechEl.innerText = this.currentNeed.speech;
                                speechEl.classList.remove('bounce-speech');
                                void speechEl.offsetWidth;
                                speechEl.classList.add('bounce-speech');
                            }
                        }, 1300);
                    }
                }
            } else {
                window.soundFx.playWrongChoice();
                const callout = document.getElementById('riceNeedCallout');
                if (callout) {
                    callout.classList.remove('shake-attention');
                    void callout.offsetWidth;
                    callout.classList.add('shake-attention');
                }
                if (speechEl && this.currentNeed) {
                    speechEl.innerText = `"지금은 친환경 생태논을 가꿔야 해요! ${this.currentNeed.bubble} 🥺"`;
                    speechEl.classList.remove('bounce-speech');
                    void speechEl.offsetWidth;
                    speechEl.classList.add('bounce-speech');
                }
            }
            return;
        }

        // 일반 1, 2, 4, 5 단계
        if (this.currentNeed && this.currentNeed.tool === toolType) {
            // [정답!] 벼가 원하던 바로 그 도구!
            window.soundFx.playPerfect();
            window.effectMgr.createGoldSparkles(window.innerWidth / 2, window.innerHeight * 0.45, 20);

            if (speechEl) {
                speechEl.innerText = `"와아! 딱 원하던 거예요! 고마워요, 쑥쑥 자라요! ✨"`;
                speechEl.classList.remove('bounce-speech');
                void speechEl.offsetWidth;
                speechEl.classList.add('bounce-speech');
            }

            // 성장도 +25% 증가 (4번 성공하면 다음 단계로!)
            this.addProgress(25);

            // 다음 요구사항으로 교체
            this.pickNewNeed();

            // 말풍선 업데이트
            const callout = document.getElementById('riceNeedCallout');
            if (callout && this.currentNeed) {
                callout.innerHTML = `
                    <span class="need-icon">${this.currentNeed.icon}</span>
                    <span class="need-text">${this.currentNeed.bubble}</span>
                `;
            }
        } else {
            // [오답!] 벼가 지금 원하지 않는 도구! -> 성장하지 않음!
            window.soundFx.playWrongChoice();

            // 말풍선을 흔들어 아이의 시선을 요구사항으로 유도!
            const callout = document.getElementById('riceNeedCallout');
            if (callout) {
                callout.classList.remove('shake-attention');
                void callout.offsetWidth;
                callout.classList.add('shake-attention');
            }

            if (speechEl && this.currentNeed) {
                speechEl.innerText = `"헤헤~ 지금은 그게 아니에요! ${this.currentNeed.bubble} 🥺"`;
                speechEl.classList.remove('bounce-speech');
                void speechEl.offsetWidth;
                speechEl.classList.add('bounce-speech');
            }
        }
    }

    addProgress(amount) {
        if (this.isAdvancingStage) return;

        this.stageProgress = Math.min(100, this.stageProgress + amount);
        this.calculateTotalRipening();
        this.updateGauges();

        // 1단계 새싹 실시간 스케일 업데이트
        if (this.currentStage === 1) {
            const sproutElem = document.getElementById('seedSproutElement');
            const labelElem = document.getElementById('seedProgressLabel');
            if (sproutElem) {
                const sproutScale = Math.max(0.3, (this.stageProgress / 100) * 1.3);
                sproutElem.style.opacity = this.stageProgress > 5 ? '1' : '0';
                sproutElem.setAttribute('transform', `scale(${sproutScale})`);
            }
            if (labelElem) {
                labelElem.textContent = `💧 따뜻한 물에서 싹을 틔우는 중 (${this.stageProgress}%)`;
            }
        }

        if (this.stageProgress >= 100) {
            this.isAdvancingStage = true;
            window.soundFx.playFanfare();
            window.effectMgr.createConfetti();

            setTimeout(() => {
                if (this.currentStage < this.totalStages) {
                    this.currentStage++;
                    this.stageProgress = 0;
                    if (this.currentStage === 3) this.stage3SubIndex = 0;
                    if (this.currentStage === 6) this.s6_subStep = 0;
                    this.pickNewNeed();
                    this.renderStage();
                } else {
                    window.gameApp.finishGame();
                }
                this.isAdvancingStage = false;
            }, 800);
        }
    }

    updateGauges() {
        const sideLiquid = document.getElementById('sideGaugeLiquid');
        const sideText = document.getElementById('sideGaugePctText');
        if (sideLiquid) sideLiquid.style.height = `${this.totalRipeningPct}%`;
        if (sideText) sideText.innerText = `${Math.round(this.totalRipeningPct)}%`;

        const stepBar = document.getElementById('stepFillBar');
        const stepText = document.getElementById('stepPctText');
        if (stepBar) stepBar.style.width = `${this.stageProgress}%`;
        if (stepText) stepText.innerText = `${this.stageProgress}%`;
    }
}

window.storyMode = new StoryMode();
