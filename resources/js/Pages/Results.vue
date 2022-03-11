<template>
    <app-layout title="Results">
        <template #header>
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            Results
        </h2>
        </template>
        <script src="script.js"></script>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                    <welcome />
                    <div><div id="wave"></div></div>
                </div>
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2" v-on:click="play">Play</button>
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 mt-2" v-on:click="pause">Pause</button>
            </div>
        </div>
    </app-layout>
</template>

<script>
    import { defineComponent } from 'vue'
    import AppLayout from '@/Layouts/AppLayout.vue'
    import Welcome from '@/Jetstream/Welcome.vue'
    import WaveSurfer from "wavesurfer.js"
    import SpectrogramPlugin from 'wavesurfer.js/src/plugin/spectrogram'

    export default defineComponent({
        components: {
            AppLayout,
            WaveSurfer
        },
        mounted() {
            this.wavesurfer = WaveSurfer.create({
                container: "#wave",
                waveColor: '#D2EDD4',
                progressColor: '#46B54D',
                backend: 'MediaElement',
                plugins: [
                    SpectrogramPlugin.create({
                        container: '#wave',
                        labels: true,
                        colorMap: this.colorMap,
                    }),
                ]
            });
            this.wavesurfer.load("sound");
        },
        methods: {
            play: function() {
                this.wavesurfer.play();
            },
            pause: function() {
                this.wavesurfer.pause();
            }
        }
    })
</script>
