export type StrategyId =
  | 'tft'
  | 'all_d'
  | 'all_c'
  | 'grudge'
  | 'prober'
  | 'tf2t'
  | 'pavlov'
  | 'random'

export type MoveType = 'COOPERATE' | 'CHEAT'

export interface Payoffs {
  P: number // Punishment (both cheat)
  S: number // Sucker (you cooperate, they cheat)
  R: number // Reward (both cooperate)
  T: number // Temptation (you cheat, they cooperate)
}

export interface AgentConfig {
  strategy: StrategyId
  count: number
}

export interface StrategyLogic {
  play: () => MoveType
  remember: (own: MoveType, other: MoveType) => void
}

export interface PeepMeta {
  frame: number
  color: string
}

export const PEEP_METADATA: Record<StrategyId, PeepMeta> = {
  tft: { frame: 0, color: '#4089DD' },
  all_d: { frame: 1, color: '#52537F' },
  all_c: { frame: 2, color: '#FF75FF' },
  grudge: { frame: 3, color: '#efc701' },
  prober: { frame: 4, color: '#f6b24c' },
  tf2t: { frame: 5, color: '#88A8CE' },
  pavlov: { frame: 6, color: '#86C448' },
  random: { frame: 7, color: '#FF5E5E' },
}

export const ALL_STRATEGIES: StrategyId[] = [
  'tft',
  'all_d',
  'all_c',
  'grudge',
  'prober',
  'tf2t',
  'pavlov',
  'random',
]

export const PD_COOPERATE: MoveType = 'COOPERATE'
export const PD_CHEAT: MoveType = 'CHEAT'

export const PAYOFFS_DEFAULT: Payoffs = {
  P: 0,
  S: -1,
  R: 2,
  T: 3,
}

export const DEFAULT_INITIAL_AGENTS: AgentConfig[] = [
  { strategy: 'tft', count: 3 },
  { strategy: 'all_d', count: 3 },
  { strategy: 'all_c', count: 3 },
  { strategy: 'grudge', count: 3 },
  { strategy: 'prober', count: 3 },
  { strategy: 'tf2t', count: 3 },
  { strategy: 'pavlov', count: 3 },
  { strategy: 'random', count: 4 },
]

export function getPayoffs(
  move1: MoveType,
  move2: MoveType,
  payoffs: Payoffs = PAYOFFS_DEFAULT,
): [number, number] {
  if (move1 === PD_CHEAT && move2 === PD_CHEAT) return [payoffs.P, payoffs.P]
  if (move1 === PD_COOPERATE && move2 === PD_CHEAT) return [payoffs.S, payoffs.T]
  if (move1 === PD_CHEAT && move2 === PD_COOPERATE) return [payoffs.T, payoffs.S]
  return [payoffs.R, payoffs.R]
}

export function createLogic(strategy: StrategyId): StrategyLogic {
  switch (strategy) {
    case 'tft': {
      let otherMove: MoveType = PD_COOPERATE
      return {
        play: () => otherMove,
        remember: (_own, other) => {
          otherMove = other
        },
      }
    }
    case 'tf2t': {
      let howManyTimesCheated = 0
      return {
        play: () => (howManyTimesCheated >= 2 ? PD_CHEAT : PD_COOPERATE),
        remember: (_own, other) => {
          if (other === PD_CHEAT) {
            howManyTimesCheated++
          } else {
            howManyTimesCheated = 0
          }
        },
      }
    }
    case 'grudge': {
      let everCheatedMe = false
      return {
        play: () => (everCheatedMe ? PD_CHEAT : PD_COOPERATE),
        remember: (_own, other) => {
          if (other === PD_CHEAT) everCheatedMe = true
        },
      }
    }
    case 'all_d': {
      return {
        play: () => PD_CHEAT,
        remember: () => {},
      }
    }
    case 'all_c': {
      return {
        play: () => PD_COOPERATE,
        remember: () => {},
      }
    }
    case 'random': {
      return {
        play: () => (Math.random() > 0.5 ? PD_COOPERATE : PD_CHEAT),
        remember: () => {},
      }
    }
    case 'pavlov': {
      let myLastMove: MoveType = PD_COOPERATE
      return {
        play: () => myLastMove,
        remember: (own, other) => {
          myLastMove = own
          if (other === PD_CHEAT) {
            myLastMove = myLastMove === PD_COOPERATE ? PD_CHEAT : PD_COOPERATE
          }
        },
      }
    }
    case 'prober': {
      const moves: MoveType[] = [PD_COOPERATE, PD_CHEAT, PD_COOPERATE, PD_COOPERATE]
      let everCheatedMe = false
      let otherMove: MoveType = PD_COOPERATE
      return {
        play: () => {
          if (moves.length > 0) {
            return moves.shift()!
          }
          return everCheatedMe ? otherMove : PD_CHEAT
        },
        remember: (_own, other) => {
          if (moves.length > 0) {
            if (other === PD_CHEAT) everCheatedMe = true
          }
          otherMove = other
        },
      }
    }
  }
}

