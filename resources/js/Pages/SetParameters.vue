<template>
    <div class="w-full">
        <div class="flex flex-col p-6 sm:px-20 bg-white border-b border-gray-200 w-full h-full flex justify-center">
            <div class="flex flex-row justify-between content-center w-full">
                <jet-button v-on:click="onBack()" class="mr-[15px] float-left">
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
            <div class="flex flex-row w-full h-full mt-[50px]">
                <div class="w-1/3">
                    <NdsiInput v-if="index == 'NDSI'"/>
                    <AciInput v-if="index == 'ACI'"/>
                    <AdiInput v-if="index == 'ADI'"/>
                    <AeiInput v-if="index == 'AEI'"/>
                    <BiInput v-if="index == 'BIO'"/>
                </div>
                <div class="w-2/3 flex flex-col align-end h-[500px]">
                    <jet-label class="font-bold text-3xl">
                        Usage of Specifications
                    </jet-label>
                    <jet-label class="text-xl h-full">
                        {{descriptionText}}
                    </jet-label>
                    <div class="flex w-full justify-end content-end align-bottom">
                        <jet-button class="flex w-1/3 justify-center align-bottom">
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
                descriptionText
            }
        },
        methods: {
            onBack: function () {
                this.$emit('back')
                return
            }
        }
    } )

</script>
