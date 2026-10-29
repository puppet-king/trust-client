import type { StrategyId } from '@/core/pd'

export const WORDS_ZH: Record<string, string> = {
  // META
  meta_title: '信任的进化',
  meta_desc: '关于我们为何以及如何彼此信任的博弈论互动指南',
  meta_loading: '加载中...',
  meta_on: '开',
  meta_off: '关',

  // TITLE
  title: '<span style="font-size:0.65em;letter-spacing:4px">博弈论互动指南</span><br>信任的进化',
  subtitle: '体验时长：约 15~30 分钟 &#8226; 原著：Nicky Case (2017)',
  loading: '加载中...',
  loading_done: '开始游戏 &rarr;',

  // INTRO
  intro:
    '第一次世界大战期间，和平曾奇迹般地降临。<br><br>' +
    '那是 1914 年圣诞节的西线战场。<br>' +
    '尽管上级下达了严禁与敌军私自接触的死命令，英国与德国士兵<br>' +
    '依然纷纷走出战壕，穿过无人区，聚在一起安葬阵亡同胞、交换礼物、踢球嬉戏。<br><br>' +
    '反观今天：世界已和平了数十年，但人与人之间的<b>信任</b>却陷入危机。<br>' +
    '过去四十年的调查表明，越来越多的人表示不再相信彼此。于是谜题来了：<br><br>' +
    '<b>为什么在和平年代，朋友反而变成了敌人？<br>' +
    '又为什么在残酷战场上，敌人却能变成朋友？</b><br><br>' +
    '我想，<b>博弈论</b>不仅能帮我们解释这场“不信任的瘟疫”——<br>' +
    '还能告诉我们如何修复它！为了弄明白这一切……',
  intro_button: '……让我们先玩个游戏吧。 &rarr;',

  // ONE OFF LABELS
  label_you_cooperate: '你<br>选择合作',
  label_you_cheat: '你<br>选择欺骗',
  label_they_cooperate: '对方<br>选择合作',
  label_they_cheat: '对方<br>选择欺骗',
  label_you: '你<br>↙',
  label_them: '对方玩家<br>↘',

  oneoff_0_top:
    '<b>信任博弈</b><br>' +
    '你只有一个选择。面前有一台投币机：如果你投进 1 枚硬币，<i>对方玩家</i>就会得到 3 枚硬币——反之亦然。' +
    '你们双方都可以选择<b>合作</b>（投币），或者<b>欺骗</b>（不投币）。',
  oneoff_0_btm: '<b>假设对方选择了欺骗（不投币）。</b><br>这时你应该怎么做？',

  oneoff_1_cheated: '一点没错！凭什么让那个白嫖怪占你便宜？',
  oneoff_1_cooperated: '唉，以德报怨，换来的只是结结实实的一记耳光！',
  oneoff_1_top:
    '如果你合作而对方欺骗，你会损失 1 枚硬币，对方却白得 3 枚（得分：-1 对 +3）。' +
    '但如果你俩都欺骗，双方就都不赚不赔（得分：0 对 0）。' +
    '<b>因此：你应该选择“欺骗”。</b>',
  oneoff_1_btm: '<b>但假如对方选择了合作（投进了硬币）呢？</b><br>现在你又该怎么做？',

  oneoff_2_cheated: '哇，真够狠的……但这确实是理性上的正确答案！',
  oneoff_2_cooperated: '嗯，看起来这是道德上正确的做法……<b>但真是这样吗？？</b>',
  oneoff_2_top:
    '因为如果你们都合作，双方各付出 1 枚硬币并获得 3 枚，净赚 2 枚（得分：+2 对 +2）。' +
    '但如果你欺骗而对方合作，你能白拿 3 枚硬币，对方却倒亏 1 枚（得分：+3 对 -1）。' +
    '<b>因此：你“理应”依然选择欺骗。</b>',
  oneoff_2_btm:
    '这正是我们的<b>囚徒困境</b>。' +
    '信任很美好，但它容易让别人趁机占你便宜——就像手无寸铁走出战壕却被对面的冷枪击中。' +
    '有时候，<b>不信任反而是理性的！</b>' +
    '但是，如果这个游戏我们玩的……',
  oneoff_button_next: '……不止一次呢？ &rarr;',

  // ITERATED
  iterated_intro_top:
    '<b>现在，让我们来动真格的。</b>' +
    '你将依次迎战 5 位不同的对手，每位对手都有自己独特的“博弈策略”。' +
    '面对每位对手，你们会进行 3 到 7 轮博弈（你事先不知道哪一轮是最后一轮）。' +
    '你能信任他们吗？或者说……他们能信任<i>你</i>吗？',
  iterated_intro_btm: '做出你的第一个<i>真实</i>抉择吧。<b>请慎重选择。</b>',

  iterated_info_1: '当前对手：第 [X] / [Y] 位',
  iterated_info_2: '你的累计总分：',

  iterated_score_start: '你的最终累计总分是……',
  iterated_score_1: '哇塞，这分数低得简直<i>令人叹为观止</i>。',
  iterated_score_2: '唔，还不算太糟，至少还有更垫底的！',
  iterated_score_3: '表现相当不错嘛！',
  iterated_score_4: '非常高分！你深谙博弈之道！',
  iterated_score_5: '<i>满分神作！</i>看来你已经完全看穿了所有人的套路！',
  iterated_score_x: '……我完全搞不懂你是怎么打出这个分数的。',
  iterated_score_end: '（最低理论分为 7 分，最高理论分为 49 分）',

  who_were: '那么，刚才和你交手的这几位奇葩角色究竟是谁呢？',

  character_tft:
    '<b>复读机：</b>' + '你好呀！第一轮我先选<b>合作</b>，之后每一轮，你上一轮选了什么我就原样照抄什么。喵~',
  character_all_d: '<b>万年老油条：</b>' + '<i>弱肉强食，蠢货才合作！</i>（永远选择欺骗）',
  character_all_c:
    '<b>小粉红：</b>' +
    '让我们做一辈子的好朋友吧！<img src="/static/ui/love.png" style="width:16px;height:16px;vertical-align:-2px;margin:0 2px" />（永远选择合作）',
  character_grudge:
    '<b>黑帮老铁：</b>' +
    '听好了兄弟。咱一开始会<b>合作</b>，也会一直合作下去；但只要你敢坑我哪怕一次，<b>我就跟你死磕到底、欺骗到天荒地老！</b>',
  character_prober:
    '<b>福尔摩斯：</b>' +
    '我先用四步试探你：<b>合作、欺骗、合作、合作</b>。' +
    '如果你敢反击我，我就老老实实当个<span class="tft">复读机</span>；' +
    '如果你逆来顺受从不反击，我就化身<span class="all_d">万年老油条</span>狠狠榨干你。基本演绎法，亲爱的华生。',

  characters_teaser: '现在，如果让这几位角色互相之间……',
  characters_button: '……来一场同台对决呢？ &rarr;',

  // TOURNAMENT
  place_your_bets:
    '锦标赛时间到！' +
    '现在，这 5 位角色将两两之间进行单循环较量：' +
    '共计 10 场对决，每场对决进行 10 轮博弈。<br><br>' +
    '你觉得谁会斩获最高的<i>累计总分</i>？' +
    '<b>仔细想一想……然后买定离手，下个注吧：</b>',

  tournament_intro: '好嘞，你把赌注押在了 [CHAR] 身上！' + '让我们一场接一场看下去，看看这场锦标赛究竟如何演变……',

  first_match: '第一场对决 &rarr;',
  next_match: '下一场对决 &rarr;',

  match_header_1: '<b>第 [N] 场对决：</b>[A] vs [B]',
  match_header_2: '<b>各轮交锋：</b>',
  match_header_3: '<b>本场总分：</b>[A] 对 [B]',

  tournament_1: '哦，顺便提一句……',
  tournament_2: '……你可能会对开头那个一战战壕“圣诞休战”的故事心存怀疑。那肯定只是一次偶然的巧合吧？',
  tournament_3: '诚然，圣诞休战极具戏剧性，但它既<b>不是孤例，也不罕见</b>。',
  tournament_4:
    '虽然并非<i>每一条</i>战壕都达成了和平，但这种现象相当普遍。许多前线阵地都是自发形成默契的——而且同样是<b>违抗了上级的严令</b>。',
  tournament_5: '事实上，早在圣诞节<i>之前</i>，好几处前线就已经秘密建立起了一种非官方的停火默契。',
  tournament_6:
    '他们称之为：<b>“自己活，也让别人活”（Live and let live）体系。</b>' +
    '简单来说就是：你不打我，我也不打你。而且这套默契在许多阵地上都运转得很好！',
  tournament_7: '你可能还是觉得奇怪。大多数士兵并不会自发跟敌人握手言和。为什么偏偏<b>战壕战</b>这么特殊？',
  tournament_8:
    '这就是战壕战独一无二的地方：不同于几乎所有其他形态的战争，在战壕里，你每天面对的都是对面<b>同一批特定的士兵</b>。',
  tournament_9: '<b>这是一场重复博弈。</b>而这一点，改变了一切。',
  tournament_10: '言归正传。本次锦标赛最终的总冠军得主是……',

  the_winner_is: '（请奏响激昂的鼓点……） &rarr;',

  tournament_winner_1: '<b class="tft">复读机！</b>',
  tournament_winner_2_yay: '恭喜你，眼光毒辣，押中了真正的赢家！',
  tournament_winner_2_nay: '（替你押注的 [CHAR] 默哀三秒钟。）',
  tournament_winner_3:
    '<span class="tft">复读机</span>在历史上有许多名字：' +
    '黄金法则、互惠利他、以牙还牙（Tit for Tat），或者……<b>“自己活，也让别人活”。</b>' +
    '这就是为什么一战战壕里能够自发萌生“和平”：' +
    '当你被迫与<b>同一群特定的人</b>（而不是抽象的“敌人”）日复一日地进行同一场博弈时——' +
    '<span class="tft">复读机</span>不仅能赢得单场战斗，还能赢得整场战争。<br><br>' +
    '不过，既然多玩几轮就能让局势彻底改观，那如果我们进行……',
  tournament_teaser: '……多场<i>连续演化的锦标赛</i>呢？ &rarr;',

  // EVOLUTION
  evolution_intro: '现在，让我们观察玩家群体如何随时间<b>世代演化</b>。这是一支三步舞曲：',
  evolution_intro_1: '<b>1. 进行锦标赛</b><br>让所有人两两对局，统计每个人的总得分。',
  evolution_intro_2: '<b>2. 淘汰失败者</b><br>淘汰得分最低的 5 名玩家。（若平分则随机淘汰）',
  evolution_intro_3: '<b>3. 繁殖优胜者</b><br>复制得分最高的 5 名玩家。（若平分则随机复制）',
  evolution_intro_footer:
    '……如此循环往复。注意：文化的演化并不需要等待生理上的死亡与繁衍——' +
    '只要“失败的行为模式”被抛弃，“成功的行为模式”被模仿，演化就会发生。那么现在……',
  evolution_intro_button: '……让我们亲眼见证演化过程。 &rarr;',

  evo_1:
    '假设我们以如下初始人口开启演化：' +
    '<span class="all_c">15 个小粉红</span>、' +
    '<span class="all_d">5 个万年老油条</span>，以及 ' +
    '<span class="tft">5 个复读机</span>。' +
    '（暂且不带<span class="grudge">黑帮老铁</span>和<span class="prober">福尔摩斯</span>玩）<br><br>' +
    '我们将连续进行十几个世代的“比赛—淘汰—繁殖”循环。' +
    '再来下一注吧！你觉得谁会赢得<b>第一世代</b>的锦标赛？<b>请再次下注：</b>',

  evo_2_all_c: '有道理，<span class="all_c">小粉红</span>现在人数占绝对优势……',
  evo_2_all_d:
    '有道理，场上那么多<span class="all_c">小粉红</span>，简直是<span class="all_d">万年老油条</span>的提款机……',
  evo_2_tft: '有道理，<span class="tft">复读机</span>上次就拿了冠军，这次怎会轻易翻车？……',
  evo_2: '让我们一步步点击下方按钮，看看你猜得对不对：',

  label_play_tournament: '1) 进行锦标赛',
  label_eliminate_bottom_5: '2) 淘汰末位 5 人',
  label_reproduce_top_5: '3) 繁殖前 5 名',

  evo_3_all_c:
    '唉，单纯的<span class="all_c">小粉红</span>被<span class="all_d">万年老油条</span>生吞活剥了，老油条的人数增加了 5 个。',
  evo_3_all_d: '很遗憾，你猜对了！<span class="all_d">万年老油条</span>赢下了第一世代，他们的人数暴涨了 5 个。',
  evo_3_tft:
    '唉，<span class="tft">复读机</span>这回没赢——但好歹没像<span class="all_c">小粉红</span>那样惨遭屠戮。老油条的数量增加了 5 个。',
  evo_3: '不过别急，让我们再多演化几个世代看看……',

  evo_4: '<span class="all_d">万年老油条</span>仍在继续扩张，不断蚕食着<span class="all_c">小粉红</span>的生存空间……',
  evo_5: '现在，所有的<span class="all_c">小粉红</span>都灭绝了。但是，等等……',
  evo_6:
    '没错：<span class="all_d">万年老油条</span>成了自己成功的牺牲品！' +
    '他们榨干了天真的<span class="all_c">小粉红</span>，可一旦老实人死绝了，他们就不得不正面硬刚<span class="tft">复读机</span>——' +
    '后者虽然友善，却绝不天真。',
  evo_7:
    '只需照抄对手的动作，<span class="tft">复读机</span>之间就能愉快地互利合作；' +
    '而<span class="all_d">万年老油条</span>互相碰到一起却只能彼此伤害！' +
    '不仅如此，<span class="tft">复读机</span>还能以其人之道还治其人之身，让<span class="all_d">万年老油条</span>自食恶果。',
  evo_8: '于是，顺理成章地……',
  evo_9: '……<span class="tft">复读机</span>最终继承了整个世界。',
  evo_9_all_c:
    '所以，尽管你一开始押错了——善良却毫无防备的<span class="all_c">小粉红</span>注定会被淘汰——但最终，一种<b>有原则的善良</b>取得了胜利，<span class="all_d">万年老油条</span>被彻底扫地出门。',
  evo_9_all_d:
    '所以，短期来看你猜对了——<span class="all_d">万年老油条</span>赢了前几轮；但从长远来看，毫无底线的剥削恰恰埋下了它覆灭的种子。',
  evo_9_tft:
    '所以，从长远来看你押对了——<span class="tft">复读机</span>笑到了最后！<span class="all_d">万年老油条</span>或许能逞一时之快，但剥削成性终究让它自取灭亡。',
  evo_9_end:
    '这让我想起埃尔伯特·哈伯德的一句名言：<br><br>' + '<i>“我们并非因为自己的罪恶而受罚，而是被罪恶本身所惩罚。”</i>',
  evo_9_btn: '（哦，顺便再看个更热闹的……）',

  evo_10:
    '（……就算我们把<span class="grudge">黑帮老铁</span>和<span class="prober">福尔摩斯</span>也放进演化池，结果依然大同小异：）',
  evo_autoplay: '开始演化过程！',
  evo_autoplay_stop: '暂停演化过程',
  evo_10_followup:
    '（注：有时候会有几个<span class="grudge">黑帮老铁</span>留存下来，因为当场上只剩<span class="grudge">黑帮老铁</span>和<span class="tft">复读机</span>时，他们之间永远和平合作、得分相同。）<br><br>' +
    '看来，博弈论的数学推演正在告诉我们一个道理：' +
    '<span class="tft">复读机</span>的处世哲学——“己所不欲，勿施于人；以德报德，以直报怨”——不仅是一条<b>道德准则</b>，更是一条<b>数学真理</b>。然而……',
  evo_10_btn: '……现实中却有个大问题： &rarr;',

  evo_11:
    '看看我们周围吧，现实世界里依然到处都是老油条和混球。<br><br>' +
    '既然<span class="tft">复读机</span>在这场重复信任博弈中如此强大——强大到连一战战壕里的士兵都能独立“演化”出名为“自己活也让别人活”的相同策略——那为什么社会上还有这么多缺乏信任、唯利是图的人？' +
    '究竟是什么引发了我们的“不信任瘟疫”？<br><br>' +
    '线索就藏在刚才那句话里：“在<b>这场</b>重复信任博弈中。”' +
    '到目前为止，我们只讨论了<b>玩家的变化</b>；那如果是<b>游戏规则本身发生了变化</b>呢？' +
    '什么样的规则改变，会导致……',
  evo_11_btn: '……“不信任”的演化？ &rarr;',

  // DISTRUST
  distrust_1:
    '在一切崩坏之前，让我们先从一个美好的世界开始！' +
    '这里几乎全是单纯善良的<span class="all_c">小粉红</span>，只有一个<span class="all_d">万年老油条</span>和一个<span class="tft">复读机</span>。<br><br>' +
    '点击右侧按钮<b>开始</b>模拟、<b>单步</b>观察，或<b>重置</b>演化。 &rarr;',
  distrust_2:
    '如你所见，在当前规则下，长远来看<span class="tft">复读机</span>依然轻松胜出！<br><br>' +
    '但这是在<b>当前</b>规则下——即每场对决要进行 <b>10</b> 轮博弈。' +
    '如果变成 7 轮、<span class="tft">复读机</span>还能赢吗？5 轮呢？3 轮？2 轮？1 轮？<br><br>' +
    '<b>拖动下方滑块修改每场回合数</b>，然后点击<b>开始</b>，看看会发生什么！大胆试试吧！',
  distrust_2_end: '实验完毕后，请点击：',
  distrust_3:
    '正如你所看到的，如果博弈回合数不够多（比如 5 轮或更少），<span class="all_d">万年老油条</span>就会迅速统治世界。<br><br>' +
    '1985 年，当美国人被问及拥有几个知心好友时，最普遍的回答是“3 个”；而到了 2004 年，最普遍的回答变成了<b>“0 个”</b>。' +
    '跨阶层、跨群体的朋友变少了，因为我们的朋友总数本身就在急剧减少。' +
    '正如你刚才亲手验证的那样：<b>人与人之间的“重复互动”越少，不信任就会越肆无忌惮地蔓延。</b><br><br>' +
    '（注：刷大众社交媒体可不算数——必须是<b>特定个体之间双向的</b>重复互动。）',
  distrust_3_btn: '而且，情况还会变得更糟…… &rarr;',

  distrust_4: '还有<i>另一种</i>滋生不信任的方式。来看看信任博弈的“收益矩阵”：',
  distrust_4_2:
    '在默认收益下，<span class="tft">复读机</span>能赢。' +
    '但现在，请点击上方箭头<b>将“双方合作”的奖励从 +2 调低到 +1</b>，然后点击<b>开始</b>。' +
    '哪怕 +1 依然高于双方互骗的惩罚（0 分）……结果又会怎样？',
  distrust_4_note: '你可以尽情尝试不同的收益数值！试验完毕后请点击：',
  distrust_4_note_2: '（当前模拟：每场对决 10 轮）',
  distrust_5:
    '同样的悲剧发生了：当“双赢”的回报变低时，<span class="all_d">万年老油条</span>再次接管了世界。' +
    '博弈论对此有两个极为深刻的概念：<br><br>' +
    '<b>“零和博弈”：</b>一种可悲却普遍的观念，认为“我们”的所得<i>必然</i>建立在“他们”的损失之上，反之亦然。<br><br>' +
    '<b>“非零和博弈”：</b>人们努力创造“双赢”局面的博弈！（或者至少避免双输）。' +
    '没有非零和博弈的土壤，<b>信任就无法演化生长。</b><br><br>' +
    '说到这里，让我们来看看阻碍信任演化的第三个、也是最后一个障碍……',
  distrust_5_btn: '<s>失吾</s> 失误与误解。 &rarr;',

  // NOISE
  noise_1:
    '尽管<span class="tft">复读机</span>非常强大，但它有一个我还没提到的致命弱点。' +
    '为了理解这个问题，假设场上是两个<span class="tft">复读机</span>在对决：',
  noise_1_end: '作为“友善”的玩家，他们第一步都会选择：',

  noise_2: '正常情况下，他们会不断回馈彼此的善意，一直和平共处直到永远。',
  noise_2_end: '但如果，在试图回馈善意的过程中……',

  noise_3: '<b>糟糕！脚滑了！</b><br>' + '失误、沟通不畅、曲解原意——现实生活中，意外和误会无时无刻不在发生。',
  noise_3_end: '可如果对方<i>并不觉得</i>这只是一次无心之失……',

  noise_4: '<b>糟糕透顶！！</b><br>' + '对方也是个<span class="tft">复读机</span>，按照规则他<i>必须</i>立即报复你……',
  noise_4_end: '……而你作为<span class="tft">复读机</span>，下一轮也<i>不得不</i>反过来报复他……',

  noise_5:
    '就这样，就像世仇家族一样，这两个<span class="tft">复读机</span>将陷入永无止境的冤冤相报循环……' +
    '而这一切，仅仅源于很久以前的一次无心失误。',
  noise_5_end: '令人唏嘘。那么，有没有<i>其他类型</i>的玩家能够……',
  noise_5_btn: '……妥善应对误会与失误呢？ &rarr;',

  noise_characters: '让我们认识三位新面孔！（或者说，三顶新帽子）',

  character_tf2t:
    '<b>复读小猫：</b><br>' +
    '你好呀！我很像<span class="tft">复读机</span>，但只有当你<b>连续两次</b>欺骗我之后，我才会反击。' +
    '毕竟第一次可能只是不小心失误了嘛！呼噜噜~',
  character_pavlov:
    '<b>一根筋：</b><br>' +
    '嗨，我开局先合作。如果你上一轮<b>合作</b>，我就<b>重复</b>自己上一轮的动作（哪怕上次是我失误了）；' +
    '如果你上一轮<b>欺骗</b>，我就<b>切换</b>自己上一轮的动作（即“赢定输移”）。',
  character_random:
    '<b>胡乱来：</b><br>' +
    '<i>猴子机器人！忍者披萨玉米卷！哈哈我就是这么随性！</i><br>' +
    '（完全不看对手，每轮以 50% 的概率随机选择合作或欺骗）',

  noise_characters_end: '好啦，让我们看看这几位新选手同台竞技时会擦出什么火花……',
  noise_characters_btn: '……进入有失误率的锦标赛 &rarr;',

  noise_evo_1:
    '让我们以十几个<span class="all_c">小粉红</span>作为基础环境，' +
    '迎战我们的老冠军<span class="tft">复读机</span>，以及三位新角色：' +
    '宽容的<span class="tf2t">复读小猫</span>、耿直的<span class="pavlov">一根筋</span>，还有没头脑的<span class="random">胡乱来</span>。<br><br>' +
    '在每一轮博弈中，双方都有小概率犯错（比如 5% 的失误率）。' +
    '你觉得这次谁会笑到最后？<b>仔细思考，然后下注吧：</b>',

  noise_evo_2:
    '好，你押注 [CHAR] 获胜。让我们揭晓答案！' + '请使用左侧按钮<b>开始</b>快速模拟，或<b>单步</b>观察演化过程。',
  noise_evo_2_2_correct: '你猜得完全正确——',
  noise_evo_2_2_incorrect: '猜得很接近，但差了一点点——',
  noise_evo_2_2:
    '<span class="pavlov">一根筋</span>赢了！' +
    '这是因为<span class="pavlov">一根筋</span>实际上能够占<span class="all_c">小粉红</span>的便宜。' +
    '双方起初都合作，但一旦<span class="pavlov">一根筋</span>犯错选了欺骗，由于<span class="all_c">小粉红</span>从不报复（依然合作），<span class="pavlov">一根筋</span>就会继续保持上一轮的“欺骗”动作，一路白嫖到底！',
  noise_evo_2_2_btn: '接下来让我们试试……',

  noise_evo_3:
    '……和刚才一样的阵容，只不过把占人口一半的<span class="all_c">小粉红</span>换成<span class="all_d">万年老油条</span>！' +
    '这是一个充满敌意、严酷得多的险恶环境。<br><br>' +
    '现在你觉得谁会获胜？<b>思考一下，再次下注吧：</b>',

  noise_evo_4: '你押了 [CHAR]。再次启动模拟，看看演化结果吧……',
  noise_evo_4_2_correct: '一语中的！你太神了——',
  noise_evo_4_2_incorrect: '想法不错，但这次夺冠的是另一位——',
  noise_evo_4_2:
    '这次是<span class="tf2t">复读小猫</span>赢了！' +
    '令人惊讶的是，面对更加险恶的初始人口，比<span class="tft">复读机</span>更加<i>宽容</i>的<span class="tf2t">复读小猫</span>反而成了最成功的赢家！（注：<span class="tf2t">复读小猫</span>非常宽容，甚至不会彻底消灭<span class="tft">复读机</span>，而是与之和睦共处。）<br><br>' +
    '在这个例子里，少量的“误解”（每轮 5% 失误率）反而促成了更多的<b>宽容</b>。但这对于<i>所有程度</i>的……',
  noise_evo_4_2_btn: '……误解与失误都成立吗？',

  noise_evo_5:
    '<b>拖动下方滑块改变“失误/误解率”，然后点击开始。</b>' +
    '在 5% 时，<span class="tf2t">复读小猫</span>胜出。' +
    '那在 0% 时呢？或者 20%？或者 50%？（最高只到 50%，因为在 50% 时每一步都彻底等同于抛硬币）',
  noise_evo_5_continue: '当你实验完毕后，请点击：',

  noise_evo_6:
    '实验结果大致如下：<br>' +
    '<b>失误率 0% 时：</b>公平的<span class="tft">复读机</span>获胜！<br>' +
    '<b>失误率 1% ~ 9% 时：</b>宽容的<span class="tf2t">复读小猫</span>获胜！<br>' +
    '<b>失误率 10% ~ 49% 时：</b>残酷无情的<span class="all_d">万年老油条</span>获胜。<br>' +
    '<b>失误率 50% 时：</b><i>永远没有人能赢。</i><br><br>' +
    '这就是为什么“误解”是信任演化中如此微妙的一道屏障：' +
    '<i>一点点</i>误解会孕育宽容，但<i>过多的</i>误解却会导致信任全面崩塌！' +
    '现代传媒与社交网络虽然极大增加了我们的沟通量，却也成倍放大了我们的<i>误解</i>。<br><br>' +
    '最后，让我们放开所有数字、旋钮和滑块的限制，进入……',
  noise_evo_6_btn: '……自由沙盒模式！ &rarr;',

  // SANDBOX
  sandbox_population: '调整初始玩家人口分布（总计 25 人）：',
  sandbox_payoffs: '单局博弈的收益矩阵：',
  sandbox_reset_payoffs: '恢复默认',
  sandbox_rules_1: '每场对决进行 [N] 轮博弈：',
  sandbox_rules_1_single: '每场对决进行 [N] 轮博弈：',
  sandbox_rules_2: '每场锦标赛后，淘汰末位 [N] 人并复制前 [N] 人：',
  sandbox_rules_2_single: '每场锦标赛后，淘汰末位 [N] 人并复制前 [N] 人：',
  sandbox_rules_3: '每一轮中，玩家有 [N]% 的概率发生失误：',
  sandbox_end: '<b>提示：沙盒模式可自由探索。</b>尽情调试参数，完成后让我们一起回顾……',
  sandbox_end_btn: '今天我们学到了什么！ &rarr;',

  // CONCLUSION
  conclusion_0: '博弈论向我们揭示了“信任演化”不可或缺的三大基石：',
  conclusion_1_a: '1. 重复的互动',
  conclusion_1_a2: '信任维系着人际关系，但只有在双方预期未来还会有<b>重复交集</b>的前提下，信任才可能萌芽。',
  conclusion_2_a: '2. 双赢的可能',
  conclusion_2_a2: '你所处的必须是一场<b>非零和博弈</b>——至少存在某种可能，让双方都能通过合作变得更好，实现双赢。',
  conclusion_3_a: '3. 低水平的误解',
  conclusion_3_a2: '如果误解与噪音<i>过高</i>，信任就会彻底瓦解；而当存在少量误会时，多一点<b>宽容</b>反而更有回报。',
  conclusion_4: '当然，现实世界中的信任还受声誉、共同价值观、契约精神等诸多因素影响。但别忘了……',
  conclusion_btn: '……最核心的一课。 &rarr;',

  outro_1:
    '如果说整个博弈论有一条最核心的启示，<br>那就是：<br><br>' +
    '<b>游戏规则是什么，决定了玩家会怎么做。</b><br>' +
    '我们今天面临的困境，不只是人与人之间失去了信任，<br>' +
    '更是我们的<i>社会环境与规则</i>在阻碍信任的演化。<br><br>' +
    '听起来或许有些无奈——似乎我们“只是”环境的产物——' +
    '但博弈论同样提醒我们：<b>我们每个人，就是彼此的环境。</b><br>' +
    '<b>短期来看，游戏塑造了玩家；但长远来看，正是我们玩家定义了游戏。</b><br><br>' +
    '所以，尽你所能去创造让信任得以生长的条件吧。' +
    '建立长久的关系。寻找双赢的解法。清晰坦诚地沟通。' +
    '也许到那时，我们就能停止互相攻击，走出各自的战壕，穿过无人区相聚在一起……',
  outro_1_btn: '……共同学会 &rarr;',

  outro_2: '……“自己活，也让别人活”。',
  outro_2_credits: '《对峙战壕间的圣诞休战》，AC Michael 绘，刊载于 1915 年 1 月 9 日《伦敦新闻画报》。',
  outro_2_btn: '❤',

  // CREDITS
  credits:
    '<div class="credits">' +
    '原著设计与开发：<br>' +
    '<span class="big">NICKY CASE</span><br>' +
    '《The Evolution of Trust》(2017) CC0 公共领域开源作品' +
    '<span class="divider"></span>' +
    '理论灵感源自罗伯特·阿克塞尔罗德 1984 年经典著作：<br>' +
    '<span class="big">《合作的进化》(THE EVOLUTION OF COOPERATION)</span><br>' +
    '跨越学科揭示互惠合作如何在自利个体间产生与演化' +
    '<span class="divider"></span>' +
    '愿我们在每一次重复博弈中，都能选择理性与宽容的善意 ❤' +
    '</div>',

  // THE PLAYERS
  label_tft: '复读机',
  label_short_tft: '复读机',
  icon_tft: '<span class="tft"><span class="icon"></span><span class="icon_label">复读机</span></span>',

  label_all_d: '万年老油条',
  label_short_all_d: '老油条',
  icon_all_d: '<span class="all_d"><span class="icon"></span><span class="icon_label">万年老油条</span></span>',

  label_all_c: '小粉红',
  label_short_all_c: '小粉红',
  icon_all_c: '<span class="all_c"><span class="icon"></span><span class="icon_label">小粉红</span></span>',

  label_grudge: '黑帮老铁',
  label_short_grudge: '黑帮老铁',
  icon_grudge: '<span class="grudge"><span class="icon"></span><span class="icon_label">黑帮老铁</span></span>',

  label_prober: '福尔摩斯',
  label_short_prober: '福尔摩斯',
  icon_prober: '<span class="prober"><span class="icon"></span><span class="icon_label">福尔摩斯</span></span>',

  label_tf2t: '复读小猫',
  label_short_tf2t: '复读小猫',
  icon_tf2t: '<span class="tf2t"><span class="icon"></span><span class="icon_label">复读小猫</span></span>',

  label_pavlov: '一根筋',
  label_short_pavlov: '一根筋',
  icon_pavlov: '<span class="pavlov"><span class="icon"></span><span class="icon_label">一根筋</span></span>',

  label_random: '胡乱来',
  label_short_random: '胡乱来',
  icon_random: '<span class="random"><span class="icon"></span><span class="icon_label">胡乱来</span></span>',

  forgot_whos_who: '（忘了谁是谁？长按角色按钮可查看性格说明！）',
  who_tft: '开局先合作，之后每一轮都原样照抄你上一轮的动作。',
  who_all_d: '永远选择欺骗。',
  who_all_c: '永远选择合作。',
  who_grudge: '开局合作并持续合作；但只要你欺骗他一次，之后他就永远选择欺骗。',
  who_prober:
    '开局按“合作、欺骗、合作、合作”试探。期间若你反击过，之后他就变成复读机；若你从不反击，他就变成万年老油条。',
  who_tf2t: '开局合作。只有当你连续两次欺骗他时，他才会反击选择欺骗。',
  who_pavlov: '开局合作。若上一轮你合作，他就重复自己上一轮动作；若上一轮你欺骗，他就切换自己上一轮动作。',
  who_random: '以 50% 对 50% 的概率随机选择合作或欺骗。',

  // SMALL LABELS
  label_cooperate: '合作',
  label_cheat: '欺骗',
  label_play: '开始',
  label_start: '开始',
  label_stop: '停止',
  label_step: '单步',
  label_reset: '重置',
  label_population: '人口分布',
  label_payoffs: '收益矩阵',
  label_rules: '规则设置',
  label_next: '下一步 &rarr;',
  label_continue: '继续',

  // CHAPTERS
  chapter_intro: '0. 序言',
  chapter_oneoff: '1. 单次博弈',
  chapter_iterated: '2. 重复博弈',
  chapter_tournament: '3. 单次锦标赛',
  chapter_evolution: '4. 重复锦标赛',
  chapter_distrust: '5. 不信任的演化',
  chapter_noise: '6. 误解与容错',
  chapter_sandbox: '7. 沙盒模式',
  chapter_conclusion: '8. 总结与启示',
  chapter_credits: '9. 致谢名单',

  // SHARING & CREDITS
  label_replay: '重新体验 ↻',
  label_share_friend: '分享给好友 ♥',
  label_share_short: '分享',
  share_default_title: '《信任的进化》：为什么人们越来越难彼此信任？博弈论互动指南',
  share_score_title:
    '我在《信任的进化》博弈挑战中拿到了 [SCORE] 分（满分49），你能看穿所有对手的套路吗？',
  share_tournament_title:
    '复读机、万年老油条、小粉红、福尔摩斯……谁才是博弈演化的最终赢家？',
  share_outro_title:
    '《信任的进化》：短期内游戏塑造玩家，长期内是我们塑造了游戏 ♥',
  share_timeline_default:
    '《信任的进化》博弈论互动指南：为什么朋友变成敌人，敌人又能变成朋友？',
  share_timeline_score:
    '我在《信任的进化》博弈挑战中得了 [SCORE] 分！一起看懂人与人之间信任的秘密',
}

