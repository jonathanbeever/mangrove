<template>
    <DialogModal :show="show" @close="$emit('close')">
        <template #title>
            <div class="border-b-2 pb-2 border-grey-500">
                <div class="flex">
                    <p class="text-xl align-middle">Export Data as:</p>
                    <input
                        v-model="exportTitle"
                        placeholder="Enter Title..."
                        id="exportTitleInput"
                        class="text-xl ml-2 mr-2 pl-2 border-2 border-black-700 rounded-md"
                    />
                    <p class="text-xl">
                        {{ exportingJSON ? ".zip" : ".pdf" }}
                    </p>
                </div>
                <!-- Div for switching between exporting PDF or JSON -->
                <!-- <div class="flex absolute top-0 right-0 mx-4 my-1 items-center"> -->
                <div class="flex absolute top-0 right-0 mt-2 mr-4 items-center">
                    <p class="text-sm mr-2">PDF</p>
                    <!-- Switch Container -->
                    <div
                        class="w-16 h-10 cursor-pointer flex items-center bg-gray-300 rounded-full p-1"
                        @click="exportingJSON = !exportingJSON"
                    >
                        <div
                        class="bg-white w-8 h-8 rounded-full shadow-md transform duration-300 ease-in-out"
                        :class="{ 'translate-x-6': exportingJSON }"
                        ></div>
                    </div>
                    <p class="text-sm ml-2">JSON</p>
                </div>
            </div>
            <p class="text-base flex flex-col mt-1">
            {{
                exportingJSON
                ? "Share with other Mangrove users."
                : "Share data visualizations."
            }}
            </p>
        </template>

        <template #content>
            <div v-if="!exportingJSON">Options for PDF file:</div>
            <!-- JSON export options-->
            <div v-if="exportingJSON">
                Export a zipped file containing the currently loaded audio (.wav) and its given
                annotations (.json).
            </div>
            <!-- PDF export options-->
            <div v-else>
                <!-- table -->
                <div class="flex flex-col px-6 overflow-y-auto overflow-x-hidden max-h-96">
                    <div class="py-4 align-middle inline-block min-w-full">
                        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th
                                            class="px-6 py-3 text-left font-medium text-neutral-900 uppercase"
                                            scope="col"
                                        >
                                            Site
                                        </th>
                                        <th
                                            class="px-6 py-3 text-left font-medium text-neutral-900 uppercase"
                                            scope="col"
                                        >
                                            Series
                                        </th>
                                        <th
                                            class="px-6 py-3 text-left font-medium text-neutral-900 uppercase"
                                            scope="col"
                                        >
                                            Ind.
                                        </th>
                                        <th
                                            class="px-6 py-3 text-left font-medium text-neutral-900 uppercase"
                                            scope="col"
                                        >
                                            Chart
                                        </th>
                                        <th
                                            class="px-6 py-3 text-left font-medium text-neutral-900 uppercase"
                                            scope="col"
                                        >
                                            File
                                        </th>
                                        <th
                                            class="px-6 py-3 text-left font-medium text-neutral-900 uppercase"
                                            scope="col"
                                        ></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="(item, index) in exportVisualizations"
                                        :key="index"
                                        class="border-2 border-grey-500"
                                    >
                                        <td class="px-6 py-4 whitespace-normal max-w-[100px]">
                                            <div class="">
                                                <div class="text-sm font-medium text-gray-900 break-words">
                                                    {{
                                                    item.site2 == null
                                                        ? `${item.site1.name}`
                                                        : `${item.site1.name}, ${item.site2.name}`
                                                    }}
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-normal max-w-[100px]">
                                            <div class="f">
                                                <div>
                                                    <div class="text-sm text-gray-500 break-words">
                                                        {{
                                                            item.series2 == null
                                                            ? `${item.series1.name}`
                                                            : `${item.series1.name}, ${item.series2.name}`
                                                        }}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-normal max-w-[10px]">
                                            <div class="">
                                                <div>
                                                    <div class="text-sm text-gray-500 break-words">
                                                        {{ item.indices }}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-normal max-w-[115px]">
                                            <div class="">
                                                <div>
                                                    <div class="text-sm text-gray-500 break-words">
                                                        {{
                                                            item.indices == "RMS" || item.indices == "NDSI"
                                                            ? `Compare Bar`
                                                            : `${item.chart}`
                                                        }}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-normal max-w-[100px]">
                                            <div class="i">
                                                <div>
                                                    <div class="text-sm text-gray-500 break-words">
                                                        {{
                                                            item.fileOne == null ?
                                                            "" :
                                                            (item.fileTwo == null
                                                            ? `${item.fileOne.file.name}`
                                                            : `${item.fileOne.file.name}, ${item.fileTwo.file.name}`)
                                                        }}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-normal max-w-[80px]">
                                            <div class="flex justify-between items-center">
                                                <!-- Arrows to configure list order -->
                                                <div class="flex flex-col">
                                                    <div>
                                                        <svg
                                                            class="h-6 w-6 text-black hover:bg-zinc-100"
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="2"
                                                            stroke="currentColor"
                                                            fill="none"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            @click="$emit('moveUpExportEntry', item, index)"
                                                        >
                                                            <path stroke="none" d="M0 0h24v24H0z" />
                                                            <polyline points="6 15 12 9 18 15" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <svg
                                                            class="h-6 w-6 text-black rotate-180 hover:bg-zinc-100"
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="2"
                                                            stroke="currentColor"
                                                            fill="none"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            @click="$emit('moveDownExportEntry', item, index)"
                                                        >
                                                            <path stroke="none" d="M0 0h24v24H0z" />
                                                            <polyline points="6 15 12 9 18 15" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <!-- X to remove from list -->
                                                <div>
                                                    <svg
                                                        class="h-5 w-5 text-red-600 hover:bg-red-100"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="2"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        @click="$emit('deleteExportEntry', index)"
                                                    >
                                                        <path stroke="none" d="M0 0h24v24H0z" />
                                                        <line x1="18" y1="6" x2="6" y2="18" />
                                                        <line x1="6" y1="6" x2="18" y2="18" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <!-- checkboxes -->
                <div class="px-6 mt-4 flex flex-row space-between">
                    <div class="flex flex-col w-1/2">
                        <div class="flex flex-row items-center">
                            <input
                                type="checkbox"
                                class="form-checkbox"
                                id="export-audio"
                                value="audio"
                                v-model="pdfOptions"
                            />
                            <label for="export-audio" class="ml-2">
                                Export Audio File
                            </label>
                        </div>
                        <div class="flex flex-row items-center mt-2">
                            <input
                                type="checkbox"
                                class="form-checkbox"
                                id="export-sites"
                                value="sites"
                                v-model="pdfOptions"
                            />
                            <label for="export-sites" class="ml-2">
                                Export Sites
                            </label>
                        </div>
                    </div>
                    <div class="flex flex-col w-1/2">
                        <div class="flex flex-row items-center">
                            <input
                                type="checkbox"
                                class="form-checkbox"
                                id="export-series"
                                value="series"
                                v-model="pdfOptions"
                            />
                            <label for="export-series" class="ml-2">
                                Export Series
                            </label>
                        </div>
                        <div class="flex flex-row items-center mt-2">
                            <input
                                type="checkbox"
                                class="form-checkbox"
                                id="export-index"
                                value="index"
                                v-model="pdfOptions"
                            />
                            <label for="export-index" class="ml-2">
                                Export Index
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <DangerButton @click="$emit('close')" class="ml-3">
                Cancel
            </DangerButton>

            <PrimaryButton
                @click="exportData"
                class="ml-3"
                :disabled="exportVisualizations.length < 1 && !exportingJSON"
            >
                Export
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
        wavFile: {
            type: Object,
            required: false
        },
        exportVisualizations: {
            type: Array,
            required: true
        },
        jsonNotes: {
            type: String,
            required: false
        }
    },
    emits: ['close', 'moveUpExportEntry','moveDownExportEntry', 'deleteExportEntry'],
    data() {
        return {
            exportTitle: "",
            exportingJSON: false,
            pdfOptions: []
        }
    },
    watch: {
        show(newShow) {
            // Default to PDF
            if (newShow) {
                this.exportingJSON = false
            }
            // Clear the inputs when the modal closes
            else {
                // TODO
            }
        }
    },
    methods: {
        exportData() {
            var title = this.exportTitle != ("" || null || undefined)
                ? this.exportTitle
                : "exported_data"
            this.exportingJSON ? this.exportAsJSON(title) : this.exportAsPDF(title);
        },
        exportAsJSON(title) {
            let test = this.jsonNotes;

            var zip = new JSZip();
            zip.file("data.json", test); // Add JSON annotations

            if (this.wavFile != "")
                zip.file("audio.wav", this.wavFile); // Add audio file

            zip.generateAsync({ type: "blob" }).then(function (content) {
                saveAs(content, `${title}.zip`);
            });
        },
        exportAsPDF(title) {
            const inch = 25.4;

            var doc = new jsPDF("p", "mm", "a4");
            var width = doc.internal.pageSize.getWidth();
            var padding = inch;
            var pageNum = 1;
            var finalPage = Math.ceil(this.exportVisualizations.length / 2);

            // Changes title if unset
            if (title == "exported_data") title = "Exported Data";

            var currentIdx = 0;
            while (pageNum <= finalPage) {
                doc.setFontSize(22);
                doc.text(`${title}`, inch, inch);
                doc.text(`${pageNum}`, width - inch, inch);
                doc.setFontSize(12);
                padding += 12;

                for (let i = 0; i < 2; i++) {
                    let entry = this.exportVisualizations[currentIdx];

                    if (entry == undefined) break;

                    if (this.pdfOptions.includes("index")) {
                        let index = "";
                        switch (entry.indices) {
                            case "ACI":
                                index = "Acoustic Complexity Index";
                                break;
                            case "NDSI":
                                index = "Normalized Difference Soundscape Index";
                                break;
                            case "AEI":
                                index = "Acoustic Evenness Index";
                                break;
                            case "ADI":
                                index = "Acoustic Diversity Index";
                                break;
                            case "BI":
                                index = "Bioacoustic Index";
                                break;
                            case "RMS":
                                index = "Root Mean Square";
                                break;
                            default:
                                break;
                        }
                        doc.text(`${index}`, inch, padding);
                        padding += 6;
                    }

                    if (this.pdfOptions.includes("audio")) {
                        doc.text(`${entry.fileOne.file.name}`, inch, padding);
                        doc.text(
                            entry.fileTwo.file.name.length >= 40 ? "" : `${entry.fileTwo.file.name}`,
                            inch + 75,
                            padding
                        );
                        padding += 6;
                    }

                    if (this.pdfOptions.includes("sites")) {
                        doc.text(`Site: ${entry.site1}`, inch, padding);
                        doc.text(`${entry.site2}`, inch + 75, padding);
                        padding += 6;
                    }

                    if (this.pdfOptions.includes("series")) {
                        doc.text(`Series: ${entry.series1}`, inch, padding);
                        doc.text(`${entry.series2}`, inch + 75, padding);
                        padding += 6;
                    }

                    doc.addImage(entry.imageURL, "PNG", inch, padding - 10, 150, 100);
                    padding += 100;
                    currentIdx++;
                }

                pageNum++;
                padding = inch;

                if (pageNum <= finalPage)
                    doc.addPage();
            }

            if (doc.internal.getNumberOfPages() > finalPage)
                doc.deletePage(finalPage + 1);

            doc.save(`${title}.pdf`);
        }
    }
})
</script>
