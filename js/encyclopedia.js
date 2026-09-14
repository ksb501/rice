// 🌾 쌀 탐구백과 & 도전! 쌀 박사 퀴즈 (5문항 만점 상장 발급 시스템)
const EncyclopediaData = {
    terms: [
        {
            id: 'plant',
            name: '벼 (식물 자체)',
            badge: '논에 서 있는 한해살이 풀',
            desc: '우리가 매일 먹는 쌀이 열리는 한해살이 풀이에요! 논에 깊게 뿌리를 내리고 햇빛과 물을 듬뿍 먹고 자라요.',
            detail: '봄에 볍씨를 뿌려 싹을 틔운 후 모내기를 하고, 여름에는 새끼치기로 1포기가 10~15포기로 늘어나요. 늦여름에 작고 하얀 벼꽃이 피어 수정하고, 가을이 되면 황금빛 이삭에 수백 개의 낟알이 주렁주렁 매달린답니다!',
            quizHint: '💡 벼 한 포기에서 수많은 줄기와 낟알이 나와요. 가을에 황금빛으로 익어요.',
            icon: '🌾',
            color: '#4CAF50'
        },
        {
            id: 'narak',
            name: '나락 (벼알)',
            badge: '가장 겉껍질(왕겨)이 있는 낟알',
            desc: '가을에 벼를 수확했을 때 단단한 겉껍질(왕겨)에 싸여 있는 낟알을 나락 또는 벼알이라고 불러요.',
            detail: '단단하고 까칠한 황금색 겉껍질인 왕겨가 알맹이를 꼭꼭 감싸 보호하고 있어요. 이 왕겨 덕분에 비바람이나 해충, 습기로부터 쌀알의 영양을 안전하게 지킬 수 있답니다.',
            quizHint: '💡 나락의 까칠한 겉껍질을 [왕겨]라고 불러요.',
            icon: '🌾',
            color: '#FFB300'
        },
        {
            id: 'brown',
            name: '현미 (왕겨만 벗긴 쌀)',
            badge: '영양소의 66% 쌀눈이 살아있는 쌀',
            desc: '나락에서 까칠한 가장 겉껍질(왕겨)만 쏙 벗겨낸 쌀이에요. 누런 갈색을 띠어요.',
            detail: '싹이 트는 씨눈인 [쌀눈(배아)]과 식이섬유·비타민이 풍부한 속껍질인 [쌀겨]가 고스란히 남아있어요! 백미보다 씹는 맛이 구수하고 영양가가 휠씬 풍부하답니다.',
            quizHint: '💡 왕겨만 벗겨낸 쌀이 바로 현미예요! 쌀눈에 영양소가 66% 집중되어 있어요.',
            icon: '🥣',
            color: '#A1887F'
        },
        {
            id: 'white',
            name: '백미 (속껍질까지 깎은 흰쌀)',
            badge: '매일 먹는 부드럽고 쫄깃한 흰쌀밥',
            desc: '현미에서 속껍질(쌀겨)과 쌀눈까지 완전히 깎아내어 뽀얗고 부드러운 하얀 쌀이에요.',
            detail: '도정기에서 곱게 찧어냈기 때문에 밥을 지었을 때 윤기가 자르르 흐르고 식감이 아주 부드러워 소화가 쏙쏙 잘 된답니다! 우리가 주식으로 가장 많이 먹는 쌀이에요.',
            quizHint: '💡 현미를 도정하여 쌀겨와 쌀눈을 깎아낸 쌀이 백미예요.',
            icon: '🍚',
            color: '#607D8B'
        }
    ],

    eco: [
        {
            id: 'snail',
            name: '친환경 왕우렁이 농법',
            badge: '화학 제초제 0%의 일등공신',
            desc: '화학 제초제를 뿌리는 대신 풀을 좋아하는 왕우렁이를 논에 넣어 잡초를 먹게 하는 친환경 농법이에요!',
            detail: '왕우렁이는 벼는 건드리지 않고 물속의 연한 잡초 싹만 쏙쏙 골라 먹어치워요. 덕분에 흙과 물이 오염되지 않고 사람과 자연 모두에게 이로운 건강한 친환경 쌀이 생산돼요.',
            quizHint: '💡 퀴즈 단골! 잡초를 없애기 위해 농약 대신 투입하는 생물은 [왕우렁이]!',
            icon: '🐌',
            color: '#2E7D32'
        },
        {
            id: 'duck',
            name: '친환경 오리 농법',
            badge: '해충 퇴치 & 유기농 거름 공급',
            desc: '오리가 논을 헤엄치며 벼를 갉아먹는 해충을 잡아먹고, 발장구로 잡초가 자라는 것을 막아줘요!',
            detail: '오리는 벼멸구와 잎벌레를 꿀꺽 잡아먹고, 발장구로 흙탕물을 일으켜 잡초 씨앗이 햇빛을 받지 못하게 해요. 또한 오리의 배설물은 벼가 자라는 데 필요한 최고의 천연 유기질 비료가 된답니다.',
            quizHint: '💡 오리는 해충(벼멸구)을 먹고 발장구로 잡초 씨앗 발아를 차단해요.',
            icon: '🦆',
            color: '#F57F17'
        },
        {
            id: 'drain',
            name: '신비한 중간 물 떼기 (낙수)',
            badge: '뿌리를 깊게 내리는 선조의 지혜',
            desc: '한여름에 논의 물을 며칠간 싹 빼서 바닥에 실금이 갈 때까지 말려주는 특별한 농사 기술이에요!',
            detail: '논물을 빼주면 벼가 산소를 찾아 뿌리를 땅속 깊숙이 힘차게 뻗고, 줄기가 단단해져 가을 태풍에도 쉽게 쓰러지지 않아요! 쓸데없이 퍼지는 헛새끼도 막아 영양이 알곡으로 집중된답니다.',
            quizHint: '💡 논물을 며칠간 말려 뿌리를 깊게 내리게 하는 과정을 [중간 물 떼기]라고 해요.',
            icon: '🚪',
            color: '#37474F'
        },
        {
            id: 'salt',
            name: '소금물 볍씨 선별 (염수선)',
            badge: '좋은 볍씨를 고르는 과학적 원리',
            desc: '소금물에 계란을 띄워 농도를 맞춘 뒤 볍씨를 넣어 무겁고 건강한 씨앗만 쏙 골라내요!',
            detail: '소금물에 달걀을 띄웠을 때 500원 동전 크기만큼 수면 위로 뜰 때가 딱 맞는 농도예요. 영양이 꽉 찬 무거운 씨앗은 바닥으로 가라앉고, 속이 빈 쭉정이나 병든 씨앗은 위로 동동 뜹니다. 가라앉은 알짜 씨앗만 건져 싹을 틔워요!',
            quizHint: '💡 건강한 씨앗은 무거워 가라앉고, 속이 빈 쭉정이는 동동 떠요!',
            icon: '🧂',
            color: '#1565C0'
        }
    ],

    steps: [
        {
            id: 'thresh',
            name: '1. 탈곡 (낟알 털기)',
            badge: '줄기와 나락의 첫 분리',
            desc: '황금빛으로 익은 벼를 베어 줄기에서 알곡(나락)을 톡톡 털어내어 분리하는 작업이에요!',
            detail: '옛날에는 홀태나 발로 밟는 탈곡기로 털었지만, 현대에는 콤바인이 논을 지나가며 벼를 베는 동시에 나락을 한꺼번에 털어내요. 줄기(볏짚)는 거름이나 사료로 쓰이고 나락만 모입니다.',
            quizHint: '💡 벼 줄기에서 낟알(나락)을 분리하는 첫 단계 공정이에요.',
            icon: '🚜',
            color: '#E65100'
        },
        {
            id: 'dry',
            name: '2. 건조 (수분 말리기)',
            badge: '수분 24% ➔ 15% 이하 보관 안정화',
            desc: '수확 직후 축축한 벼알을 따뜻한 바람으로 말려 곰팡이와 썩음을 완벽하게 방지해요!',
            detail: '방금 딴 벼의 수분은 약 24%로 매우 축축해요. 이를 15% 이하로 안전하게 낮추지 않으면 며칠 만에 곰팡이가 피거나 썩어버려요. 곡물 건조기로 알맞은 온도로 말려 햅쌀의 맛을 지켜요.',
            quizHint: '💡 안전한 보관을 위한 적정 수분율은 [15% 이하]예요!',
            icon: '♨️',
            color: '#D84315'
        },
        {
            id: 'store',
            name: '3. 저장 (저온 사일로)',
            badge: '15℃ 이하 서늘한 신선 보관',
            desc: '바싹 마른 낟알을 해충과 쥐로부터 보호하기 위해 서늘한 대형 사일로 창고에 보관해요!',
            detail: '온도 15℃ 이하, 습도 70% 이하의 저온 환경을 유지하는 사일로 창고에서 보관해요. 이렇게 하면 벼알의 호흡이 억제되어 1년 내내 가을 햅쌀처럼 신선하고 쫄깃한 밥맛을 유지할 수 있어요.',
            quizHint: '💡 15℃ 이하 서늘한 저온 사일로 창고에 보관해야 밥맛이 변하지 않아요.',
            icon: '🏭',
            color: '#1565C0'
        },
        {
            id: 'mill',
            name: '4. 도정 (현미와 백미 찧기)',
            badge: '왕겨 ➔ 현미 ➔ 백미의 핵심 공정',
            desc: '거친 왕겨를 벗겨 [현미]를 만들고, 쌀겨를 곱게 깎아 부드러운 [백미]로 찧어내요!',
            detail: '벼알의 겉껍질(왕겨)을 벗기면 갈색의 [현미]가 되고, 현미의 속껍질(쌀겨)과 쌀눈을 원하는 만큼 깎아내면 뽀얗고 부드러운 [백미]가 완성돼요. 도정 기술 덕분에 우리가 맛있는 밥을 먹을 수 있어요!',
            quizHint: '💡 왕겨를 벗기면 [현미], 쌀겨까지 깎아내면 [백미]가 돼요.',
            icon: '⚙️',
            color: '#6A1B9A'
        },
        {
            id: 'sort',
            name: '5. 선별 (특등미 엄선)',
            badge: '초고속 광학 센서로 불량 쌀 0%',
            desc: '깨진 쌀(싸라기), 거뭇한 불량 쌀, 돌멩이를 광학 색채선별기로 완벽하게 골라내요!',
            detail: '초당 수백 장을 촬영하는 고성능 카메라가 불량 쌀이나 이물질을 발견하면 순간적으로 고압 공기를 발사해 톡 튕겨냅니다. 오직 보석처럼 투명하고 온전한 최고 등급 특등미만 선별돼요.',
            quizHint: '💡 깨진 쌀과 불순물을 골라내는 장치를 [색채선별기]라고 해요.',
            icon: '🔍',
            color: '#00695C'
        },
        {
            id: 'pack',
            name: '6. 포장 & 밥짓기',
            badge: '정성이 가득 담긴 햅쌀의 완성',
            desc: '엄선된 최고급 햅쌀을 친환경 쌀 포대에 담아 포장하고 우리 집 식탁으로 출발해요!',
            detail: '포장된 쌀은 밥솥에서 윤기가 흐르고 구수한 밥이 돼요. 볍씨 한 알이 밥 한 공기가 되기까지 농부의 손길이 무려 여든여덟(88) 번이나 닿는답니다! 감사한 마음으로 밥을 먹어야겠죠?',
            quizHint: '💡 쌀 미(米)자는 여덟 팔(八)자가 두 번 겹쳐 농부의 88번 정성을 의미해요.',
            icon: '📦',
            color: '#2E7D32'
        }
    ],

    quizzes: [
        {
            question: '1. 벼를 수확한 후 가장 바깥의 겉껍질(왕겨)만 벗겨내어 쌀눈과 쌀겨가 살아있는 영양 가득한 쌀은?',
            options: ['1. 백미 (흰쌀)', '2. 현미', '3. 흑미'],
            correct: 1,
            explanation: '정답은 현미예요! 나락에서 왕겨만 벗겨내면 쌀눈이 살아있는 건강한 현미가 됩니다.'
        },
        {
            question: '2. 소금물에 볍씨를 넣었을 때 물 위로 동동 뜨는 볍씨는 건강하고 좋은 씨앗이다. (O / X)',
            options: ['1. O (참)', '2. X (거짓)'],
            correct: 1,
            explanation: 'X(거짓)입니다! 영양이 꽉 찬 건강한 씨앗은 무거워서 가라앉고, 속이 빈 쭉정이가 물 위로 뜹니다.'
        },
        {
            question: '3. 논에 자란 잡초를 없애기 위해 농약 대신 투입하는 대표적인 친환경 생태 생물은?',
            options: ['1. 왕우렁이', '2. 사마귀', '3. 매미'],
            correct: 0,
            explanation: '정답은 왕우렁이예요! 잡초를 맛있게 먹어치워 화학 제초제 없이 친환경 쌀을 재배할 수 있어요.'
        },
        {
            question: '4. 수확한 직후의 나락을 곰팡이 없이 안전하게 보관하기 위해 낮춰야 하는 적정 수분율은?',
            options: ['1. 50% 이하', '2. 15% 이하', '3. 80% 이하'],
            correct: 1,
            explanation: '정답은 15% 이하예요! 수확 직후 24%인 수분을 15% 이하로 건조해야 오랫동안 썩지 않아요.'
        },
        {
            question: '5. 쌀의 전체 영양소 중 66%가 집중되어 있는 싹이 트는 씨눈 부위의 이름은?',
            options: ['1. 쌀눈 (배아)', '2. 왕겨 (겉껍질)', '3. 싸라기 (깨진쌀)'],
            correct: 0,
            explanation: '정답은 쌀눈(배아)입니다! 쌀알 끝에 쏙 박힌 쌀눈에 비타민과 미네랄이 집중되어 있어요.'
        }
    ]
};

