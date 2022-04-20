<template>
    <app-layout title="Results">
        <div class="absolute bottom-0 left-0 p-4 border-gray-200 invisible">
        <jet-button
            class="btn btn-success border-gray-200"
            @click="exportToCSV()"
        >Export To CSV
        </jet-button>
        </div>
        <div class="flex flex-col dark:text-black">
            <div class="py-4 flex flex-row flex-shrink">
                <div class="w-1/4 px-4">
                    <div class="bg-white shadow-xl sm:rounded-lg dark:shadow-inner dark:shadow-cyan-500 dark:bg-slate-900 dark:text-white" >
                        <div class="p-2">
                            2D Waveform Spectrogram
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
                                <div id="wave" class="p-2"/>
                                <vue-element-loading ref="animation" :active="loading" background-color="dark:rgba(0,0,0,.9);" size="100" spinner="bar-fade-scale"
                                                     v-bind:display="none"/>
                                <input id="slider" ref="slider" max="200" min="1" style="width: 100%" type="range" value="1" @input="slideView"/>
                            </div>
                        </div>
                    </div>

                    </div>
                <div class="flex flex-col grow pr-4">
                    <div
                        class="p-4 flex bg-white shadow-xl sm:rounded-lg flex grow justify-between self-center max-h-24 w-full dark:shadow-inner dark:shadow-cyan-500 dark:bg-slate-900 dark:text-white"
                    >
                        <div class="pr-2 float-left self-end">
                            <jet-button
                                v-if="evaluateSingleFile()"
                                class="btn btn-success border-gray-200"
                                @click="switchMode()"
                            >Single File Analysis
                            </jet-button
                            >
                            <jet-button
                                v-if="evaluateMultiFile()"
                                class="btn btn-success border-gray-200"
                                @click="switchModeSeries()"
                            >Multi File Analysis
                            </jet-button
                            >
                            <jet-button
                                v-if="evaluateSingleSeries()"
                                class="btn btn-success border-gray-200"
                                @click="switchModeMultiSeries()"
                            >Single Series Analysis
                            </jet-button
                            >
                            <jet-button
                                v-if="evaluateMultiSeries()"
                                class="btn btn-success border-gray-200"
                                @click="switchModeAllInSite()"
                            >Multi Series Analysis
                            </jet-button>
                            <jet-button
                                v-if="allInSite"
                                class="btn btn-success border-gray-200"
                                @click="switchModeBackToSingle()"
                            >All Series
                            </jet-button>
                        </div>

                        <div v-if="!allInSite" class="flex-row px-4">
                            Site:
                            <select
                                id="selectFile"
                                v-model="selectedSite"
                                class="flex grow dark:text-black rounded"
                                v-on:change="populateSeriesDropdown()"
                            >
                                <option v-for="ind in siteSelectionList" v-bind:value="ind">
                                    {{ ind }}
                                </option>
                            </select>
                        </div>

                        <div v-if="allInSite" class="flex-row px-4">
                            Site:
                            <select
                                id="selectFile"
                                v-model="selectedSite"
                                class="flex grow dark:text-black rounded"
                                v-on:change="populateAllIndicesDropdown()"
                            >
                                <option v-for="ind in siteSelectionList" v-bind:value="ind">
                                    {{ ind }}
                                </option>
                            </select>
                        </div>

                        <div v-if="!seriesComparison && !allInSite" class="flex-row px-4">
                            Series:
                            <select
                                id="selectFile"
                                v-model="selectedSeries"
                                class="flex grow dark:text-black rounded"
                                v-on:change="populateSingleFileDropdown()"
                            >
                                <option v-for="ind in seriesSelectionList" v-bind:value="ind">
                                    {{ ind }}
                                </option>
                            </select>
                        </div>

                        <div v-if="seriesComparison && !allInSite" class="flex-row px-4">
                            Series:
                            <select
                                id="selectFile"
                                v-model="selectedSeries"
                                class="flex grow dark:text-black rounded"
                                v-on:change="populateSeriesIndices()"
                            >
                                <option v-for="ind in seriesSelectionList" v-bind:value="ind">
                                    {{ ind }}
                                </option>
                            </select>
                        </div>

                        <div v-if="multiSeries" class="flex-row px-4">
                            Site 2:
                            <select
                                id="selectFile"
                                v-model="selectedSiteComparison"
                                class="flex grow dark:text-black rounded"
                                v-on:change="populateSecondSeriesDropdown()"
                            >
                                <option v-for="ind in siteSelectionList" v-bind:value="ind">
                                    {{ ind }}
                                </option>
                            </select>
                        </div>

                        <div v-if="multiSeries" class="flex-row px-4">
                            Series 2:
                            <select
                                id="selectFile"
                                v-model="selectedSeriesComparison"
                                class="flex grow dark:text-black rounded"
                                v-on:change="populateSeriesIndices()"
                            >
                                <option v-for="ind in secondSeriesSelectionList" v-bind:value="ind">
                                    {{ ind }}
                                </option>
                            </select>
                        </div>

                        <div v-if="!seriesComparison && !allInSite" class="flex-row pr-4">
                            Select File:
                            <select
                                id="File"
                                v-model="sFile"
                                class="flex grow dark:text-black rounded w-24"
                                v-on:change="populateIndicesDropdown()"
                            >
                                <option v-for="ind in singleFileSelectionList" v-bind:value="ind">
                                    {{ ind }}
                                </option>
                            </select>
                        </div>

                        <div v-if="evaluateMultiFile()" class="flex-row pr-4">
                            Select File:
                            <select
                                id="compareFile"
                                v-model="cFile"
                                class="flex dark:text-black rounded w-24"
                                v-on:change="populateComparisonFileData()"
                            >
                                <option v-for="ind in singleFileSelectionList" v-bind:value="ind">
                                    {{ ind }}
                                </option>
                            </select>
                        </div>

                        <div v-if="seriesComparison && !allInSite" class="flex-row pr-4">
                            Indices:
                            <select
                                id="selectSeries"
                                v-model="seriesIndex"
                                :disabled="(this.selectedSeries == '' && !multiSeries) || (this.selectedSeries == '' && this.selectedSeriesComparison == '' && multiSeries)"
                                class="flex grow dark:text-black rounded"
                                v-on:change="showGraphsSeries()"
                            >
                                <option
                                    v-for="ind in seriesIndices"
                                    v-bind:value="ind"
                                >
                                    {{ ind }}
                                </option>
                            </select>
                        </div>

                        <div v-if="!seriesComparison && !allInSite" class="flex-row pr-4">
                            Indices:
                            <select
                                id="selectSeries"
                                v-model="currentIndex"
                                :disabled="(sFile == '' || sFile == null) || ((cFile == '' || cFile == null) && !singleFile)"
                                class="flex grow dark:text-black rounded"
                                v-on:change="showGraphs()"
                            >
                                <option
                                    v-for="ind in indices"
                                    v-bind:value="ind"
                                >
                                    {{ ind }}
                                </option>
                            </select>
                        </div>
                        <div v-if="allInSite" class="flex-row pr-4">
                            Indices:
                            <select
                                id="selectSeries"
                                v-model="allIndex"
                                :disabled="(selectedSite == '')"
                                class="flex grow dark:text-black rounded"
                                v-on:change="showGraphAllInSite()"
                            >
                                <option
                                    v-for="ind in allIndices"
                                    v-bind:value="ind"
                                >
                                    {{ ind }}
                                </option>
                            </select>
                        </div>

                        <div v-if="!seriesComparison && !allInSite" class="flex-row pr-4">
                            Select Chart:
                            <select
                                id="chartSelect"
                                v-model="selectedChart"
                                :disabled="upGraphs == 'NDSI' || upGraphs == 'RMS' || (sFile == '' || sFile == null) || ((cFile == '' || cFile == null) && !singleFile) || this.currentIndex == ''"
                                class="flex grow dark:text-black rounded"
                            >
                                <option
                                    v-for="ind in chartSelection"
                                    v-bind:value="ind"
                                >
                                    {{ ind }}
                                </option>
                            </select>
                        </div>
                        <div class="absolute margin: auto; inset-x-0 bottom-10 text-slate-800" style="text-align: center; position: fixed; bottom: 0; z-index: 99 !important; display: none;">
                            <audio id="player" ref="player" class="player" controls style="width: 40%; display: inline-block;" v-bind:currentTime="currTime" volume="0.1" @pause="pause" @play="play" @seeked="updateSpectrogramTime">
                                <source v-bind:src="spFile">
                                Audio playback is not supported.
                            </audio>
                        </div>
                    </div>

                    <div
                        v-if="upGraphs != '' && (selectedChart != '' || (selectedChart == '' && (upGraphs == 'NDSI' || upGraphs == 'RMS'))) && singleFile == true"
                        class="flex-col flex bg-white shadow-xl sm:rounded-lg p-4 mt-4 w-full items-center"
                    >

                        <div v-if="upGraphs == 'ACI'" :key="upGraphs" class="w-4/5">
                            <SingleLine v-if="selectedChart == 'Single Line'" :id="sFile+'SL'+'ACI'" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :dataSetLabels="['label1']" :xBarLabels="[]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <DualLine v-if="selectedChart == 'Dual Line'" :id="sFile+'DL'+'ACI'" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :dataSetLabels="['label1', 'label2']" :xBarLabels="[]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <SingleBar v-if="selectedChart == 'Single Bar'" :id="sFile+'SB'+'ACI'" :dataSetData="[sFile, [2, 4, 5, 6]]" :dataSetLabels="['label1', 'label2']" :xBarLabels="[]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <SingleBar v-if="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'ACI'" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :dataSetLabels="['label1', 'label2']" :xBarLabels="[]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                        </div>

                        <div v-if="upGraphs == 'NDSI'" :key="upGraphs" class="w-4/5">
                            <SingleBar :id="sFile+'CB'+'NDSI'" :dataSetData="[[graphInput.biophonyL], [graphInput.anthrophonyL]]" :dataSetLabels="['', '']" :xBarLabels="['Biophony', 'Anthrophony']" :xLabel="'Biological VS Human Generated Sound'" :yLabel="'Computed Value'"/>
                        </div>

                        <div v-if="upGraphs == 'AEI'" :key="upGraphs" class="w-4/5">
                            <SingleLine v-if="selectedChart == 'Single Line'" :id="sFile+'SL'+'AEI'" :dataSetData="[graphInput.bandL]" :dataSetLabels="['L Band Values']" :xBarLabels="graphInput.bandRangeL" :xLabel="'Frequency Range'" :yLabel="'Aei Index Value'"/>
                            <DualLine v-if="selectedChart == 'Dual Line'" :id="sFile+'DL'+'AEI'" :dataSetData="[graphInput.bandL, graphInput.bandR]" :dataSetLabels="['L Band Values', 'R Band Values']" :xBarLabels="graphInput.bandRangeL" :xLabel="'Frequency Range'" :yLabel="'Aei Index Value'"/>
                            <SingleBar v-if="selectedChart == 'Single Bar'" :id="sFile+'SB'+'AEI'" :dataSetData="[graphInput.aeiL]" :dataSetLabels="[]" :xBarLabels="['L Band Aei']" :xLabel="'Frequency Band'" :yLabel="'Aei Index Computed Value'"/>
                            <SingleBar v-if="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'AEI'" :dataSetData="[[graphInput.aeiL], [graphInput.aeiR]]" :dataSetLabels="['', '']" :xBarLabels="['L Band Aei', 'R Band Aei']" :xLabel="'Frequency Band'" :yLabel="'Aei Computed Value'"/>
                        </div>

                        <div v-if="upGraphs == 'ADI'" :key="upGraphs" class="w-4/5">
                            <SingleLine v-if="selectedChart == 'Single Line'" :id="sFile+'SL'+'ADI'" :dataSetData="[graphInput.bandL]" :dataSetLabels="['L Band Values']" :xBarLabels="graphInput.bandRangeL" :xLabel="'Frequency Range'" :yLabel="'Adi Index Value'"/>
                            <DualLine v-if="selectedChart == 'Dual Line'" :id="sFile+'DL'+'ADI'" :dataSetData="[graphInput.bandL, graphInput.bandR]" :dataSetLabels="['L Band Values', 'R Band Values']" :xBarLabels="graphInput.bandRangeL" :xLabel="'Frequency Range'" :yLabel="'Adi Index Value'"/>
                            <SingleBar v-if="selectedChart == 'Single Bar'" :id="sFile+'SB'+'ADI'" :dataSetData="[graphInput.adiL]" :dataSetLabels="[]" :xBarLabels="['L Band Adi']" :xLabel="'Frequency Band'" :yLabel="'Adi Index Computed Value'"/>
                            <SingleBar v-if="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'ADI'" :dataSetData="[[graphInput.adiL], [graphInput.adiR]]" :dataSetLabels="['', '']" :xBarLabels="['L Band Adi', 'R Band Adi']" :xLabel="'Frequency Band'" :yLabel="'Adi Computed Value'"/>
                        </div>

                        <div v-if="upGraphs == 'BI'" :key="upGraphs" class="w-4/5">
                            <SingleLine v-if="selectedChart == 'Single Line'" :id="sFile+'SL'+'BIO'" :dataSetData="[graphInput.valsL]" :dataSetLabels="['L Band Values']" :xBarLabels="graphInput.freqVals" :xLabel="'Frequency'" :yLabel="'Bio Index Value'"/>
                            <DualLine v-if="selectedChart == 'Dual Line'" :id="sFile+'DL'+'BIO'" :dataSetData="[graphInput.valsL, graphInput.valsR]" :dataSetLabels="['L Band Values', 'R Band Values']" :xBarLabels="graphInput.freqVals" :xLabel="'Frequency Range'" :yLabel="'Bio Index Value'"/>
                            <SingleBar v-if="selectedChart == 'Single Bar'" :id="sFile+'SB'+'BIO'" :dataSetData="[graphInput.areaL]" :dataSetLabels="[]" :xBarLabels="['L Band Bio']" :xLabel="'Frequency Band'" :yLabel="'Bio Index Computed Value'"/>
                            <SingleBar v-if="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'BIO'" :dataSetData="[[graphInput.areaL], [graphInput.areaR]]" :dataSetLabels="['', '']" :xBarLabels="['L Band Bio', 'R Band Bio']" :xLabel="'Frequency Band'" :yLabel="'Bio Computed Value'"/>
                            <SingleLine v-if="selectedChart == 'Frequency Over Time'" :id="sFile+'SLOT'+'BIO'" :dataSetData="[graphInput.freqVals]" :dataSetLabels="['Frequency']" :xBarLabels="graphInput.range" :xLabel="'Time (Minutes)'" :yLabel="'Frequency (Hz)'"/>
                        </div>

                        <div v-if="upGraphs == 'RMS'" :key="upGraphs" class="w-4/5">
                            <SingleBar :id="sFile+'CB'+'RMS'" :dataSetData="[[graphInput.rmsL], [graphInput.rmsR]]" :dataSetLabels="['', '']" :xBarLabels="['Band L RMS', 'Band R RMS']" :xLabel="'Root Mean Square L Band and R Band'" :yLabel="'Root Mean Square'"/>
                        </div>
                    </div>
                    <div
                        v-if="upGraphs != '' && (selectedChart != '' || (selectedChart == '' && (upGraphs == 'NDSI' || upGraphs == 'RMS'))) && singleFile == false && cFile != null && cFile != ''"
                        class="flex-col flex bg-white shadow-xl sm:rounded-lg p-4 mt-4 w-full items-center"
                    >
                        <div v-if="upGraphs == 'ACI'" :key="upGraphs" class="w-4/5">
                            <DualLine v-if="selectedChart == 'Dual Line'" :id="sFile+'DL'+'ACI'+cFile" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :dataSetLabels="['label1', 'label2']" :xBarLabels="[]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <CompareBar v-if="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'ACI'+cFile" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :dataSetLabels="['label1', 'label2']" :xBarLabels="[]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                        </div>

                        <div v-if="upGraphs == 'NDSI'" :key="upGraphs" class="w-4/5">
                            <CompareBar :id="sFile+'CB'+'NDSI'+cFile" :dataSetData="[[graphInput.biophonyL, graphInputC.biophonyL], [graphInput.anthrophonyL, graphInputC.anthrophonyL]]" :dataSetLabels="['Biophony', 'Anthrophony']" :xBarLabels="[sFile, cFile]"
                                        :xLabel="'Biological VS Human Generated Sound'" :yLabel="'Computed Value'"/>
                        </div>

                        <div v-if="upGraphs == 'AEI'" :key="upGraphs" class="w-4/5">
                            <DualLine v-if="selectedChart == 'Dual Line'" :id="sFile+'DL'+'AEI'+cFile" :dataSetData="[graphInput.bandL, graphInputC.bandL]" :dataSetLabels="[sFile, cFile]" :xBarLabels="graphInput.bandRangeL" :xLabel="'Frequency Range'" :yLabel="'Aei Index Value'"/>
                            <CompareBar v-if="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'AEI'+cFile" :dataSetData="[[graphInput.aeiL, graphInputC.aeiL], [graphInput.aeiR, graphInputC.aeiR]]" :dataSetLabels="['L Band Aei', 'R Band Aei']" :xBarLabels="[sFile, cFile]" :xLabel="'Frequency Band'"
                                        :yLabel="'Aei Computed Value'"/>
                        </div>

                        <div v-if="upGraphs == 'ADI'" :key="upGraphs" class="w-4/5">
                            <DualLine v-if="selectedChart == 'Dual Line'" :id="sFile+'DL'+'ADI'+cFile" :dataSetData="[graphInput.bandL, graphInputC.bandL]" :dataSetLabels="[sFile, cFile]" :xBarLabels="graphInput.bandRangeL" :xLabel="'Frequency Range'" :yLabel="'Adi Index Value'"/>
                            <CompareBar v-if="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'ADI'+cFile" :dataSetData="[[graphInput.adiL, graphInputC.adiL], [graphInputC.adiR, graphInputC.adiR]]" :dataSetLabels="['L Band Adi', 'R Band Adi']" :xBarLabels="[sFile, cFile]" :xLabel="'Frequency Band'"
                                        :yLabel="'Adi Computed Value'"/>
                        </div>

                        <div v-if="upGraphs == 'BI'" :key="upGraphs" class="w-4/5">
                            <DualLine v-if="selectedChart == 'Dual Line'" :id="sFile+'DL'+'BIO'+cFile" :dataSetData="[graphInput.valsL, graphInputC.valsL]" :dataSetLabels="[sFile, cFile]" :xBarLabels="graphInput.freqVals" :xLabel="'Frequency Range'" :yLabel="'Bio Index Value'"/>
                            <CompareBar v-if="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'BIO'+cFile" :dataSetData="[[graphInput.areaL, graphInputC.areaL], [graphInput.areaR, graphInputC.areaR]]" :dataSetLabels="['L Band Bio', 'R Band Bio']" :xBarLabels="[sFile, cFile]"
                                        :xLabel="'Frequency Band'" :yLabel="'Bio Computed Value'"/>
                        </div>

                        <div v-if="upGraphs == 'RMS'" :key="upGraphs" class="w-4/5">
                            <CompareBar :id="sFile+'CB'+'RMS'" :dataSetData="[[graphInput.rmsL, graphInputC.rmsL], [graphInput.rmsR, graphInputC.rmsR]]" :dataSetLabels="['L Band Rms', 'R Band Rms']" :xBarLabels="[sFile, cFile]" :xLabel="'Root Mean Square L Band and R Band'"
                                        :yLabel="'Root Mean Square'"/>
                        </div>
                    </div>
                    <div
                        v-if="seriesIndex != '' && seriesComparison == true && multiSeries == false"
                        class="flex-col flex bg-white shadow-xl sm:rounded-lg p-4 mt-4 w-full items-center"
                    >
                        <div v-if="seriesIndex == 'NDSI'" :key="seriesIndex" class="w-4/5">
                            <DualLinexy :id="selectedSeries+'DL'+'AEI'+selectedSeriesTwo" :dataSetData="[seriesGraphInput.anthrophonyL, seriesGraphInput.biophonyL]" :dataSetLabels="['Anthrophony', 'biophony']" :xLabel="'Date'" :yLabel="'NDSI'"/>
                        </div>

                        <div v-if="seriesIndex == 'AEI'" :key="seriesIndex" class="w-4/5">
                            <DualLinexy :id="selectedSeries+'DL'+'AEI'+selectedSeriesTwo" :dataSetData="[seriesGraphInput.aeiL, seriesGraphInput.aeiR]" :dataSetLabels="['AEI L', 'AEI R']" :xLabel="'Date'" :yLabel="'Aei Index Value'"/>
                        </div>

                        <div v-if="seriesIndex == 'ADI'" :key="seriesIndex" class="w-4/5">
                            <DualLinexy :id="selectedSeries+'DL'+'ADI'+selectedSeriesTwo" :dataSetData="[seriesGraphInput.adiL, seriesGraphInput.adiR]" :dataSetLabels="['ADI L', 'ADI R']" :xLabel="'Date'" :yLabel="'Adi Index Value'"/>

                        </div>

                        <div v-if="seriesIndex == 'BI'" :key="seriesIndex" class="w-4/5">
                            <DualLinexy :id="selectedSeries+'DL'+'BIO'+selectedSeriesTwo" :dataSetData="[seriesGraphInput.areaL, seriesGraphInput.areaR]" :dataSetLabels="['BI L', 'BI R']" :xLabel="'Date'" :yLabel="'Bio Index Value'"/>

                        </div>

                        <div v-if="seriesIndex == 'RMS'" :key="seriesIndex" class="w-4/5">
                            <DualLinexy :id="selectedSeries+'DL'+'AEI'+selectedSeriesTwo" :dataSetData="[seriesGraphInput.rmsL, seriesGraphInput.rmsR]" :dataSetLabels="['RMS L', 'RMS R']" :xLabel="'Date'" :yLabel="'rms Index Value'"/>
                        </div>
                    </div>
                    <div
                        v-if="seriesIndex != '' && seriesComparison == true && multiSeries == true"
                        class="flex-col flex bg-white shadow-xl sm:rounded-lg p-4 mt-4 w-full items-center"
                    >
                        <div v-if="seriesIndex == 'NDSI'" :key="seriesIndex" class="w-4/5">
                            <QuadLine :id="selectedSeries+'DL'+'AEI'+selectedSeriesTwo" :dataSetData="[seriesGraphInput.anthrophonyL, seriesGraphInput.biophonyL, seriesGraphInputC.anthrophonyL, seriesGraphInputC.biophonyL]" :dataSetLabels="['Series 1 Anthro', 'Series 1 Bio', 'Series 2 Anthro', 'Series 2 Bio']"
                                    :xLabel="'Date'" :yLabel="'NDSI'"/>
                        </div>

                        <div v-if="seriesIndex == 'AEI'" :key="seriesIndex" class="w-4/5">
                            <QuadLine :id="selectedSeries+'DL'+'AEI'+selectedSeriesTwo" :dataSetData="[seriesGraphInput.aeiL, seriesGraphInput.aeiR, seriesGraphInputC.aeiL, seriesGraphInputC.aeiR]" :dataSetLabels="['Series 1 AEI L', 'Series 1 AEI R', 'Series 2 AEI L', 'Series 2 AEI R']"
                                    :xLabel="'Date'" :yLabel="'Aei Index Value'"/>
                        </div>

                        <div v-if="seriesIndex == 'ADI'" :key="seriesIndex" class="w-4/5">
                            <QuadLine :id="selectedSeries+'DL'+'ADI'+selectedSeriesTwo" :dataSetData="[seriesGraphInput.adiL, seriesGraphInput.adiR, seriesGraphInputC.adiL, seriesGraphInputC.adiR]" :dataSetLabels="['Series 1 ADI L', 'Series 1 ADI R', 'Series 2 ADI L', 'Series 2 ADI R']"
                                    :xLabel="'Date'" :yLabel="'Adi Index Value'"/>

                        </div>

                        <div v-if="seriesIndex == 'BI'" :key="seriesIndex" class="w-4/5">
                            <QuadLine :id="selectedSeries+'DL'+'BIO'+selectedSeriesTwo" :dataSetData="[seriesGraphInput.areaL, seriesGraphInput.areaR, seriesGraphInputC.areaL, seriesGraphInputC.areaR]" :dataSetLabels="['Series 1 BI L', 'Series 1 BI R', 'Series 2 BI L', 'Series 2 BI R']"
                                    :xLabel="'Date'" :yLabel="'Bio Index Value'"/>

                        </div>

                        <div v-if="seriesIndex == 'RMS'" :key="seriesIndex" class="w-4/5">
                            <QuadLine :id="selectedSeries+'DL'+'AEI'+selectedSeriesTwo" :dataSetData="[seriesGraphInput.rmsL, seriesGraphInput.rmsR, seriesGraphInputC.rmsL, seriesGraphInputC.rmsR]" :dataSetLabels="['Series 1 RMS L', 'Series 1 RMS R', 'Series 2 RMS L', 'Series 2 RMS R']"
                                    :xLabel="'Date'" :yLabel="'rms Index Value'"/>
                        </div>
                    </div>
                    <div
                        v-if="allInSite && selectedSite != '' && allIndex != ''"
                        class="flex-col flex bg-white shadow-xl sm:rounded-lg p-4 mt-4 w-full items-center"
                    >
                        <div :key="allIndex" class="w-4/5">
                            <AllInSiteChart :id="selectedSite+allIndex+'AllInSite'" :dataSetData="allInSiteData" :dataSetLabels="seriesSelectionList"
                                    :xLabel="'Date'" :yLabel="allIndex"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </app-layout>
