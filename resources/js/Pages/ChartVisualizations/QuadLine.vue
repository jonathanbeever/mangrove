<template>
    <div class="w-full">
        <canvas v-bind:id="id" width="600" height="400"></canvas>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import JetApplicationLogo from '@/Jetstream/ApplicationLogo.vue'
import JetButton from '@/Jetstream/Button.vue'
import JetLabel from '@/Jetstream/Label.vue'
import JetInput from '@/Jetstream/Input.vue'
import {Chart, Legend, BarController, LineController, Title, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip} from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom';

const makeRange = (start, end) => {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

export default defineComponent({
    props: ['xBarLabels', 'dataSetLabels', 'dataSetData', 'yLabel', 'xLabel', 'title', 'id'],
    components: {
        JetApplicationLogo,
        JetButton,
        JetLabel,
        JetInput
    },
    data: function () {
        return {}
    },
    mounted: function () {
        Chart.register(LineController, Title, Legend, BarController, CategoryScale, LinearScale, PointElement, LineElement, BarElement, zoomPlugin)
        var ctx = document.getElementById(this.id).getContext('2d')
        var dataFirst = {
            label: this.dataSetLabels[0],
            data: this.dataSetData[0],
            lineTension: 1,
            fill: false,
            borderColor: 'green'
        };

        var dataSecond = {
            label: this.dataSetLabels[1],
            data: this.dataSetData[1],
            lineTension: 1,
            fill: false,
            borderColor: 'red'
        };

        var dataThird = {
            label: this.dataSetLabels[2],
            data: this.dataSetData[2],
            lineTension: 1,
            fill: false,
            borderColor: 'blue'
        };

        var dataFourth = {
            label: this.dataSetLabels[3],
            data: this.dataSetData[3],
            lineTension: 1,
            fill: false,
            borderColor: 'black'
        };

        var chartData = {
            labels: this.xBarLabels,
            datasets: [
                dataFirst,
                dataSecond,
                dataThird,
                dataFourth
            ]
        }

        var chartOptions = {
            plugins: {
                tooltips: {
                    mode: 'index'
                },
                hover: {
                    mode: 'index'
                },
                legend: {
                    display: true,
                    responsive: true,
                    position: 'top',
                    labels: {
                        boxWidth: 80,
                        font: {
                            color: 'black',
                            size: 20
                        }
                    }
                },
                title: {
                    display: true,
                    text: this.title,
                    font: {
                        color: 'black',
                        size: 20
                    }
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'x',
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: this.xLabel,
                        font: {
                            color: 'black',
                            size: 20
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: this.yLabel,
                        font: {
                            color: 'black',
                            size: 20
                        }
                    }
                }
            }
        };

        var chart = new Chart(ctx,
            {
                type: 'line',
                data: chartData,
                options: chartOptions
            })
    },
    methods: {}
})
</script>
