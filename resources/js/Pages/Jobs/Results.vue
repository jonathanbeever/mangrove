<template>
    <AppLayout title="Results">
        <div class="dark:text-black">
            <div class="flex flex-row">
                <!-- Left -->
                <div :class="leftPanelClass">
                    <div class="mt-4 ml-4 mr-2">
                        <!-- Wavesurfer -->
                        <div
                            class="bg-white shadow-xl sm:rounded-lg dark:shadow-inner dark:shadow-cyan-500 dark:bg-slate-900 dark:text-white"
                            ref="wavesurferRegion"
                        >
                            <div class="p-2">
                                <h2>
                                    2D Waveform Spectrogram
                                </h2>
                                <div class="flex-row pr-2 pt-2 overflow-hidden">
                                    <input
                                        id="file-input"
                                        accept="audio/*"
                                        class="form-control"
                                        single
                                        type="file"
                                        v-on:change="onFileChange($event)"
                                        :disabled="loading === true"
                                    />
                                </div>
                                <div id="loading" ref="loading" class="loading pt-2">
                                    <div id="wave" class="p-2"></div>
                                        <vue-element-loading
                                            ref="animation"
                                            :active="loading"
                                            background-color="dark:rgba(0,0,0,.9)"
                                            size="100"
                                            spinner="bar-fade-scale"
                                        />
                                        <input
                                            id="slider"
                                            ref="slider"
                                            max="200"
                                            min="1"
                                            style="width: 100%"
                                            type="range"
                                            value="1"
                                            @input="slideView"
                                        />
                                </div>
                            </div>
                            <div class="absolute margin: auto; inset-x-0 bottom-10 text-slate-800" style="text-align: center; position: fixed; bottom: 0; z-index: 99 !important; display: none;">
                                <audio id="player" ref="player" class="player" controls style="width: 40%; display: inline-block;" v-bind:currentTime="currTime" volume="0.1" @pause="pause" @play="play" @seeked="updateSpectrogramTime">
                                    <source v-bind:src="spFile">
                                    Audio playback is not supported.
                                </audio>
                            </div>
                        </div>

                        <!-- Annotation Form -->
                        <div
                            v-show="showAnnotationForm"
                            class="p-4 mt-2 bg-white shadow-xl rounded-md dark:shadow-inner dark:shadow-cyan-500 dark:bg-slate-900 dark:text-white"
                        >
                            <form
                                role="form"
                                name="edit"
                            >
                                <div class="form-group">
                                    <label for="start">Start</label>
                                    <input
                                        class="form-control text-black shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="start"
                                        name="start"
                                    />
                                </div>

                                <div class="form-group">
                                    <label for="end">End</label>
                                    <input
                                        class="form-control text-black shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="end"
                                        name="end"
                                    />
                                </div>

                                <div class="form-group">
                                    <label for="note">Note</label>
                                    <textarea
                                        id="note"
                                        class="form-control text-black shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        rows="3"
                                        name="note"
                                    ></textarea>
                                </div>

                                <div class="flex flex-row justify-end">
                                    <PrimaryButton type="submit" class="mr-2">Save</PrimaryButton>
                                    <DangerButton
                                        @click="deleteRegionCall"
                                        id="delete-region"
                                    >
                                        Delete
                                    </DangerButton>
                                </div>
                            </form>
                        </div>
                        <!-- Audio Extract -->
                        <div>
                            <AudioModal
                                    :show="showAudioExtractPopup"
                                    @close="showAudioExtractPopup = false"
                                    @userInput="pass"
                                />
                        </div>
                        <!-- Metadata -->
                        <div>
                            <PrimaryButton class="btn btn-success border-gray-200" @click="showMetadataPopup = true">
                                Show metadata
                            </PrimaryButton>
                            <MetaModal
                                    :show="showMetadataPopup"
                                    :mode="resultMode"
                                    :fileName="selections?.file?.file?.name || ''"
                                    :fileNameOne="selections?.fileOne?.file?.name"
                                    :fileNameTwo="selections?.fileTwo?.file?.name"
                                    :meta="selections?.series || ''"
                                    @close="showMetadataPopup = false"
                                />
                        </div>
                        <!-- Import/Export -->
                        <div class="flex flex-wrap justify-start items-center p-2 mt-2 bg-white shadow-xl rounded-md dark:shadow-inner dark:shadow-cyan-500 dark:bg-slate-900 dark:text-white">
                            <ExportModal
                                :show="showExportModal"
                                :wavFile="wavFile"
                                :exportVisualizations="exportVisualizations"
                                :jsonNotes="jsonNotes"
                                @close="showExportModal = false"
                                @move-up-export-entry="handleMoveUpExportEntry"
                                @move-down-export-entry="handleMoveDownExportEntry"
                                @delete-export-entry="handleDeleteExportEntry"
                            />
                            <PrimaryButton class="mr-2 my-2 whitespace-nowrap border-gray-200" @click="showExportModal = true">
                                Export Data
                            </PrimaryButton>
                            <div class="mr-2 my-2">
                                <label for="import" class="px-4 py-2 bg-gray-800 border border-gray-200 rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring focus:ring-gray-300">
                                    Upload Zipped Folder
                                </label>
                                <input id="import" class="hidden" type="file" accept=".zip" @change="loadZipFile" />
                            </div>
                            <!--
                            <PrimaryButton class="my-2 whitespace-nowrap border-gray-200" @click="layoutSwapped = !layoutSwapped">
                                Swap Sides
                            </PrimaryButton>
                            -->
                        </div>
                    </div>
                </div>

                <!-- Right -->
                <div :class="rightPanelClass">
                    <!-- Analysis Selection / Data Visualization -->
                    <div class="mt-4 ml-2 mr-4">
                        <!-- Analysis Mode / Result Option Selection -->
                        <div class="flex flex-col grow dark:text-white">
                            <div class="w-full p-4 flex flex-row flex-wrap justify-between rounded-md dark:shadow-inner dark:shadow-cyan-500 dark:bg-slate-900 dark:text-white">
                                <div class="px-2">
                                    <p class="dark:text-white">
                                        Analysis Mode
                                    </p>
                                    <select
                                        class="grow dark:text-black rounded"
                                        v-model="resultMode"
                                    >
                                        <option
                                            v-for="mode in resultModeOptions"
                                            :value="mode.mode"
                                        >
                                            {{ mode.label }}
                                        </option>
                                    </select>
                                </div>

                                <SingleFileResultOptions v-if="resultMode == ResultMode.SingleFile" v-model="selections" :sites="sites"/>
                                <MultiFileResultOptions  v-if="resultMode == ResultMode.MultiFile"  v-model="selections" :sites="sites"/>
                                <SingleSeriesResultOptions v-if="resultMode == ResultMode.SingleSeries" v-model="selections" :sites="sites"/>
                                <MultiSeriesResultOptions  v-if="resultMode == ResultMode.MultiSeries"  v-model="selections" :sites="sites"/>
                                <AllSeriesResultOptions v-if="resultMode == ResultMode.AllSeries" v-model="selections" :sites="sites"/>
                            </div>
                        </div>

                        <!-- Selected Visualizations -->
                        <div v-if="showChart" class="w-full mt-2 p-4 rounded-md dark:shadow-inner dark:shadow-cyan-500 dark:bg-slate-900 dark:text-white">
                            <SingleFileVisualizations
                                v-if="resultMode == ResultMode.SingleFile && showChart"
                                v-model="currentChart"
                                :index="selections.index"
                                :chart="selections.chart"
                                :fileName="selections.file.file.name"
                                :graphData="graphInputFile"
                            />

                            <MultiFileVisualizations
                                v-if="resultMode == ResultMode.MultiFile && showChart"
                                v-model="currentChart"
                                :index="selections.index"
                                :chart="selections.chart"
                                :fileNameOne="selections.fileOne.file.name"
                                :fileNameTwo="selections.fileTwo.file.name"
                                :graphDataOne="graphInputFileOne"
                                :graphDataTwo="graphInputFileTwo"
                            />

                            <SingleSeriesVisualizations
                                v-if="resultMode == ResultMode.SingleSeries && showChart"
                                v-model="currentChart"
                                :index="selections.index"
                                :seriesName="selections.series.name"
                                :graphData="graphInputSeries"
                            />

                            <MultiSeriesVisualizations
                                v-if="resultMode == ResultMode.MultiSeries && showChart"
                                v-model="currentChart"
                                :index="selections.index"
                                :seriesNameOne="selections.seriesOne.name"
                                :seriesNameTwo="selections.seriesTwo.name"
                                :graphDataOne="graphInputSeriesOne"
                                :graphDataTwo="graphInputSeriesTwo"
                            />

                            <AllSeriesVisualizations
                                v-if="resultMode == ResultMode.AllSeries && showChart"
                                v-model="currentChart"
                                :index="selections.index"
                                :siteName="selections.site.name"
                                :graphData="graphInputAllSeries"
                                :graphLabels="selections.site.series.map((s) => s.name)"
                            />

                            <!-- Export this chart button -->
                            <div class="flex justify-end">
                                <PrimaryButton
                                    class="btn btn-success border-gray-200 mt-4 transform duration-100 justify-center"
                                    :class="{ 'bg-green-500 hover:bg-green-700': exportingCurrentChart }"
                                    @click="onToggleExport"
                                >
                                    {{ exportingCurrentChart ? "Exporting chart" : "Export this chart" }}
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script>
import { defineComponent } from "vue"
import _ from "lodash"
import * as JSZip from "jszip"

