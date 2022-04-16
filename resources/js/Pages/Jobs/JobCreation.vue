<template>
    <div v-if="displayIndexSelection" class="w-full">
        <div
            class="flex flex-col p-6 sm:px-10 bg-white border-b border-gray-200 w-full flex justify-center"
        >
            <div class="flex flex-row justify-between content-center w-full">
                <jet-button
                    v-on:click="onRemoveRender"
                    class="mr-[15px] float-left"
                >
                    Back
                </jet-button>
                <div class="flex flex-row w-full items-center justify-center">
                    <jet-label class="mr-[5px]"> Choose Audio Files </jet-label>
                    <hr class="flex flex-grow" />
                    <jet-label class="mr-[5px] ml-[5px] font-bold">
                        Select R index
                    </jet-label>
                    <hr class="flex flex-grow" />
                    <jet-label class="ml-[5px]"> Set Parameters </jet-label>
                </div>
            </div>
            <div class="flex flex-row w-full mt-[50px]">
                <div class="flex flex-col w-1/2">
                    <jet-label class="text-2xl mb-[10px]"> Index </jet-label>
                    <div>
                        <div class="form-check mb-[10px]" v-if="false">
                            <input
                                class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                v-on:click="onChange($event)"
                                type="checkbox"
                                name="indexRadio"
                                id="aci"
                            />
                            <jet-label
                                class="form-check-label inline-block text-gray-800 text-1xl"
                                for="aci"
                            >
                                ACI
                            </jet-label>
                        </div>
                        <div class="form-check mb-[10px]">
                            <input
                                class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                v-on:click="onChange($event)"
                                type="checkbox"
                                name="indexRadio"
                                id="ndsi"
                                checked
                            />
                            <jet-label
                                class="form-check-label inline-block text-gray-800 text-1xl"
                                for="ndsi"
                            >
                                NDSI
                            </jet-label>
                        </div>
                        <div class="form-check mb-[10px]">
                            <input
                                class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                v-on:click="onChange($event)"
                                type="checkbox"
                                name="indexRadio"
                                id="aei"
                            />
                            <jet-label
                                class="form-check-label inline-block text-gray-800 text-1xl"
                                for="aei"
                            >
                                AEI
                            </jet-label>
                        </div>
                        <div class="form-check mb-[10px]">
                            <input
                                class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                v-on:click="onChange($event)"
                                type="checkbox"
                                name="indexRadio"
                                id="adi"
                            />
                            <jet-label
                                class="form-check-label inline-block text-gray-800 text-1xl"
                                for="adi"
                            >
                                ADI
                            </jet-label>
                        </div>
                        <div class="form-check mb-[10px]">
                            <input
                                class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                v-on:click="onChange($event)"
                                type="checkbox"
                                name="indexRadio"
                                id="bio"
                            />
                            <jet-label
                                class="form-check-label inline-block text-gray-800 text-1xl"
                                for="bio"
                            >
                                BIO
                            </jet-label>
                        </div>
                        <div class="form-check mb-[10px]">
                            <input
                                class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                v-on:click="onChange($event)"
                                type="checkbox"
                                name="indexRadio"
                                id="rms"
                            />
                            <jet-label
                                class="form-check-label inline-block text-gray-800 text-1xl"
                                for="rms"
                            >
                                RMS
                            </jet-label>
                        </div>
                    </div>
                </div>
                <div class="w-1/2 flex flex-col h-full">
                    <jet-label class="font-bold text-3xl">
                        {{ selectedIndex[selectedIndex.length - 1] }}
                    </jet-label>
                    <jet-label class="text-xl h-[150px]">
                        {{ descriptionText }}
                    </jet-label>
                    <div
                        class="flex w-full justify-end content-end align-end mt-[150px]"
                    >
                        <jet-button
                            v-on:click="onNext($event)"
                            class="flex w-1/3 justify-center"
                        >
                            Next
                        </jet-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <SetParameters @back="onBackParameters" :index="selectedIndex" v-else />
</template>

<script>
import { defineComponent } from "vue";
import JetApplicationLogo from "@/Jetstream/ApplicationLogo.vue";
import JetButton from "@/Jetstream/Button.vue";
import JetLabel from "@/Jetstream/Label.vue";
import SetParameters from "@/Pages/Jobs/SetParameters.vue";

let selectedIndex = ["NDSI"];
let displayIndexSelection = true;
let indexText = {
    ACI: "The accoustic complexity index is an algorithm used to determine the complexity of natural sound. It was initially developed for computing the complexity of bird song. Variability in sound intensities are measured and compared to provide a measured complexity.",
    NDSI: "NDSI is an algorithm used to determine the level of anthropogenic disturbance in an area. It computes the ratio of human-generated sound to natural sound in the soundscape.",
    AEI: "The accoustic evenness index is an algorithm used to determine the overall eveness of sound in a soundscape. An elevated AEI implies a homogeneous soundscape and a subsequent lack of diversity.",
    ADI: "The accoustic diversity index is an algorithm used to determine the overall diversity of sound in a soundscape. An elevated ADI implies a significant occupation of frequencies and a strong level of diversity.",
    BIO: "the bioacoustic index is an algoirithm used to determine the sound level and number of frequency bands occupied in a soundscape. It is used as a general determinant of occupied frequencies to investigate the abundance of biological sound.",
    RMS: "RMS is the root mean square or quadratic mean",
};
let descriptionText = indexText["NDSI"];

export default defineComponent({
    components: {
        JetApplicationLogo,
        JetButton,
        JetLabel,
        SetParameters,
    },
    data: function () {
        return {
            descriptionText,
            selectedIndex,
            displayIndexSelection,
        };
    },
    methods: {
        onChange: function (event) {
            let e = this.selectedIndex.indexOf(event.target.id.toUpperCase());

            if (e != -1) {
                this.selectedIndex.splice(e, 1);
                this.descriptionText = indexText[this.selectedIndex[this.selectedIndex.length-1]];
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
            this.$emit("goToFileSelection");
            return;
        },
    },
});
</script>
