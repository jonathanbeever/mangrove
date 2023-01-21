<template>
    <div class="w-full">
        <InputLabel class="text-2xl"> Adi Example Visualization</InputLabel>
        <canvas id="adiVisualization" height="400" width="600"></canvas>
    </div>
    <div class="w-full">
        <InputLabel class="text-2xl">{{ biExampleData.Output }}</InputLabel>
        <canvas id="biVisualization" height="400" width="600"></canvas>
    </div>
    <div class="w-full">
        <InputLabel class="text-2xl">Rms Example Visualization</InputLabel>
        <canvas id="rmsVisualization" height="400" width="600"></canvas>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import ApplicationLogo from '@/Components/ApplicationLogo.vue'
import PrimaryButton from '@/Components/PrimaryButton.vue'
import InputLabel from '@/Components/InputLabel.vue'
import TextInput from '@/Components/TextInput.vue'
import {BarController, BarElement, CategoryScale, Chart, LinearScale, LineController, LineElement, PointElement} from 'chart.js'

let adiOutput = JSON.parse(atob("eyJhZGlMIjowLjE3MDA4NCwiYWRpUiI6MC4xOTUwNjUsImJhbmRMIjpbMC40OTgzMDIsMC4wMTIyODcsMC4wMDEyNTYsMC4wMDAyMDUsNS4yZS0wNSwwLjAwMDM4NywwLjAwMTAzNiwwLjAwMDcyMiwwLjAwMDI2NCw2ZS0wNl0sImJhbmRSIjpbMC40Njc3OSwwLjAxNTI5MiwwLjAwMDgxNSwwLjAwMDExLDYuN2UtMDUsMC4wMDAyNjksMC4wMDA4OSwwLjAwMDk5MywwLjAwMDQxNCw4ZS0wNl0sImJhbmRSYW5nZUwiOlsiMC0xMDAwIEh6IiwiMTAwMC0yMDAwIEh6IiwiMjAwMC0zMDAwIEh6IiwiMzAwMC00MDAwIEh6IiwiNDAwMC01MDAwIEh6IiwiNTAwMC02MDAwIEh6IiwiNjAwMC03MDAwIEh6IiwiNzAwMC04MDAwIEh6IiwiODAwMC05MDAwIEh6IiwiOTAwMC0xMDAwMCBIeiJdLCJiYW5kUmFuZ2VSIjpbIjAtMTAwMCBIeiIsIjEwMDAtMjAwMCBIeiIsIjIwMDAtMzAwMCBIeiIsIjMwMDAtNDAwMCBIeiIsIjQwMDAtNTAwMCBIeiIsIjUwMDAtNjAwMCBIeiIsIjYwMDAtNzAwMCBIeiIsIjcwMDAtODAwMCBIeiIsIjgwMDAtOTAwMCBIeiIsIjkwMDAtMTAwMDAgSHoiXX0="))
let biOutput = JSON.parse(atob("eyJhcmVhTCI6My40NTI5NzEzMzE4OTYwNiwiYXJlYVIiOjMuMTI5MTgxNjY1OTcwMDEsInZhbHNMIjpbLTYwLjI3NTA0NjIxMTExNjUsLTYwLjM4Mzc1NzA2NTcsLTYwLjQ4NDMwMjM1NjQ3MzksLTYwLjkxNDE3MzczOTE5OTEsLTYwLjgxNjE2NTYzNDg2NzEsLTYxLjMxNzM3MTgzNjc0MjEsLTYyLjM3MTk3MTk2MzQzMjksLTYzLjQ4MTk1MTE2ODkxNzgsLTYzLjg2Mzg1MTIxNzc4NTQsLTY0LjQ2Njk1MDUzMzU0NjEsLTY1LjA0NDQ0NDM0Mjc0OTksLTY1LjY4MDMxODgxNjY2NDEsLTY2LjMzODk0MTkzNjM5MTMsLTY2LjQ0NTU1ODQ5Mjg0NSwtNjYuMzE4MTgwMTEwMTczNywtNjYuNTgwOTI3NDk5MzQ3NiwtNjcuNTg1MTgyMTYwODI2NSwtNjguNTQyODU1ODE4MjEwMiwtNjkuMjk4MjUwMjk0MTM4MSwtNzAuMTgzNzc2NTM4NjIzLC03MC40ODEwMTM2MjEyNzcxLC03MC44NDA2ODM1NTI2MTcyLC03MS41OTM5NzQ1NDA4NDM1LC03MS44ODczODI4MDMwNjk0LC03MS43NzAxMTcwMDMwMzk5LC03MS42NjA0NDU2MzExMzY5LC03MS44MjQ0MDU2MDI5NzA5LC03Mi4xNDAwNjI4ODc0MjIzLC03MS45MDEwMDM3NDA3ODQzLC03MS42MTYyMDQ5NTU4NTY3LC03MS41NzU2MTMxNDI4NTMsLTcxLjQ3Nzg2NDYwMDQ2MTUsLTcxLjI1OTg3MzA4MTkxNDcsLTcwLjk2MDc3NTgyMzgyMDksLTcwLjM5ODg4OTEwMzg4NjUsLTcwLjAwODk4NjExNTMxMTMsLTY5LjIwMzA2OTIwMjE1NzUsLTY4LjY4MDQ0MjIwMDYxNiwtNjguNDE1MDY4ODI2OTQyMSwtNjguNDMzMDYwMzk5NTg5NSwtNjguNDYwODAzOTMwODU2OCwtNjguMjM0MzI0Njc4NDMzLC02OC4xNjk3ODgwMTc2OTAyLC02Ny44MDAyMzQ2MjcyNzc4LC02Ny4zMjg0MjMzMDk0NjU2LC02Ni41MDc5Mzk5MzM5OTc0LC02NS43NDExMDkxMjExMjI1LC02NS40MDA0NTg5NzkyNTQzLC02NS4zMDM0MzY0MzU4Mjk1LC02NS40MTgyNTcxNzgyOTA0LC02NS4xNzUyMjIyNDUxNDQ1LC02NS40MzA5MDc2NjgwMDkxLC02NS43ODQxODkyNzY1MjAyLC02NS44NjAzMTI0NTc0OTI3LC02Ni4yNDA5ODMwOTM3NjUxLC02Ni4zNjYzMDk2NjY2NDgsLTY2LjMxMzMxMDIwMDk2MywtNjYuMTgwMTY3Mzg2MzUzNCwtNjUuNTU4Njg1NzcxODc1MywtNjUuNDU5NDI2ODA3MjExLC02NS41NzE1NTI2NjA2Mjc4LC02NS44NTg5NzYxNDQzMTk1LC02Ni4zMzgzOTMwNzM2NjUsLTY2Ljk3ODA1NjQ1NTM0MTksLTY3LjM4Mzg0MTYyMjcxODldLCJ2YWxzUiI6Wy02MC44MjUwMDEyNTI2MjE2LC02Mi45MzcxNTczMzU4MzkxLC02NC4wMzk4NTExNjQwODMyLC02My40NjM3NTk3MTY1NDgzLC02MS45NDQ1ODQ1MjY0MjU3LC02Mi4zMjc2NTEzMDU1NzQzLC02NC4xMjM3OTQ1NTkxMTg5LC02NS42NTQwMjM1MjA1MDMyLC02Ni4zMDA3ODE3ODkwMTc2LC02Ny4zMzEyMDM5MDU0NDE1LC02OC4wNzc4MTU2MzY4NzU2LC02OS4wNjcwOTM1NjUwNjY5LC03MC4wNzU3MTUxMDY3ODAyLC03MC41MzI3MzY0ODE2NzI4LC03MC40NTkzOTY5MjYzMDY1LC03MC4wNTQzNDgzMTYyNjAyLC03MC4yOTM2MzA0Mjg1NjMzLC03MC42Njc3ODc3MDA1MSwtNzAuNjEzNTYyNTYxNTQzOSwtNzAuNzIwMjE1NjE1Nzg4MSwtNzAuODYwMDExMTA1MjUxNywtNzEuMzI1NDgzNTI1MjAzNiwtNzIuNDQyMzAzMjY2NzExNywtNzIuODY3NjU1MzQ5OTc0NiwtNzIuMzYyMTMzNzEwMzEyNywtNzEuODI0MDgwOTMwMjE4NiwtNzEuNDc2NTcxMjgzMzM1OCwtNzEuNDYwOTUwOTQ1Nzg2MywtNzEuNDEzODA0ODUwMDQ1OCwtNzEuNTc5NzQxMzczMjA2NSwtNzEuNzcxOTU5NDk3NjMyOSwtNzEuOTAyOTAzNDY4MjQ0OCwtNzIuMDg1MDM0NDE3NTI4LC03Mi4xMTAxODg4NTgwMDIxLC03Mi4xMjY4MDA3NDA1NTk5LC03MS42NjI0MDkxMzk5Njc5LC03MC41NjM5ODAyNjkxNjM3LC02OS43Mjc0MTgyODIxOTk2LC02OS4zOTkzODc2OTk5NzcsLTY5LjE4OTE4MTQ4OTQ1MTksLTY5LjMyOTM0OTQzNTIzOTksLTY5LjQ2MjE3MTAxNTIwMTIsLTY5LjYxMDEzMjYwNTE2ODIsLTY5LjQ3NDI4MTU1OTYyMTIsLTY4Ljc2NjA2MDk0ODA1NjIsLTY3LjU3OTM5MjE5MzkwMzUsLTY2LjU5NzAwMTI3MzkzMjUsLTY2LjAzMTc0MzkyNTM3NiwtNjUuODQyMTAzNDI5Nzk1MiwtNjUuODQwODcxMDg5MDQyMSwtNjYuMjcyODQxMjM0OTY2OSwtNjYuNjkwNTk2NjY4NjAzOSwtNjYuOTE2NzMxMDg0MDgwOCwtNjcuMTk3NjY2NDg5MDg3NiwtNjcuNTk0Njc0MTAxODY1LC02Ny41MDQ3NjM3MTc5NTIzLC02Ny4wMDg5ODQ3ODQ1MDg1LC02Ni41OTg2NjQyMzQwMTA3LC02NS44MzIzMjM4MTcxNzY3LC02NS4zOTU1NDYyNDk0MjYzLC02NS40MzUyMTk3ODg1Njg3LC02NS41NTQyMjM0MjYzMDkzLC02NS45MTE3MjQzMzU4NDc4LC02Ni4zMDQxODMwNjMzNzYxLC02Ni42MjM0NTQ0NzUyMjc4XSwidmFsc05vcm1hbGl6ZWRMIjpbMTEuODY1MDE2Njc2MzA1OCwxMS43NTYzMDU4MjE3MjIzLDExLjY1NTc2MDUzMDk0ODQsMTEuMjI1ODg5MTQ4MjIzMiwxMS4zMjM4OTcyNTI1NTUyLDEwLjgyMjY5MTA1MDY4MDIsOS43NjgwOTA5MjM5ODkzOCw4LjY1ODExMTcxODUwNDU1LDguMjc2MjExNjY5NjM2ODksNy42NzMxMTIzNTM4NzYyNiw3LjA5NTYxODU0NDY3MjM5LDYuNDU5NzQ0MDcwNzU4MTksNS44MDExMjA5NTEwMzEsNS42OTQ1MDQzOTQ1NzczNSw1LjgyMTg4Mjc3NzI0ODYsNS41NTkxMzUzODgwNzQ2OSw0LjU1NDg4MDcyNjU5NTgsMy41OTcyMDcwNjkyMTIwOCwyLjg0MTgxMjU5MzI4NDI1LDEuOTU2Mjg2MzQ4Nzk5MzcsMS42NTkwNDkyNjYxNDUxOSwxLjI5OTM3OTMzNDgwNTEyLDAuNTQ2MDg4MzQ2NTc4ODU2LDAuMjUyNjgwMDg0MzUyODg5LDAuMzY5OTQ1ODg0MzgyNDE3LDAuNDc5NjE3MjU2Mjg1NDM3LDAuMzE1NjU3Mjg0NDUxMzc2LDAsMC4yMzkwNTkxNDY2Mzc5NywwLjUyMzg1NzkzMTU2NTY1OCwwLjU2NDQ0OTc0NDU2OTM0NSwwLjY2MjE5ODI4Njk2MDgwMiwwLjg4MDE4OTgwNTUwNzU3LDEuMTc5Mjg3MDYzNjAxNDQsMS43NDExNzM3ODM1MzU4LDIuMTMxMDc2NzcyMTExMDMsMi45MzY5OTM2ODUyNjQ4NCwzLjQ1OTYyMDY4NjgwNjMyLDMuNzI0OTk0MDYwNDgwMiwzLjcwNzAwMjQ4NzgzMjgyLDMuNjc5MjU4OTU2NTY1NTIsMy45MDU3MzgyMDg5ODkyOCwzLjk3MDI3NDg2OTczMjA4LDQuMzM5ODI4MjYwMTQ0NTEsNC44MTE2Mzk1Nzc5NTY3LDUuNjMyMTIyOTUzNDI0ODcsNi4zOTg5NTM3NjYyOTk3Nyw2LjczOTYwMzkwODE2Nzk5LDYuODM2NjI2NDUxNTkyNzgsNi43MjE4MDU3MDkxMzE5Niw2Ljk2NDg0MDY0MjI3Nzc5LDYuNzA5MTU1MjE5NDEzMjIsNi4zNTU4NzM2MTA5MDIwOSw2LjI3OTc1MDQyOTkyOTY2LDUuODk5MDc5NzkzNjU3MjIsNS43NzM3NTMyMjA3NzQzMiw1LjgyNjc1MjY4NjQ1OTI5LDUuOTU5ODk1NTAxMDY4OTYsNi41ODEzNzcxMTU1NDcwMSw2LjY4MDYzNjA4MDIxMTI5LDYuNTY4NTEwMjI2Nzk0NTIsNi4yODEwODY3NDMxMDI3OSw1LjgwMTY2OTgxMzc1NzMzLDUuMTYyMDA2NDMyMDgwNCw0Ljc1NjIyMTI2NDcwMzQ0XSwidmFsc05vcm1hbGl6ZWRSIjpbMTIuMDQyNjU0MDk3MzUzLDkuOTMwNDk4MDE0MTM1NDksOC44Mjc4MDQxODU4OTE0LDkuNDAzODk1NjMzNDI2MjksMTAuOTIzMDcwODIzNTQ4OCwxMC41NDAwMDQwNDQ0MDAzLDguNzQzODYwNzkwODU1NjgsNy4yMTM2MzE4Mjk0NzE0LDYuNTY2ODczNTYwOTU2OTUsNS41MzY0NTE0NDQ1MzMxMSw0Ljc4OTgzOTcxMzA5OTAxLDMuODAwNTYxNzg0OTA3NzEsMi43OTE5NDAyNDMxOTQ0NSwyLjMzNDkxODg2ODMwMTgxLDIuNDA4MjU4NDIzNjY4MDcsMi44MTMzMDcwMzM3MTQ0MiwyLjU3NDAyNDkyMTQxMTMxLDIuMTk5ODY3NjQ5NDY0NjQsMi4yNTQwOTI3ODg0MzA3MSwyLjE0NzQzOTczNDE4NjQ1LDIuMDA3NjQ0MjQ0NzIyODgsMS41NDIxNzE4MjQ3NzEsMC40MjUzNTIwODMyNjI4NzksMCwwLjUwNTUyMTYzOTY2MTkzNiwxLjA0MzU3NDQxOTc1NjA0LDEuMzkxMDg0MDY2NjM4OCwxLjQwNjcwNDQwNDE4ODI2LDEuNDUzODUwNDk5OTI4ODMsMS4yODc5MTM5NzY3NjgwOCwxLjA5NTY5NTg1MjM0MTY2LDAuOTY0NzUxODgxNzI5ODM5LDAuNzgyNjIwOTMyNDQ2NTc2LDAuNzU3NDY2NDkxOTcyNDY1LDAuNzQwODU0NjA5NDE0NzI1LDEuMjA1MjQ2MjEwMDA2NzEsMi4zMDM2NzUwODA4MTA5LDMuMTQwMjM3MDY3Nzc0OTgsMy40NjgyNjc2NDk5OTc2LDMuNjc4NDczODYwNTIyNywzLjUzODMwNTkxNDczNDcyLDMuNDA1NDg0MzM0NzczNDIsMy4yNTc1MjI3NDQ4MDYzNywzLjM5MzM3Mzc5MDM1MzM3LDQuMTAxNTk0NDAxOTE4MzgsNS4yODgyNjMxNTYwNzExNCw2LjI3MDY1NDA3NjA0MjA4LDYuODM1OTExNDI0NTk4NjEsNy4wMjU1NTE5MjAxNzk0LDcuMDI2Nzg0MjYwOTMyNDksNi41OTQ4MTQxMTUwMDc2NSw2LjE3NzA1ODY4MTM3MDcsNS45NTA5MjQyNjU4OTM4NSw1LjY2OTk4ODg2MDg4Nyw1LjI3Mjk4MTI0ODEwOTU5LDUuMzYyODkxNjMyMDIyMzMsNS44NTg2NzA1NjU0NjYxMyw2LjI2ODk5MTExNTk2MzkxLDcuMDM1MzMxNTMyNzk3OTMsNy40NzIxMDkxMDA1NDgzNCw3LjQzMjQzNTU2MTQwNTkyLDcuMzEzNDMxOTIzNjY1MzIsNi45NTU5MzEwMTQxMjY4LDYuNTYzNDcyMjg2NTk4NDgsNi4yNDQyMDA4NzQ3NDY4NF0sImZyZXFWYWxzIjpbMjAwMCwyMDkzLjc1LDIxODcuNSwyMjgxLjI1LDIzNzUsMjQ2OC43NSwyNTYyLjUsMjY1Ni4yNSwyNzUwLDI4NDMuNzUsMjkzNy41LDMwMzEuMjUsMzEyNSwzMjE4Ljc1LDMzMTIuNSwzNDA2LjI1LDM1MDAsMzU5My43NSwzNjg3LjUsMzc4MS4yNSwzODc1LDM5NjguNzUsNDA2Mi41LDQxNTYuMjUsNDI1MCw0MzQzLjc1LDQ0MzcuNSw0NTMxLjI1LDQ2MjUsNDcxOC43NSw0ODEyLjUsNDkwNi4yNSw1MDAwLDUwOTMuNzUsNTE4Ny41LDUyODEuMjUsNTM3NSw1NDY4Ljc1LDU1NjIuNSw1NjU2LjI1LDU3NTAsNTg0My43NSw1OTM3LjUsNjAzMS4yNSw2MTI1LDYyMTguNzUsNjMxMi41LDY0MDYuMjUsNjUwMCw2NTkzLjc1LDY2ODcuNSw2NzgxLjI1LDY4NzUsNjk2OC43NSw3MDYyLjUsNzE1Ni4yNSw3MjUwLDczNDMuNzUsNzQzNy41LDc1MzEuMjUsNzYyNSw3NzE4Ljc1LDc4MTIuNSw3OTA2LjI1LDgwMDBdfQ=="))
let rmsOutput = JSON.parse(atob("eyJybXNMIjo0MTIyLjU1OTEzMDY3NzkyLCJybXNSIjo0NDg4LjI0ODgxMTc4NDY5fQ=="))