import AppLayout from "@/Layouts/AppLayout.vue"
import DangerButton from "@/Components/DangerButton.vue"
import ExportModal from "@/Modals/ExportModal.vue"
import MetaModal from "@/Modals/MetaModal.vue"
import AudioModal from "@/Modals/RegionExtractionModal.vue"
import PrimaryButton from "@/Components/PrimaryButton.vue"
import RegionsPlugin from "wavesurfer.js/src/plugin/regions"
import SpectrogramPlugin from "wavesurfer.js/src/plugin/spectrogram"
import VueElementLoading from "vue-element-loading"
import WaveSurfer from "wavesurfer.js"

import AllSeriesResultOptions from "@/ResultOptionsComponents/AllSeriesResultOptions.vue"
import MultiFileResultOptions from "@/ResultOptionsComponents/MultiFileResultOptions.vue"
import MultiSeriesResultOptions from "@/ResultOptionsComponents/MultiSeriesResultOptions.vue"
import SingleFileResultOptions from "@/ResultOptionsComponents/SingleFileResultOptions.vue"
import SingleSeriesResultOptions from "@/ResultOptionsComponents/SingleSeriesResultOptions.vue"

import AllSeriesVisualizations from "@/Pages/ChartVisualizations/AllSeriesVisualizations.vue"
import MultiFileVisualizations from "@/Pages/ChartVisualizations/MultiFileVisualizations.vue"
import MultiSeriesVisualizations from "@/Pages/ChartVisualizations/MultiSeriesVisualizations.vue"
import SingleFileVisualizations from "@/Pages/ChartVisualizations/SingleFileVisualizations.vue"
import SingleSeriesVisualizations from "@/Pages/ChartVisualizations/SingleSeriesVisualizations.vue"