</template>

<script>
import {defineComponent} from "vue";
import AppLayout from "@/Layouts/AppLayout.vue";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/src/plugin/regions";
import SpectrogramPlugin from "wavesurfer.js/src/plugin/spectrogram";
import VueElementLoading from "vue-element-loading";
import JetButton from "@/Jetstream/Button.vue";
import VisualizationsDemo from "@/Pages/ChartVisualizations/VisualizationsDemo.vue";
import CompareBar from '@/Pages/ChartVisualizations/CompareBar.vue';
import DualLine from '@/Pages/ChartVisualizations/DualLine.vue';
import DualLinexy from '@/Pages/ChartVisualizations/DualLinexy.vue';
import SingleBar from '@/Pages/ChartVisualizations/SingleBar.vue';
import SingleLine from '@/Pages/ChartVisualizations/SingleLine.vue';
import AllInSiteChart from '@/Pages/ChartVisualizations/AllInSiteChart.vue';
import QuadLine from '@/Pages/ChartVisualizations/QuadLine.vue'
import {usePage} from '@inertiajs/inertia-vue3'

let compareIndex = "";
let graphInput, graphInputC;

export default defineComponent({
    components: {
        AppLayout,
        JetButton,
        WaveSurfer,
        VisualizationsDemo,
        CompareBar,
        DualLine,
        SingleBar,
        SingleLine,
        VueElementLoading,
        QuadLine,
        DualLinexy,
        AllInSiteChart
    },
    data() {
        return {
            spFile: "",
            sFile: "",
            cFile: "",
            startDate: "",
            endDate: "",
            selectRecordings: [],
            singleFile: true,
            indices: ["ACI", "NDSI", "AEI", "ADI", "BI", "RMS"],
            chartSelection: ["Single Line", "Single Bar", "Dual Line", "Compare Bar"],
            selectedChart: '',
            currentIndex: '',
            compareIndex,
            upGraphs: '',
            graphInput,
            graphInputC,
            items: [],
            siteSelectionList: [],
            currTime: 0.0,
            loading: false,
            sites: [],
            seriesSelectionList: [],
            site: {},
            selectedSite: '',
            singleFileSelectionList: [],
            selectedSeries: '',
            series: {},
            firstFileData: {},
            secondFileData: {},
            seriesComparison: false,
            multiSeries: false,
            secondSeriesSelectionList: [],
            selectedSiteComparison: '',
            secondSite: {},
            seriesIndex: '',
            seriesGraphInput: {},
            seriesGraphInputC: {},
            selectedSeriesComparison: '',
            selectedSeriesOne: {},
            selectedSeriesTwo: {},
            seriesIndices: [],
            seriesGraphRange: [],
            allInSite: false,
            allIndex: '',
            allInSiteData: [],
            allIndices: [],
        };
    },
    methods: {
        setSpFilePath: function () {
            this.loading = true;
            this.$refs.player.load();
            this.createSpectrogram();
        },

        onFileChange: function (e) {
            this.loading = true;
            this.spFile = URL.createObjectURL(e.target.files[0]);
            //this.spFile = "file:" + this.firstFileData.file.path;
            //console.log(this.spFile);
            this.$refs.player.load();
            this.createSpectrogram();
        },

        createSpectrogram() {
            this.wavesurfer.load(this.spFile);
        },


        showGraphs: function () {
            this.upGraphs = this.currentIndex
            this.graphInput = JSON.parse(this.firstFileData[`${this.currentIndex.toLowerCase() + '_results'}`])

            if (this.singleFile == false) {
                this.graphInputC = JSON.parse(this.secondFileData[`${this.currentIndex.toLowerCase() + '_results'}`])
                this.chartSelection = ["Dual Line", "Compare Bar"]

                if (this.selectedChart) {
                    this.selectedChart = 'Dual Line'
                }
            } else {
                if (this.selectedChart) {
                    this.selectedChart = 'Single Line'
                }

                if (this.upGraphs == 'BI') {
                    this.chartSelection = ["Single Line", "Single Bar", "Dual Line", "Compare Bar", "Frequency Over Time"]

                    let end = this.graphInput.freqVals.length;
                    let range = Array(end - 0 + 1).fill().map((_, idx) => 0 + idx);
                    this.graphInput = {...this.graphInput, range: range}
                } else {
                    this.chartSelection = ["Single Line", "Single Bar", "Dual Line", "Compare Bar"]
                }
            }
        },
        buildIndicesData: function (item, index) {
            const prettyUpYear = (item) => {
                let prettyYear = item
                return prettyYear.slice(4, 6) + '/' + prettyYear.slice(6) + '/' + prettyYear.slice(0, 4)
            }
            const prettyUpTime = (item) => {
                let prettyTime = item
                prettyTime = prettyTime.slice(0, 2) + ':' + prettyTime.slice(2)
                return prettyTime.slice(0, 5)
            }

            let resultsOne = []
            let range = []
            let data = {}
            let seriesIndex = index
            item.results.forEach(x => {
                resultsOne.push(JSON.parse(x[`${seriesIndex.toLowerCase() + '_results'}`]))

                let fileName = x.file.name.split('_')
                range.push(prettyUpYear(fileName[1]) + ' - ' + prettyUpTime(fileName[2].split('.')[0]))
            })


            if (seriesIndex == 'ADI') {
                let array = []
                resultsOne.forEach(x => {
                    array.push(x.adiL)
                })
                data['adiL'] = array

                let array2 = []
                resultsOne.forEach(x => {
                    array2.push(x.adiR)
                })
                data['adiR'] = array2
            }
            if (seriesIndex == 'AEI') {
                let array = []
                resultsOne.forEach(x => {
                    array.push(x.aeiL)
                })
                data['aeiL'] = array

                let array2 = []
                resultsOne.forEach(x => {
                    array2.push(x.aeiR)
                })
                data['aeiR'] = array2
            }
            if (seriesIndex == 'BI') {
                let array = []
                resultsOne.forEach(x => {
                    array.push(x.areaL)
                })
                data['areaL'] = array

                let array2 = []
                resultsOne.forEach(x => {
                    array2.push(x.areaR)
                })
                data['areaR'] = array2
            }
            if (seriesIndex == 'RMS') {
                let array = []
                resultsOne.forEach(x => {
                    array.push(x.rmsL)
                })
                data['rmsL'] = array

                let array2 = []
                resultsOne.forEach(x => {
                    array2.push(x.rmsR)
                })
                data['rmsR'] = array2
            }
            if (seriesIndex == 'NDSI') {
                let array = []
                resultsOne.forEach(x => {
                    array.push(x.anthrophonyL)
                })
                data['anthrophonyL'] = array

                let array2 = []
                resultsOne.forEach(x => {
                    array2.push(x.biophonyL)
                })
                data['biophonyL'] = array2
            }

            let output = {}

            Object.keys(data).forEach(x => {
                output[x] = []
                data[x].forEach(y => {
                    output[x].push({ x: range[data[x].indexOf(y)], y: y})
                })
                output[x].sort((a, b) => a.y > b.y)
            })

            return output
        },
        showGraphsSeries: function () {
            this.seriesGraphInput = this.buildIndicesData(this.selectedSeriesOne, this.seriesIndex)

            if (this.multiSeries) {
                this.seriesGraphInputC = this.buildIndicesData(this.selectedSeriesTwo, this.seriesIndex)
            }
        },
        showGraphAllInSite: function () {
            let allSeries = this.site.series
            let data = []

            allSeries.forEach(x => {
                data.push(this.buildIndicesData(x, this.allIndex))
            })

            this.allInSiteData = data
        },
        switchMode: function () {
            this.currentIndex = ''
            this.upGraphs = ''
            this.selectedChart = ''
            this.singleFile = false
        },
        switchModeSeries: function () {
            this.upGraphs = ''
            this.sFile = ''
            this.cFile = ''
            this.selectedSeries = ''
            this.seriesComparison = true
        },
        switchModeMultiSeries: function () {
            this.seriesIndex = ''
            this.multiSeries = true
        },
        switchModeAllInSite: function () {
            this.selectedSite = ''
            this.selectedSeries = ''
            this.seriesComparison = false
            this.multiSeries = false
            this.allInSite = true
        },
        switchModeBackToSingle: function () {
            this.allIndex = ''
            this.currentIndex = ''
            this.selectedSeries = ''
            this.selectedChart = ''
            this.upGraphs = ''
            this.seriesIndex = ''
            this.selectedSeriesComparison = ''
            this.selectedSiteComparison = ''
            this.selectedChart = ''
            this.selectedSite = ''
            this.allInSite = false
            this.singleFile = true
        },
        evaluateSingleFile: function () {
            if (this.singleFile && !this.allInSite)
                return true
            return false
        },
        evaluateMultiFile: function () {
            if (!this.singleFile && !this.seriesComparison && !this.allInSite)
                return true
            return false
        },
        evaluateSingleSeries: function () {
            if (!this.singleFile && this.seriesComparison && !this.multiSeries)
                return true
            return false
        },
        evaluateMultiSeries: function () {
            if (!this.singleFile && this.seriesComparison && this.multiSeries)
                return true
            return false
        },
        populateSiteDropdown: function () {
            let siteList = []
            this.sites.forEach(x => {
                if (x.series != [])
                    siteList.push(x.name)
            })
            this.siteSelectionList = siteList;
        },

        populateSeriesDropdown: function () {
            this.selectedSeries = ''
            this.currentIndex = ''
            this.seriesIndex = ''
            this.upGraphs = ''
            this.selectedChart = ''
            let seriesList = []
            this.site = this.sites.find(x => x.name == this.selectedSite)

            this.site.series.forEach(x => {
                if (x.results != [])
                    seriesList.push(x.name)
            })
            this.seriesSelectionList = seriesList;
        },
        populateSecondSeriesDropdown: function () {
            this.selectedSeriesComparison = ''
            this.currentIndex = ''
            this.seriesIndex = ''
            this.upGraphs = ''
            this.selectedChart = ''
            let seriesList = []
            this.secondSite = this.sites.find(x => x.name == this.selectedSiteComparison)

            this.secondSite.series.forEach(x => {
                if (x.results != [])
                    seriesList.push(x.name)
            })
            this.secondSeriesSelectionList = seriesList;
        },
        populateSingleFileDropdown: function () {
            this.currentIndex = ''
            this.upGraphs = ''
            this.selectedChart = ''
            let fileList = []
            this.series = this.site.series.find(x => x.name == this.selectedSeries)
            this.series.results.forEach(x => fileList.push(x.file.name))
            this.singleFileSelectionList = fileList
        },
        populateComparisonFileData: function () {
            this.currentIndex = ''
            this.upGraphs = ''
            this.selectedChart = ''
            this.secondFileData = {}
            this.series.results.forEach(x => {
                if (x.file.name == this.cFile)
                    this.secondFileData = x
            })
        },
        findIndicesUsed: function (object) {
            let indicesUsed = []
            Object.keys(object).map(key => {
                if (key.includes('aci') && object[key] != null && !indicesUsed.includes('ACI')) {
                    indicesUsed.push('ACI')
                }
                if (key.includes('adi') && object[key] != null && !indicesUsed.includes('ADI')) {
                    indicesUsed.push('ADI')
                }
                if (key.includes('aei') && object[key] != null && !indicesUsed.includes('AEI')) {
                    indicesUsed.push('AEI')
                }
                if (key.includes('bi') && object[key] != null && !indicesUsed.includes('BI')) {
                    indicesUsed.push('BI')
                }
                if (key.includes('ndsi') && object[key] != null && !indicesUsed.includes('NDSI')) {
                    indicesUsed.push('NDSI')
                }
                if (key.includes('rms') && object[key] != null && !indicesUsed.includes('RMS')) {
                    indicesUsed.push('RMS')
                }
            })
            return indicesUsed
        },
        populateIndicesDropdown: function () {
            this.currentIndex = '',
            this.upGraphs = '',
            this.selectedChart = ''

            this.firstFileData = {}
            this.series.results.forEach(x => {
                if (x.file.name == this.sFile)
                    this.firstFileData = x
            })

            this.indices = this.findIndicesUsed(this.firstFileData)
            //this.onFileChange();
        },
        populateAllIndicesDropdown: function () {
            this.allIndex = ''

            this.site = this.sites.find(x => x.name == this.selectedSite)

            let data = this.site.series[0].results[0]
            let seriesList = []

            this.allIndices = this.findIndicesUsed(data)

            this.site.series.forEach(x => {
                if (x.results != [])
                    seriesList.push(x.name)
            })
            this.seriesSelectionList = seriesList;
        },
        populateSeriesIndices: function () {
            this.seriesIndex = ''

            if (this.selectedSeries != '') {
                this.selectedSeriesOne = this.site.series.find(x => x.name == this.selectedSeries)
            }
            if (this.selectedSeriesComparison != '') {
                this.selectedSeriesTwo = this.secondSite.series.find(x => x.name == this.selectedSeriesComparison)
            }

            if (this.selectedSeries != '' && this.selectedSeriesComparison != '') {
                let firstIndicesSet = this.findIndicesUsed(this.selectedSeriesOne.results[0])
                let secondIndicesSet = this.findIndicesUsed(this.selectedSeriesTwo.results[0])
                let indicesSet = []
                firstIndicesSet.forEach(x => {
                    if (secondIndicesSet.includes(x)) {
                        indicesSet.push(x)
                    }
                })

                this.seriesIndices = indicesSet
            } else if (this.selectedSeries != '' && this.seriesComparison && !this.multiSeries) {
                let firstIndicesSet = this.findIndicesUsed(this.selectedSeriesOne.results[0])

                this.seriesIndices = firstIndicesSet
            }
        },

        updateSpectrogramTime: function () {
            this.currTime = this.$refs['player'].currentTime;
            var timeDelta = Math.abs(this.currTime - this.wavesurfer.getCurrentTime());
            if (timeDelta > 0.1) {
                this.wavesurfer.seekTo(this.currTime / this.wavesurfer.getDuration());
            }
        },

        slideView: function () {
            this.wavesurfer.zoom(Number(this.$refs.slider.value));
        },
          exportToCSV: function () {
            let csv = "";
            this.series.results.forEach((row) => {
                csv += row.join(',');
                csv += "\n";
            });
            const anchor = document.createElement('a');
            anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
            anchor.target = '_blank';
            anchor.download = 'results.csv';
            anchor.click();

        },
    },
    mounted() {
        const self = this;

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
                    regions: [
                        {
                            start: 1,
                            end: 3,
                            loop: false,
                            color: 'hsla(400, 100%, 30%, 0.5)'
                        },
                    ],
                    dragSelection: {
                        slop: 5
                    }
                })
            ],
        });
        this.wavesurfer.on('waveform-ready', function () {
            //self.$refs['animation'].active = false;
            self.$refs['animation'].display = "none";
            self.$refs['animation'].show = false;
            self.loading = false;
        });
        this.wavesurfer.on('seek', function () {
            self.currTime = self.wavesurfer.getCurrentTime();
            var timeDelta = Math.abs(self.currTime - self.wavesurfer.getCurrentTime());
            if (timeDelta > 0.1) {
                self.wavesurfer.seekTo(self.currTime / self.wavesurfer.getDuration());
            }
        });

        this.sites = usePage().props.value.sites
        this.populateSiteDropdown()
    }
    ,
})

</script>
