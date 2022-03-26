<template>
    <div class="w-full">
        <canvas id="id" width="600" height="400"></canvas>
    </div>
</template>

<script>
    import { defineComponent, PropType } from 'vue'
    import JetApplicationLogo from '@/Jetstream/ApplicationLogo.vue'
    import JetButton from '@/Jetstream/Button.vue'
    import JetLabel from '@/Jetstream/Label.vue'
    import JetInput from '@/Jetstream/Input.vue'
    import { Chart, Legend, BarController, LineController, Title, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js'

    const makeRange = (start, end) => {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }

    export default defineComponent({
        props: ['xBarLabels', 'dataSetData', 'yLabel', 'xLabel', 'title', 'id'],
        components: {
            JetApplicationLogo,
            JetButton,
            JetLabel,
            JetInput
        },
        data: function () {
            return {
            }
        },
        mounted: function () {
            Chart.register(LineController, Title, Legend, BarController, CategoryScale, LinearScale, PointElement, LineElement, BarElement)
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
    } )
</script>
