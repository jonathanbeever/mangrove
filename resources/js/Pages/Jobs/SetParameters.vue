<template>
    <div class="w-full">
        <div class="flex flex-col p-6 sm:px-10 bg-white border-b border-gray-200 w-full h-full flex justify-center">
            <div class="flex flex-row justify-between content-center w-full">
                <PrimaryButton class="mr-[15px] float-left" v-on:click="onBack">
                    Back
                </PrimaryButton>
                <div class="flex flex-row w-full items-center justify-center">
                    <InputLabel class="mr-[5px]">
                        Choose Audio Files
                    </InputLabel>
                    <hr class="flex flex-grow">
                    <InputLabel class="mr-[5px] ml-[5px]">
                        Select R index
                    </InputLabel>
                    <hr class="flex flex-grow">
                    <InputLabel class="ml-[5px] font-bold">
                        Set Parameters
                    </InputLabel>
                </div>
            </div>
            <div class="flex flex-row w-full h-full mt-[40px]">
                <div v-if="index" class="w-1/3">
                    <NdsiInput v-if="indexCurrent == 'NDSI'" @ndsiChanged="ndsiChanged($event)"/>
                    <AciInput v-if="indexCurrent == 'ACI'"/>
                    <AdiInput v-if="indexCurrent == 'ADI'" @adiChanged="adiChanged($event)"/>
                    <AeiInput v-if="indexCurrent == 'AEI'" @aeiChanged="aeiChanged($event)"/>
                    <BiInput v-if="indexCurrent == 'BIO'" @biChanged="biChanged($event)"/>
                    <FrequencyFilterInput v-if="indexCurrent == 'FREQUENCYFILTER'" @frequencyFilterChanged="frequencyFilterChanged($event)"/>
                    <AcousticFilterInput v-if="indexCurrent == 'ACOUSTICFILTER'" @acousticFilterChanged="acousticFilterChanged($event)"/>
                    <div class="flex pt-20 justify-between">
                        <PrimaryButton :disabled="prevDisabled" class="justify-center mr-[5px]" v-on:click="prevIndex()">Previous Index</PrimaryButton>
                        <PrimaryButton :disabled="nextDisabled" class="justify-center ml-[5px]" v-on:click="nextIndex()">Next Index</PrimaryButton>
                    </div>
                </div>
                <div class="w-2/3 pl-2 flex flex-col align-end h-[500px]">
                    <InputLabel class="font-bold text-3xl">
                        Usage of Specifications
                    </InputLabel>

                    <InputLabel class="text-xl h-full">
                        {{ descriptionText }}
                    </InputLabel>

                    <div class="flex justify-between">
                        <div class="w-1/3"/>
                        <input
                            id="NameInput"
                            v-model="name"
                            class="flex form-text-input appearance-none bg-slate-300 w-1/3 border-none leading-tight focus:outline-none rounded"
                            placeholder='Name this Job'
                            style="color:#041014;"
                            type="text"
                            :maxlength="50"
                        />
                        <PrimaryButton :disabled="finishDisabled || name == ''" class="flex justify-center align-bottom flex-shrink-0" v-on:click="postJobData()">
                            Finish
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import ApplicationLogo from '@/Components/ApplicationLogo.vue'
import PrimaryButton from '@/Components/PrimaryButton.vue'
import InputLabel from '@/Components/InputLabel.vue'
import TextInput from '@/Components/TextInput.vue'
import NdsiInput from '@/InputComponents/NdsiInput.vue'
import AciInput from '@/InputComponents/AciInput.vue'
import AdiInput from '@/InputComponents/AdiInput.vue'
import AeiInput from '@/InputComponents/AeiInput.vue'
import BiInput from '@/InputComponents/BiInput.vue'
import FrequencyFilterInput from '@/InputComponents/FrequencyFilterInput.vue'
import AcousticFilterInput from '@/InputComponents/AcousticFilterInput.vue'
import {router} from '@inertiajs/vue3'

let descriptionText = 'The selected specifications will influence the ouput of the job to reflect the values selected. Specifications are job specific and cannot be altered after the creation of a job.  Default values have been pre-selected to provide general output.'