export function t(key: string, replacements?: Record<string, string | number>): string {
  let str = WORDS_ZH[key] ?? key
  if (replacements) {
    for (const [k, v] of Object.entries(replacements)) {
      str = str.replace(new RegExp(`\\[${k}\\]`, 'g'), String(v))
    }
  }
  return str
}

export function getCharacterBadgeHtml(strategy: StrategyId): string {
  const name = WORDS_ZH[`label_${strategy}`] || strategy
  return `<span class="${strategy}">${name}</span>`
}

export function getShareAppMessageData(chapter: string, iteratedTotalScore: number) {
  let title = t('share_default_title')
  if (chapter === 'iterated' && iteratedTotalScore > 0) {
    title = t('share_score_title', { SCORE: iteratedTotalScore })
  } else if (
    chapter === 'tournament' ||
    chapter === 'evolution' ||
    chapter === 'distrust' ||
    chapter === 'noise'
  ) {
    title = t('share_tournament_title')
  } else if (chapter === 'sandbox' || chapter === 'conclusion' || chapter === 'credits') {
    title =
      iteratedTotalScore > 0
        ? t('share_score_title', { SCORE: iteratedTotalScore })
        : t('share_outro_title')
  }

  return {
    title,
    path: '/pages/index/index',
    imageUrl: '/static/ui/share_cover.jpg',
  }
}

export function getShareTimelineData(iteratedTotalScore: number) {
  const title =
    iteratedTotalScore > 0
      ? t('share_timeline_score', { SCORE: iteratedTotalScore })
      : t('share_timeline_default')

  return {
    title,
    query: '',
    imageUrl: '/static/ui/share_cover.jpg',
  }
}
