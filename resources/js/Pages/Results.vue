<template>
    <app-layout title="Results">
        <template #header>
        <script type="text/javascript" src="script.js"></script>
        <script></script>

        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            Results
        </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                    <welcome />
                    <div><div id="wave"></div></div>
                </div>
            </div>
        </div>
    </app-layout>
</template>

<script>
    import { defineComponent } from 'vue'
    import AppLayout from '@/Layouts/AppLayout.vue'
    import Welcome from '@/Jetstream/Welcome.vue'
    import WaveSurfer from "wavesurfer.js";

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
                backend: 'MediaElement'
            });
            this.wavesurfer.load("sound");
            this.wavesurfer.play();
        }
    })
</script>
