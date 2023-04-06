<template>
    <div class="w-full">
        <div
            class="flex flex-col p-6 sm:px-10 bg-white border-b border-gray-200 w-full flex justify-center"
        >
            <!-- Header -->
            <div class="flex flex-row w-full items-center justify-center">
                <template v-for="(header, index) in pageHeaders" :key="index">
                    <h4 class="block text-sm text-gray-700" :class="(index+1==page) ? 'font-extrabold' : 'font-medium'">
                        {{ header }}
                    </h4>
                    <hr v-if="!(index == pageHeaders.length-1)" class="flex-grow mx-4">
                </template>
            </div>

            <!-- Select Indices -->
            <div v-if="page == 2">
                <div class="flex flex-row w-full mt-4">
                    <!-- Selections -->
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
            </div>

            <!-- Set Parameters -->
            <div v-if="page == 3">
                <div class="flex mt-4">
                    <!-- Parameters -->
                    <div class="w-1/3 max-h-96 overflow-y-auto pl-2 min-w-min scrollbar-thin scrollbar-track-rounded scrollbar-thumb-rounded  scrollbar-thumb-gray-700 scrollbar-track-gray-300">
                        <NdsiParameters v-if="selectedIndices.includes('NDSI')" v-model="ndsi"/>
                        <AciParameters v-if="selectedIndices.includes('ACI')" v-model="aci"/>
                        <AdiParameters v-if="selectedIndices.includes('ADI')" v-model="adi"/>
                        <AeiParameters v-if="selectedIndices.includes('AEI')" v-model="aei"/>
                        <BiParameters v-if="selectedIndices.includes('BIO')" v-model="bi"/>
                        <div v-if="selectedIndices.includes('RMS')" class="dark:text-gray-700">
                            <h2 class="text-xl font-semibold">
                                RMS Specifications
                            </h2>
                            <p class="italic">
                                RMS does not have parameters
                            </p>
                        </div>
                        <FrequencyFilterParameters v-if="selectedIndices.includes('FREQUENCYFILTER')" v-model="frequencyFilter"/>
                        <AcousticFilterParameters v-if="selectedIndices.includes('ACOUSTICFILTER')" v-model="acousticFilter"/>
                    </div>

                    <div class="w-2/3 ml-4 flex flex-col justify-between">
                        <div>
                            <h3 class="text-2xl font-bold text-gray-700">
                                Usage of Specifications
                            </h3>
                            <p class="text-lg text-gray-700">
                                {{ parameterUseDescription }}
                            </p>
                        </div>
                        <div class="flex justify-between mt-10 dark:text-gray-700">
                            <div>
                                <h4 class="text-gray-700 font-medium underline">
                                    Indices Selected
                                </h4>
                                <p>{{ "- " + selectedIndices.join(", ") }}</p>
                            </div>
                            <div class="ml-6">
                                <InputLabel for="jobName" value="Job Name" />
                                <TextInput
                                    id="jobName"
                                    v-model="jobName"
                                    type="text"
                                    placeholder="Job Name"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Nav -->
            <nav class="flex justify-end mt-4">
                <nav class="flex justify-end mt-4">
                <SecondaryButton v-if="page > 1" class="mr-6" @click="page -= 1">
                    Back
                </SecondaryButton>
                <PrimaryButton v-if="page < numPages" :disabled="nextDisabled" @click="page += 1">
                    Next
                </PrimaryButton>
                <PrimaryButton v-else :disabled="nextDisabled" @click="onSubmit">
                    Finish
                </PrimaryButton>
            </nav>
            </nav>
        </div>
    </div>
</template>

<script>
import {defineComponent} from "vue";
import {router} from '@inertiajs/vue3'

import ApplicationLogo from "@/Components/ApplicationLogo.vue"
import InputLabel from "@/Components/InputLabel.vue"
import PrimaryButton from "@/Components/PrimaryButton.vue"
import SecondaryButton from "@/Components/SecondaryButton.vue"
import TextInput from "@/Components/TextInput.vue"

import NdsiParameters from '@/ParameterComponents/NdsiParameters.vue'
import AciParameters from '@/ParameterComponents/AciParameters.vue'
import AdiParameters from '@/ParameterComponents/AdiParameters.vue'
import AeiParameters from '@/ParameterComponents/AeiParameters.vue'
import BiParameters from '@/ParameterComponents/BiParameters.vue'
import FrequencyFilterParameters from '@/ParameterComponents/FrequencyFilterParameters.vue'
import AcousticFilterParameters from '@/ParameterComponents/AcousticFilterParameters.vue'

// Page Headers
const pageHeaders = ['Choose Series', 'Select Indices', 'Set Parameters']

// Index Meta
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

// General description of parameters
const parameterUseDescription = 'The selected specifications will influence the ouput of the job to reflect the values selected. Specifications are job specific and cannot be altered after the creation of a job.  Default values have been pre-selected to provide general output.'

export default defineComponent({
    components: {
        ApplicationLogo,
        InputLabel,
        PrimaryButton,
        SecondaryButton,
        TextInput,
        NdsiParameters,
        AciParameters,
        AdiParameters,
        AeiParameters,
        BiParameters,
        FrequencyFilterParameters,
        AcousticFilterParameters,
    },
    props: ["seriesID"],
    emits: ['goToSeriesSelection'],
    data: function () {
        return {
            // Selections
            selectedIndices: [],
            aci: {},
            ndsi: {},
            aei: {},
            adi: {},
            bi: {},
            rms: true,
            frequencyFilter: {},
            acousticFilter: {},
            jobName: "",

            // List of indices and their descriptions
            indices: indices,
            indexLabels: indexLabels,
            indexDescriptions: indexDescriptions,

            // Page
            pageHeaders: pageHeaders,
            page: 2,
            numPages: 3,

            // Parameter description
            parameterUseDescription: parameterUseDescription,
        };
    },
    computed: {
        nextDisabled() {
            if (this.page == 2) { // Disabling next on second page
                return !this    .selectedIndices.length
            } else { // Disabling finish on third page
                return !this.jobName.length
            }
        },
    },
    watch: {
        page() {
            // Workaround for the first "page" not being a page
            if (this.page == 1)
            {
                // Set page to 2 so it is ready next time we come here
                this.page = 2
                // Go back to series selection
                this.$emit("goToSeriesSelection");
            }
        }
    },
    methods: {
        onSubmit() {
            let request = {}
            let indexParams = {}
            let convertedParams = {}
            let convertedIndex = ""

            // Add parameters to our request
            this.selectedIndices.forEach((index) => {
                convertedIndex = this.convertIndex(index)

                // RMS does not have params, just return true
                if (convertedIndex == 'rms')
                {
                    request[convertedIndex] = true
                    return;
                }

                // Get index params and clear convertedParams
                indexParams = this[convertedIndex]
                convertedParams = {}

                // Convert keys to snake_case
                Object.keys(indexParams).forEach((key) => {
                    if (key == "timeStep") return; // Exception because it is timeStep not time_step in database
                    convertedParams[this.convertCamelToSnakeCase(key)] = indexParams[key]
                })

                request[convertedIndex] = convertedParams
            })

            request.name = this.jobName
            request.series_id = this.seriesID

            // Perform request
            router.post(route('jobs.store'), request)
        },
        convertCamelToSnakeCase(str) {
            return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
        },
        convertIndex(str) {
            if (str == "FREQUENCYFILTER") {
                return "frequencyFilter"
            } else if (str == "ACOUSTICFILTER") {
                return "acousticFilter"
            } else if (str == "BIO") {
                return "bi"
            } else {
                return str.toLowerCase()
            }
        }
    }
});
</script>
