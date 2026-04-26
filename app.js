    // ========================================
    // 상수 및 설정
    // ========================================
    const AUTH = {
      // Google Cloud Console에서 발급받은 OAuth 2.0 클라이언트 ID로 교체
      GOOGLE_CLIENT_ID: '27055656717-5e6n898lk22dhjf5mn82hk7q1q25u8vm.apps.googleusercontent.com',
      SHEET_ID: '1cMy2OVO69IfAqIahlyrJNCQUZDuqo1e_3ZM9BomkOXI',
      USER_EMAIL: 'baekeun0@gmail.com',
    };

    // 현재 로그인 사용자 정보
    let currentUser = null;

    // 로컬 날짜 함수 (UTC 사용 금지)
    const today = () => {
      const d = new Date();
      return d.getFullYear() + '-'
        + String(d.getMonth() + 1).padStart(2, '0') + '-'
        + String(d.getDate()).padStart(2, '0');
    };

    // 기본 메뉴 구조
    const DEFAULT_MENUS = [
      { id: 'home', type: 'page', icon: '🏠', name: '홈 대시보드', slug: 'home', order: 0 },
      { 
        id: 'group-daily', 
        type: 'group', 
        icon: '📋', 
        name: '일상 관리', 
        order: 1,
        children: [
          { id: 'daily', type: 'page', icon: '📅', name: '시간표', slug: 'daily', order: 0 },
        ]
      },
      {
        id: 'group-work',
        type: 'group',
        icon: '💼',
        name: '업무',
        order: 2,
        children: [
          { id: 'work', type: 'page', icon: '💼', name: '업무', slug: 'work', order: 0 },
        ]
      },
      {
        id: 'group-life',
        type: 'group',
        icon: '🌱',
        name: '생활',
        order: 3,
        children: [
          { id: 'habit', type: 'page', icon: '✅', name: '습관', slug: 'habit', order: 0 },
          { id: 'recipe', type: 'page', icon: '🍳', name: '레시피', slug: 'recipe', order: 1 },
          { id: 'money', type: 'page', icon: '💰', name: '금전', slug: 'money', order: 2 },
        ]
      },
      {
        id: 'group-misc',
        type: 'group',
        icon: '📝',
        name: '기타',
        order: 4,
        children: [
          { id: 'idea', type: 'page', icon: '💡', name: '아이디어', slug: 'idea', order: 0 },
          { id: 'todo', type: 'page', icon: '📝', name: '할일', slug: 'todo', order: 1 },
        ]
      },
      { id: 'settings', type: 'page', icon: '⚙️', name: '설정', slug: 'settings', order: 5 },
    ];

    // 이모지 데이터
    const EMOJI_DATA = {
      '😊 표정': ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','😵','🤯','🤠','🥳','🥸','😎','🤓','🧐','🤡','👻','💀','☠️','👽','👾','🤖','😺','😸','😹','😻','😼','😽','🙀','😿','😾'],
      '❤️ 마음': ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟'],
      '👋 손': ['👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦿','🦵','🦶','👂','🦻','👃','🧠','🫀','🫁','🦷','🦴','👀','👁️','👅','👄'],
      '🧑 사람': ['👶','🧒','👦','👧','🧑','👱','👨','🧔','👩','🧓','👴','👵','👨‍🦱','👩‍🦱','👨‍🦰','👩‍🦰','👨‍🦳','👩‍🦳','👨‍🦲','👩‍🦲','👮','🕵️','💂','🥷','👷','🤴','👸','👳','👲','🧕','🤵','👰','🤰','🤱','👼','🎅','🤶','🦸','🦹','🧙','🧚','🧛','🧜','🧝','🧞','🧟','💆','💇','🚶','🧍','🧎','🏃','💃','🕺','👯','🧖','🧘','🛀','🛌','🧑‍⚕️','👨‍⚕️','👩‍⚕️','🧑‍🎓','👨‍🎓','👩‍🎓','🧑‍🏫','👨‍🏫','👩‍🏫','🧑‍⚖️','👨‍⚖️','👩‍⚖️','🧑‍🌾','👨‍🌾','👩‍🌾','🧑‍🍳','👨‍🍳','👩‍🍳','🧑‍🔧','👨‍🔧','👩‍🔧','🧑‍🏭','👨‍🏭','👩‍🏭','🧑‍💼','👨‍💼','👩‍💼','🧑‍🔬','👨‍🔬','👩‍🔬','🧑‍💻','👨‍💻','👩‍💻','🧑‍🎤','👨‍🎤','👩‍🎤','🧑‍🎨','👨‍🎨','👩‍🎨','🧑‍✈️','👨‍✈️','👩‍✈️','🧑‍🚀','👨‍🚀','👩‍🚀','🧑‍🚒','👨‍🚒','👩‍🚒','👪','👨‍👩‍👦','👨‍👩‍👧','👨‍👨‍👦','👩‍👩‍👦','👫','👬','👭','💑','💏','🙋','🙆','🙅','🙇','🤦','🤷','🤝','🫂'],
      '💼 업무': ['💼','📁','📂','🗂️','📅','📆','🗓️','📇','📈','📉','📊','📋','📌','📍','📎','🖇️','📏','📐','✂️','🗃️','🗄️','🗑️','🔒','🔓','🔐','🔑','🗝️','🔨','🪛','🔧','🪚','⚙️','🗜️','⚖️','🔗','⛓️','🧰','🧲'],
      '🏠 생활': ['🏠','🏡','🏢','🏣','🏤','🏥','🏦','🏨','🏩','🏪','🏫','🏬','🏭','🏯','🏰','💒','🗼','🗽','⛪','🕌','🛕','🕍','⛩️','🕋','⛲','⛺','🌁','🌃','🏙️','🌄','🌅','🌆','🌇','🌉','♨️','🎠','🎡','🎢','💈','🎪'],
      '🐶 동물': ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐽','🐸','🐵','🙈','🙉','🙊','🐒','🐔','🐧','🐦','🐤','🐣','🐥','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🪱','🐛','🦋','🐌','🐞','🐜','🪰','🪲','🪳','🦟','🦗','🕷️','🕸️','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🐘','🦛','🦏','🐪','🐫','🦒','🦘','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🦮','🐈','🐓','🦃','🦚','🦜','🦢','🦩','🕊️','🐇','🦝','🦨','🦡','🦦','🦥','🐁','🐀','🐿️','🦔','🐾'],
      '🍎 과일': ['🍎','🍏','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🫒','🥑'],
      '🥦 채소': ['🥦','🥬','🥒','🌶️','🫑','🌽','🥕','🧄','🧅','🥔','🍠','🫘','🫛','🍄','🌰','🫚','🫜','🥜'],
      '🍔 음식': ['🍔','🍟','🍕','🌭','🥪','🌮','🌯','🥙','🧆','🥚','🍳','🥘','🍲','🥣','🥗','🍿','🧈','🧂','🥫','🍱','🍘','🍙','🍚','🍛','🍜','🍝','🍠','🍢','🍣','🍤','🍥','🥮','🍡','🥟','🥠','🥡','🦀','🦞','🦐','🦑','🦪','🍦','🍧','🍨','🍩','🍪','🎂','🍰','🧁','🥧','🍫','🍬','🍭','🍮','🍯','🍞','🥐','🥖','🫓','🥨','🥯','🥞','🧇','🧀','🍖','🍗','🥩','🥓','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🍶','🧃','☕','🍵','🥤','🧋','🧊'],
      '⚽ 운동': ['⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🏑','🥍','🏏','🪃','🥅','⛳','🪁','🏹','🎣','🤿','🥊','🥋','🎽','🛹','🛼','🛷','⛸️','🥌','🎿','⛷️','🏂','🪂','🏋️','🤸','🤺','🤾','🏌️','🏇','🧘','🏄','🏊','🤽','🚣','🧗','🚴','🚵','🤹','🏅','🥇','🥈','🥉','🏆','🎖️','🏵️','🎗️','🎫','🎟️'],
      '🎨 취미': ['🎨','🖼️','🖌️','🖍️','✏️','🖊️','🖋️','🎭','🎪','🎬','🎥','📷','📸','📹','🎞️','📽️','🎤','🎧','🎼','🎵','🎶','🎹','🥁','🪘','🎷','🎺','🪗','🎸','🪕','🎻','🎲','♟️','🎯','🎳','🎮','🕹️','🎰','🧩','🪀','🪁','🎏','🎎','🎐','🧵','🪢','🧶','🪡','🎀','🎁','📚','📖','📕','📗','📘','📙','📓','📔','📒','📝','📑','🔖','🎒','🧸','🪆','🪁','🎨','🪅','🪩','🎊','🎉','🎈','🕯️','🪔','💡','🔦','🏮','🪙','🧪','🧫','🧬','🔬','🔭','📡','🛠️','🪛','🧰','🎸','🎻','🧶','🧵','🎼','📯','🎙️','🎚️','🎛️'],
      '📚 학습': ['📚','📖','📕','📗','📘','📙','📓','📔','📒','📃','📜','📄','📰','🗞️','📑','🔖','🏷️','💰','🪙','💴','💵','💶','💷','💸','💳','🧾','✉️','📧','📨','📩','📤','📥','📦','📫','📪','📬','📭','📮'],
      '🌳 자연': ['🌳','🌲','🌱','🌿','☘️','🍀','🎍','🎋','🍃','🍂','🍁','🍄','🌾','💐','🌷','🌹','🥀','🌺','🌸','🌼','🌻','🌞','🌝','🌛','🌜','🌚','🌕','🌖','🌗','🌘','🌑','🌒','🌓','🌔','🌙','🌎','🌍','🌏','🪐','💫','⭐','🌟','✨','⚡','☄️','💥','🔥','🌈','☀️','🌤️','⛅','🌥️','☁️','🌦️','🌧️','⛈️','🌩️','🌨️','❄️','☃️','⛄'],
      '🚗 교통': ['🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🦯','🦽','🦼','🛴','🚲','🛵','🏍️','🛺','🚨','🚔','🚍','🚘','🚖','🚡','🚠','🚟','🚃','🚋','🚞','🚝','🚄','🚅','🚈','🚂','🚆','🚇','🚊','🚉','✈️','🛫','🛬','🛩️','💺','🛰️','🚀','🛸','🚁','🛶','⛵','🚤','🛥️','🛳️','⛴️','🚢','⚓','⛽','🚧','🚦','🚥','🗺️','🗿','🗽'],
      '⏰ 시간': ['⏰','⏱️','⏲️','⌚','🕰️','🌅','🌄','🌠','🎆','🎇','🌇','🌆','🏙️','🌃','🌌','🌉','🌁'],
      '🎮 엔터': ['🎮','🕹️','🎰','🎲','🎯','🎳','🎴','🃏','🀄','🎭','🎨','🧵','🧶','🎼','🎵','🎶','🎤','🎧','📻','🎷','🪗','🎸','🎹','🎺','🎻','🪕','🥁','🪘','📱','📲','☎️','📞','📟','📠','🔋','🔌','💻','🖥️','🖨️','⌨️','🖱️','🖲️','💽','💾','💿','📀'],
      '🔧 도구': ['🔧','🔨','⚒️','🛠️','⛏️','🪓','🪚','🔩','⚙️','🗜️','⚖️','🦯','🔗','⛓️','🪝','🧰','🧲','🪜','🧪','🧫','🧬','🔬','🔭','📡','💉','🩸','💊','🩹','🩺','🚪','🛗','🪞','🪟','🛏️','🛋️','🪑','🚽','🪠','🚿','🛁','🪤','🪒','🧴','🧷','🧹','🧺','🧻','🪣','🧼','🪥','🧽','🧯','🛒'],
      '⚠️ 기호': ['⚠️','🚸','⛔','🚫','🚳','🚭','🚯','🚱','🚷','📵','🔞','☢️','☣️','⬆️','↗️','➡️','↘️','⬇️','↙️','⬅️','↖️','↕️','↔️','↩️','↪️','⤴️','⤵️','🔃','🔄','🔙','🔚','🔛','🔜','🔝','🛐','⚛️','🕉️','✡️','☸️','☯️','✝️','☦️','☪️','☮️','🕎','🔯','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','⛎','▶️','⏸️','⏯️','⏹️','⏺️','⏭️','⏮️','⏩','⏪','⏫','⏬','◀️','🔼','🔽','➡️','⬅️','⬆️','⬇️','↗️','↘️','↙️','↖️','↕️','↔️','↪️','↩️','⤴️','⤵️','🔀','🔁','🔂','🔄','🔃','🎵','🎶','➕','➖','➗','✖️','♾️','💲','💱','™️','©️','®️','〰️','➰','➿','🔚','🔙','🔛','🔝','🔜','✔️','☑️','🔘','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','🔺','🔻','🔸','🔹','🔶','🔷','🔳','🔲','▪️','▫️','◾','◽','◼️','◻️','🟥','🟧','🟨','🟩','🟦','🟪','⬛','⬜','🟫','🔈','🔇','🔉','🔊','🔔','🔕','📣','📢','💬','💭','🗯️','♠️','♣️','♥️','♦️','🃏','🎴','🀄','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚','🕛']
    };

    // ========================================
    // 이모지 키워드 (검색용) - 전역 상수
    // 한글/영어 키워드로 이모지 검색 지원
    // ========================================
    const EMOJI_KEYWORDS = {
      // 😊 표정
      '😀': ['웃음','미소','smile','happy','grin','face'],
      '😃': ['웃음','미소','smile','happy','smiley','face'],
      '😄': ['웃음','미소','smile','happy','laugh','face'],
      '😁': ['웃음','미소','grin','happy','teeth','beam'],
      '😆': ['웃음','laugh','satisfied','squint'],
      '😅': ['웃음','sweat','laugh','relief','땀'],
      '🤣': ['웃음','laugh','rofl','rolling','박장대소'],
      '😂': ['웃음','laugh','tears','joy','눈물','폭소'],
      '🙂': ['미소','smile','slight','은은','살짝'],
      '🙃': ['거꾸로','upside','down','반전'],
      '😉': ['윙크','wink','flirt'],
      '😊': ['미소','blush','smile','happy','홍조','수줍'],
      '😇': ['천사','angel','halo','innocent','순수'],
      '🥰': ['사랑','love','hearts','smile','반함'],
      '😍': ['하트눈','love','heart','eyes','반함','좋아'],
      '🤩': ['별눈','star','struck','excited','감동','신남'],
      '😘': ['뽀뽀','kiss','blow','키스'],
      '😗': ['뽀뽀','kiss','whistle','휘파람'],
      '😚': ['뽀뽀','kiss','closed','eyes'],
      '😙': ['뽀뽀','kiss','smile'],
      '🥲': ['감동','tear','smile','눈물'],
      '😋': ['맛있','yum','food','tasty','delicious'],
      '😛': ['메롱','tongue','혀','놀림'],
      '😜': ['메롱','tongue','wink','윙크','장난'],
      '🤪': ['미친','zany','crazy','goofy','엉뚱'],
      '😝': ['메롱','tongue','squint','장난'],
      '🤑': ['돈','money','mouth','rich','부자'],
      '🤗': ['포옹','hug','hugging','따뜻'],
      '🤭': ['웃음참기','giggle','shush','입가림'],
      '🤫': ['쉿','shush','quiet','조용'],
      '🤔': ['생각','think','thinking','궁금','의문'],
      '🤐': ['입다물','zipper','mouth','비밀'],
      '🤨': ['의심','raised','eyebrow','수상'],
      '😐': ['무표정','neutral','face','담담'],
      '😑': ['무표정','expressionless','blank'],
      '😶': ['무표정','no','mouth','침묵'],
      '😏': ['음흉','smirk','sly','음험'],
      '😒': ['언짢','unamused','시큰둥','불만'],
      '🙄': ['눈굴림','roll','eyes','한심'],
      '😬': ['민망','grimace','awkward','어색'],
      '🤥': ['거짓말','lying','lie','nose','pinocchio'],
      '😌': ['평온','relieved','content','안도'],
      '😔': ['시무룩','pensive','sad','우울'],
      '😪': ['졸림','sleepy','tired','피곤'],
      '🤤': ['침흘림','drool','drooling','탐냄'],
      '😴': ['잠','sleep','sleeping','zzz','꿈'],
      '😷': ['마스크','mask','sick','medical','아픔'],
      '🤒': ['아픔','sick','fever','thermometer','열'],
      '🤕': ['부상','hurt','bandage','injury','다침'],
      '🤢': ['구역질','nauseous','sick','역겨움'],
      '🤮': ['토','vomit','puke','구토'],
      '🤧': ['재채기','sneeze','cold','감기'],
      '🥵': ['더움','hot','sweat','heat','땀'],
      '🥶': ['추움','cold','freeze','blue'],
      '😵': ['어지러움','dizzy','knocked','out'],
      '🤯': ['폭발','mind','blown','shocked','충격'],
      '🤠': ['카우보이','cowboy','hat','서부'],
      '🥳': ['축하','party','celebrate','파티','생일'],
      '🥸': ['변장','disguise','fake','위장'],
      '😎': ['멋짐','cool','sunglasses','선글라스'],
      '🤓': ['너드','nerd','geek','glasses','공부'],
      '🧐': ['외눈안경','monocle','curious','탐구'],

      // ❤️ 마음
      '❤️': ['하트','heart','love','red','사랑','빨강'],
      '🧡': ['하트','heart','orange','love','주황'],
      '💛': ['하트','heart','yellow','love','노랑'],
      '💚': ['하트','heart','green','love','초록'],
      '💙': ['하트','heart','blue','love','파랑'],
      '💜': ['하트','heart','purple','love','보라'],
      '🖤': ['하트','heart','black','love','검정'],
      '🤍': ['하트','heart','white','love','흰색'],
      '🤎': ['하트','heart','brown','love','갈색'],
      '💔': ['하트','heart','broken','break','상심','이별'],
      '❣️': ['하트','heart','exclamation','느낌표'],
      '💕': ['하트','heart','love','two','두개'],
      '💞': ['하트','heart','revolving','회전'],
      '💓': ['하트','heart','beating','두근'],
      '💗': ['하트','heart','growing','커짐'],
      '💖': ['하트','heart','sparkling','반짝'],
      '💘': ['하트','heart','arrow','cupid','화살','큐피드'],
      '💝': ['하트','heart','gift','box','선물'],
      '💟': ['하트','heart','decoration','장식'],

      // 👋 손
      '👋': ['손','hand','wave','hi','hello','bye','안녕','인사'],
      '🤚': ['손','hand','raised','back','뒷면'],
      '🖐️': ['손','hand','fingers','splayed','펼침'],
      '✋': ['손','hand','stop','high','five','멈춤','하이파이브'],
      '🖖': ['손','hand','vulcan','spock','스팍'],
      '👌': ['손','hand','ok','okay','good','좋음'],
      '🤌': ['손','hand','pinched','fingers','이탈리아'],
      '🤏': ['손','hand','pinch','small','조금'],
      '✌️': ['손','hand','peace','victory','브이','승리'],
      '🤞': ['손','hand','fingers','crossed','luck','행운'],
      '🤟': ['손','hand','love','you','사랑해'],
      '🤘': ['손','hand','rock','horns','록','헤비메탈'],
      '🤙': ['손','hand','call','me','전화'],
      '👈': ['손','hand','left','왼쪽','가리킴'],
      '👉': ['손','hand','right','오른쪽','가리킴'],
      '👆': ['손','hand','up','위','가리킴'],
      '🖕': ['손','hand','middle','finger','중지','욕'],
      '👇': ['손','hand','down','아래','가리킴'],
      '☝️': ['손','hand','up','index','검지','위'],
      '👍': ['손','hand','thumbs','up','good','like','yes','좋음','엄지','따봉'],
      '👎': ['손','hand','thumbs','down','bad','dislike','no','싫음','엄지'],
      '✊': ['손','hand','fist','punch','주먹'],
      '👊': ['손','hand','fist','bump','punch','주먹'],
      '🤛': ['손','hand','fist','left','왼주먹'],
      '🤜': ['손','hand','fist','right','오른주먹'],
      '👏': ['손','hand','clap','applause','박수'],
      '🙌': ['손','hand','raising','celebration','만세'],
      '👐': ['손','hand','open','hands','열린손'],
      '🤲': ['손','hand','palms','together','두손'],
      '🤝': ['손','hand','shake','handshake','악수'],
      '🙏': ['손','hand','pray','thank','please','기도','감사','부탁'],
      '✍️': ['손','hand','writing','write','쓰기'],
      '💅': ['손톱','nail','polish','manicure','매니큐어'],
      '🤳': ['셀카','selfie','self','portrait'],

      // 💼 업무
      '💼': ['업무','work','briefcase','business','office','가방'],
      '📁': ['폴더','folder','file','directory'],
      '📂': ['폴더','folder','open','file','열림'],
      '🗂️': ['파일','file','divider','분류'],
      '📅': ['달력','calendar','date','schedule','일정'],
      '📆': ['달력','calendar','date','tear','날짜'],
      '🗓️': ['달력','calendar','spiral','스케줄'],
      '📇': ['명함','card','index','rolodex'],
      '📈': ['그래프','chart','increase','up','상승','trend'],
      '📉': ['그래프','chart','decrease','down','하락'],
      '📊': ['차트','chart','bar','graph','막대'],
      '📋': ['클립보드','clipboard','list','memo','목록'],
      '📌': ['핀','pin','pushpin','tack','압정'],
      '📍': ['핀','pin','location','map','위치'],
      '📎': ['클립','clip','paperclip','종이'],
      '🖇️': ['클립','clip','linked','paperclips'],
      '📏': ['자','ruler','straight','measure'],
      '📐': ['자','ruler','triangular','삼각자'],
      '✂️': ['가위','scissors','cut','자르기'],
      '🗃️': ['파일박스','file','box','card'],
      '🗄️': ['파일캐비닛','file','cabinet','드로어'],
      '🗑️': ['쓰레기','trash','wastebasket','delete','휴지통'],
      '🔒': ['잠금','lock','secure','closed','자물쇠'],
      '🔓': ['잠금해제','unlock','open','열림'],
      '🔐': ['잠금','lock','key','보안'],
      '🔑': ['열쇠','key','unlock'],
      '🗝️': ['열쇠','key','old','옛날'],
      '🔨': ['망치','hammer','tool','도구'],
      '🪛': ['드라이버','screwdriver','tool'],
      '🔧': ['렌치','wrench','tool','도구','수리'],
      '🪚': ['톱','saw','tool','carpentry','목공'],
      '⚙️': ['톱니','gear','setting','config','설정'],
      '⚖️': ['저울','scales','balance','justice','공정'],
      '🔗': ['링크','link','chain','연결'],
      '⛓️': ['사슬','chains','chain'],
      '🧰': ['공구','toolbox','tools','공구함'],
      '🧲': ['자석','magnet','attract'],

      // 🏠 생활
      '🏠': ['집','home','house'],
      '🏡': ['집','home','house','garden','정원'],
      '🏢': ['건물','building','office','work','회사'],
      '🏣': ['우체국','post','office','japanese'],
      '🏤': ['우체국','post','office','european'],
      '🏥': ['병원','hospital','medical','doctor','의료'],
      '🏦': ['은행','bank','money','금융'],
      '🏨': ['호텔','hotel','숙박'],
      '🏩': ['러브호텔','love','hotel'],
      '🏪': ['편의점','store','shop','convenience','가게'],
      '🏫': ['학교','school','education','공부'],
      '🏬': ['백화점','department','store','쇼핑'],
      '🏭': ['공장','factory','industry','산업'],
      '🏯': ['성','castle','japanese','일본'],
      '🏰': ['성','castle','european','동화'],
      '💒': ['교회','wedding','chapel','결혼식'],
      '🗼': ['탑','tower','tokyo','도쿄'],
      '🗽': ['자유의여신상','statue','liberty','뉴욕'],
      '⛪': ['교회','church','종교'],
      '🕌': ['모스크','mosque','이슬람'],
      '🕍': ['시너고그','synagogue','유대교'],
      '⛩️': ['신사','shrine','shinto','일본'],
      '⛲': ['분수','fountain'],
      '⛺': ['텐트','tent','camping','캠핑'],
      '🌁': ['안개','foggy','fog'],
      '🌃': ['밤','night','stars','별'],
      '🏙️': ['도시','cityscape','city','스카이라인'],
      '🌄': ['일출','sunrise','mountain','산'],
      '🌅': ['일출','sunrise'],
      '🌆': ['도시','city','dusk','저녁'],
      '🌇': ['석양','sunset','buildings'],
      '🌉': ['다리','bridge','night','밤'],
      '♨️': ['온천','hot','springs'],
      '🎠': ['회전목마','carousel','horse'],
      '🎡': ['대관람차','ferris','wheel'],
      '🎢': ['롤러코스터','roller','coaster'],
      '🎪': ['서커스','circus','tent','텐트'],

      // 🐶 동물
      '🐶': ['동물','animal','dog','puppy','강아지','개','멍멍'],
      '🐱': ['동물','animal','cat','kitten','고양이','냥','야옹'],
      '🐭': ['동물','animal','mouse','쥐','생쥐'],
      '🐹': ['동물','animal','hamster','햄스터'],
      '🐰': ['동물','animal','rabbit','bunny','토끼'],
      '🦊': ['동물','animal','fox','여우'],
      '🐻': ['동물','animal','bear','곰'],
      '🐼': ['동물','animal','panda','판다'],
      '🐨': ['동물','animal','koala','코알라'],
      '🐯': ['동물','animal','tiger','호랑이','타이거'],
      '🦁': ['동물','animal','lion','사자'],
      '🐮': ['동물','animal','cow','소','젖소'],
      '🐷': ['동물','animal','pig','돼지'],
      '🐽': ['동물','animal','pig','nose','돼지코'],
      '🐸': ['동물','animal','frog','개구리'],
      '🐵': ['동물','animal','monkey','원숭이'],
      '🙈': ['동물','animal','monkey','see','no','evil','원숭이','눈가림'],
      '🙉': ['동물','animal','monkey','hear','no','evil','원숭이','귀막음'],
      '🙊': ['동물','animal','monkey','speak','no','evil','원숭이','입막음'],
      '🐒': ['동물','animal','monkey','원숭이'],
      '🐔': ['동물','animal','chicken','닭'],
      '🐧': ['동물','animal','penguin','펭귄'],
      '🐦': ['동물','animal','bird','새'],
      '🐤': ['동물','animal','baby','chick','병아리'],
      '🐣': ['동물','animal','hatching','chick','병아리','부화'],
      '🐥': ['동물','animal','chick','front','병아리'],
      '🦆': ['동물','animal','duck','오리'],
      '🦅': ['동물','animal','eagle','독수리'],
      '🦉': ['동물','animal','owl','부엉이','올빼미'],
      '🦇': ['동물','animal','bat','박쥐'],
      '🐺': ['동물','animal','wolf','늑대'],
      '🐗': ['동물','animal','boar','멧돼지'],
      '🐴': ['동물','animal','horse','face','말'],
      '🦄': ['동물','animal','unicorn','유니콘'],
      '🐝': ['동물','animal','bee','honeybee','꿀벌','벌'],
      '🪱': ['동물','animal','worm','지렁이','벌레'],
      '🐛': ['동물','animal','bug','caterpillar','애벌레','벌레'],
      '🦋': ['동물','animal','butterfly','나비'],
      '🐌': ['동물','animal','snail','달팽이'],
      '🐞': ['동물','animal','ladybug','무당벌레'],
      '🐜': ['동물','animal','ant','개미'],
      '🪰': ['동물','animal','fly','파리'],
      '🪲': ['동물','animal','beetle','딱정벌레'],
      '🪳': ['동물','animal','cockroach','바퀴벌레'],
      '🦟': ['동물','animal','mosquito','모기'],
      '🦗': ['동물','animal','cricket','귀뚜라미'],
      '🕷️': ['동물','animal','spider','거미'],
      '🕸️': ['동물','animal','spider','web','거미줄'],
      '🦂': ['동물','animal','scorpion','전갈'],
      '🐢': ['동물','animal','turtle','거북이'],
      '🐍': ['동물','animal','snake','뱀'],
      '🦎': ['동물','animal','lizard','도마뱀'],
      '🦖': ['동물','animal','dinosaur','t-rex','공룡','티라노'],
      '🦕': ['동물','animal','dinosaur','sauropod','공룡'],
      '🐙': ['동물','animal','octopus','문어'],
      '🐡': ['동물','animal','blowfish','pufferfish','복어'],
      '🐠': ['동물','animal','tropical','fish','열대어'],
      '🐟': ['동물','animal','fish','물고기'],
      '🐬': ['동물','animal','dolphin','돌고래'],
      '🐳': ['동물','animal','whale','고래'],
      '🐋': ['동물','animal','whale','고래'],
      '🦈': ['동물','animal','shark','상어'],
      '🐊': ['동물','animal','crocodile','악어'],
      '🐅': ['동물','animal','tiger','호랑이'],
      '🐆': ['동물','animal','leopard','표범'],
      '🦓': ['동물','animal','zebra','얼룩말'],
      '🦍': ['동물','animal','gorilla','고릴라'],
      '🦧': ['동물','animal','orangutan','오랑우탄'],
      '🐘': ['동물','animal','elephant','코끼리'],
      '🦛': ['동물','animal','hippopotamus','hippo','하마'],
      '🦏': ['동물','animal','rhinoceros','rhino','코뿔소'],
      '🐪': ['동물','animal','camel','낙타'],
      '🐫': ['동물','animal','camel','two','hump','쌍봉낙타'],
      '🦒': ['동물','animal','giraffe','기린'],
      '🦘': ['동물','animal','kangaroo','캥거루'],
      '🐃': ['동물','animal','water','buffalo','물소'],
      '🐂': ['동물','animal','ox','황소'],
      '🐄': ['동물','animal','cow','소','젖소'],
      '🐎': ['동물','animal','horse','말'],
      '🐖': ['동물','animal','pig','돼지'],
      '🐏': ['동물','animal','ram','숫양'],
      '🐑': ['동물','animal','sheep','양'],
      '🦙': ['동물','animal','llama','라마'],
      '🐐': ['동물','animal','goat','염소'],
      '🦌': ['동물','animal','deer','사슴'],
      '🐕': ['동물','animal','dog','개','강아지'],
      '🐩': ['동물','animal','poodle','푸들'],
      '🦮': ['동물','animal','guide','dog','안내견'],
      '🐈': ['동물','animal','cat','고양이'],
      '🐓': ['동물','animal','rooster','수탉'],
      '🦃': ['동물','animal','turkey','칠면조'],
      '🦚': ['동물','animal','peacock','공작'],
      '🦜': ['동물','animal','parrot','앵무새'],
      '🦢': ['동물','animal','swan','백조'],
      '🦩': ['동물','animal','flamingo','플라밍고','홍학'],
      '🕊️': ['동물','animal','dove','비둘기','평화'],
      '🐇': ['동물','animal','rabbit','토끼'],
      '🦝': ['동물','animal','raccoon','너구리'],
      '🦨': ['동물','animal','skunk','스컹크'],
      '🦡': ['동물','animal','badger','오소리'],
      '🦦': ['동물','animal','otter','수달'],
      '🦥': ['동물','animal','sloth','나무늘보'],
      '🐁': ['동물','animal','mouse','쥐'],
      '🐀': ['동물','animal','rat','쥐'],
      '🐿️': ['동물','animal','chipmunk','다람쥐'],
      '🦔': ['동물','animal','hedgehog','고슴도치'],
      '🐾': ['동물','animal','paw','prints','발자국'],

      // 🍔 음식
      '🍔': ['음식','food','burger','hamburger','햄버거'],
      '🍟': ['음식','food','fries','french','감자튀김'],
      '🍕': ['음식','food','pizza','피자'],
      '🌭': ['음식','food','hotdog','핫도그'],
      '🥪': ['음식','food','sandwich','샌드위치'],
      '🌮': ['음식','food','taco','타코'],
      '🌯': ['음식','food','burrito','부리또'],
      '🥙': ['음식','food','stuffed','flatbread'],
      '🧆': ['음식','food','falafel'],
      '🥚': ['음식','food','egg','계란'],
      '🍳': ['음식','food','egg','cook','fry','계란프라이','요리'],
      '🥘': ['음식','food','pan','shallow','팬요리'],
      '🍲': ['음식','food','pot','stew','찌개','전골'],
      '🥣': ['음식','food','bowl','spoon','그릇'],
      '🥗': ['음식','food','salad','샐러드'],
      '🍿': ['음식','food','popcorn','팝콘'],
      '🧈': ['음식','food','butter','버터'],
      '🧂': ['음식','food','salt','소금'],
      '🥫': ['음식','food','canned','통조림'],
      '🍱': ['음식','food','bento','box','lunch','도시락'],
      '🍘': ['음식','food','rice','cracker','센베이'],
      '🍙': ['음식','food','rice','ball','삼각김밥','주먹밥'],
      '🍚': ['음식','food','rice','cooked','밥','쌀밥'],
      '🍛': ['음식','food','curry','rice','카레'],
      '🍜': ['음식','food','ramen','noodle','라면','면'],
      '🍝': ['음식','food','spaghetti','pasta','파스타','스파게티'],
      '🍠': ['음식','food','sweet','potato','고구마'],
      '🍢': ['음식','food','oden','꼬치','어묵'],
      '🍣': ['음식','food','sushi','초밥'],
      '🍤': ['음식','food','shrimp','fried','새우튀김'],
      '🍥': ['음식','food','fish','cake','나루토'],
      '🥮': ['음식','food','moon','cake','월병'],
      '🍡': ['음식','food','dango','경단'],
      '🥟': ['음식','food','dumpling','만두'],
      '🦀': ['음식','food','crab','게'],
      '🦞': ['음식','food','lobster','랍스터','바닷가재'],
      '🦐': ['음식','food','shrimp','새우'],
      '🦑': ['음식','food','squid','오징어'],
      '🦪': ['음식','food','oyster','굴'],
      '🍦': ['음식','food','ice','cream','soft','아이스크림'],
      '🍧': ['음식','food','ice','shaved','빙수','팥빙수'],
      '🍨': ['음식','food','ice','cream','아이스크림'],
      '🍩': ['음식','food','donut','doughnut','도넛'],
      '🍪': ['음식','food','cookie','쿠키'],
      '🎂': ['음식','food','cake','birthday','생일','케이크'],
      '🍰': ['음식','food','cake','dessert','케이크','조각'],
      '🧁': ['음식','food','cupcake','컵케이크'],
      '🥧': ['음식','food','pie','파이'],
      '🍫': ['음식','food','chocolate','초콜릿'],
      '🍬': ['음식','food','candy','사탕'],
      '🍭': ['음식','food','lollipop','막대사탕'],
      '🍮': ['음식','food','pudding','푸딩','커스터드'],
      '🍯': ['음식','food','honey','꿀'],

      // ⚽ 운동
      '⚽': ['운동','sport','soccer','football','ball','축구'],
      '🏀': ['운동','sport','basketball','ball','농구'],
      '🏈': ['운동','sport','football','american','미식축구'],
      '⚾': ['운동','sport','baseball','ball','야구'],
      '🥎': ['운동','sport','softball','소프트볼'],
      '🎾': ['운동','sport','tennis','ball','테니스'],
      '🏐': ['운동','sport','volleyball','ball','배구'],
      '🏉': ['운동','sport','rugby','ball','럭비'],
      '🥏': ['운동','sport','frisbee','프리스비'],
      '🎱': ['운동','sport','billiards','pool','당구'],
      '🪀': ['요요','yo-yo'],
      '🏓': ['운동','sport','ping','pong','table','tennis','탁구'],
      '🏸': ['운동','sport','badminton','배드민턴'],
      '🏒': ['운동','sport','hockey','ice','하키'],
      '🏑': ['운동','sport','hockey','field','필드하키'],
      '🥍': ['운동','sport','lacrosse','라크로스'],
      '🏏': ['운동','sport','cricket','크리켓'],
      '🪃': ['부메랑','boomerang'],
      '🥅': ['운동','sport','goal','골대'],
      '⛳': ['운동','sport','golf','flag','골프','홀'],
      '🪁': ['연','kite'],
      '🏹': ['운동','sport','bow','arrow','활','양궁'],
      '🎣': ['낚시','fishing','pole','fish','물고기'],
      '🤿': ['운동','sport','diving','mask','다이빙'],
      '🥊': ['운동','sport','boxing','glove','복싱','권투'],
      '🥋': ['운동','sport','martial','arts','uniform','태권도','유도'],
      '🎽': ['운동','sport','running','shirt','러닝'],
      '🛹': ['운동','sport','skateboard','스케이트보드'],
      '🛼': ['운동','sport','roller','skate','롤러스케이트'],
      '🛷': ['운동','sport','sled','썰매'],
      '⛸️': ['운동','sport','ice','skate','스케이트'],
      '🥌': ['운동','sport','curling','stone','컬링'],
      '🎿': ['운동','sport','ski','skis','스키'],
      '⛷️': ['운동','sport','ski','skiing','snow','스키'],
      '🏂': ['운동','sport','snowboarder','스노보드'],
      '🪂': ['운동','sport','parachute','낙하산'],
      '🏋️': ['운동','sport','weight','lifting','gym','역도','헬스'],
      '🤸': ['운동','sport','cartwheel','체조'],
      '🤺': ['운동','sport','fencing','펜싱'],
      '🤾': ['운동','sport','handball','핸드볼'],
      '🏌️': ['운동','sport','golf','골프'],
      '🏇': ['운동','sport','horse','racing','경마'],
      '🧘': ['운동','sport','yoga','meditation','요가','명상'],
      '🏄': ['운동','sport','surfing','서핑'],
      '🏊': ['운동','sport','swim','swimming','pool','수영'],
      '🤽': ['운동','sport','water','polo','수구'],
      '🚣': ['운동','sport','rowing','boat','조정','보트'],
      '🧗': ['운동','sport','climbing','등산','클라이밍'],
      '🚴': ['운동','sport','bike','bicycle','cycling','자전거'],
      '🚵': ['운동','sport','mountain','bike','산악자전거'],
      '🤹': ['운동','sport','juggling','저글링'],

      // 🎨 취미
      '🎨': ['취미','hobby','art','paint','palette','미술','그림'],
      '🖼️': ['그림','picture','frame','액자'],
      '🎭': ['연극','theater','drama','mask','가면'],
      '🎬': ['영화','movie','film','cinema','clapper'],
      '🎤': ['마이크','mic','microphone','sing','노래'],
      '🎧': ['헤드폰','headphone','listen','music','음악'],
      '🎼': ['악보','music','score','sheet'],
      '🎹': ['피아노','piano','keyboard','키보드'],
      '🥁': ['드럼','drum','음악'],
      '🎷': ['색소폰','saxophone','jazz'],
      '🎺': ['트럼펫','trumpet'],
      '🪗': ['아코디언','accordion'],
      '🎸': ['기타','guitar','음악'],
      '🪕': ['밴조','banjo'],
      '🎻': ['바이올린','violin'],
      '🎲': ['주사위','dice','play','게임'],
      '♟️': ['체스','chess','pawn'],
      '🎯': ['다트','dart','target','bullseye','과녁'],
      '🎳': ['볼링','bowling','게임'],
      '🎮': ['게임','game','play','video','controller','비디오게임','플레이스테이션'],
      '🎰': ['슬롯머신','slot','machine','casino','도박'],
      '🧩': ['퍼즐','puzzle','jigsaw'],
      '🎏': ['잉어','carp','streamer','코이노보리'],
      '🎎': ['일본인형','japanese','dolls'],
      '🎐': ['풍경','wind','chime','후린'],
      '🧵': ['실','thread','sewing','바느질'],
      '🪢': ['매듭','knot'],
      '🧶': ['털실','yarn','knit','뜨개질'],
      '🪡': ['바늘','sewing','needle'],
      '🎀': ['리본','ribbon','bow'],
      '🎁': ['선물','gift','present','box','상자'],

      // 📚 학습
      '📚': ['학습','study','book','books','library','read','책','도서관'],
      '📖': ['학습','study','book','open','read','책','독서'],
      '📕': ['학습','study','book','red','빨간책'],
      '📗': ['학습','study','book','green','초록책'],
      '📘': ['학습','study','book','blue','파란책'],
      '📙': ['학습','study','book','orange','주황책'],
      '📓': ['학습','study','notebook','공책'],
      '📔': ['학습','study','notebook','decorative','노트'],
      '📒': ['학습','study','ledger','장부'],
      '📃': ['종이','page','curl','문서'],
      '📜': ['두루마리','scroll','paper'],
      '📄': ['종이','page','document','문서'],
      '📰': ['신문','newspaper','news'],
      '🗞️': ['신문','newspaper','rolled'],
      '📑': ['책갈피','bookmark','tabs'],
      '🔖': ['책갈피','bookmark'],
      '🏷️': ['태그','label','tag'],
      '💰': ['돈','money','bag','가방','부자'],
      '🪙': ['동전','coin','money'],
      '💴': ['엔화','yen','money','일본'],
      '💵': ['달러','dollar','money','미국'],
      '💶': ['유로','euro','money','유럽'],
      '💷': ['파운드','pound','money','영국'],
      '💸': ['돈날아감','money','wings','지출'],
      '💳': ['카드','credit','card','결제'],
      '🧾': ['영수증','receipt','계산서'],
      '✏️': ['연필','pencil','write','쓰기'],
      '✒️': ['펜','pen','nib','만년필'],
      '🖊️': ['펜','pen','ballpoint','볼펜'],
      '🖋️': ['만년필','pen','fountain'],
      '✉️': ['편지','envelope','mail','메일'],
      '📧': ['이메일','email','mail','메일'],
      '📨': ['받은메일','incoming','envelope'],
      '📩': ['메일','envelope','arrow'],
      '📤': ['보낸메일','outbox','tray'],
      '📥': ['받은메일','inbox','tray'],
      '📦': ['택배','package','box','상자'],
      '📫': ['우편함','mailbox','closed','flag'],
      '📪': ['우편함','mailbox','closed','lowered'],
      '📬': ['우편함','mailbox','open','flag'],
      '📭': ['우편함','mailbox','open','lowered'],
      '📮': ['우체통','postbox'],

      // 🌳 자연
      '🌳': ['자연','nature','tree','plant','나무'],
      '🌲': ['자연','nature','tree','evergreen','침엽수'],
      '🌱': ['자연','nature','plant','seedling','sprout','새싹','성장'],
      '🌿': ['자연','nature','plant','herb','leaf','잎','허브'],
      '☘️': ['자연','nature','shamrock','클로버'],
      '🍀': ['자연','nature','plant','clover','four','leaf','luck','네잎클로버','행운'],
      '🎍': ['자연','nature','bamboo','대나무'],
      '🎋': ['자연','nature','tanabata','tree'],
      '🍃': ['자연','nature','leaves','falling','나뭇잎'],
      '🍂': ['자연','nature','leaf','fallen','낙엽'],
      '🍁': ['자연','nature','maple','leaf','단풍'],
      '🍄': ['자연','nature','mushroom','버섯'],
      '🌾': ['자연','nature','rice','sheaf','벼'],
      '💐': ['자연','nature','flower','bouquet','꽃다발'],
      '🌷': ['자연','nature','flower','tulip','튤립'],
      '🌹': ['자연','nature','flower','rose','장미'],
      '🥀': ['자연','nature','wilted','flower','시든꽃'],
      '🌺': ['자연','nature','flower','hibiscus','히비스커스'],
      '🌸': ['자연','nature','flower','cherry','blossom','벚꽃'],
      '🌼': ['자연','nature','flower','blossom','데이지'],
      '🌻': ['자연','nature','flower','sunflower','해바라기'],
      '🌞': ['자연','nature','sun','face','sunny','태양'],
      '🌝': ['자연','nature','moon','face','full','보름달'],
      '🌛': ['자연','nature','moon','first','quarter'],
      '🌜': ['자연','nature','moon','last','quarter'],
      '🌚': ['자연','nature','moon','new','그믐'],
      '🌕': ['자연','nature','moon','full','보름'],
      '🌖': ['자연','nature','moon','waning','gibbous'],
      '🌗': ['자연','nature','moon','last','quarter'],
      '🌘': ['자연','nature','moon','waning','crescent'],
      '🌑': ['자연','nature','moon','new'],
      '🌒': ['자연','nature','moon','waxing','crescent'],
      '🌓': ['자연','nature','moon','first','quarter'],
      '🌔': ['자연','nature','moon','waxing','gibbous'],
      '🌙': ['자연','nature','moon','crescent','초승달'],
      '🌎': ['자연','nature','earth','americas','지구'],
      '🌍': ['자연','nature','earth','africa','europe','지구'],
      '🌏': ['자연','nature','earth','asia','australia','지구'],
      '🪐': ['자연','nature','ringed','planet','토성'],
      '💫': ['자연','nature','dizzy','star','어지러움'],
      '⭐': ['자연','nature','star','별'],
      '🌟': ['자연','nature','star','glowing','반짝이는별'],
      '✨': ['자연','nature','sparkle','star','반짝'],
      '⚡': ['자연','nature','lightning','bolt','zap','번개'],
      '☄️': ['자연','nature','comet','혜성'],
      '💥': ['자연','nature','collision','boom','폭발'],
      '🔥': ['자연','nature','fire','flame','hot','불','뜨거움'],
      '🌈': ['자연','nature','rainbow','무지개'],
      '☀️': ['자연','nature','sun','sunny','weather','해','맑음'],
      '🌤️': ['자연','nature','sun','cloud','weather'],
      '⛅': ['자연','nature','cloud','sun','weather','구름해'],
      '🌥️': ['자연','nature','cloud','sun','weather'],
      '☁️': ['자연','nature','cloud','weather','구름'],
      '🌦️': ['자연','nature','cloud','rain','weather'],
      '🌧️': ['자연','nature','rain','weather','비'],
      '⛈️': ['자연','nature','storm','thunder','weather','폭풍'],
      '🌩️': ['자연','nature','lightning','cloud','번개'],
      '🌨️': ['자연','nature','snow','cloud','눈'],
      '❄️': ['자연','nature','snow','cold','winter','눈','겨울'],
      '☃️': ['자연','nature','snowman','눈사람'],
      '⛄': ['자연','nature','snowman','without','snow','눈사람'],

      // 🚗 교통
      '🚗': ['교통','car','transport','vehicle','auto','자동차'],
      '🚕': ['교통','car','taxi','transport','택시'],
      '🚙': ['교통','car','suv','transport','SUV'],
      '🚌': ['교통','bus','transport','public','버스'],
      '🚎': ['교통','bus','trolley','transport','트롤리'],
      '🏎️': ['교통','racing','car','레이싱'],
      '🚓': ['교통','car','police','경찰차'],
      '🚑': ['교통','ambulance','구급차'],
      '🚒': ['교통','fire','engine','소방차'],
      '🚐': ['교통','van','minibus','transport','승합차'],
      '🛻': ['교통','pickup','truck','픽업트럭'],
      '🚚': ['교통','truck','delivery','transport','트럭'],
      '🚛': ['교통','truck','articulated','대형트럭'],
      '🚜': ['교통','tractor','트랙터'],
      '🛴': ['교통','scooter','kick','킥보드'],
      '🚲': ['교통','bike','bicycle','cycle','자전거'],
      '🛵': ['교통','scooter','motor','스쿠터'],
      '🏍️': ['교통','motorcycle','bike','오토바이'],
      '🛺': ['교통','auto','rickshaw','툭툭'],
      '🚨': ['경광등','police','light','siren'],
      '🚔': ['교통','police','car','oncoming'],
      '🚍': ['교통','bus','oncoming'],
      '🚘': ['교통','car','oncoming'],
      '🚖': ['교통','taxi','oncoming'],
      '🚡': ['교통','aerial','tramway'],
      '🚠': ['교통','mountain','cableway'],
      '🚟': ['교통','suspension','railway'],
      '🚃': ['교통','railway','car'],
      '🚋': ['교통','tram','car'],
      '🚞': ['교통','mountain','railway'],
      '🚝': ['교통','monorail'],
      '🚄': ['교통','train','bullet','speed','고속열차'],
      '🚅': ['교통','train','bullet','speed','KTX'],
      '🚈': ['교통','light','rail','경전철'],
      '🚂': ['교통','train','locomotive','기관차'],
      '🚆': ['교통','train','railway','기차'],
      '🚇': ['교통','subway','metro','train','지하철'],
      '🚊': ['교통','tram'],
      '🚉': ['교통','station','역'],
      '✈️': ['교통','airplane','plane','flight','fly','비행기'],
      '🛫': ['교통','airplane','departure','이륙'],
      '🛬': ['교통','airplane','arrival','착륙'],
      '🛩️': ['교통','small','airplane','경비행기'],
      '💺': ['교통','seat','좌석'],
      '🛰️': ['교통','satellite','위성'],
      '🚀': ['교통','rocket','space','launch','로켓','우주'],
      '🛸': ['교통','flying','saucer','UFO'],
      '🚁': ['교통','helicopter','fly','헬리콥터'],
      '🛶': ['교통','canoe','카누'],
      '⛵': ['교통','sailboat','boat','요트'],
      '🚤': ['교통','speedboat','보트'],
      '🛥️': ['교통','motor','boat','모터보트'],
      '🛳️': ['교통','passenger','ship','여객선'],
      '⛴️': ['교통','ferry','페리'],
      '🚢': ['교통','ship','배'],
      '⚓': ['교통','anchor','닻'],
      '⛽': ['교통','fuel','pump','주유소'],
      '🚧': ['교통','construction','공사'],
      '🚦': ['교통','traffic','light','vertical','신호등'],
      '🚥': ['교통','traffic','light','horizontal','신호등'],
      '🗺️': ['지도','map','world','세계'],
      '🗿': ['모아이','moai','statue'],

      // ⏰ 시간
      '⏰': ['시간','time','clock','alarm','알람시계'],
      '⏱️': ['시간','time','stopwatch','timer','스톱워치'],
      '⏲️': ['시간','time','timer','clock','타이머'],
      '⌚': ['시간','time','watch','clock','손목시계'],
      '🕰️': ['시간','time','mantelpiece','clock','벽시계'],
      '🕐': ['시간','time','clock','1시'],
      '🕑': ['시간','time','clock','2시'],
      '🕒': ['시간','time','clock','3시'],
      '🕓': ['시간','time','clock','4시'],
      '🕔': ['시간','time','clock','5시'],
      '🕕': ['시간','time','clock','6시'],
      '🕖': ['시간','time','clock','7시'],
      '🕗': ['시간','time','clock','8시'],
      '🕘': ['시간','time','clock','9시'],
      '🕙': ['시간','time','clock','10시'],
      '🕚': ['시간','time','clock','11시'],
      '🕛': ['시간','time','clock','12시'],

      // 🎮 엔터
      '🕹️': ['게임','joystick','조이스틱'],
      '🎴': ['화투','flower','playing','cards'],
      '🃏': ['조커','joker','card'],
      '🀄': ['마작','mahjong','tile'],
      '🎵': ['음표','music','note','멜로디'],
      '🎶': ['음표','music','notes'],
      '📻': ['라디오','radio'],
      '📱': ['휴대폰','mobile','phone','smartphone','스마트폰'],
      '📲': ['휴대폰','mobile','phone','call','전화'],
      '☎️': ['전화','telephone','phone'],
      '📞': ['전화','phone','receiver','수화기'],
      '📟': ['삐삐','pager','beeper'],
      '📠': ['팩스','fax','machine'],
      '🔋': ['배터리','battery','전지'],
      '🔌': ['플러그','plug','electric','콘센트'],
      '💻': ['노트북','laptop','computer','컴퓨터'],
      '🖥️': ['데스크탑','desktop','computer','모니터'],
      '🖨️': ['프린터','printer','프린트'],
      '⌨️': ['키보드','keyboard'],
      '🖱️': ['마우스','mouse','computer'],
      '🖲️': ['트랙볼','trackball'],
      '💽': ['디스크','minidisc','computer'],
      '💾': ['저장','floppy','disk','save','디스켓'],
      '💿': ['CD','optical','disk'],
      '📀': ['DVD','disk'],

      // ⚠️ 기호
      '⚠️': ['경고','warning','caution','alert','주의'],
      '🚸': ['경고','warning','children','crossing','어린이'],
      '⛔': ['금지','no','entry','stop','진입금지'],
      '🚫': ['금지','prohibited','no','ban','금지됨'],
      '🚳': ['자전거금지','no','bicycles'],
      '🚭': ['금연','no','smoking'],
      '🚯': ['쓰레기금지','no','littering'],
      '🚱': ['음용금지','non-potable','water'],
      '🚷': ['보행자금지','no','pedestrians'],
      '📵': ['휴대폰금지','no','mobile','phones'],
      '🔞': ['19금','no','one','under','eighteen','성인'],
      '☢️': ['방사능','radioactive','radiation'],
      '☣️': ['생물학적위험','biohazard'],
      '🛐': ['예배소','place','worship'],
      '⚛️': ['원자','atom','science','과학'],
      '🕉️': ['옴','om','hindu'],
      '✡️': ['다윗의별','star','david','유대'],
      '☸️': ['법륜','wheel','dharma'],
      '☯️': ['음양','yin','yang'],
      '✝️': ['십자가','cross','christian'],
      '☦️': ['정교회','orthodox','cross'],
      '☪️': ['초승달별','star','crescent','islam'],
      '☮️': ['평화','peace','symbol'],
      '🕎': ['메노라','menorah'],
      '🔯': ['별','six','pointed','star'],
      '♈': ['양자리','aries','zodiac'],
      '♉': ['황소자리','taurus','zodiac'],
      '♊': ['쌍둥이자리','gemini','zodiac'],
      '♋': ['게자리','cancer','zodiac'],
      '♌': ['사자자리','leo','zodiac'],
      '♍': ['처녀자리','virgo','zodiac'],
      '♎': ['천칭자리','libra','zodiac'],
      '♏': ['전갈자리','scorpio','zodiac'],
      '♐': ['사수자리','sagittarius','zodiac'],
      '♑': ['염소자리','capricorn','zodiac'],
      '♒': ['물병자리','aquarius','zodiac'],
      '♓': ['물고기자리','pisces','zodiac'],
      '⛎': ['뱀주인자리','ophiuchus','zodiac'],
      '▶️': ['재생','play','button'],
      '⏸️': ['일시정지','pause','button'],
      '⏯️': ['재생일시정지','play','pause'],
      '⏹️': ['정지','stop','button'],
      '⏺️': ['녹화','record','button'],
      '⏭️': ['다음','next','track'],
      '⏮️': ['이전','previous','track'],
      '⏩': ['빨리감기','fast','forward'],
      '⏪': ['되감기','rewind'],
      '⏫': ['위로','fast','up'],
      '⏬': ['아래로','fast','down'],
      '🔼': ['위','up','button'],
      '🔽': ['아래','down','button'],
      '➕': ['더하기','plus','add'],
      '➖': ['빼기','minus','subtract'],
      '➗': ['나누기','divide','division'],
      '✖️': ['곱하기','multiply','x'],
      '♾️': ['무한','infinity'],
      '💲': ['달러','dollar','sign','money'],
      '💱': ['환전','currency','exchange'],
      '✔️': ['체크','check','mark','yes'],
      '☑️': ['체크','check','box','선택'],
      '❌': ['엑스','cross','no','wrong','틀림'],
      '✅': ['확인','check','yes','correct','done','완료'],
      '🔘': ['라디오버튼','radio','button'],
      '🔴': ['빨강','red','circle','원'],
      '🟠': ['주황','orange','circle'],
      '🟡': ['노랑','yellow','circle'],
      '🟢': ['초록','green','circle'],
      '🔵': ['파랑','blue','circle'],
      '🟣': ['보라','purple','circle'],
      '⚫': ['검정','black','circle'],
      '⚪': ['흰색','white','circle'],
      '🟤': ['갈색','brown','circle'],
      '🔔': ['벨','bell','ring','알림'],
      '🔕': ['벨','bell','mute','무음'],
      '📣': ['확성기','megaphone','announce'],
      '📢': ['확성기','loudspeaker','public'],
      '💬': ['말풍선','speech','balloon','대화'],
      '💭': ['생각','thought','balloon'],
      '🗯️': ['말풍선','angry','speech','bubble'],
      '♠️': ['스페이드','spade','suit','card'],
      '♣️': ['클로버','club','suit','card'],
      '♥️': ['하트','heart','suit','card'],
      '♦️': ['다이아','diamond','suit','card'],

      // 🧑 사람
      '👶': ['아기','baby','infant'],
      '🧒': ['아이','child','kid'],
      '👦': ['남자아이','boy','kid'],
      '👧': ['여자아이','girl','kid'],
      '🧑': ['사람','person','adult'],
      '👱': ['금발','blonde','hair','person'],
      '👨': ['남자','man','adult'],
      '🧔': ['수염','beard','man','bearded'],
      '👩': ['여자','woman','adult'],
      '🧓': ['노인','older','adult','elder'],
      '👴': ['할아버지','grandpa','old','man','elder'],
      '👵': ['할머니','grandma','old','woman','elder'],
      '👮': ['경찰','police','officer','cop'],
      '🕵️': ['탐정','detective','spy','investigator'],
      '💂': ['근위병','guard','soldier'],
      '🥷': ['닌자','ninja'],
      '👷': ['작업자','construction','worker','건설'],
      '🤴': ['왕자','prince','royal'],
      '👸': ['공주','princess','royal'],
      '👳': ['터번','turban','person'],
      '👲': ['모자','cap','person','skull'],
      '🧕': ['히잡','headscarf','hijab','woman'],
      '🤵': ['턱시도','tuxedo','suit','groom','formal'],
      '👰': ['신부','bride','veil','wedding'],
      '🤰': ['임신','pregnant','woman','baby'],
      '🤱': ['수유','breastfeeding','baby','feeding'],
      '👼': ['천사','angel','baby','cherub'],
      '🎅': ['산타','santa','christmas','claus'],
      '🤶': ['산타부인','mrs','claus','christmas'],
      '🦸': ['히어로','superhero','hero','super'],
      '🦹': ['빌런','villain','supervillain','bad'],
      '🧙': ['마법사','mage','wizard','magician'],
      '🧚': ['요정','fairy','magical'],
      '🧛': ['뱀파이어','vampire'],
      '🧜': ['인어','merperson','mermaid'],
      '🧝': ['엘프','elf'],
      '🧞': ['지니','genie'],
      '🧟': ['좀비','zombie'],
      '💆': ['마사지','massage','spa','relax'],
      '💇': ['이발','haircut','salon','hair'],
      '🚶': ['걷기','walk','walking','pedestrian'],
      '🧍': ['서있기','stand','standing'],
      '🧎': ['무릎','kneel','kneeling'],
      '🏃': ['달리기','run','running','jog'],
      '💃': ['춤','dance','dancer','woman'],
      '🕺': ['춤','dance','dancer','man'],
      '👯': ['쌍둥이','twins','bunny','people'],
      '🧖': ['사우나','sauna','steam','spa'],
      '🛀': ['목욕','bath','bathtub'],
      '🛌': ['잠','sleep','bed','hotel'],
      '👪': ['가족','family'],
      '👫': ['커플','couple','holding','hands'],
      '👬': ['남자커플','men','couple'],
      '👭': ['여자커플','women','couple'],
      '💑': ['커플','couple','love','romance'],
      '💏': ['키스','kiss','couple'],
      '🙋': ['손들기','raising','hand','question'],
      '🙆': ['오케이','ok','gesture','good'],
      '🙅': ['안돼','no','gesture','refuse'],
      '🙇': ['인사','bow','bowing','apology','죄송'],
      '🤦': ['이마짚기','facepalm','frustrated'],
      '🤷': ['몰라','shrug','dunno'],
      '🫂': ['포옹','hug','embrace','comfort'],

      // 👋 손 추가
      '💪': ['근육','muscle','strong','arm','power'],
      '🦾': ['기계팔','mechanical','arm','prosthesis'],
      '🦿': ['기계다리','mechanical','leg','prosthesis'],
      '🦵': ['다리','leg'],
      '🦶': ['발','foot'],
      '👂': ['귀','ear'],
      '🦻': ['보청기','ear','hearing','aid'],
      '👃': ['코','nose'],
      '🧠': ['뇌','brain','mind'],
      '🫀': ['심장','heart','organ'],
      '🫁': ['폐','lungs','organ'],
      '🦷': ['이빨','tooth','teeth'],
      '🦴': ['뼈','bone'],
      '👀': ['눈','eyes','look','see'],
      '👁️': ['눈','eye','see'],
      '👅': ['혀','tongue'],
      '👄': ['입술','mouth','lips','kiss'],

      // 😊 표정 추가 (귀신·유령·고양이)
      '🤡': ['광대','clown'],
      '👻': ['유령','ghost','halloween','spooky'],
      '💀': ['해골','skull','dead'],
      '☠️': ['해골','skull','crossbones','danger','poison'],
      '👽': ['외계인','alien','ufo'],
      '👾': ['외계인','alien','invader','monster','space'],
      '🤖': ['로봇','robot','ai'],
      '😺': ['고양이','cat','smile','happy'],
      '😸': ['고양이','cat','grin'],
      '😹': ['고양이','cat','laugh','tears'],
      '😻': ['고양이','cat','heart','love'],
      '😼': ['고양이','cat','smirk'],
      '😽': ['고양이','cat','kiss'],
      '🙀': ['고양이','cat','weary','shock'],
      '😿': ['고양이','cat','cry','tears','sad'],
      '😾': ['고양이','cat','pout','angry'],

      // 🍎 과일
      '🍎': ['빨간사과','apple','red','fruit'],
      '🍏': ['초록사과','apple','green','fruit'],
      '🍐': ['배','pear','fruit'],
      '🍊': ['귤','오렌지','orange','tangerine','fruit'],
      '🍋': ['레몬','lemon','fruit','sour'],
      '🍌': ['바나나','banana','fruit'],
      '🍉': ['수박','watermelon','fruit'],
      '🍇': ['포도','grapes','fruit'],
      '🍓': ['딸기','strawberry','fruit','berry'],
      '🫐': ['블루베리','blueberries','berry','fruit'],
      '🍈': ['멜론','melon','fruit'],
      '🍒': ['체리','cherries','fruit'],
      '🍑': ['복숭아','peach','fruit'],
      '🥭': ['망고','mango','fruit','tropical'],
      '🍍': ['파인애플','pineapple','fruit','tropical'],
      '🥥': ['코코넛','coconut','fruit','tropical'],
      '🥝': ['키위','kiwi','fruit'],
      '🍅': ['토마토','tomato','fruit','vegetable'],
      '🫒': ['올리브','olive','fruit'],
      '🥑': ['아보카도','avocado','fruit'],

      // 🥦 채소
      '🥦': ['브로콜리','broccoli','vegetable','green'],
      '🥬': ['청경채','leafy','green','vegetable','lettuce'],
      '🥒': ['오이','cucumber','vegetable'],
      '🌶️': ['고추','chili','pepper','spicy','hot'],
      '🫑': ['피망','bell','pepper','vegetable'],
      '🌽': ['옥수수','corn','vegetable'],
      '🥕': ['당근','carrot','vegetable','orange'],
      '🧄': ['마늘','garlic','bulb'],
      '🧅': ['양파','onion','bulb'],
      '🥔': ['감자','potato','vegetable'],
      '🍠': ['고구마','sweet','potato','yam'],
      '🫘': ['콩','beans','legume'],
      '🫛': ['완두콩','pea','pod','peas'],
      '🍄': ['버섯','mushroom','fungus'],
      '🌰': ['밤','chestnut','nut'],
      '🥜': ['땅콩','peanut','nut'],

      // 🍔 음식 추가
      '🍞': ['빵','bread','loaf'],
      '🥐': ['크루아상','croissant','pastry','breakfast'],
      '🥖': ['바게트','baguette','bread','french'],
      '🫓': ['플랫브레드','flatbread','naan'],
      '🥨': ['프레첼','pretzel','snack'],
      '🥯': ['베이글','bagel','bread'],
      '🥞': ['팬케이크','pancakes','breakfast','syrup'],
      '🧇': ['와플','waffle','breakfast'],
      '🧀': ['치즈','cheese','dairy'],
      '🍖': ['고기','meat','bone'],
      '🍗': ['닭다리','chicken','leg','poultry','drumstick'],
      '🥩': ['스테이크','steak','meat','beef'],
      '🥓': ['베이컨','bacon','meat','pork'],
      '🍺': ['맥주','beer','drink','alcohol'],
      '🍻': ['건배','cheers','beer','drink','toast'],
      '🥂': ['샴페인','champagne','toast','cheers','drink'],
      '🍷': ['와인','wine','drink','glass','alcohol'],
      '🥃': ['위스키','whiskey','drink','glass','tumbler'],
      '🍸': ['칵테일','cocktail','drink','martini'],
      '🍹': ['칵테일','cocktail','tropical','drink'],
      '🍶': ['사케','sake','japanese','drink'],
      '🧃': ['주스','juice','drink','box'],
      '☕': ['커피','coffee','drink','hot'],
      '🍵': ['차','tea','drink','hot','matcha'],
      '🥤': ['음료','drink','cup','straw','soda'],
      '🧋': ['버블티','bubble','tea','boba'],
      '🧊': ['얼음','ice','cube','cold'],

      // ⚽ 운동 추가
      '🏅': ['메달','medal','sports','award'],
      '🥇': ['금메달','gold','medal','first','1st'],
      '🥈': ['은메달','silver','medal','second','2nd'],
      '🥉': ['동메달','bronze','medal','third','3rd'],
      '🏆': ['트로피','trophy','award','winner','우승'],
      '🎖️': ['훈장','military','medal','honor'],
      '🏵️': ['장미장식','rosette','award'],
      '🎗️': ['리본','reminder','ribbon','awareness'],
      '🎫': ['티켓','ticket','admission'],
      '🎟️': ['티켓','tickets','admission','admission'],

      // 🎨 취미 추가
      '🖌️': ['붓','paintbrush','paint','art'],
      '🖍️': ['크레용','crayon','draw','art'],
      '✏️': ['연필','pencil','write','draw'],
      '🖊️': ['볼펜','pen','write'],
      '🖋️': ['만년필','fountain','pen','ink'],
      '🎥': ['카메라','movie','camera','film'],
      '📷': ['카메라','camera','photo','picture'],
      '📸': ['카메라플래시','camera','flash','photo'],
      '📹': ['캠코더','video','camera'],
      '🎞️': ['필름','film','frames','cinema'],
      '📽️': ['영사기','film','projector','cinema'],
      '🕹️': ['조이스틱','joystick','game','arcade'],
      '📚': ['책','books','library','learn'],
      '📖': ['책','open','book','read'],
      '📝': ['메모','memo','note','write'],
      '🎒': ['가방','backpack','school','bag'],
      '🧸': ['곰인형','teddy','bear','toy'],
      '🪆': ['마트료시카','nesting','dolls','russian'],
      '🪅': ['피냐타','pinata','party'],
      '🪩': ['미러볼','mirror','ball','disco','party'],
      '🎊': ['폭죽','confetti','ball','party','celebrate'],
      '🎉': ['축하','party','popper','celebrate','celebration'],
      '🎈': ['풍선','balloon','party'],
      '🕯️': ['초','candle','light','flame'],
      '🪔': ['디와','diya','lamp','oil'],
      '💡': ['전구','light','bulb','idea'],
      '🔦': ['손전등','flashlight','torch','light'],
      '🏮': ['등불','lantern','red','japanese'],
      '🪙': ['동전','coin','money','gold'],
      '📯': ['나팔','postal','horn','music']
    };

    // 상태 변수
    let menus = [];
    let menuDraft = [];
    let favoritePages = [];
    let expandedGroups = [];
    let currentPage = 'home';
    let isSidebarCollapsed = false;

    // 일상 관리 상태 변수
    let categories = [];
    let activities = [];
    let selectedCategoryFilter = '';
    let editingActivityId = null;
    let editingCategoryId = null;
    var selectedActivityIds = new Set();
    var selectedCategoryIds = new Set();
    let currentEmojiCallback = null;
    let currentSelectedEmoji = '';

    // 시간표 상태 변수
    let schedules = [];
    let scheduleItems = [];
    let currentDetailScheduleId = null;
    let editingScheduleItemId = null;
    let scheduleDetailTab = 'grid';
    let scheduleViewMode2 = 'detail'; // 'detail' | 'edit'
    let scheduleDraft = null; // 수정 모드 draft
    let addItemPrefill = null; // {weekday, startTime, endTime}
    var siTimeCache = {start: '', end: ''}; // 요일별 시간 동일 토글 시 시간 보존용
    var SLOT_HEIGHT = 28;
    var WEEKDAYS_EN = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
    var WEEKDAYS_KR = ['월','화','수','목','금','토','일'];
    let scheduleHeroIndex = 0;
    let scheduleSearchQuery = '';
    let selectedScheduleIds = [];
    let scheduleViewMode = 'thumbnail';
    let scheduleListPage = 1;
    let scheduleListPerPage = 10;
    let activityViewMode = 'default'; // 'default' | 'grouped'
    let tagColorOverrides = {}; // { tagText: paletteIdx } — 사용자 지정 색상
    let editingTagIdx = null;
    let editingTagColorIdx = -1;
    let activityListPage = 1;
    let activityListPerPage = 20;
    let categoryListPage = 1;
    let categoryListPerPage = 20;
    let scheduleSortKey = 'updatedAt';
    let scheduleSortDir = 'desc';
    let scheduleFilterLiked = 'all';
    let scheduleFilterTags = []; // 선택된 태그 (AND 조건)

    // 태그 색상 팔레트 (Notion 스타일, 파스텔·저채도 10색)
    const TAG_PALETTE = [
      { bg: '#ffe3e3', fg: '#8a3a3a', name: '빨강' },
      { bg: '#ffe8d1', fg: '#8a5a2a', name: '주황' },
      { bg: '#fff5c0', fg: '#6e5a1a', name: '노랑' },
      { bg: '#d8f5c6', fg: '#3a6a24', name: '초록' },
      { bg: '#c6ecf0', fg: '#1f5a67', name: '민트' },
      { bg: '#d4e6ff', fg: '#2a4a7a', name: '파랑' },
      { bg: '#e2dafc', fg: '#4a3a8a', name: '보라' },
      { bg: '#fbd8ee', fg: '#8a3a70', name: '핑크' },
      { bg: '#efe4d3', fg: '#6a4a2a', name: '갈색' },
      { bg: '#e5e5e5', fg: '#4a4a4a', name: '회색' }
    ];
    // 텍스트 해시 → 팔레트 인덱스 (동일 텍스트는 항상 동일 색)
    function hashTagIndex(text) {
      var h = 0;
      var s = String(text || '');
      for (var i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
      return Math.abs(h) % TAG_PALETTE.length;
    }
    function getTagPaletteEntry(text) {
      if (tagColorOverrides.hasOwnProperty(text)) {
        var oi = tagColorOverrides[text];
        if (oi >= 0 && oi < TAG_PALETTE.length) return TAG_PALETTE[oi];
      }
      return TAG_PALETTE[hashTagIndex(text)];
    }
    // 태그 칩 공통 렌더러 — 각 태그에 팔레트 색 적용
    // opts: { cls='sched-tag-chip', extra='', escapeForAttr=false }
    function renderTagChip(text, opts) {
      opts = opts || {};
      var p = getTagPaletteEntry(text);
      var cls = opts.cls || 'sched-tag-chip';
      var style = 'background:' + p.bg + ';color:' + p.fg + ';';
      return '<span class="' + cls + '" style="' + style + '"' + (opts.extra || '') + '>' + escapeHtml(text) + '</span>';
    }

    // 모달 콜백
    let confirmModalCallback = null;

    // ========================================
    // Google OAuth 로그인 관리
    // ========================================

    // JWT 토큰 디코딩 (Google id_token에서 사용자 정보 추출)
    function decodeJwtPayload(token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
        );
        return JSON.parse(jsonPayload);
      } catch (e) {
        console.error('JWT 디코딩 실패:', e);
        return null;
      }
    }

    // Google Sign-In 초기화
    function initGoogleSignIn() {
      if (typeof google === 'undefined' || !google.accounts || !google.accounts.id) {
        // GSI 스크립트 로드 대기 후 재시도
        setTimeout(initGoogleSignIn, 200);
        return;
      }

      google.accounts.id.initialize({
        client_id: AUTH.GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      const btnContainer = document.getElementById('googleSignInButton');
      if (btnContainer) {
        google.accounts.id.renderButton(btnContainer, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 320
        });
      }
    }

    // Google 로그인 성공 시 호출되는 콜백
    function handleGoogleCredentialResponse(response) {
      if (!response || !response.credential) {
        console.error('Google 로그인 응답 없음');
        return;
      }

      const payload = decodeJwtPayload(response.credential);
      if (!payload) {
        showAlert('로그인 실패', '로그인 정보를 확인할 수 없습니다.');
        return;
      }

      // 베이님 본인 계정만 허용 (단일 사용자 앱)
      if (payload.email !== AUTH.USER_EMAIL) {
        showAlert('접근 불가', '이 앱은 ' + AUTH.USER_EMAIL + ' 계정 전용입니다.\n\n로그인된 계정: ' + payload.email);
        if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
          google.accounts.id.disableAutoSelect();
        }
        return;
      }

      currentUser = {
        email: payload.email,
        name: payload.name || '',
        picture: payload.picture || '',
        sub: payload.sub || ''
      };

      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));

      showApp();

      // Sheets 연동: access_token 획득 → 탭 생성/전체 로드
      GS.init(function(ok) {
        if (!ok) { GS.updateUI('err'); return; }
        GS.loadAll().then(function(loaded) {
          if (loaded) renderCurrentScheduleView();
        });
      });
    }

    function showApp() {
      document.getElementById('loginContainer').style.display = 'none';
      document.getElementById('appContainer').classList.add('active');
      initializeApp();
      // 사이드바 하단 이메일 표시
      var emailEl = document.getElementById('sf-email');
      if (emailEl && currentUser) emailEl.textContent = currentUser.email || '';
    }

    function handleLogout() {
      showConfirm('로그아웃', '로그아웃하시겠습니까?', function(confirmed) {
        if (confirmed) {
          if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
            google.accounts.id.disableAutoSelect();
          }
          GS.disconnect && GS.disconnect(true); // 캐시 클리어 (confirm 없이)
          sessionStorage.clear();
          currentUser = null;
          window.location.href = window.location.href.split('#')[0];
        }
      });
    }

    // ========================================
    // 공통 모달 시스템
    // ========================================
    // 열린 모든 모달 중 최상단보다 한 층 위로 이 모달을 올림 (스마트 스태킹)
    // 모달이 겹치는 순서(삭제확인 → 이모지 피커 위)와 상관없이 항상 최상단 보장
    function bringModalToFront(el) {
      if (!el) return;
      var BASE_Z = 1200;
      var maxZ = BASE_Z - 10;
      var candidates = document.querySelectorAll('.modal-overlay, .emoji-picker-overlay');
      candidates.forEach(function(m) {
        if (m === el) return;
        var isVisible = m.classList.contains('show') ||
          (m.style && m.style.display && m.style.display !== 'none');
        if (!isVisible) return;
        var cs = window.getComputedStyle(m);
        var z = parseInt(cs.zIndex, 10);
        if (!isNaN(z) && z > maxZ) maxZ = z;
      });
      el.style.zIndex = String(maxZ + 10);
    }

    function showConfirm(title, message, callback, detailHtml) {
      const modal = document.getElementById('confirmModal');
      const titleEl = document.getElementById('confirmTitle');
      const messageEl = document.getElementById('confirmMessage');
      const detailEl = document.getElementById('confirmDetail');

      titleEl.textContent = title;
      messageEl.innerHTML = message;
      if (detailEl) {
        if (detailHtml) { detailEl.innerHTML = detailHtml; detailEl.style.display = ''; }
        else { detailEl.innerHTML = ''; detailEl.style.display = 'none'; }
      }
      confirmModalCallback = callback;
      modal.classList.add('show');
      bringModalToFront(modal);
    }

    function closeConfirmModal(result) {
      const modal = document.getElementById('confirmModal');
      modal.classList.remove('show');
      var detailEl = document.getElementById('confirmDetail');
      if (detailEl) { detailEl.innerHTML = ''; detailEl.style.display = 'none'; }

      if (confirmModalCallback) {
        confirmModalCallback(result);
        confirmModalCallback = null;
      }
    }

    function showAlert(title, message) {
      const modal = document.getElementById('alertModal');
      const titleEl = document.getElementById('alertTitle');
      const messageEl = document.getElementById('alertMessage');

      titleEl.textContent = title;
      messageEl.innerHTML = message;
      modal.classList.add('show');
      bringModalToFront(modal);
    }

    function closeAlertModal() {
      const modal = document.getElementById('alertModal');
      modal.classList.remove('show');
    }

    // ========================================
    // 이모지 피커 시스템
    // ========================================
    // ========================================
    // My Emojies
    // ========================================
    let myEmojis = [];

    function loadMyEmojis() {
      try { myEmojis = JSON.parse(localStorage.getItem('myEmojis') || '[]'); } catch(e) { myEmojis = []; }
    }

    function saveMyEmojis() {
      localStorage.setItem('myEmojis', JSON.stringify(myEmojis));
      GS.syncSheets(['사용자설정']);
    }

    function loadTagColorOverrides() {
      try { tagColorOverrides = JSON.parse(localStorage.getItem('tagColorOverrides') || '{}'); } catch(e) { tagColorOverrides = {}; }
    }
    function saveTagColorOverrides() {
      localStorage.setItem('tagColorOverrides', JSON.stringify(tagColorOverrides));
      GS.syncSheets(['사용자설정']);
    }

    function renderEmoji(val) {
      if (!val) return '📅';
      if (val.startsWith && val.startsWith('myimg:')) {
        var id = val.slice(6);
        var item = myEmojis.find(function(e) { return e.id === id; });
        if (item) return '<img src="' + item.data + '" style="width:1.2em;height:1.2em;object-fit:cover;vertical-align:middle;border-radius:2px;">';
        return '🖼️';
      }
      return val;
    }

    function emojiDisplayVal(val) {
      if (!val) return '';
      if (val.startsWith && val.startsWith('myimg:')) return '🖼️';
      return val;
    }

    function setEmojiPickerTab(tab) {
      var stdSection = document.getElementById('emojiStdSection');
      var mySection = document.getElementById('emojiMySection');
      var tabStd = document.getElementById('emojiTabStd');
      var tabMy = document.getElementById('emojiTabMy');
      if (tab === 'my') {
        if (stdSection) stdSection.style.display = 'none';
        if (mySection) mySection.style.display = 'flex';
        if (tabStd) tabStd.classList.remove('active');
        if (tabMy) tabMy.classList.add('active');
        renderMyEmojisGrid();
      } else {
        if (stdSection) stdSection.style.display = 'flex';
        if (mySection) mySection.style.display = 'none';
        if (tabStd) tabStd.classList.add('active');
        if (tabMy) tabMy.classList.remove('active');
      }
    }

    function renderMyEmojisGrid() {
      var grid = document.getElementById('emojiMyGrid');
      if (!grid) return;
      if (myEmojis.length === 0) {
        grid.innerHTML = '<div class="emoji-my-empty">아직 업로드된 이미지가 없습니다.</div>';
        return;
      }
      var html = '';
      myEmojis.forEach(function(item) {
        var isSel = currentSelectedEmoji === 'myimg:' + item.id;
        html += '<div class="emoji-my-item' + (isSel ? ' selected' : '') + '" data-id="' + item.id + '" onclick="selectMyEmoji(&apos;' + item.id + '&apos;)">';
        html += '<img src="' + item.data + '" alt="my emoji">';
        html += '<button class="emoji-my-item-del" onclick="event.stopPropagation(); deleteMyEmoji(&apos;' + item.id + '&apos;)" title="삭제">✕</button>';
        html += '</div>';
      });
      grid.innerHTML = html;
    }

    function selectMyEmoji(id) {
      currentSelectedEmoji = 'myimg:' + id;
      document.querySelectorAll('.emoji-my-item').forEach(function(el) {
        el.classList.toggle('selected', el.dataset.id === id);
      });
    }

    function deleteMyEmoji(id) {
      showConfirm('이미지 삭제', '이 이미지를 삭제하시겠습니까?', function(confirmed) {
        if (!confirmed) return;
        myEmojis = myEmojis.filter(function(e) { return e.id !== id; });
        saveMyEmojis();
        if (currentSelectedEmoji === 'myimg:' + id) currentSelectedEmoji = '';
        renderMyEmojisGrid();
      });
    }

    function handleMyEmojiUpload(input) {
      var file = input.files && input.files[0];
      var errEl = document.getElementById('myEmojiUploadError');
      if (!file) return;
      if (file.size > 200 * 1024) {
        var kb = Math.round(file.size / 1024);
        if (errEl) { errEl.textContent = '❌ 파일이 너무 큽니다 (' + kb + 'KB). 최대 200KB까지 가능합니다.'; errEl.style.display = 'block'; }
        input.value = '';
        return;
      }
      if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }
      var reader = new FileReader();
      reader.onload = function(e) {
        var id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        myEmojis.push({ id: id, data: e.target.result });
        saveMyEmojis();
        renderMyEmojisGrid();
        input.value = '';
      };
      reader.readAsDataURL(file);
    }

    function buildEmojiPicker() {
      const catsEl = document.getElementById('emojiCats');
      const gridEl = document.getElementById('emojiGrid');
      
      if (!catsEl || !gridEl) return;
      
      let catsHtml = '';
      const catKeys = Object.keys(EMOJI_DATA);
      catKeys.forEach(function(cat, idx) {
        const icon = cat.split(' ')[0];
        catsHtml += '<button class="emoji-cat-btn' + (idx === 0 ? ' active' : '') + '" onclick="setEmojiCat(\'' + cat + '\')">' + icon + '</button>';
      });
      catsEl.innerHTML = catsHtml;
      
      setEmojiCat(catKeys[0]);
    }

    function setEmojiCat(catName) {
      const btns = document.querySelectorAll('.emoji-cat-btn');
      btns.forEach(function(btn) {
        btn.classList.remove('active');
      });
      
      const catKeys = Object.keys(EMOJI_DATA);
      const idx = catKeys.indexOf(catName);
      if (idx >= 0 && btns[idx]) {
        btns[idx].classList.add('active');
      }
      
      renderEmojiGrid(EMOJI_DATA[catName] || []);
    }

    function renderEmojiGrid(emojis) {
      const gridEl = document.getElementById('emojiGrid');
      if (!gridEl) return;
      
      let html = '';
      emojis.forEach(function(emoji) {
        const isSelected = (emoji === currentSelectedEmoji);
        html += '<button class="emoji-btn' + (isSelected ? ' selected' : '') + '" onclick="selectEmoji(\'' + emoji + '\')">' + emoji + '</button>';
      });
      gridEl.innerHTML = html;
    }

    function selectEmoji(emoji) {
      currentSelectedEmoji = emoji;
      
      const btns = document.querySelectorAll('.emoji-btn');
      btns.forEach(function(btn) {
        btn.classList.remove('selected');
        if (btn.textContent === emoji) {
          btn.classList.add('selected');
        }
      });
    }

    function filterEmoji() {
      const searchEl = document.getElementById('emojiSearch');
      if (!searchEl) return;

      const rawQuery = searchEl.value.trim();

      // 검색어가 비어있으면 현재 활성 카테고리로 복귀
      if (!rawQuery) {
        const catKeys = Object.keys(EMOJI_DATA);
        const activeCat = document.querySelector('.emoji-cat-btn.active');
        if (activeCat) {
          const idx = Array.from(document.querySelectorAll('.emoji-cat-btn')).indexOf(activeCat);
          if (idx >= 0 && catKeys[idx]) {
            setEmojiCat(catKeys[idx]);
          }
        }
        return;
      }

      // 공백 구분 AND 검색 지원: "웃음 happy" → 둘 다 매칭돼야 결과
      const tokens = rawQuery.toLowerCase().split(/\s+/).filter(function(t) { return t.length > 0; });
      if (tokens.length === 0) return;

      let matched = [];

      Object.keys(EMOJI_DATA).forEach(function(cat) {
        // 카테고리명도 검색 대상에 포함 (폴백 매칭)
        const catNameLower = cat.toLowerCase();

        EMOJI_DATA[cat].forEach(function(emoji) {
          if (matched.indexOf(emoji) >= 0) return;

          // 1) 이모지 문자 자체 매칭 (사용자가 이모지를 붙여넣어 검색하는 경우)
          if (tokens.some(function(t) { return emoji.indexOf(t) >= 0; })) {
            matched.push(emoji);
            return;
          }

          // 2) 키워드 매칭 (모든 토큰이 최소 1개 키워드에 부분 일치해야 함 = AND)
          const keywords = EMOJI_KEYWORDS[emoji] || [];
          const keywordsLower = keywords.map(function(kw) { return kw.toLowerCase(); });

          const allTokensMatch = tokens.every(function(token) {
            // 각 토큰이 키워드 중 하나에라도 부분 일치
            if (keywordsLower.some(function(kw) { return kw.indexOf(token) >= 0; })) {
              return true;
            }
            // 카테고리명에 부분 일치 (폴백)
            if (catNameLower.indexOf(token) >= 0) {
              return true;
            }
            return false;
          });

          if (allTokensMatch && keywordsLower.length > 0) {
            matched.push(emoji);
            return;
          }

          // 3) 키워드가 없는 이모지라도 카테고리명 매칭이면 포함 (폴백)
          if (keywordsLower.length === 0) {
            const allMatchCat = tokens.every(function(token) {
              return catNameLower.indexOf(token) >= 0;
            });
            if (allMatchCat) {
              matched.push(emoji);
            }
          }
        });
      });

      renderEmojiGrid(matched);
    }

    function openEmojiPicker(currentEmoji, callback) {
      currentSelectedEmoji = currentEmoji || '';
      currentEmojiCallback = callback;

      setEmojiPickerTab('standard');
      buildEmojiPicker();

      const searchEl = document.getElementById('emojiSearch');
      if (searchEl) {
        searchEl.value = '';
        searchEl.oninput = filterEmoji;
      }

      var emojiOverlay = document.getElementById('emojiPickerOverlay');
      emojiOverlay.classList.add('show');
      bringModalToFront(emojiOverlay);
    }

    function closeEmojiPicker(confirmed) {
      document.getElementById('emojiPickerOverlay').classList.remove('show');
      
      if (confirmed && currentEmojiCallback && currentSelectedEmoji) {
        currentEmojiCallback(currentSelectedEmoji);
      }
      
      currentEmojiCallback = null;
      currentSelectedEmoji = '';
    }

    // DOMContentLoaded 이벤트 리스너
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initLogin);
    } else {
      initLogin();
    }

    function initLogin() {
      // 기존 세션 확인
      if (sessionStorage.getItem('isLoggedIn') === 'true') {
        const savedUser = sessionStorage.getItem('currentUser');
        if (savedUser) {
          try {
            currentUser = JSON.parse(savedUser);
          } catch (e) {
            currentUser = null;
          }
        }
        if (currentUser && currentUser.email === AUTH.USER_EMAIL) {
          showApp();
          // 세션 복원 시 Sheets 재연결 (새로고침 후에도 연결 유지)
          GS.init(function(ok) {
            if (!ok) { GS.updateUI('err'); return; }
            GS.loadAll().then(function(loaded) {
              if (loaded) renderCurrentScheduleView();
            });
          });
          return;
        } else {
          sessionStorage.clear();
        }
      }

      // Google Sign-In 초기화
      initGoogleSignIn();
    }

    // ========================================
    // 앱 초기화
    // ========================================
    function initializeApp() {
      loadMenus();
      loadFavorites();
      loadExpandedGroups();
      loadSidebarState();
      loadCategories();
      loadMyEmojis();
      loadTagColorOverrides();
      loadActivities();
      loadSchedules();
      loadWorkItems();
      loadHabits();
      loadHabitLogs();
      loadProfile();
      loadDesignSettings();
      renderSidebar();
      renderMenuManager();
      updateActiveMenu();
      renderCategoryFilter();
      renderActivities();
      renderCategories();
      renderScheduleTagFilter();
      renderScheduleThumbnails();
      const lastPage = sessionStorage.getItem('lastPage');
      if (lastPage && document.getElementById(lastPage + 'Page')) {
        navigateTo(lastPage);
      }
      updateMobileTopTitle();
    }

    function loadMenus() {
      const saved = localStorage.getItem('menus');
      if (saved) {
        try {
          menus = JSON.parse(saved);
        } catch (e) {
          menus = JSON.parse(JSON.stringify(DEFAULT_MENUS));
        }
      } else {
        menus = JSON.parse(JSON.stringify(DEFAULT_MENUS));
      }
      // 마이그레이션: '일상' 메뉴명 → '시간표'
      var migrated = false;
      function walkRename(list) {
        list.forEach(function(m) {
          if (m.slug === 'daily' && m.name === '일상') { m.name = '시간표'; migrated = true; }
          if (m.children) walkRename(m.children);
        });
      }
      walkRename(menus);
      if (migrated) saveMenus();

      // 마이그레이션: "조난 구조 중" 그룹에 "일"·"습관" 페이지 추가 (1회)
      if (!localStorage.getItem('menuMig_sosPages')) {
        var sosGrp = menus.find(function(m) { return m.type === 'group' && m.name === '조난 구조 중'; });
        if (sosGrp) {
          if (!sosGrp.children) sosGrp.children = [];
          var slugs = sosGrp.children.map(function(c) { return c.slug; });
          var added = false;
          if (slugs.indexOf('work') === -1) {
            sosGrp.children.push({ id: 'work', type: 'page', icon: '💼', name: '일', slug: 'work', order: sosGrp.children.length });
            added = true;
          }
          if (slugs.indexOf('habit') === -1) {
            sosGrp.children.push({ id: 'habit', type: 'page', icon: '✅', name: '습관', slug: 'habit', order: sosGrp.children.length });
            added = true;
          }
          if (added) {
            sosGrp.children.forEach(function(c, i) { c.order = i; });
            saveMenus();
          }
        }
        localStorage.setItem('menuMig_sosPages', '1');
      }

      // 마이그레이션: work-sos / habit-sos → work / habit ID 수정
      var idFixNeeded = false;
      (function fixWrongIds(arr) {
        if (!arr) return;
        arr.forEach(function(m) {
          if (m.id === 'work-sos') { m.id = 'work'; idFixNeeded = true; }
          if (m.id === 'habit-sos') { m.id = 'habit'; idFixNeeded = true; }
          fixWrongIds(m.children);
        });
      })(menus);
      if (idFixNeeded) saveMenus();
    }

    function saveMenus() {
      localStorage.setItem('menus', JSON.stringify(menus));
      GS.syncSheets(['사용자설정']);
    }

    function loadFavorites() {
      const saved = localStorage.getItem('favoritePages');
      if (saved) {
        try {
          favoritePages = JSON.parse(saved);
        } catch (e) {
          favoritePages = [];
        }
      }
    }

    function loadExpandedGroups() {
      expandedGroups = []; // 항상 접힌 상태로 시작
    }

    function loadSidebarState() {
      const saved = localStorage.getItem('isSidebarCollapsed');
      if (saved) {
        try {
          isSidebarCollapsed = JSON.parse(saved);
          if (isSidebarCollapsed) {
            document.getElementById('sidebar').classList.add('collapsed');
            document.getElementById('sidebarToggleBtn').classList.remove('expanded');
            document.getElementById('sidebarToggleIcon').textContent = '☰';
            document.getElementById('sidebarToggleBtn').style.left = '16px';
          } else {
            document.getElementById('sidebarToggleBtn').classList.add('expanded');
            document.getElementById('sidebarToggleIcon').textContent = '✕';
            document.getElementById('sidebarToggleBtn').style.left = (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-width')) - 48) + "px";
          }
        } catch (e) {
          // 기본값 유지
        }
      } else {
        const navWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-width'));
        document.getElementById('sidebarToggleBtn').style.left = (navWidth - 48) + "px";
        document.getElementById('sidebarToggleBtn').classList.add('expanded');
      }
    }

    // ========================================
    // 사이드바 렌더링
    // ========================================
    function renderSidebar() {
      const nav = document.getElementById('sidebarNav');
      if (!nav) return;
      
      let html = '';
      
      if (favoritePages.length > 0) {
        html += '<div style="margin-bottom: 24px;">';
        html += '  <div class="nav-section-title">⭐ 즐겨찾기</div>';
        
        const allPages = [];
        menus.forEach(function(menu) {
          if (menu.type === 'page') {
            allPages.push(menu);
          } else if (menu.type === 'group' && menu.children) {
            menu.children.forEach(function(child) {
              if (child.type === 'page') {
                allPages.push(child);
              }
            });
          }
        });
        
        favoritePages.forEach(function(pageId) {
          const page = allPages.find(function(p) { return p.id === pageId; });
          if (!page) return;
          
          html += '<div class="nav-item" data-page="' + page.id + '" onclick="navigateTo(\'' + page.id + '\')">';
          html += '  <span class="nav-icon">' + page.icon + '</span>';
          html += '  <span>' + page.name + '</span>';
          html += '  <span class="favorite-star active" onclick="event.stopPropagation(); toggleFavorite(\'' + page.id + '\')">★</span>';
          html += '</div>';
        });
        
        html += '</div>';
      }
      
      const sortedMenus = menus.slice().sort(function(a, b) { return a.order - b.order; });
      
      sortedMenus.forEach(function(menu) {
        if (menu.type === 'page') {
          const isFavorite = favoritePages.indexOf(menu.id) >= 0;
          
          html += '<div class="nav-item" data-page="' + menu.id + '" onclick="navigateTo(\'' + menu.id + '\')">';
          html += '  <span class="nav-icon">' + menu.icon + '</span>';
          html += '  <span>' + menu.name + '</span>';
          html += '  <span class="favorite-star ' + (isFavorite ? 'active' : '') + '" onclick="event.stopPropagation(); toggleFavorite(\'' + menu.id + '\')">' + (isFavorite ? '★' : '☆') + '</span>';
          html += '</div>';
          
        } else if (menu.type === 'group') {
          const isExpanded = expandedGroups.indexOf(menu.id) >= 0;
          
          html += '<div class="nav-group">';
          html += '  <div class="nav-group-header" onclick="toggleGroup(\'' + menu.id + '\')">';
          html += '    <div style="display: flex; align-items: center; gap: 8px;">';
          html += '      <span class="nav-icon">' + menu.icon + '</span>';
          html += '      <span>' + menu.name + '</span>';
          html += '    </div>';
          html += '    <span class="nav-group-toggle">' + (isExpanded ? '▼' : '▶') + '</span>';
          html += '  </div>';
          
          if (isExpanded && menu.children) {
            html += '  <div class="nav-group-children">';
            const sortedChildren = menu.children.slice().sort(function(a, b) { return a.order - b.order; });
            sortedChildren.forEach(function(child) {
              if (child.type === 'page') {
                const isFavorite = favoritePages.indexOf(child.id) >= 0;
                
                html += '    <div class="nav-item nav-item-child" data-page="' + child.id + '" onclick="navigateTo(\'' + child.id + '\')">';
                html += '      <span class="nav-icon">' + child.icon + '</span>';
                html += '      <span>' + child.name + '</span>';
                html += '      <span class="favorite-star ' + (isFavorite ? 'active' : '') + '" onclick="event.stopPropagation(); toggleFavorite(\'' + child.id + '\')">' + (isFavorite ? '★' : '☆') + '</span>';
                html += '    </div>';
              }
            });
            html += '  </div>';
          }
          
          html += '</div>';
        }
      });
      
      nav.innerHTML = html;
      updateActiveMenu();
    }

    function updateActiveMenu() {
      var menuPage = currentPage === 'scheduleDetail' ? 'daily' : currentPage;
      document.querySelectorAll('.nav-item').forEach(function(item) {
        item.classList.toggle('active', item.dataset.page === menuPage);
      });
    }

    function toggleGroup(groupId) {
      if (expandedGroups.indexOf(groupId) >= 0) {
        expandedGroups = expandedGroups.filter(function(id) { return id !== groupId; });
      } else {
        expandedGroups.push(groupId);
      }
      // expandedGroups는 세션 내 메모리만 유지 — 새로고침 시 항상 접힌 상태로 시작
      renderSidebar();
    }

    function toggleFavorite(pageId) {
      if (favoritePages.indexOf(pageId) >= 0) {
        favoritePages = favoritePages.filter(function(id) { return id !== pageId; });
      } else {
        favoritePages.push(pageId);
      }
      localStorage.setItem('favoritePages', JSON.stringify(favoritePages));
      renderSidebar();
    }

    function toggleSidebar() {
      isSidebarCollapsed = !isSidebarCollapsed;
      localStorage.setItem('isSidebarCollapsed', JSON.stringify(isSidebarCollapsed));

      const sidebar = document.getElementById('sidebar');
      const toggleBtn = document.getElementById('sidebarToggleBtn');
      const toggleIcon = document.getElementById('sidebarToggleIcon');

      if (isSidebarCollapsed) {
        sidebar.classList.add('collapsed');
        toggleBtn.classList.remove('expanded');
        toggleIcon.textContent = '☰';
        toggleBtn.style.left = '16px';
      } else {
        sidebar.classList.remove('collapsed');
        toggleBtn.classList.add('expanded');
        toggleIcon.textContent = '✕';
        const navWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-width'));
        toggleBtn.style.left = (navWidth - 48) + "px";
      }
    }

    // 사이드바 펼친 상태에서 외부 클릭/터치 시 접기
    document.addEventListener('click', function(e) {
      if (isSidebarCollapsed) return;
      const sidebar = document.getElementById('sidebar');
      if (!sidebar) return;
      // composedPath()로 원본 경로 확인 (renderSidebar() 후 e.target이 DOM에서 분리돼도 안전)
      var path = e.composedPath ? e.composedPath() : [];
      var inSidebar = path.some(function(el) { return el === sidebar; }) || sidebar.contains(e.target);
      if (inSidebar) return;
      if (e.target.closest && (e.target.closest('.sidebar-toggle-btn') || e.target.closest('.mobile-top-bar'))) return;
      toggleSidebar();
    });

    // ========================================
    // 네비게이션
    // ========================================
    function navigateTo(pageId) {
      // 잘못 저장된 ID 보정
      if (pageId === 'work-sos') pageId = 'work';
      if (pageId === 'habit-sos') pageId = 'habit';

      currentPage = pageId;
      sessionStorage.setItem('lastPage', pageId);

      document.querySelectorAll('.page').forEach(function(page) {
        page.classList.remove('active');
      });

      const targetPage = document.getElementById(pageId + 'Page');
      if (targetPage) {
        targetPage.classList.add('active');
      }

      updateActiveMenu();
      updateMobileTopTitle();

      if (pageId === 'habit') renderHabitPage();
      if (pageId === 'work') renderWorkPage();

      if (window.innerWidth <= 768) {
        toggleSidebar();
      }
    }

    function updateMobileTopTitle() {
      const titleEl = document.getElementById('mobileTopTitle');
      if (!titleEl) return;
      if (currentPage === 'scheduleDetail') {
        var sch = schedules.find(function(s) { return s.id === currentDetailScheduleId; });
        titleEl.textContent = sch ? sch.title : '시간표 상세';
        return;
      }
      const activePage = document.querySelector('.page.active .page-header h2');
      if (activePage) {
        titleEl.textContent = activePage.textContent.trim();
      } else {
        titleEl.textContent = '베이 관리자';
      }
    }

    // ========================================
    // 메뉴 관리
    // ========================================
    function renderMenuManager() {
      const container = document.getElementById('menuManager');
      if (!container) return;

      const sorted = menuDraft.slice().sort(function(a, b) { return a.order - b.order; });
      let html = '<div class="mm-list" id="mmList">';

      sorted.forEach(function(item) {
        if (item.type === 'group') {
          const sortedChildren = (item.children || []).slice().sort(function(a, b) { return a.order - b.order; });
          html += '<div class="mm-group" data-group-id="' + item.id + '">';
          html += '  <div class="mm-group-header" draggable="true" data-group-id="' + item.id + '">';
          html += '    <span class="mm-drag-handle">⠿</span>';
          html += '    <button class="mm-emoji-btn" onclick="openMmEmojiPicker(&apos;group&apos;,&apos;' + item.id + '&apos;,&apos;&apos;)">' + renderEmoji(item.icon) + '</button>';
          html += '    <input class="mm-name-input" value="' + escapeHtml(item.name) + '" oninput="updateMmGroupName(&apos;' + item.id + '&apos;,this.value)" placeholder="대분류명">';
          html += '    <button class="mm-del-btn" onclick="deleteMmGroup(&apos;' + item.id + '&apos;)" title="삭제">🗑</button>';
          html += '  </div>';
          html += '  <div class="mm-children" data-group-id="' + item.id + '">';
          sortedChildren.forEach(function(child) {
            html += '    <div class="mm-menu-item" draggable="true" data-menu-id="' + child.id + '" data-group-id="' + item.id + '">';
            html += '      <span class="mm-drag-handle">⠿</span>';
            html += '      <button class="mm-emoji-btn mm-emoji-btn-sm" onclick="openMmEmojiPicker(&apos;menu&apos;,&apos;' + item.id + '&apos;,&apos;' + child.id + '&apos;)">' + renderEmoji(child.icon) + '</button>';
            html += '      <input class="mm-name-input" value="' + escapeHtml(child.name) + '" oninput="updateMmMenuName(&apos;' + item.id + '&apos;,&apos;' + child.id + '&apos;,this.value)" placeholder="메뉴명">';
            html += '      <button class="mm-del-btn" onclick="deleteMmMenuItem(&apos;' + item.id + '&apos;,&apos;' + child.id + '&apos;)" title="삭제">🗑</button>';
            html += '    </div>';
          });
          html += '    <button class="mm-add-menu-btn" onclick="addMmMenuItem(&apos;' + item.id + '&apos;)">+ 메뉴 추가</button>';
          html += '  </div>';
          html += '</div>';
        } else if (item.type === 'page') {
          html += '<div class="mm-top-page" data-page-id="' + item.id + '">';
          html += '  <span class="mm-drag-handle" style="visibility:hidden">⠿</span>';
          html += '  <button class="mm-emoji-btn" onclick="openMmEmojiPicker(&apos;top&apos;,&apos;' + item.id + '&apos;,&apos;&apos;)">' + renderEmoji(item.icon) + '</button>';
          html += '  <input class="mm-name-input" value="' + escapeHtml(item.name) + '" oninput="updateMmTopName(&apos;' + item.id + '&apos;,this.value)" placeholder="메뉴명">';
          html += '  <span class="mm-fixed-badge">고정</span>';
          html += '</div>';
        }
      });

      html += '</div>';
      html += '<button class="mm-add-group-btn" onclick="addMmGroup()">+ 대분류 추가</button>';
      html += '<div class="mm-save-row">';
      html += '  <button class="btn-cancel" onclick="initMenuDraft()">되돌리기</button>';
      html += '  <button class="btn-confirm" onclick="saveMmDraft()">저장</button>';
      html += '</div>';

      container.innerHTML = html;
      attachMmDnd(container.querySelector('#mmList'));
    }

    var __mmDrag = { type: null, id: null, groupId: null };

    function attachMmDnd(list) {
      if (!list) return;

      list.addEventListener('dragstart', function(e) {
        var origin = e.composedPath ? e.composedPath()[0] : e.target;
        var menuItem    = e.target.closest('.mm-menu-item[draggable]');
        var groupHeader = e.target.closest('.mm-group-header[draggable]');
        if (menuItem && list.contains(menuItem)) {
          if (origin.tagName === 'INPUT') { e.preventDefault(); return; }
          __mmDrag.type = 'menu';
          __mmDrag.id = menuItem.dataset.menuId;
          __mmDrag.groupId = menuItem.dataset.groupId;
          menuItem.classList.add('mm-dragging');
          e.dataTransfer.effectAllowed = 'move';
          e.stopPropagation();
        } else if (groupHeader && list.contains(groupHeader)) {
          if (origin.tagName === 'INPUT') { e.preventDefault(); return; }
          __mmDrag.type = 'group';
          __mmDrag.id = groupHeader.dataset.groupId;
          groupHeader.closest('.mm-group').classList.add('mm-dragging');
          e.dataTransfer.effectAllowed = 'move';
        }
      });

      list.addEventListener('dragover', function(e) {
        e.preventDefault();
        list.querySelectorAll('.mm-insert-before, .mm-insert-after').forEach(function(el) {
          el.classList.remove('mm-insert-before', 'mm-insert-after');
        });

        if (__mmDrag.type === 'group') {
          var overGroup = e.target.closest('.mm-group');
          if (!overGroup || overGroup.dataset.groupId === __mmDrag.id) return;
          var r = overGroup.getBoundingClientRect();
          if (e.clientY < r.top + r.height / 2) overGroup.classList.add('mm-insert-before');
          else overGroup.classList.add('mm-insert-after');
        } else if (__mmDrag.type === 'menu') {
          var overItem = e.target.closest('.mm-menu-item');
          if (overItem && overItem.dataset.menuId !== __mmDrag.id) {
            var r2 = overItem.getBoundingClientRect();
            if (e.clientY < r2.top + r2.height / 2) overItem.classList.add('mm-insert-before');
            else overItem.classList.add('mm-insert-after');
          }
        }
      });

      list.addEventListener('dragleave', function(e) {
        if (!list.contains(e.relatedTarget)) {
          list.querySelectorAll('.mm-insert-before, .mm-insert-after').forEach(function(el) {
            el.classList.remove('mm-insert-before', 'mm-insert-after');
          });
        }
      });

      list.addEventListener('drop', function(e) {
        e.preventDefault();
        var insertBefore = list.querySelector('.mm-insert-before');
        var insertAfter  = list.querySelector('.mm-insert-after');
        list.querySelectorAll('.mm-dragging, .mm-insert-before, .mm-insert-after').forEach(function(el) {
          el.classList.remove('mm-dragging', 'mm-insert-before', 'mm-insert-after');
        });

        if (__mmDrag.type === 'group') {
          var targetEl = insertBefore || insertAfter;
          if (!targetEl) return;
          var targetId = targetEl.dataset.groupId;
          var sorted = menuDraft.slice().sort(function(a, b) { return a.order - b.order; });
          var fromIdx = sorted.findIndex(function(m) { return m.id === __mmDrag.id; });
          var toIdx   = sorted.findIndex(function(m) { return m.id === targetId; });
          if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;
          if (insertAfter) toIdx++;
          if (fromIdx < toIdx) toIdx--;
          var moved = sorted.splice(fromIdx, 1)[0];
          sorted.splice(toIdx, 0, moved);
          sorted.forEach(function(m, i) { m.order = i; });
          renderMenuManager();

        } else if (__mmDrag.type === 'menu') {
          var targetItem = insertBefore || insertAfter;
          if (!targetItem) {
            // dropped onto a children zone but not on a specific item → append to that group
            var overChildren = e.target.closest('.mm-children');
            if (!overChildren) return;
            var tgtGrpId = overChildren.dataset.groupId;
            var srcGrp = menuDraft.find(function(m) { return m.id === __mmDrag.groupId; });
            var tgtGrp = menuDraft.find(function(m) { return m.id === tgtGrpId; });
            if (!srcGrp || !tgtGrp || srcGrp === tgtGrp) return;
            var srcIdx = (srcGrp.children || []).findIndex(function(c) { return c.id === __mmDrag.id; });
            if (srcIdx === -1) return;
            var movedItem = srcGrp.children.splice(srcIdx, 1)[0];
            if (!tgtGrp.children) tgtGrp.children = [];
            tgtGrp.children.push(movedItem);
            srcGrp.children.forEach(function(c, i) { c.order = i; });
            tgtGrp.children.forEach(function(c, i) { c.order = i; });
            renderMenuManager();
            return;
          }
          var targetMenuId = targetItem.dataset.menuId;
          var targetGrpId  = targetItem.dataset.groupId;
          var srcGrp2 = menuDraft.find(function(m) { return m.id === __mmDrag.groupId; });
          var tgtGrp2 = menuDraft.find(function(m) { return m.id === targetGrpId; });
          if (!srcGrp2 || !tgtGrp2) return;
          var srcIdx2 = (srcGrp2.children || []).findIndex(function(c) { return c.id === __mmDrag.id; });
          if (srcIdx2 === -1) return;
          var movedItem2 = srcGrp2.children.splice(srcIdx2, 1)[0];
          var sortedTgt = tgtGrp2.children.slice().sort(function(a, b) { return a.order - b.order; });
          var insertIdx = sortedTgt.findIndex(function(c) { return c.id === targetMenuId; });
          if (insertAfter) insertIdx++;
          if (srcGrp2 === tgtGrp2 && srcIdx2 < insertIdx) insertIdx--;
          tgtGrp2.children.splice(insertIdx, 0, movedItem2);
          srcGrp2.children.forEach(function(c, i) { c.order = i; });
          tgtGrp2.children.forEach(function(c, i) { c.order = i; });
          renderMenuManager();
        }

        __mmDrag = { type: null, id: null, groupId: null };
      });

      list.addEventListener('dragend', function() {
        list.querySelectorAll('.mm-dragging, .mm-insert-before, .mm-insert-after').forEach(function(el) {
          el.classList.remove('mm-dragging', 'mm-insert-before', 'mm-insert-after');
        });
        __mmDrag = { type: null, id: null, groupId: null };
      });
    }

    function initMenuDraft() {
      menuDraft = JSON.parse(JSON.stringify(menus));
      renderMenuManager();
    }

    function updateMmGroupName(groupId, name) {
      var g = menuDraft.find(function(m) { return m.id === groupId; });
      if (g) g.name = name;
    }

    function updateMmMenuName(groupId, menuId, name) {
      var g = menuDraft.find(function(m) { return m.id === groupId; });
      if (g && g.children) {
        var c = g.children.find(function(x) { return x.id === menuId; });
        if (c) c.name = name;
      }
    }

    function updateMmTopName(pageId, name) {
      var p = menuDraft.find(function(m) { return m.id === pageId; });
      if (p) p.name = name;
    }

    function openMmEmojiPicker(type, groupId, menuId) {
      var current = '';
      if (type === 'group' || type === 'top') {
        var g = menuDraft.find(function(m) { return m.id === groupId; });
        if (g) current = g.icon;
      } else {
        var grp = menuDraft.find(function(m) { return m.id === groupId; });
        if (grp && grp.children) {
          var c = grp.children.find(function(x) { return x.id === menuId; });
          if (c) current = c.icon;
        }
      }
      openEmojiPicker(current, function(emoji) {
        if (type === 'group' || type === 'top') {
          var g2 = menuDraft.find(function(m) { return m.id === groupId; });
          if (g2) { g2.icon = emoji; renderMenuManager(); }
        } else {
          var grp2 = menuDraft.find(function(m) { return m.id === groupId; });
          if (grp2 && grp2.children) {
            var c2 = grp2.children.find(function(x) { return x.id === menuId; });
            if (c2) { c2.icon = emoji; renderMenuManager(); }
          }
        }
      });
    }

    function addMmGroup() {
      var newGroup = {
        id: 'group-' + Date.now(),
        type: 'group',
        icon: '📁',
        name: '새 대분류',
        order: menuDraft.length,
        children: []
      };
      menuDraft.push(newGroup);
      renderMenuManager();
    }

    function deleteMmGroup(groupId) {
      var g = menuDraft.find(function(m) { return m.id === groupId; });
      if (!g) return;
      if (g.children && g.children.length > 0) {
        showAlert('삭제 불가', '소속된 메뉴가 있어서 삭제할 수 없습니다.<br>메뉴를 모두 다른 대분류로 이동하거나 삭제한 후 시도해 주세요.');
        return;
      }
      showConfirm('대분류 삭제', '"' + escapeHtml(g.name) + '" 대분류를 삭제하시겠습니까?', function() {
        menuDraft = menuDraft.filter(function(m) { return m.id !== groupId; });
        menuDraft.forEach(function(m, i) { m.order = i; });
        renderMenuManager();
      });
    }

    function addMmMenuItem(groupId) {
      var g = menuDraft.find(function(m) { return m.id === groupId; });
      if (!g) return;
      if (!g.children) g.children = [];
      g.children.push({
        id: 'menu-' + Date.now(),
        type: 'page',
        icon: '📄',
        name: '새 메뉴',
        slug: '',
        order: g.children.length
      });
      renderMenuManager();
    }

    function deleteMmMenuItem(groupId, menuId) {
      var g = menuDraft.find(function(m) { return m.id === groupId; });
      if (!g || !g.children) return;
      var item = g.children.find(function(c) { return c.id === menuId; });
      if (!item) return;
      showConfirm('메뉴 삭제', '"' + escapeHtml(item.name) + '" 메뉴를 삭제하시겠습니까?', function() {
        g.children = g.children.filter(function(c) { return c.id !== menuId; });
        g.children.forEach(function(c, i) { c.order = i; });
        renderMenuManager();
      });
    }

    function saveMmDraft() {
      menus = JSON.parse(JSON.stringify(menuDraft));
      saveMenus();
      if (window.GS && GS.isConnected()) GS.syncSheets();
      renderSidebar();
      showToast('메뉴 설정 저장 완료');
    }

    function updateMenuIcon(menuId, icon) {
      const menu = menus.find(function(m) { return m.id === menuId; });
      if (menu) { menu.icon = icon; saveMenus(); renderSidebar(); renderMenuManager(); }
    }

    function updateMenuName(menuId, name) {
      const menu = menus.find(function(m) { return m.id === menuId; });
      if (menu) { menu.name = name; saveMenus(); renderSidebar(); renderMenuManager(); }
    }

    function updateMenuSlug(menuId, slug) {
      const menu = menus.find(function(m) { return m.id === menuId; });
      if (menu) { menu.slug = slug; saveMenus(); renderMenuManager(); }
    }

    function moveMenuUp(index) {
      const sortedMenus = menus.slice().sort(function(a, b) { return a.order - b.order; });
      if (index > 0) {
        const temp = sortedMenus[index].order;
        sortedMenus[index].order = sortedMenus[index - 1].order;
        sortedMenus[index - 1].order = temp;
        saveMenus(); renderSidebar(); renderMenuManager();
      }
    }

    function moveMenuDown(index) {
      const sortedMenus = menus.slice().sort(function(a, b) { return a.order - b.order; });
      if (index < sortedMenus.length - 1) {
        const temp = sortedMenus[index].order;
        sortedMenus[index].order = sortedMenus[index + 1].order;
        sortedMenus[index + 1].order = temp;
        saveMenus(); renderSidebar(); renderMenuManager();
      }
    }

    function updateChildIcon(groupId, childIndex, icon) {
      const group = menus.find(function(m) { return m.id === groupId; });
      if (group && group.children) {
        const sc = group.children.slice().sort(function(a, b) { return a.order - b.order; });
        if (sc[childIndex]) { sc[childIndex].icon = icon; saveMenus(); renderSidebar(); renderMenuManager(); }
      }
    }

    function updateChildName(groupId, childIndex, name) {
      const group = menus.find(function(m) { return m.id === groupId; });
      if (group && group.children) {
        const sc = group.children.slice().sort(function(a, b) { return a.order - b.order; });
        if (sc[childIndex]) { sc[childIndex].name = name; saveMenus(); renderSidebar(); renderMenuManager(); }
      }
    }

    function updateChildSlug(groupId, childIndex, slug) {
      const group = menus.find(function(m) { return m.id === groupId; });
      if (group && group.children) {
        const sc = group.children.slice().sort(function(a, b) { return a.order - b.order; });
        if (sc[childIndex]) { sc[childIndex].slug = slug; saveMenus(); renderMenuManager(); }
      }
    }

    function moveChildUp(groupId, childIndex) {
      const group = menus.find(function(m) { return m.id === groupId; });
      if (group && group.children) {
        const sc = group.children.slice().sort(function(a, b) { return a.order - b.order; });
        if (childIndex > 0) {
          const temp = sc[childIndex].order; sc[childIndex].order = sc[childIndex-1].order; sc[childIndex-1].order = temp;
          saveMenus(); renderSidebar(); renderMenuManager();
        }
      }
    }

    function moveChildDown(groupId, childIndex) {
      const group = menus.find(function(m) { return m.id === groupId; });
      if (group && group.children) {
        const sc = group.children.slice().sort(function(a, b) { return a.order - b.order; });
        if (childIndex < sc.length - 1) {
          const temp = sc[childIndex].order; sc[childIndex].order = sc[childIndex+1].order; sc[childIndex+1].order = temp;
          saveMenus(); renderSidebar(); renderMenuManager();
        }
      }
    }

    // ========================================
    // 탭 관리
    // ========================================
    function switchDailyTab(tabName) {
      // 일상 페이지 내부의 탭만 제어 (설정 페이지 탭과 충돌 방지)
      document.querySelectorAll('#dailyPage .tab-btn').forEach(function(btn) {
        btn.classList.remove('active');
      });

      document.querySelectorAll('#dailyPage .tab-content').forEach(function(content) {
        content.classList.remove('active');
      });

      const tabBtns = document.querySelectorAll('#dailyPage .tab-btn');
      if (tabName === 'schedule' && tabBtns[0]) {
        tabBtns[0].classList.add('active');
        document.getElementById('dailyScheduleTab').classList.add('active');
      } else if (tabName === 'activities' && tabBtns[1]) {
        tabBtns[1].classList.add('active');
        document.getElementById('dailyActivitiesTab').classList.add('active');
        renderCategoryFilter();
        renderActivities();
        renderCategories();
      }
    }

    // ========================================
    // 카테고리 관리
    // ========================================
    function loadCategories() {
      const saved = localStorage.getItem('categories');
      if (saved) {
        try {
          categories = JSON.parse(saved);
        } catch (e) {
          categories = [];
        }
      } else {
        categories = [];
      }
    }

    function saveCategories() {
      localStorage.setItem('categories', JSON.stringify(categories));
      GS.syncSheets(['카테고리']);
    }

    function generateId() {
      return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function isInlineEditingInProgress() {
      return editingActivityId !== null || editingCategoryId !== null;
    }

    function blockIfInlineEditing() {
      return isInlineEditingInProgress();
    }

    function addCategoryInline() {
      if (blockIfInlineEditing()) return;
      const newCategory = {
        id: generateId(),
        emoji: getRandomEmoji(),
        name: '',
        active: true,
        createdAt: today(),
        isNew: true
      };

      categories.unshift(newCategory);
      editingCategoryId = newCategory.id;
      renderCategories();
      
      setTimeout(function() {
        const emojiInput = document.querySelector('.category-card.editing .category-card-emoji input');
        if (emojiInput) {
          emojiInput.focus();
        }
      }, 100);
    }

    function saveCategoryInline(categoryId) {
      const category = categories.find(function(c) { return c.id === categoryId; });
      if (!category) return;

      if (!category.emoji || !category.name) {
        showAlert('입력 오류', '이모지와 카테고리 이름을 모두 입력해주세요.');
        return;
      }

      const wasNew = !!category.isNew;
      delete category.isNew;
      editingCategoryId = null;
      saveCategories();
      renderCategories();
      renderCategoryFilter();
      renderActivities();
      showToast(wasNew ? '✅ 카테고리가 추가되었습니다' : '✅ 카테고리가 수정되었습니다');
    }

    function cancelCategoryInline(categoryId) {
      const category = categories.find(function(c) { return c.id === categoryId; });
      if (category && category.isNew) {
        categories = categories.filter(function(c) { return c.id !== categoryId; });
      }
      editingCategoryId = null;
      renderCategories();
    }

    function editCategory(categoryId) {
      if (editingCategoryId === categoryId) return;
      if (blockIfInlineEditing()) return;
      editingCategoryId = categoryId;
      renderCategories();

      setTimeout(function() {
        const nameInput = document.querySelector('.category-card.editing .category-card-name input');
        if (nameInput) nameInput.focus();
      }, 100);
    }

    function updateCategoryEmoji(categoryId, emoji) {
      const category = categories.find(function(c) { return c.id === categoryId; });
      if (category) {
        category.emoji = emoji;
      }
    }

    function updateCategoryName(categoryId, name) {
      const category = categories.find(function(c) { return c.id === categoryId; });
      if (category) {
        category.name = name;
      }
    }

    function toggleCategoryActive(categoryId) {
      const category = categories.find(function(c) { return c.id === categoryId; });
      if (category) {
        category.active = !category.active;
        saveCategories();
        renderCategories();
        renderCategoryFilter();
        renderActivities();
      }
    }

    function deleteCategory(categoryId) {
      var cat = categories.find(function(c) { return c.id === categoryId; });
      var memberActivities = activities.filter(function(a) { return a.categoryId === categoryId; });
      var detailHtml = '';
      var msg = '이 카테고리를 삭제하시겠습니까?';
      if (memberActivities.length > 0) {
        msg = '이 카테고리를 삭제하시겠습니까?\n소속 일상은 미지정 상태로 변경됩니다.';
        detailHtml = '<b>소속 일상 (' + memberActivities.length + '개):</b><br>' +
          memberActivities.map(function(a) { return renderEmoji(a.emoji) + ' ' + escapeHtml(a.name); }).join('<br>');
      }
      showConfirm('카테고리 삭제', msg, function(confirmed) {
        if (confirmed) {
          categories = categories.filter(function(c) { return c.id !== categoryId; });
          activities.forEach(function(a) { if (a.categoryId === categoryId) a.categoryId = null; });
          saveCategories();
          saveActivities();
          renderCategories();
          renderCategoryFilter();
          renderActivities();
          showToast('🗑️ 카테고리가 삭제되었습니다');
        }
      }, detailHtml);
    }

    function toggleCategorySelect(id, checked) {
      if (checked) selectedCategoryIds.add(id);
      else selectedCategoryIds.delete(id);
      updateCategoryBulkBar();
    }

    function toggleSelectAllCategories(checked) {
      var visibleIds = categories.filter(function(c) { return c.active !== false; }).map(function(c) { return c.id; });
      if (checked) visibleIds.forEach(function(id) { selectedCategoryIds.add(id); });
      else selectedCategoryIds.clear();
      updateCategoryBulkBar();
      renderCategories();
    }

    function updateCategoryBulkBar() {
      var count = selectedCategoryIds.size;
      var countEl = document.getElementById('categoryBulkCount');
      var actions = document.getElementById('categoryBulkActions');
      var selectAll = document.getElementById('categorySelectAll');
      if (countEl) countEl.textContent = count + '개 선택됨';
      if (actions) actions.style.display = count > 0 ? '' : 'none';
      if (selectAll) {
        var total = categories.length;
        selectAll.checked = count > 0 && count === total;
        selectAll.indeterminate = count > 0 && count < total;
      }
    }

    function clearCategorySelection() {
      selectedCategoryIds.clear();
      updateCategoryBulkBar();
      renderCategories();
    }

    function deleteSelectedCategories() {
      var ids = Array.from(selectedCategoryIds);
      if (!ids.length) return;
      var memberActivities = activities.filter(function(a) { return selectedCategoryIds.has(a.categoryId); });
      var msg = ids.length + '개의 카테고리를 삭제하시겠습니까?';
      var detailHtml = '';
      if (memberActivities.length > 0) {
        msg = ids.length + '개의 카테고리를 삭제하시겠습니까?\n소속 일상은 미지정 상태로 변경됩니다.';
        detailHtml = '<b>미지정으로 변경될 일상 (' + memberActivities.length + '개):</b><br>' +
          memberActivities.map(function(a) { return renderEmoji(a.emoji) + ' ' + escapeHtml(a.name); }).join('<br>');
      }
      showConfirm('카테고리 삭제', msg, function(confirmed) {
        if (!confirmed) return;
        var count = ids.length;
        categories = categories.filter(function(c) { return !selectedCategoryIds.has(c.id); });
        activities.forEach(function(a) { if (selectedCategoryIds.has(a.categoryId)) a.categoryId = null; });
        selectedCategoryIds.clear();
        saveCategories();
        saveActivities();
        updateCategoryBulkBar();
        renderCategories();
        renderCategoryFilter();
        renderActivities();
        showToast('🗑️ ' + count + '개 카테고리가 삭제되었습니다');
      }, detailHtml);
    }

    function renderCategories() {
      const container = document.getElementById('categoryGrid');
      if (!container) return;
      const topPager = document.getElementById('categoryPagerTop');
      const bottomPager = document.getElementById('categoryPagerBottom');

      if (categories.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px; grid-column: 1 / -1;">카테고리가 없습니다. 카테고리를 추가해주세요.</p>';
        if (topPager) topPager.innerHTML = '';
        if (bottomPager) bottomPager.innerHTML = '';
        return;
      }

      var total = categories.length;
      var totalPages = Math.max(1, Math.ceil(total / categoryListPerPage));
      if (categoryListPage > totalPages) categoryListPage = totalPages;
      var editingIdx = -1;
      if (editingCategoryId) {
        editingIdx = categories.findIndex(function(c) { return c.id === editingCategoryId; });
      }
      var start = (categoryListPage - 1) * categoryListPerPage;
      var pageItems = categories.slice(start, start + categoryListPerPage);
      if (editingIdx >= 0 && (editingIdx < start || editingIdx >= start + categoryListPerPage)) {
        pageItems = [categories[editingIdx]].concat(pageItems);
      }

      var pagerHtml = buildGenericPagerBar({
        total: total,
        page: categoryListPage,
        perPage: categoryListPerPage,
        perPageOpts: [10, 20, 50, 100],
        goFn: 'goCategoryPage',
        setPerPageFn: 'setCategoryPerPage'
      });
      if (topPager) topPager.innerHTML = pagerHtml;
      if (bottomPager) bottomPager.innerHTML = pagerHtml;

      let html = '';
      pageItems.forEach(function(category) {
        const activityCount = activities.filter(function(a) { return a.categoryId === category.id; }).length;
        const isEditing = (editingCategoryId === category.id);
        const isSelected = (selectedCategoryFilter === category.id);
        
        const isCatChecked = selectedCategoryIds.has(category.id);
        const catDragAttrs = isEditing ? '' : ' draggable="true" data-drag-id="' + category.id + '"';
        html += '<div class="category-card' + (isEditing ? ' editing' : '') + (isSelected ? ' selected' : '') + '"' + catDragAttrs + ' onclick="' + (isEditing ? '' : 'editCategory(\'' + category.id + '\')') + '">';
        if (!isEditing) {
          html += '<label class="card-cb" onclick="event.stopPropagation()"><input type="checkbox" ' + (isCatChecked ? 'checked' : '') + ' onchange="toggleCategorySelect(&apos;' + category.id + '&apos;,this.checked)"></label>';
        }
        html += '  <div class="category-card-header">';
        
        if (isEditing) {
          html += '    <div class="category-card-emoji">';
          html += '      <div class="emoji-edit-btn" onclick="event.stopPropagation(); openEmojiPicker(&apos;' + category.emoji + '&apos;, function(emoji) { updateCategoryEmoji(&apos;' + category.id + '&apos;, emoji); var btn=document.querySelector(&apos;.category-card.editing .emoji-edit-btn&apos;); if(btn) btn.innerHTML=renderEmoji(emoji); })">' + renderEmoji(category.emoji) + '</div>';
          html += '    </div>';
          html += '    <div class="category-card-name">';
          html += '      <input type="text" value="' + category.name + '" oninput="updateCategoryName(&apos;' + category.id + '&apos;, this.value)" onkeydown="if(event.key===&apos;Enter&apos;) saveCategoryInline(&apos;' + category.id + '&apos;); if(event.key===&apos;Escape&apos;) cancelCategoryInline(&apos;' + category.id + '&apos;)" placeholder="카테고리 이름">';
          html += '    </div>';
        } else {
          html += '    <div class="category-card-emoji">' + renderEmoji(category.emoji) + '</div>';
          html += '    <div class="category-card-name">' + category.name + '</div>';
        }
        
        html += '  </div>';
        
        if (!isEditing) {
          html += '  <div class="category-card-count">' + activityCount + '개 일상</div>';
          html += '  <div class="category-card-badges">';
          if (!category.active) {
            html += '    <span class="category-badge inactive">비활성</span>';
          }
          html += '  </div>';
        }
        
        html += '  <div class="category-card-actions">';
        if (isEditing) {
          html += '    <button class="btn-confirm" onclick="event.stopPropagation(); saveCategoryInline(\'' + category.id + '\')">저장</button>';
          html += '    <button class="btn-cancel" onclick="event.stopPropagation(); cancelCategoryInline(\'' + category.id + '\')">취소</button>';
        } else {
          html += '    <button class="btn-icon" onclick="event.stopPropagation(); editCategory(\'' + category.id + '\')">수정</button>';
          html += '    <button class="btn-icon" onclick="event.stopPropagation(); toggleCategoryActive(\'' + category.id + '\')">' + (category.active ? '비활성' : '활성') + '</button>';
          html += '    <button class="btn-icon btn-danger" onclick="event.stopPropagation(); deleteCategory(\'' + category.id + '\')">삭제</button>';
        }
        html += '  </div>';
        
        html += '</div>';
      });

      container.innerHTML = html;
      attachCardDragReorder(container, categories, saveCategories, function() {
        renderCategoryFilter();
        renderCategories();
      });
    }

    function renderCategoryFilter() {
      const select = document.getElementById('activityCategoryFilter');
      if (!select) return;

      let html = '<option value="">전체</option>';
      html += '<option value="unassigned">미지정</option>';
      
      categories.filter(function(c) { return c.active; }).forEach(function(category) {
        html += '<option value="' + category.id + '">' + category.emoji + ' ' + category.name + '</option>';
      });

      select.innerHTML = html;
      select.value = selectedCategoryFilter;
    }

    function filterActivitiesByCategory() {
      const select = document.getElementById('activityCategoryFilter');
      if (!select) return;
      
      selectedCategoryFilter = select.value;
      activityListPage = 1;
      renderActivities();
    }

    function selectCategoryFilter(categoryId) {
      if (selectedCategoryFilter === categoryId) {
        selectedCategoryFilter = '';
      } else {
        selectedCategoryFilter = categoryId;
      }
      activityListPage = 1;
      
      const select = document.getElementById('activityCategoryFilter');
      if (select) {
        select.value = selectedCategoryFilter;
      }
      
      renderActivities();
      renderCategories();
    }

    // ========================================
    // 일상 종류 관리
    // ========================================
    function loadActivities() {
      const saved = localStorage.getItem('activities');
      if (saved) {
        try {
          activities = JSON.parse(saved);
        } catch (e) {
          activities = [];
        }
      } else {
        activities = [];
      }

      // 마이그레이션: 누락된 color 필드 기본값 지정
      let needsSave = false;
      activities.forEach(function(a) {
        if (!a.color) {
          a.color = '#ffde59';
          needsSave = true;
        }
      });
      if (needsSave) saveActivities();
    }

    function saveActivities() {
      localStorage.setItem('activities', JSON.stringify(activities));
      GS.syncSheets(['일상종류']);
    }

    function addActivityInline() {
      if (blockIfInlineEditing()) return;
      const newActivity = {
        id: generateId(),
        categoryId: selectedCategoryFilter === 'unassigned' ? null : (selectedCategoryFilter || null),
        emoji: getRandomEmoji(),
        name: '',
        color: '#ffde59',
        active: true,
        createdAt: today(),
        isNew: true
      };

      activities.unshift(newActivity);
      editingActivityId = newActivity.id;
      renderActivities();
      
      setTimeout(function() {
        const nameInput = document.querySelector('.activity-card.editing .activity-card-name input');
        if (nameInput) nameInput.focus();
      }, 100);
    }

    function saveActivityInline(activityId) {
      const activity = activities.find(function(a) { return a.id === activityId; });
      if (!activity) return;

      if (!activity.emoji || !activity.name) {
        showAlert('입력 오류', '이모지와 일상 이름을 모두 입력해주세요.');
        return;
      }

      const wasNew = !!activity.isNew;
      delete activity.isNew;
      editingActivityId = null;
      saveActivities();
      renderActivities();
      renderCategories();
      showToast(wasNew ? '✅ 일상이 추가되었습니다' : '✅ 일상이 수정되었습니다');
    }

    function cancelActivityInline(activityId) {
      const activity = activities.find(function(a) { return a.id === activityId; });
      if (activity && activity.isNew) {
        activities = activities.filter(function(a) { return a.id !== activityId; });
      }
      editingActivityId = null;
      renderActivities();
    }

    function editActivity(activityId) {
      if (editingActivityId === activityId) return;
      if (blockIfInlineEditing()) return;
      editingActivityId = activityId;
      renderActivities();

      setTimeout(function() {
        const nameInput = document.querySelector('.activity-card.editing .activity-card-name input');
        if (nameInput) nameInput.focus();
      }, 100);
    }

    function updateActivityEmoji(activityId, emoji) {
      const activity = activities.find(function(a) { return a.id === activityId; });
      if (activity) {
        activity.emoji = emoji;
      }
    }

    function updateActivityName(activityId, name) {
      const activity = activities.find(function(a) { return a.id === activityId; });
      if (activity) {
        activity.name = name;
      }
    }

    function updateActivityCategory(activityId, categoryId) {
      const activity = activities.find(function(a) { return a.id === activityId; });
      if (activity) {
        activity.categoryId = categoryId || null;
      }
    }

    function updateActivityColor(activityId, color) {
      const activity = activities.find(function(a) { return a.id === activityId; });
      if (activity) {
        activity.color = color;
      }
    }

    function toggleActivityActive(activityId) {
      const activity = activities.find(function(a) { return a.id === activityId; });
      if (activity) {
        activity.active = !activity.active;
        saveActivities();
        renderActivities();
      }
    }

    function deleteActivity(activityId) {
      var usedItems = scheduleItems.filter(function(i) { return i.activityId === activityId; });
      var usedScheduleIds = usedItems.map(function(i) { return i.scheduleId; });
      var usedSchedules = schedules.filter(function(s) { return usedScheduleIds.indexOf(s.id) >= 0; });
      var msg = '이 일상 종류를 삭제하시겠습니까?';
      var detailHtml = '';
      if (usedSchedules.length > 0) {
        msg = '이 일상 종류를 삭제하시겠습니까?\n아래 시간표에서 사용 중입니다.';
        detailHtml = '<b>사용 중인 시간표 (' + usedSchedules.length + '개):</b><br>' +
          usedSchedules.map(function(s) { return renderEmoji(s.emoji) + ' ' + escapeHtml(s.title); }).join('<br>');
      }
      showConfirm('일상 종류 삭제', msg, function(confirmed) {
        if (confirmed) {
          activities = activities.filter(function(a) { return a.id !== activityId; });
          saveActivities();
          renderActivities();
          renderCategories();
          showToast('🗑️ 일상이 삭제되었습니다');
        }
      }, detailHtml);
    }

    function toggleActivitySelect(id, checked) {
      if (checked) selectedActivityIds.add(id);
      else selectedActivityIds.delete(id);
      updateActivityBulkBar();
    }

    function toggleSelectAllActivities(checked) {
      var visibleIds = getFilteredActivities().map(function(a) { return a.id; });
      if (checked) visibleIds.forEach(function(id) { selectedActivityIds.add(id); });
      else selectedActivityIds.clear();
      updateActivityBulkBar();
      renderActivities();
    }

    function updateActivityBulkBar() {
      var count = selectedActivityIds.size;
      var countEl = document.getElementById('activityBulkCount');
      var actions = document.getElementById('activityBulkActions');
      var selectAll = document.getElementById('activitySelectAll');
      if (countEl) countEl.textContent = count + '개 선택됨';
      if (actions) actions.style.display = count > 0 ? '' : 'none';
      if (selectAll) {
        var total = getFilteredActivities().length;
        selectAll.checked = count > 0 && count === total;
        selectAll.indeterminate = count > 0 && count < total;
      }
    }

    function clearActivitySelection() {
      selectedActivityIds.clear();
      updateActivityBulkBar();
      renderActivities();
    }

    function deleteSelectedActivities() {
      var ids = Array.from(selectedActivityIds);
      if (!ids.length) return;
      var usedItems = scheduleItems.filter(function(i) { return selectedActivityIds.has(i.activityId); });
      var usedScheduleIds = usedItems.map(function(i) { return i.scheduleId; }).filter(function(v, i, a) { return a.indexOf(v) === i; });
      var usedSchedules = schedules.filter(function(s) { return usedScheduleIds.indexOf(s.id) >= 0; });
      var msg = ids.length + '개의 일상 종류를 삭제하시겠습니까?';
      var detailHtml = '';
      if (usedSchedules.length > 0) {
        msg = ids.length + '개의 일상 종류를 삭제하시겠습니까?\n일부는 아래 시간표에서 사용 중입니다.';
        detailHtml = '<b>사용 중인 시간표 (' + usedSchedules.length + '개):</b><br>' +
          usedSchedules.map(function(s) { return renderEmoji(s.emoji) + ' ' + escapeHtml(s.title); }).join('<br>');
      }
      showConfirm('일상 종류 삭제', msg, function(confirmed) {
        if (!confirmed) return;
        var count = ids.length;
        activities = activities.filter(function(a) { return !selectedActivityIds.has(a.id); });
        selectedActivityIds.clear();
        saveActivities();
        updateActivityBulkBar();
        renderActivities();
        renderCategories();
        showToast('🗑️ ' + count + '개 일상이 삭제되었습니다');
      }, detailHtml);
    }

    function getFilteredActivities() {
      var filtered = activities.slice();
      if (typeof selectedCategoryFilter !== 'undefined' && selectedCategoryFilter) {
        if (selectedCategoryFilter === 'unassigned') filtered = filtered.filter(function(a) { return !a.categoryId; });
        else filtered = filtered.filter(function(a) { return a.categoryId === selectedCategoryFilter; });
      }
      return filtered;
    }

    function setActivityViewMode(mode) {
      activityViewMode = mode;
      var defaultBtn = document.getElementById('activityViewDefault');
      var groupedBtn = document.getElementById('activityViewGrouped');
      var filterWrap = document.getElementById('activityCategoryFilterWrap');
      var topPager = document.getElementById('activityPagerTop');
      var bottomPager = document.getElementById('activityPagerBottom');
      if (defaultBtn) defaultBtn.classList.toggle('active', mode === 'default');
      if (groupedBtn) groupedBtn.classList.toggle('active', mode === 'grouped');
      if (filterWrap) filterWrap.style.display = mode === 'default' ? 'flex' : 'none';
      if (mode === 'grouped') {
        if (topPager) topPager.innerHTML = '';
        if (bottomPager) bottomPager.innerHTML = '';
      }
      renderActivities();
    }

    function renderActivitiesGrouped(container) {
      if (!container) return;
      var html = '';
      var groupList = categories.slice();
      var hasUnassigned = activities.some(function(a) { return !a.categoryId; });
      if (hasUnassigned) groupList = groupList.concat([{ id: null, emoji: '📂', name: '미지정' }]);

      if (groupList.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px; grid-column: 1 / -1;">카테고리가 없습니다. 카테고리를 먼저 추가해주세요.</p>';
        return;
      }

      groupList.forEach(function(cat) {
        var catIdStr = cat.id || '';
        var groupActivities = activities.filter(function(a) {
          return cat.id === null ? !a.categoryId : a.categoryId === cat.id;
        });
        if (cat.id !== null && groupActivities.length === 0 && editingActivityId === null) {
          // 빈 카테고리도 표시 (드롭 대상이 되어야 함)
        }

        var isDraggableGroup = cat.id !== null; // 미지정 그룹은 순서 고정
        html += '<div class="activity-group" data-drag-cat-id="' + catIdStr + '">';
        html += '<div class="activity-group-header"' + (isDraggableGroup ? ' draggable="true" data-drag-cat-id="' + catIdStr + '"' : '') + '>';
        html += cat.emoji + ' ' + cat.name + ' <span class="activity-group-count">' + groupActivities.length + '</span></div>';
        html += '<div class="activity-group-cards">';
        groupActivities.forEach(function(activity) {
          var isEditing = (editingActivityId === activity.id);
          var cardStyle = isEditing ? '' : ' style="' + getActivityCardStyle(activity.color) + '"';
          var dragAttrs = isEditing ? '' : ' draggable="true" data-drag-id="' + activity.id + '" data-drag-cat-id="' + catIdStr + '"';
          html += '<div class="activity-card' + (isEditing ? ' editing' : ' colored') + '"' + cardStyle + dragAttrs + ' onclick="' + (isEditing ? '' : 'editActivity(\'' + activity.id + '\')') + '">';
          if (!isEditing) {
            html += '<label class="card-cb" onclick="event.stopPropagation()"><input type="checkbox" ' + (selectedActivityIds.has(activity.id) ? 'checked' : '') + ' onchange="toggleActivitySelect(&apos;' + activity.id + '&apos;,this.checked)"></label>';
          }
          if (isEditing) {
            html += '  <div class="activity-card-emoji"><div class="emoji-edit-btn" onclick="event.stopPropagation(); openEmojiPicker(&apos;' + activity.emoji + '&apos;, function(emoji) { updateActivityEmoji(&apos;' + activity.id + '&apos;, emoji); var btn=document.querySelector(&apos;.activity-card.editing .emoji-edit-btn&apos;); if(btn) btn.innerHTML=renderEmoji(emoji); })">' + renderEmoji(activity.emoji) + '</div></div>';
            html += '  <div class="activity-card-name"><input type="text" value="' + activity.name + '" oninput="updateActivityName(&apos;' + activity.id + '&apos;, this.value)" onkeydown="if(event.key===&apos;Enter&apos;) saveActivityInline(&apos;' + activity.id + '&apos;); if(event.key===&apos;Escape&apos;) cancelActivityInline(&apos;' + activity.id + '&apos;)" placeholder="일상 이름"></div>';
          } else {
            html += '  <div class="activity-card-main">';
            html += '    <div class="activity-card-emoji">' + renderEmoji(activity.emoji) + '</div>';
            html += '    <div class="activity-card-text"><div class="activity-card-name">' + activity.name + '</div></div>';
            html += '  </div>';
          }
          if (isEditing) {
            html += '  <div class="activity-card-category"><select onclick="event.stopPropagation()" onchange="updateActivityCategory(&apos;' + activity.id + '&apos;, this.value)">';
            html += '    <option value=""' + (!activity.categoryId ? ' selected' : '') + '>미지정</option>';
            categories.forEach(function(c) {
              html += '    <option value="' + c.id + '"' + (activity.categoryId === c.id ? ' selected' : '') + '>' + c.emoji + ' ' + c.name + '</option>';
            });
            html += '  </select></div>';
            html += '  <div class="activity-card-color"><label>대표 색상</label><input type="color" value="' + (activity.color || '#ffde59') + '" onclick="event.stopPropagation()" oninput="updateActivityColor(&apos;' + activity.id + '&apos;, this.value)"></div>';
          }
          if (!isEditing) {
            html += '  <div class="activity-card-badges">' + (!activity.active ? '<span class="activity-badge inactive">비활성</span>' : '') + '</div>';
          }
          html += '  <div class="activity-card-actions">';
          if (isEditing) {
            html += '    <button class="btn-confirm" onclick="event.stopPropagation(); saveActivityInline(\'' + activity.id + '\')">저장</button>';
            html += '    <button class="btn-cancel" onclick="event.stopPropagation(); cancelActivityInline(\'' + activity.id + '\')">취소</button>';
          } else {
            html += '    <button class="btn-icon" onclick="event.stopPropagation(); toggleActivityActive(\'' + activity.id + '\')">' + (activity.active ? '비활성' : '활성') + '</button>';
            html += '    <button class="btn-icon btn-danger" onclick="event.stopPropagation(); deleteActivity(\'' + activity.id + '\')">삭제</button>';
          }
          html += '  </div>';
          html += '</div>';
        });
        html += '<button class="activity-group-add-btn btn-add" onclick="addActivityInlineToCategory(\'' + catIdStr + '\')">+ 일상 추가</button>';
        html += '</div>'; // .activity-group-cards
        html += '</div>'; // .activity-group
      });

      container.innerHTML = html;
      attachCardDragReorderGrouped(container, renderActivities);
      attachGroupDragReorder(container, renderActivities);
    }

    function addActivityInlineToCategory(categoryId) {
      if (blockIfInlineEditing()) return;
      var newActivity = {
        id: generateId(),
        categoryId: categoryId || null,
        emoji: getRandomEmoji(),
        name: '',
        color: '#ffde59',
        active: true,
        createdAt: today(),
        isNew: true
      };
      activities.push(newActivity);
      editingActivityId = newActivity.id;
      renderActivities();
      setTimeout(function() {
        var nameInput = document.querySelector('.activity-card.editing .activity-card-name input');
        if (nameInput) nameInput.focus();
      }, 50);
    }

    function renderActivities() {
      const container = document.getElementById('activityGrid');
      if (!container) return;
      const topPager = document.getElementById('activityPagerTop');
      const bottomPager = document.getElementById('activityPagerBottom');

      if (activityViewMode === 'grouped') {
        container.classList.add('activity-grid-grouped');
        if (topPager) topPager.innerHTML = '';
        if (bottomPager) bottomPager.innerHTML = '';
        renderActivitiesGrouped(container);
        return;
      }

      container.classList.remove('activity-grid-grouped');

      let filteredActivities = activities;

      if (selectedCategoryFilter === 'unassigned') {
        filteredActivities = activities.filter(function(a) { return !a.categoryId; });
      } else if (selectedCategoryFilter) {
        filteredActivities = activities.filter(function(a) { return a.categoryId === selectedCategoryFilter; });
      }

      if (filteredActivities.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px; grid-column: 1 / -1;">일상 종류가 없습니다. 일상을 추가해주세요.</p>';
        if (topPager) topPager.innerHTML = '';
        if (bottomPager) bottomPager.innerHTML = '';
        return;
      }

      // 편집 중 일상은 현재 페이지와 관계없이 항상 포함
      var total = filteredActivities.length;
      var totalPages = Math.max(1, Math.ceil(total / activityListPerPage));
      if (activityListPage > totalPages) activityListPage = totalPages;
      var editingIdx = -1;
      if (editingActivityId) {
        editingIdx = filteredActivities.findIndex(function(a) { return a.id === editingActivityId; });
      }
      var start = (activityListPage - 1) * activityListPerPage;
      var pageItems = filteredActivities.slice(start, start + activityListPerPage);
      if (editingIdx >= 0 && (editingIdx < start || editingIdx >= start + activityListPerPage)) {
        pageItems = [filteredActivities[editingIdx]].concat(pageItems);
      }

      var pagerHtml = buildGenericPagerBar({
        total: total,
        page: activityListPage,
        perPage: activityListPerPage,
        perPageOpts: [10, 20, 50, 100],
        goFn: 'goActivityPage',
        setPerPageFn: 'setActivityPerPage'
      });
      if (topPager) topPager.innerHTML = pagerHtml;
      if (bottomPager) bottomPager.innerHTML = pagerHtml;

      let html = '';
      pageItems.forEach(function(activity) {
        const category = categories.find(function(c) { return c.id === activity.categoryId; });
        const categoryLabel = category ? (category.emoji + ' ' + category.name) : '미지정';
        const isEditing = (editingActivityId === activity.id);
        
        const isChecked = selectedActivityIds.has(activity.id);
        const cardStyle = isEditing ? '' : ' style="' + getActivityCardStyle(activity.color) + '"';
        const dragAttrs = isEditing ? '' : ' draggable="true" data-drag-id="' + activity.id + '"';
        html += '<div class="activity-card' + (isEditing ? ' editing' : ' colored') + '"' + cardStyle + dragAttrs + ' onclick="' + (isEditing ? '' : 'editActivity(\'' + activity.id + '\')') + '">';
        if (!isEditing) {
          html += '<label class="card-cb" onclick="event.stopPropagation()"><input type="checkbox" ' + (isChecked ? 'checked' : '') + ' onchange="toggleActivitySelect(&apos;' + activity.id + '&apos;,this.checked)"></label>';
        }

        if (isEditing) {
          html += '  <div class="activity-card-emoji">';
          html += '    <div class="emoji-edit-btn" onclick="event.stopPropagation(); openEmojiPicker(&apos;' + activity.emoji + '&apos;, function(emoji) { updateActivityEmoji(&apos;' + activity.id + '&apos;, emoji); var btn=document.querySelector(&apos;.activity-card.editing .emoji-edit-btn&apos;); if(btn) btn.innerHTML=renderEmoji(emoji); })">' + renderEmoji(activity.emoji) + '</div>';
          html += '  </div>';
          html += '  <div class="activity-card-name">';
          html += '    <input type="text" value="' + activity.name + '" oninput="updateActivityName(&apos;' + activity.id + '&apos;, this.value)" onkeydown="if(event.key===&apos;Enter&apos;) saveActivityInline(&apos;' + activity.id + '&apos;); if(event.key===&apos;Escape&apos;) cancelActivityInline(&apos;' + activity.id + '&apos;)" placeholder="일상 이름">';
          html += '  </div>';
        } else {
          html += '  <div class="activity-card-main">';
          html += '    <div class="activity-card-emoji">' + renderEmoji(activity.emoji) + '</div>';
          html += '    <div class="activity-card-text">';
          html += '      <div class="activity-card-name">' + activity.name + '</div>';
          html += '      <div class="activity-card-category">' + categoryLabel + '</div>';
          html += '    </div>';
          html += '  </div>';
        }

        if (isEditing) {
          html += '  <div class="activity-card-category">';
          html += '    <select onclick="event.stopPropagation()" onchange="updateActivityCategory(&apos;' + activity.id + '&apos;, this.value)">';
          html += '      <option value=""' + (!activity.categoryId ? ' selected' : '') + '>미지정</option>';
          categories.forEach(function(cat) {
            const selected = (activity.categoryId === cat.id) ? ' selected' : '';
            html += '      <option value="' + cat.id + '"' + selected + '>' + cat.emoji + ' ' + cat.name + '</option>';
          });
          html += '    </select>';
          html += '  </div>';
          html += '  <div class="activity-card-color">';
          html += '    <label>대표 색상</label>';
          html += '    <input type="color" value="' + (activity.color || '#ffde59') + '" onclick="event.stopPropagation()" oninput="updateActivityColor(&apos;' + activity.id + '&apos;, this.value)">';
          html += '  </div>';
        }
        
        if (!isEditing) {
          html += '  <div class="activity-card-badges">';
          if (!activity.active) {
            html += '    <span class="activity-badge inactive">비활성</span>';
          }
          html += '  </div>';
        }
        
        html += '  <div class="activity-card-actions">';
        if (isEditing) {
          html += '    <button class="btn-confirm" onclick="event.stopPropagation(); saveActivityInline(\'' + activity.id + '\')">저장</button>';
          html += '    <button class="btn-cancel" onclick="event.stopPropagation(); cancelActivityInline(\'' + activity.id + '\')">취소</button>';
        } else {
          html += '    <button class="btn-icon" onclick="event.stopPropagation(); toggleActivityActive(\'' + activity.id + '\')">' + (activity.active ? '비활성' : '활성') + '</button>';
          html += '    <button class="btn-icon btn-danger" onclick="event.stopPropagation(); deleteActivity(\'' + activity.id + '\')">삭제</button>';
        }
        html += '  </div>';
        
        html += '</div>';
      });

      container.innerHTML = html;
      attachCardDragReorder(container, activities, saveActivities, renderActivities);
    }

    // ===== 공통 드래그 상태 (한 번에 하나만 드래그 가능) =====
    var __drag = { type: null, id: null, srcCatId: null };
    function __clearDragCss() {
      document.querySelectorAll('.card-insert-before,.card-insert-after,.card-insert-top,.card-insert-bottom,.group-insert-before,.group-insert-after').forEach(function(el) {
        el.classList.remove('card-insert-before','card-insert-after','card-insert-top','card-insert-bottom','group-insert-before','group-insert-after');
      });
    }

    // 드래그 순서 변경 — 기본 뷰 (삽입선 방식, array는 원본 배열 참조)
    function attachCardDragReorder(container, array, saveFn, rerenderFn) {
      if (!container) return;
      container.querySelectorAll('[data-drag-id]').forEach(function(card) {
        card.addEventListener('dragstart', function(e) {
          __drag.type = 'card'; __drag.id = card.dataset.dragId; __drag.srcCatId = card.dataset.dragCatId || '';
          card.classList.add('card-dragging');
          if (e.dataTransfer) { e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', __drag.id); } catch(err) {} }
        });
        card.addEventListener('dragend', function() {
          card.classList.remove('card-dragging');
          __clearDragCss();
          __drag.type = null; __drag.id = null; __drag.srcCatId = null;
        });
        card.addEventListener('dragover', function(e) {
          if (__drag.type !== 'card' || !__drag.id || card.dataset.dragId === __drag.id) return;
          e.preventDefault();
          var rect = card.getBoundingClientRect();
          var side = e.clientX < rect.left + rect.width / 2 ? 'before' : 'after';
          __clearDragCss();
          card.classList.add('card-insert-' + side);
        });
        card.addEventListener('dragleave', function(e) {
          if (!card.contains(e.relatedTarget)) card.classList.remove('card-insert-before', 'card-insert-after');
        });
        card.addEventListener('drop', function(e) {
          e.preventDefault();
          var targetId = card.dataset.dragId;
          if (__drag.type !== 'card' || !__drag.id || targetId === __drag.id) return;
          var rect = card.getBoundingClientRect();
          var after = e.clientX > rect.left + rect.width / 2;
          var srcIdx = array.findIndex(function(x) { return x.id === __drag.id; });
          if (srcIdx < 0) return;
          var item = array.splice(srcIdx, 1)[0];
          var newTgtIdx = array.findIndex(function(x) { return x.id === targetId; });
          if (newTgtIdx < 0) { array.splice(srcIdx, 0, item); return; }
          var insertAt = after ? newTgtIdx + 1 : newTgtIdx;
          if (insertAt > array.length) insertAt = array.length;
          array.splice(insertAt, 0, item);
          saveFn();
          rerenderFn();
        });
      });
    }

    // 드래그 순서 변경 — 카테고리별 보기 (가로 삽입선 + 카테고리간 이동)
    function attachCardDragReorderGrouped(container, rerenderFn) {
      if (!container) return;
      container.querySelectorAll('[data-drag-id]').forEach(function(card) {
        card.addEventListener('dragstart', function(e) {
          __drag.type = 'card'; __drag.id = card.dataset.dragId; __drag.srcCatId = card.dataset.dragCatId || '';
          card.classList.add('card-dragging');
          if (e.dataTransfer) { e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', __drag.id); } catch(err) {} }
        });
        card.addEventListener('dragend', function() {
          card.classList.remove('card-dragging');
          __clearDragCss();
          __drag.type = null; __drag.id = null; __drag.srcCatId = null;
        });
        card.addEventListener('dragover', function(e) {
          if (__drag.type !== 'card' || !__drag.id || card.dataset.dragId === __drag.id) return;
          e.preventDefault(); e.stopPropagation();
          var rect = card.getBoundingClientRect();
          var side = e.clientY < rect.top + rect.height / 2 ? 'top' : 'bottom';
          __clearDragCss();
          card.classList.add('card-insert-' + side);
        });
        card.addEventListener('dragleave', function(e) {
          if (!card.contains(e.relatedTarget)) card.classList.remove('card-insert-top', 'card-insert-bottom');
        });
        card.addEventListener('drop', function(e) {
          e.preventDefault(); e.stopPropagation();
          var targetId = card.dataset.dragId;
          var tgtCatId = card.dataset.dragCatId || '';
          if (__drag.type !== 'card' || !__drag.id || targetId === __drag.id) return;
          var rect = card.getBoundingClientRect();
          var after = e.clientY > rect.top + rect.height / 2;
          var srcIdx = activities.findIndex(function(a) { return a.id === __drag.id; });
          if (srcIdx < 0) return;
          var item = activities.splice(srcIdx, 1)[0];
          if (__drag.srcCatId !== tgtCatId) item.categoryId = tgtCatId || null;
          var newTgtIdx = activities.findIndex(function(a) { return a.id === targetId; });
          if (newTgtIdx < 0) { activities.splice(srcIdx, 0, item); return; }
          var insertAt = after ? newTgtIdx + 1 : newTgtIdx;
          if (insertAt > activities.length) insertAt = activities.length;
          activities.splice(insertAt, 0, item);
          saveActivities();
          rerenderFn();
        });
      });
      // 빈 그룹 영역(카드 아닌 곳)에 드롭 → 해당 카테고리 마지막 카드 아래에 삽입선
      container.querySelectorAll('.activity-group').forEach(function(group) {
        var groupCatId = group.dataset.dragCatId || '';
        group.addEventListener('dragover', function(e) {
          if (__drag.type !== 'card' || !__drag.id) return;
          if (e.target.closest && e.target.closest('[data-drag-id]')) return;
          e.preventDefault();
          __clearDragCss();
          var lastCard = group.querySelector('.activity-group-cards [data-drag-id]:last-child');
          if (lastCard && lastCard.dataset.dragId !== __drag.id) {
            lastCard.classList.add('card-insert-bottom');
          }
        });
        group.addEventListener('drop', function(e) {
          if (e.target.closest && e.target.closest('[data-drag-id]')) return;
          if (__drag.type !== 'card' || !__drag.id) return;
          e.preventDefault();
          var srcIdx = activities.findIndex(function(a) { return a.id === __drag.id; });
          if (srcIdx < 0) return;
          var item = activities.splice(srcIdx, 1)[0];
          item.categoryId = groupCatId || null;
          var lastInCat = -1;
          activities.forEach(function(a, i) { if ((a.categoryId || '') === groupCatId) lastInCat = i; });
          activities.splice(lastInCat >= 0 ? lastInCat + 1 : activities.length, 0, item);
          saveActivities();
          rerenderFn();
        });
      });
    }

    // 카테고리 그룹 순서 변경 (카테고리별 보기에서 그룹 헤더 드래그)
    function attachGroupDragReorder(container, rerenderFn) {
      if (!container) return;
      container.querySelectorAll('.activity-group-header[draggable]').forEach(function(header) {
        var group = header.closest('.activity-group');
        header.addEventListener('dragstart', function(e) {
          __drag.type = 'group'; __drag.id = header.dataset.dragCatId || '';
          if (group) group.classList.add('card-dragging');
          if (e.dataTransfer) { e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', __drag.id); } catch(err) {} }
        });
        header.addEventListener('dragend', function() {
          if (group) group.classList.remove('card-dragging');
          __clearDragCss();
          __drag.type = null; __drag.id = null;
        });
      });
      container.querySelectorAll('.activity-group[data-drag-cat-id]').forEach(function(group) {
        var groupCatId = group.dataset.dragCatId;
        group.addEventListener('dragover', function(e) {
          if (__drag.type !== 'group' || !__drag.id) return;
          e.preventDefault(); // 항상 호출 — move 커서 표시
          if (__drag.id === groupCatId) return; // 자기 자신: 인디케이터만 생략
          var rect = group.getBoundingClientRect();
          var side = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
          __clearDragCss();
          group.classList.add('group-insert-' + side);
        });
        group.addEventListener('dragleave', function(e) {
          if (!group.contains(e.relatedTarget)) group.classList.remove('group-insert-before', 'group-insert-after');
        });
        group.addEventListener('drop', function(e) {
          if (__drag.type !== 'group' || !__drag.id || __drag.id === groupCatId) return;
          e.preventDefault();
          var srcCatIdx = categories.findIndex(function(c) { return c.id === __drag.id; });
          if (srcCatIdx < 0) return;
          var catItem = categories.splice(srcCatIdx, 1)[0];
          var newTgtIdx = categories.findIndex(function(c) { return c.id === groupCatId; });
          if (newTgtIdx < 0) { categories.splice(srcCatIdx, 0, catItem); return; }
          var rect = group.getBoundingClientRect();
          var after = e.clientY > rect.top + rect.height / 2;
          var insertAt = after ? newTgtIdx + 1 : newTgtIdx;
          categories.splice(insertAt, 0, catItem);
          saveCategories();
          rerenderFn();
        });
      });
    }

    // ========================================
    // 시간표 관리
    // ========================================
    function getRandomEmoji() {
      const allEmojis = [];
      Object.keys(EMOJI_DATA).forEach(function(cat) {
        EMOJI_DATA[cat].forEach(function(e) { allEmojis.push(e); });
      });
      return allEmojis[Math.floor(Math.random() * allEmojis.length)];
    }

    // 배경색 → 대비되는 텍스트 색 자동 계산
    function hexToRgb(hex) {
      if (!hex) return { r: 255, g: 222, b: 89 };
      let h = hex.replace('#', '');
      if (h.length === 3) h = h.split('').map(function(c){ return c + c; }).join('');
      const num = parseInt(h, 16);
      return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    }

    function getActivityCardStyle(color) {
      const rgb = hexToRgb(color || '#ffde59');
      const alpha = 0.4;
      // 흰 배경에 alpha만큼 합성된 색상의 밝기 계산
      const blendedR = alpha * rgb.r + (1 - alpha) * 255;
      const blendedG = alpha * rgb.g + (1 - alpha) * 255;
      const blendedB = alpha * rgb.b + (1 - alpha) * 255;
      const brightness = (blendedR * 299 + blendedG * 587 + blendedB * 114) / 1000;
      const textColor = brightness < 150 ? '#ffffff' : '#333333';
      const bg = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alpha + ')';
      return 'background: ' + bg + '; color: ' + textColor + ';';
    }

    // 그리드 블록이 gridEnd를 초과하면 상단 세그먼트(래핑)를 추가로 반환
    // returns [{top, height, isContinued}]
    function splitGridBlock(sVirtual, eVirtual, gridStart, gridEnd, unitPx) {
      var segs = [];
      if (eVirtual <= gridEnd) {
        var top = (sVirtual - gridStart) / 30 * unitPx;
        var h = Math.max(unitPx, (eVirtual - sVirtual) / 30 * unitPx);
        segs.push({ top: top, height: h, isContinued: false });
      } else {
        // Bottom segment: sVirtual → gridEnd
        var top1 = (sVirtual - gridStart) / 30 * unitPx;
        var h1 = (gridEnd - sVirtual) / 30 * unitPx;
        if (h1 > 0) segs.push({ top: top1, height: Math.max(unitPx, h1), isContinued: false });
        // Top segment: gridStart → (eVirtual - 1440)
        var wrapEnd = eVirtual - 1440;
        if (wrapEnd > gridStart) {
          var h2 = (wrapEnd - gridStart) / 30 * unitPx;
          segs.push({ top: 0, height: Math.max(unitPx, h2), isContinued: true });
        }
      }
      return segs;
    }

    // 퍼센트 기반 버전 (mini-grid용)
    function splitGridBlockPct(sVirtual, eVirtual, gridStart, gridEnd) {
      var range = gridEnd - gridStart;
      var segs = [];
      if (eVirtual <= gridEnd) {
        var topPct = (sVirtual - gridStart) / range * 100;
        var hPct = Math.max(0.5, (eVirtual - sVirtual) / range * 100);
        segs.push({ topPct: topPct, heightPct: hPct, isContinued: false });
      } else {
        var top1Pct = (sVirtual - gridStart) / range * 100;
        var h1Pct = (gridEnd - sVirtual) / range * 100;
        if (h1Pct > 0) segs.push({ topPct: top1Pct, heightPct: Math.max(0.5, h1Pct), isContinued: false });
        var wrapEnd = eVirtual - 1440;
        if (wrapEnd > gridStart) {
          var h2Pct = (wrapEnd - gridStart) / range * 100;
          segs.push({ topPct: 0, heightPct: Math.max(0.5, h2Pct), isContinued: true });
        }
      }
      return segs;
    }

    function hexToTextColor(hex) {
      var rgb = hexToRgb(hex || '#ffde59');
      var brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
      return brightness < 150 ? '#ffffff' : '#333333';
    }

    function loadSchedules() {
      const saved = localStorage.getItem('schedules');
      if (saved) {
        try { schedules = JSON.parse(saved); } catch (e) { schedules = []; }
      } else {
        schedules = [];
      }

      const savedItems = localStorage.getItem('scheduleItems');
      if (savedItems) {
        try { scheduleItems = JSON.parse(savedItems); } catch (e) { scheduleItems = []; }
      } else {
        scheduleItems = [];
      }

      // 마이그레이션: isPrimary → isLiked, 누락된 필드 채우기
      let needsSave = false;
      schedules.forEach(function(s) {
        if (typeof s.isLiked === 'undefined') {
          s.isLiked = !!s.isPrimary;
          needsSave = true;
        }
        if (typeof s.isPrimary !== 'undefined') {
          delete s.isPrimary;
          needsSave = true;
        }
        if (!s.emoji) {
          s.emoji = getRandomEmoji();
          needsSave = true;
        }
        if (typeof s.description === 'undefined') {
          s.description = '';
          needsSave = true;
        }
      });
      if (needsSave) saveSchedules();
    }

    function saveSchedules() {
      localStorage.setItem('schedules', JSON.stringify(schedules));
      localStorage.setItem('scheduleItems', JSON.stringify(scheduleItems));
      GS.syncSheets(['시간표', '시간표_일정']);
    }

    // ========================================
    // 16단계 — Google Sheets 연동
    // ========================================
    // ── Google Sheets 연동 (GS 객체) ──
    var GS = (function() {
      var _token = null;
      var _tokenExpiry = 0;
      var _tokenClient = null;
      var _syncing = false;
      var BASE = 'https://sheets.googleapis.com/v4/spreadsheets/' + AUTH.SHEET_ID;

      var SHEETS_DEF = {
        '시간표':    ['id','emoji','title','description','tags','isLiked','gridStartMin','createdAt','updatedAt'],
        '시간표_일정': ['id','scheduleId','activityId','weekdays','startTime','endTime','createdAt'],
        '카테고리':  ['id','emoji','name','active','createdAt'],
        '일상종류':  ['id','categoryId','emoji','name','color','active','createdAt'],
        '사용자설정': ['key','value']
      };

      function colLetter(n) {
        var s = '';
        while (n > 0) { var r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26); }
        return s;
      }

      function _isConnected() { return !!_token && Date.now() < _tokenExpiry; }

      function _silentReauth() {
        return new Promise(function(resolve) {
          if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) { resolve(false); return; }
          var hint = (currentUser && currentUser.email) ? currentUser.email : '';
          if (!_tokenClient) {
            _tokenClient = google.accounts.oauth2.initTokenClient({
              client_id: AUTH.GOOGLE_CLIENT_ID,
              scope: 'https://www.googleapis.com/auth/spreadsheets',
              hint: hint,
              callback: function() {}
            });
          }
          _tokenClient.callback = function(resp) {
            if (resp.error) { resolve(false); return; }
            _saveTokenCache(resp.access_token, resp.expires_in);
            resolve(true);
          };
          _tokenClient.requestAccessToken({ prompt: '', login_hint: hint });
        });
      }

      function _saveTokenCache(token, expiresIn) {
        _token = token;
        _tokenExpiry = Date.now() + ((expiresIn || 3600) - 60) * 1000;
        try { sessionStorage.setItem('_gs_tok', JSON.stringify({t: _token, e: _tokenExpiry})); } catch(e) {}
      }

      function _loadTokenCache() {
        try {
          var c = JSON.parse(sessionStorage.getItem('_gs_tok') || 'null');
          if (c && c.t && c.e && Date.now() < c.e) { _token = c.t; _tokenExpiry = c.e; return true; }
        } catch(e) {}
        return false;
      }

      function _clearTokenCache() {
        _token = null; _tokenExpiry = 0;
        try { sessionStorage.removeItem('_gs_tok'); } catch(e) {}
      }

      function _updateUI(state, msg) {
        var dot = document.getElementById('gs-dot');
        var lbl = document.getElementById('gs-label');
        var btnConn = document.getElementById('gs-action-connect');
        var btnDisc = document.getElementById('gs-action-disconnect');
        if (!dot) return;
        dot.className = 'gs-dot' + (state ? ' ' + state : '');
        if (lbl) lbl.textContent = msg || ({ ok: 'Sheets 연결됨', err: '재연결 필요', sync: '저장 중...' }[state] || 'Sheets 미연결');
        if (state === 'ok') {
          if (btnConn) btnConn.style.display = 'none';
          if (btnDisc) btnDisc.style.display = '';
        } else if (state === 'sync') {
          if (btnConn) btnConn.style.display = 'none';
          if (btnDisc) btnDisc.style.display = 'none';
        } else {
          if (btnConn) btnConn.style.display = '';
          if (btnDisc) btnDisc.style.display = 'none';
        }
      }

      async function _api(method, path, body) {
        if (!_token) return null;
        try {
          var opts = { method: method, headers: { 'Authorization': 'Bearer ' + _token, 'Content-Type': 'application/json' } };
          if (body !== undefined) opts.body = JSON.stringify(body);
          var r = await fetch(BASE + path, opts);
          if (r.status === 401) {
            _clearTokenCache();
            _updateUI('err', '재연결 필요');
            showToast('Sheets 토큰 만료. 재연결해주세요', 'warning');
            return null;
          }
          var json = await r.json();
          if (json && json.error) { console.warn('[GS] API 오류:', json.error.message); }
          return json;
        } catch (e) { console.warn('[GS] 요청 실패:', e); return null; }
      }

      async function _ensureTabs() {
        var meta = await _api('GET', '?fields=sheets.properties.title');
        if (!meta || !meta.sheets) return false;
        var existing = meta.sheets.map(function(s) { return s.properties.title; });
        var toCreate = Object.keys(SHEETS_DEF).filter(function(n) { return existing.indexOf(n) < 0; });
        if (toCreate.length > 0) {
          await _api('POST', ':batchUpdate', { requests: toCreate.map(function(n) { return { addSheet: { properties: { title: n } } }; }) });
        }
        for (var name in SHEETS_DEF) {
          var cols = SHEETS_DEF[name];
          await _api('PUT', '/values/' + encodeURIComponent(name + '!A1:' + colLetter(cols.length) + '1') + '?valueInputOption=RAW', { values: [cols] });
        }
        return true;
      }

      function _getRows(name) {
        switch (name) {
          case '시간표':
            return schedules.map(function(s) {
              return [s.id, s.emoji||'', s.title||'', s.description||'', (s.tags||[]).join(','), s.isLiked?'TRUE':'FALSE', String(getScheduleGridStartMin(s)), s.createdAt||'', s.updatedAt||''];
            });
          case '시간표_일정':
            return scheduleItems.map(function(i) {
              return [i.id, i.scheduleId, i.activityId, (i.weekdays||[]).join(','), i.startTime||'', i.endTime||'', i.createdAt||''];
            });
          case '카테고리':
            return categories.map(function(c) {
              return [c.id, c.emoji||'', c.name||'', c.active!==false?'TRUE':'FALSE', c.createdAt||''];
            });
          case '일상종류':
            return activities.map(function(a) {
              return [a.id, a.categoryId||'', a.emoji||'', a.name||'', a.color||'#ffde59', a.active!==false?'TRUE':'FALSE', a.createdAt||''];
            });
          case '사용자설정':
            var pairs = [
              ['profileQuote', profileQuote || ''],
              ['designSettings', JSON.stringify(designSettings || {})],
              ['myEmojis', JSON.stringify(myEmojis || [])],
              ['menus', JSON.stringify(menus || [])],
              ['tagColorOverrides', JSON.stringify(tagColorOverrides || {})]
            ];
            if (profilePhoto && profilePhoto.length < 45000) pairs.push(['profilePhoto', profilePhoto]);
            return pairs;
          default: return [];
        }
      }

      async function _writeSheet(name) {
        var cols = SHEETS_DEF[name];
        var rows = [cols].concat(_getRows(name));
        await _api('POST', '/values/' + encodeURIComponent(name) + ':clear', {});
        await _api('PUT', '/values/' + encodeURIComponent(name + '!A1') + '?valueInputOption=RAW', { values: rows });
      }

      async function _loadAll() {
        _updateUI('sync', '불러오는 중...');
        var ok = await _ensureTabs();
        if (!ok) { _updateUI('err', '재연결 필요'); return false; }

        var results = {};
        for (var name in SHEETS_DEF) {
          var cols = SHEETS_DEF[name];
          var resp = await _api('GET', '/values/' + encodeURIComponent(name + '!A:' + colLetter(cols.length)));
          results[name] = ((resp && resp.values) || []).slice(1).filter(function(r) { return r && r[0]; });
        }

        // 시간표
        if (results['시간표'].length > 0) {
          schedules = results['시간표'].map(function(r) {
            var rawGsm = parseInt(r[6], 10);
            var gsm;
            var createdAt, updatedAt;
            // 기존 시트(컬럼 8개) 하위 호환 — r[6]이 숫자가 아니면 createdAt로 간주
            if (isNaN(rawGsm)) {
              gsm = 360;
              createdAt = r[6] || today();
              updatedAt = r[7] || today();
            } else {
              // 0~23: 구 gridStartHour 값 (시) → 분으로 변환
              // 24~1439: 신 gridStartMin 값 (분)
              if (rawGsm >= 0 && rawGsm <= 23) gsm = rawGsm * 60;
              else if (rawGsm >= 24 && rawGsm < 1440) gsm = Math.round(rawGsm / 30) * 30;
              else gsm = 360;
              createdAt = r[7] || today();
              updatedAt = r[8] || today();
            }
            return { id:r[0], emoji:r[1]||'📅', title:r[2]||'', description:r[3]||'', tags:r[4]?r[4].split(',').filter(Boolean):[], isLiked:r[5]==='TRUE', gridStartMin:gsm, createdAt:createdAt, updatedAt:updatedAt };
          });
          scheduleItems = results['시간표_일정'].map(function(r) {
            return { id:r[0], scheduleId:r[1], activityId:r[2], weekdays:r[3]?r[3].split(',').filter(Boolean):[], startTime:r[4]||'09:00', endTime:r[5]||'10:00', createdAt:r[6]||today() };
          });
          localStorage.setItem('schedules', JSON.stringify(schedules));
          localStorage.setItem('scheduleItems', JSON.stringify(scheduleItems));
        } else { await _writeSheet('시간표'); await _writeSheet('시간표_일정'); }

        // 카테고리
        if (results['카테고리'].length > 0) {
          categories = results['카테고리'].map(function(r) {
            return { id:r[0], emoji:r[1]||'', name:r[2]||'', active:r[3]!=='FALSE', createdAt:r[4]||today() };
          });
          localStorage.setItem('categories', JSON.stringify(categories));
        } else { await _writeSheet('카테고리'); }

        // 일상종류
        if (results['일상종류'].length > 0) {
          activities = results['일상종류'].map(function(r) {
            return { id:r[0], categoryId:r[1]||'', emoji:r[2]||'', name:r[3]||'', color:r[4]||'#ffde59', active:r[5]!=='FALSE', createdAt:r[6]||today() };
          });
          localStorage.setItem('activities', JSON.stringify(activities));
        } else { await _writeSheet('일상종류'); }

        // 사용자설정
        if (results['사용자설정'].length > 0) {
          var sm = {};
          results['사용자설정'].forEach(function(r) { sm[r[0]] = r[1] || ''; });
          if (sm['profileQuote'] !== undefined) { profileQuote = sm['profileQuote']; localStorage.setItem('profileQuote', profileQuote); }
          if (sm['designSettings']) {
            try { designSettings = Object.assign({}, DESIGN_DEFAULTS, JSON.parse(sm['designSettings'])); localStorage.setItem('designSettings', JSON.stringify(designSettings)); applyDesignSettings(); } catch(e) {}
          }
          if (sm['myEmojis']) { try { myEmojis = JSON.parse(sm['myEmojis']); localStorage.setItem('myEmojis', JSON.stringify(myEmojis)); } catch(e) { myEmojis = []; } }
          if (sm['menus']) { try { menus = JSON.parse(sm['menus']); localStorage.setItem('menus', JSON.stringify(menus)); renderSidebar(); } catch(e) {} }
          if (sm['profilePhoto']) { profilePhoto = sm['profilePhoto']; localStorage.setItem('profilePhoto', profilePhoto); }
          if (sm['tagColorOverrides']) { try { tagColorOverrides = JSON.parse(sm['tagColorOverrides']); localStorage.setItem('tagColorOverrides', JSON.stringify(tagColorOverrides)); } catch(e) { tagColorOverrides = {}; } }
        } else { await _writeSheet('사용자설정'); }

        console.log('[GS] ✅ 전체 로드 완료');
        _updateUI('ok', '연결됨');
        return true;
      }

      // 공개 API
      return {
        isConnected: function() { return _isConnected(); },
        updateUI: _updateUI,

        syncSheets: async function(names) {
          if (!_isConnected()) {
            _updateUI('sync', '재연결 중...');
            var reAuthed = await _silentReauth();
            if (!reAuthed) {
              _updateUI('err', '재연결 필요');
              showToast('⚠️ Sheets 연결 만료 — 로컬에 저장됨. 사이드바 연결 버튼을 눌러주세요', 'warning');
              return;
            }
            _updateUI('ok', '연결됨');
          }
          if (_syncing) return;
          _syncing = true;
          _updateUI('sync', '저장 중...');
          try {
            for (var i = 0; i < names.length; i++) { await _writeSheet(names[i]); }
            _updateUI('ok', '연결됨');
          } catch (e) {
            console.error('[GS] sync 오류:', e);
            showToast('Sheets 동기화 실패: ' + e.message, 'error');
            _updateUI('ok', '연결됨 (동기화 오류)');
          } finally { _syncing = false; }
        },

        init: function(onDone) {
          // 1. 캐시 토큰 유효 → 즉시 UI 업데이트 후 onDone 호출
          if (_loadTokenCache()) {
            console.log('[GS] ✅ 캐시 토큰 사용');
            _updateUI('ok', 'Sheets 연결됨');
            if (onDone) onDone(true);
            return;
          }

          // 2. 캐시 없음 → silent auth (팝업 없음)
          if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
            _updateUI('err', 'Google 라이브러리 없음'); if (onDone) onDone(false); return;
          }
          var hint = (currentUser && currentUser.email) ? currentUser.email : '';
          _tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: AUTH.GOOGLE_CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/spreadsheets',
            hint: hint,
            callback: function(resp) {
              if (resp.error) { _updateUI('err'); if (onDone) onDone(false); return; }
              _saveTokenCache(resp.access_token, resp.expires_in);
              _updateUI('ok', 'Sheets 연결됨');
              console.log('[GS] ✅ 토큰 획득 (silent)');
              if (onDone) onDone(true);
            }
          });
          _tokenClient.requestAccessToken({ prompt: '', login_hint: hint });
        },

        connect: function() {
          // 연결 버튼 클릭 → silent 먼저 시도 (경고창 없음), 실패 시 consent로 재시도
          _updateUI('sync', '연결 중...');
          if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
            _updateUI('err'); return;
          }
          var hint = (currentUser && currentUser.email) ? currentUser.email : '';
          var _doConnect = function(prompt) {
            if (!_tokenClient) {
              _tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: AUTH.GOOGLE_CLIENT_ID,
                scope: 'https://www.googleapis.com/auth/spreadsheets',
                hint: hint,
                callback: function() {}
              });
            }
            _tokenClient.callback = function(resp) {
              if (resp.error) {
                if (prompt === '' ) {
                  // silent 실패 → consent로 재시도 (이미 동의한 경우에도 팝업 필요할 수 있음)
                  _doConnect('consent');
                } else {
                  _updateUI('err'); showToast('Sheets 연결 실패: ' + resp.error, 'error');
                }
                return;
              }
              _saveTokenCache(resp.access_token, resp.expires_in);
              _updateUI('ok', 'Sheets 연결됨');
              GS.loadAll().then(function() { showToast('☁️ Sheets 연결됨'); });
            };
            _tokenClient.requestAccessToken({ prompt: prompt, login_hint: hint });
          };
          _doConnect('');
        },

        disconnect: function(silent) {
          if (!silent && !confirm('Sheets 연결을 해제할까요?\n(데이터는 로컬에 유지됩니다)')) return;
          _clearTokenCache();
          if (!silent) { _updateUI('', '미연결'); showToast('Sheets 연결 해제됨', 'warning'); }
        },

        loadAll: function() { return _loadAll(); }
      };
    })();

    // 경량 토스트 알림
    var _toastTimer = null;
    function showToast(msg, type) {
      var el = document.getElementById('gs-toast');
      if (!el) return;
      if (_toastTimer) clearTimeout(_toastTimer);
      el.textContent = msg;
      el.className = type ? type : '';
      el.classList.add('show');
      _toastTimer = setTimeout(function() { el.classList.remove('show'); }, 3000);
    }

    function addSchedule() {
      const nextNumber = schedules.length + 1;
      const newSchedule = {
        id: generateId(),
        title: '새 시간표 ' + nextNumber,
        emoji: getRandomEmoji(),
        description: '',
        tags: [],
        isLiked: false,
        gridStartMin: 360,
        createdAt: today(),
        updatedAt: today()
      };
      schedules.push(newSchedule);
      saveSchedules();
      renderCurrentScheduleView();
      showToast('✅ 시간표가 추가되었습니다');
    }

    function updateScheduleTitle(scheduleId, title) {
      const s = schedules.find(function(x) { return x.id === scheduleId; });
      if (s) {
        s.title = title;
        s.updatedAt = today();
        saveSchedules();
      }
    }

    function updateScheduleDescription(scheduleId, desc) {
      const s = schedules.find(function(x) { return x.id === scheduleId; });
      if (s) {
        s.description = desc;
        s.updatedAt = today();
        saveSchedules();
      }
    }

    function updateScheduleEmoji(scheduleId, emoji) {
      const s = schedules.find(function(x) { return x.id === scheduleId; });
      if (s) {
        s.emoji = emoji;
        s.updatedAt = today();
        saveSchedules();
        renderCurrentScheduleView();
      }
    }

    function getSortedFilteredSchedules() {
      let result = schedules.slice();

      // 검색 필터
      if (scheduleSearchQuery) {
        const q = scheduleSearchQuery.toLowerCase();
        result = result.filter(function(s) {
          const title = (s.title || '').toLowerCase();
          const desc = (s.description || '').toLowerCase();
          const tagMatch = (s.tags || []).some(function(t) { return t.toLowerCase().indexOf(q) >= 0; });
          return title.indexOf(q) >= 0 || desc.indexOf(q) >= 0 || tagMatch;
        });
      }

      // 좋아요 필터
      if (scheduleFilterLiked === 'liked') {
        result = result.filter(function(s) { return s.isLiked; });
      } else if (scheduleFilterLiked === 'unliked') {
        result = result.filter(function(s) { return !s.isLiked; });
      }

      // 태그 필터 (모든 선택 태그를 포함해야 통과 = AND)
      if (scheduleFilterTags.length > 0) {
        result = result.filter(function(s) {
          var schTags = s.tags || [];
          return scheduleFilterTags.every(function(t) { return schTags.indexOf(t) >= 0; });
        });
      }

      // 정렬
      result.sort(function(a, b) {
        var va, vb;
        if (scheduleSortKey === 'title') {
          va = (a.title || '').toLowerCase();
          vb = (b.title || '').toLowerCase();
        } else if (scheduleSortKey === 'isLiked') {
          va = a.isLiked ? 1 : 0;
          vb = b.isLiked ? 1 : 0;
        } else {
          va = a.updatedAt || a.createdAt || '';
          vb = b.updatedAt || b.createdAt || '';
        }
        if (va < vb) return scheduleSortDir === 'asc' ? -1 : 1;
        if (va > vb) return scheduleSortDir === 'asc' ? 1 : -1;
        return 0;
      });

      return result;
    }

    function handleScheduleSearch(query) {
      scheduleSearchQuery = query || '';
      scheduleHeroIndex = 0;
      scheduleListPage = 1;
      renderCurrentScheduleView();
    }

    function renderScheduleTagFilter() {
      var el = document.getElementById('scheduleTagFilter');
      var toggleBtn = document.getElementById('scheduleTagFilterBtn');
      var countEl = document.getElementById('scheduleTagFilterCount');
      if (!el) return;
      var tagSet = {};
      schedules.forEach(function(s) {
        (s.tags || []).forEach(function(t) {
          if (t) tagSet[t] = (tagSet[t] || 0) + 1;
        });
      });
      var allTags = Object.keys(tagSet).sort(function(a, b) { return a.localeCompare(b, 'ko'); });
      // 선택돼 있지만 존재하지 않는 태그 정리
      scheduleFilterTags = scheduleFilterTags.filter(function(t) { return allTags.indexOf(t) >= 0; });

      // 토글 버튼 표시/숨김
      if (toggleBtn) {
        toggleBtn.style.display = allTags.length > 0 ? '' : 'none';
        toggleBtn.classList.toggle('has-active', scheduleFilterTags.length > 0);
        if (countEl) {
          if (scheduleFilterTags.length > 0) {
            countEl.textContent = scheduleFilterTags.length;
            countEl.style.display = '';
          } else {
            countEl.style.display = 'none';
          }
        }
      }

      if (allTags.length === 0) {
        el.classList.remove('open');
        el.innerHTML = '';
        return;
      }

      // 패널 내용 렌더
      var html = '';
      allTags.forEach(function(t) {
        var active = scheduleFilterTags.indexOf(t) >= 0;
        var p = getTagPaletteEntry(t);
        var inactiveStyle = 'background:' + p.bg + ';color:' + p.fg + ';';
        html += '<button class="schedule-tag-filter-chip' + (active ? ' active' : '') + '" data-tag="' + escapeHtml(t) + '" style="' + (active ? '' : inactiveStyle) + '">' + escapeHtml(t) + ' <span style="opacity:0.55;">(' + tagSet[t] + ')</span></button>';
      });
      if (scheduleFilterTags.length > 0) {
        html += '<button class="schedule-tag-filter-clear" onclick="clearScheduleTagFilter()">전체 해제</button>';
      }
      el.innerHTML = html;
      // 클릭 위임
      el.querySelectorAll('.schedule-tag-filter-chip').forEach(function(btn) {
        btn.addEventListener('click', function() {
          toggleScheduleTagFilter(btn.getAttribute('data-tag'));
        });
      });
    }

    function toggleScheduleTagPanel() {
      var el = document.getElementById('scheduleTagFilter');
      if (!el) return;
      el.classList.toggle('open');
    }

    function toggleScheduleTagFilter(tag) {
      if (!tag) return;
      var idx = scheduleFilterTags.indexOf(tag);
      if (idx >= 0) scheduleFilterTags.splice(idx, 1);
      else scheduleFilterTags.push(tag);
      scheduleListPage = 1;
      scheduleHeroIndex = 0;
      renderCurrentScheduleView();
    }

    function clearScheduleTagFilter() {
      scheduleFilterTags = [];
      scheduleListPage = 1;
      scheduleHeroIndex = 0;
      renderCurrentScheduleView();
    }

    function renderCurrentScheduleView() {
      renderScheduleTagFilter();
      if (scheduleViewMode === 'list') {
        renderScheduleList();
      } else {
        renderScheduleThumbnails();
      }
    }

    function scrollHeroTo(i) {
      const el = document.getElementById('scheduleHeroScroll');
      if (!el) return;
      const target = el.children[i];
      if (!target) return;
      el.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
    }

    function updateHeroIndicators() {
      const indicators = document.querySelectorAll('.hero-indicator');
      indicators.forEach(function(ind, i) {
        ind.classList.toggle('active', i === scheduleHeroIndex);
      });
    }

    // 드래그 스크롤 + fade 힌트 동기화
    function attachDragScroll(el) {
      if (!el || el._dragAttached) return;
      el._dragAttached = true;

      let isDown = false, startX = 0, scrollStart = 0, moved = false;

      const onDown = function(e) {
        isDown = true;
        moved = false;
        startX = e.pageX;
        scrollStart = el.scrollLeft;
        el.classList.add('dragging');
      };
      const onMove = function(e) {
        if (!isDown) return;
        const dx = e.pageX - startX;
        if (Math.abs(dx) > 5) moved = true;
        if (moved) {
          e.preventDefault();
          el.scrollLeft = scrollStart - dx;
        }
      };
      const onUp = function() {
        if (!isDown) return;
        isDown = false;
        el.classList.remove('dragging');
      };

      el.addEventListener('mousedown', onDown);
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseup', onUp);
      el.addEventListener('mouseleave', onUp);
      // 드래그 직후 click 이벤트(카드 클릭) 억제
      el.addEventListener('click', function(e) {
        if (moved) {
          e.stopPropagation();
          e.preventDefault();
          moved = false;
        }
      }, true);
    }

    function updateScrollHintState(scrollEl) {
      const wrap = scrollEl.closest('.schedule-scroll-wrap');
      if (!wrap) return;
      const atStart = scrollEl.scrollLeft <= 2;
      const atEnd = scrollEl.scrollLeft + scrollEl.clientWidth >= scrollEl.scrollWidth - 2;
      wrap.dataset.scrollStart = atStart ? 'true' : 'false';
      wrap.dataset.scrollEnd = atEnd ? 'true' : 'false';
    }

    function toggleScheduleSelect(scheduleId) {
      const idx = selectedScheduleIds.indexOf(scheduleId);
      if (idx >= 0) selectedScheduleIds.splice(idx, 1);
      else selectedScheduleIds.push(scheduleId);
      updateScheduleBulkBar();
    }

    function clearScheduleSelection() {
      selectedScheduleIds = [];
      renderCurrentScheduleView();
    }

    function toggleSelectAllSchedules(checked) {
      if (checked) {
        const filtered = getSortedFilteredSchedules();
        selectedScheduleIds = filtered.map(function(s) { return s.id; });
      } else {
        selectedScheduleIds = [];
      }
      renderCurrentScheduleView();
    }

    function syncSelectAllCheckbox() {
      const chk = document.getElementById('scheduleSelectAll');
      if (!chk) return;
      const filtered = getSortedFilteredSchedules();
      if (filtered.length === 0) {
        chk.checked = false;
        chk.indeterminate = false;
        return;
      }
      const allSelected = filtered.every(function(s) { return selectedScheduleIds.indexOf(s.id) >= 0; });
      const anySelected = filtered.some(function(s) { return selectedScheduleIds.indexOf(s.id) >= 0; });
      chk.checked = allSelected;
      chk.indeterminate = anySelected && !allSelected;
    }

    function bulkDeleteSchedules() {
      if (selectedScheduleIds.length === 0) return;
      const count = selectedScheduleIds.length;
      showConfirm('시간표 삭제', count + '개 시간표를 삭제하시겠습니까?', function(confirmed) {
        if (!confirmed) return;
        schedules = schedules.filter(function(s) { return selectedScheduleIds.indexOf(s.id) < 0; });
        scheduleItems = scheduleItems.filter(function(i) { return selectedScheduleIds.indexOf(i.scheduleId) < 0; });
        selectedScheduleIds = [];
        saveSchedules();
        renderCurrentScheduleView();
      });
    }

    function updateScheduleBulkBar() {
      const bar = document.getElementById('scheduleBulkActions');
      const countEl = document.getElementById('scheduleBulkCount');
      if (bar && countEl) {
        if (selectedScheduleIds.length > 0) {
          bar.style.display = 'flex';
          countEl.textContent = selectedScheduleIds.length + '개 선택됨';
        } else {
          bar.style.display = 'none';
        }
      }
      syncSelectAllCheckbox();
    }

    window.addEventListener('resize', function() {
      if (document.getElementById('scheduleHeroSection')) {
        clearTimeout(window._scheduleResizeTimer);
        window._scheduleResizeTimer = setTimeout(function() {
          renderCurrentScheduleView();
        }, 150);
      }
    });

    function toggleScheduleLike(scheduleId) {
      const sch = schedules.find(function(s) { return s.id === scheduleId; });
      if (!sch) return;
      sch.isLiked = !sch.isLiked;
      sch.updatedAt = today();
      saveSchedules();
      renderCurrentScheduleView();
    }

    function deleteSchedule(scheduleId) {
      showConfirm('시간표 삭제', '이 시간표를 삭제하시겠습니까?', function(confirmed) {
        if (!confirmed) return;
        schedules = schedules.filter(function(s) { return s.id !== scheduleId; });
        scheduleItems = scheduleItems.filter(function(i) { return i.scheduleId !== scheduleId; });
        saveSchedules();
        renderCurrentScheduleView();
        showToast('🗑️ 시간표가 삭제되었습니다');
      });
    }

    function timeToMin(hhmm) {
      if (!hhmm) return 0;
      var p = hhmm.split(':');
      return parseInt(p[0]) * 60 + parseInt(p[1]);
    }
    function minToTimeStr(min) {
      // 24시간 이상도 허용 (그리드 랩어라운드 라벨용) — 표시는 0~23시로 모듈러
      var total = ((min % 1440) + 1440) % 1440;
      var h = Math.floor(total / 60), m = total % 60;
      return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
    }

    // 시간표별 그리드 시작 분(0~1410, 30분 단위), 기본 360(06:00)
    function getScheduleGridStartMin(schedule) {
      if (!schedule) return 360;
      // 새 필드 우선
      if (schedule.gridStartMin !== undefined && schedule.gridStartMin !== null && schedule.gridStartMin !== '') {
        var m = parseInt(schedule.gridStartMin, 10);
        if (!isNaN(m) && m >= 0 && m < 1440) return Math.round(m / 30) * 30;
      }
      // 구 필드(gridStartHour, 0-23) 호환
      if (schedule.gridStartHour !== undefined && schedule.gridStartHour !== null && schedule.gridStartHour !== '') {
        var h = parseInt(schedule.gridStartHour, 10);
        if (!isNaN(h) && h >= 0 && h <= 23) return h * 60;
      }
      return 360;
    }
    // 절대분(0-1439) → 가상분(gridStart 이상, gridStart+1439 이하)
    function toVirtualMin(absMin, gridStart) {
      return absMin < gridStart ? absMin + 1440 : absMin;
    }

    function openScheduleDetail(scheduleId) {
      currentDetailScheduleId = scheduleId;
      scheduleDetailTab = 'grid';
      scheduleViewMode2 = 'detail';
      scheduleDraft = null;
      // 독립 페이지로 전환 (sessionStorage는 'daily'로 유지해 새로고침 시 목록으로 복귀)
      currentPage = 'scheduleDetail';
      document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
      var dp = document.getElementById('scheduleDetailPage');
      if (dp) dp.classList.add('active');
      updateActiveMenu();
      updateMobileTopTitle();
      var mc = document.querySelector('.main-content');
      if (mc) mc.scrollTop = 0;
      renderScheduleDetail();
    }

    function enterScheduleEditMode() {
      var schedule = schedules.find(function(s) { return s.id === currentDetailScheduleId; });
      if (!schedule) return;
      scheduleViewMode2 = 'edit';
      scheduleDraft = {
        title: schedule.title,
        emoji: schedule.emoji,
        description: schedule.description || '',
        tags: (schedule.tags || []).slice(),
        gridStartMin: getScheduleGridStartMin(schedule)
      };
      renderScheduleDetail();
    }

    function saveScheduleEdit() {
      if (!scheduleDraft) return;
      var schedule = schedules.find(function(s) { return s.id === currentDetailScheduleId; });
      if (!schedule) return;
      schedule.title = (scheduleDraft.title || '').trim() || schedule.title;
      schedule.emoji = scheduleDraft.emoji;
      schedule.description = scheduleDraft.description || '';
      schedule.tags = scheduleDraft.tags || [];
      schedule.gridStartMin = getScheduleGridStartMin(scheduleDraft);
      delete schedule.gridStartHour; // 구 필드 정리
      schedule.updatedAt = today();
      saveSchedules();
      scheduleViewMode2 = 'detail';
      scheduleDraft = null;
      renderScheduleDetail();
      renderCurrentScheduleView();
      showToast('✅ 시간표가 저장되었습니다');
    }

    function cancelScheduleEdit() {
      scheduleViewMode2 = 'detail';
      scheduleDraft = null;
      renderScheduleDetail();
    }

    function deleteCurrentSchedule() {
      var schedule = schedules.find(function(s) { return s.id === currentDetailScheduleId; });
      if (!schedule) return;
      showConfirm('시간표 삭제', '이 시간표와 포함된 모든 일정을 삭제하시겠습니까?', function(confirmed) {
        if (!confirmed) return;
        var sid = schedule.id;
        schedules = schedules.filter(function(s) { return s.id !== sid; });
        scheduleItems = scheduleItems.filter(function(i) { return i.scheduleId !== sid; });
        selectedScheduleIds = selectedScheduleIds.filter(function(id) { return id !== sid; });
        saveSchedules();
        closeScheduleDetail();
        renderCurrentScheduleView();
      });
    }

    function updateDraftTitle(v) { if (scheduleDraft) scheduleDraft.title = v; }
    function updateDraftDesc(v) { if (scheduleDraft) scheduleDraft.description = v; }
    function updateDraftGridStartMin(v) {
      if (!scheduleDraft) return;
      var m = parseInt(v, 10);
      if (isNaN(m) || m < 0 || m >= 1440) m = 360;
      scheduleDraft.gridStartMin = Math.round(m / 30) * 30;
      // 그리드 탭에 있을 때만 즉시 렌더 갱신
      if (scheduleDetailTab === 'grid') renderScheduleGrid();
      else if (scheduleDetailTab === 'day') renderScheduleDayView();
    }

    function getAllScheduleTags() {
      var tagSet = {};
      schedules.forEach(function(s) {
        (s.tags || []).forEach(function(t) { if (t) tagSet[t] = true; });
      });
      return Object.keys(tagSet).sort(function(a, b) { return a.localeCompare(b, 'ko'); });
    }

    function renderDraftTagChips() {
      var container = document.getElementById('draftTagsContainer');
      if (!container || !scheduleDraft) return;
      var html = '';
      (scheduleDraft.tags || []).forEach(function(t, i) {
        var p = getTagPaletteEntry(t);
        html += '<span class="draft-tag-chip" style="background:' + p.bg + ';color:' + p.fg + ';">';
        html += '<span class="draft-tag-chip-text" onclick="openTagEdit(' + i + ')" title="클릭하여 이름/색상 변경">' + escapeHtml(t) + '</span>';
        html += '<button class="draft-tag-chip-remove" onclick="removeDraftTag(' + i + ')" title="삭제" style="color:' + p.fg + ';">×</button></span>';
        // 해당 태그 편집 패널
        if (editingTagIdx === i) {
          var curPaletteIdx = tagColorOverrides.hasOwnProperty(t) ? tagColorOverrides[t] : hashTagIndex(t);
          html += '<div class="tag-edit-panel">';
          html += '<div class="tag-edit-row"><label>이름</label><input type="text" id="tagEditInput" value="' + escapeHtml(t) + '" placeholder="태그 이름" onkeyup="if(event.key===&apos;Enter&apos;)applyTagEdit(' + i + ');else if(event.key===&apos;Escape&apos;)closeTagEdit()"></div>';
          html += '<div class="tag-edit-row"><label>색상</label><div class="tag-color-swatches">';
          TAG_PALETTE.forEach(function(pal, pi) {
            html += '<span class="tag-color-swatch' + (editingTagColorIdx >= 0 ? (editingTagColorIdx === pi ? ' active' : '') : (curPaletteIdx === pi ? ' active' : '')) + '" style="background:' + pal.bg + ';outline-color:' + pal.fg + ';" onclick="setTagEditColor(' + pi + ')" title="' + pal.name + '"></span>';
          });
          html += '</div></div>';
          html += '<div class="tag-edit-row tag-edit-actions"><button class="btn-confirm" onclick="applyTagEdit(' + i + ')">저장</button><button class="btn-cancel" onclick="closeTagEdit()">취소</button></div>';
          html += '</div>';
        }
      });
      container.innerHTML = html;
      // 편집 패널이 열렸을 때 인풋에 포커스
      if (editingTagIdx !== null) {
        var inp = document.getElementById('tagEditInput');
        if (inp) { inp.focus(); inp.select(); }
      }
    }

    function openTagEdit(idx) {
      editingTagIdx = idx;
      editingTagColorIdx = -1;
      renderDraftTagChips();
    }
    function closeTagEdit() {
      editingTagIdx = null;
      editingTagColorIdx = -1;
      renderDraftTagChips();
    }
    function setTagEditColor(colorIdx) {
      editingTagColorIdx = colorIdx;
      // 스와치 active 상태만 갱신 (re-render 없이)
      document.querySelectorAll('.tag-color-swatch').forEach(function(sw, i) {
        sw.classList.toggle('active', i === colorIdx);
      });
    }
    function applyTagEdit(idx) {
      if (!scheduleDraft || !scheduleDraft.tags) return;
      var oldText = scheduleDraft.tags[idx];
      var inp = document.getElementById('tagEditInput');
      var newText = (inp ? inp.value : oldText).trim();
      if (!newText) { closeTagEdit(); return; }

      var colorIdx = editingTagColorIdx >= 0 ? editingTagColorIdx : (tagColorOverrides.hasOwnProperty(oldText) ? tagColorOverrides[oldText] : -1);

      if (oldText !== newText) {
        delete tagColorOverrides[oldText];
        // 이름 변경을 모든 시간표에 전파
        schedules.forEach(function(sch) {
          if (!sch.tags || !sch.tags.length) return;
          var i = sch.tags.indexOf(oldText);
          if (i >= 0) {
            if (sch.tags.indexOf(newText) >= 0) {
              // 이미 새 이름이 있으면 중복 방지 — 기존 제거만
              sch.tags.splice(i, 1);
            } else {
              sch.tags[i] = newText;
            }
          }
        });
        scheduleDraft.tags[idx] = newText;
        saveSchedules();
      }
      if (colorIdx >= 0) {
        tagColorOverrides[newText] = colorIdx;
      } else if (newText === oldText) {
        delete tagColorOverrides[newText];
      }
      saveTagColorOverrides();
      editingTagIdx = null;
      editingTagColorIdx = -1;
      renderDraftTagChips();
      showToast('✅ 태그가 수정되었습니다');
    }

    function addDraftTag(tag) {
      if (!scheduleDraft || !tag) return;
      tag = tag.trim();
      if (!tag || (scheduleDraft.tags || []).indexOf(tag) >= 0) return;
      if (!scheduleDraft.tags) scheduleDraft.tags = [];
      scheduleDraft.tags.push(tag);
      var input = document.getElementById('draftTagInput');
      if (input) input.value = '';
      var sugg = document.getElementById('tagSuggestions');
      if (sugg) sugg.style.display = 'none';
      renderDraftTagChips();
    }

    function removeDraftTag(idx) {
      if (!scheduleDraft) return;
      scheduleDraft.tags.splice(idx, 1);
      renderDraftTagChips();
    }

    function onDraftTagInput(val) {
      val = (val || '').trim();
      var sugg = document.getElementById('tagSuggestions');
      if (!sugg) return;
      if (!val) { sugg.style.display = 'none'; return; }
      var existing = getAllScheduleTags();
      var current = scheduleDraft ? (scheduleDraft.tags || []) : [];
      var filtered = existing.filter(function(t) {
        return t.toLowerCase().indexOf(val.toLowerCase()) >= 0 && current.indexOf(t) < 0;
      });
      if (filtered.length === 0) { sugg.style.display = 'none'; return; }
      sugg.innerHTML = filtered.map(function(t) {
        var p2 = getTagPaletteEntry(t);
        return '<div class="tag-suggestion-item" onclick="addDraftTag(&apos;' + escapeHtml(t) + '&apos;)"><span class="sched-tag-chip" style="background:' + p2.bg + ';color:' + p2.fg + ';">' + escapeHtml(t) + '</span></div>';
      }).join('');
      sugg.style.display = 'block';
    }

    function onDraftTagKeydown(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var input = document.getElementById('draftTagInput');
        if (input && input.value.trim()) addDraftTag(input.value);
      } else if (e.key === 'Escape') {
        var sugg = document.getElementById('tagSuggestions');
        if (sugg) sugg.style.display = 'none';
      }
    }

    function closeScheduleDetail() {
      currentDetailScheduleId = null;
      scheduleDraft = null;
      scheduleViewMode2 = 'detail';
      navigateTo('daily');
    }

    function renderScheduleDetail() {
      var schedule = schedules.find(function(s) { return s.id === currentDetailScheduleId; });
      if (!schedule) return;
      var isEdit = (scheduleViewMode2 === 'edit');
      var data = isEdit && scheduleDraft ? scheduleDraft : schedule;

      document.getElementById('detailScheduleEmoji').innerHTML = renderEmoji(data.emoji);
      document.getElementById('detailScheduleTitle').textContent = isEdit ? '시간표 수정' : data.title;

      // 액션 버튼
      var actionsEl = document.getElementById('detailActionButtons');
      if (isEdit) {
        actionsEl.innerHTML =
          '<button class="btn-cancel" onclick="cancelScheduleEdit()">취소</button>' +
          '<button class="btn-confirm" onclick="saveScheduleEdit()">저장</button>';
      } else {
        actionsEl.innerHTML =
          '<button class="btn-icon" onclick="closeScheduleDetail()">목록</button>' +
          '<button class="btn-icon" onclick="enterScheduleEditMode()">수정</button>' +
          '<button class="btn-icon btn-danger" onclick="deleteCurrentSchedule()">삭제</button>';
      }

      // 메타 영역 (이름/설명/태그) — 읽기 모드는 박스 없이, 내용 있을 때만 표시
      var metaEl = document.getElementById('detailMetaCard');
      if (isEdit) {
        var tagsStr = (data.tags || []).join(', ');
        var mh = '';
        mh += '<div class="sched-meta-label">이름</div>';
        mh += '<input type="text" value="' + (data.title || '').replace(/"/g,'&quot;') + '" placeholder="시간표 이름" oninput="updateDraftTitle(this.value)" style="margin-bottom:10px;">';
        mh += '<div class="sched-meta-label">상세 설명</div>';
        mh += '<textarea placeholder="상세 설명 (선택)" oninput="updateDraftDesc(this.value)" style="margin-bottom:10px;">' + (data.description || '') + '</textarea>';
        mh += '<div class="sched-meta-label">태그</div>';
        mh += '<div id="draftTagsContainer" class="draft-tags-container"></div>';
        mh += '<div class="tag-input-wrap">';
        mh += '<input type="text" id="draftTagInput" placeholder="태그 입력 후 Enter..." autocomplete="off" oninput="onDraftTagInput(this.value)" onkeyup="onDraftTagKeydown(event)">';
        mh += '<div id="tagSuggestions" class="tag-suggestions" style="display:none;"></div>';
        mh += '</div>';
        mh += '<div class="sched-meta-label" style="margin-top:10px;">그리드 시작 시각</div>';
        var curStartMin = getScheduleGridStartMin(data);
        mh += '<select onchange="updateDraftGridStartMin(this.value)">';
        for (var sm = 0; sm < 1440; sm += 30) {
          var hh = Math.floor(sm / 60), mm = sm % 60;
          var smLabel = (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm;
          mh += '<option value="' + sm + '"' + (sm === curStartMin ? ' selected' : '') + '>' + smLabel + '</option>';
        }
        mh += '</select>';
        mh += '<div class="sched-meta-hint">선택한 시각부터 24시간 그리드가 시작됩니다.</div>';
        metaEl.className = 'sched-meta-card';
        metaEl.innerHTML = mh;
        metaEl.style.display = 'block';
        renderDraftTagChips();
      } else {
        var mh = '';
        if (data.description) {
          mh += '<div class="sched-detail-desc-text">' + escapeHtml(data.description) + '</div>';
        }
        if (data.tags && data.tags.length) {
          mh += '<div class="sched-detail-tags-row">';
          data.tags.forEach(function(t) { mh += renderTagChip(t); });
          mh += '</div>';
        }
        metaEl.className = 'sched-detail-meta-plain';
        metaEl.innerHTML = mh;
        metaEl.style.display = mh ? 'block' : 'none';
      }

      // 탭
      document.querySelectorAll('#scheduleDetailTabNav .tab-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.tab === scheduleDetailTab);
      });
      document.querySelectorAll('#scheduleDetailPage .sched-tab-content').forEach(function(el) {
        el.style.display = (el.dataset.tab === scheduleDetailTab) ? 'block' : 'none';
      });
      if (scheduleDetailTab === 'grid') renderScheduleGrid();
      else if (scheduleDetailTab === 'day') renderScheduleDayView();
      else renderScheduleDetailItemList();
    }

    function switchScheduleDetailTab(tab) {
      scheduleDetailTab = tab;
      if (tab === 'day') {
        var dayMap = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
        scheduleDayViewDay = dayMap[new Date().getDay()];
      }
      renderScheduleDetail();
    }

    function buildMergedBlocks(items) {
      var dayOrd = { MON:0, TUE:1, WED:2, THU:3, FRI:4, SAT:5, SUN:6 };
      var groups = {};
      items.forEach(function(item) {
        var key = item.activityId + '|' + item.startTime + '|' + item.endTime;
        if (!groups[key]) groups[key] = { activityId: item.activityId, startTime: item.startTime, endTime: item.endTime, firstItemId: item.id, allDays: [] };
        (item.weekdays || []).forEach(function(d) {
          if (groups[key].allDays.indexOf(d) < 0) groups[key].allDays.push(d);
        });
      });
      var blocks = [];
      Object.keys(groups).forEach(function(key) {
        var g = groups[key];
        var idxs = g.allDays.map(function(d) { return dayOrd[d]; }).filter(function(x) { return x !== undefined; }).sort(function(a, b) { return a - b; });
        var curRun = [];
        idxs.forEach(function(idx) {
          if (curRun.length === 0 || idx === curRun[curRun.length - 1] + 1) {
            curRun.push(idx);
          } else {
            blocks.push({ activityId: g.activityId, startTime: g.startTime, endTime: g.endTime, firstItemId: g.firstItemId, colStart: curRun[0], colSpan: curRun.length });
            curRun = [idx];
          }
        });
        if (curRun.length) blocks.push({ activityId: g.activityId, startTime: g.startTime, endTime: g.endTime, firstItemId: g.firstItemId, colStart: curRun[0], colSpan: curRun.length });
      });
      return blocks;
    }

    function renderScheduleGrid() {
      var items = scheduleItems.filter(function(i) { return i.scheduleId === currentDetailScheduleId; });
      var schedule = schedules.find(function(s) { return s.id === currentDetailScheduleId; });
      var isEdit = (scheduleViewMode2 === 'edit');
      var gridStart = getScheduleGridStartMin(isEdit && scheduleDraft ? scheduleDraft : schedule);
      var gridEnd = gridStart + 24 * 60; // 항상 24시간
      var totalSlots = (gridEnd - gridStart) / 30;
      var totalHeight = totalSlots * SLOT_HEIGHT;

      // Current time line (랩어라운드 대응)
      var now = new Date();
      var nowMin = now.getHours() * 60 + now.getMinutes();
      var nowVirtual = toVirtualMin(nowMin, gridStart);
      var nowTop = (nowVirtual - gridStart) / 30 * SLOT_HEIGHT;

      // Merged blocks
      var blocks = buildMergedBlocks(items);

      var html = '<div class="sched-grid-outer"><div class="sched-grid-wrap">';
      html += '<div class="sched-header-row"><div class="sched-time-gutter-h"></div>';
      WEEKDAYS_KR.forEach(function(d, i) {
        html += '<div class="sched-day-header' + (i >= 5 ? ' weekend' : '') + '">' + d + '</div>';
      });
      html += '</div><div class="sched-body"><div class="sched-time-gutter">';
      for (var t = gridStart; t < gridEnd; t += 30) {
        var isH = (t % 60 === 0);
        var showLabel = isH || (t === gridStart);
        html += '<div class="sched-time-slot-label' + (isH ? ' hour' : '') + '">' + (showLabel ? minToTimeStr(t) : '') + '</div>';
      }
      html += '</div>';
      // Grid content: background cols + items overlay
      html += '<div id="schedGridContent" style="flex:1; position:relative; height:' + totalHeight + 'px;" data-gridstart="' + gridStart + '">';
      // Background columns (grid lines)
      html += '<div style="position:absolute; inset:0; display:flex;">';
      WEEKDAYS_EN.forEach(function(day) {
        html += '<div class="sched-day-col" style="flex:1; height:100%;">';
        for (var s = 0; s < totalSlots; s++) {
          var slotMin = gridStart + s * 30;
          var cellClass = 'sched-bg-slot' + ((slotMin % 60 === 0) ? ' hour' : '');
          html += '<div class="' + cellClass + '"></div>';
        }
        html += '</div>';
      });
      html += '</div>';
      // Items overlay (pointer-events on items only in edit mode)
      html += '<div style="position:absolute; inset:0; pointer-events:none;">';
      blocks.forEach(function(b) {
        var act = activities.find(function(a) { return a.id === b.activityId; });
        var emoji = act ? renderEmoji(act.emoji) : '📅';
        var name = act ? act.name : '(삭제된 일상)';
        var color = act ? (act.color || '#ffde59') : '#ffde59';
        var sMin = timeToMin(b.startTime), eMin = timeToMin(b.endTime);
        var sVirtual = toVirtualMin(sMin, gridStart);
        var dur = (eMin === sMin) ? 1440 : (eMin > sMin ? (eMin - sMin) : (eMin + 1440 - sMin));
        var eVirtual = sVirtual + dur;
        var leftPct = b.colStart / 7 * 100;
        var widthPct = b.colSpan / 7 * 100;
        var ptrStyle = isEdit ? 'pointer-events:auto; cursor:pointer;' : '';
        var clickAttr = isEdit ? ('onclick="openScheduleItemForm(&apos;' + b.firstItemId + '&apos;)"') : '';
        var segs = splitGridBlock(sVirtual, eVirtual, gridStart, gridEnd, SLOT_HEIGHT);
        segs.forEach(function(seg) {
          var borderTop = seg.isContinued ? 'border-top:2px dashed ' + color + ';' : '';
          html += '<div class="sched-item-block" style="position:absolute;' + ptrStyle + 'top:' + seg.top + 'px;height:' + seg.height + 'px;left:calc(' + leftPct + '% + 2px);width:calc(' + widthPct + '% - 4px);background:' + color + '30;border-left-color:' + color + ';' + borderTop + '" ' + clickAttr + '>';
          if (seg.height >= 28) html += '<div class="sched-item-emoji">' + emoji + '</div>';
          if (seg.height >= 42) html += '<div class="sched-item-name">' + name + '</div>';
          if (seg.height >= 60) html += '<div class="sched-item-time">' + b.startTime + '–' + b.endTime + '</div>';
          html += '</div>';
        });
      });
      html += '</div>';
      // Current time line
      if (nowTop >= 0) html += '<div class="sched-now-line" style="top:' + nowTop + 'px;"></div>';
      // Drag overlay (edit mode only) + preview block
      if (isEdit) {
        html += '<div id="schedGridDragOverlay" style="position:absolute;inset:0;cursor:crosshair;z-index:5;"></div>';
        html += '<div id="schedGridDragPreview" style="display:none;position:absolute;pointer-events:none;z-index:6;border-radius:4px;border-left:3px solid var(--primary-yellow);background:rgba(255,222,89,0.35);"></div>';
      }
      html += '</div>'; // grid content
      html += '</div></div></div>'; // sched-body, sched-grid-wrap, sched-grid-outer
      if (isEdit) {
        html += '<div style="margin-top:14px; text-align:center;"><button class="btn-add" onclick="openScheduleItemForm(null)">+ 일정 추가</button></div>';
      }
      var c = document.getElementById('schedDetailGridContent');
      if (c) {
        c.innerHTML = html;
        if (isEdit) initGridDrag(gridStart);
      }
    }

    var scheduleDayViewDay = 'MON'; // 요일별 뷰에서 선택된 요일

    function renderScheduleDayView() {
      var items = scheduleItems.filter(function(i) { return i.scheduleId === currentDetailScheduleId; });
      var isEdit = (scheduleViewMode2 === 'edit');
      var c = document.getElementById('schedDetailDayContent');
      if (!c) return;

      var curIdx = WEEKDAYS_EN.indexOf(scheduleDayViewDay);
      var prevIdx = (curIdx - 1 + 7) % 7;
      var nextIdx = (curIdx + 1) % 7;
      var isWeekend = curIdx >= 5;

      // ← 요일명 → 네비게이터
      var html = '<div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:16px;">';
      html += '<button onclick="selectDayViewDay(&apos;' + WEEKDAYS_EN[prevIdx] + '&apos;)" style="background:none;border:1px solid var(--border-color);border-radius:var(--button-radius,8px);width:36px;height:36px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;">←</button>';
      html += '<span style="font-size:20px;font-weight:700;min-width:60px;text-align:center;color:' + (isWeekend ? '#e44' : 'var(--text-primary)') + ';">' + WEEKDAYS_KR[curIdx] + '요일</span>';
      html += '<button onclick="selectDayViewDay(&apos;' + WEEKDAYS_EN[nextIdx] + '&apos;)" style="background:none;border:1px solid var(--border-color);border-radius:var(--button-radius,8px);width:36px;height:36px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;">→</button>';
      html += '</div>';

      // 선택된 요일의 아이템
      var dayItems = items.filter(function(it) { return (it.weekdays || []).indexOf(scheduleDayViewDay) >= 0; });
      dayItems.sort(function(a, b) { return timeToMin(a.startTime) - timeToMin(b.startTime); });

      var dayViewSchedule = schedules.find(function(s) { return s.id === currentDetailScheduleId; });
      var gridStart = getScheduleGridStartMin(isEdit && scheduleDraft ? scheduleDraft : dayViewSchedule);
      var gridEnd = gridStart + 24 * 60;
      var totalSlots = (gridEnd - gridStart) / 30;
      var totalHeight = totalSlots * SLOT_HEIGHT;
      var now = new Date();
      var nowMin = now.getHours() * 60 + now.getMinutes();
      var nowVirtual = toVirtualMin(nowMin, gridStart);
      var nowTop = (nowVirtual - gridStart) / 30 * SLOT_HEIGHT;

      // 단일 요일 그리드
      html += '<div class="sched-grid-outer"><div class="sched-grid-wrap">';
      html += '<div class="sched-body"><div class="sched-time-gutter">';
      for (var t = gridStart; t < gridEnd; t += 30) {
        var isH = (t % 60 === 0);
        var showLabel = isH || (t === gridStart);
        html += '<div class="sched-time-slot-label' + (isH ? ' hour' : '') + '">' + (showLabel ? minToTimeStr(t) : '') + '</div>';
      }
      html += '</div>';
      html += '<div id="schedDayGridContent" style="flex:1;position:relative;height:' + totalHeight + 'px;" data-gridstart="' + gridStart + '">';
      // 배경 슬롯
      html += '<div style="position:absolute;inset:0;">';
      for (var s = 0; s < totalSlots; s++) {
        var slotMin = gridStart + s * 30;
        var cellClass = 'sched-bg-slot' + ((slotMin % 60 === 0) ? ' hour' : '');
        html += '<div class="' + cellClass + '" style="width:100%;"></div>';
      }
      html += '</div>';
      // 아이템 블록
      html += '<div style="position:absolute;inset:0;pointer-events:none;">';
      dayItems.forEach(function(item) {
        var act = activities.find(function(a) { return a.id === item.activityId; });
        var emoji = act ? renderEmoji(act.emoji) : '📅';
        var name = act ? act.name : '(삭제된 일상)';
        var color = act ? (act.color || '#ffde59') : '#ffde59';
        var sMin = timeToMin(item.startTime), eMin = timeToMin(item.endTime);
        var sVirtual = toVirtualMin(sMin, gridStart);
        var dur2 = (eMin === sMin) ? 1440 : (eMin > sMin ? (eMin - sMin) : (eMin + 1440 - sMin));
        var eVirtual = sVirtual + dur2;
        var ptrStyle = isEdit ? 'pointer-events:auto;cursor:pointer;' : '';
        var clickAttr = isEdit ? ('onclick="openScheduleItemForm(&apos;' + item.id + '&apos;)"') : '';
        var segs2 = splitGridBlock(sVirtual, eVirtual, gridStart, gridEnd, SLOT_HEIGHT);
        segs2.forEach(function(seg) {
          var bt = seg.isContinued ? 'border-top:2px dashed ' + color + ';' : '';
          html += '<div class="sched-item-block" style="position:absolute;' + ptrStyle + 'top:' + seg.top + 'px;height:' + seg.height + 'px;left:2px;right:2px;background:' + color + '30;border-left-color:' + color + ';' + bt + '" ' + clickAttr + '>';
          if (seg.height >= 28) html += '<div class="sched-item-emoji">' + emoji + '</div>';
          if (seg.height >= 42) html += '<div class="sched-item-name">' + name + '</div>';
          if (seg.height >= 60) html += '<div class="sched-item-time">' + item.startTime + '–' + item.endTime + '</div>';
          html += '</div>';
        });
      });
      html += '</div>';
      if (nowTop >= 0) html += '<div class="sched-now-line" style="top:' + nowTop + 'px;"></div>';
      // 드래그 오버레이 (편집 모드)
      if (isEdit) {
        html += '<div id="schedDayDragOverlay" style="position:absolute;inset:0;cursor:crosshair;z-index:5;"></div>';
        html += '<div id="schedDayDragPreview" style="display:none;position:absolute;pointer-events:none;z-index:6;border-radius:4px;border-left:3px solid var(--primary-yellow);background:rgba(255,222,89,0.35);left:2px;right:2px;"></div>';
      }
      html += '</div></div></div></div>';

      if (isEdit) {
        html += '<div style="margin-top:14px;text-align:center;"><button class="btn-add" onclick="onGridCellClick(&apos;' + scheduleDayViewDay + '&apos;,' + (8*60) + ')">+ 일정 추가</button></div>';
      }
      c.innerHTML = html;
      if (isEdit) initDayGridDrag(gridStart);
    }

    function selectDayViewDay(en) {
      scheduleDayViewDay = en;
      renderScheduleDayView();
    }

    function initDayGridDrag(gridStart) {
      var overlay = document.getElementById('schedDayDragOverlay');
      var preview = document.getElementById('schedDayDragPreview');
      var content = document.getElementById('schedDayGridContent');
      if (!overlay || !preview || !content) return;

      var dragging = false, dragStartMin = 0, dragEndMin = 0;

      function yToMin(clientY) {
        var rect = content.getBoundingClientRect();
        var slotIdx = Math.max(0, Math.floor((clientY - rect.top) / SLOT_HEIGHT));
        return gridStart + slotIdx * 30;
      }

      function updatePreview(startMin, endMin) {
        var top = (startMin - gridStart) / 30 * SLOT_HEIGHT;
        var h = Math.max(SLOT_HEIGHT, (endMin - startMin) / 30 * SLOT_HEIGHT);
        preview.style.cssText = 'display:block;position:absolute;pointer-events:none;z-index:6;' +
          'border-radius:4px;border-left:3px solid var(--primary-yellow);background:rgba(255,222,89,0.35);' +
          'left:2px;right:2px;top:' + top + 'px;height:' + h + 'px;';
        var existing = preview.querySelector('.grid-drag-tooltip');
        var tip = existing || document.createElement('div');
        tip.className = 'grid-drag-tooltip';
        tip.textContent = minToTimeStr(startMin) + ' – ' + minToTimeStr(endMin);
        if (!existing) preview.appendChild(tip);
      }

      var gridMax = gridStart + 24 * 60;
      overlay.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        dragging = true;
        dragStartMin = yToMin(e.clientY);
        dragEndMin = Math.min(gridMax, dragStartMin + 30);
        updatePreview(dragStartMin, dragEndMin);
        e.preventDefault();
      });

      document.addEventListener('mousemove', function(e) {
        if (!dragging) return;
        dragEndMin = Math.min(gridMax, Math.max(dragStartMin + 30, yToMin(e.clientY) + 30));
        updatePreview(dragStartMin, dragEndMin);
      }, { passive: true });

      document.addEventListener('mouseup', function(e) {
        if (!dragging) return;
        dragging = false;
        preview.style.display = 'none';
        var start = dragStartMin, end = dragEndMin;
        if (end <= start) end = start + 30;
        addItemPrefill = {
          weekday: scheduleDayViewDay,
          startTime: minToTimeStr(start),
          endTime: minToTimeStr(Math.min(gridMax, end))
        };
        openScheduleItemForm(null);
      });
    }

    function initGridDrag(gridStart) {
      var overlay = document.getElementById('schedGridDragOverlay');
      var preview = document.getElementById('schedGridDragPreview');
      var content = document.getElementById('schedGridContent');
      if (!overlay || !preview || !content) return;

      var dragging = false, dragDay = null, dragStartMin = 0, dragEndMin = 0;

      function posToGridCoords(clientX, clientY) {
        var rect = content.getBoundingClientRect();
        var x = clientX - rect.left;
        var y = clientY - rect.top;
        var colIdx = Math.min(6, Math.max(0, Math.floor(x / rect.width * 7)));
        var slotIdx = Math.max(0, Math.floor(y / SLOT_HEIGHT));
        var min = gridStart + slotIdx * 30;
        return { day: WEEKDAYS_EN[colIdx], min: min, colIdx: colIdx, y: y };
      }

      function updatePreview(startMin, endMin, colIdx) {
        var rect = content.getBoundingClientRect();
        var colW = rect.width / 7;
        var top = (startMin - gridStart) / 30 * SLOT_HEIGHT;
        var h = Math.max(SLOT_HEIGHT, (endMin - startMin) / 30 * SLOT_HEIGHT);
        var left = colIdx * colW + 2;
        preview.style.cssText = 'display:block;position:absolute;pointer-events:none;z-index:6;' +
          'border-radius:4px;border-left:3px solid var(--primary-yellow);background:rgba(255,222,89,0.35);' +
          'top:' + top + 'px;height:' + h + 'px;left:' + left + 'px;width:' + (colW - 6) + 'px;';
        // 툴팁
        var existing = preview.querySelector('.grid-drag-tooltip');
        var tip = existing || document.createElement('div');
        tip.className = 'grid-drag-tooltip';
        tip.textContent = minToTimeStr(startMin) + ' – ' + minToTimeStr(endMin);
        if (!existing) preview.appendChild(tip);
      }

      var gridMax = gridStart + 24 * 60;
      overlay.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        var coords = posToGridCoords(e.clientX, e.clientY);
        dragging = true;
        dragDay = coords.day;
        dragStartMin = coords.min;
        dragEndMin = Math.min(gridMax, coords.min + 30);
        updatePreview(dragStartMin, dragEndMin, coords.colIdx);
        e.preventDefault();
      });

      document.addEventListener('mousemove', function(e) {
        if (!dragging) return;
        var coords = posToGridCoords(e.clientX, e.clientY);
        // 요일이 바뀌면 시작 요일로 고정
        var endMin = Math.min(gridMax, Math.max(dragStartMin + 30, coords.min + 30));
        dragEndMin = endMin;
        var colIdx = WEEKDAYS_EN.indexOf(dragDay);
        updatePreview(dragStartMin, dragEndMin, colIdx);
      }, { passive: true });

      document.addEventListener('mouseup', function(e) {
        if (!dragging) return;
        dragging = false;
        preview.style.display = 'none';
        var start = dragStartMin, end = dragEndMin;
        if (end <= start) end = start + 30;
        addItemPrefill = {
          weekday: dragDay,
          startTime: minToTimeStr(start),
          endTime: minToTimeStr(Math.min(gridMax, end))
        };
        openScheduleItemForm(null);
      });
    }

    function onGridCellClick(day, startMin) {
      addItemPrefill = {
        weekday: day,
        startTime: minToTimeStr(startMin),
        endTime: minToTimeStr(startMin + 60)
      };
      openScheduleItemForm(null);
    }

    function renderScheduleMiniGrid(scheduleId) {
      var items = scheduleItems.filter(function(i) { return i.scheduleId === scheduleId; });
      var miniSchedule = schedules.find(function(s) { return s.id === scheduleId; });
      var gStart = getScheduleGridStartMin(miniSchedule);
      var gEnd = gStart + 24 * 60;
      var range = gEnd - gStart;

      // Current time (랩어라운드 대응)
      var now = new Date();
      var nowMin = now.getHours() * 60 + now.getMinutes();
      var nowVirtual = toVirtualMin(nowMin, gStart);
      var nowPct = (nowVirtual - gStart) / range * 100;

      // Merged blocks
      var blocks = items.length > 0 ? buildMergedBlocks(items) : [];

      // Day header
      var html = '<div class="sched-mini-grid">';
      html += '<div class="sched-mini-header">';
      WEEKDAYS_KR.forEach(function(kr, i) {
        html += '<div class="sched-mini-day-lbl' + (i >= 5 ? ' weekend' : '') + '">' + kr + '</div>';
      });
      html += '</div>';
      // Body
      html += '<div class="sched-mini-body">';
      // Day separator lines
      html += '<div style="position:absolute; inset:0; display:flex; pointer-events:none;">';
      WEEKDAYS_EN.forEach(function(day, i) {
        html += '<div style="flex:1;' + (i > 0 ? 'border-left:1px solid #eee;' : '') + '"></div>';
      });
      html += '</div>';
      // Hour lines (subtle)
      for (var h = gStart + 60; h < gEnd; h += 60) {
        var hp = (h - gStart) / range * 100;
        html += '<div style="position:absolute; left:0; right:0; top:' + hp + '%; border-top:1px solid #eee; pointer-events:none;"></div>';
      }
      // Blocks
      if (items.length === 0) {
        html += '<div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; color:#ccc; font-size:9px;">빈 시간표</div>';
      } else {
        blocks.forEach(function(b) {
          var act = activities.find(function(a) { return a.id === b.activityId; });
          var color = act ? (act.color || '#ffde59') : '#ffde59';
          var emoji = act ? renderEmoji(act.emoji) : '';
          var sMin = timeToMin(b.startTime), eMin = timeToMin(b.endTime);
          var sVirtual = toVirtualMin(sMin, gStart);
          var dur = (eMin === sMin) ? 1440 : (eMin > sMin ? (eMin - sMin) : (eMin + 1440 - sMin));
          var eVirtualM = sVirtual + dur;
          var leftPct = b.colStart / 7 * 100;
          var widthPct = b.colSpan / 7 * 100;
          var actName = act ? act.name : '';
          var txtColor = hexToTextColor(color);
          var miniSegs = splitGridBlockPct(sVirtual, eVirtualM, gStart, gEnd);
          miniSegs.forEach(function(seg) {
          var btStyle = seg.isContinued ? 'border-top:2px dashed ' + color + ';' : '';
          html += '<div class="sched-mini-block" style="top:' + seg.topPct + '%;height:' + seg.heightPct + '%;left:calc(' + leftPct + '% + 1px);width:calc(' + widthPct + '% - 2px);background:' + color + ';color:' + txtColor + ';' + btStyle + '">';
          html += '<span class="mini-emoji-badge">' + emoji + '</span>';
          html += '<span class="mini-block-name">' + actName + '</span>';
          html += '</div>';
          }); // miniSegs
        });
      }
      // Current time line
      if (nowPct >= 0) {
        html += '<div style="position:absolute; left:0; right:0; top:' + nowPct + '%; height:1px; background:var(--primary-pink,#ffaade); z-index:5; pointer-events:none;"></div>';
      }
      html += '</div></div>'; // sched-mini-body, sched-mini-grid
      return html;
    }

    function formatDurationMin(totalMin) {
      if (totalMin <= 0) return '0분';
      var h = Math.floor(totalMin / 60);
      var m = totalMin % 60;
      if (h && m) return h + '시간 ' + m + '분';
      if (h) return h + '시간';
      return m + '분';
    }

    function renderScheduleDetailItemList() {
      var items = scheduleItems.filter(function(i) { return i.scheduleId === currentDetailScheduleId; });
      var isEdit = (scheduleViewMode2 === 'edit');
      var c = document.getElementById('schedDetailListContent');
      if (!c) return;
      if (items.length === 0) {
        var addBtn = isEdit ? '<div style="text-align:center; margin-top:14px;"><button class="btn-add" onclick="openScheduleItemForm(null)">+ 일정 추가</button></div>' : '';
        c.innerHTML = '<div class="schedule-empty" style="margin:20px 0;">일정이 없습니다.' + (isEdit ? ' 아래 버튼 또는 주간 그리드 빈 칸을 클릭해서 추가하세요.' : '') + '</div>' + addBtn;
        return;
      }
      var dayOrd = { MON:0, TUE:1, WED:2, THU:3, FRI:4, SAT:5, SUN:6 };
      items.sort(function(a, b) {
        var af = a.weekdays && a.weekdays.length ? dayOrd[a.weekdays[0]] : 7;
        var bf = b.weekdays && b.weekdays.length ? dayOrd[b.weekdays[0]] : 7;
        return af !== bf ? af - bf : timeToMin(a.startTime) - timeToMin(b.startTime);
      });
      var totalWeekMin = 0;
      items.forEach(function(item) {
        var dur = timeToMin(item.endTime) - timeToMin(item.startTime);
        totalWeekMin += dur * (item.weekdays ? item.weekdays.length : 0);
      });
      var html = '<div style="font-size:13px; color:#666; margin-bottom:8px;">총 <b>' + items.length + '개</b> 일정 · 주간 합계 <b>' + formatDurationMin(totalWeekMin) + '</b></div>';
      html += '<div class="sched-item-list">';
      items.forEach(function(item) {
        var act = activities.find(function(a) { return a.id === item.activityId; });
        var emoji = act ? renderEmoji(act.emoji) : '📅';
        var name = act ? act.name : '(삭제된 일상)';
        var color = act ? (act.color || '#ffde59') : '#ffde59';
        var days = (item.weekdays || []).map(function(d) { return WEEKDAYS_KR[WEEKDAYS_EN.indexOf(d)] || d; }).join('·');
        var perDayMin = timeToMin(item.endTime) - timeToMin(item.startTime);
        var weekTotal = perDayMin * (item.weekdays ? item.weekdays.length : 0);
        html += '<div class="sched-list-item">';
        html += '<div class="sched-list-item-color" style="background:' + color + ';"></div>';
        html += '<div class="sched-list-item-emoji">' + emoji + '</div>';
        html += '<div class="sched-list-item-info"><div class="sched-list-item-name">' + name + '</div>';
        html += '<div class="sched-list-item-meta">' + days + ' · ' + item.startTime + ' – ' + item.endTime + ' · 주간 ' + formatDurationMin(weekTotal) + '</div></div>';
        if (isEdit) {
          html += '<div class="sched-list-item-actions">';
          html += '<button class="btn-icon" onclick="openScheduleItemForm(&apos;' + item.id + '&apos;)">수정</button>';
          html += '<button class="btn-icon btn-danger" onclick="deleteScheduleItem(&apos;' + item.id + '&apos;)">삭제</button>';
          html += '</div>';
        }
        html += '</div>';
      });
      html += '</div>';
      if (isEdit) html += '<div style="margin-top:14px; text-align:center;"><button class="btn-add" onclick="openScheduleItemForm(null)">+ 일정 추가</button></div>';
      c.innerHTML = html;
    }

    function renderScheduleItemTimeInputs() {
      var container = document.getElementById('siTimeContainer');
      if (!container) return;
      var sameTime = document.getElementById('siSameTime').checked;
      var modal = document.getElementById('scheduleItemModal');
      var selectedDays = [];
      modal.querySelectorAll('.si-day-check:checked').forEach(function(cb) { selectedDays.push(cb.value); });

      if (sameTime) {
        // 재렌더 전에 현재 입력값을 캐시에 반영 (시간 변경 후 요일 추가 시 원복 방지)
        var curStart = container.querySelector('.si-start-same');
        var curEnd   = container.querySelector('.si-end-same');
        if (curStart && curStart.value) siTimeCache.start = curStart.value;
        if (curEnd   && curEnd.value)   siTimeCache.end   = curEnd.value;
        var isMidnight = siTimeCache.start && siTimeCache.end &&
          timeToMin(siTimeCache.end) < timeToMin(siTimeCache.start);
        container.innerHTML =
          '<div class="si-time-group">' +
          '<input type="time" class="si-start-same" value="' + siTimeCache.start + '" oninput="siTimeCache.start=this.value;updateSiMidnightBadge()">' +
          '<span class="si-time-sep">~</span>' +
          '<input type="time" class="si-end-same" value="' + siTimeCache.end + '" oninput="siTimeCache.end=this.value;updateSiMidnightBadge()">' +
          '<span class="si-midnight-badge" style="' + (isMidnight ? '' : 'display:none;') + '">+1일</span>' +
          '</div>';
      } else {
        // 해제 상태: 기존 단일 시간값 캐시에 저장 후 요일별 행 생성
        var prevSingleStart = container.querySelector('.si-start-same');
        var prevSingleEnd = container.querySelector('.si-end-same');
        if (prevSingleStart) siTimeCache.start = prevSingleStart.value;
        if (prevSingleEnd) siTimeCache.end = prevSingleEnd.value;

        // 이미 표시 중이던 요일별 값 보존
        var prev = {};
        container.querySelectorAll('.si-per-day-row').forEach(function(row) {
          var d = row.dataset.day;
          prev[d] = {
            start: row.querySelector('.si-start-each').value,
            end: row.querySelector('.si-end-each').value
          };
        });

        if (selectedDays.length === 0) {
          container.innerHTML = '<div style="color:#aaa;font-size:13px;padding:4px 0;">요일을 먼저 선택해주세요</div>';
          return;
        }

        var dayOrd = { MON:0, TUE:1, WED:2, THU:3, FRI:4, SAT:5, SUN:6 };
        selectedDays.sort(function(a, b) { return dayOrd[a] - dayOrd[b]; });
        var html = '';
        selectedDays.forEach(function(d) {
          var p = prev[d] || {};
          var startVal = p.start || siTimeCache.start;
          var endVal   = p.end   || siTimeCache.end;
          var kr = WEEKDAYS_KR[WEEKDAYS_EN.indexOf(d)];
          html += '<div class="si-per-day-row" data-day="' + d + '">';
          html += '<div class="si-per-day-row-label">' + kr + '</div>';
          html += '<input type="time" class="si-start-each" value="' + startVal + '">';
          html += '<span class="si-time-sep">~</span>';
          html += '<input type="time" class="si-end-each" value="' + endVal + '">';
          html += '</div>';
        });
        container.innerHTML = html;
      }
    }

    function updateSiMidnightBadge() {
      var modal = document.getElementById('scheduleItemModal');
      if (!modal) return;
      var badge = modal.querySelector('.si-midnight-badge');
      var s = siTimeCache.start, e = siTimeCache.end;
      if (badge && s && e) {
        badge.style.display = (timeToMin(e) < timeToMin(s)) ? 'inline' : 'none';
      }
    }

    var siSelectedActivityId = '';
    var siNewActivityEmoji = '';
    var siNewActivityName = '';
    var siNewActivityCategoryId = '';
    var siNewActivityColor = '#ffde59';
    var siAddingActivity = false;
    var siActivitySearchQuery = '';
    var siActivityCatFilter = '';

    function renderSiActivityDropdown() {
      var list = document.getElementById('siActivityDropdown');
      if (!list) return;
      var html = '';

      // 검색 입력
      html += '<div class="si-search-row" onclick="event.stopPropagation()">';
      html += '<input id="siActivitySearch" class="si-search-input" type="text" placeholder="일상 검색..." value="' + escapeHtml(siActivitySearchQuery) + '" oninput="siActivitySearchQuery=this.value;renderSiActivityDropdown()" onkeydown="event.stopPropagation()">';
      html += '</div>';

      // 카테고리 필터
      if (categories.filter(function(c){ return c.active; }).length > 0) {
        html += '<div class="si-cat-filter" onclick="event.stopPropagation()">';
        html += '<button class="si-cat-btn' + (!siActivityCatFilter ? ' active' : '') + '" onclick="event.stopPropagation();siActivityCatFilter=&apos;&apos;;renderSiActivityDropdown()">전체</button>';
        html += '<button class="si-cat-btn' + (siActivityCatFilter === 'none' ? ' active' : '') + '" onclick="event.stopPropagation();siActivityCatFilter=&apos;none&apos;;renderSiActivityDropdown()">미지정</button>';
        categories.filter(function(c){ return c.active; }).forEach(function(cat) {
          var isActive = (siActivityCatFilter === cat.id) ? ' active' : '';
          html += '<button class="si-cat-btn' + isActive + '" onclick="event.stopPropagation();siActivityCatFilter=&apos;' + cat.id + '&apos;;renderSiActivityDropdown()">';
          html += renderEmoji(cat.emoji) + ' ' + escapeHtml(cat.name) + '</button>';
        });
        html += '</div>';
      }

      // 일상 목록 필터링
      var filtered = activities.filter(function(a) {
        if (!a.active) return false;
        if (siActivityCatFilter === 'none') { if (a.categoryId) return false; }
        else if (siActivityCatFilter) { if (a.categoryId !== siActivityCatFilter) return false; }
        if (siActivitySearchQuery) {
          var q = siActivitySearchQuery.toLowerCase();
          if (a.name.toLowerCase().indexOf(q) === -1) return false;
        }
        return true;
      });

      if (filtered.length) {
        filtered.forEach(function(a) {
          var sel = (a.id === siSelectedActivityId) ? ' selected' : '';
          html += '<div class="custom-select-option' + sel + '" data-id="' + a.id + '" onclick="selectSiActivity(&apos;' + a.id + '&apos;)">';
          html += '<span>' + renderEmoji(a.emoji) + '</span><span>' + escapeHtml(a.name) + '</span>';
          html += '</div>';
        });
      } else {
        html += '<div class="custom-select-option" style="color:#aaa;cursor:default;">' + (siActivitySearchQuery ? '검색 결과 없음' : '사용 가능한 일상이 없습니다') + '</div>';
      }

      html += '<div class="si-add-divider"></div>';
      html += '<div class="si-add-activity-trigger" onclick="event.stopPropagation();showSiAddActivityModal()">+ 새 일상 추가</div>';

      list.innerHTML = html;
      updateSiActivityDisplay();
    }

    function showSiAddActivityModal() {
      siNewActivityEmoji = getRandomEmoji();
      siNewActivityName = '';
      siNewActivityCategoryId = '';
      siNewActivityColor = '#ffde59';
      var modal = document.getElementById('siAddActivityModal');
      if (!modal) return;
      // 이모지 버튼
      var emojiBtn = modal.querySelector('#siAddModalEmojiBtn');
      if (emojiBtn) emojiBtn.innerHTML = renderEmoji(siNewActivityEmoji);
      // 이름 초기화
      var nameInp = modal.querySelector('#siAddModalNameInput');
      if (nameInp) { nameInp.value = ''; nameInp.style.borderColor = ''; }
      // 카테고리 드롭다운 채우기
      var catSel = modal.querySelector('#siAddModalCatSelect');
      if (catSel) {
        catSel.innerHTML = '<option value="">카테고리 없음</option>';
        categories.filter(function(c){ return c.active; }).forEach(function(cat) {
          catSel.innerHTML += '<option value="' + cat.id + '">' + cat.emoji + ' ' + escapeHtml(cat.name) + '</option>';
        });
        catSel.value = '';
      }
      // 색상 초기화
      var colorInp = modal.querySelector('#siAddModalColorInput');
      var colorSwatch = modal.querySelector('#siAddModalColorSwatch');
      var colorHex = modal.querySelector('#siAddModalColorHex');
      if (colorInp) colorInp.value = '#ffde59';
      if (colorSwatch) colorSwatch.style.background = '#ffde59';
      if (colorHex) colorHex.textContent = '#ffde59';
      modal.style.display = 'flex';
      bringModalToFront(modal);
      if (nameInp) setTimeout(function(){ nameInp.focus(); }, 50);
    }

    function closeSiAddActivityModal() {
      var modal = document.getElementById('siAddActivityModal');
      if (modal) modal.style.display = 'none';
    }

    function openSiAddModalEmojiPicker() {
      openEmojiPicker(siNewActivityEmoji || '', function(emoji) {
        siNewActivityEmoji = emoji;
        var btn = document.getElementById('siAddModalEmojiBtn');
        if (btn) btn.innerHTML = renderEmoji(emoji);
      });
    }

    function saveSiAddActivityModal() {
      var modal = document.getElementById('siAddActivityModal');
      if (!modal) return;
      var nameInp = modal.querySelector('#siAddModalNameInput');
      var name = nameInp ? nameInp.value.trim() : '';
      if (!name) {
        if (nameInp) { nameInp.focus(); nameInp.style.borderColor = '#e53e3e'; }
        return;
      }
      var catSel = modal.querySelector('#siAddModalCatSelect');
      var colorInp = modal.querySelector('#siAddModalColorInput');
      var newActivity = {
        id: generateId(),
        categoryId: (catSel && catSel.value) ? catSel.value : null,
        emoji: siNewActivityEmoji || getRandomEmoji(),
        name: name,
        color: (colorInp && colorInp.value) ? colorInp.value : '#ffde59',
        active: true,
        createdAt: today()
      };
      activities.push(newActivity);
      saveActivities();
      siNewActivityEmoji = '';
      siNewActivityName = '';
      siNewActivityCategoryId = '';
      siNewActivityColor = '#ffde59';
      closeSiAddActivityModal();
      selectSiActivity(newActivity.id);
      renderSiActivityDropdown();
      var wrap = document.getElementById('siActivitySelectWrap');
      if (wrap) wrap.classList.remove('open');
      showToast('일상 추가 완료');
    }

    function updateSiActivityDisplay() {
      var disp = document.getElementById('siActivityDisplay');
      if (!disp) return;
      var a = activities.find(function(x) { return x.id === siSelectedActivityId; });
      if (a) disp.innerHTML = '<span>' + renderEmoji(a.emoji) + '</span><span>' + escapeHtml(a.name) + '</span>';
      else disp.innerHTML = '<span class="custom-select-placeholder">일상 종류 선택</span>';
    }

    function toggleSiActivityDropdown(e) {
      if (e) e.stopPropagation();
      var wrap = document.getElementById('siActivitySelectWrap');
      if (!wrap) return;
      wrap.classList.toggle('open');
    }

    function selectSiActivity(id) {
      siSelectedActivityId = id;
      updateSiActivityDisplay();
      var wrap = document.getElementById('siActivitySelectWrap');
      if (wrap) wrap.classList.remove('open');
      var list = document.getElementById('siActivityDropdown');
      if (list) list.querySelectorAll('.custom-select-option').forEach(function(el) {
        el.classList.toggle('selected', el.dataset.id === id);
      });
    }

    document.addEventListener('click', function(e) {
      var wrap = document.getElementById('siActivitySelectWrap');
      if (wrap && wrap.classList.contains('open') && !wrap.contains(e.target)) {
        wrap.classList.remove('open');
      }
    });

    function openScheduleItemForm(itemId) {
      editingScheduleItemId = itemId;
      var modal = document.getElementById('scheduleItemModal');
      if (!modal) return;
      document.getElementById('siModalTitle').textContent = itemId ? '일정 수정' : '일정 추가';
      siSelectedActivityId = '';
      siActivitySearchQuery = '';
      siActivityCatFilter = '';
      renderSiActivityDropdown();
      modal.querySelectorAll('.si-day-check').forEach(function(cb) { cb.checked = false; });
      document.getElementById('siSameTime').checked = true;
      document.getElementById('siTimeContainer').innerHTML = '';
      siTimeCache = {start: '', end: ''};
      renderScheduleItemTimeInputs();

      if (itemId) {
        var item = scheduleItems.find(function(i) { return i.id === itemId; });
        if (item) {
          siSelectedActivityId = item.activityId;
          updateSiActivityDisplay();
          renderSiActivityDropdown();
          (item.weekdays || []).forEach(function(d) {
            var cb = modal.querySelector('.si-day-check[value="' + d + '"]');
            if (cb) cb.checked = true;
          });
          siTimeCache = {start: item.startTime || '', end: item.endTime || ''};
          renderScheduleItemTimeInputs();
          var startEl = modal.querySelector('.si-start-same');
          var endEl = modal.querySelector('.si-end-same');
          if (startEl) startEl.value = item.startTime;
          if (endEl) endEl.value = item.endTime;
        }
      } else if (addItemPrefill) {
        siTimeCache = {start: addItemPrefill.startTime || '', end: addItemPrefill.endTime || ''};
        var cb = modal.querySelector('.si-day-check[value="' + addItemPrefill.weekday + '"]');
        if (cb) cb.checked = true;
        renderScheduleItemTimeInputs();
        var s = modal.querySelector('.si-start-same');
        var e = modal.querySelector('.si-end-same');
        if (s) s.value = addItemPrefill.startTime;
        if (e) e.value = addItemPrefill.endTime;
      }
      addItemPrefill = null;

      // 요일 체크박스 토글 시 시간 입력 다시 그리기
      modal.querySelectorAll('.si-day-check').forEach(function(cb) {
        cb.onchange = function() { renderScheduleItemTimeInputs(); };
      });

      modal.style.display = 'flex';
      bringModalToFront(modal);
    }

    function closeScheduleItemModal() {
      var modal = document.getElementById('scheduleItemModal');
      if (modal) modal.style.display = 'none';
      editingScheduleItemId = null;
      addItemPrefill = null;
      siAddingActivity = false;
      siNewActivityEmoji = '';
      siNewActivityName = '';
      siNewActivityCategoryId = '';
      siNewActivityColor = '#ffde59';
    }

    function saveScheduleItem() {
      var modal = document.getElementById('scheduleItemModal');
      var actId = siSelectedActivityId;
      var sameTime = document.getElementById('siSameTime').checked;
      var weekdays = [];
      modal.querySelectorAll('.si-day-check:checked').forEach(function(cb) { weekdays.push(cb.value); });
      if (!actId) { showAlert('입력 오류', '일상 종류를 선택해주세요.'); return; }
      if (!weekdays.length) { showAlert('입력 오류', '요일을 하나 이상 선택해주세요.'); return; }

      var perDayData = []; // { weekdays:[], start, end }
      if (sameTime) {
        var s = (modal.querySelector('.si-start-same') || {}).value || '';
        var e = (modal.querySelector('.si-end-same') || {}).value || '';
        if (!s || !e) { showAlert('입력 오류', '시간을 입력해주세요.'); return; }
        if (timeToMin(e) === timeToMin(s)) { showAlert('입력 오류', '시작 시간과 종료 시간이 같습니다.'); return; }
        perDayData.push({ weekdays: weekdays.slice(), start: s, end: e });
      } else {
        var rows = modal.querySelectorAll('.si-per-day-row');
        for (var i = 0; i < rows.length; i++) {
          var d = rows[i].dataset.day;
          var ss = rows[i].querySelector('.si-start-each').value;
          var ee = rows[i].querySelector('.si-end-each').value;
          if (!ss || !ee) { showAlert('입력 오류', WEEKDAYS_KR[WEEKDAYS_EN.indexOf(d)] + '요일 시간을 입력해주세요.'); return; }
          if (timeToMin(ee) === timeToMin(ss)) { showAlert('입력 오류', WEEKDAYS_KR[WEEKDAYS_EN.indexOf(d)] + '요일 시작/종료 시간이 같습니다.'); return; }
          perDayData.push({ weekdays: [d], start: ss, end: ee });
        }
      }

      // 편집 중이면 기존 item을 삭제하고 새로 생성 (요일별 시간 다를 수 있으니)
      if (editingScheduleItemId) {
        scheduleItems = scheduleItems.filter(function(i) { return i.id !== editingScheduleItemId; });
      }
      perDayData.forEach(function(d) {
        scheduleItems.push({
          id: generateId(),
          scheduleId: currentDetailScheduleId,
          activityId: actId,
          weekdays: d.weekdays,
          startTime: d.start,
          endTime: d.end,
          createdAt: today()
        });
      });

      var sch = schedules.find(function(s) { return s.id === currentDetailScheduleId; });
      if (sch) sch.updatedAt = today();
      var wasEditing = !!editingScheduleItemId;
      saveSchedules();
      closeScheduleItemModal();
      renderScheduleDetail();
      renderCurrentScheduleView();
      showToast(wasEditing ? '✅ 일정이 수정되었습니다' : '✅ 일정이 추가되었습니다');
    }

    function deleteScheduleItem(itemId) {
      showConfirm('일정 삭제', '이 일정을 삭제하시겠습니까?', function(confirmed) {
        if (!confirmed) return;
        scheduleItems = scheduleItems.filter(function(i) { return i.id !== itemId; });
        saveSchedules();
        renderScheduleDetail();
        showToast('🗑️ 일정이 삭제되었습니다');
      });
    }

    function switchScheduleView(mode) {
      scheduleViewMode = mode;
      scheduleListPage = 1;
      const thumbBtn = document.getElementById('viewBtnThumbnail');
      const listBtn = document.getElementById('viewBtnList');
      if (thumbBtn) thumbBtn.classList.toggle('active', mode === 'thumbnail');
      if (listBtn) listBtn.classList.toggle('active', mode === 'list');
      const filterSel = document.getElementById('scheduleFilterSelect');
      if (filterSel) filterSel.style.display = mode === 'list' ? 'inline-block' : 'none';
      if (mode === 'thumbnail') {
        scheduleFilterLiked = 'all';
        if (filterSel) filterSel.value = 'all';
      }
      renderScheduleTagFilter();
      const heroSection = document.getElementById('scheduleHeroSection');
      const othersSection = document.getElementById('scheduleOthersSection');
      const listView = document.getElementById('scheduleListView');
      const emptyEl = document.getElementById('scheduleEmpty');
      const noResultEl = document.getElementById('scheduleNoResult');
      if (mode === 'list') {
        if (heroSection) heroSection.style.display = 'none';
        if (othersSection) othersSection.style.display = 'none';
        if (emptyEl) emptyEl.style.display = 'none';
        if (noResultEl) noResultEl.style.display = 'none';
        if (listView) listView.style.display = 'block';
        renderScheduleList();
      } else {
        if (listView) listView.style.display = 'none';
        renderScheduleThumbnails();
      }
    }

    function setScheduleFilter(filter) {
      scheduleFilterLiked = filter;
      scheduleListPage = 1;
      var sel = document.getElementById('scheduleFilterSelect');
      if (sel) sel.value = filter;
      renderCurrentScheduleView();
    }

    function handleScheduleSort(value) {
      var parts = value.split('_');
      scheduleSortKey = parts[0];
      scheduleSortDir = parts[1];
      scheduleListPage = 1;
      renderCurrentScheduleView();
    }

    function getSortIcon(key) {
      if (scheduleSortKey !== key) return '<span class="sort-arrow">↕</span>';
      return '<span class="sort-arrow on">' + (scheduleSortDir === 'asc' ? '↑' : '↓') + '</span>';
    }

    function toggleListSort(key) {
      if (scheduleSortKey === key) {
        scheduleSortDir = scheduleSortDir === 'asc' ? 'desc' : 'asc';
      } else {
        scheduleSortKey = key;
        scheduleSortDir = 'desc';
      }
      scheduleListPage = 1;
      var sel = document.getElementById('scheduleSortSelect');
      if (sel) sel.value = scheduleSortKey + '_' + scheduleSortDir;
      renderScheduleList();
    }

    function renderScheduleList() {
      var listView = document.getElementById('scheduleListView');
      var emptyEl = document.getElementById('scheduleEmpty');
      var noResultEl = document.getElementById('scheduleNoResult');
      if (!listView) return;

      updateScheduleBulkBar();

      if (schedules.length === 0) {
        listView.innerHTML = '';
        if (emptyEl) emptyEl.style.display = 'block';
        if (noResultEl) noResultEl.style.display = 'none';
        return;
      }
      if (emptyEl) emptyEl.style.display = 'none';

      var filtered = getSortedFilteredSchedules();
      if (filtered.length === 0) {
        listView.innerHTML = '';
        if (noResultEl) noResultEl.style.display = 'block';
        return;
      }
      if (noResultEl) noResultEl.style.display = 'none';

      var total = filtered.length;
      var totalPages = Math.max(1, Math.ceil(total / scheduleListPerPage));
      if (scheduleListPage > totalPages) scheduleListPage = totalPages;
      var start = (scheduleListPage - 1) * scheduleListPerPage;
      var paged = filtered.slice(start, start + scheduleListPerPage);

      var pagerBar = buildPagerBar(total);

      var html = pagerBar;
      html += '<table class="schedule-list-table"><thead><tr>';
      html += '<th><input type="checkbox" class="schedule-select-checkbox" id="listSelectAll" onchange="toggleSelectAllSchedules(this.checked)"></th>';
      html += '<th onclick="toggleListSort(&apos;title&apos;)">이름' + getSortIcon('title') + '</th>';
      html += '<th>태그</th>';
      html += '<th onclick="toggleListSort(&apos;updatedAt&apos;)">최종수정' + getSortIcon('updatedAt') + '</th>';
      html += '<th>좋아요</th>';
      html += '</tr></thead><tbody>';

      paged.forEach(function(sch) {
        var isSelected = selectedScheduleIds.indexOf(sch.id) >= 0;
        var tags = (sch.tags || []).map(function(t) {
          return renderTagChip(t, { cls: 'schedule-tag' });
        }).join('');
        var date = (sch.updatedAt || sch.createdAt || '').substring(0, 10);
        var heartCls = sch.isLiked ? 'heart-btn liked' : 'heart-btn';
        html += '<tr>';
        html += '<td><input type="checkbox" class="schedule-select-checkbox"' + (isSelected ? ' checked' : '') + ' onchange="toggleScheduleSelect(&apos;' + sch.id + '&apos;)"></td>';
        html += '<td><div class="schedule-list-row-name" onclick="openScheduleDetail(&apos;' + sch.id + '&apos;)">';
        html += '<span>' + renderEmoji(sch.emoji) + '</span><span>' + escapeHtml(sch.title) + '</span></div></td>';
        html += '<td class="schedule-list-tags-cell' + (tags ? '' : ' no-tags') + '"><div class="schedule-list-tags">' + (tags || '<span style="color:var(--text-secondary);font-size:12px;">-</span>') + '</div></td>';
        html += '<td class="schedule-list-date">' + date + '</td>';
        html += '<td style="text-align:center;"><button class="' + heartCls + '" onclick="toggleScheduleLike(&apos;' + sch.id + '&apos;)" title="' + (sch.isLiked ? '좋아요 해제' : '좋아요') + '">' + HEART_SVG + '</button></td>';
        html += '</tr>';
      });

      html += '</tbody></table>';
      html += pagerBar;
      listView.innerHTML = html;

      // 전체선택 체크박스 상태
      var listSelectAll = document.getElementById('listSelectAll');
      if (listSelectAll) {
        var allIds = filtered.map(function(s) { return s.id; });
        var checkedCount = allIds.filter(function(id) { return selectedScheduleIds.indexOf(id) >= 0; }).length;
        listSelectAll.checked = checkedCount === allIds.length && allIds.length > 0;
        listSelectAll.indeterminate = checkedCount > 0 && checkedCount < allIds.length;
      }
    }

    // 공통 페이저 빌더 (일상·카테고리용)
    // opts: {total, page, perPage, perPageOpts, goFn(name), setPerPageFn(name)}
    function buildGenericPagerBar(opts) {
      var totalPages = Math.max(1, Math.ceil(opts.total / opts.perPage));
      var perPageHtml = '<div class="schedule-per-page"><span>페이지당</span><select onchange="' + opts.setPerPageFn + '(this.value)">';
      opts.perPageOpts.forEach(function(n) {
        perPageHtml += '<option value="' + n + '"' + (n === opts.perPage ? ' selected' : '') + '>' + n + '개</option>';
      });
      perPageHtml += '</select></div>';

      var pagerHtml = '<div class="schedule-pager">';
      if (totalPages > 1) {
        pagerHtml += '<button class="pg-btn" onclick="' + opts.goFn + '(' + (opts.page - 1) + ')"' + (opts.page <= 1 ? ' disabled' : '') + '>‹</button>';
        var maxBtns = 7;
        var s = Math.max(1, opts.page - 3);
        var e = Math.min(totalPages, s + maxBtns - 1);
        if (e - s < maxBtns - 1) s = Math.max(1, e - maxBtns + 1);
        if (s > 1) {
          pagerHtml += '<button class="pg-btn" onclick="' + opts.goFn + '(1)">1</button>';
          if (s > 2) pagerHtml += '<span style="padding:0 4px;color:var(--text-secondary)">…</span>';
        }
        for (var i = s; i <= e; i++) {
          pagerHtml += '<button class="pg-btn' + (i === opts.page ? ' active' : '') + '" onclick="' + opts.goFn + '(' + i + ')">' + i + '</button>';
        }
        if (e < totalPages) {
          if (e < totalPages - 1) pagerHtml += '<span style="padding:0 4px;color:var(--text-secondary)">…</span>';
          pagerHtml += '<button class="pg-btn" onclick="' + opts.goFn + '(' + totalPages + ')">' + totalPages + '</button>';
        }
        pagerHtml += '<button class="pg-btn" onclick="' + opts.goFn + '(' + (opts.page + 1) + ')"' + (opts.page >= totalPages ? ' disabled' : '') + '>›</button>';
      }
      pagerHtml += '</div>';

      return '<div class="schedule-pager-bar">' + pagerHtml + perPageHtml + '</div>';
    }

    function goActivityPage(page) {
      var total = getFilteredActivityCount();
      var totalPages = Math.max(1, Math.ceil(total / activityListPerPage));
      page = parseInt(page, 10);
      if (isNaN(page) || page < 1 || page > totalPages) return;
      activityListPage = page;
      renderActivities();
    }
    function setActivityPerPage(val) {
      activityListPerPage = parseInt(val, 10) || 20;
      activityListPage = 1;
      renderActivities();
    }
    function getFilteredActivityCount() {
      if (selectedCategoryFilter === 'unassigned') return activities.filter(function(a) { return !a.categoryId; }).length;
      if (selectedCategoryFilter) return activities.filter(function(a) { return a.categoryId === selectedCategoryFilter; }).length;
      return activities.length;
    }

    function goCategoryPage(page) {
      var total = categories.length;
      var totalPages = Math.max(1, Math.ceil(total / categoryListPerPage));
      page = parseInt(page, 10);
      if (isNaN(page) || page < 1 || page > totalPages) return;
      categoryListPage = page;
      renderCategories();
    }
    function setCategoryPerPage(val) {
      categoryListPerPage = parseInt(val, 10) || 20;
      categoryListPage = 1;
      renderCategories();
    }

    function buildPagerBar(total) {
      var totalPages = Math.max(1, Math.ceil(total / scheduleListPerPage));
      var perPageOpts = [10, 20, 50, 100];
      var perPageHtml = '<div class="schedule-per-page"><span>페이지당</span><select onchange="setSchedulePerPage(this.value)">';
      perPageOpts.forEach(function(n) {
        perPageHtml += '<option value="' + n + '"' + (n === scheduleListPerPage ? ' selected' : '') + '>' + n + '개</option>';
      });
      perPageHtml += '</select></div>';

      var pagerHtml = '<div class="schedule-pager">';
      if (totalPages > 1) {
        pagerHtml += '<button class="pg-btn" onclick="goScheduleListPage(' + (scheduleListPage - 1) + ')"' + (scheduleListPage <= 1 ? ' disabled' : '') + '>‹</button>';
        var maxBtns = 7;
        var s = Math.max(1, scheduleListPage - 3);
        var e = Math.min(totalPages, s + maxBtns - 1);
        if (e - s < maxBtns - 1) s = Math.max(1, e - maxBtns + 1);
        if (s > 1) {
          pagerHtml += '<button class="pg-btn" onclick="goScheduleListPage(1)">1</button>';
          if (s > 2) pagerHtml += '<span style="padding:0 4px;color:var(--text-secondary)">…</span>';
        }
        for (var i = s; i <= e; i++) {
          pagerHtml += '<button class="pg-btn' + (i === scheduleListPage ? ' active' : '') + '" onclick="goScheduleListPage(' + i + ')">' + i + '</button>';
        }
        if (e < totalPages) {
          if (e < totalPages - 1) pagerHtml += '<span style="padding:0 4px;color:var(--text-secondary)">…</span>';
          pagerHtml += '<button class="pg-btn" onclick="goScheduleListPage(' + totalPages + ')">' + totalPages + '</button>';
        }
        pagerHtml += '<button class="pg-btn" onclick="goScheduleListPage(' + (scheduleListPage + 1) + ')"' + (scheduleListPage >= totalPages ? ' disabled' : '') + '>›</button>';
      }
      pagerHtml += '</div>';

      return '<div class="schedule-pager-bar">' + pagerHtml + perPageHtml + '</div>';
    }

    function goScheduleListPage(page) {
      var filtered = getSortedFilteredSchedules();
      var totalPages = Math.ceil(filtered.length / scheduleListPerPage);
      if (page < 1 || page > totalPages) return;
      scheduleListPage = page;
      renderScheduleList();
    }

    function setSchedulePerPage(val) {
      scheduleListPerPage = parseInt(val, 10) || 10;
      scheduleListPage = 1;
      renderScheduleList();
    }

    const HEART_SVG = '<svg viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9.5-9C0.5 8 3 4 7 4c2.2 0 3.7 1.1 5 2.8C13.3 5.1 14.8 4 17 4c4 0 6.5 4 4.5 8-2.5 4.5-9.5 9-9.5 9z"/></svg>';

    function escapeHtml(str) {
      if (str == null) return '';
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function renderScheduleThumbnails() {
      const heroSection = document.getElementById('scheduleHeroSection');
      const othersSection = document.getElementById('scheduleOthersSection');
      const emptyEl = document.getElementById('scheduleEmpty');
      const noResultEl = document.getElementById('scheduleNoResult');
      if (!heroSection || !othersSection) return;

      updateScheduleBulkBar();

      // 전체가 비어있으면 빈 상태
      if (schedules.length === 0) {
        heroSection.style.display = 'none';
        othersSection.style.display = 'none';
        if (noResultEl) noResultEl.style.display = 'none';
        if (emptyEl) emptyEl.style.display = 'block';
        return;
      }

      if (emptyEl) emptyEl.style.display = 'none';

      const filtered = getSortedFilteredSchedules();
      if (filtered.length === 0) {
        heroSection.style.display = 'none';
        othersSection.style.display = 'none';
        const listView = document.getElementById('scheduleListView');
        if (listView) listView.style.display = 'none';
        if (noResultEl) noResultEl.style.display = 'block';
        return;
      }
      if (noResultEl) noResultEl.style.display = 'none';

      const liked = filtered.filter(function(s) { return s.isLiked; });
      const others = filtered.filter(function(s) { return !s.isLiked; });

      renderHeroSchedule(liked);
      renderOtherSchedules(others);
    }

    function renderHeroSchedule(liked) {
      const section = document.getElementById('scheduleHeroSection');
      section.style.display = 'block';
      if (liked.length === 0) {
        section.innerHTML =
          '<div class="schedule-scroll-wrap" data-scroll-start="true" data-scroll-end="true">' +
          '  <div class="schedule-hero-scroll">' +
          '    <div class="schedule-hero-card empty">' +
          '      <div class="hero-empty-emoji">💛</div>' +
          '      <div class="hero-empty-msg">좋아하는 시간표가 아직 없습니다</div>' +
          '    </div>' +
          '  </div>' +
          '</div>';
        return;
      }

      if (scheduleHeroIndex >= liked.length) scheduleHeroIndex = 0;

      let html = '<div class="schedule-scroll-wrap" data-scroll-start="true" data-scroll-end="' + (liked.length <= 1 ? 'true' : 'false') + '">';
      html += '  <div class="schedule-hero-scroll" id="scheduleHeroScroll">';

      liked.forEach(function(sch) {
        const itemCount = scheduleItems.filter(function(i) { return i.scheduleId === sch.id; }).length;
        const isSelected = selectedScheduleIds.indexOf(sch.id) >= 0;
        const tags = (sch.tags || []).map(function(t) { return renderTagChip(t, { cls: 'schedule-tag' }); }).join('');
        const descText = sch.description ? escapeHtml(sch.description) : '세부 설명 없음';
        const descClass = sch.description ? 'hero-description-display' : 'hero-description-display empty';

        html += '<div class="schedule-hero-card" onclick="openScheduleDetail(&apos;' + sch.id + '&apos;)">';
        html += '  <label class="hero-checkbox-wrap" onclick="event.stopPropagation()"><input type="checkbox" class="schedule-select-checkbox"' + (isSelected ? ' checked' : '') + ' onchange="toggleScheduleSelect(&apos;' + sch.id + '&apos;)"></label>';
        html += '  <button class="heart-btn liked hero-heart-wrap" onclick="event.stopPropagation(); toggleScheduleLike(&apos;' + sch.id + '&apos;)" title="좋아요 해제">' + HEART_SVG + '</button>';
        html += '  <div class="hero-emoji-title">';
        html += '    <span class="hero-emoji">' + renderEmoji(sch.emoji) + '</span>';
        html += '    <span class="hero-title-display">' + escapeHtml(sch.title) + '</span>';
        html += '  </div>';
        html += '  <div class="' + descClass + '">' + descText + '</div>';
        html += '  <div class="hero-thumbnail-frame sched-hero-card">' + renderScheduleMiniGrid(sch.id) + '</div>';
        if (tags) {
          html += '  <div class="hero-tags-row">' + tags + '</div>';
        }
        html += '  <div class="hero-meta-row">' + itemCount + '개 일정 · 최종수정 ' + (sch.updatedAt || sch.createdAt) + '</div>';
        html += '</div>';
      });

      html += '  </div>';
      html += '</div>';

      if (liked.length > 1) {
        html += '<div class="hero-indicators">';
        for (let i = 0; i < liked.length; i++) {
          html += '<button class="hero-indicator' + (i === scheduleHeroIndex ? ' active' : '') + '" onclick="scrollHeroTo(' + i + ')" aria-label="' + (i + 1) + '"></button>';
        }
        html += '</div>';
      }

      section.innerHTML = html;

      const scrollEl = document.getElementById('scheduleHeroScroll');
      if (scrollEl) {
        // 이전 인덱스가 유효하면 해당 카드로 즉시 스크롤 (애니메이션 없이)
        if (scheduleHeroIndex > 0) {
          const target = scrollEl.children[scheduleHeroIndex];
          if (target) scrollEl.scrollLeft = target.offsetLeft;
        }
        updateScrollHintState(scrollEl);
        scrollEl.addEventListener('scroll', function() {
          const cardWidth = scrollEl.clientWidth;
          const idx = Math.round(scrollEl.scrollLeft / cardWidth);
          if (idx !== scheduleHeroIndex && idx >= 0 && idx < liked.length) {
            scheduleHeroIndex = idx;
            updateHeroIndicators();
          }
          updateScrollHintState(scrollEl);
        });
        attachDragScroll(scrollEl);
      }
    }

    function renderOtherSchedules(others) {
      const section = document.getElementById('scheduleOthersSection');
      if (others.length === 0) {
        section.style.display = 'none';
        return;
      }
      section.style.display = 'block';

      let html = '<div class="schedule-others-header">전체 시간표 (' + others.length + '개)</div>';
      html += '<div class="schedule-scroll-wrap" data-scroll-start="true" data-scroll-end="false">';
      html += '  <div class="schedule-others-scroll" id="scheduleOthersScroll">';

      others.forEach(function(sch) {
        const isSelected = selectedScheduleIds.indexOf(sch.id) >= 0;
        const miniTags = (sch.tags || []).slice(0, 4).map(function(t) { return renderTagChip(t, { cls: 'schedule-mini-tag' }); }).join('');
        const moreTagsCount = (sch.tags || []).length - 4;
        html += '<div class="schedule-mini-card" onclick="openScheduleDetail(&apos;' + sch.id + '&apos;)">';
        html += '  <label class="mini-checkbox-wrap" onclick="event.stopPropagation()"><input type="checkbox" class="schedule-select-checkbox"' + (isSelected ? ' checked' : '') + ' onchange="toggleScheduleSelect(&apos;' + sch.id + '&apos;)"></label>';
        html += '  <button class="heart-btn mini-heart-wrap" onclick="event.stopPropagation(); toggleScheduleLike(&apos;' + sch.id + '&apos;)" title="좋아요">' + HEART_SVG + '</button>';
        html += '  <div class="schedule-mini-emoji">' + renderEmoji(sch.emoji) + '</div>';
        html += '  <div class="schedule-mini-title">' + escapeHtml(sch.title) + '</div>';
        if (miniTags) {
          html += '  <div class="schedule-mini-tags">' + miniTags + (moreTagsCount > 0 ? '<span class="schedule-mini-tag-more">+' + moreTagsCount + '</span>' : '') + '</div>';
        }
        html += '  <div class="schedule-mini-date">' + (sch.updatedAt || sch.createdAt) + '</div>';
        html += '</div>';
      });

      html += '  </div>';
      html += '</div>';

      section.innerHTML = html;

      const scrollEl = document.getElementById('scheduleOthersScroll');
      if (scrollEl) {
        updateScrollHintState(scrollEl);
        scrollEl.addEventListener('scroll', function() {
          updateScrollHintState(scrollEl);
        });
        attachDragScroll(scrollEl);
      }
    }

    // ========================================
    // Google Sheets API 헬퍼 (준비)
    // ========================================
    async function fetchSheetData(sheetName) {
      console.log('fetchSheetData:', sheetName);
      return [];
    }

    async function appendSheetData(sheetName, values) {
      console.log('appendSheetData:', sheetName, values);
      return true;
    }

    // ========================================
    // 프로필 관리
    // ========================================
    let profilePhoto = '';
    let profileQuote = '오늘도 화이팅! ✨';
    let currentSettingsSection = '';

    function loadProfile() {
      const savedPhoto = localStorage.getItem('profilePhoto');
      const savedQuote = localStorage.getItem('profileQuote');
      
      if (savedPhoto) {
        profilePhoto = savedPhoto;
      }
      if (savedQuote) {
        profileQuote = savedQuote;
      }
      
      updateProfileDisplay();
    }

    function updateProfileDisplay() {
      const sidebarPhoto = document.getElementById('sidebarProfilePhoto');
      const sidebarQuote = document.getElementById('sidebarProfileQuote');
      
      // 우선순위: 업로드된 사진 → Google 프로필 사진 → 기본 이모지
      const displayPhoto = profilePhoto || (currentUser && currentUser.picture) || '';
      
      if (sidebarPhoto) {
        if (displayPhoto) {
          sidebarPhoto.innerHTML = '<img src="' + displayPhoto + '" alt="Profile">';
        } else {
          sidebarPhoto.innerHTML = '👤';
        }
      }
      
      if (sidebarQuote) {
        sidebarQuote.textContent = profileQuote || '오늘도 화이팅! ✨';
      }
      
      const preview = document.getElementById('profilePreview');
      if (preview) {
        if (displayPhoto) {
          preview.innerHTML = '<img src="' + displayPhoto + '" alt="Profile">';
        } else {
          preview.innerHTML = '👤';
        }
      }
      
      const quoteInput = document.getElementById('profileQuoteInput');
      if (quoteInput) {
        quoteInput.value = profileQuote;
      }
    }

    function handleProfilePhotoUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        showAlert('오류', '이미지 파일만 업로드 가능합니다.');
        return;
      }
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          // 최대 200px으로 축소 (비율 유지)
          var MAX = 200;
          var w = img.width, h = img.height;
          if (w > MAX || h > MAX) {
            if (w >= h) { h = Math.round(h * MAX / w); w = MAX; }
            else { w = Math.round(w * MAX / h); h = MAX; }
          }
          var canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);

          // JPEG 품질을 내려가며 40000자 이하로 압축
          var quality = 0.85;
          var dataUrl;
          do {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
            quality -= 0.1;
          } while (dataUrl.length > 40000 && quality > 0.2);

          if (dataUrl.length > 40000) {
            showAlert('업로드 실패', '이미지가 너무 복잡하여 압축 후에도 Sheets 저장 한계를 초과합니다.\n더 작은 이미지를 사용해주세요.');
            return;
          }
          var kb = Math.round(dataUrl.length * 3 / 4 / 1024);
          profilePhoto = dataUrl;
          updateProfileDisplay();
          // 압축 결과 안내
          var hint = document.getElementById('profileUploadHint');
          if (hint) hint.textContent = '✅ ' + w + '×' + h + 'px · 약 ' + kb + 'KB로 저장됩니다';
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    function saveProfile() {
      const quoteInput = document.getElementById('profileQuoteInput');
      if (quoteInput) {
        profileQuote = quoteInput.value || '오늘도 화이팅! ✨';
      }
      
      localStorage.setItem('profilePhoto', profilePhoto);
      localStorage.setItem('profileQuote', profileQuote);
      GS.syncSheets(['사용자설정']);
      updateProfileDisplay();
      showToast('✅ 프로필이 저장되었습니다');
    }

    function openProfileSettings() {
      navigateTo('settings');
      setTimeout(function() {
        showSettingsSection('profile');
      }, 100);
    }

    // ========================================
    // 설정 페이지 섹션 관리
    // ========================================
    function showSettingsSection(sectionName) {
      currentSettingsSection = sectionName;

      // 설정 페이지 내부의 탭만 제어 (일상 페이지의 .tab-btn과 충돌 방지)
      document.querySelectorAll('#settingsPage .tab-btn').forEach(function(btn) {
        btn.classList.remove('active');
      });

      document.querySelectorAll('#settingsPage .tab-content').forEach(function(content) {
        content.classList.remove('active');
      });

      const menuItems = document.querySelectorAll('#settingsPage .tab-btn');
      if (sectionName === 'profile' && menuItems[0]) {
        menuItems[0].classList.add('active');
        document.getElementById('settingsProfileSection').classList.add('active');
      } else if (sectionName === 'menu' && menuItems[1]) {
        menuItems[1].classList.add('active');
        document.getElementById('settingsMenuSection').classList.add('active');
        initMenuDraft();
      } else if (sectionName === 'design' && menuItems[2]) {
        menuItems[2].classList.add('active');
        document.getElementById('settingsDesignSection').classList.add('active');
        renderDesignSettings();
      }

      updateProfileDisplay();
    }

    // ========================================
    // 디자인 설정 관리
    // ========================================
    const DESIGN_DEFAULTS = {
      primaryColor: '#ffde59',
      sidebarBg: '#fafafa',
      fontFamily: "'Noto Sans KR', sans-serif",
      navWidth: 220,
      buttonRadius: 8,
      accentBtnBg: '#c1ff72',
      accentBtnColor: '#1a1a1a',
      baseFontSize: 14,
      borderColor: '#e0e0e0',
      cardBg: '#ffffff',
      primaryBtnBg: '#ffde59',
      primaryBtnColor: '#1a1a1a',
      mobileTopbarBg: '#ffffff',
      mobileTopbarBorder: '#e0e0e0',
      mobileTopbarText: '#1a1a1a'
    };

    let designSettings = Object.assign({}, DESIGN_DEFAULTS);

    function loadDesignSettings() {
      const saved = localStorage.getItem('designSettings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          designSettings = Object.assign({}, DESIGN_DEFAULTS, parsed);
        } catch (e) {
          designSettings = Object.assign({}, DESIGN_DEFAULTS);
        }
      }
      applyDesignSettings();
    }

    function saveDesignSettings() {
      localStorage.setItem('designSettings', JSON.stringify(designSettings));
      GS.syncSheets(['사용자설정']);
    }

    function applyDesignSettings() {
      const root = document.documentElement;
      root.style.setProperty('--primary-yellow', designSettings.primaryColor);
      root.style.setProperty('--bg-side', designSettings.sidebarBg);
      root.style.setProperty('--nav-width', designSettings.navWidth + 'px');
      root.style.setProperty('--button-radius', designSettings.buttonRadius + 'px');
      root.style.setProperty('--primary-green', designSettings.accentBtnBg);
      root.style.setProperty('--accent-btn-color', designSettings.accentBtnColor);
      root.style.setProperty('--base-font-size', designSettings.baseFontSize + 'px');
      root.style.setProperty('--border-color', designSettings.borderColor);
      root.style.setProperty('--bg-card', designSettings.cardBg);
      root.style.setProperty('--primary-btn-bg', designSettings.primaryBtnBg);
      root.style.setProperty('--primary-btn-color', designSettings.primaryBtnColor);
      root.style.setProperty('--mobile-topbar-bg', designSettings.mobileTopbarBg);
      root.style.setProperty('--mobile-topbar-border', designSettings.mobileTopbarBorder);
      root.style.setProperty('--mobile-topbar-text', designSettings.mobileTopbarText);
      document.body.style.fontFamily = designSettings.fontFamily;
      document.body.style.fontSize = designSettings.baseFontSize + 'px';

      // 사이드바 토글 버튼 위치도 갱신 (--nav-width 연동)
      const toggleBtn = document.getElementById('sidebarToggleBtn');
      if (toggleBtn && !isSidebarCollapsed) {
        toggleBtn.style.left = (parseInt(designSettings.navWidth) - 48) + "px";
      }
    }

    function renderDesignSettings() {
      // 색상 입력 반영
      const primaryColor = document.getElementById('designPrimaryColor');
      const primaryColorValue = document.getElementById('designPrimaryColorValue');
      if (primaryColor) primaryColor.value = designSettings.primaryColor;
      if (primaryColorValue) primaryColorValue.textContent = designSettings.primaryColor;

      const sidebarBg = document.getElementById('designSidebarBg');
      const sidebarBgValue = document.getElementById('designSidebarBgValue');
      if (sidebarBg) sidebarBg.value = designSettings.sidebarBg;
      if (sidebarBgValue) sidebarBgValue.textContent = designSettings.sidebarBg;

      // 폰트
      const fontFamily = document.getElementById('designFontFamily');
      if (fontFamily) fontFamily.value = designSettings.fontFamily;

      // 슬라이더
      const navWidth = document.getElementById('designNavWidth');
      const navWidthValue = document.getElementById('designNavWidthValue');
      if (navWidth) navWidth.value = designSettings.navWidth;
      if (navWidthValue) navWidthValue.textContent = designSettings.navWidth + 'px';

      const buttonRadius = document.getElementById('designButtonRadius');
      const buttonRadiusValue = document.getElementById('designButtonRadiusValue');
      if (buttonRadius) buttonRadius.value = designSettings.buttonRadius;
      if (buttonRadiusValue) buttonRadiusValue.textContent = designSettings.buttonRadius + 'px';

      const baseFontSize = document.getElementById('designBaseFontSize');
      const baseFontSizeValue = document.getElementById('designBaseFontSizeValue');
      if (baseFontSize) baseFontSize.value = designSettings.baseFontSize;
      if (baseFontSizeValue) baseFontSizeValue.textContent = designSettings.baseFontSize + 'px';

      const accentBtnBg = document.getElementById('designAccentBtnBg');
      const accentBtnBgValue = document.getElementById('designAccentBtnBgValue');
      if (accentBtnBg) accentBtnBg.value = designSettings.accentBtnBg;
      if (accentBtnBgValue) accentBtnBgValue.textContent = designSettings.accentBtnBg;

      const accentBtnColor = document.getElementById('designAccentBtnColor');
      const accentBtnColorValue = document.getElementById('designAccentBtnColorValue');
      if (accentBtnColor) accentBtnColor.value = designSettings.accentBtnColor;
      if (accentBtnColorValue) accentBtnColorValue.textContent = designSettings.accentBtnColor;

      const borderColor = document.getElementById('designBorderColor');
      const borderColorValue = document.getElementById('designBorderColorValue');
      if (borderColor) borderColor.value = designSettings.borderColor;
      if (borderColorValue) borderColorValue.textContent = designSettings.borderColor;

      const cardBg = document.getElementById('designCardBg');
      const cardBgValue = document.getElementById('designCardBgValue');
      if (cardBg) cardBg.value = designSettings.cardBg;
      if (cardBgValue) cardBgValue.textContent = designSettings.cardBg;

      const primaryBtnBg = document.getElementById('designPrimaryBtnBg');
      const primaryBtnBgValue = document.getElementById('designPrimaryBtnBgValue');
      if (primaryBtnBg) primaryBtnBg.value = designSettings.primaryBtnBg;
      if (primaryBtnBgValue) primaryBtnBgValue.textContent = designSettings.primaryBtnBg;

      const primaryBtnColor = document.getElementById('designPrimaryBtnColor');
      const primaryBtnColorValue = document.getElementById('designPrimaryBtnColorValue');
      if (primaryBtnColor) primaryBtnColor.value = designSettings.primaryBtnColor;
      if (primaryBtnColorValue) primaryBtnColorValue.textContent = designSettings.primaryBtnColor;

      const mobileTopbarBg = document.getElementById('designMobileTopbarBg');
      const mobileTopbarBgValue = document.getElementById('designMobileTopbarBgValue');
      if (mobileTopbarBg) mobileTopbarBg.value = designSettings.mobileTopbarBg;
      if (mobileTopbarBgValue) mobileTopbarBgValue.textContent = designSettings.mobileTopbarBg;

      const mobileTopbarBorder = document.getElementById('designMobileTopbarBorder');
      const mobileTopbarBorderValue = document.getElementById('designMobileTopbarBorderValue');
      if (mobileTopbarBorder) mobileTopbarBorder.value = designSettings.mobileTopbarBorder;
      if (mobileTopbarBorderValue) mobileTopbarBorderValue.textContent = designSettings.mobileTopbarBorder;

      const mobileTopbarText = document.getElementById('designMobileTopbarText');
      const mobileTopbarTextValue = document.getElementById('designMobileTopbarTextValue');
      if (mobileTopbarText) mobileTopbarText.value = designSettings.mobileTopbarText;
      if (mobileTopbarTextValue) mobileTopbarTextValue.textContent = designSettings.mobileTopbarText;
    }

    function updateDesign(key, value) {
      const numericKeys = ['navWidth', 'buttonRadius', 'baseFontSize'];
      if (numericKeys.indexOf(key) >= 0) {
        designSettings[key] = parseInt(value);
      } else {
        designSettings[key] = value;
      }

      // 실시간 미리보기 값 표시 갱신
      const valueEl = document.getElementById('design' + key.charAt(0).toUpperCase() + key.slice(1) + 'Value');
      if (valueEl) {
        if (numericKeys.indexOf(key) >= 0) {
          valueEl.textContent = designSettings[key] + 'px';
        } else {
          valueEl.textContent = designSettings[key];
        }
      }

      applyDesignSettings();
      saveDesignSettings();
    }

    function resetDesign() {
      showConfirm('초기화 확인', '디자인 설정을 기본값으로 되돌리시겠습니까?', function(confirmed) {
        if (confirmed) {
          designSettings = Object.assign({}, DESIGN_DEFAULTS);
          applyDesignSettings();
          saveDesignSettings();
          renderDesignSettings();
        }
      });
    }

    // ========================================
    // 습관 페이지
    // ========================================
    var habits = [];
    var habitLogs = [];
    var habitView = 'today';
    var habitSelectedDate = today();
    var habitWeekOffset = 0;
    var habitMonthOffset = 0;
    var habitDraft = null;
    var habitListSelected = [];
    var habitListPage = 1;
    var habitListPerPage = 12;
    var habitListSearch = '';
    var habitListSort = 'order';
    var habitMemoHabitId = null;
    var habitMemoDateStr = null;
    var habitMemosHabitId = null;
    var habitMemosPage = 1;
    var habitMemosPerPage = 6;

    function loadHabits() {
      try { habits = JSON.parse(localStorage.getItem('habits') || '[]'); } catch(e) { habits = []; }
      if (!Array.isArray(habits)) habits = [];
    }
    function saveHabits() {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
    function loadHabitLogs() {
      try { habitLogs = JSON.parse(localStorage.getItem('habitLogs') || '[]'); } catch(e) { habitLogs = []; }
      if (!Array.isArray(habitLogs)) habitLogs = [];
    }
    function saveHabitLogs() {
      localStorage.setItem('habitLogs', JSON.stringify(habitLogs));
    }

    function renderHabitPage() {
      var container = document.getElementById('habitPageContent');
      if (!container) return;
      var html = '<div class="habit-page">';
      html += '<div class="tab-nav" id="habitTabNav">';
      html += '<button class="tab-btn' + (habitView === 'today' ? ' active' : '') + '" onclick="switchHabitView(\'today\')">오늘</button>';
      html += '<button class="tab-btn' + (habitView === 'week' ? ' active' : '') + '" onclick="switchHabitView(\'week\')">주별</button>';
      html += '<button class="tab-btn' + (habitView === 'month' ? ' active' : '') + '" onclick="switchHabitView(\'month\')">월별</button>';
      html += '<button class="tab-btn' + (habitView === 'list' ? ' active' : '') + '" onclick="switchHabitView(\'list\')">습관 목록</button>';
      html += '</div>';
      html += '<div id="habitViewContent"></div>';
      html += '</div>';
      container.innerHTML = html;
      renderHabitView();
    }

    function switchHabitView(view) {
      habitView = view;
      document.querySelectorAll('#habitTabNav .tab-btn').forEach(function(btn, i) {
        btn.classList.toggle('active', i === ['today','week','month','list'].indexOf(view));
      });
      renderHabitView();
    }

    function renderHabitView() {
      if (habitView === 'today') renderHabitToday();
      else if (habitView === 'week') renderHabitWeek();
      else if (habitView === 'month') renderHabitMonth();
      else renderHabitList();
    }

    function habitGoToDate(dateStr) {
      habitSelectedDate = dateStr;
      switchHabitView('today');
    }

    // 날짜 문자열로 영어 요일 이름 반환 (MON~SUN)
    function getHabitDayName(dateStr) {
      var d = new Date(dateStr + 'T12:00:00');
      return WEEKDAYS_EN[(d.getDay() + 6) % 7];
    }

    function isHabitScheduledOn(habit, dateStr) {
      if (!habit.weekdays || habit.weekdays.length === 0) return true;
      return habit.weekdays.indexOf(getHabitDayName(dateStr)) >= 0;
    }

    function isHabitDone(habitId, dateStr) {
      return habitLogs.some(function(log) {
        return log.habitId === habitId && log.date === dateStr && log.done;
      });
    }

    function toggleHabitDone(habitId, dateStr) {
      var existingIdx = -1;
      for (var i = 0; i < habitLogs.length; i++) {
        if (habitLogs[i].habitId === habitId && habitLogs[i].date === dateStr) { existingIdx = i; break; }
      }
      if (existingIdx >= 0) {
        habitLogs.splice(existingIdx, 1);
      } else {
        habitLogs.push({ id: generateId(), habitId: habitId, date: dateStr, done: true });
      }
      saveHabitLogs();
      renderHabitView();
    }

    function habitCheckSVG(done, color, size) {
      size = size || 22;
      if (done) {
        return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 22 22"><circle cx="11" cy="11" r="10" fill="' + color + '" stroke="' + color + '" stroke-width="1.5"/><path d="M6 11.5l3.5 3.5 6.5-6.5" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
      }
      return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 22 22"><circle cx="11" cy="11" r="10" fill="none" stroke="var(--border-color)" stroke-width="1.5"/></svg>';
    }

    // ---- 오늘 뷰 ----
    function renderHabitToday() {
      var c = document.getElementById('habitViewContent');
      if (!c) return;
      var todayStr = today();
      var prevDate = addDays(habitSelectedDate, -1);
      var nextDate = addDays(habitSelectedDate, 1);
      var activeHabits = habits.filter(function(h) { return h.active && isHabitScheduledOn(h, habitSelectedDate); });
      var doneCount = activeHabits.filter(function(h) { return isHabitDone(h.id, habitSelectedDate); }).length;
      var total = activeHabits.length;
      var pct = total > 0 ? Math.round(doneCount / total * 100) : 0;

      var html = '<div class="habit-today">';
      html += '<div class="work-date-nav">';
      html += '<button class="btn-icon" onclick="habitGoToDate(\'' + prevDate + '\')">&#8249;</button>';
      html += '<div style="text-align:center;">';
      html += '<div class="work-today-date">' + formatDateKR(habitSelectedDate) + '</div>';
      if (habitSelectedDate !== todayStr) html += '<button class="btn-text" style="font-size:11px;color:var(--text-secondary);background:none;border:none;cursor:pointer;" onclick="habitGoToDate(\'' + todayStr + '\')">오늘로 이동</button>';
      html += '</div>';
      html += '<button class="btn-icon" onclick="habitGoToDate(\'' + nextDate + '\')">&#8250;</button>';
      html += '</div>';

      if (total > 0) {
        html += '<div class="habit-today-stats">' + doneCount + ' / ' + total + ' 완료</div>';
        html += '<div class="habit-progress-wrap"><div class="habit-progress-bar" style="width:' + pct + '%"></div></div>';
      }

      if (activeHabits.length === 0) {
        html += '<div class="empty-state"><p>이 날 할 습관이 없습니다.</p><button class="btn-primary" onclick="switchHabitView(\'list\')">+ 습관 추가하기</button></div>';
      } else {
        html += '<div class="habit-today-list">';
        activeHabits.forEach(function(h) {
          var done = isHabitDone(h.id, habitSelectedDate);
          var color = h.color || '#ffde59';
          var log = habitLogs.find(function(l) { return l.habitId === h.id && l.date === habitSelectedDate; });
          html += '<div class="habit-today-item' + (done ? ' done' : '') + '">';
          html += '<div class="habit-today-check" onclick="toggleHabitDone(\'' + h.id + '\',\'' + habitSelectedDate + '\')">' + habitCheckSVG(done, color, 22) + '</div>';
          html += '<span class="habit-today-emoji" onclick="openHabitMemoModal(\'' + h.id + '\',\'' + habitSelectedDate + '\')">' + renderEmoji(h.emoji) + '</span>';
          html += '<div class="habit-today-info" onclick="openHabitMemoModal(\'' + h.id + '\',\'' + habitSelectedDate + '\')">';
          html += '<div class="habit-today-name">' + h.name + '</div>';
          if (log && log.memo) html += '<div class="habit-today-memo-preview">' + escapeHtml(log.memo.substring(0, 32)) + (log.memo.length > 32 ? '…' : '') + '</div>';
          html += '</div>';
          html += '<button class="habit-memo-btn' + (log && log.memo ? ' has-memo' : '') + '" onclick="event.stopPropagation();openHabitMemoModal(\'' + h.id + '\',\'' + habitSelectedDate + '\')">&#9998;</button>';
          html += '</div>';
        });
        html += '</div>';
        if (doneCount === total && total > 0) {
          html += '<div class="habit-all-done">🎉 오늘 모든 습관 완료!</div>';
        }
      }
      html += '</div>';
      c.innerHTML = html;
    }

    // ---- 주별 뷰 ----
    function renderHabitWeek() {
      var c = document.getElementById('habitViewContent');
      if (!c) return;
      var baseMonday = getMondayOf(today());
      var monday = addDays(baseMonday, habitWeekOffset * 7);
      var sunday = addDays(monday, 6);
      var todayStr = today();
      var dayNames = ['월','화','수','목','금','토','일'];

      var html = '<div class="habit-week">';
      html += '<div class="work-nav">';
      html += '<button class="btn-icon" onclick="habitWeekMove(-1)">&#8249;</button>';
      var mParts = monday.split('-');
      var sParts = sunday.split('-');
      html += '<span class="work-nav-label">' + parseInt(mParts[1]) + '/' + parseInt(mParts[2]) + ' – ' + parseInt(sParts[1]) + '/' + parseInt(sParts[2]) + '</span>';
      html += '<button class="btn-icon" onclick="habitWeekMove(1)">&#8250;</button>';
      html += '</div>';
      if (habitWeekOffset !== 0) html += '<div class="today-jump-row"><button class="today-jump-btn" onclick="habitWeekMove(0)">오늘로 이동</button></div>';

      html += '<div class="habit-week-grid">';
      for (var i = 0; i < 7; i++) {
        var ds = addDays(monday, i);
        var isToday = ds === todayStr;
        var dp = ds.split('-');
        var dayHabits = habits.filter(function(h) { return h.active && isHabitScheduledOn(h, ds); });
        var doneHabits = dayHabits.filter(function(h) { return isHabitDone(h.id, ds); });

        html += '<div class="habit-week-col' + (isToday ? ' is-today' : '') + '">';
        html += '<div class="habit-week-day-header" onclick="habitGoToDate(\'' + ds + '\')">';
        html += '<span class="habit-week-day-name">' + dayNames[i] + '</span>';
        html += '<span class="habit-week-day-num">' + parseInt(dp[2]) + '</span>';
        if (dayHabits.length > 0) html += '<span class="habit-week-day-count">' + doneHabits.length + '/' + dayHabits.length + '</span>';
        html += '</div>';

        html += '<div class="habit-week-day-body">';
        if (dayHabits.length === 0) {
          html += '<div class="habit-week-empty">-</div>';
        } else {
          dayHabits.forEach(function(h) {
            var done = isHabitDone(h.id, ds);
            var color = h.color || '#ffde59';
            html += '<div class="habit-week-item" onclick="event.stopPropagation();toggleHabitDoneWeek(\'' + h.id + '\',\'' + ds + '\')">';
            html += habitCheckSVG(done, color, 18);
            html += '<span class="habit-week-item-name">' + h.name + '</span>';
            html += '</div>';
          });
        }
        html += '</div></div>';
      }
      html += '</div></div>';
      c.innerHTML = html;
    }

    function toggleHabitDoneWeek(habitId, dateStr) {
      var existingIdx = -1;
      for (var i = 0; i < habitLogs.length; i++) {
        if (habitLogs[i].habitId === habitId && habitLogs[i].date === dateStr) { existingIdx = i; break; }
      }
      if (existingIdx >= 0) habitLogs.splice(existingIdx, 1);
      else habitLogs.push({ id: generateId(), habitId: habitId, date: dateStr, done: true });
      saveHabitLogs();
      renderHabitWeek();
    }

    function habitWeekMove(delta) {
      if (delta === 0) habitWeekOffset = 0;
      else habitWeekOffset += delta;
      renderHabitWeek();
    }

    // ---- 월별 뷰 ----
    function renderHabitMonth() {
      var c = document.getElementById('habitViewContent');
      if (!c) return;
      var now = new Date();
      var yr = now.getFullYear();
      var mo = now.getMonth() + 1 + habitMonthOffset;
      while (mo > 12) { mo -= 12; yr++; }
      while (mo < 1)  { mo += 12; yr--; }
      var todayStr = today();
      var daysInMonth = new Date(yr, mo, 0).getDate();
      var firstDay = new Date(yr, mo - 1, 1).getDay();
      var firstDayKR = (firstDay === 0) ? 6 : firstDay - 1;
      var monthNames = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

      var html = '<div class="habit-month">';
      html += '<div class="work-nav">';
      html += '<button class="btn-icon" onclick="habitMonthMove(-1)">&#8249;</button>';
      html += '<span class="work-nav-label">' + yr + '년 ' + monthNames[mo - 1] + '</span>';
      html += '<button class="btn-icon" onclick="habitMonthMove(1)">&#8250;</button>';
      html += '</div>';
      if (habitMonthOffset !== 0) html += '<div class="today-jump-row"><button class="today-jump-btn" onclick="habitMonthMove(0)">오늘로 이동</button></div>';

      html += '<div class="work-cal">';
      ['월','화','수','목','금','토','일'].forEach(function(d, i) {
        html += '<div class="work-cal-head' + (i >= 5 ? ' weekend' : '') + '">' + d + '</div>';
      });
      for (var blank = 0; blank < firstDayKR; blank++) html += '<div class="work-cal-cell empty"></div>';

      for (var day = 1; day <= daysInMonth; day++) {
        var ds = yr + '-' + String(mo).padStart(2, '0') + '-' + String(day).padStart(2, '0');
        var isToday = ds === todayStr;
        var isFuture = ds > todayStr;
        var dow = (firstDayKR + day - 1) % 7;
        var isWeekend = (dow === 5 || dow === 6);
        var scheduled = habits.filter(function(h) { return h.active && isHabitScheduledOn(h, ds); });
        var doneH = scheduled.filter(function(h) { return isHabitDone(h.id, ds); });
        var pct = scheduled.length > 0 ? doneH.length / scheduled.length : -1;

        var cellClass = 'work-cal-cell' + (isToday ? ' is-today' : '') + (isWeekend ? ' weekend' : '') + (scheduled.length > 0 && !isFuture ? ' has-items' : '');
        var bg = '';
        if (!isFuture && scheduled.length > 0) {
          if (pct === 1) bg = 'background:rgba(76,175,80,0.18);';
          else if (pct > 0) bg = 'background:rgba(255,222,89,0.35);';
        }
        html += '<div class="' + cellClass + '" style="' + bg + '" onclick="habitGoToDate(\'' + ds + '\')">';
        html += '<div class="work-cal-date">' + day + '</div>';
        if (!isFuture && scheduled.length > 0) {
          html += '<div class="work-dots" style="justify-content:center;flex-wrap:wrap;">';
          scheduled.slice(0, 5).forEach(function(h) {
            var done = isHabitDone(h.id, ds);
            var color = done ? (h.color || '#ffde59') : 'var(--border-color)';
            html += '<span class="work-dot-lg" style="background:' + color + '">' + (done ? '&#10003;' : '') + '</span>';
          });
          if (scheduled.length > 5) html += '<span class="work-dot-more">+' + (scheduled.length - 5) + '</span>';
          html += '</div>';
        }
        html += '</div>';
      }
      html += '</div></div>';
      c.innerHTML = html;
    }

    function habitMonthMove(delta) {
      if (delta === 0) habitMonthOffset = 0;
      else habitMonthOffset += delta;
      renderHabitMonth();
    }

    // ---- 습관 목록 뷰 ----
    function renderHabitList() {
      var c = document.getElementById('habitViewContent');
      if (!c) return;
      var selCount = habitListSelected.length;

      var filtered = habits.filter(function(h) {
        if (!habitListSearch) return true;
        var q = habitListSearch.toLowerCase();
        return h.name.toLowerCase().indexOf(q) >= 0;
      });
      if (habitListSort === 'name') filtered.sort(function(a, b) { return a.name > b.name ? 1 : -1; });
      else if (habitListSort === 'streak') filtered.sort(function(a, b) { return calcHabitStreak(b) - calcHabitStreak(a); });
      else filtered.sort(function(a, b) { return (a.order || 0) - (b.order || 0); });

      var total = filtered.length;
      var totalPages = Math.max(1, Math.ceil(total / habitListPerPage));
      if (habitListPage > totalPages) habitListPage = totalPages;
      var start = (habitListPage - 1) * habitListPerPage;
      var pageItems = filtered.slice(start, start + habitListPerPage);
      var allPageIds = pageItems.map(function(h) { return h.id; });
      var allSel = allPageIds.length > 0 && allPageIds.every(function(id) { return habitListSelected.indexOf(id) >= 0; });

      var html = '<div class="habit-list-wrap">';

      /* ── 컨트롤 바 (검색/정렬 + 추가 버튼) ── */
      html += '<div class="work-list-controls" style="display:flex;gap:8px;align-items:center;margin-bottom:10px;">';
      html += '<input class="input-field" style="flex:1;min-width:0;height:34px;padding:6px 10px;font-size:13px;" placeholder="습관 검색..." value="' + escapeHtml(habitListSearch) + '" oninput="habitListSetSearch(this.value)">';
      html += '<select class="input-field" style="width:auto;height:34px;padding:4px 8px;font-size:13px;" onchange="habitListSetSort(this.value)">';
      html += '<option value="order"' + (habitListSort==='order'?' selected':'') + '>등록순</option>';
      html += '<option value="name"' + (habitListSort==='name'?' selected':'') + '>이름순</option>';
      html += '<option value="streak"' + (habitListSort==='streak'?' selected':'') + '>연속일순</option>';
      html += '</select>';
      html += '<button class="btn-confirm" style="white-space:nowrap;flex-shrink:0;" onclick="openHabitForm(null)">+ 습관 추가</button>';
      html += '</div>';

      /* ── 선택 바 ── */
      html += '<div class="basket-select-bar" style="margin-bottom:8px;">';
      html += '<label class="basket-select-all-label"><input type="checkbox" id="habitSelectAll"' + (allSel ? ' checked' : '') + ' onchange="habitListToggleAll(this.checked)"> 전체 선택</label>';
      if (selCount > 0) {
        html += '<span class="basket-selected-count">' + selCount + '개 선택</span>';
        if (selCount === 1) html += '<button class="btn-cancel" style="padding:3px 8px;font-size:12px;" onclick="habitListEditSelected()">✏️ 수정</button>';
        html += '<button class="btn-cancel" style="padding:3px 8px;font-size:12px;color:#e53e3e;" onclick="habitListDeleteSelected()">🗑 삭제</button>';
        html += '<button class="btn-cancel" style="padding:3px 8px;font-size:12px;" onclick="habitListClearSelect()">취소</button>';
      }
      html += '</div>';

      if (habits.length === 0) {
        html += '<div class="empty-state"><p>아직 등록된 습관이 없습니다.</p></div>';
      } else if (pageItems.length === 0) {
        html += '<div class="empty-state"><p>검색 결과가 없습니다.</p></div>';
      } else {
        html += '<div class="habit-grid">';
        pageItems.forEach(function(h) {
          var wdLabels = (h.weekdays && h.weekdays.length > 0 && h.weekdays.length < 7)
            ? h.weekdays.map(function(w) { return WEEKDAYS_KR[WEEKDAYS_EN.indexOf(w)]; }).join(' ')
            : '매일';
          var streak = calcHabitStreak(h);
          var memoCount = habitLogs.filter(function(l) { return l.habitId === h.id && l.memo; }).length;
          var isSel = habitListSelected.indexOf(h.id) >= 0;
          html += '<div class="habit-grid-card' + (isSel ? ' selected' : '') + '" onclick="habitGridToggleSelect(\'' + h.id + '\')">';
          html += '<input type="checkbox" class="habit-list-check" value="' + h.id + '"' + (isSel ? ' checked' : '') + ' onclick="event.stopPropagation()" onchange="habitListUpdateCheck(this)">';
          html += '<div class="habit-grid-emoji">' + renderEmoji(h.emoji) + '</div>';
          html += '<div class="habit-grid-name">' + h.name + '</div>';
          html += '<div class="habit-grid-meta"><span>' + wdLabels + '</span>';
          if (streak > 0) html += '<span>&#128293;' + streak + '일</span>';
          html += '</div>';
          if (memoCount > 0) html += '<button class="habit-memo-badge" onclick="event.stopPropagation();openHabitMemos(\'' + h.id + '\')">&#9998; 메모 ' + memoCount + '</button>';
          html += '<div class="habit-grid-color-bar" style="background:' + (h.color || '#ffde59') + '"></div>';
          html += '</div>';
        });
        html += '</div>';
      }

      html += buildGenericPagerBar({
        total: total, page: habitListPage, perPage: habitListPerPage,
        perPageOpts: [8, 12, 20, 40],
        goFn: 'goHabitListPage', setPerPageFn: 'setHabitListPerPage'
      });

      html += '</div>';
      c.innerHTML = html;
    }

    function habitListSetSearch(val) {
      habitListSearch = val;
      habitListPage = 1;
      renderHabitList();
    }

    function habitListSetSort(val) {
      habitListSort = val;
      habitListPage = 1;
      renderHabitList();
    }

    function habitListToggleAll(checked) {
      var c = document.getElementById('habitViewContent');
      if (!c) return;
      c.querySelectorAll('.habit-list-check').forEach(function(cb) {
        cb.checked = checked;
        var id = cb.value;
        var idx = habitListSelected.indexOf(id);
        if (checked && idx < 0) habitListSelected.push(id);
        else if (!checked && idx >= 0) habitListSelected.splice(idx, 1);
      });
      renderHabitList();
    }

    function goHabitListPage(page) {
      var total = habits.length;
      var totalPages = Math.max(1, Math.ceil(total / habitListPerPage));
      page = parseInt(page, 10);
      if (isNaN(page) || page < 1 || page > totalPages) return;
      habitListPage = page;
      renderHabitList();
    }

    function setHabitListPerPage(val) {
      habitListPerPage = parseInt(val, 10) || 12;
      habitListPage = 1;
      renderHabitList();
    }

    function habitGridToggleSelect(id) {
      var idx = habitListSelected.indexOf(id);
      if (idx >= 0) habitListSelected.splice(idx, 1);
      else habitListSelected.push(id);
      renderHabitList();
    }

    function habitListUpdateCheck(cb) {
      var id = cb.value;
      var idx = habitListSelected.indexOf(id);
      if (cb.checked && idx < 0) habitListSelected.push(id);
      else if (!cb.checked && idx >= 0) habitListSelected.splice(idx, 1);
      renderHabitList();
    }

    function habitListClearSelect() {
      habitListSelected = [];
      renderHabitList();
    }

    function habitListEditSelected() {
      if (habitListSelected.length !== 1) return;
      openHabitForm(habitListSelected[0]);
    }

    function habitListDeleteSelected() {
      if (habitListSelected.length === 0) return;
      var names = habitListSelected.map(function(id) {
        var h = habits.find(function(x) { return x.id === id; });
        return h ? h.name : id;
      }).join(', ');
      showConfirm('습관 삭제', habitListSelected.length + '개 습관을 삭제하시겠습니까? 관련 기록도 모두 삭제됩니다.', function(ok) {
        if (!ok) return;
        habitListSelected.forEach(function(id) {
          habits = habits.filter(function(h) { return h.id !== id; });
          habitLogs = habitLogs.filter(function(l) { return l.habitId !== id; });
        });
        habitListSelected = [];
        saveHabits();
        saveHabitLogs();
        renderHabitList();
        showToast('습관을 삭제했습니다.');
      });
    }

    // ---- 메모 모달 ----
    function openHabitMemoModal(habitId, dateStr) {
      var h = habits.find(function(x) { return x.id === habitId; });
      if (!h) return;
      var log = habitLogs.find(function(l) { return l.habitId === habitId && l.date === dateStr; });
      habitMemoHabitId = habitId;
      habitMemoDateStr = dateStr;
      document.getElementById('habitMemoHabitName').textContent = (h.emoji || '') + ' ' + h.name;
      document.getElementById('habitMemoDate').textContent = formatDateKR(dateStr);
      document.getElementById('habitMemoCheck').checked = !!log;
      document.getElementById('habitMemoInput').value = (log && log.memo) ? log.memo : '';
      var modal = document.getElementById('habitMemoModal');
      modal.style.display = 'flex';
      bringModalToFront(modal);
      setTimeout(function() { document.getElementById('habitMemoInput').focus(); }, 80);
    }

    function closeHabitMemoModal() {
      document.getElementById('habitMemoModal').style.display = 'none';
      habitMemoHabitId = null;
      habitMemoDateStr = null;
    }

    function saveHabitMemo() {
      if (!habitMemoHabitId || !habitMemoDateStr) return;
      var isDone = document.getElementById('habitMemoCheck').checked;
      var memo = document.getElementById('habitMemoInput').value.trim();
      var existingIdx = -1;
      for (var i = 0; i < habitLogs.length; i++) {
        if (habitLogs[i].habitId === habitMemoHabitId && habitLogs[i].date === habitMemoDateStr) { existingIdx = i; break; }
      }
      if (isDone || memo) {
        if (existingIdx >= 0) {
          habitLogs[existingIdx].done = isDone;
          habitLogs[existingIdx].memo = memo;
        } else {
          habitLogs.push({ id: generateId(), habitId: habitMemoHabitId, date: habitMemoDateStr, done: isDone, memo: memo });
        }
      } else {
        if (existingIdx >= 0) habitLogs.splice(existingIdx, 1);
      }
      saveHabitLogs();
      closeHabitMemoModal();
      renderHabitView();
    }

    // ---- 메모 목록 모달 ----
    function openHabitMemos(habitId) {
      habitMemosHabitId = habitId;
      habitMemosPage = 1;
      var h = habits.find(function(x) { return x.id === habitId; });
      if (!h) return;
      document.getElementById('habitMemosTitle').textContent = (h.emoji || '') + ' ' + h.name + ' 메모';
      renderHabitMemosList();
      var modal = document.getElementById('habitMemosModal');
      modal.style.display = 'flex';
      bringModalToFront(modal);
    }

    function renderHabitMemosList() {
      var content = document.getElementById('habitMemosContent');
      if (!content) return;
      var h = habits.find(function(x) { return x.id === habitMemosHabitId; });
      var memoLogs = habitMemosHabitId
        ? habitLogs.filter(function(l) { return l.habitId === habitMemosHabitId && l.memo; })
        : [];
      memoLogs.sort(function(a, b) { return b.date > a.date ? 1 : -1; });
      var total = memoLogs.length;
      if (total === 0) {
        content.innerHTML = '<div class="empty-state" style="padding:16px 0;"><p>메모가 없습니다.</p></div>';
        return;
      }
      var totalPages = Math.max(1, Math.ceil(total / habitMemosPerPage));
      if (habitMemosPage > totalPages) habitMemosPage = totalPages;
      var start = (habitMemosPage - 1) * habitMemosPerPage;
      var pageItems = memoLogs.slice(start, start + habitMemosPerPage);
      var html = pageItems.map(function(l) {
        return '<div class="habit-memos-item">'
          + '<div class="habit-memos-date">' + formatDateKR(l.date) + (l.done ? ' &#9989;' : '') + '</div>'
          + '<div class="habit-memos-text">' + escapeHtml(l.memo) + '</div>'
          + '</div>';
      }).join('');
      if (totalPages > 1) {
        html += buildGenericPagerBar({
          total: total, page: habitMemosPage, perPage: habitMemosPerPage,
          perPageOpts: [4, 6, 10],
          goFn: 'goHabitMemosPage', setPerPageFn: 'setHabitMemosPerPage'
        });
      }
      content.innerHTML = html;
    }

    function goHabitMemosPage(page) {
      var total = habitLogs.filter(function(l) { return l.habitId === habitMemosHabitId && l.memo; }).length;
      var totalPages = Math.max(1, Math.ceil(total / habitMemosPerPage));
      page = parseInt(page, 10);
      if (isNaN(page) || page < 1 || page > totalPages) return;
      habitMemosPage = page;
      renderHabitMemosList();
    }

    function setHabitMemosPerPage(val) {
      habitMemosPerPage = parseInt(val, 10) || 6;
      habitMemosPage = 1;
      renderHabitMemosList();
    }

    function closeHabitMemos() {
      document.getElementById('habitMemosModal').style.display = 'none';
      habitMemosHabitId = null;
    }

    function calcHabitStreak(h) {
      var streak = 0;
      var checkD = new Date(today() + 'T12:00:00');
      for (var s = 0; s < 365; s++) {
        var sds = checkD.getFullYear() + '-' + String(checkD.getMonth()+1).padStart(2,'0') + '-' + String(checkD.getDate()).padStart(2,'0');
        if (isHabitScheduledOn(h, sds)) {
          if (isHabitDone(h.id, sds)) streak++;
          else break;
        }
        checkD.setDate(checkD.getDate() - 1);
      }
      return streak;
    }

    function openHabitForm(id) {
      var existing = id ? habits.find(function(h) { return h.id === id; }) : null;
      habitDraft = existing
        ? { id: existing.id, emoji: existing.emoji, name: existing.name,
            weekdays: (existing.weekdays || []).slice(), color: existing.color || '#ffde59' }
        : { id: null, emoji: '✅', name: '', weekdays: ['MON','TUE','WED','THU','FRI','SAT','SUN'], color: '#ffde59' };
      document.getElementById('habitFormTitle').textContent = id ? '습관 편집' : '습관 추가';
      document.getElementById('habitEmojiBtn').innerHTML = renderEmoji(habitDraft.emoji);
      document.getElementById('habitNameInput').value = habitDraft.name;
      document.getElementById('habitColorInput').value = habitDraft.color;
      var swatchEl = document.getElementById('habitColorSwatch');
      if (swatchEl) swatchEl.style.background = habitDraft.color;
      renderHabitWeekdayToggles();
      var modal = document.getElementById('habitFormModal');
      modal.style.display = 'flex';
      bringModalToFront(modal);
      setTimeout(function() { document.getElementById('habitNameInput').focus(); }, 50);
    }

    function closeHabitForm() {
      document.getElementById('habitFormModal').style.display = 'none';
      habitDraft = null;
    }

    function openHabitFormEmojiPicker() {
      if (!habitDraft) return;
      openEmojiPicker(habitDraft.emoji, function(emoji) {
        habitDraft.emoji = emoji;
        document.getElementById('habitEmojiBtn').innerHTML = renderEmoji(emoji);
      });
    }

    function renderHabitWeekdayToggles() {
      var container = document.getElementById('habitWeekdayToggles');
      if (!container || !habitDraft) return;
      var html = '';
      WEEKDAYS_EN.forEach(function(day, i) {
        var active = habitDraft.weekdays.indexOf(day) >= 0;
        html += '<button type="button" class="habit-wd-btn' + (active ? ' active' : '') + '" onclick="habitToggleWeekday(\'' + day + '\')">' + WEEKDAYS_KR[i] + '</button>';
      });
      container.innerHTML = html;
    }

    function habitToggleWeekday(day) {
      if (!habitDraft) return;
      var idx = habitDraft.weekdays.indexOf(day);
      if (idx >= 0) habitDraft.weekdays.splice(idx, 1);
      else habitDraft.weekdays.push(day);
      renderHabitWeekdayToggles();
    }

    function saveHabitForm() {
      if (!habitDraft) return;
      var name = document.getElementById('habitNameInput').value.trim();
      if (!name) { document.getElementById('habitNameInput').focus(); return; }
      habitDraft.name = name;
      habitDraft.color = document.getElementById('habitColorInput').value;
      if (habitDraft.weekdays.length === 0) habitDraft.weekdays = ['MON','TUE','WED','THU','FRI','SAT','SUN'];

      if (habitDraft.id) {
        var idx = -1;
        for (var i = 0; i < habits.length; i++) { if (habits[i].id === habitDraft.id) { idx = i; break; } }
        if (idx >= 0) Object.assign(habits[idx], { emoji: habitDraft.emoji, name: habitDraft.name, weekdays: habitDraft.weekdays, color: habitDraft.color });
        showToast('습관을 수정했습니다.', 'success');
      } else {
        habits.push({ id: generateId(), emoji: habitDraft.emoji, name: habitDraft.name,
          weekdays: habitDraft.weekdays, color: habitDraft.color, active: true, order: habits.length, createdAt: today() });
        showToast('습관을 추가했습니다.', 'success');
      }
      saveHabits();
      closeHabitForm();
      renderHabitView();
    }

    function deleteHabit(id) {
      var habit = habits.find(function(h) { return h.id === id; });
      if (!habit) return;
      showConfirm('삭제 확인', habit.name + ' 습관을 삭제하시겠습니까? 관련 기록도 모두 삭제됩니다.', function(confirmed) {
        if (!confirmed) return;
        habits = habits.filter(function(h) { return h.id !== id; });
        habitLogs = habitLogs.filter(function(l) { return l.habitId !== id; });
        saveHabits();
        saveHabitLogs();
        renderHabitList();
        showToast('습관을 삭제했습니다.', 'success');
      });
    }

    // ========================================
    // 일(업무) 페이지
    // ========================================
    var workView = 'today';
    var workWeekOffset = 0;
    var workMonthOffset = 0;
    var workSelectedDate = today();
    var workBasketPage = 1;
    var workBasketPerPage = 12;
    var workBasketSearch = '';
    var workBasketSort = 'default';
    var __workDragId = null;
    var __workDragSrcStatus = null;
    var __workDragTargetId = null;
    var __workDragInsertBefore = false;
    var __wieEmoji = {};

    var WORK_COLOR_PALETTE = [
      '#ff6b6b','#ff8e53','#ffc045','#a8e6cf','#56cfb2',
      '#4ecdc4','#45b7d1','#74b9ff','#6c5ce7','#a29bfe',
      '#fd79a8','#e84393','#00b894','#fdcb6e','#dfe6e9'
    ];

    function emojiToWorkColor(emoji) {
      var s = emoji || '📋';
      var hash = 0;
      for (var i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) | 0;
      return WORK_COLOR_PALETTE[Math.abs(hash) % WORK_COLOR_PALETTE.length];
    }

    var workItems = [];
    var workItemDraft = null;
    var workItemEditId = null;

    function getWorkStatus(item) {
      if (item.status) return item.status;
      return item.completed ? 'done' : 'pending';
    }
    function workStatusSVG(status, size) {
      size = size || 18;
      if (status === 'done') return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#56cfb2"/><polyline points="6,10 9,13 14,7" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      if (status === 'in-progress') return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="none" stroke="#fdcb6e" stroke-width="1.5"/><line x1="6" y1="10" x2="14" y2="10" stroke="#fdcb6e" stroke-width="2" stroke-linecap="round"/></svg>';
      return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="none" stroke="#ccc" stroke-width="1.5"/></svg>';
    }
    function getCompletedNormalCount(dateStr) {
      return workItems.filter(function(it) { return it.date === dateStr && !it.isBonus && getWorkStatus(it) === 'done'; }).length;
    }
    function getBonusUsedCount(dateStr) {
      return workItems.filter(function(it) { return it.date === dateStr && it.isBonus; }).length;
    }
    function getAvailableBonusSlots(dateStr) {
      return Math.max(0, getCompletedNormalCount(dateStr) - getBonusUsedCount(dateStr));
    }
    function setWorkItemStatus(id, newStatus) {
      var item = workItems.find(function(it) { return it.id === id; });
      if (!item) return;
      var dateStr = item.date;
      var oldStatus = getWorkStatus(item);
      if (oldStatus === newStatus) return;
      if (oldStatus === 'done' && newStatus !== 'done' && dateStr && !item.isBonus) {
        var bonusUsed = getBonusUsedCount(dateStr);
        var completedCnt = getCompletedNormalCount(dateStr);
        if (completedCnt - 1 < bonusUsed) {
          showToast('보너스 할일이 이 완료에 묶여 있어 완료 취소할 수 없습니다', 'warning');
          return;
        }
      }
      item.status = newStatus;
      item.completed = (newStatus === 'done');
      saveWorkItems();
      renderWorkView();
      showToast(newStatus === 'done' ? '✅ 완료!' : newStatus === 'in-progress' ? '⏳ 진행 중' : '↩ 시작 전으로');
    }
    function toggleWorkItemStatus(id) {
      var item = workItems.find(function(it) { return it.id === id; });
      if (!item) return;
      var cur = getWorkStatus(item);
      setWorkItemStatus(id, cur === 'done' ? 'pending' : 'done');
    }

    function loadWorkItems() {
      try { workItems = JSON.parse(localStorage.getItem('workItems') || '[]'); }
      catch(e) { workItems = []; }
      workItems.forEach(function(it) {
        if (!it.status) it.status = it.completed ? 'done' : 'pending';
      });
    }

    function saveWorkItems() {
      localStorage.setItem('workItems', JSON.stringify(workItems));
    }

    function getMondayOf(dateStr) {
      var d = new Date(dateStr + 'T00:00:00');
      var day = d.getDay();
      var diff = (day === 0) ? -6 : 1 - day;
      d.setDate(d.getDate() + diff);
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    function addDays(dateStr, n) {
      var d = new Date(dateStr + 'T00:00:00');
      d.setDate(d.getDate() + n);
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    function formatDateKR(dateStr) {
      var d = new Date(dateStr + 'T00:00:00');
      var days = ['일','월','화','수','목','금','토'];
      return (d.getMonth() + 1) + '월 ' + d.getDate() + '일 (' + days[d.getDay()] + ')';
    }

    function renderWorkPage() {
      var container = document.getElementById('workPageContent');
      if (!container) return;
      var basketCount = workItems.filter(function(it) { return !it.date; }).length;
      var html = '<div class="work-page">';
      html += '<div class="tab-nav" id="workTabNav">';
      html += '<button class="tab-btn' + (workView === 'today' ? ' active' : '') + '" onclick="switchWorkView(\'today\')">오늘</button>';
      html += '<button class="tab-btn' + (workView === 'week' ? ' active' : '') + '" onclick="switchWorkView(\'week\')">주별</button>';
      html += '<button class="tab-btn' + (workView === 'month' ? ' active' : '') + '" onclick="switchWorkView(\'month\')">월별</button>';
      html += '<button class="tab-btn' + (workView === 'basket' ? ' active' : '') + '" onclick="switchWorkView(\'basket\')">🧺 할일 바구니' + (basketCount > 0 ? ' <span class="work-basket-tab-count">' + basketCount + '</span>' : '') + '</button>';
      html += '</div>';
      html += '<div id="workViewContent"></div>';
      html += '</div>';
      container.innerHTML = html;
      renderWorkView();
    }

    function switchWorkView(view) {
      workView = view;
      var labels = { today: '오늘', week: '주별', month: '월별' };
      document.querySelectorAll('#workTabNav .tab-btn').forEach(function(btn, i) {
        btn.classList.toggle('active', i === ['today','week','month','basket'].indexOf(view));
      });
      renderWorkView();
    }

    function renderWorkView() {
      if (workView === 'today') renderWorkToday();
      else if (workView === 'week') renderWorkWeek();
      else if (workView === 'basket') renderWorkBasketTab();
      else renderWorkMonth();
    }

    function renderWorkKanbanCard(item) {
      var color = item.color || emojiToWorkColor(item.emoji || '📋');
      var status = getWorkStatus(item);
      var isDone = status === 'done';
      var html = '<div class="work-kanban-card' + (isDone ? ' done' : '') + (item.isBonus ? ' bonus' : '') + '"'
        + ' data-id="' + item.id + '"'
        + ' style="border-left:3px solid ' + color + '"'
        + ' draggable="true"'
        + ' ondragstart="workDragStart(event,\'' + item.id + '\',\'' + status + '\')"'
        + ' ondragend="workDragEnd(event)"'
        + ' onclick="workToggleInlineEdit(\'' + item.id + '\')">';
      html += '<div style="display:flex;align-items:flex-start;gap:8px;">';
      html += '<span style="font-size:20px;min-width:24px;text-align:center;flex-shrink:0;">' + (item.emoji || '📋') + '</span>';
      html += '<div style="flex:1;min-width:0;">';
      if (item.isBonus) html += '<span style="font-size:10px;color:#fdcb6e;font-weight:700;">⭐ 보너스 </span>';
      html += '<div class="work-kanban-title' + (isDone ? ' done' : '') + '">' + escapeHtml(item.title) + '</div>';
      if (item.memo) html += '<div class="work-kanban-memo">' + escapeHtml(item.memo.substring(0, 50)) + (item.memo.length > 50 ? '…' : '') + '</div>';
      html += '</div>';
      html += '</div>';
      html += '</div>';
      return html;
    }

    function renderWorkWeekMiniCard(item) {
      var color = item.color || emojiToWorkColor(item.emoji || '📋');
      var status = getWorkStatus(item);
      return '<div class="work-week-mini-card' + (status === 'done' ? ' done' : '') + '"'
        + ' style="border-left:2px solid ' + color + '"'
        + ' onclick="event.stopPropagation();workGoToDate(\'' + item.date + '\')"'
        + ' title="' + escapeHtml(item.title) + '">'
        + '<span class="work-mini-emoji">' + (item.emoji || '📋') + '</span>'
        + '<span class="work-mini-title">' + escapeHtml(item.title) + '</span>'
        + '<span class="work-mini-status" onclick="event.stopPropagation();toggleWorkItemStatus(\'' + item.id + '\')">' + workStatusSVG(status, 16) + '</span>'
        + '</div>';
    }

    function renderWorkToday() {
      var c = document.getElementById('workViewContent');
      if (!c) return;
      var todayStr = today();
      var dateItems = workItems.filter(function(it) { return it.date === workSelectedDate; });
      var normalItems = dateItems.filter(function(it) { return !it.isBonus; });
      var bonusItems = dateItems.filter(function(it) { return it.isBonus; });
      var pendingItems = dateItems.filter(function(it) { return getWorkStatus(it) === 'pending'; });
      var inProgressItems = dateItems.filter(function(it) { return getWorkStatus(it) === 'in-progress'; });
      var doneItems = dateItems.filter(function(it) { return getWorkStatus(it) === 'done'; });
      var prevDate = addDays(workSelectedDate, -1);
      var nextDate = addDays(workSelectedDate, 1);
      var availBonus = getAvailableBonusSlots(workSelectedDate);
      var canAddNormal = normalItems.length < 3;

      var html = '<div class="work-today">';
      html += '<div class="work-date-nav">';
      html += '<button class="btn-icon" onclick="workGoToDate(\'' + prevDate + '\')">&#8249;</button>';
      html += '<div style="text-align:center;">';
      html += '<div class="work-today-date">' + formatDateKR(workSelectedDate) + '</div>';
      if (workSelectedDate !== todayStr) html += '<button class="btn-text" style="font-size:11px;color:var(--text-secondary);background:none;border:none;cursor:pointer;" onclick="workGoToDate(\'' + todayStr + '\')">오늘로 이동</button>';
      html += '</div>';
      html += '<button class="btn-icon" onclick="workGoToDate(\'' + nextDate + '\')">&#8250;</button>';
      html += '</div>';
      html += '<div class="work-today-stats">' + normalItems.length + '/3';
      if (bonusItems.length > 0) html += ' &nbsp;⭐' + bonusItems.length;
      html += '</div>';

      html += '<div class="work-kanban">';
      [{ status:'pending', label:'시작 전', items:pendingItems },
       { status:'in-progress', label:'진행 중', items:inProgressItems },
       { status:'done', label:'완료', items:doneItems }
      ].forEach(function(col) {
        html += '<div class="work-kanban-col" data-status="' + col.status + '"'
          + ' ondragover="workDragOver(event)" ondragleave="workDragLeave(event)" ondrop="workDrop(event)">';
        html += '<div class="work-kanban-header"><span>' + col.label + '</span><span class="work-kanban-count">' + col.items.length + '</span></div>';
        html += '<div class="work-kanban-body">';
        col.items.forEach(function(item) { html += renderWorkKanbanCard(item); });
        if (col.items.length === 0) html += '<div class="work-kanban-empty">없음</div>';
        if (col.status === 'pending') {
          if (canAddNormal) html += '<button class="work-add-btn" onclick="showAddWorkItemModal(\'' + workSelectedDate + '\')">+ 할일 추가</button>';
          if (availBonus > 0) html += '<button class="work-add-btn work-add-bonus-btn" onclick="showAddBonusWorkItem(\'' + workSelectedDate + '\')">⭐ 보너스 할일 추가 (' + availBonus + '개)</button>';
        }
        html += '</div>';
        html += '</div>';
      });
      html += '</div>';
      html += '</div>';
      c.innerHTML = html;
    }

    function workGoToDate(dateStr) {
      workSelectedDate = dateStr;
      switchWorkView('today');
    }

    function toggleWorkItemComplete(id) { toggleWorkItemStatus(id); }

    function workToggleInlineEdit(id) {
      var existing = document.querySelector('.work-inline-edit');
      if (existing) {
        var existingId = existing.dataset.editId;
        workCloseInlineEdit();
        if (existingId === id) return;
      }
      var item = workItems.find(function(it) { return it.id === id; });
      if (!item) return;
      var cardEl = document.querySelector('.work-kanban-card[data-id="' + id + '"]');
      if (!cardEl) return;
      var editHtml = '<div class="work-inline-edit" data-edit-id="' + id + '">'
        + '<div class="work-form-row" style="margin-bottom:8px;">'
        + '<button class="work-form-emoji-btn" onclick="event.stopPropagation();workInlinePickEmoji(\'' + id + '\')" id="wieEBtn_' + id + '">' + (item.emoji || '📋') + '</button>'
        + '<input class="input-field work-form-input" id="wieTitle_' + id + '" placeholder="할일 제목" value="' + escapeHtml(item.title) + '"'
        + ' onkeydown="if(event.key===\'Enter\'){event.preventDefault();workSaveInlineEdit(\'' + id + '\');}if(event.key===\'Escape\')workCloseInlineEdit()">'
        + '</div>'
        + '<textarea class="input-field" style="width:100%;box-sizing:border-box;resize:none;min-height:52px;" rows="2" id="wieMemo_' + id + '" placeholder="메모 (선택)">' + escapeHtml(item.memo || '') + '</textarea>'
        + '<div class="work-form-row" style="margin-top:10px;justify-content:space-between;">'
        + '<button class="btn-cancel work-delete-btn" onclick="deleteWorkItem(\'' + id + '\')">삭제</button>'
        + '<div style="display:flex;gap:6px;">'
        + '<button class="btn-cancel" onclick="workCloseInlineEdit()">취소</button>'
        + '<button class="btn-confirm" onclick="workSaveInlineEdit(\'' + id + '\')">저장</button>'
        + '</div></div></div>';
      var tmp = document.createElement('div');
      tmp.innerHTML = editHtml;
      cardEl.parentNode.insertBefore(tmp.firstChild, cardEl);
      cardEl.style.display = 'none';
      setTimeout(function() { var t = document.getElementById('wieTitle_' + id); if (t) t.focus(); }, 50);
    }

    function workCloseInlineEdit() {
      var editEl = document.querySelector('.work-inline-edit');
      if (editEl) {
        var id = editEl.dataset.editId;
        editEl.remove();
        var cardEl = document.querySelector('.work-kanban-card[data-id="' + id + '"]');
        if (cardEl) cardEl.style.display = '';
      }
    }

    function workInlinePickEmoji(id) {
      var item = workItems.find(function(it) { return it.id === id; });
      openEmojiPicker(__wieEmoji[id] || (item ? item.emoji : '') || '📋', function(emoji) {
        if (!emoji) return;
        __wieEmoji[id] = emoji;
        var btn = document.getElementById('wieEBtn_' + id);
        if (btn) btn.innerHTML = renderEmoji(emoji);
      });
    }

    function workSaveInlineEdit(id) {
      var item = workItems.find(function(it) { return it.id === id; });
      if (!item) return;
      var titleEl = document.getElementById('wieTitle_' + id);
      var memoEl = document.getElementById('wieMemo_' + id);
      var title = titleEl ? titleEl.value.trim() : item.title;
      if (!title) { showToast('제목을 입력해주세요', 'warning'); return; }
      item.title = title;
      item.memo = memoEl ? memoEl.value.trim() : (item.memo || '');
      if (__wieEmoji[id]) { item.emoji = __wieEmoji[id]; item.color = emojiToWorkColor(item.emoji); delete __wieEmoji[id]; }
      saveWorkItems();
      workCloseInlineEdit();
      renderWorkView();
      showToast('저장했습니다');
    }

    function workDragStart(event, id, status) {
      __workDragId = id; __workDragSrcStatus = status;
      __workDragTargetId = null; __workDragInsertBefore = false;
      event.dataTransfer.effectAllowed = 'move';
      setTimeout(function() { var el = document.querySelector('.work-kanban-card[data-id="' + id + '"]'); if (el) el.style.opacity = '0.4'; }, 0);
    }
    function workDragEnd(event) {
      var el = document.querySelector('.work-kanban-card[data-id="' + __workDragId + '"]');
      if (el) el.style.opacity = '';
      document.querySelectorAll('.work-kanban-col.drag-over').forEach(function(c) { c.classList.remove('drag-over'); });
      document.querySelectorAll('.work-drop-indicator').forEach(function(d) { d.remove(); });
      __workDragId = null; __workDragSrcStatus = null; __workDragTargetId = null;
    }
    function workDragOver(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      var col = event.currentTarget;
      col.classList.add('drag-over');
      // Clear other columns' indicators
      document.querySelectorAll('.work-kanban-col').forEach(function(c) {
        if (c !== col) { c.classList.remove('drag-over'); c.querySelectorAll('.work-drop-indicator').forEach(function(d) { d.remove(); }); }
      });
      // Find hovered card
      var targetCard = event.target.closest ? event.target.closest('.work-kanban-card') : null;
      var body = col.querySelector('.work-kanban-body');
      if (!body) return;
      body.querySelectorAll('.work-drop-indicator').forEach(function(d) { d.remove(); });
      var line = document.createElement('div');
      line.className = 'work-drop-indicator';
      if (targetCard && targetCard.dataset.id !== __workDragId) {
        var rect = targetCard.getBoundingClientRect();
        var insertBefore = event.clientY < (rect.top + rect.height / 2);
        __workDragTargetId = targetCard.dataset.id;
        __workDragInsertBefore = insertBefore;
        if (insertBefore) {
          body.insertBefore(line, targetCard);
        } else {
          body.insertBefore(line, targetCard.nextSibling);
        }
      } else {
        __workDragTargetId = null;
        __workDragInsertBefore = false;
        body.appendChild(line);
      }
    }
    function workDragLeave(event) {
      var col = event.currentTarget;
      if (!col.contains(event.relatedTarget)) {
        col.classList.remove('drag-over');
        col.querySelectorAll('.work-drop-indicator').forEach(function(d) { d.remove(); });
      }
    }
    function workDrop(event) {
      event.preventDefault();
      var col = event.currentTarget;
      col.classList.remove('drag-over');
      col.querySelectorAll('.work-drop-indicator').forEach(function(d) { d.remove(); });
      var targetStatus = col.dataset.status;
      if (!__workDragId || !targetStatus) return;
      var item = workItems.find(function(it) { return it.id === __workDragId; });
      if (!item) return;
      var srcStatus = __workDragSrcStatus;

      if (targetStatus !== srcStatus) {
        // Cross-column: change status with bonus-lock check
        if (srcStatus === 'done' && targetStatus !== 'done' && item.date && !item.isBonus) {
          var bonusUsed = getBonusUsedCount(item.date);
          var completedCnt = getCompletedNormalCount(item.date);
          if (completedCnt - 1 < bonusUsed) {
            showToast('보너스 할일이 이 완료에 묶여 있어 완료 취소할 수 없습니다', 'warning');
            return;
          }
        }
        item.status = targetStatus;
        item.completed = (targetStatus === 'done');
        showToast(targetStatus === 'done' ? '✅ 완료!' : targetStatus === 'in-progress' ? '⏳ 진행 중' : '↩ 시작 전으로');
      } else if (__workDragTargetId && __workDragTargetId !== __workDragId) {
        // Within-column: reorder
        var dragIdx = workItems.findIndex(function(it) { return it.id === __workDragId; });
        workItems.splice(dragIdx, 1);
        var targetIdx = workItems.findIndex(function(it) { return it.id === __workDragTargetId; });
        var insertIdx = __workDragInsertBefore ? targetIdx : targetIdx + 1;
        workItems.splice(insertIdx, 0, item);
      } else {
        return; // same column, same position — no change
      }

      saveWorkItems();
      renderWorkView();
    }

    // ── 단계 B: 할일 추가/수정/삭제/상세 ──

    function showAddWorkItemModal(dateStr) {
      var targetDate = dateStr || null;
      if (targetDate) {
        var normalItems = workItems.filter(function(it) { return it.date === targetDate && !it.isBonus; });
        if (normalItems.length >= 3) {
          var availBonus = getAvailableBonusSlots(targetDate);
          if (availBonus <= 0) {
            showToast('이 날의 슬롯이 꽉 찼습니다', 'warning');
            return;
          }
          showConfirm('보너스 할일', '완료된 할일이 있어서 보너스 할일을 추가할 수 있습니다. (현재 ' + availBonus + '개 가능)', function(ok) {
            if (!ok) return;
            openWorkItemModal(targetDate, true);
          });
          return;
        }
      }
      openWorkItemModal(targetDate, false);
    }

    function showAddBonusWorkItem(dateStr) {
      openWorkItemModal(dateStr, true);
    }

    function openWorkItemModal(dateStr, isBonus) {
      workItemDraft = { emoji: '📋', color: null, isBonus: !!isBonus, date: dateStr || null };
      workItemEditId = null;
      var modal = document.getElementById('workItemModal');
      document.getElementById('workItemModalTitle').textContent = isBonus ? '⭐ 보너스 할일 추가' : '할일 추가';
      var dateEl = document.getElementById('workItemDateDisplay');
      if (dateEl) dateEl.textContent = dateStr ? formatDateKR(dateStr) : '날짜 미정 (바구니)';
      document.getElementById('workEmojiBtn').innerHTML = '📋';
      document.getElementById('workTitleInput').value = '';
      document.getElementById('workMemoInput').value = '';
      modal.style.display = 'flex';
      bringModalToFront(modal);
      setTimeout(function() { document.getElementById('workTitleInput').focus(); }, 50);
    }

    function showEditWorkItemModal(id) {
      var item = workItems.find(function(it) { return it.id === id; });
      if (!item) return;
      workItemDraft = JSON.parse(JSON.stringify(item));
      workItemEditId = id;
      var modal = document.getElementById('workItemModal');
      document.getElementById('workItemModalTitle').textContent = '할일 수정';
      var dateEl = document.getElementById('workItemDateDisplay');
      if (dateEl) dateEl.textContent = item.date ? formatDateKR(item.date) : '날짜 미정 (바구니)';
      document.getElementById('workEmojiBtn').innerHTML = renderEmoji(item.emoji || '📋');
      document.getElementById('workTitleInput').value = item.title || '';
      document.getElementById('workMemoInput').value = item.memo || '';
      closeWorkDetailModal();
      modal.style.display = 'flex';
      bringModalToFront(modal);
      setTimeout(function() { document.getElementById('workTitleInput').focus(); }, 50);
    }

    function closeWorkItemModal() {
      var modal = document.getElementById('workItemModal');
      if (modal) modal.style.display = 'none';
      workItemDraft = null;
      workItemEditId = null;
    }

    function saveWorkItem() {
      var title = document.getElementById('workTitleInput').value.trim();
      if (!title) { showToast('할일 제목을 입력해주세요', 'warning'); return; }
      var memo = document.getElementById('workMemoInput').value.trim();
      if (workItemEditId) {
        var item = workItems.find(function(it) { return it.id === workItemEditId; });
        if (item) {
          item.title = title;
          item.emoji = workItemDraft ? (workItemDraft.emoji || '📋') : item.emoji;
          item.color = emojiToWorkColor(item.emoji);
          item.memo = memo;
        }
        showToast('할일을 수정했습니다');
      } else {
        var newItem = {
          id: 'w' + Date.now(),
          emoji: workItemDraft ? (workItemDraft.emoji || '📋') : '📋',
          color: null,
          title: title,
          date: workItemDraft ? workItemDraft.date : null,
          completed: false,
          status: 'pending',
          memo: memo,
          isBonus: workItemDraft ? !!workItemDraft.isBonus : false,
          createdAt: today()
        };
        newItem.color = emojiToWorkColor(newItem.emoji);
        workItems.push(newItem);
        showToast('할일을 추가했습니다');
      }
      saveWorkItems();
      closeWorkItemModal();
      renderWorkView();
    }

    function showWorkItemDetail(id) {
      var item = workItems.find(function(it) { return it.id === id; });
      if (!item) return;
      var status = getWorkStatus(item);
      var html = '<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:16px;">';
      html += '<div style="font-size:36px;line-height:1;">' + renderEmoji(item.emoji || '📋') + '</div>';
      html += '<div style="flex:1;min-width:0;">';
      if (item.isBonus) html += '<div style="font-size:11px;color:#fdcb6e;font-weight:700;margin-bottom:3px;">⭐ 보너스</div>';
      html += '<div style="font-size:16px;font-weight:700;word-break:break-word;">' + escapeHtml(item.title) + '</div>';
      if (!item.date) html += '<div style="font-size:12px;color:var(--text-secondary);margin-top:3px;">날짜 미정 (바구니)</div>';
      html += '</div></div>';
      if (item.memo) html += '<div style="background:var(--bg-main);border-radius:8px;padding:10px 12px;font-size:13px;line-height:1.65;white-space:pre-wrap;">' + escapeHtml(item.memo) + '</div>';
      var detailDiv = document.getElementById('workDetailContent');
      if (detailDiv) detailDiv.innerHTML = html;
      var editBtn = document.getElementById('workDetailEditBtn');
      if (editBtn) editBtn.onclick = function() { showEditWorkItemModal(id); };
      var delBtn = document.getElementById('workDetailDeleteBtn');
      if (delBtn) delBtn.onclick = function() { deleteWorkItem(id); };
      var modal = document.getElementById('workDetailModal');
      modal.style.display = 'flex';
      bringModalToFront(modal);
    }

    function closeWorkDetailModal() {
      var modal = document.getElementById('workDetailModal');
      if (modal) modal.style.display = 'none';
    }

    function deleteWorkItem(id) {
      var item = workItems.find(function(it) { return it.id === id; });
      if (!item) return;
      // 완료된 일반 할일 삭제 시 보너스 잠금 체크
      if (item.date && !item.isBonus && getWorkStatus(item) === 'done') {
        var bonusUsed = getBonusUsedCount(item.date);
        var completedCnt = getCompletedNormalCount(item.date);
        if (completedCnt - 1 < bonusUsed) {
          showToast('보너스 할일이 이 완료에 묶여 있어 삭제할 수 없습니다', 'warning');
          return;
        }
      }
      showConfirm('할일 삭제', '&quot;' + escapeHtml(item.title) + '&quot;을(를) 삭제하시겠습니까?', function(ok) {
        if (!ok) return;
        workItems = workItems.filter(function(it) { return it.id !== id; });
        saveWorkItems();
        closeWorkDetailModal();
        closeWorkItemModal();
        workCloseInlineEdit();
        renderWorkView();
        showToast('할일을 삭제했습니다');
      });
    }

    function openWorkEmojiPicker() {
      if (!workItemDraft) return;
      openEmojiPicker(workItemDraft.emoji || '', function(emoji) {
        if (!emoji) return;
        workItemDraft.emoji = emoji;
        workItemDraft.color = emojiToWorkColor(emoji);
        var btn = document.getElementById('workEmojiBtn');
        if (btn) btn.innerHTML = renderEmoji(emoji);
      });
    }

    function renderWorkWeek() {
      var c = document.getElementById('workViewContent');
      if (!c) return;
      var baseMonday = getMondayOf(today());
      var monday = addDays(baseMonday, workWeekOffset * 7);
      var sunday = addDays(monday, 6);
      var todayStr = today();
      var dayNames = ['월','화','수','목','금','토','일'];

      var html = '<div class="work-week">';
      html += '<div class="work-nav">';
      html += '<button class="btn-icon" onclick="workWeekMove(-1)">&#8249;</button>';
      var mParts = monday.split('-');
      var sParts = sunday.split('-');
      html += '<span class="work-nav-label">' + parseInt(mParts[1]) + '/' + parseInt(mParts[2]) + ' – ' + parseInt(sParts[1]) + '/' + parseInt(sParts[2]) + '</span>';
      html += '<button class="btn-icon" onclick="workWeekMove(1)">&#8250;</button>';
      html += '</div>';
      if (workWeekOffset !== 0) html += '<div class="today-jump-row"><button class="today-jump-btn" onclick="workWeekMove(0)">오늘로 이동</button></div>';

      html += '<div class="work-week-grid">';
      for (var i = 0; i < 7; i++) {
        var ds = addDays(monday, i);
        var isToday = ds === todayStr;
        var dayItems = workItems.filter(function(it) { return it.date === ds; });
        var dp = ds.split('-');
        html += '<div class="work-week-col' + (isToday ? ' is-today' : '') + '">';
        html += '<div class="work-week-day-header" onclick="workGoToDate(\'' + ds + '\')">';
        html += '<span class="work-week-day-name">' + dayNames[i] + '</span>';
        html += '<span class="work-week-day-num">' + parseInt(dp[2]) + '</span>';
        html += '</div>';
        html += '<div class="work-week-day-body">';
        if (dayItems.length === 0) {
          html += '<div class="work-week-empty" onclick="showAddWorkItemModal(\'' + ds + '\')">+</div>';
        } else {
          dayItems.forEach(function(it) { html += renderWorkWeekMiniCard(it); });
          var normalCnt = dayItems.filter(function(it) { return !it.isBonus; }).length;
          if (normalCnt < 3) html += '<div class="work-week-add" onclick="event.stopPropagation();showAddWorkItemModal(\'' + ds + '\')">+</div>';
        }
        html += '</div></div>';
      }
      html += '</div></div>';
      c.innerHTML = html;
    }

    function workWeekMove(delta) {
      if (delta === 0) { workWeekOffset = 0; }
      else { workWeekOffset += delta; }
      renderWorkWeek();
    }

    function renderWorkMonth() {
      var c = document.getElementById('workViewContent');
      if (!c) return;
      var now = new Date();
      var yr = now.getFullYear();
      var mo = now.getMonth() + 1 + workMonthOffset;
      while (mo > 12) { mo -= 12; yr++; }
      while (mo < 1)  { mo += 12; yr--; }
      var todayStr = today();
      var daysInMonth = new Date(yr, mo, 0).getDate();
      var firstDay = new Date(yr, mo - 1, 1).getDay();
      var firstDayKR = (firstDay === 0) ? 6 : firstDay - 1;
      var monthNames = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

      var html = '<div class="work-month">';
      html += '<div class="work-nav"><button class="btn-icon" onclick="workMonthMove(-1)">&#8249;</button>';
      html += '<span class="work-nav-label">' + yr + '년 ' + monthNames[mo - 1] + '</span>';
      html += '<button class="btn-icon" onclick="workMonthMove(1)">&#8250;</button></div>';
      if (workMonthOffset !== 0) html += '<div class="today-jump-row"><button class="today-jump-btn" onclick="workMonthMove(0)">오늘로 이동</button></div>';

      html += '<div class="work-cal">';
      ['월','화','수','목','금','토','일'].forEach(function(d, i) {
        html += '<div class="work-cal-head' + (i >= 5 ? ' weekend' : '') + '">' + d + '</div>';
      });
      for (var blank = 0; blank < firstDayKR; blank++) html += '<div class="work-cal-cell empty"></div>';
      for (var day = 1; day <= daysInMonth; day++) {
        var ds = yr + '-' + String(mo).padStart(2, '0') + '-' + String(day).padStart(2, '0');
        var isToday = ds === todayStr;
        var dow = (firstDayKR + day - 1) % 7;
        var isWeekend = (dow === 5 || dow === 6);
        var dayItems = workItems.filter(function(it) { return it.date === ds; });
        html += '<div class="work-cal-cell' + (isToday ? ' is-today' : '') + (isWeekend ? ' weekend' : '') + (dayItems.length > 0 ? ' has-items' : '') + '" onclick="workGoToDate(\'' + ds + '\')">';
        html += '<div class="work-cal-date">' + day + '</div>';
        if (dayItems.length > 0) {
          // 데스크탑: 제목 리스트, 모바일: 상태 표시 dot
          html += '<div class="work-cal-items-desktop">';
          dayItems.slice(0, 3).forEach(function(it) {
            var st = getWorkStatus(it);
            html += '<div class="work-cal-item" onclick="event.stopPropagation();toggleWorkItemStatus(\'' + it.id + '\')">';
            html += workStatusSVG(st, 12);
            html += '<span class="work-cal-item-title">' + (it.emoji || '📋') + ' ' + escapeHtml(it.title) + '</span>';
            html += '</div>';
          });
          if (dayItems.length > 3) html += '<div style="font-size:10px;color:var(--text-secondary);">+' + (dayItems.length - 3) + '개</div>';
          html += '</div>';
          html += '<div class="work-dots work-cal-dots-mobile">';
          dayItems.slice(0, 4).forEach(function(it) {
            var dotColor = it.color || emojiToWorkColor(it.emoji || '📋');
            var st = getWorkStatus(it);
            html += '<span class="work-dot-lg" style="background:' + dotColor + ';opacity:' + (st === 'done' ? '0.4' : '1') + '">'
              + (st === 'done' ? '✓' : st === 'in-progress' ? '−' : '') + '</span>';
          });
          if (dayItems.length > 4) html += '<span class="work-dot-more">+' + (dayItems.length - 4) + '</span>';
          html += '</div>';
        }
        html += '</div>';
      }
      html += '</div></div>';
      c.innerHTML = html;
    }

    function workMonthMove(delta) {
      if (delta === 0) { workMonthOffset = 0; }
      else { workMonthOffset += delta; }
      renderWorkMonth();
    }

    // ── 바구니 탭 ──

    function updateWorkBasketBadge() { /* badge 없음 — 탭 카운트로 대체 */ }
    function openWorkBasket() { switchWorkView('basket'); }
    function closeWorkBasket() { switchWorkView('today'); }

    function renderWorkBasketTab() {
      var c = document.getElementById('workViewContent');
      if (!c) return;
      var allBasket = workItems.filter(function(it) { return !it.date; });

      /* 검색 */
      if (workBasketSearch) {
        var q = workBasketSearch.toLowerCase();
        allBasket = allBasket.filter(function(it) { return it.title.toLowerCase().indexOf(q) >= 0 || (it.memo || '').toLowerCase().indexOf(q) >= 0; });
      }
      /* 정렬 */
      if (workBasketSort === 'title') allBasket.sort(function(a, b) { return a.title > b.title ? 1 : -1; });
      else if (workBasketSort === 'created') allBasket.sort(function(a, b) { return b.createdAt > a.createdAt ? 1 : -1; });

      var total = allBasket.length;
      var totalPages = Math.max(1, Math.ceil(total / workBasketPerPage));
      if (workBasketPage > totalPages) workBasketPage = totalPages;
      var start = (workBasketPage - 1) * workBasketPerPage;
      var basketItems = allBasket.slice(start, start + workBasketPerPage);
      var todayVal = today();

      function controlsRow(suffix) {
        var html = '<div class="basket-controls-row">';
        html += '<input type="date" id="basketDateInput' + suffix + '" class="basket-date-input" value="' + todayVal + '">';
        html += '<button class="btn-confirm basket-assign-btn" onclick="basketAssignToDate(\'' + suffix + '\')">날짜에 추가</button>';
        html += '<button class="basket-add-new-btn" onclick="openBasketNewItem()">+ 할일 추가</button>';
        html += '</div>';
        return html;
      }

      var html = '<div class="work-basket-tab">';

      /* 검색/정렬 바 — 항상 표시 */
      html += '<div class="work-list-controls" style="display:flex;gap:8px;align-items:center;margin-bottom:10px;">';
      html += '<input class="input-field" style="flex:1;min-width:0;height:34px;padding:6px 10px;font-size:13px;" placeholder="할일 검색..." value="' + escapeHtml(workBasketSearch) + '" oninput="basketSetSearch(this.value)">';
      html += '<select class="input-field" style="width:auto;height:34px;padding:4px 8px;font-size:13px;" onchange="basketSetSort(this.value)">';
      html += '<option value="default"' + (workBasketSort==='default'?' selected':'') + '>기본순</option>';
      html += '<option value="title"' + (workBasketSort==='title'?' selected':'') + '>제목순</option>';
      html += '<option value="created"' + (workBasketSort==='created'?' selected':'') + '>최신순</option>';
      html += '</select>';
      html += '</div>';

      var rawTotal = workItems.filter(function(it) { return !it.date; }).length;
      if (rawTotal === 0) {
        html += '<div class="work-empty-state"><div class="work-empty-icon">🧺</div><div class="work-empty-text">바구니가 비어있습니다</div></div>';
        html += '<button class="basket-add-new-btn" style="margin-top:16px;width:100%;" onclick="openBasketNewItem()">+ 할일 추가</button>';
      } else {
        html += controlsRow('top');

        html += '<div class="basket-select-bar">';
        html += '<label class="basket-select-all-label"><input type="checkbox" id="basketSelectAll" onchange="basketToggleAll(this.checked)"> 전체 선택</label>';
        html += '<span class="basket-selected-count" id="basketSelectedCount">0개 선택</span>';
        html += '</div>';

        if (basketItems.length === 0) {
          html += '<div class="empty-state"><p>검색 결과가 없습니다.</p></div>';
        } else {
          html += '<div class="basket-grid">';
          basketItems.forEach(function(item) {
            var status = getWorkStatus(item);
            html += '<div class="basket-grid-card" onclick="workToggleInlineEdit(\'' + item.id + '\')">';
            html += '<input type="checkbox" class="basket-item-check basket-grid-check" value="' + item.id + '" onclick="event.stopPropagation()" onchange="basketUpdateSelection()">';
            html += '<div class="basket-grid-emoji">' + (item.emoji || '📋') + '</div>';
            html += '<div class="basket-grid-title' + (status === 'done' ? ' done' : '') + '">' + escapeHtml(item.title) + '</div>';
            if (item.memo) html += '<div class="basket-grid-memo">' + escapeHtml(item.memo.substring(0, 24)) + (item.memo.length > 24 ? '…' : '') + '</div>';
            html += '</div>';
          });
          html += '</div>';
        }

        html += buildGenericPagerBar({
          total: total, page: workBasketPage, perPage: workBasketPerPage,
          perPageOpts: [8, 12, 20, 40],
          goFn: 'goBasketPage', setPerPageFn: 'setBasketPerPage'
        });

        html += controlsRow('bot');
      }

      html += '</div>';
      c.innerHTML = html;
      if (rawTotal > 0) basketUpdateSelection();
    }

    function basketSetSearch(val) {
      workBasketSearch = val;
      workBasketPage = 1;
      renderWorkBasketTab();
    }

    function basketSetSort(val) {
      workBasketSort = val;
      workBasketPage = 1;
      renderWorkBasketTab();
    }

    function goBasketPage(page) {
      var total = workItems.filter(function(it) { return !it.date; }).length;
      var totalPages = Math.max(1, Math.ceil(total / workBasketPerPage));
      page = parseInt(page, 10);
      if (isNaN(page) || page < 1 || page > totalPages) return;
      workBasketPage = page;
      renderWorkBasketTab();
    }

    function setBasketPerPage(val) {
      workBasketPerPage = parseInt(val, 10) || 10;
      workBasketPage = 1;
      renderWorkBasketTab();
    }

    function basketToggleAll(checked) {
      document.querySelectorAll('.basket-item-check').forEach(function(cb) { cb.checked = checked; });
      basketUpdateSelection();
    }

    function basketUpdateSelection() {
      var checked = document.querySelectorAll('.basket-item-check:checked');
      var all = document.querySelectorAll('.basket-item-check');
      var countEl = document.getElementById('basketSelectedCount');
      var selectAll = document.getElementById('basketSelectAll');
      if (countEl) countEl.textContent = checked.length + '개 선택';
      if (selectAll) selectAll.indeterminate = checked.length > 0 && checked.length < all.length;
      if (selectAll) selectAll.checked = all.length > 0 && checked.length === all.length;
    }

    function basketGetSelectedIds() {
      var ids = [];
      document.querySelectorAll('.basket-item-check:checked').forEach(function(cb) { ids.push(cb.value); });
      return ids;
    }

    function basketAssignToDate(suffix) {
      var sfx = suffix || 'top';
      var dateInput = document.getElementById('basketDateInput' + sfx);
      if (!dateInput || !dateInput.value) { showToast('날짜를 선택하세요', 'warning'); return; }
      var ids = basketGetSelectedIds();
      if (!ids.length) { showToast('배정할 항목을 선택하세요', 'warning'); return; }
      var targetDate = dateInput.value;
      var normalCount = workItems.filter(function(it) { return it.date === targetDate && !it.isBonus; }).length;
      var normalSlots = Math.max(0, 3 - normalCount);
      var availBonus = getAvailableBonusSlots(targetDate);
      var totalSlots = normalSlots + availBonus;
      var dp = targetDate.split('-');
      var dateLabel = parseInt(dp[1]) + '/' + parseInt(dp[2]);

      // 선택 개수 > 전체 슬롯 → 거부
      if (ids.length > totalSlots) {
        if (totalSlots === 0) {
          showToast(dateLabel + '는 슬롯이 꽉 찼습니다', 'warning');
        } else {
          showToast(dateLabel + '에 ' + totalSlots + '개 슬롯만 남았습니다. 선택 개수(' + ids.length + '개)를 줄여주세요', 'warning');
        }
        return;
      }

      var toNormal = ids.slice(0, normalSlots);
      var toBonus = ids.slice(normalSlots);

      function doAssign() {
        toNormal.forEach(function(id) {
          var item = workItems.find(function(it) { return it.id === id; });
          if (item) { item.date = targetDate; item.isBonus = false; }
        });
        toBonus.forEach(function(id) {
          var item = workItems.find(function(it) { return it.id === id; });
          if (item) { item.date = targetDate; item.isBonus = true; }
        });
        saveWorkItems();
        var assignedTotal = ids.length;
        showToast('✅ ' + dateLabel + '에 ' + assignedTotal + '개 배정했습니다 — 오늘 탭에서 확인하세요');
        workBasketPage = 1;
        renderWorkView();
      }

      if (toBonus.length > 0) {
        showConfirm('보너스 할일 포함', dateLabel + '에 ' + toNormal.length + '개 일반 + ' + toBonus.length + '개 보너스로 배정합니다.', function(ok) { if (ok) doAssign(); });
      } else {
        doAssign();
      }
    }

    function openBasketNewItem() {
      workItemDraft = { emoji: '📋', color: null, isBonus: false, date: null };
      workItemEditId = null;
      var modal = document.getElementById('workItemModal');
      document.getElementById('workItemModalTitle').textContent = '바구니에 할일 추가';
      var dateEl = document.getElementById('workItemDateDisplay');
      if (dateEl) dateEl.textContent = '날짜 미정 (바구니)';
      document.getElementById('workEmojiBtn').innerHTML = '📋';
      document.getElementById('workTitleInput').value = '';
      document.getElementById('workMemoInput').value = '';
      modal.style.display = 'flex';
      bringModalToFront(modal);
      setTimeout(function() { document.getElementById('workTitleInput').focus(); }, 50);
    }

    // ========================================
    // 초기화
    // ========================================
    console.log('베이 관리자 v2.1 로드 완료');
    console.log('오늘 날짜:', today());