class EncyclopediaUI {
    constructor() {
        this.currentQuizIndex = 0;
        this.quizScore = 0;
        this.activeCategory = 'terms';
        this.activeTopicId = 'plant';
    }

    // 1. 쌀 탐구백과 모달 렌더링
    renderEncyclopedia() {
        const modalBody = document.getElementById('encyclopediaContent');
        if (!modalBody) return;

        const currentItems = EncyclopediaData[this.activeCategory] || EncyclopediaData.terms;
        const activeItem = currentItems.find(it => it.id === this.activeTopicId) || currentItems[0];
        this.activeTopicId = activeItem.id;

        modalBody.innerHTML = `
            <div class="encyclo-tabs">
                <button class="tab-btn ${this.activeCategory === 'terms' ? 'active' : ''}" onclick="window.encycloUI.switchTab('terms')">🔍 벼·나락·현미·백미 도감</button>
                <button class="tab-btn ${this.activeCategory === 'eco' ? 'active' : ''}" onclick="window.encycloUI.switchTab('eco')">🌱 친환경 생태 농업 비결</button>
                <button class="tab-btn ${this.activeCategory === 'steps' ? 'active' : ''}" onclick="window.encycloUI.switchTab('steps')">⚙️ 벼알의 6대 가공 공정</button>
            </div>

            <div class="encyclo-sub-header">
                <span>👇 알고 싶은 주제 버튼을 눌러보세요! 해당 탐구 카드가 펼쳐져요.</span>
            </div>

            <!-- 주제별 인터랙티브 버튼 칩 그룹 -->
            <div class="encyclo-chip-group">
                ${currentItems.map(item => `
                    <button class="topic-chip-btn ${item.id === this.activeTopicId ? 'active' : ''}" 
                            onclick="window.encycloUI.selectTopic('${item.id}')"
                            style="border-color: ${item.id === this.activeTopicId ? item.color : '#CFD8DC'};">
                        <span class="chip-icon">${item.icon}</span>
                        <span class="chip-title">${item.name}</span>
                    </button>
                `).join('')}
            </div>

            <!-- 활성화된 상세 탐구 카드 -->
            <div class="topic-detail-card" style="border-top: 5px solid ${activeItem.color};">
                <div class="detail-header">
                    <div class="detail-icon bounce-anim">${activeItem.icon}</div>
                    <div class="detail-titles">
                        <span class="detail-badge" style="background: ${activeItem.color}15; color: ${activeItem.color}; border: 1.5px solid ${activeItem.color};">${activeItem.badge}</span>
                        <h2 class="detail-name">${activeItem.name}</h2>
                    </div>
                </div>

                <div class="detail-content-blocks">
                    <div class="detail-block core-block">
                        <div class="block-title">💡 핵심 개념 (초등 눈높이 요약)</div>
                        <p class="block-desc">${activeItem.desc}</p>
                    </div>

                    <div class="detail-block deep-block">
                        <div class="block-title">🔬 생생 탐구 원리 (과정과 특징)</div>
                        <p class="block-desc">${activeItem.detail}</p>
                    </div>

                    <div class="detail-block hint-block">
                        <div class="block-title">✨ 쌀 박사 퀴즈 비법 힌트</div>
                        <p class="block-desc">${activeItem.quizHint}</p>
                    </div>
                </div>

                <div class="detail-nav-footer">
                    <button class="stage-action-btn next-topic-btn" onclick="window.encycloUI.nextTopic()">
                        다음 주제 알아보기 ➔
                    </button>
                </div>
            </div>
        `;
    }

