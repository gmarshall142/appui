export const verticalLine = {
  id: "verticalLine",
  defaults: {
    width: 1,
    color: 'ltgray',
    dash: [2, 2],
  },
  afterInit: (chart, args, opts) => {
    chart.verticalLine = {
      x: 0,
      y: 0,
    }
  },
  afterEvent: (chart, args) => {
    // const {inChartArea} = args
    const {x,y} = args.event
    const area = chart.chartArea;
    const display = x >= area.left && x <= area.right && y >= area.top && y <= area.bottom;
    // console.log(`x: ${x} y: ${y}  display: ${display}`)

    chart.verticalLine = {x, y, draw: display}
    chart.draw()
  },
  afterDraw: (chart, args, opts) => {
    if(!chart.verticalLine) return;
    const {ctx} = chart
    const {top, bottom, left, right} = chart.chartArea
    const {x, y, draw} = chart.verticalLine
    if (!draw) return

    ctx.save()

    ctx.beginPath()
    ctx.lineWidth = opts.width
    ctx.strokeStyle = opts.color
    ctx.setLineDash(opts.dash)
    ctx.moveTo(x, bottom)
    ctx.lineTo(x, top)
    // ctx.moveTo(left, y)
    // ctx.lineTo(right, y)
    ctx.stroke()

    ctx.restore()
  }
}
