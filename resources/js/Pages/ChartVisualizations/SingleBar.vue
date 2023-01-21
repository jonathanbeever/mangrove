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
import {BarController, BarElement, CategoryScale, Chart, Legend, LinearScale, LineController, LineElement, PointElement, Title, Tooltip} from 'chart.js'

const makeRange = (start, end) => {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

export default defineComponent({
    props: ['xBarLabels', 'dataSetData', 'yLabel', 'xLabel', 'title', 'id'],
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
        Chart.register(LineController, Title, Legend, BarController, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip)
        var ctx = document.getElementById(this.id).getContext('2d')

        const chartLabels = this.xBarLabels;
        const chartData = {
            labels: chartLabels,
            datasets: [{
                data: this.dataSetData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(0, 128, 0, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(0, 128, 0)'
                ],
                borderWidth: 1
            }]
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
                    display: false,
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
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: this.yLabel,
                        font: {
                            color: 'black',
                            size: 20
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: this.xLabel,
                        font: {
                            color: 'black',
                            size: 20
                        }
                    }
                }
            }
        };

        var chart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: chartOptions
        });
    }
})
</script>