    switchTab(tabName) {
        if (window.soundFx) window.soundFx.playClick();
        this.activeCategory = tabName;
        const items = EncyclopediaData[tabName] || EncyclopediaData.terms;
        this.activeTopicId = items[0].id;
        this.renderEncyclopedia();
    }

    selectTopic(topicId) {
        if (window.soundFx) window.soundFx.playClick();
        this.activeTopicId = topicId;
        this.renderEncyclopedia();
    }

    nextTopic() {
        if (window.soundFx) window.soundFx.playClick();
        const currentItems = EncyclopediaData[this.activeCategory] || EncyclopediaData.terms;
        const currentIndex = currentItems.findIndex(it => it.id === this.activeTopicId);
        const nextIndex = (currentIndex + 1) % currentItems.length;
        this.activeTopicId = currentItems[nextIndex].id;
        this.renderEncyclopedia();
    }

    // 2. 쌀 박사 5문항 퀴즈 모달 렌더링
    renderQuiz() {
        const container = document.getElementById('quizContent');
        if (!container) return;

        if (this.currentQuizIndex >= EncyclopediaData.quizzes.length) {
            // 퀴즈 종료 시
            if (this.quizScore === EncyclopediaData.quizzes.length) {
                // [만점!] 5/5 모두 정답 -> 학교명, 학년 반, 이름 입력창 노출
                container.innerHTML = `
                    <div class="quiz-result-box perfect-result">
                        <div style="font-size: 3.5rem;">🎉 💯 🏆</div>
                        <h2 style="color: #E65100; margin: 8px 0;">축하합니다! 5문제 만점 달성!</h2>
                        <p style="font-size: 1.05rem; color: #2E7D32; font-weight: 700;">
                            당신은 진정한 최고의 <strong>[쌀 박사님]</strong>입니다!
                        </p>
                        <p style="font-size: 0.92rem; color: #555; margin: 8px 0 16px;">
                            영예로운 <strong>[쌀 박사 으뜸상장]</strong>을 발급해 드립니다.<br>
                            상장에 들어갈 소속과 이름을 입력해 주세요!
                        </p>

                        <div class="cert-input-form">
                            <div class="form-row">
                                <label for="certSchool">🏫 학교명:</label>
                                <input type="text" id="certSchool" placeholder="예: 햇살초등학교" maxlength="20" value="${(window.gameApp ? window.gameApp.getUserProfile().school : '햇살초등학교')}">
                            </div>
                            <div class="form-row">
                                <label for="certGradeClass">🎒 학년 / 반:</label>
                                <input type="text" id="certGradeClass" placeholder="예: 3학년 1반" maxlength="15" value="${(window.gameApp ? window.gameApp.getUserProfile().grade : '3학년 1반')}">
                            </div>
                            <div class="form-row">
                                <label for="certName">✍️ 이 름:</label>
                                <input type="text" id="certName" placeholder="예: 김벼리" maxlength="10" value="${(window.gameApp ? window.gameApp.getUserProfile().name : '김벼리')}">
                            </div>
                            <button class="stage-action-btn pulse-btn" style="width: 100%; margin-top: 14px; font-size: 1.1rem;" onclick="window.encycloUI.generateAward()">
                                📜 쌀 박사 상장 발급받기 ➔
                            </button>
                        </div>
                    </div>
                `;
                if (window.soundFx) window.soundFx.playFanfare();
                if (window.effectMgr) window.effectMgr.createConfetti();
            } else {
                // 5문제를 다 못 맞춘 경우
                container.innerHTML = `
                    <div class="quiz-result-box">
                        <div style="font-size: 3rem;">🌾</div>
                        <h3 style="color: #D84315;">아쉽게도 ${this.quizScore}문제를 맞혔어요!</h3>
                        <p style="font-size: 0.95rem; line-height: 1.5; color: #555; margin: 10px 0;">
                            5문제를 <strong>모두 맞히면</strong> 학교명과 이름이 적힌<br>
                            멋진 <strong>[쌀 박사 으뜸상장]</strong>을 발급받을 수 있어요!<br>
                            쌀 탐구백과를 다시 읽고 도전해 볼까요?
                        </p>
                        <button class="stage-action-btn" onclick="window.encycloUI.resetQuiz()">다시 풀기 🔄</button>
                    </div>
                `;
            }
            return;
        }

        const q = EncyclopediaData.quizzes[this.currentQuizIndex];
        container.innerHTML = `
            <div class="quiz-box">
                <div class="quiz-header">
                    <span class="quiz-step">문제 ${this.currentQuizIndex + 1} / ${EncyclopediaData.quizzes.length}</span>
                    <span class="quiz-score">현재 맞힌 개수: ${this.quizScore}개</span>
                </div>
                <h3 class="quiz-q">${q.question}</h3>
                <div class="quiz-options">
                    ${q.options.map((opt, idx) => `
                        <button class="quiz-opt-btn" onclick="window.encycloUI.checkAnswer(${idx})">${opt}</button>
                    `).join('')}
                </div>
                <div id="quizFeedback" class="quiz-feedback" style="display:none;"></div>
            </div>
        `;
    }

