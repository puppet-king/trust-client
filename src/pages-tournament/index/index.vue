<template>
  <StageLayout>
    <!-- ==================== 第 3 章：单次锦标赛 (tournament) ==================== -->
    <template v-if="gameStore.currentChapter === 'tournament'">
      <TournamentRing ref="tournamentRef" :x="-20" :y="20" />

      <!-- Step 0: 下注谁是冠军 -->
      <template v-if="gameStore.slideStep === 0">
        <view
          class="absolute animate-fade-in"
          style="position: absolute; left: 510px; top: 28px; width: 440px; font-size: 19px; line-height: 1.45; color: #333333"
        >
          <rich-text :nodes="t('place_your_bets')" />
        </view>

        <TrustButton
          :x="510"
          :y="245"
          character="tft"
          tooltip="who_tft"
          @click="onTournamentBet('tft')"
        />
        <TrustButton
          :x="730"
          :y="245"
          character="all_c"
          tooltip="who_all_c"
          @click="onTournamentBet('all_c')"
        />
        <TrustButton
          :x="510"
          :y="325"
          character="all_d"
          tooltip="who_all_d"
          @click="onTournamentBet('all_d')"
        />
        <TrustButton
          :x="730"
          :y="325"
          character="grudge"
          tooltip="who_grudge"
          @click="onTournamentBet('grudge')"
        />
        <TrustButton
          :x="510"
          :y="405"
          character="prober"
          tooltip="who_prober"
          @click="onTournamentBet('prober')"
        />

        <view
          class="absolute text-center"
          style="position: absolute; left: 725px; top: 405px; width: 205px; font-size: 15px; line-height: 1.35; color: #999999"
        >
          {{ t('forgot_whos_who') }}
        </view>
      </template>

      <!-- Step 1: 下注确认，点击进入第一场对决 -->
      <template v-else-if="gameStore.slideStep === 1">
        <view
          class="absolute animate-fade-in"
          style="position: absolute; left: 510px; top: 30px; width: 440px; font-size: 20px; line-height: 1.45; color: #333333"
        >
          <rich-text :nodes="tournamentIntroHtml" />
        </view>
        <TrustButton
          :x="510"
          :y="145"
          text-id="first_match"
          @click="onStartMatches"
        />
      </template>

      <!-- Step 2: 逐场展示 10 场循环赛结果与战壕故事 -->
      <template v-else-if="gameStore.slideStep === 2">
        <view
          v-if="currentMatchData"
          class="absolute animate-fade-in"
          style="position: absolute; left: 510px; top: 24px; width: 440px; font-size: 19px; line-height: 1.4; color: #333333"
        >
          <rich-text :nodes="currentMatchHeaderHtml" />

          <view class="mt-1 font-bold" style="font-size: 17px">
            {{ t('match_header_2') }}
          </view>
          <!-- 10 轮得分小图标 -->
          <view class="flex flex-row items-center my-1.5" style="display: flex; flex-direction: row; align-items: center; margin: 6px 0">
            <view
              v-for="(p, idx) in currentMatchData.payoffs"
              :key="idx"
              style="width: 40px; height: 40px; margin-right: 2px"
            >
              <SpriteImage
                src="/pages-tournament/static/score_small.png"
                :view-width="40"
                :view-height="40"
                :sheet-width="160"
                :sheet-height="40"
                :offset-x="getPayoffIconOffsetX(p[0])"
                :offset-y="0"
              />
            </view>
          </view>

          <rich-text :nodes="currentMatchTotalHtml" />
        </view>

        <!-- 战壕和平故事连载 -->
        <view
          class="absolute animate-fade-in"
          style="position: absolute; left: 510px; top: 230px; width: 440px; font-size: 19px; line-height: 1.45; color: #333333"
        >
          <rich-text :nodes="t('tournament_' + (matchNumber + 1))" />
        </view>

        <TrustButton
          :x="510"
          :y="420"
          size="long"
          :text-id="matchNumber < 9 ? 'next_match' : 'the_winner_is'"
          @click="onNextMatch"
        />
      </template>

      <!-- Step 3: 揭晓总冠军 -->
      <template v-else-if="gameStore.slideStep === 3">
        <view
          v-if="winnerRevealed"
          class="absolute animate-fade-in"
          style="position: absolute; left: 510px; top: 25px; width: 440px; font-size: 18.5px; line-height: 1.44; color: #333333"
        >
          <rich-text :nodes="tournamentWinnerHtml" />
        </view>
        <TrustButton
          v-if="winnerRevealed"
          :x="510"
          :y="435"
          size="long"
          text-id="tournament_teaser"
          @click="onEnterEvolution"
        />
      </template>
    </template>

    <!-- ==================== 第 4 章：重复锦标赛 / 世代演化 (evolution) ==================== -->
    <template v-else-if="gameStore.currentChapter === 'evolution'">
      <!-- Step 0: 演化三步舞曲图解 -->
      <template v-if="gameStore.slideStep === 0">
        <view
          class="absolute"
          style="position: absolute; left: 0px; top: 18px; width: 850px; font-size: 21px; color: #333333"
        >
          <rich-text :nodes="t('evolution_intro')" />
        </view>

        <image
          :src="'/pages-tournament/static/evolution_intro.png'"
          style="position: absolute; left: 0px; top: 60px; width: 960px; height: 170px"
          mode="scaleToFill"
        />

        <view
          class="absolute text-center"
          style="position: absolute; left: 0px; top: 238px; width: 287px; font-size: 18px; line-height: 1.4"
        >
          <rich-text :nodes="t('evolution_intro_1')" />
        </view>
        <view
          class="absolute text-center"
          style="position: absolute; left: 336px; top: 238px; width: 287px; font-size: 18px; line-height: 1.4"
        >
          <rich-text :nodes="t('evolution_intro_2')" />
        </view>
        <view
          class="absolute text-center"
          style="position: absolute; left: 669px; top: 238px; width: 287px; font-size: 18px; line-height: 1.4"
        >
          <rich-text :nodes="t('evolution_intro_3')" />
        </view>

        <view
          class="absolute text-right"
          style="position: absolute; left: 110px; top: 365px; width: 840px; font-size: 17.5px; line-height: 1.42; color: #333333"
        >
          <rich-text :nodes="t('evolution_intro_footer')" />
        </view>

        <TrustButton
          :x="615"
          :y="466"
          size="long"
          text-id="evolution_intro_button"
          @click="onStartEvolutionBetSlide"
        />
      </template>

      <!-- Step 1 ~ 5: 环形演化模拟 -->
      <template v-else>
        <TournamentRing
          ref="evoTournamentRef"
          :x="-20"
          :y="20"
          @step-completed="onEvoStepCompleted"
          @auto-play-change="evoAutoPlaying = $event"
        />

        <!-- Step 1: 下注 15 小粉红 vs 5 老油条 vs 5 复读机 -->
        <template v-if="gameStore.slideStep === 1">
          <view
            class="absolute animate-fade-in"
            style="position: absolute; left: 510px; top: 28px; width: 440px; font-size: 18.5px; line-height: 1.45"
          >
            <rich-text :nodes="t('evo_1')" />
          </view>

          <TrustButton
            :x="510"
            :y="295"
            character="all_c"
            tooltip="who_all_c"
            @click="onEvoBet('all_c')"
          />
          <TrustButton
            :x="510"
            :y="365"
            character="all_d"
            tooltip="who_all_d"
            @click="onEvoBet('all_d')"
          />
          <TrustButton
            :x="510"
            :y="435"
            character="tft"
            tooltip="who_tft"
            @click="onEvoBet('tft')"
          />

          <view
            class="absolute text-center"
            style="position: absolute; left: 725px; top: 420px; width: 205px; font-size: 15px; color: #999999"
          >
            {{ t('forgot_whos_who') }}
          </view>
        </template>

        <!-- Step 2: 分步点击 1) 比赛 -> 2) 淘汰 -> 3) 繁殖 -->
        <template v-else-if="gameStore.slideStep === 2">
          <view
            class="absolute animate-fade-in"
            style="position: absolute; left: 510px; top: 30px; width: 440px; font-size: 19px; line-height: 1.45"
          >
            <rich-text :nodes="evoStep2TextHtml" />
          </view>

          <TrustButton
            :x="510"
            :y="210"
            size="long"
            text-id="label_play_tournament"
            :active="evoActiveBtn === 1"
            @click="onEvoClickStep(1)"
          />
          <TrustButton
            :x="510"
            :y="280"
            size="long"
            text-id="label_eliminate_bottom_5"
            :active="evoActiveBtn === 2"
            @click="onEvoClickStep(2)"
          />
          <TrustButton
            :x="510"
            :y="350"
            size="long"
            text-id="label_reproduce_top_5"
            :active="evoActiveBtn === 3"
            @click="onEvoClickStep(3)"
          />
        </template>

        <!-- Step 3: 复读机继承世界总结 -->
        <template v-else-if="gameStore.slideStep === 3">
          <view
            class="absolute animate-fade-in"
            style="position: absolute; left: 510px; top: 30px; width: 440px; font-size: 19px; line-height: 1.45"
          >
            <rich-text :nodes="evoStep3TextHtml" />
          </view>
          <TrustButton
            :x="510"
            :y="350"
            size="long"
            text-id="evo_9_btn"
            @click="onEnterEvoAll5"
          />
        </template>

        <!-- Step 4: 加入黑帮老铁与福尔摩斯的自动演化 -->
        <template v-else-if="gameStore.slideStep === 4">
          <view
            class="absolute animate-fade-in"
            style="position: absolute; left: 510px; top: 26px; width: 440px; font-size: 18.5px; line-height: 1.42"
          >
            <rich-text :nodes="t('evo_10')" />
          </view>

          <TrustButton
            :x="510"
            :y="96"
            size="long"
            :text-id="evoAutoPlaying ? 'evo_autoplay_stop' : 'evo_autoplay'"
            @click="onToggleEvoAutoPlay"
          />

          <template v-if="evoFollowupVisible">
            <view
              class="absolute animate-fade-in"
              style="position: absolute; left: 510px; top: 175px; width: 440px; font-size: 17.5px; line-height: 1.42"
            >
              <rich-text :nodes="t('evo_10_followup')" />
            </view>
            <TrustButton
              :x="510"
              :y="450"
              size="long"
              text-id="evo_10_btn"
              @click="onEnterEvoProblem"
            />
          </template>
        </template>

        <!-- Step 5: 满屏老油条的反思 -->
        <template v-else-if="gameStore.slideStep === 5">
          <view
            class="absolute animate-fade-in"
            style="position: absolute; left: 510px; top: 28px; width: 440px; font-size: 18.5px; line-height: 1.45"
          >
            <rich-text :nodes="t('evo_11')" />
          </view>
          <TrustButton
            :x="510"
            :y="435"
            size="long"
            text-id="evo_11_btn"
            @click="onEnterDistrust"
          />
        </template>
      </template>
    </template>

    <!-- ==================== 第 5 章：不信任的演化 (distrust) ==================== -->
    <template v-else-if="gameStore.currentChapter === 'distrust'">
      <!-- 右侧锦标赛环 + 中央开始/单步/重置控制 -->
      <TournamentRing
        ref="distrustTournamentRef"
        :x="480"
        :y="20"
        @step-completed="onDistrustStepCompleted"
        @auto-play-change="distrustAutoPlaying = $event"
      />

      <TrustButton
        :x="671"
        :y="175"
        size="short"
        :text-id="distrustAutoPlaying ? 'label_stop' : 'label_start'"
        @click="onDistrustTogglePlay"
      />
      <TrustButton
        :x="671"
        :y="245"
        size="short"
        text-id="label_step"
        @click="onDistrustStep"
      />
      <TrustButton
        :x="671"
        :y="315"
        size="short"
        text-id="label_reset"
        @click="distrustTournamentRef?.reset()"
      />

      <!-- Step 0: 默认 10 轮下复读机获胜 -->
      <template v-if="gameStore.slideStep === 0">
        <view
          class="absolute animate-fade-in"
          style="position: absolute; left: 0px; top: 30px; width: 450px; font-size: 19.5px; line-height: 1.45"
        >
          <rich-text :nodes="t('distrust_1')" />
        </view>
      </template>

      <!-- Step 1: 调节每场对决回合数滑块 -->
      <template v-else-if="gameStore.slideStep === 1">
        <view
          class="absolute animate-fade-in"
          style="position: absolute; left: 0px; top: 24px; width: 450px; font-size: 18.5px; line-height: 1.44"
        >
          <rich-text :nodes="t('distrust_2')" />
        </view>

        <view
          class="absolute font-bold"
          style="position: absolute; left: 0px; top: 342px; width: 450px; font-size: 21px"
        >
          {{ t('sandbox_rules_1', { N: gameStore.turns }) }}
        </view>
        <TrustSlider
          :x="0"
          :y="378"
          :width="450"
          :min="1"
          :max="20"
          :step="1"
          :model-value="gameStore.turns"
          @change="onDistrustTurnsChange"
        />

        <template v-if="distrustShowContinue">
          <view
            class="absolute text-right"
            style="position: absolute; left: 110px; top: 440px; width: 215px; font-size: 16px; color: #999999"
          >
            {{ t('distrust_2_end') }}
          </view>
          <TrustButton
            :x="340"
            :y="432"
            size="short"
            text-id="label_continue"
            @click="gameStore.slideStep = 2"
          />
        </template>
      </template>

      <!-- Step 2: 重复互动减少导致不信任蔓延 -->
      <template v-else-if="gameStore.slideStep === 2">
        <view
          class="absolute animate-fade-in"
          style="position: absolute; left: 0px; top: 28px; width: 450px; font-size: 18.5px; line-height: 1.45"
        >
          <rich-text :nodes="t('distrust_3')" />
        </view>
        <TrustButton
          :x="0"
          :y="450"
          size="long"
          text-id="distrust_3_btn"
          @click="onEnterDistrustPayoffs"
        />
      </template>

      <!-- Step 3: 调节收益矩阵 (PayoffsUI) -->
      <template v-else-if="gameStore.slideStep === 3">
        <view
          class="absolute animate-fade-in"
          style="position: absolute; left: 0px; top: 4px; width: 450px; font-size: 18px; line-height: 1.38"
        >
          <rich-text :nodes="t('distrust_4')" />
        </view>

        <PayoffsUI
          :x="95"
          :y="54"
          :scale="0.8"
          :payoffs="gameStore.payoffs"
          @change="onDistrustPayoffsChange"
        />

        <view
          class="absolute animate-fade-in"
          style="position: absolute; left: 0px; top: 306px; width: 450px; font-size: 18px; line-height: 1.42"
        >
          <rich-text :nodes="t('distrust_4_2')" />
        </view>

        <view
          class="absolute text-center"
          style="position: absolute; left: 583px; top: 506px; width: 300px; font-size: 15px; color: #999999"
        >
          {{ t('distrust_4_note_2') }}
        </view>

        <template v-if="distrustShowContinue">
          <view
            class="absolute text-right"
            style="position: absolute; left: 0px; top: 476px; width: 325px; font-size: 15px; color: #999999"
          >
            {{ t('distrust_4_note') }}
          </view>
          <TrustButton
            :x="340"
            :y="468"
            size="short"
            text-id="label_continue"
            @click="gameStore.slideStep = 4"
          />
        </template>
      </template>

      <!-- Step 4: 零和博弈 vs 非零和博弈 -->
      <template v-else-if="gameStore.slideStep === 4">
        <view
          class="absolute animate-fade-in"
          style="position: absolute; left: 0px; top: 24px; width: 450px; font-size: 18.5px; line-height: 1.45"
        >
          <rich-text :nodes="t('distrust_5')" />
        </view>
        <TrustButton
          :x="0"
          :y="450"
          size="long"
          text-id="distrust_5_btn"
          @click="onEnterNoiseChapter"
        />
      </template>
    </template>

    <!-- ==================== 第 6 章：误解与容错 (noise) ==================== -->
    <template v-else-if="gameStore.currentChapter === 'noise'">
      <!-- Step 0: 两个复读机因为一次绊倒失误陷入无休止报复 -->
      <template v-if="gameStore.slideStep === 0">
        <IteratedMachine
          ref="noiseMachineRef"
          :x="130"
          :y="133"
          player-a-strategy="tft"
          opponent-strategy="tft"
        />

        <view
          v-if="noiseTextVisible"
          class="absolute text-center animate-fade-in"
          style="position: absolute; left: 130px; top: 28px; width: 700px; font-size: 19px; line-height: 1.42"
        >
          <rich-text :nodes="t('noise_' + (noiseStageIndex + 1))" />
        </view>

        <view
          v-if="noiseTextVisible"
          class="absolute text-center animate-fade-in"
          style="position: absolute; left: 130px; top: 405px; width: 700px; font-size: 19px; line-height: 1.42"
        >
          <rich-text :nodes="t('noise_' + (noiseStageIndex + 1) + '_end')" />
        </view>

        <TrustButton
          v-if="noiseStageIndex < 4"
          :x="383"
          :y="463"
          :text-id="noiseStageButtonTextId"
          :active="noiseBtnActive"
          @click="onNoisePlayStage"
        />
        <TrustButton
          v-else
          :x="304"
          :y="463"
          size="long"
          text-id="noise_5_btn"
          @click="onNoiseMeetNewChars"
        />
      </template>

      <!-- Step 1: 认识三位新角色（复读小猫、一根筋、胡乱来） -->
      <template v-else-if="gameStore.slideStep === 1">
        <view
          class="absolute"
          style="position: absolute; left: 160px; top: 18px; width: 640px; font-size: 21px"
        >
          {{ t('noise_characters') }}
        </view>

        <CharacterCard :x="160" :y="68" :width="640" character="tf2t" />
        <CharacterCard :x="160" :y="190" :width="640" character="pavlov" />
        <CharacterCard :x="160" :y="316" :width="640" character="random" />

        <view
          class="absolute text-right"
          style="position: absolute; left: 160px; top: 422px; width: 640px; font-size: 19px"
        >
          {{ t('noise_characters_end') }}
        </view>

        <TrustButton
          :x="460"
          :y="460"
          size="long"
          text-id="noise_characters_btn"
          @click="onEnterNoiseTournament1"
        />
      </template>

      <!-- Step 2 ~ 7: 含 5% 失误率的锦标赛演化实验 -->
      <template v-else>
        <TournamentRing
          ref="noiseTournamentRef"
          :x="-20"
          :y="20"
          @step-completed="onNoiseTournamentStepCompleted"
          @auto-play-change="noiseAutoPlaying = $event"
        />

        <!-- 左侧开始/单步/重置按钮（在 Step 3 / 5 / 6 显示） -->
        <template
          v-if="
            gameStore.slideStep === 3 ||
            gameStore.slideStep === 5 ||
            gameStore.slideStep === 6
          "
        >
          <TrustButton
            :x="172"
            :y="175"
            size="short"
            :text-id="noiseAutoPlaying ? 'label_stop' : 'label_start'"
            @click="onNoiseTogglePlay"
          />
          <TrustButton
            :x="172"
            :y="245"
            size="short"
            text-id="label_step"
            @click="onNoiseStep"
          />
          <TrustButton
            :x="172"
            :y="315"
            size="short"
            text-id="label_reset"
            @click="noiseTournamentRef?.reset()"
          />
        </template>

        <!-- Step 2: 温和环境 (13 小粉红 + 5% 失误率) 下注 -->
        <template v-if="gameStore.slideStep === 2">
          <view
            class="absolute animate-fade-in"
            style="position: absolute; left: 510px; top: 24px; width: 440px; font-size: 18px; line-height: 1.44"
          >
            <rich-text :nodes="t('noise_evo_1')" />
          </view>

          <TrustButton
            :x="510"
            :y="295"
            character="tf2t"
            tooltip="who_tf2t"
            @click="onNoiseBet1('tf2t')"
          />
          <TrustButton
            :x="710"
            :y="295"
            character="pavlov"
            tooltip="who_pavlov"
            @click="onNoiseBet1('pavlov')"
          />
          <TrustButton
            :x="510"
            :y="365"
            character="random"
            tooltip="who_random"
            @click="onNoiseBet1('random')"
          />
          <TrustButton
            :x="710"
            :y="365"
            character="tft"
            tooltip="who_tft"
            @click="onNoiseBet1('tft')"
          />
          <TrustButton
            :x="510"
            :y="435"
            character="all_c"
            tooltip="who_all_c"
            @click="onNoiseBet1('all_c')"
          />

          <view
            class="absolute text-center"
            style="position: absolute; left: 715px; top: 432px; width: 195px; font-size: 14px; color: #999999"
          >
            {{ t('forgot_whos_who') }}
          </view>
        </template>

        <!-- Step 3: 演化揭晓 -> 一根筋获胜 -->
        <template v-else-if="gameStore.slideStep === 3">
          <view
            class="absolute animate-fade-in"
            style="position: absolute; left: 510px; top: 28px; width: 440px; font-size: 18.5px; line-height: 1.42"
          >
            <rich-text :nodes="noiseEvo2IntroHtml" />
          </view>

          <template v-if="noiseResultRevealed">
            <view
              class="absolute animate-fade-in"
              style="position: absolute; left: 510px; top: 145px; width: 440px; font-size: 18px; line-height: 1.44"
            >
              <rich-text :nodes="noiseEvo2ResultHtml" />
            </view>
            <TrustButton
              :x="510"
              :y="375"
              size="long"
              text-id="noise_evo_2_2_btn"
              @click="onEnterNoiseTournament2"
            />
          </template>
        </template>

        <!-- Step 4: 险恶环境 (13 老油条 + 5% 失误率) 下注 -->
        <template v-else-if="gameStore.slideStep === 4">
          <view
            class="absolute animate-fade-in"
            style="position: absolute; left: 510px; top: 28px; width: 440px; font-size: 18.5px; line-height: 1.45"
          >
            <rich-text :nodes="t('noise_evo_3')" />
          </view>

          <TrustButton
            :x="510"
            :y="295"
            character="tf2t"
            tooltip="who_tf2t"
            @click="onNoiseBet2('tf2t')"
          />
          <TrustButton
            :x="710"
            :y="295"
            character="pavlov"
            tooltip="who_pavlov"
            @click="onNoiseBet2('pavlov')"
          />
          <TrustButton
            :x="510"
            :y="365"
            character="random"
            tooltip="who_random"
            @click="onNoiseBet2('random')"
          />
          <TrustButton
            :x="710"
            :y="365"
            character="tft"
            tooltip="who_tft"
            @click="onNoiseBet2('tft')"
          />
          <TrustButton
            :x="510"
            :y="435"
            character="all_d"
            tooltip="who_all_d"
            @click="onNoiseBet2('all_d')"
          />

          <view
            class="absolute text-center"
            style="position: absolute; left: 715px; top: 432px; width: 195px; font-size: 14px; color: #999999"
          >
            {{ t('forgot_whos_who') }}
          </view>
        </template>

        <!-- Step 5: 演化揭晓 -> 复读小猫获胜 -->
        <template v-else-if="gameStore.slideStep === 5">
          <view
            class="absolute animate-fade-in"
            style="position: absolute; left: 510px; top: 26px; width: 440px; font-size: 18.5px; line-height: 1.42"
          >
            <rich-text :nodes="noiseEvo4IntroHtml" />
          </view>

          <template v-if="noiseResultRevealed">
            <view
              class="absolute animate-fade-in"
              style="position: absolute; left: 510px; top: 112px; width: 440px; font-size: 18px; line-height: 1.42"
            >
              <rich-text :nodes="noiseEvo4ResultHtml" />
            </view>
            <TrustButton
              :x="510"
              :y="446"
              size="long"
              text-id="noise_evo_4_2_btn"
              @click="onEnterNoiseSliderStep"
            />
          </template>
        </template>

        <!-- Step 6: 自由调节失误率滑块 (0% ~ 50%) -->
        <template v-else-if="gameStore.slideStep === 6">
          <view
            class="absolute animate-fade-in"
            style="position: absolute; left: 510px; top: 28px; width: 440px; font-size: 18.5px; line-height: 1.44"
          >
            <rich-text :nodes="t('noise_evo_5')" />
          </view>

          <view
            class="absolute italic font-bold"
            style="position: absolute; left: 510px; top: 205px; width: 440px; font-size: 19px"
          >
            {{ t('sandbox_rules_3', { N: Math.round(gameStore.noise * 100) }) }}
          </view>

          <TrustSlider
            :x="510"
            :y="255"
            :width="440"
            :min="0"
            :max="0.5"
            :step="0.01"
            :model-value="gameStore.noise"
            @change="onNoiseSliderChange"
          />

          <template v-if="noiseShowContinue">
            <view
              class="absolute text-right"
              style="position: absolute; left: 540px; top: 405px; width: 410px; font-size: 16px; color: #999999"
            >
              {{ t('noise_evo_5_continue') }}
            </view>
            <TrustButton
              :x="835"
              :y="440"
              size="short"
              text-id="label_continue"
              @click="gameStore.slideStep = 7"
            />
          </template>
        </template>

        <!-- Step 7: 误解率阶段总结与前往沙盒 -->
        <template v-else-if="gameStore.slideStep === 7">
          <view
            class="absolute animate-fade-in"
            style="position: absolute; left: 510px; top: 15px; width: 440px; font-size: 18px; line-height: 1.43"
          >
            <rich-text :nodes="t('noise_evo_6')" />
          </view>
          <TrustButton
            :x="510"
            :y="466"
            size="long"
            text-id="noise_evo_6_btn"
            @click="gameStore.gotoChapter('sandbox', 0, true)"
          />
        </template>
      </template>
    </template>
  </StageLayout>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import StageLayout from '@/components/trust/StageLayout.vue'
