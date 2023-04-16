<template>
    <DialogModal :show="show" @close="$emit('close')">
        <template #title>
            <div class="border-b-2 pb-2 border-grey-500">
                <div class="flex">
                    <p class="text-xl align-middle">File name:</p>
                    <input
                        v-model="fileName"
                        placeholder="Enter name for audio clip"
                        id="extracedAudioTitleInput"
                        class="text-xl ml-2 mr-2 pl-2 border-2 border-black-700 rounded-md"
                    />
                    <p class="text-xl">.wav</p>
                </div>
            </div>
        </template>

        <template #footer>
            <DangerButton @click="$emit('close')" class="ml-3">
                Cancel
            </DangerButton>

            <PrimaryButton
                @click="NewFileName($event); $emit('close')"
                class="ml-3"
            >
                Ok
            </PrimaryButton>
        </template>
    </DialogModal>
</template>

<script>
import { defineComponent } from "vue"
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import * as JSZip from "jszip";

import DangerButton from "@/Components/DangerButton.vue";
import DialogModal from "@/Components/DialogModal.vue";
import PrimaryButton from "@/Components/PrimaryButton.vue";

export default defineComponent({
    components: {
        DangerButton,
        DialogModal,
        PrimaryButton
    },
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        fileName: {
            type: String,
            required: false
        }
    },
    emits: ['close', 'userInput'],
    data() {
        return {
            fileName: "",
        }
    },
    watch: {
        show(newShow) {
            // Default to PDF
            if (newShow) {
            }
            // Clear the inputs when the modal closes
            else {
                // TODO
            }
        }
    },
    methods: {

        // method for user inputed string to be sent to parent vue componenet
        NewFileName (e) {
            console.log("New name was triggered");
            console.log(this.fileName);
            let name = this.fileName
            if (name == "" || name == null || name == undefined)
                name = "ExtractedAudio";
            
            this.fileName = "";

            this.$emit("userInput", name);
        }

    }
})
</script>