    checkAnswer(userAns) {
        const q = EncyclopediaData.quizzes[this.currentQuizIndex];
        const fb = document.getElementById('quizFeedback');
        if (!fb) return;

        fb.style.display = 'block';
        if (userAns === q.correct) {
            this.quizScore++;
            if (window.soundFx) window.soundFx.playPerfect();
            if (window.effectMgr) window.effectMgr.createGoldSparkles(window.innerWidth / 2, window.innerHeight / 2);
            fb.className = 'quiz-feedback correct';
            fb.innerHTML = `<strong>⭕ 정답입니다! 딩동댕!</strong><br>${q.explanation}`;
        } else {
            if (window.soundFx) window.soundFx.playWrongChoice();
            fb.className = 'quiz-feedback wrong';
            fb.innerHTML = `<strong>❌ 아쉬워요!</strong><br>${q.explanation}`;
        }

        // 선택지 비활성화
        document.querySelectorAll('.quiz-opt-btn').forEach(b => b.disabled = true);

        setTimeout(() => {
            this.currentQuizIndex++;
            this.renderQuiz();
        }, 1600);
    }

    resetQuiz() {
        this.currentQuizIndex = 0;
        this.quizScore = 0;
        this.renderQuiz();
    }

    // 3. 학교명·이름 입력식 공식 상장 발급 렌더링
    generateAward() {
        const schoolInput = document.getElementById('certSchool');
        const gradeClassInput = document.getElementById('certGradeClass');
        const nameInput = document.getElementById('certName');

        const school = (schoolInput && schoolInput.value.trim()) ? schoolInput.value.trim() : '대한초등학교';
        const gradeClass = (gradeClassInput && gradeClassInput.value.trim()) ? gradeClassInput.value.trim() : '3학년 1반';
        const studentName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : '김벼리';

        if (window.gameApp) {
            window.gameApp.saveUserProfile({ school, grade: gradeClass, name: studentName });
        }

        const today = new Date();
        const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

        const issuerSchool = school.endsWith('학교') ? `${school}장` : (school.endsWith('초등') ? `${school}학교장` : `${school}장`);
        const serialNumber = `제 ${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 900 + 100)}호`;

        // 상장 데이터 보관 (HTML 파일 다운로드용)
        this.currentAwardData = {
            serialNumber,
            school,
            gradeClass,
            studentName,
            dateString,
            issuerSchool
        };

        const container = document.getElementById('quizContent');
        if (!container) return;

        container.innerHTML = `
            <div class="korean-award-wrapper" id="printableAward">
                <div class="korean-award-card">
                    <!-- 상단 상장 번호 & 엠블럼 -->
                    <div class="award-top-row">
                        <span class="award-serial">${serialNumber}</span>
                        <div class="award-emblem">🌾 🎖️ 🌾</div>
                    </div>

                    <!-- 메인 상장 제목 -->
                    <h1 class="award-main-title">상&nbsp;&nbsp;&nbsp;&nbsp;장</h1>
                    <div class="award-sub-title">[ 쌀 박사 으뜸상 ]</div>

                    <!-- 수상자 정보 -->
                    <div class="award-recipient-info">
                        <div class="info-line"><span class="info-label">소&nbsp;속</span><span class="info-sep">:</span><span class="info-val">${school} ${gradeClass}</span></div>
                        <div class="info-line"><span class="info-label">성&nbsp;명</span><span class="info-sep">:</span><span class="info-val student-highlight">${studentName}</span></div>
                    </div>

                    <!-- 상장 본문 -->
                    <div class="award-body-text">
                        위 어린이는 <strong>[벼의 한살이 및 쌀 가공 과정]</strong>에 대한<br>
                        쌀 박사 탐구 퀴즈 5문제를 모두 완벽하게 맞히고,<br>
                        농부의 땀방울과 친환경 생태 농업의 소중한 가치를<br>
                        훌륭히 이해하였으므로 이 상장을 수여합니다.
                    </div>

                    <!-- 일자 및 수여 기관 & 직인 -->
                    <div class="award-bottom-area">
                        <div class="award-date">${dateString}</div>
                        <div class="award-issuer-row">
                            <span class="award-issuer-name">${issuerSchool}</span>
                            <div class="award-seal-stamp">영양<br>박사</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 하단 인쇄 및 HTML 저장 제어 버튼 -->
            <div class="award-action-buttons">
                <button class="stage-action-btn primary btn-html-save" onclick="window.encycloUI.saveAwardAsHtml()" title="내 컴퓨터에 HTML 파일로 평생 보관하기">
                    💾 HTML 파일로 저장
                </button>
                <button class="stage-action-btn btn-print" onclick="window.encycloUI.printAward()" title="프린터 인쇄 또는 PDF로 저장">
                    🖨️ 상장 인쇄하기
                </button>
                <button class="stage-action-btn" onclick="window.encycloUI.resetQuiz()">퀴즈 다시 풀기 🔄</button>
                <button class="stage-action-btn" style="background: #CFD8DC; color: #37474F;" onclick="window.gameApp.closeModal('quizModal')">닫기</button>
            </div>
        `;

        if (window.soundFx) window.soundFx.playFanfare();
        if (window.effectMgr) window.effectMgr.createConfetti(window.innerWidth / 2, window.innerHeight / 3, 90);
    }