import SpriteImage from '@/components/trust/SpriteImage.vue'
import TournamentRing, {
  type MatchResultData,
} from '@/components/trust/TournamentRing.vue'
import IteratedMachine from '@/components/trust/IteratedMachine.vue'
import TrustButton from '@/components/trust/TrustButton.vue'
import TrustSlider from '@/components/trust/TrustSlider.vue'
import PayoffsUI from '@/components/trust/PayoffsUI.vue'
import CharacterCard from '@/components/trust/CharacterCard.vue'
import type { MoveType, Payoffs, StrategyId } from '@/core/pd'
import { soundManager } from '@/core/sound'
import {
  getCharacterBadgeHtml,
  getShareAppMessageData,
  getShareTimelineData,
  t,
} from '@/locales/zh-CN'
import { type ChapterId, useGameStore } from '@/stores/game'

defineOptions({
  name: 'TrustTournamentPage',
})

const gameStore = useGameStore()

// 组件引用
const tournamentRef = ref<InstanceType<typeof TournamentRing> | null>(null)
const evoTournamentRef = ref<InstanceType<typeof TournamentRing> | null>(null)
const distrustTournamentRef = ref<InstanceType<typeof TournamentRing> | null>(null)
const noiseMachineRef = ref<InstanceType<typeof IteratedMachine> | null>(null)
const noiseTournamentRef = ref<InstanceType<typeof TournamentRing> | null>(null)