let adiExampleData = {
    File: 'S4A04633_20180110_160000.wav',
    Type: 'adi',
    Duration: '30 seconds',
    Output: adiOutput
}

let biExampleData = {
    File: 'S4A04633_20180110_160000.wav',
    Type: 'bi',
    Duration: '30 seconds',
    Output: biOutput
}

let rmsExampleData = {
    File: 'S4A04633_20180110_160000.wav',
    Type: 'rms',
    Duration: '30 seconds',
    Output: rmsOutput
}

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
    data: function () {
        return {
            adiExampleData,
            biExampleData,
            rmsExampleData
        }
    },
    mounted: function () {
        Chart.register(LineController, BarController, CategoryScale, LinearScale, PointElement, LineElement, BarElement)
        var ctx = document.getElementById("adiVisualization").getContext('2d')
        var btx = document.getElementById("biVisualization").getContext('2d')
        var bbtx = document.getElementById("rmsVisualization").getContext('2d')

        var dataFirst = {
            label: "L Frequency Band Values",
            data: adiExampleData.Output.bandL,
            lineTension: 1,
            fill: false,
            borderColor: 'green'
        };

        var dataSecond = {
            label: "R Frequency Band Values",
            data: adiExampleData.Output.bandR,
            lineTension: 1,
            fill: false,
            borderColor: 'red'
        };

        var adiChartData = {
            labels: makeRange(0, adiExampleData.Output.bandR.length - 1),
            datasets: [dataFirst, dataSecond]
        }

        var chartOptions = {
            legend: {
                display: true,
                responsive: true,
                position: 'top',
                labels: {
                    boxWidth: 80,
                    fontColor: 'black'
                },
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        };

        var lineChart = new Chart(ctx, {
            type: 'line',
            data: adiChartData,
            options: chartOptions
        });

        var biDataFirst = {
            label: "L Frequency Band Values",
            data: biExampleData.Output.valsL,
            lineTension: 0,
            fill: false,
            borderColor: 'green'
        };

        var biDataSecond = {
            label: "R Frequency Band Values",
            data: biExampleData.Output.valsR,
            lineTension: 0,
            fill: false,
            borderColor: 'red'
        };

        var biDataThird = {
            label: "L Frequency Band Values",
            data: biExampleData.Output.valsNormalizedL,
            lineTension: 0,
            fill: false,
            borderColor: 'blue'
        };

        var biDataFourth = {
            label: "R Frequency Band Values",
            data: biExampleData.Output.valsNormalizedR,
            lineTension: 0,
            fill: false,
            borderColor: 'black'
        };

        var biChartData = {
            labels: biExampleData.Output.freqVals,
            datasets: [biDataFirst, biDataSecond, biDataThird, biDataFourth]
        }

        var biLineChart = new Chart(btx, {
            type: 'line',
            data: biChartData,
            options: chartOptions
        });

        const rmsChartLabels = ['rmsL', 'rmsR'];
        const rmsChartData = {
            labels: rmsChartLabels,
            datasets: [{
                label: 'Root Mean Square',
                data: [rmsExampleData.Output.rmsL, rmsExampleData.Output.rmsR],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)'
                ],
                borderWidth: 1
            }]
        }

        var rmsChartOptions = {
            legend: {
                display: true,
                responsive: true,
                position: 'top',
                labels: {
                    boxWidth: 80,
                    fontColor: 'black'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        var rmsChart = new Chart(bbtx, {
            type: 'bar',
            data: rmsChartData,
            options: rmsChartOptions
        });
    },
    methods: {}
})
</script>
