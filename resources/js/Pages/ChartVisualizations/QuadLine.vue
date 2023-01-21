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
import {BarController, BarElement, CategoryScale, Chart, Legend, TimeScale, LinearScale, LineController, LineElement, PointElement, Title} from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-moment';

const makeRange = (start, end) => {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

export default defineComponent({
    props: ['dataSetLabels', 'dataSetData', 'yLabel', 'xLabel', 'title', 'id'],
    components: {
        ApplicationLogo,
        PrimaryButton,
        InputLabel,
        TextInput
    },
    data: function () {
        return {}
    },
    mounted: function () {
        Chart.register(LineController, Title, Legend, BarController, TimeScale, CategoryScale, LinearScale, PointElement, LineElement, BarElement, zoomPlugin)
        var ctx = document.getElementById(this.id).getContext('2d')
        var dataFirst = {
            label: this.dataSetLabels[0],
            data: this.dataSetData[0],
            lineTension: 1/3,
            fill: false,
            borderColor: 'green'
        };

        var dataSecond = {
            label: this.dataSetLabels[1],
            data: this.dataSetData[1],
            lineTension: 1/3,
            fill: false,
            borderColor: 'red'
        };

        var dataThird = {
            label: this.dataSetLabels[2],
            data: this.dataSetData[2],
            lineTension: 1/3,
            fill: false,
            borderColor: 'blue'
        };

        var dataFourth = {
            label: this.dataSetLabels[3],
            data: this.dataSetData[3],
            lineTension: 1/3,
            fill: false,
            borderColor: 'black'
        };

        var chartData = {
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
                    },
                    type: 'time',
                    time: {
                        parser: 'MM/DD/YYYY - HH:mm',
                        unit: 'day',
                        tooltipFormat: 'MM/DD/YYYY - HH:mm',
                        unitStepSize: 1,
                        displayFormats: {
                            day: 'MM/DD/YYYY - HH:mm'
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