// Psuedo-Enum
const ResultMode = {
    SingleFile: "SingleFile",
    MultiFile: "MultiFile",
    SingleSeries: "SingleSeries",
    MultiSeries: "MultiSeries",
    AllSeries: "AllSeries"
}

const resultModeOptions = [
    {
        label: "Single File Analysis",
        mode: ResultMode.SingleFile
    },
    {
        label: "Multi File Analysis",
        mode: ResultMode.MultiFile
    },
    {
        label: "Single Series Analysis",
        mode: ResultMode.SingleSeries
    },
    {
        label: "Multi Series Analysis",
        mode: ResultMode.MultiSeries
    },
    {
        label: "Site Analysis",
        mode: ResultMode.AllSeries
    }
]

export default defineComponent({
    components: {
        AppLayout,
        DangerButton,
        ExportModal,
        MetaModal,
        AudioModal,
        PrimaryButton,
        VueElementLoading,
        WaveSurfer,

        AllSeriesResultOptions,
        MultiFileResultOptions,
        MultiSeriesResultOptions,
        SingleFileResultOptions,
        SingleSeriesResultOptions,

        AllSeriesVisualizations,
        MultiFileVisualizations,
        MultiSeriesVisualizations,
        SingleFileVisualizations,
        SingleSeriesVisualizations
    },
    props: {
        sites: { // User sites
            type: Array,
            required: true
        },
        sentResult: { // Job to be loaded in
            type: Object,
            required: false
        }
    },
    data() {
        return {
            // Result Mode
            resultMode: null,
            ResultMode: ResultMode,
            resultModeOptions: resultModeOptions,

            // Analysis Selections
            selections: {},
            currentChart: null,

            // Metadata
            showMetadataPopup: false,

            // Audio Extracting
            showAudioExtractPopup: false,

            // Exporting
            showExportModal: false,
            exportVisualizations: [],

            // JSON Exporting
            regionToDelete: null,
            wavesurferRegionListOBJ: null,
            globalWavesurferReference: null,
            regionToExtract:null,
            jsonNotes: null,

            // Spectrogram
            wavFile: null, // Wavfile
            annotations: null, // Wavfile's annotations
            spFile: "", // Spectrogram File
            currTime: 0.0, // Time position on sepctrogram
            loading: false, // Spectrogram is loading
            showAnnotationForm: false, // Show the annotaiton form

            // Metadata
            metadataFields: [],

            // Misc
            firstLoad: true,
            layoutSwapped: false
        }
    },
    computed: {
        graphInputFile() {
            return JSON.parse(
                this.selections.file[`${this.selections.index.toLowerCase() + "_results"}`]
            )
        },
        graphInputFileOne() {
            return JSON.parse(
                this.selections.fileOne[`${this.selections.index.toLowerCase() + "_results"}`]
            )
        },
        graphInputFileTwo() {
            return JSON.parse(
                this.selections.fileTwo[`${this.selections.index.toLowerCase() + "_results"}`]
            )
        },
        graphInputSeries() {
            return this.buildIndicesData(
                this.selections.series,
                this.selections.index
            )
        },
        graphInputSeriesOne() {
            return this.buildIndicesData(
                this.selections.seriesOne,
                this.selections.index
            )
        },
        graphInputSeriesTwo() {
            return this.buildIndicesData(
                this.selections.seriesTwo,
                this.selections.index
            )
        },
        graphInputAllSeries() {
            return this.selections.site.series.map((s) => {
                (s.results.length > 0) ? this.buildIndicesData(s, this.selections.index) : null
            }).filter((d) => d != null)
        },
        showChart() {
            switch(this.resultMode) {
                case ResultMode.SingleFile:
                    return ((this.selections.chart != null || this.selections.index == ("NDSI" || "RMS"))
                            && this.selections.file != null)
                case ResultMode.MultiFile:
                    return ((this.selections.chart != null || this.selections.index == ("NDSI" || "RMS"))
                            && this.selections.fileOne != null && this.selections.fileTwo != null)
                case ResultMode.SingleSeries:
                    return (this.selections.index != null && this.selections.series != null)
                case ResultMode.MultiSeries:
                    return (this.selections.index != null && this.selections.seriesOne != null
                            && this.selections.seriesTwo != null)
                case ResultMode.AllSeries:
                    return this.selections.index != null && this.selections.site != null
            }
        },
        currentCanvas() {
            return this.currentChart.firstElementChild
        },
        /* TODO Persist the current chart until a new chart is selected. If done, this needs to move to a watcher on currentChart
        so that when a user is selecting new options this doesnt break */
        exportingCurrentChart() {
            let current = {
                chart: this.selections.chart,
                indices: this.selections.index,

                fileOne: this.selections.file != null
                        ? this.selections.file
                        : (this.selections.fileOne != null ? this.selections.fileOne : null),
                fileTwo: this.selections.fileTwo != null ? this.selections.fileTwo : null,

                site1: this.selections.site != null
                        ? this.selections.site
                        : (this.selections.siteOne != null ? this.selections.siteOne : null),
                site2: this.selections.siteTwo != null ? this.selections.siteTwo : null,

                series1: this.selections.series != null
                        ? this.selections.series
                        : (this.selections.seriesOne != null ? this.selections.seriesOne : null),
                series2: this.selections.seriesTwo != null ? this.selections.seriesTwo : null,

                imageURL: null,
                canvas: null,
            }

            for (let i = 0; i < this.exportVisualizations.length; i++) {
                if (
                    _.isEqual(
                        _.omit(current, ["imageURL", "canvas"]),
                        _.omit(this.exportVisualizations[i], ["imageURL", "canvas"])
                    )
                ) {
                    return true
                }
            }
            return false
        },
        rightPanelClass() {
            return {
                'order-first': this.layoutSwapped,
                'w-1/4': this.layoutSwapped,
                'w-3/4': !this.layoutSwapped
            }
        },
        leftPanelClass() {
            return {
                'w-1/4': !this.layoutSwapped,
                'w-3/4': this.layoutSwapped
            }
        }
    },
    watch: {
        resultMode() {
            // WORKAROUND: The watch handler gets triggered after beforeMount runs, wiping data
            // This skips the handler the first time it is called
            if (this.firstLoad) {
                this.firstLoad = false
                return
            }
            // Clear selections when the mode changes
            this.selections = {}
        }
    },
    created() {
        this.updateMetadata()
    },
    beforeMount() {
        // The component was not passed a result
        if (this.sentResult == null) {
            this.resultMode = ResultMode.SingleFile
        } else { // The component was passed a result
            this.resultMode = ResultMode.SingleSeries

            // Find the series the job was run on
            for (let site of this.sites) {
                for (let series of site.series) {
                    // // Series found
                    if (series.id == this.sentResult.series_id) {
                        // Set the selections
                        this.selections.site = site
                        this.selections.series = series

                        // If only one index in the job, select it. if not, do not set an index
                        let found;
                        ["aci", "adi", "aei", "bi", "ndsi", "rms"].forEach((index) => {
                            if(this.sentResult[index + "_input"] != null) {
                                if (found) {
                                    this.selections.index = null
                                } else {
                                    this.selections.index = index.toUpperCase()
                                    found = true
                                }
                            }
                        })
                        break;
                    }
                }
                if (this.selections.site != null) break
            }
        }
    },
    mounted() {
        const self = this
        this.wavesurfer = WaveSurfer.create({
            hideScrollbar: true,
            container: "#wave",
            waveColor: "#D2EDD4",
            progressColor: "#46B54D",
            backend: "MediaElement",
            mediaControls: true,
            responsive: true,

            plugins: [
                SpectrogramPlugin.create({
                    responsive: true,
                    container: "#wave",
                    labels: true,
                    colorMap: this.colorMap,
                }),
                RegionsPlugin.create({
                    regions: [],
                    dragSelection: {
                        slop: 5,
                    },
                }),
            ],
        })

        // store region list on waveform to update in local storage
        var regionList = this.wavesurfer.regions.list

        // store globaly the list of regions
        this.wavesurferRegionListOBJ = regionList

        // store globaly refernce to wavesurfer in mounted
        this.globalWavesurferReference = this.wavesurfer

        // store region to remove
        var storeDeleteRegionid = this.regionToDelete

        // event handling for when creating wave container with uploaded notes
        this.wavesurfer.on("ready", function () {
            if (self.annotations) {
                self.loadAnnotations(self.annotations, self.wavesurfer)
                self.annotations = null;
            }
            else
                self.wavesurfer.clearRegions();
        })

        // change the RGB of the region to something more visible
        this.wavesurfer.on('region-created', function (region) {
            // console.log("---->" + self.annotations);

            if (self.annotations == null)
                self.addRegionColor(region);
        });

        // save annotations into browser while notes are generated
        this.wavesurfer.on("region-updated", function () {
            localStorage.regions = JSON.stringify(
                Object.keys(regionList).map(function (id) {
                    let targetRegion = regionList[id]
                    return {
                        start: targetRegion.start,
                        end: targetRegion.end,
                        attributes: targetRegion.attributes,
                        data: targetRegion.data,
                    }
                })
            )
            self.jsonNotes = localStorage.regions
        })

        // update local storage of region removal
        this.wavesurfer.on("region-removed", function () {
            localStorage.regions = JSON.stringify(
                Object.keys(regionList).map(function (id) {
                    let targetRegion = regionList[id]

                    return {
                        start: targetRegion.start,
                        end: targetRegion.end,
                        attributes: targetRegion.attributes,
                        data: targetRegion.data,
                    }
                })
            )
            self.jsonNotes = localStorage.regions
        })

        this.wavesurfer.on("waveform-ready", function () {
            self.$refs["animation"].display = "none"
            self.$refs["animation"].show = false
            self.loading = false
        })

        this.wavesurfer.on("seek", function () {
            self.currTime = self.wavesurfer.getCurrentTime()
            let timeDelta = Math.abs(self.currTime - self.wavesurfer.getCurrentTime())
            if (timeDelta > 0.1) {
                self.wavesurfer.seekTo(self.currTime / self.wavesurfer.getDuration())
            }
        })

        // edit regional annotation
        this.wavesurfer.on("region-click", function (region) {
            self.regionToDelete = region.id;

            let form = document.forms.edit
            self.showAnnotationForm = true
            form.elements.start.value = Math.round(region.start * 10) / 10
            form.elements.end.value = Math.round(region.end * 10) / 10
            form.elements.note.value = region.data.note || ""

            form.onsubmit = function (e) {
                e.preventDefault()
                region.update({
                    start: form.elements.start.value,
                    end: form.elements.end.value,
                    data: {
                        note: form.elements.note.value,
                    },
                })
                self.showAnnotationForm = false
            }

            form.onreset = function () {
                self.showAnnotationForm = false
                form.dataset.region = null
            }
            form.dataset.region = region.id
        })

        // selects region to focus on clip by creating a new buffer that wavesurfer can load
        this.wavesurfer.on('region-dblclick', function (region) {

            // self.wavesurfer.pause();

            self.regionToExtract = region;

            console.log("double click has been registered" + " -> " + self.wavesurfer.backend.buffer.length);

            self.showAudioExtractPopup = true;

            console.log();

            let start = region.start;
            let end = region.end;

            // let string = self.NameExtractedRegion();

            // self.regionExtract(self.wavesurfer, region);
        });

    },
    methods: {

        // meant for testing but will be used to pass userinput for file nameing
        pass: function (string) {
            // console.log(string);

            this.regionExtract(this.globalWavesurferReference, this.regionToExtract, string);
        },
        /***************************
         *     SOUND EXTRACTION    *
         ***************************/

        // NameExtractedRegion: function () {
        //     let name = prompt("Create a new file name!");
        //     if (name == null || name == "") {
        //         alert ("No input detected. Please try again");
        //     }
        //     else
        //         return name;
        // },

        async downloadWavFromBlobURL (blobURL, filename) {
            try {
                const response = await fetch(blobURL);
                const blob = await response.blob();
                saveAs(blob, filename);
            } catch (error) {
                console.error("Failed to download .wav file:", error);
            }
        },

        sliceWavBlob: function (blob, start, duration) {
            return new Promise((resolve) => {

            const fileReader = new FileReader();

            fileReader.onload = (event) => {
            const buffer = event.target.result;
            console.log("In slice .wav blob");
            console.log(buffer);
            const dataView = new DataView(buffer);

            // WAV file header
            const headerSize = 44;
            const header = new Uint8Array(buffer.slice(0, headerSize));

            // Extract WAV file information
            const numChannels = dataView.getUint16(22, true);
            const sampleRate = dataView.getUint32(24, true);
            const bytesPerSample = dataView.getUint16(34, true) / 8;

            // Calculate the start and end byte positions
            const startByte = headerSize + start * numChannels * sampleRate * bytesPerSample;
            const endByte = startByte + duration * numChannels * sampleRate * bytesPerSample;

            // Extract the desired portion of the audio data
            const audioData = new Uint8Array(buffer.slice(startByte, endByte));

            // Create a new Blob with the extracted portion and the WAV header
            const slicedWavBlob = new Blob([header, audioData], { type: "audio/wav" });
            // console.log("-----" + slicedWavBlob + "------");
            resolve(slicedWavBlob);
            };

            fileReader.readAsArrayBuffer(blob);


        });
        },

        regionExtract: function (surfer, region, string) {

            // console.log("commencing region extract");

            const file = this.wavFile;

            // console.log(file);

            if (!file) {
                console.log("returning");
                return;
            }

            const wavFileBlob = new Blob([file], {type: "audio/wav"});

            const start = Math.round(region.start);
            const end = Math.round(region.end);

            const duration = end - start;

            this.sliceWavBlob(wavFileBlob, start, duration).then((slicedWavBlob) => {
                const audioBlob = slicedWavBlob;

                const blobURL = URL.createObjectURL(audioBlob);

                const filename = string + ".wav";

                console.log(filename);

                this.downloadWavFromBlobURL(blobURL, filename);
            });
        },

        /***************************
         *       EXPORTING         *
         ***************************/

        onToggleExport() {
            // No Chart Showing
            if (!this.showChart) {
                alert("Select a Chart.")
                return
            }

            let entry = {
                chart: this.selections.chart,
                indices: this.selections.index,

                fileOne: this.selections.file != null
                        ? this.selections.file
                        : (this.selections.fileOne != null ? this.selections.fileOne : null),
                fileTwo: this.selections.fileTwo != null ? this.selections.fileTwo : null,

                site1: this.selections.site != null
                        ? this.selections.site
                        : (this.selections.siteOne != null ? this.selections.siteOne : null),
                site2: this.selections.siteTwo != null ? this.selections.siteTwo : null,

                series1: this.selections.series != null
                        ? this.selections.series
                        : (this.selections.seriesOne != null ? this.selections.seriesOne : null),
                series2: this.selections.seriesTwo != null ? this.selections.seriesTwo : null,

                imageURL: null,
                canvas: null,
            }

            // Chart is already in export list.
            if (this.exportingCurrentChart) {
                // Iterate through the export visualizations in reverse and remove desired element.
                let i = this.exportVisualizations.length
                while (i--) {
                    if (
                        _.isEqual(
                            _.omit(entry, ["imageURL", "canvas"]),
                            _.omit(this.exportVisualizations[i], ["imageURL", "canvas"])
                        )
                    )
                    this.exportVisualizations.splice(i, 1)
                }
            } else {
                // Add Chart to list
                entry.imageURL = this.currentCanvas.toDataURL("image/png")
                this.exportVisualizations.push(entry)
            }
        },

        // Moves exported chart up the list by one
        handleMoveUpExportEntry(item, index) {
            if (index <= 0) return // Out of bounds.
            const temp = this.exportVisualizations[index - 1]
            this.exportVisualizations[index - 1] = item
            this.exportVisualizations[index] = temp
        },
        // Moves exported chart down the list by one
        handleMoveDownExportEntry(item, index) {
            if (index >= this.exportVisualizations.length - 1) return // Out of bounds
            const temp = this.exportVisualizations[index + 1]
            this.exportVisualizations[index + 1] = item
            this.exportVisualizations[index] = temp
        },
        // Deletes an exported chart entry
        handleDeleteExportEntry(index) {
            this.exportVisualizations.splice(index, 1)
        },

        /***************************
         *       IMPORTING         *
         ***************************/

        // Loads zipped folder containing audio data and annotations.
        loadZipFile(e) {
            const file = e.target.files[0]
            if (!file) return
            const reader = new FileReader()

            reader.onload = () => {
                const zip = new JSZip()
                const zipData = reader.result

                zip.loadAsync(zipData).then((contents) => {
                    const requiredFiles = ["audio.wav", "data.json"]

                    // If a required file is missing, throw error.
                    for (const requiredFile of requiredFiles) {
                        if (!contents.files[requiredFile]) {
                            console.error(`Required file "${requiredFile}" not found`)
                            return
                        }
                    }

                    // Get contents of the audio file
                    contents.files["audio.wav"].async("arraybuffer").then((audioData) => {
                        this.loading = true

                        // Apply uploaded .wav file to embedded wavesurfer.
                        const blob = new Blob([audioData], { type: "audio/wav" })
                        this.wavFile = blob
                        this.spFile = URL.createObjectURL(blob)
                        this.$refs.player.load()
                        this.createSpectrogram()
                    })

                    // Get contents of the data file
                    contents.files["data.json"].async("string").then((jsonData) => {
                        const data = JSON.parse(jsonData)
                        this.annotations = data
                    })
                })
            }
            reader.readAsArrayBuffer(file)
        },

        loadAnnotations(regions, surfer) {
            surfer.clearRegions();
            regions.forEach(function (region) {
                region.color = "rgba(245,189,31,0.3)";
                surfer.addRegion(region);
            });

        },

        /***************************
         *   DATA TRANSFORMATION   *
         ***************************/

        // Takes a series and the desired index and returns the results for each file
        // on that index if it has been run on that index
        buildIndicesData(series, index) {
            const regex = /^[A-Za-z0-9]+_\d{8}_\d{6}\.wav$/ // Regex for Song Meter SM4 recorder files.
            let output = {}
            let noDate = false

            // Set up the output fields with empty arrays to be pushed to later
            switch(index) {
                    case "ADI":
                        output["adiL"] = []
                        output["adiR"] = []
                        break;
                    case "AEI":
                        output["aeiL"] = []
                        output["aeiR"] = []
                        break;
                    case "BI":
                        output["areaL"] = []
                        output["areaR"] = []
                        break;
                    case "RMS":
                        output["rmsL"] = []
                        output["rmsR"] = []
                        break;
                    case "NDSI":
                        output["anthrophonyL"] = []
                        output["biophonyL"] = []
                        break;
                }

            series.results.forEach((result) => {
                let resultData
                let rangeData

                // Get the result
                resultData = JSON.parse(result[`${index.toLowerCase() + "_results"}`])

                // This series does not have data for the chosen index. Escape
                if (resultData == null) return

                // Get the range
                if (regex.test(result.file.name)) {
                    // This is really fragile, could break
                    let fileName = result.file.name.split("_")
                    let year = (fileName[1].slice(4, 6) + "/" + fileName[1].slice(6) + "/"+ fileName[1].slice(0, 4))
                    let time = ((fileName[2].split(".")[0].slice(0, 2) + ":" + fileName[2].split(".")[0].slice(2)).slice(0, 5))

                    rangeData = year + " - " + time
                } else {
                    // No date information. We will just assign each entry a number later
                    noDate = true;
                    rangeData = -1
                }

                // Push the result and range onto output
                Object.keys(output).forEach((key) => {
                    output[key].push({x: rangeData, y: resultData[key]})
                })
            })

            // Found at least one entry with no date
            if (noDate) {
                Object.keys(output).forEach((key) => {
                    output[key].forEach((val, index) => {
                        val.x = index+1
                    })
                })
            }

            // Sort based on result value (I dont know why this is here, but it was in the previous version)
            Object.keys(output).forEach((key) => {
                output[key].sort((a, b) => a.y > b.y)
            })

            return output
        },

        /*
        * UNSORTED
        */

        // for region visibility by adjusting color
        addRegionColor (passedRegion) {
            passedRegion.color = "rgba(117,224,1,0.3)";
        },

        // after delete button presson region will be removed
        deleteRegionCall: function (e) {
        if (this.regionToDelete != null)
            this.wavesurferRegionListOBJ[this.regionToDelete].remove()

        this.regionToDelete = null

        // console.log("Region has been successfully deleted");

        },

        setSpFilePath: function () {
            this.loading = true
            this.$refs.player.load()
            this.createSpectrogram()
        },

        onFileChange: function (e) {
            if (e.target.files[0] == null) return
            this.loading = true
            this.wavFile = e.target.files[0]
            // this.spFile = URL.createObjectURL(e.target.files[0])
            this.spFile = URL.createObjectURL(this.wavFile)
            //this.spFile = "file:" + this.firstFileData.file.path
            this.$refs.player.load()
            this.createSpectrogram()
            this.updateMetadata()
        },

        createSpectrogram() {
            this.wavesurfer.load(this.spFile)
        },

        slideView() {
            this.wavesurfer.zoom(Number(this.$refs.slider.value))
        },

        updateMetadata() {
            // This is the main metadata update function
            if (
                this.meta &&
                this.meta !== null &&
                this.meta !== "" &&
                this.meta !== 0 &&
                this.meta.length !== 0
            ) {
                const metadata = [
                    { name: "currDate", value: Date.now() },
                    { name: "file", value: this.spFile },
                    { name: "duration", value: this.duration },
                    { name: "name", value: this.name },
                ]
                metadata.push(getMetadataFromSeries())
            }
            const metadata = [
                { name: "currDate", value: Date.now() },
                { name: "file", value: this.spFile },
                { name: "metadataFile", value: this.meta },
                { name: "duration", value: this.duration },
                { name: "name", value: this.name },
            ]

            // Update metadataFields array
            this.metadataFields = metadata
        },

        lookupMetadataSource(item, fileMetadata, seriesMetadata) {
            //Check to ensure both file and series metadata exist
            if (fileMetadata == seriesMetadata && fileMetadata == null) {
                // No metadata exists
                return null
            } else if (fileMetadata == null && seriesMetadata !== null) {
                if (searchMetadata(seriesMetadata)) {
                return "series"
                }
            } else if (fileMetadata !== null && seriesMetadata == null) {
                if (searchMetadata(fileMetadata)) {
                return "file"
                }
            }

            if (searchMetadata(seriesMetadata)) {
                return "series"
            } else if (searchMetadata(fileMetadata)) {
                return "file"
            } else {
                return null
            }
        },

        searchMetadata(key, metadata) {
            return metadata == key
        },

        getMetadataSource(metadataFields, index) {
            itemToLookup = metadataFields[index]
        },

        updateSpectrogramTime() {
            this.currTime = this.$refs["player"].currentTime
            let timeDelta = Math.abs(this.currTime - this.wavesurfer.getCurrentTime())
            if (timeDelta > 0.1) {
                this.wavesurfer.seekTo(this.currTime / this.wavesurfer.getDuration())
            }
        },

        exportToCSV() {
            let csv = ""
            this.selections.series.results.forEach((row) => {
                csv += row.join(",")
                csv += "\n"
            })
            const anchor = document.createElement("a")
            anchor.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
            anchor.target = "_blank"
            anchor.download = "results.csv"
            anchor.click()
        },
    }
})
</script>
