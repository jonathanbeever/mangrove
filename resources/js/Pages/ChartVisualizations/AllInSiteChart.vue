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
import {BarController, BarElement, CategoryScale, Chart, TimeScale, Legend, LinearScale, LineController, LineElement, PointElement, Title} from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom';
import autocolors from 'chartjs-plugin-autocolors';
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
        Chart.register(LineController, Title, Legend, TimeScale, BarController, CategoryScale, LinearScale, PointElement, LineElement, BarElement, zoomPlugin, autocolors)
        var ctx = document.getElementById(this.id).getContext('2d')

        let datasets = []

        this.dataSetData.forEach(x => {
                Object.keys(x).forEach(z => {
                    let dataset = {}
                    dataset['data'] = x[z]
                    dataset['label'] = this.dataSetLabels[this.dataSetData.indexOf(x)] + ' ' + z
                    dataset['fill'] = false
                    dataset['lineTension'] = 1/3
                    datasets.push(dataset)
                })
        })

        var chartData = {
            datasets
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
                            enabled: false,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'x',
                    },
                },
                autocolors: {
                    mode: 'data'
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