// ==================== 第 3 章：单次锦标赛 ====================
const matchNumber = ref(0)
const currentMatchData = ref<MatchResultData | null>(null)
const winnerRevealed = ref(false)

function initTournamentChapter() {
  gameStore.resetTournamentGlobals()
  gameStore.initialAgents = [
    { strategy: 'tft', count: 1 },
    { strategy: 'all_d', count: 1 },
    { strategy: 'all_c', count: 1 },
    { strategy: 'grudge', count: 1 },
    { strategy: 'prober', count: 1 },
  ]
  gameStore.flowerConnections = true
  nextTick(() => {
    tournamentRef.value?.reset()
  })
}

const tournamentIntroHtml = computed(() => {
  return t('tournament_intro', {
    CHAR: getCharacterBadgeHtml(gameStore.userBet),
  })
})

function onTournamentBet(char: StrategyId) {
  gameStore.userBet = char
  gameStore.slideStep = 1
}

function onStartMatches() {
  matchNumber.value = 0
  gameStore.slideStep = 2
  nextTick(() => {
    if (tournamentRef.value) {
      currentMatchData.value = tournamentRef.value.playMatch(0)
    }
  })
}

function onNextMatch() {
  if (matchNumber.value < 9) {
    matchNumber.value++
    if (tournamentRef.value) {
      currentMatchData.value = tournamentRef.value.playMatch(matchNumber.value)
    }
  } else {
    tournamentRef.value?.dehighlightAllConnections()
    winnerRevealed.value = false
    gameStore.slideStep = 3
    soundManager.play('drumroll', 0.8)
    setTimeout(() => {
      winnerRevealed.value = true
    }, 1500)
  }
}