export default defineComponent({
    components: {
        ApplicationLogo,
        PrimaryButton,
        InputLabel,
        TextInput,
        NdsiInput,
        AciInput,
        AdiInput,
        AeiInput,
        BiInput,
        FrequencyFilterInput,
        AcousticFilterInput
    },
    props: ['index', 'seriesID'],
    data: function () {
        return {
            descriptionText: descriptionText,
            indexCurrent: [],
            nextDisabled: true,
            prevDisabled: true,
            finishDisabled: true,
            name: ''
        }
    },
    mounted() {
        this.indexCurrent = this.index[0];
        this.aci = null
        this.name = ''

        if (this.index.includes('RMS')) {
            this.rms = true
            this.index.splice(this.index.indexOf('RMS'), 1)
        } else {
            this.rms = null
        }
        if (this.index.length <= 1) {
            this.nextDisabled = true
            this.prevDisabled = true
            this.finishDisabled = false
        } else {
            this.nextDisabled = false
        }
        if (this.index.includes('NDSI')) {
            this.ndsi = {
                anthro_max: 2000,
                anthro_min: 1000,
                bio_max: 11000,
                bio_min: 2000,
                fftw: 1024
            }
        } else {
            this.ndsi = null
        }
        if (this.index.includes('BIO')) {
            this.bi = {
                fftw: 512,
                max_freq: 8000,
                min_freq: 2000
            }
        } else {
            this.bi = null
        }
        if (this.index.includes('AEI')) {
            this.aei = {
                db_threshold: -50,
                freq_step: 1000,
                max_freq: 10000
            }
        } else {
            this.aei = null
        }
        if (this.index.includes('ADI')) {
            this.adi = {
                db_threshold: -50,
                freq_step: 1000,
                max_freq: 10000
            }
        } else {
            this.adi = null
        }
        if (this.index.includes('FREQUENCYFILTER')) {
            this.frequencyFilter = {
                min_freq:  0,
                max_freq: 10000
            }
        } else {
            this.frequencyFilter = null
        }
        if (this.index.includes('ACOUSTICFILTER')) {
            this.acousticFilter = {
                soundindex: 'ADI',
                max_val: 10,
                timeStep: 3
            }
        } else {
            this.acousticFilter = null
        }

    },
    methods: {
        onBack: function () {
            this.$emit('back')
            return
        },
        nextIndex: function () {
            let i = this.index.indexOf(this.indexCurrent)
            if (i != this.index.length - 1) this.indexCurrent = this.index[i + 1]
            if (i + 1 == this.index.length - 1) {
                this.nextDisabled = true
                this.finishDisabled = false
            }
            this.prevDisabled = false
        },
        prevIndex: function () {
            let i = this.index.indexOf(this.indexCurrent)
            if (i != 0) this.indexCurrent = this.index[i - 1]
            if (i - 1 == 0) this.prevDisabled = true
            this.nextDisabled = false
        },
        ndsiChanged: function (ndsi) {
            this.ndsi = {...ndsi}
        },
        biChanged: function (bi) {
            this.bi = {...bi}
        },
        adiChanged: function (adi) {
            this.adi = {...adi}
        },
        aeiChanged: function (aei) {
            this.aei = {...aei}
        },
        frequencyFilterChanged: function (frequencyFilter) {
            this.frequencyFilter = {...frequencyFilter}
        },
        acousticFilterChanged: function (acousticFilter) {
            this.acousticFilter = {...acousticFilter}
        },

        postJobData: function () {
            this.finishDisabled = true
            if (this.name == '' || this.name == null) {
                this.name = Date().toString().substring(0, 10)
            }
            let request = {
                name: this.name,
                aci: this.aci,
                adi: this.adi,
                aei: this.aei,
                bi: this.bi,
                ndsi: this.ndsi,
                rms: this.rms,
                frequencyFilter: this.frequencyFilter,
                acousticFilter: this.acousticFilter,
                series_id: this.seriesID
            }
            router.post(route('jobs.store'), request)
        }
    }
})

</script>
