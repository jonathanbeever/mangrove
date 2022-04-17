<template>
    <app-layout title="Series">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight dark:text-white">
                Series
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg dark:bg-slate-800 ">
                    <JobCreation
                        v-if="goToJobCreation"
                        @goToFileSelection="onBackJobCreation()"
                    />
                    <div
                        class="bg-white border-b border-gray-200 flex flex-row"
                    >
                        <fileUpload :items="items" :meta="meta"/>
                    </div>
                    <jet-button
                        v-if="newUploads == true && goToJobCreation == false && editPop == false"
                        v-on:click="renderJobCreation"
                        class="ml-4 float-right border-tl p-4 m-4 border-gray-200"
                        :disabled="seriesName.length == 0"
                    >
                        Start New Jobs
                    </jet-button>
                    <input
                class="m-4 flex form-text-input border-none leading-tight rounded"
                type="text"
                v-model="seriesName"
                id="NameInput"
                placeholder="Name this Series"
                style="color: #041014"
            />

                </div>
            </div>
        </div>
    </app-layout>
</template>

<script>
import { defineComponent } from "vue";
import AppLayout from "@/Layouts/AppLayout.vue";
import Modal from "@/Pages/Partial/Modal.vue";
import JetButton from "@/Jetstream/Button.vue";
import JetInput from "@/Jetstream/Input.vue";
import JetCheckbox from "@/Jetstream/Checkbox.vue";
import JetLabel from "@/Jetstream/Label.vue";
import JetValidationErrors from "@/Jetstream/ValidationErrors.vue";
import FileUpload from "@/Components/FileUpload.vue";
import JobCreation from "@/Pages/Jobs/JobCreation.vue";

let goToJobCreation = false;
let newUploads = true;
let editPop = false;
let selected = [];
let somethingSelected = false;
let seriesName = "";

export default defineComponent({
    components: {
        AppLayout,
        JetButton,
        JetInput,
        JetCheckbox,
        JetLabel,
        FileUpload,
        JobCreation,
        Modal,
    },
    props: ["siteName", "location"],

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
            goToJobCreation,
            somethingSelected: false,
            items: [],
            meta: [],
            search: "",
            editPop,
            selected,
            seriesName

        };
    },
    methods: {
        onBackJobCreation: function () {
            this.goToJobCreation = false;
            this.newUploads = true;
            this.selected = []
            this.somethingSelected = false
        },
        removeAllSelected: function () {
            this.items.forEach(x => x.selected = false)
        },
        renderJobCreation: function () {
            this.removeAllSelected()
            this.goToJobCreation = true;
            this.newUploads = false;
        },
        edit: function () {
            this.editPop = !this.editPop;
        },
        pushEdits: function () {
            this.editPop = !this.editPop;

        },
        anySelected: function () {
            let e = this.items.filter((p) => p.selected == true);
            if (e.length > 0) {
                this.selected = e;
                this.somethingSelected = true;
                return false;
            } else {
                this.somethingSelected = false;
                return true;
            }
        }
    },
});
</script>