function getPayoffIconOffsetX(payoff: number): number {
  if (payoff === gameStore.payoffs.R) return 0
  if (payoff === gameStore.payoffs.T) return -40
  if (payoff === gameStore.payoffs.S) return -80
  return -120
}

const currentMatchHeaderHtml = computed(() => {
  if (!currentMatchData.value) return ''
  return t('match_header_1', {
    N: matchNumber.value + 1,
    A: getCharacterBadgeHtml(currentMatchData.value.charA),
    B: getCharacterBadgeHtml(currentMatchData.value.charB),
  })
})

const currentMatchTotalHtml = computed(() => {
  if (!currentMatchData.value) return ''
  const sA =
    currentMatchData.value.scoreA > 0
      ? `+${currentMatchData.value.scoreA}`
      : `${currentMatchData.value.scoreA}`
  const sB =
    currentMatchData.value.scoreB > 0
      ? `+${currentMatchData.value.scoreB}`
      : `${currentMatchData.value.scoreB}`
  return t('match_header_3', {
    A: `<span class="${currentMatchData.value.charA}">${sA}</span>`,
    B: `<span class="${currentMatchData.value.charB}">${sB}</span>`,
  })
})

const tournamentWinnerHtml = computed(() => {
  const part1 = t('tournament_winner_1')
  const part2 =
    gameStore.userBet === 'tft'
      ? t('tournament_winner_2_yay')
      : t('tournament_winner_2_nay', {
          CHAR: getCharacterBadgeHtml(gameStore.userBet),
        })
  return `${part1} ${part2}<br><br>${t('tournament_winner_3')}`
})

