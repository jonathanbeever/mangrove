<template>
    <div class="w-full">
        <canvas v-bind:id="id" height="400" width="600"></canvas>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import ApplicationLogo from '@/Components/ApplicationLogo.vue'
import PrimaryButton from '@/Components/PrimaryButton.vue'
import InputLabel from '@/Components/InputLabel.vue'
import TextInput from '@/Components/TextInput.vue'
import {BarController, BarElement, CategoryScale, Chart, Legend, LinearScale, LineController, LineElement, PointElement, Title} from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom';

const makeRange = (start, end) => {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

export default defineComponent({
    components: {
        ApplicationLogo,
        PrimaryButton,
        InputLabel,
        TextInput
    },
    props: ['xBarLabels', 'dataSetLabels', 'dataSetData', 'yLabel', 'xLabel', 'title', 'id'],
    data: function () {
        return {}
    },
    mounted: function () {
        Chart.register(LineController, Title, Legend, BarController, CategoryScale, LinearScale, PointElement, LineElement, BarElement, zoomPlugin)
        var ctx = document.getElementById(this.id).getContext('2d')
        var dataFirst = {
            label: this.dataSetLabels[0],
            data: this.dataSetData[0],
            lineTension: 1/3,
            fill: false,
            borderColor: 'green'
        };

        var chartData = {
            labels: this.xBarLabels,
            datasets: [
                dataFirst
            ]
        }

        var chartOptions = {
            tooltips: {
                mode: 'index'
            },
            hover: {
                mode: 'index'
            },
            plugins: {
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
                    },
                    pan: {
                        enabled: true
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
    }
})
</script>
