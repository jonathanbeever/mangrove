<template>
    <app-layout title="Series">
        <template #header>
            <h2 class="font-semibold text-xxl text-gray-800 leading-tight dark:text-white">
                Series
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg dark:bg-slate-900 shadow-inner shadow-sky-200 dark:shadow-cyan-500">
                    <div
                        class="bg-white border-b border-gray-400 flex flex-row"
                    >
                        <fileUpload v-if="newUploads" :items="items" :meta="meta"/>
                    </div>
                    <PrimaryButton
                        v-if="newUploads == true && editPop == false"
                        :disabled="seriesName.length == 0 || items.length == 0 || importClicked"
                        class="ml-4 float-right border-tl p-4 m-4 border-gray-200"
                        v-on:click="postSiteSeries()"
                    >
                        Import Series
                    </PrimaryButton>
                    <TextInput
                        id="NameInput"
                        v-model="seriesName"
                        class="p-2 m-4 form-text-input leading-tight border-rounded-half border-b border-bg-slate-50"
                        placeholder="Name this Series"
                        style="color: #041014"
                        type="text"
                        :maxlength="50"
                    />

                </div>
            </div>
        </div>
    </app-layout>
</template>

<script>
import {defineComponent} from "vue";
import AppLayout from "@/Layouts/AppLayout.vue";
import Modal from "@/Pages/Partial/Modal.vue";
import PrimaryButton from "@/Components/PrimaryButton.vue";
import TextInput from "@/Components/TextInput.vue";
import Checkbox from "@/Components/Checkbox.vue";
import InputLabel from "@/Components/InputLabel.vue";
import FileUpload from "@/Components/FileUpload.vue";
import JobCreation from "@/Pages/Jobs/JobCreation.vue";
import {router} from '@inertiajs/vue3'

let newUploads = true;
let editPop = false;
let seriesName = "";

export default defineComponent({
    components: {
        AppLayout,
        PrimaryButton,
        TextInput,
        Checkbox,
        InputLabel,
        FileUpload,
        JobCreation,
        Modal,
    },
    props: ["siteName", "location", "newSite", "siteID"],

    computed: {
        filtered() {
            let se = [];
            if (this.search !== "") {
                se = this.items.filter(
                    (p) =>
                        p.job
                            .toLowerCase()
                            .includes(this.search.toLowerCase()) ||
                        p.name
                            .toLowerCase()
                            .includes(this.search.toLowerCase())
                );
            } else {
                se = this.items;
            }
            return se;
        }
    },
    data() {
        return {
            newUploads,
            somethingSelected: false,
            items: [],
            meta: [],
            search: "",
            editPop,
            seriesName,
            importClicked: false
        };
    },
    methods: {
        renderJobCreation: function () {
            this.removeAllSelected();
            this.newUploads = false;
        },
        edit: function () {
            this.editPop = !this.editPop;
        },
        pushEdits: function () {
            this.editPop = !this.editPop;

        },
        ConvertFilesForPost: function () {
            let files = [];
            this.items.forEach(x => files.push({name: x.name, path: x.path, size: x.size}))
            return files;
        },
        ConvertMetaForPost: function () {

            if (this.meta.length === 0) {

                return null
            }

            return {
                'name': this.meta[0].name,
                'path': this.meta[0].path,
                'size': this.meta[0].size,
            };
        },
        postSiteSeries: function () {
            this.importClicked = true
            let request = {};
            let siteLocation;

            if (this.location.length > 0) {
                siteLocation = this.location
            } else {
                siteLocation = null;
            }

            if (this.newSite) {
                request = {
                    location: siteLocation,
                    site: this.siteName,
                    series: this.seriesName,
                    files: this.ConvertFilesForPost(),
                    metadata: this.ConvertMetaForPost()
                }
            } else {
                request = {
                    location: siteLocation,
                    site_id: this.siteID,
                    series: this.seriesName,
                    files: this.ConvertFilesForPost(),
                    metadata: this.ConvertMetaForPost()
                }
            }
            console.log(request)
            router.post(route('import.save'), request)
        }
    },
});
</script>