function onEnterEvolution() {
  gameStore.gotoChapter('evolution', 0, true)
}

// ==================== 第 4 章：重复锦标赛 / 演化 ====================
const evoTextStep = ref(2)
const evoActiveBtn = ref<1 | 2 | 3 | 0>(1)
const evoAutoPlaying = ref(false)
const evoAutoStepsCount = ref(0)
const evoFollowupVisible = ref(false)

function onStartEvolutionBetSlide() {
  gameStore.runScratchTransition(() => {
    gameStore.resetTournamentGlobals()
    gameStore.initialAgents = [
      { strategy: 'all_c', count: 15 },
      { strategy: 'all_d', count: 5 },
      { strategy: 'tft', count: 5 },
    ]
    gameStore.slideStep = 1
    nextTick(() => {
      evoTournamentRef.value?.reset()
    })
  })
}

function onEvoBet(char: StrategyId) {
  gameStore.userBet = char
  evoTextStep.value = 2
  evoActiveBtn.value = 1
  gameStore.slideStep = 2
}

const evoStep2TextHtml = computed(() => {
  if (evoTextStep.value === 2) {
    return `${t('evo_2_' + gameStore.userBet)} ${t('evo_2')}`
  }
  if (evoTextStep.value === 3) {
    return `${t('evo_3_' + gameStore.userBet)} ${t('evo_3')}`
  }
  return t('evo_' + evoTextStep.value)
})

