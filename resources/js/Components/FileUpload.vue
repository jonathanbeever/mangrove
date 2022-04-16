<template>

    <div class="flex flex-col grow dark:bg-slate-800">
        <div class="border-b border-gray-200 p-4 mb-2">
            <h2
                class="font-semibold text-xl text-gray-800 leading-tight dark:text-white"
            >
                Series Selection
            </h2>
        </div>

        <div class="grow p-2 overflow-y-auto overflow-x-hidden max-h-96">
            <div class="align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div
                    class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
                >
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-neutral-900 uppercase tracking-wider"
                                >
                                    Name
                                </th>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-right text-xs font-medium text-neutral-900 uppercase tracking-wider"
                                >
                                    Size
                                </th>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-center text-xs font-medium text-neutral-900 uppercase tracking-wider"
                                >
                                    Recording Date
                                </th>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-right text-xs font-medium text-neutral-900 uppercase tracking-wider"
                                >
                                    File Type
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="(item, index) in filtered" :key="index">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-start">
                                        <div>
                                            <!--input
                                                    type="text"
                                                    v-model="item.job"
                                                    v-if="edit == true"
                                                    v-on:blur="
                                                        edit = !edit;
                                                        $emit('update');
                                                    "
                                                /-->
                                            <div
                                                class="text-sm font-medium text-gray-900"
                                                @click="edit = !edit"
                                                v-if="item.job != ''"
                                            >
                                                {{
                                                    (item.job =
                                                        item.name.split(".")[0])
                                                }}
                                            </div>
                                            <div
                                                class="text-sm font-medium text-gray-900 hover:text-violet-600"
                                                @click="item.edit = !item.edit"
                                                v-else
                                            >
                                                empty
                                            </div>
                                            <div class="text-sm text-neutral-900">
                                                {{ item.name }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-right"
                                >
                                    <div>
                                        <div
                                            class="text-sm font-medium text-gray-900"
                                            v-if="item.size != ''"
                                        >
                                            {{ item.size / 1e6 + "MB" }}
                                        </div>
                                        <div
                                            class="text-sm font-medium text-gray-900"
                                            v-else
                                        >
                                            undefined
                                        </div>
                                    </div>
                                </td>
                                <td
                                    class="py-4 whitespace-nowrap text-center text-sm text-neutral-900"
                                >
                                    <div
                                        class="text-sm font-medium text-gray-900"
                                        v-if="item.date != ''"
                                    >
                                        {{ new Date(item.lastModified) }}
                                    </div>
                                    <div
                                        class="text-sm font-medium text-gray-900"
                                        v-else
                                    >
                                        Today
                                    </div>
                                </td>
                                <td
                                    class="py-4 px-6 whitespace-nowrap text-right text-sm font-medium"
                                >
                                    <div
                                        class="text-sm font-medium text-gray-900"
                                        v-if="item.type != ''"
                                    >
                                        {{ item.type }}
                                    </div>
                                    <div
                                        class="text-sm font-medium text-gray-900"
                                        v-else
                                    >
                                        unknown
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="p-12 flex flex-row justify-between">
            <!--Folder file submission-->
            <form @submit.prevent="formSubmit" enctype="multipart/form-data">
                <strong class="flex pt-4">Select New Folders:</strong>
                <input
                    type="file"
                    class="form-control"
                    v-on:change="onFileChange"
                    multiple
                    webkitdirectory
                    directory
                />
            </form>
            <!--Meta-Data file submission-->
            <form
                @submit.prevent="formSubmit"
                enctype="multipart/form-data"
                class=""
                accept=".txt, .csv"
            >
                <strong class="flex pt-4">Upload Meta-Data:</strong>
                <input
                    type="file"
                    class="form-control"
                    v-on:change="onMetaChange($event)"
                />
            </form>

        </div>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import JetButton from "@/Jetstream/Button.vue";
import JetInput from "@/Jetstream/Input.vue";

let fileMeta = [];

export default defineComponent({
    components: {
        JetButton,
        JetInput,
    },

    props: ["items", "meta"],

    mounted() {
    },

    data() {
        return {
            edit: false,
            search: "",
        };
    },

    computed: {
        filtered() {
            let se = [];
            if (this.search !== "") {
                se = this.items.filter((p) =>
                    p.name.toLowerCase().includes(this.search.toLowerCase())
                );
            } else {
                se = this.items;
            }
            return se;
        },
    },

    methods: {
        onFileChange(e) {
            if (this.items.length > 0)
                this.items.splice(0, this.items.length)

            const file = e.target.files;

            for (const i of Object.keys(file)) {
                if (file[i].name.split('.').pop() == "wav")
                    this.items.push(file[i]);
            }
        },
        onMetaChange(e) {
            if (this.meta && this.meta.length > 0)
                this.meta.splice(0, this.meta.length)

            const file = e.target.files;
            const fileExtension = file[0].name.split('.').pop();

            if ( fileExtension == "txt" || fileExtension == "csv")
                this.meta.push(file[0]);
        },
        formSubmit(e) {
            e.preventDefault();
            let currentObj = this;
            const config = {
                headers: { "content-type": "multipart/form-data" },
            };
        },

        saveInfo(event) {
            //console.log(event);
            this.items = event.target.items;
            for (const i of Object.keys(this.items)) {
                formData.append("files", this.items[i]);
            }
        },
    },
});
</script>
