import { computeBoundaries, computeXRatio, computeYRatio, css, line, toCoords } from './utils'

function noop() {}

const HEIGHT = 40
const DPI_HEIGHT = HEIGHT * 2

export function sliderChart(root, data, DPI_WIDTH) {
  const WIDTH = DPI_WIDTH / 2
  const MIN_WIDTH = WIDTH * 0.05
  const canvas = root.querySelector('canvas')
  const context = canvas.getContext('2d')
  let nextFn = noop

  canvas.width = DPI_WIDTH
  canvas.height = DPI_HEIGHT
  css(canvas, {
    width: WIDTH + 'px',
    height: HEIGHT + 'px',
  })

  const $left = root.querySelector('[data-el="left"]')
  const $right = root.querySelector('[data-el="right"]')
  const $window = root.querySelector('[data-el="window"]')

  function next() {
    nextFn(getPosition())
  }

  function mouseup() {
    document.onmousemove = undefined
  }

  function mousedown(event) {
    const type = event.target.dataset.type
    const dimentions = {
      left: parseInt($window.style.left),
      right: parseInt($window.style.right),
      width: parseInt($window.style.width),
    }

    if (type === 'window') {
      const startX = event.pageX

      document.onmousemove = (e) => {
        const delta = startX - e.pageX

        if (delta === 0) {
          return
        }

        const left = dimentions.left - delta
        const right = WIDTH - left - dimentions.width

        setPosition(left, right)
        next()
      }
    } else if (type === 'left' || type === 'right') {
      const startX = event.pageX

      document.onmousemove = (e) => {
        const delta = startX - e.pageX

        if (delta === 0) {
          return
        }

        if (type === 'left') {
          const left = WIDTH - (dimentions.width + delta) - dimentions.right
          const right = WIDTH - (dimentions.width + delta) - left

          setPosition(left, right)
          next()
        } else {
          const right = WIDTH - (dimentions.width - delta) - dimentions.left

          setPosition(dimentions.left, right)
          next()
        }
      }
    }
  }

  root.addEventListener('mousedown', mousedown)
  document.addEventListener('mouseup', mouseup)

  const defaultWidth = WIDTH * 0.3

  setPosition(0, WIDTH - defaultWidth)

  function setPosition(left, right) {
    const w = WIDTH - right - left

    if (w < MIN_WIDTH) {
      css($window, { width: MIN_WIDTH + 'px' })
      return
    }

    if (left < 0) {
      css($window, { left: '0px' })
      css($left, { width: '0px' })
      return
    }

    if (right < 0) {
      css($window, { right: '0px' })
      css($right, { width: '0px' })
      return
    }

    css($window, {
      width: w + 'px',
      left: left + 'px',
      right: right + 'px',
    })

    css($left, { width: left + 'px' })
    css($right, { width: right + 'px' })
  }

  function getPosition() {
    const left = parseInt($left.style.width)
    const right = WIDTH - parseInt($right.style.width)

    return [(left * 100) / WIDTH, (right * 100) / WIDTH]
  }

  const [yMin, yMax] = computeBoundaries(data)
//   const yRatio = DPI_HEIGHT / (yMax - yMin)
//   const xRatio = DPI_WIDTH / (data.columns[0].length - 2)
  const yRatio = computeYRatio(DPI_HEIGHT, yMin, yMax)
  const xRatio = computeXRatio(DPI_WIDTH, data.columns[0].length)

  const yData = data.columns.filter((c) => data.types[c[0]] === 'line')

  yData.map(toCoords(xRatio, yRatio, DPI_HEIGHT, 0, yMin)).forEach((coords, i) => {
    const color = data.colors[yData[i][0]]

    line(context, coords, color)
  })

  return {
    subscribe(fn) {
      nextFn = fn
      fn(getPosition())
    },
  }
}