const evoStep3TextHtml = computed(() => {
  return `${t('evo_9')}<br><br>${t('evo_9_' + gameStore.userBet)} ${t('evo_9_end')}`
})

function onEvoClickStep(btnIdx: 1 | 2 | 3) {
  if (evoActiveBtn.value !== btnIdx) return
  evoActiveBtn.value = 0
  if (btnIdx === 1) evoTournamentRef.value?.startPlay()
  else if (btnIdx === 2) evoTournamentRef.value?.startEliminate()
  else if (btnIdx === 3) evoTournamentRef.value?.startReproduce()
}

function onEvoStepCompleted(step: 'play' | 'eliminate' | 'reproduce') {
  if (gameStore.slideStep === 2) {
    if (step === 'play') {
      evoActiveBtn.value = 2
    } else if (step === 'eliminate') {
      evoActiveBtn.value = 3
    } else if (step === 'reproduce') {
      evoTextStep.value++
      if (evoTextStep.value < 9) {
        evoActiveBtn.value = 1
      } else {
        gameStore.slideStep = 3
      }
    }
  } else if (gameStore.slideStep === 4) {
    evoAutoStepsCount.value++
    if (evoAutoStepsCount.value >= 12) {
      evoFollowupVisible.value = true
    }
  }
}

function onEnterEvoAll5() {
  evoAutoStepsCount.value = 0
  evoFollowupVisible.value = false
  gameStore.slideStep = 4
  gameStore.runLocalScratch(0, 0, 480, 540, () => {
    gameStore.resetTournamentGlobals()
    gameStore.initialAgents = [
      { strategy: 'all_c', count: 5 },
      { strategy: 'all_d', count: 5 },
      { strategy: 'tft', count: 5 },
      { strategy: 'grudge', count: 5 },
      { strategy: 'prober', count: 5 },
    ]
    evoTournamentRef.value?.reset()
  })
}

