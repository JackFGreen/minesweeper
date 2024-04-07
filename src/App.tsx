import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { MineSweeper } from './mine'

function App() {
  const [data, setData] = useState<MineSweeper>()
  const [flipData, setFlipData] = useState<ReturnType<MineSweeper['flip']>>([])
  const [flagData, setFlagData] = useState<ReturnType<MineSweeper['flag']>>([])
  const [pass, setPass] = useState<MineSweeper['pass']>(null)
  const [debug, setDebug] = useState(true)

  const handleClick = useCallback(
    (i, j) => {
      if (!data) return
      const res = data.flip(i, j)
      setFlipData(res)
      setPass(data.pass)
    },
    [data]
  )

  const handleRightClick = useCallback(
    (e, i, j) => {
      if (!data) return
      e.preventDefault()

      const flags = data.flag(i, j)
      setFlagData(flags)
      setPass(data.pass)
    },
    [data]
  )

  const [area, setArea] = useState({
    row: 5,
    col: 5,
    boom: 5,
  })

  const handleCreate = useCallback(() => {
    const data = new MineSweeper([area.row, area.col], area.boom)
    console.log(data)
    setData(data)
    setFlipData([])
    setFlagData([])
    setPass(null)
  }, [area])

  useEffect(() => {
    handleCreate()
  }, [])

  return (
    <div>
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div>
            <span>row: </span>
            <input
              type='text'
              value={area.row}
              onChange={(e) =>
                setArea((prev) => ({
                  ...prev,
                  row: +e.target.value,
                }))
              }
            />
          </div>
          <div>
            <span>column: </span>
            <input
              type='text'
              value={area.col}
              onChange={(e) =>
                setArea((prev) => ({
                  ...prev,
                  col: +e.target.value,
                }))
              }
            />
          </div>
          <div>
            <span>boom: </span>
            <input
              type='text'
              value={area.boom}
              onChange={(e) =>
                setArea((prev) => ({
                  ...prev,
                  boom: +e.target.value,
                }))
              }
            />
          </div>
          <button onClick={handleCreate}>create</button>
        </div>
        <div>
          <input
            type='checkbox'
            id='debug'
            checked={debug}
            onChange={(e) => setDebug(e.target.checked)}
          />
          <label htmlFor='debug'>debug</label>
        </div>
      </div>

      {data ? (
        <div
          className='box'
          style={{
            margin: 'auto',
            width: data.x * 33,
            aspectRatio: data.x / data.y,
            gridTemplateRows: `repeat(${data.y}, 1fr)`,
            gridTemplateColumns: `repeat(${data.x}, 1fr)`,
          }}
        >
          {data.area.map((row, i) => {
            return row.map((o, j) => {
              const key = `${i},${j}`
              const fliped = flipData.includes(key)
              return (
                <div
                  className='cell'
                  key={key}
                  style={{
                    color: o === 9 ? 'red' : '',
                    background:
                      pass === true
                        ? 'rgba(0, 255, 0, 0.5)'
                        : pass === false
                        ? 'rgba(255, 0, 0, 0.3)'
                        : fliped
                        ? '#ccc'
                        : 'gray',
                  }}
                  onClick={() => handleClick(i, j)}
                  onContextMenu={(e) => handleRightClick(e, i, j)}
                >
                  {debug || pass !== null || fliped ? o : null}
                  {flagData.includes(key) ? '🚩' : null}
                </div>
              )
            })
          })}
        </div>
      ) : null}
    </div>
  )
}

export default App
