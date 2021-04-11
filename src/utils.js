export function toDate(timestamp) {
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  //   const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const date = new Date(timestamp)

  return `${shortMonths[date.getMonth()]} ${date.getDate()}`
}

export function isOver(mouse, x, length, dWidth) {
  if (!mouse) return false

  const width = dWidth / length

  return Math.abs(x - mouse.x) < width / 2
}

export function line(context, coords, color, translate = 0) {
  context.beginPath()
  context.save()
  context.lineWidth = 4
  context.strokeStyle = color
  context.translate(translate, 0)

  for (const [x, y] of coords) {
    context.lineTo(x, y)
  }

  context.stroke()
  context.restore()
  context.closePath()
}

export function circule(context, [x, y], color, radius) {
  context.beginPath()

  context.strokeStyle = color
  context.lineWidth = 4
  context.fillStyle = '#fff'
  context.arc(x, y, radius, 0, Math.PI * 2)
  context.fill()

  context.stroke()
  context.closePath()
}

export function computeBoundaries({ columns, types }) {
  let min
  let max

  columns.forEach((col) => {
    if (types[col[0]] !== 'line') {
      return
    }

    if (typeof min !== 'number') min = col[1]
    if (typeof max !== 'number') max = col[1]

    if (min > col[1]) min = col[1]
    if (max < col[1]) max = col[1]

    for (let i = 2; i < col.length; i++) {
      if (min > col[i]) min = col[i]
      if (max < col[i]) max = col[i]
    }
  })

  return [min, max]
}

export function css(el, styles = {}) {
  Object.assign(el.style, styles)
}

export function toCoords(xRatio, yRatio, DPI_HEIGHT, PADDING, yMin) {
  return (col) => col.map((y, i) => [Math.floor((i - 1) * xRatio), Math.floor(DPI_HEIGHT - PADDING - (y - yMin) / yRatio)]).filter((_, i) => i !== 0)
}

export function computeYRatio(heigth, min, max) {
  return (max - min) / heigth
}
export function computeXRatio(width, length) {
  return width / (length - 2)
}