function onToggleEvoAutoPlay() {
  evoTournamentRef.value?.toggleAutoPlay()
  setTimeout(() => {
    evoFollowupVisible.value = true
  }, 2400)
}

function onEnterEvoProblem() {
  evoTournamentRef.value?.stopAutoPlay()
  soundManager.play('fart', 0.85)
  gameStore.resetTournamentGlobals()
  gameStore.initialAgents = [
    { strategy: 'all_d', count: 24 },
    { strategy: 'tft', count: 1 },
  ]
  gameStore.slideStep = 5
  nextTick(() => {
    evoTournamentRef.value?.reset()
  })
}

function onEnterDistrust() {
  gameStore.currentChapter = 'distrust'
  gameStore.slideStep = 0
  initDistrustChapter()
}

// ==================== 第 5 章：不信任的演化 ====================
const distrustAutoPlaying = ref(false)
const distrustShowContinue = ref(false)

function initDistrustChapter() {
  gameStore.resetTournamentGlobals()
  gameStore.initialAgents = [
    { strategy: 'all_c', count: 23 },
    { strategy: 'all_d', count: 1 },
    { strategy: 'tft', count: 1 },
  ]
  distrustShowContinue.value = false
  nextTick(() => {
    distrustTournamentRef.value?.reset()
  })
}

function onDistrustTogglePlay() {
  distrustTournamentRef.value?.toggleAutoPlay()
  if (gameStore.slideStep === 1 || gameStore.slideStep === 3) {
    distrustShowContinue.value = true
  }
}

function onDistrustStep() {
  distrustTournamentRef.value?.stepManually()
  if (gameStore.slideStep === 1 || gameStore.slideStep === 3) {
    distrustShowContinue.value = true
  }
}

function onDistrustStepCompleted(step: 'play' | 'eliminate' | 'reproduce') {
  if (gameStore.slideStep === 0 && step === 'reproduce') {
    distrustShowContinue.value = false
    gameStore.slideStep = 1
  }
}

function onDistrustTurnsChange(val: number) {
  gameStore.turns = val
  distrustTournamentRef.value?.reset()
  distrustShowContinue.value = true
}

function onEnterDistrustPayoffs() {
  distrustShowContinue.value = false
  gameStore.resetTournamentGlobals()
  gameStore.initialAgents = [
    { strategy: 'all_c', count: 23 },
    { strategy: 'all_d', count: 1 },
    { strategy: 'tft', count: 1 },
  ]
  gameStore.turns = 10
  gameStore.slideStep = 3
  nextTick(() => {
    distrustTournamentRef.value?.reset()
  })
}

function onDistrustPayoffsChange(next: Payoffs) {
  gameStore.payoffs = next
  distrustTournamentRef.value?.reset()
  distrustShowContinue.value = true
}

function onEnterNoiseChapter() {
  distrustTournamentRef.value?.stopAutoPlay()
  gameStore.gotoChapter('noise', 0, true)
}

// ==================== 第 6 章：误解与容错 (noise) ====================
const NOISE_STAGES: { button: string; move: MoveType | 'TRIP' }[] = [
  { button: 'cooperate', move: 'COOPERATE' },
  { button: 'cooperate', move: 'TRIP' },
  { button: 'cooperate', move: 'COOPERATE' },
  { button: 'cheat', move: 'CHEAT' },
]

const noiseStageIndex = ref(0)
const noiseBtnActive = ref(true)
const noiseTextVisible = ref(true)
const noiseAutoPlaying = ref(false)
const noiseReproduceSteps = ref(0)
const noiseResultRevealed = ref(false)
const noiseShowContinue = ref(false)
let foreverWarTimer: ReturnType<typeof setTimeout> | null = null
let foreverWarActive = false

const noiseStageButtonTextId = computed(() => {
  const s = NOISE_STAGES[noiseStageIndex.value]
  return s ? `label_${s.button}` : 'label_cooperate'
})

function initNoiseChapter() {
  foreverWarActive = false
  if (foreverWarTimer) clearTimeout(foreverWarTimer)
  noiseStageIndex.value = 0
  noiseBtnActive.value = true
  noiseTextVisible.value = true
  gameStore.resetTournamentGlobals()
}

async function onNoisePlayStage() {
  if (!noiseBtnActive.value) return
  const stage = NOISE_STAGES[noiseStageIndex.value]
  if (!stage || !noiseMachineRef.value) return

  noiseBtnActive.value = false
  noiseTextVisible.value = false

  await noiseMachineRef.value.playOneRound(stage.move)

  noiseStageIndex.value++
  noiseTextVisible.value = true

  if (noiseStageIndex.value >= NOISE_STAGES.length) {
    // 开启自动交替报复循环演示
    foreverWarActive = true
    let nextMove: MoveType = 'COOPERATE'
    const loopForever = async () => {
      if (!foreverWarActive || gameStore.currentChapter !== 'noise' || gameStore.slideStep !== 0) {
        return
      }
      if (noiseMachineRef.value) {
        await noiseMachineRef.value.playOneRound(nextMove)
        nextMove = nextMove === 'COOPERATE' ? 'CHEAT' : 'COOPERATE'
        foreverWarTimer = setTimeout(loopForever, 200)
      }
    }
    loopForever()
  } else {
    noiseBtnActive.value = true
  }
}

