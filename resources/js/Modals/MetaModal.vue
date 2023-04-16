<template>
    <DialogModal :show="show" @close="$emit('close')">
        <template #title>
            <div class="border-b-2 pb-2 border-grey-500">
                <div class="flex">
                    <p class="text-xl align-middle">Metadata for file: </p>
                    <span class="ml-2" v-if="fileName">{{ fileName }}</span>
                    <span class="ml-2" v-else-if="mode == 'MultiFile' && fileNameOne && fileNameTwo"> {{ fileNameOne }} & {{ fileNameTwo }}</span>
                    <span class="ml-2 text-red-500" v-else>No file found</span>
                </div>
            </div>
        </template>

        <template #content>
            <span class="ml-2 text-red-500" v-if="mode !== 'SingleFile' && mode !== 'MultiFile'">Metadata viewing only works on single or multi file analysis mode</span>
            <span class="ml-2" v-else-if="fileName"><pre>{{ formatInputString(findMatchingEntry(fileName, meta["file_metadata"])) }}</pre></span>
            <span class="ml-2" v-else-if="fileNameOne && fileNameTwo"><pre>{{  formatOutputMutliFile(fileNameOne, fileNameTwo, formatInputString(findMatchingEntry(fileNameOne, meta["file_metadata"])), formatInputString(findMatchingEntry(fileNameTwo, meta["file_metadata"]))) }}</pre></span>
            <span class="ml-2 text-red-500" v-else-if="mode == 'MultiFile'">You need to select both files first</span>
            <span class="ml-2 text-red-500" v-else>You need to select a file first</span>
        </template>

        <template #footer>
            <DangerButton @click="$emit('close')" class="ml-3">
                Close
            </DangerButton>

        </template>
    </DialogModal>
</template>

<script>
import { defineComponent } from "vue"

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
        mode: {
            type: String,
            required: false
        },
        fileName: {
            type: String,
            required: false
        },
        meta: {
            type: Object,
            required: false
        },
        fileNameOne: {
            type: String,
            required: false
        },
        fileNameTwo: {
            type: String,
            required: false
        }
    },
    emits: ['close'],
    methods: {
    findMatchingEntry(fileNameInput, metadataDatabase) {
        try {
            const nameParts = fileNameInput.split('_');
            const dateInFileName = nameParts[1];  //Extract date
            const timeInFileName = nameParts[2].slice(0, -4); // Extract time, remove the ".wav" extension
            const dateTimeInFileName = `${dateInFileName}T${timeInFileName}:00.000000Z`; // Combine date and time

            const year = dateTimeInFileName.substring(0, 4);
            const month = dateTimeInFileName.substring(4, 6) - 1; // JS months are 0-indexed
            const day = dateTimeInFileName.substring(6, 8);
            const hour = dateTimeInFileName.substring(9, 11);
            const minute = dateTimeInFileName.substring(11, 13);
            const second = dateTimeInFileName.substring(13, 15);
            const dateTimeInFile = new Date(Date.UTC(year, month, day, hour, minute, second));

            for (const object of metadataDatabase) {
                const recordedDate = new Date(object.recorded);
                if (recordedDate > dateTimeInFile) {
                    return object;
                }
            }
        } catch {
            return "No metadata could be found for this file. Maybe the name is wrong?";
        }
        //This is 100% based on name, so if the naming scheme is different it will not work.
        return "No metadata could be found for this file. Maybe the name is wrong?";
    },
    formatInputString(input) {
        const inputString = JSON.stringify(input);
        if (input === "No metadata could be found for this file. Maybe the name is wrong?") {
            return input;
        }
        const parsedInput = JSON.parse(inputString);
        let formattedString = '';
        for (const key in parsedInput) {
            if (parsedInput.hasOwnProperty(key)) {
                formattedString += `${key}: ${parsedInput[key]}\n`;
            }
        }
        return formattedString;
    },
    formatOutputMutliFile(onename, twoname, oneformat, twoformat) {
        let finalString = onename + "\n";
        finalString += oneformat + "\n\n\n";
        finalString += twoname + "\n";
        finalString += twoformat;
        return finalString;
    },
}
})
</script>
