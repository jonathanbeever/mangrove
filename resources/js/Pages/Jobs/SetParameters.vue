<template>
    <div class="w-full">
        <div class="flex flex-col p-6 sm:px-20 bg-white border-b border-gray-200 w-full h-full flex justify-center">
            <div class="flex flex-row justify-between content-center w-full">
                <jet-button v-on:click="onBack" class="mr-[15px] float-left">
                    Back
                </jet-button>
                <div class="flex flex-row w-full items-center justify-center">
                    <jet-label class="mr-[5px]">
                        Choose Audio Files
                    </jet-label>
                    <hr class="flex flex-grow">
                    <jet-label class="mr-[5px] ml-[5px]">
                        Select R index
                    </jet-label>
                    <hr class="flex flex-grow">
                    <jet-label class="ml-[5px] font-bold">
                        Set Parameters
                    </jet-label>
                </div>
            </div>
            <div class="flex flex-row w-full h-full mt-[40px]">
                <div class="w-1/3" v-if="index">
                    <div class="flex flex-row w-full mb-[15px] justify-between">
                        <jet-button class="w-1/3 justify-center ml-[5px]" v-on:click="nextIndex()" :disabled="nextDisabled">Next</jet-button>
                        <jet-button class="w-1/3 justify-center mr-[5px]" v-on:click="prevIndex()" :disabled="prevDisabled">Previous</jet-button>
                    </div>
                    <NdsiInput v-if="indexCurrent == 'NDSI'" @ndsiChanged="ndsiChanged($event)"/>
                    <AciInput v-if="indexCurrent == 'ACI'"/>
                    <AdiInput v-if="indexCurrent == 'ADI'"/>
                    <AeiInput v-if="indexCurrent == 'AEI'"/>
                    <BiInput v-if="indexCurrent == 'BIO'" @biChanged="biChanged($event)"/>
                </div>
                <div class="w-2/3 flex flex-col align-end h-[500px]">
                    <jet-label class="font-bold text-3xl">
                        Usage of Specifications
                    </jet-label>
                    <jet-label class="text-xl h-full">
                        {{descriptionText}}
                    </jet-label>
                    <div class="flex w-full justify-end content-end align-bottom">
                        <jet-button class="flex w-1/3 justify-center align-bottom" :disabled="finishDisabled">
                            Finish
                        </jet-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { defineComponent } from 'vue'
    import JetApplicationLogo from '@/Jetstream/ApplicationLogo.vue'
    import JetButton from '@/Jetstream/Button.vue'
    import JetLabel from '@/Jetstream/Label.vue'
    import JetInput from '@/Jetstream/Input.vue'
    import NdsiInput from '@/InputComponents/NdsiInput.vue'
    import AciInput from '@/InputComponents/AciInput.vue'
    import AdiInput from '@/InputComponents/AdiInput.vue'
    import AeiInput from '@/InputComponents/AeiInput.vue'
    import BiInput from '@/InputComponents/BiInput.vue'

    let descriptionText = 'The selected specifications will influence the ouput of the job to reflect the values selected. Specifications are job specific and cannot be altered after the creation of a job.  Default values have been pre-selected to provide general output.'
    let nextDisabled = false
    let prevDisabled = true
    let finishDisabled = true

    export default defineComponent({
        components: {
            JetApplicationLogo,
            JetButton,
            JetLabel,
            JetInput,
            NdsiInput,
            AciInput,
            AdiInput,
            AeiInput,
            BiInput
        },
        props: ['index'],
        data: function () {
            return {
                descriptionText,
                indexCurrent: [],
                nextDisabled,
                prevDisabled,
                finishDisabled
            }
        },
        mounted() {
            this.indexCurrent = this.index[0];
            if (this.index.length == 1) {   
                this.nextDisabled = true
                this.prevDisabled = true
                this.finishDisabled = false
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
                if (i + 1 == this.index.length - 1 ) {
                    this.nextDisabled = true
                    this.finishDisabled = false
                }
                this.prevDisabled = false
            },
            prevIndex: function () {
                let i = this.index.indexOf(this.indexCurrent)
                if (i != 0) this.indexCurrent = this.index[i - 1]
                if (i - 1 == 0 ) this.prevDisabled = true
                this.nextDisabled = false
            },
            ndsiChanged: function (ndsi) {
                console.log(ndsi)
            },
            biChanged: function (bi) {
                console.log(bi)
            }
        }
    } )

</script>