export interface SimAgent {
  id: number
  strategy: StrategyId
  coins: number
  logic: StrategyLogic
  resetCoins: () => void
  resetLogic: () => void
  play: () => MoveType
  remember: (own: MoveType, other: MoveType) => void
  addPayoff: (p: number) => void
}

export function createSimAgent(id: number, strategy: StrategyId): SimAgent {
  const agent: SimAgent = {
    id,
    strategy,
    coins: 0,
    logic: createLogic(strategy),
    resetCoins() {
      this.coins = 0
    },
    resetLogic() {
      this.logic = createLogic(this.strategy)
    },
    play() {
      return this.logic.play()
    },
    remember(own, other) {
      this.logic.remember(own, other)
    },
    addPayoff(p) {
      this.coins += p
    },
  }
  return agent
}

export function playOneGame(
  playerA: SimAgent,
  playerB: SimAgent,
  noise = 0,
  payoffs: Payoffs = PAYOFFS_DEFAULT,
): [number, number] {
  let A = playerA.play()
  let B = playerB.play()

  if (Math.random() < noise) A = A === PD_COOPERATE ? PD_CHEAT : PD_COOPERATE
  if (Math.random() < noise) B = B === PD_COOPERATE ? PD_CHEAT : PD_COOPERATE

  const result = getPayoffs(A, B, payoffs)

  playerA.remember(A, B)
  playerB.remember(B, A)

  playerA.addPayoff(result[0])
  playerB.addPayoff(result[1])

  return result
}

export interface RepeatedGameScores {
  totalA: number
  totalB: number
  payoffs: [number, number][]
}

export function playRepeatedGame(
  playerA: SimAgent,
  playerB: SimAgent,
  turns: number,
  noise = 0,
  payoffs: Payoffs = PAYOFFS_DEFAULT,
): RepeatedGameScores {
  playerA.resetLogic()
  playerB.resetLogic()

  const scores: RepeatedGameScores = {
    totalA: 0,
    totalB: 0,
    payoffs: [],
  }

  for (let i = 0; i < turns; i++) {
    const p = playOneGame(playerA, playerB, noise, payoffs)
    scores.payoffs.push(p)
    scores.totalA += p[0]
    scores.totalB += p[1]
  }

  return scores
}

export function playOneTournament(
  agents: SimAgent[],
  turns: number,
  noise = 0,
  payoffs: Payoffs = PAYOFFS_DEFAULT,
): void {
  for (let i = 0; i < agents.length; i++) {
    agents[i].resetCoins()
  }
  for (let i = 0; i < agents.length; i++) {
    const playerA = agents[i]
    for (let j = i + 1; j < agents.length; j++) {
      const playerB = agents[j]
      playRepeatedGame(playerA, playerB, turns, noise, payoffs)
    }
  }
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = array.slice()
  let top = arr.length
  if (top) {
    while (--top) {
      const current = Math.floor(Math.random() * (top + 1))
      const tmp = arr[current]
      arr[current] = arr[top]
      arr[top] = tmp
    }
  }
  return arr
}

/**
 * 沙盒模式人口动态平衡算法（保持总人数恒定为 25）
 * 1:1 还原 SandboxUI.js 中的 _anchorPopulation 与 _adjustPopulation
 */
export function adjustSandboxPopulation(
  currentConfigs: AgentConfig[],
  anchorSnapshot: number[],
  peepID: StrategyId,
  newValue: number,
): AgentConfig[] {
  const result = currentConfigs.map((c) => ({ ...c }))
  const anchoredIdx = result.findIndex((c) => c.strategy === peepID)
  if (anchoredIdx < 0) return result

  let popSnapshot = anchorSnapshot.slice()
  const initValue = popSnapshot[anchoredIdx]
  let remainder: number

  if (initValue === 25) {
    popSnapshot = result.map((_, idx) => (idx === anchoredIdx ? 18 : 1))
    remainder = 7
  } else {
    remainder = 25 - initValue
  }

  result[anchoredIdx].count = newValue
  const newRemainder = 25 - newValue
  const scale = remainder > 0 ? newRemainder / remainder : 0

  let total = 0
  for (let i = 0; i < result.length; i++) {
    if (result[i].strategy === peepID) continue
    const newCount = Math.round(popSnapshot[i] * scale)
    result[i].count = newCount
    total += newCount
  }
  total += newValue

  let diff = 25 - total
  if (diff < 0) {
    for (let i = result.length - 1; i >= 0 && diff < 0; i--) {
      if (result[i].strategy === peepID) continue
      if (result[i].count === 0) continue
      result[i].count--
      diff++
    }
  }

  let everyoneElseWasZero = true
  if (diff > 0) {
    for (let i = 0; i < result.length && diff > 0; i++) {
      if (result[i].strategy === peepID) continue
      if (result[i].count === 0) continue
      everyoneElseWasZero = false
      result[i].count++
      diff--
    }
  }
  if (everyoneElseWasZero && diff > 0) {
    for (let i = 0; i < result.length && diff > 0; i++) {
      if (result[i].strategy === peepID) continue
      result[i].count++
      diff--
    }
  }

  return result
}
