<template>
    <div v-if="displayIndexSelection" class="w-full">
        <div
            class="flex flex-col p-6 sm:px-10 bg-white border-b border-gray-200 w-full flex justify-center"
        >
            <div class="flex flex-row justify-between content-center w-full">
                <div class="flex flex-row w-full items-center justify-center">
                    <InputLabel class="mr-[5px]"> Choose Audio Files</InputLabel>
                    <hr class="flex flex-grow"/>
                    <InputLabel class="mr-[5px] ml-[5px] font-bold">
                        Select R index
                    </InputLabel>
                    <hr class="flex flex-grow"/>
                    <InputLabel class="ml-[5px]"> Set Parameters</InputLabel>
                </div>
            </div>

            <div class="flex flex-row w-full mt-4">
                <!-- Selection -->
                <div class="flex flex-col w-1/2">
                    <InputLabel class="!text-xl mb-2 !pointer-events-autofont-bold" value="Select Indices" />
                    <div>
                        <div v-for="index in indices" :key="index">
                            <input
                                :id="index"
                                v-model="selectedIndices"
                                class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                type="checkbox"
                                :value="index"
                            >
                            <InputLabel
                                class="form-check-label inline-block text-gray-800"
                                :for="index"
                            >
                                {{ indexLabels[index] }}
                            </InputLabel>
                        </div>
                    </div>
                </div>

                <!-- Descriptions -->
                <div class="w-1/2 flex flex-col max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-rounded scrollbar-thumb-rounded  scrollbar-thumb-gray-700 scrollbar-track-gray-300">
                    <div v-for="index in indices" :key="index" class="mr-2">
                        <div v-if="selectedIndices.includes(index)">
                            <h3 class="font-bold text-2xl text-gray-700">
                                {{ indexLabels[index] }}
                            </h3>
                            <p class="text-lg text-gray-700 mb-2">
                                {{ indexDescriptions[index] }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Nav -->
            <nav class="flex justify-end mt-4">
                <SecondaryButton
                    class="mr-6"
                    v-on:click="onRemoveRender"
                >
                    Back
                </SecondaryButton>
                <PrimaryButton
                        :disabled="selectedIndices.length == 0"
                        v-on:click="onNext($event)"
                    >
                        Next
                </PrimaryButton>
            </nav>
        </div>
    </div>
    <SetParameters v-else :index="selectedIndices" :seriesID="seriesID" @back="onBackParameters"/>
</template>

<script>
import {defineComponent} from "vue";
import ApplicationLogo from "@/Components/ApplicationLogo.vue";
import PrimaryButton from "@/Components/PrimaryButton.vue";
import SecondaryButton from "@/Components/SecondaryButton.vue"
import InputLabel from "@/Components/InputLabel.vue";
import SetParameters from "@/Pages/Jobs/SetParameters.vue";

const indices = ["NDSI", "ACI", "ADI", "AEI", "BIO", "RMS", "FREQUENCYFILTER", "ACOUSTICFILTER"]
const indexLabels = {
    ACI: "ACI",
    NDSI: "NDSI",
    AEI: "AEI",
    ADI: "ADI",
    BIO: "BIO",
    RMS: "RMS",
    FREQUENCYFILTER: "Frequency Filter",
    ACOUSTICFILTER: "Acoustic Filter",
};
const indexDescriptions = {
    ACI: "The accoustic complexity index is an algorithm used to determine the complexity of natural sound. It was initially developed for computing the complexity of bird song. Variability in sound intensities are measured and compared to provide a measured complexity.",
    NDSI: "NDSI is an algorithm used to determine the level of anthropogenic disturbance in an area. It computes the ratio of human-generated sound to natural sound in the soundscape.",
    AEI: "The accoustic evenness index is an algorithm used to determine the overall eveness of sound in a soundscape. An elevated AEI implies a homogeneous soundscape and a subsequent lack of diversity.",
    ADI: "The accoustic diversity index is an algorithm used to determine the overall diversity of sound in a soundscape. An elevated ADI implies a significant occupation of frequencies and a strong level of diversity.",
    BIO: "The bioacoustic index is an algoirithm used to determine the sound level and number of frequency bands occupied in a soundscape. It is used as a general determinant of occupied frequencies to investigate the abundance of biological sound.",
    RMS: "RMS is the root mean square or quadratic mean",
    FREQUENCYFILTER: "Silences the audio sample(s) outside a specified frequency range",
    ACOUSTICFILTER: "Silences the audio sample(s) outside a specifies acoustic indice's range",
};

export default defineComponent({
    components: {
        ApplicationLogo,
        PrimaryButton,
        SecondaryButton,
        InputLabel,
        SetParameters,
    },
    data: function () {
        return {
            displayIndexSelection: true,

            // Selections
            selectedIndices: [],

            // List of indices and their descriptions
            indices: indices,
            indexLabels: indexLabels,
            indexDescriptions: indexDescriptions,
        };
    },
    props: ["seriesID"],
    watch: {
    },
    methods: {
        onNext: function (event) {
            this.displayIndexSelection = false;
            return;
        },
        onBackParameters: function (value) {
            this.displayIndexSelection = true;
            return;
        },
        onRemoveRender: function () {
            this.$emit("goToSeriesSelection");
            return;
        },
    },
});
</script>