function onNoiseMeetNewChars() {
  foreverWarActive = false
  if (foreverWarTimer) clearTimeout(foreverWarTimer)
  gameStore.runScratchTransition(() => {
    gameStore.slideStep = 1
  })
}

function onEnterNoiseTournament1() {
  gameStore.runScratchTransition(() => {
    gameStore.resetTournamentGlobals()
    gameStore.initialAgents = [
      { strategy: 'tf2t', count: 3 },
      { strategy: 'pavlov', count: 3 },
      { strategy: 'random', count: 3 },
      { strategy: 'tft', count: 3 },
      { strategy: 'all_c', count: 13 },
    ]
    gameStore.noise = 0.05
    gameStore.slideStep = 2
    nextTick(() => {
      noiseTournamentRef.value?.reset()
    })
  })
}

function onNoiseBet1(char: StrategyId) {
  gameStore.userBet = char
  noiseReproduceSteps.value = 0
  noiseResultRevealed.value = false
  gameStore.slideStep = 3
}

function onNoiseBet2(char: StrategyId) {
  gameStore.userBet = char
  noiseReproduceSteps.value = 0
  noiseResultRevealed.value = false
  gameStore.slideStep = 5
}

const noiseEvo2IntroHtml = computed(() => {
  return t('noise_evo_2', {
    CHAR: getCharacterBadgeHtml(gameStore.userBet),
  })
})

const noiseEvo2ResultHtml = computed(() => {
  const prefix =
    gameStore.userBet === 'pavlov'
      ? t('noise_evo_2_2_correct')
      : t('noise_evo_2_2_incorrect')
  return `${prefix} ${t('noise_evo_2_2')}`
})

const noiseEvo4IntroHtml = computed(() => {
  return t('noise_evo_4', {
    CHAR: getCharacterBadgeHtml(gameStore.userBet),
  })
})

const noiseEvo4ResultHtml = computed(() => {
  const prefix =
    gameStore.userBet === 'tf2t'
      ? t('noise_evo_4_2_correct')
      : t('noise_evo_4_2_incorrect')
  return `${prefix} ${t('noise_evo_4_2')}`
})

function onNoiseTogglePlay() {
  noiseTournamentRef.value?.toggleAutoPlay()
  if (gameStore.slideStep === 6) {
    noiseShowContinue.value = true
  }
}

function onNoiseStep() {
  noiseTournamentRef.value?.stepManually()
  if (gameStore.slideStep === 6) {
    noiseShowContinue.value = true
  }
}

function onNoiseTournamentStepCompleted(step: 'play' | 'eliminate' | 'reproduce') {
  if (step === 'reproduce') {
    noiseReproduceSteps.value++
    if (gameStore.slideStep === 3 && noiseReproduceSteps.value >= 6) {
      noiseResultRevealed.value = true
    } else if (gameStore.slideStep === 5 && noiseReproduceSteps.value >= 8) {
      noiseResultRevealed.value = true
    }
  }
}

function onEnterNoiseTournament2() {
  noiseTournamentRef.value?.stopAutoPlay()
  gameStore.resetTournamentGlobals()
  gameStore.initialAgents = [
    { strategy: 'tf2t', count: 3 },
    { strategy: 'pavlov', count: 3 },
    { strategy: 'random', count: 3 },
    { strategy: 'tft', count: 3 },
    { strategy: 'all_d', count: 13 },
  ]
  gameStore.noise = 0.05
  gameStore.slideStep = 4
  nextTick(() => {
    noiseTournamentRef.value?.reset()
  })
}

function onEnterNoiseSliderStep() {
  noiseTournamentRef.value?.stopAutoPlay()
  noiseShowContinue.value = false
  gameStore.noise = 0.05
  gameStore.slideStep = 6
  nextTick(() => {
    noiseTournamentRef.value?.reset()
  })
}

function onNoiseSliderChange(val: number) {
  gameStore.noise = val
  noiseTournamentRef.value?.reset()
  noiseShowContinue.value = true
}

function setupByCurrentChapter(ch: ChapterId) {
  if (ch === 'tournament') {
    initTournamentChapter()
  } else if (ch === 'evolution') {
    if (gameStore.slideStep === 1) {
      gameStore.resetTournamentGlobals()
      gameStore.initialAgents = [
        { strategy: 'all_c', count: 15 },
        { strategy: 'all_d', count: 5 },
        { strategy: 'tft', count: 5 },
      ]
      nextTick(() => evoTournamentRef.value?.reset())
    }
  } else if (ch === 'distrust') {
    initDistrustChapter()
  } else if (ch === 'noise') {
    initNoiseChapter()
  }
}

watch(
  () => gameStore.currentChapter,
  (ch) => {
    setupByCurrentChapter(ch)
  },
)

onLoad((query?: Record<string, string>) => {
  const ch = (query?.chapter as ChapterId) || gameStore.currentChapter
  if (
    ch === 'tournament' ||
    ch === 'evolution' ||
    ch === 'distrust' ||
    ch === 'noise'
  ) {
    gameStore.currentChapter = ch
    gameStore.slideStep = Number(query?.step || 0)
  } else {
    gameStore.currentChapter = 'tournament'
    gameStore.slideStep = 0
  }
  setupByCurrentChapter(gameStore.currentChapter)
})

onUnmounted(() => {
  foreverWarActive = false
  if (foreverWarTimer) clearTimeout(foreverWarTimer)
})

onShareAppMessage(() => {
  return getShareAppMessageData(gameStore.currentChapter, gameStore.iteratedTotalScore)
})

onShareTimeline(() => {
  return getShareTimelineData(gameStore.iteratedTotalScore)
})
</script>