    // 상장을 완전한 독립형 단일 HTML 파일로 내려받기
    saveAwardAsHtml() {
        if (!this.currentAwardData) return;
        const d = this.currentAwardData;
        const safeSchool = d.school.replace(/[\\/:*?"<>|]/g, '_');
        const safeName = d.studentName.replace(/[\\/:*?"<>|]/g, '_');
        const filename = `쌀박사_으뜸상장_${safeSchool}_${safeName}.html`;

        const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>상장 [쌀 박사 으뜸상] - ${d.studentName}</title>
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

  .award-wrapper {
    width: 100%;
    max-width: 680px;
    padding: 14px;
    background: #EFE7DA;
    border-radius: 18px;
    box-shadow: 0 12px 36px rgba(0,0,0,0.14);
  }
  .award-card {
    background: #FFFEFA;
    border: 7px double #D4AF37;
    border-radius: 12px;
    padding: 48px 42px 38px;
    position: relative;
    box-shadow: inset 0 0 25px rgba(212, 175, 55, 0.12);
  }
  .award-top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .award-serial {
    font-size: 0.9rem;
    color: #616161;
    font-weight: 600;
  }
  .award-emblem {
    font-size: 1.6rem;
    letter-spacing: 4px;
  }
  .award-main-title {
    font-size: 2.9rem;
    font-weight: 900;
    letter-spacing: 0.5em;
    text-indent: 0.5em;
    color: #1A1A1A;
    text-align: center;
    margin: 8px 0 4px;
  }
  .award-sub-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: #B78103;
    text-align: center;
    letter-spacing: 0.12em;
    margin-bottom: 32px;
  }
  .award-recipient-info {
    margin: 20px 10px 28px;
    font-size: 1.18rem;
    line-height: 2.1;
  }
  .award-recipient-info .info-line {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
  }
  .award-recipient-info .info-label {
    width: 82px;
    font-weight: 800;
    color: #424242;
    letter-spacing: 0.35em;
    flex-shrink: 0;
  }
  .award-recipient-info .info-sep {
    font-weight: 800;
    color: #424242;
    margin-right: 8px;
    flex-shrink: 0;
  }
  .award-recipient-info .info-val {
    font-weight: 700;
    color: #212121;
  }
  .award-recipient-info .student-highlight {
    font-size: 1.45rem;
    font-weight: 900;
    color: #B71C1C;
    text-decoration: underline;
    text-underline-offset: 5px;
  }
  .award-body-text {
    font-size: 1.1rem;
    line-height: 2.1;
    color: #212121;
    text-align: center;
    margin: 26px 0 38px;
    padding: 0 10px;
    word-break: keep-all;
  }
  .award-bottom-area {
    margin-top: 30px;
    text-align: center;
  }
  .award-date {
    font-size: 1.05rem;
    color: #424242;
    margin-bottom: 22px;
    font-weight: 600;
  }
  .award-issuer-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    position: relative;
  }
  .award-issuer-name {
    font-size: 1.6rem;
    font-weight: 900;
    color: #212121;
    letter-spacing: 0.1em;
  }
  .award-seal-stamp {
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
    .award-wrapper {
      max-width: 100%;
      background: none;
      box-shadow: none;
      padding: 0;
      border-radius: 0;
    }
    .award-card {
      border: 6px double #D4AF37;
      box-shadow: none;
      padding: 40px 30px;
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
    <span class="toolbar-tip">🌾 쌀 박사 상장이 HTML 파일로 저장되었습니다!</span>
    <button class="tool-btn btn-print" onclick="window.print()">🖨️ 상장 인쇄 / PDF 저장</button>
    <button class="tool-btn btn-close" onclick="window.close()">✕ 닫기</button>
  </div>
  <div class="award-wrapper">
    <div class="award-card">
      <div class="award-top-row">
        <span class="award-serial">${d.serialNumber}</span>
        <div class="award-emblem">🌾 🎖️ 🌾</div>
      </div>
      <h1 class="award-main-title">상&nbsp;&nbsp;&nbsp;&nbsp;장</h1>
      <div class="award-sub-title">[ 쌀 박사 으뜸상 ]</div>
      <div class="award-recipient-info">
        <div class="info-line"><span class="info-label">소&nbsp;속</span><span class="info-sep">:</span><span class="info-val">${d.school} ${d.gradeClass}</span></div>
        <div class="info-line"><span class="info-label">성&nbsp;명</span><span class="info-sep">:</span><span class="info-val student-highlight">${d.studentName}</span></div>
      </div>
      <div class="award-body-text">
        위 어린이는 <strong>[벼의 한살이 및 쌀 가공 과정]</strong>에 대한<br>
        쌀 박사 탐구 퀴즈 5문제를 모두 완벽하게 맞히고,<br>
        농부의 땀방울과 친환경 생태 농업의 소중한 가치를<br>
        훌륭히 이해하였으므로 이 상장을 수여합니다.
      </div>
      <div class="award-bottom-area">
        <div class="award-date">${d.dateString}</div>
        <div class="award-issuer-row">
          <span class="award-issuer-name">${d.issuerSchool}</span>
          <div class="award-seal-stamp">영양<br>박사</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

        if (window.downloadHtmlFile) {
            window.downloadHtmlFile(filename, htmlContent);
        } else {
            const blob = new Blob(['\uFEFF' + htmlContent], { type: 'text/html;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }

        if (window.soundFx) window.soundFx.playPerfect();
        if (window.gameApp) window.gameApp.showToast(`💾 [${d.studentName}] 상장이 HTML 파일로 저장되었습니다!`);
    }

    printAward() {
        const modal = document.getElementById('quizModal');
        if (modal) modal.classList.add('print-target-modal');
        window.print();
        setTimeout(() => {
            if (modal) modal.classList.remove('print-target-modal');
        }, 1000);
    }
}

window.encycloUI = new EncyclopediaUI();
