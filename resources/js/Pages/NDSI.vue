Vue.component("randomChart", {
  template: "#randomChart",
  data() {
    return {
      datasets: [
        {
          data: [70, 100, 400, 180, 100, 300, 500],
          smooth: true,
          showPoints: true,
          fill: true,
          className: "curve1"
        },
        {
          data: [150, 300, 350, 100, 350, 100, 15],
          smooth: true,
          showPoints: true,
          className: "curve2"
        },
        {
          data: [50, 150, 200, 50, 120, 250, 200],
          smooth: true,
          showPoints: true,
          className: "curve3"
        }
      ],
      grid: {
        verticalLines: true,
        horizontalLines: true
      },
      labels: {
        xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        yLabels: 5,
        yLabelsTextFormatter: val => Math.round(val * 100) / 100
      },
      tooltipData: null,
      popper: null,
      popperIsActive: false
    };
  },
  methods: {
    initPopper() {
      const chart = document.querySelector(".random-chart");
      const ref = chart.querySelector(".active-line");
      const tooltip = this.$refs.tooltip;
      this.popper = new Popper(ref, tooltip, {
        placement: "right",
        modifiers: {
          offset: { offset: "0,10" },
          preventOverflow: {
            boundariesElement: chart
          }
        }
      });
    },
    onMouseMove(params) {
      this.popperIsActive = !!params;
      this.popper.scheduleUpdate();
      this.tooltipData = params || null;
    }
  },
  mounted() {
    this.initPopper();
  }
});

new Vue({
  el: "#app"
});
