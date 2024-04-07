type MineType = number
const BOOM_TYPE = 9

class MineSweeper {
  // 方格
  x: number = 0
  y: number = 0
  len: number = 0
  // 总数
  mine: MineType[] = []
  area: MineType[][] = []
  // 雷数
  boom: string[] = []
  boomCount: number = 0
  // 标记
  flags: string[] = []
  // 已点击
  lights: string[] = []
  pass: boolean | null = null

  constructor(cell: number[], boomCount: number) {
    this.x = cell[0]
    this.y = cell[1]
    this.len = this.x * this.y
    this.mine = new Array(this.len).fill(0)
    this.boomCount = boomCount
    this.makeBoom(boomCount)
    this.makeArea()
    this.calcBoom()
  }

  makeBoom(boomCount: number) {
    if (!boomCount || this.boom.length >= this.boomCount) return

    const boomIdx = Math.floor(Math.random() * this.len)

    if (this.mine[boomIdx] === BOOM_TYPE) {
      this.makeBoom(boomCount)
    } else {
      this.mine[boomIdx] = BOOM_TYPE
      const x = Math.floor(boomIdx / this.x)
      const y = Math.floor(boomIdx - x * this.x)
      const s = `${x},${y}`
      this.boom.push(s)
    }

    boomCount--
    this.makeBoom(boomCount)
  }

  makeArea(start = 0) {
    if (start >= this.len) return

    const row = this.mine.slice(start, start + this.x)
    this.area.push(row)
    this.makeArea(start + this.x)
  }

  calcBoom() {
    for (let i = 0; i < this.area.length; i++) {
      const row = this.area[i]

      for (let j = 0; j < row.length; j++) {
        if (this.area[i][j] === BOOM_TYPE) {
          continue
        }

        const edges = [
          this.area[i - 1]?.[j - 1],
          this.area[i]?.[j - 1],
          this.area[i + 1]?.[j - 1],
          this.area[i - 1]?.[j],
          this.area[i + 1]?.[j],
          this.area[i - 1]?.[j + 1],
          this.area[i]?.[j + 1],
          this.area[i + 1]?.[j + 1],
        ]

        const num = edges.filter((o) => o === BOOM_TYPE).length
        this.area[i][j] = num
      }
    }
  }

  flip(x: number, y: number, fliped: string[] = []) {
    if (this.pass === false) return [...this.lights]

    const s = `${x},${y}`
    if (!this.lights.includes(s)) {
      this.lights.push(s)
    }

    const cur = this.area[x][y]
    if (cur === BOOM_TYPE) {
      this.pass = false
      return [...this.lights]
    } else if (cur === 0) {
      fliped.push(s)

      const i = x
      const j = y

      const edgesXY = [
        [i - 1, j - 1],
        [i, j - 1],
        [i + 1, j - 1],
        [i - 1, j],
        [i + 1, j],
        [i - 1, j + 1],
        [i, j + 1],
        [i + 1, j + 1],
      ]

      edgesXY.forEach(([i, j]) => {
        if (typeof this.area[i]?.[j] !== 'number') return

        if (this.area[i]?.[j] !== BOOM_TYPE) {
          const s = `${i},${j}`
          if (this.lights.includes(s)) return
          this.lights.push(s)
        }
      })

      this.lights.forEach((s) => {
        if (fliped.includes(s)) return
        const [s1, s2] = s.split(',')
        const i = +s1
        const j = +s2
        if (i === x && j === y) return
        if (this.area[i]?.[j] === 0) {
          this.flip(i, j, fliped)
        }
      })
    }

    return [...this.lights]
  }

  flag(x: number, y: number) {
    if (this.pass !== null) return [...this.flags]

    const s = `${x},${y}`
    const boomCount = this.boom.length

    if (this.flags.includes(s)) {
      this.flags = this.flags.filter((o) => o !== s)
    } else if (this.flags.length < boomCount) {
      this.flags.push(s)
    }

    if (this.flags.length === boomCount) {
      let booms = [...this.boom]
      this.flags.forEach((o) => {
        booms = booms.filter((v) => o !== v)
      })
      this.pass = booms.length === 0
    }

    return [...this.flags]
  }
}

export { MineSweeper }
