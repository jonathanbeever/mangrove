<template>
    <div v-if="displayIndexSelection" class="w-full">
        <div
            class="flex flex-col p-6 sm:px-10 bg-white border-b border-gray-200 w-full flex justify-center"
        >
            <div class="flex flex-row justify-between content-center w-full">
                <PrimaryButton
                    class="mr-[15px] float-left"
                    v-on:click="onRemoveRender"
                >
                    Back
                </PrimaryButton>
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
            <div class="flex flex-row w-full mt-[50px]">
                <div class="flex flex-col w-1/2">
                    <InputLabel class="text-2xl mb-[10px]"> Index</InputLabel>
                    <div>
                        <div v-if="false" class="form-check mb-[10px]">
                            <input
                                id="aci"
                                class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                name="indexRadio"
                                type="checkbox"
                                v-on:click="onChange($event)"
                            />
                            <InputLabel
                                class="form-check-label inline-block text-gray-800 text-1xl"
                                for="aci"
                            >
                                ACI
                            </InputLabel>
                        </div>
                        <div class="form-check mb-[10px]">
                            <input
                                id="ndsi"
                                checked
                                class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                name="indexRadio"
                                type="checkbox"
                                v-on:click="onChange($event)"
                            />
                            <InputLabel
                                class="form-check-label inline-block text-gray-800 text-1xl"
                                for="ndsi"
                            >
                                NDSI
                            </InputLabel>
                        </div>
                        <div class="form-check mb-[10px]">
                            <input
                                id="aei"
                                class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                name="indexRadio"
                                type="checkbox"
                                v-on:click="onChange($event)"
                            />
                            <InputLabel
                                class="form-check-label inline-block text-gray-800 text-1xl"
                                for="aei"
                            >
                                AEI
                            </InputLabel>
                        </div>
                        <div class="form-check mb-[10px]">
                            <input
                                id="adi"
                                class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                name="indexRadio"
                                type="checkbox"
                                v-on:click="onChange($event)"
                            />
                            <InputLabel
                                class="form-check-label inline-block text-gray-800 text-1xl"
                                for="adi"
                            >
                                ADI
                            </InputLabel>
                        </div>
                        <div class="form-check mb-[10px]">
                            <input
                                id="bio"
                                class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                name="indexRadio"
                                type="checkbox"
                                v-on:click="onChange($event)"
                            />
                            <InputLabel
                                class="form-check-label inline-block text-gray-800 text-1xl"
                                for="bio"
                            >
                                BIO
                            </InputLabel>
                        </div>
                        <div class="form-check mb-[10px]">
                            <input
                                id="rms"
                                class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                name="indexRadio"
                                type="checkbox"
                                v-on:click="onChange($event)"
                            />
                            <InputLabel
                                class="form-check-label inline-block text-gray-800 text-1xl"
                                for="rms"
                            >
                                RMS
                            </InputLabel>
                        </div>
                        <div class="form-check mb-[10px]">
                            <input
                                id="frequencyFilter"
                                class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                name="indexRadio"
                                type="checkbox"
                                v-on:click="onChange($event)"
                            />
                            <InputLabel
                                class="form-check-label inline-block text-gray-800 text-1xl"
                                for="frequencyFilter"
                            >
                                Frequency Filter
                            </InputLabel>
                        </div>
                        <div class="form-check mb-[10px]">
                            <input
                                id="acousticFilter"
                                class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                name="indexRadio"
                                type="checkbox"
                                v-on:click="onChange($event)"
                            />
                            <InputLabel
                                class="form-check-label inline-block text-gray-800 text-1xl"
                                for="acousticFilter"
                            >
                                Acoustic Filter
                            </InputLabel>
                        </div>
                    </div>
                </div>
                <div class="w-1/2 flex flex-col h-full">
                    <InputLabel class="font-bold text-3xl">
                        {{ selectedIndex[selectedIndex.length - 1] }}
                    </InputLabel>
                    <InputLabel class="text-xl h-[150px]">
                        {{ descriptionText }}
                    </InputLabel>
                    <div
                        class="flex w-full justify-end content-end align-end mt-[150px]"
                    >
                        <PrimaryButton
                            class="flex w-1/3 justify-center"
                            :disabled="this.selectedIndex.length == 0"
                            v-on:click="onNext($event)"
                        >
                            Next
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <SetParameters v-else :index="selectedIndex" :seriesID="seriesID" @back="onBackParameters"/>
</template>

<script>
import {defineComponent} from "vue";
import ApplicationLogo from "@/Components/ApplicationLogo.vue";
import PrimaryButton from "@/Components/PrimaryButton.vue";
import InputLabel from "@/Components/InputLabel.vue";
import SetParameters from "@/Pages/Jobs/SetParameters.vue";

let indexText = {
    ACI: "The accoustic complexity index is an algorithm used to determine the complexity of natural sound. It was initially developed for computing the complexity of bird song. Variability in sound intensities are measured and compared to provide a measured complexity.",
    NDSI: "NDSI is an algorithm used to determine the level of anthropogenic disturbance in an area. It computes the ratio of human-generated sound to natural sound in the soundscape.",
    AEI: "The accoustic evenness index is an algorithm used to determine the overall eveness of sound in a soundscape. An elevated AEI implies a homogeneous soundscape and a subsequent lack of diversity.",
    ADI: "The accoustic diversity index is an algorithm used to determine the overall diversity of sound in a soundscape. An elevated ADI implies a significant occupation of frequencies and a strong level of diversity.",
    BIO: "the bioacoustic index is an algoirithm used to determine the sound level and number of frequency bands occupied in a soundscape. It is used as a general determinant of occupied frequencies to investigate the abundance of biological sound.",
    RMS: "RMS is the root mean square or quadratic mean",
    FREQUENCYFILTER: "Silences the audio sample(s) outside a specified frequency range",
    ACOUSTICFILTER: " Silences the audio sample(s) outside a specifies acoustic indice's range",
};

export default defineComponent({
    components: {
        ApplicationLogo,
        PrimaryButton,
        InputLabel,
        SetParameters,
    },
    data: function () {
        return {
            descriptionText: indexText['NDSI'],
            selectedIndex: ['NDSI'],
            displayIndexSelection: true,
        };
    },
    props: ["seriesID"],
    methods: {
        onChange: function (event) {
            let e = this.selectedIndex.indexOf(event.target.id.toUpperCase());

            if (e != -1) {
                this.selectedIndex.splice(e, 1);
                this.descriptionText = indexText[this.selectedIndex[this.selectedIndex.length - 1]];
            } else {
                this.selectedIndex.push(event.target.id.toUpperCase());
                this.descriptionText = indexText[event.target.id.toUpperCase()];
            }
            return;
        },
        onNext: function (event) {
            this.displayIndexSelection = false;
            return;
        },
        onBackParameters: function (value) {
            this.displayIndexSelection = true;
            this.selectedIndex = ["NDSI"];
            this.descriptionText = indexText["NDSI"];
            return;
        },
        onRemoveRender: function () {
            this.$emit("goToSeriesSelection");
            return;
        },
    },
});
</script>
