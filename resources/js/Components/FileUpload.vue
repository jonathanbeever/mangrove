<template>
    <div class="flex flex-col grow">
        <div class="grow p-6 overflow-y-auto overflow-x-hidden max-h-96">
            <div class="-my-2 sm:-mx-6 lg:-mx-8">
                <div
                    class="py-4 align-middle inline-block min-w-full sm:px-6 lg:px-8"
                >
                    <div
                        class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
                    >
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Site
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Series
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Recording Date
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Latitude/Longitude
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="(item, index) in items" :key="index">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-start">
                                            <div>
                                                <input
                                                    type="text"
                                                    v-model="item.job"
                                                    v-if="item.edit0"
                                                    v-on:blur="
                                                        item.edit0 = false;
                                                        $emit('update');
                                                    "
                                                />
                                                <div
                                                    class="text-sm font-medium text-gray-900 hover:text-violet-600"
                                                    @click="item.edit0 = true"
                                                    v-else-if="item.job != ''"
                                                >
                                                    {{ item.job }}
                                                </div>
                                                <div
                                                    class="text-sm font-medium text-gray-900 hover:text-violet-600"
                                                    @click="item.edit0 = true"
                                                    v-else
                                                >
                                                    empty
                                                </div>
                                                <div
                                                    class="text-sm text-gray-500"
                                                >
                                                    {{ item.name }}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td
                                        class="px-6 py-4 whitespace-nowrap text-right"
                                    >
                                        <div>
                                            <input
                                                type="text"
                                                v-model="item.series"
                                                v-if="item.edit1"
                                                v-on:blur="
                                                    item.edit1 = false;
                                                    $emit('update');
                                                "
                                            />
                                            <div
                                                class="text-sm font-medium text-gray-900 hover:text-violet-600"
                                                @click="item.edit1 = true"
                                                v-else-if="item.series != ''"
                                            >
                                                {{ item.series }}
                                            </div>
                                            <div
                                                class="text-sm font-medium text-gray-900 hover:text-violet-600"
                                                @click="item.edit1 = true"
                                                v-else
                                            >
                                                empty
                                            </div>
                                        </div>
                                        <div class="text-sm text-gray-500">
                                            {{ item.timestarted }}
                                        </div>
                                    </td>
                                    <td
                                        class="py-4 whitespace-nowrap text-center text-sm text-gray-500"
                                    >
                                        <input
                                            type="text"
                                            v-model="item.date"
                                            v-if="item.edit2"
                                            v-on:blur="
                                                item.edit2 = false;
                                                $emit('update');
                                            "
                                        />
                                        <div
                                            class="text-sm font-medium text-gray-900 hover:text-violet-600"
                                            @click="item.edit2 = true"
                                            v-else-if="item.date != ''"
                                        >
                                            {{ item.date }}
                                        </div>
                                        <div
                                            class="text-sm font-medium text-gray-900 hover:text-violet-600"
                                            @click="item.edit2 = true"
                                            v-else
                                        >
                                            empty
                                        </div>
                                    </td>
                                    <td
                                        class="py-4 px-2 whitespace-nowrap text-right text-sm font-medium"
                                    >
                                        <input
                                            type="text"
                                            v-model="item.latitude"
                                            v-if="item.edit3"
                                            v-on:blur="
                                                item.edit3 = false;
                                                $emit('update');
                                            "
                                        />
                                        <div
                                            class="text-sm font-medium text-gray-900 hover:text-violet-600"
                                            @click="item.edit3 = true"
                                            v-else-if="item.latitude != ''"
                                        >
                                            {{ item.latitude }}
                                        </div>
                                        <div
                                            class="text-sm font-medium text-gray-900 hover:text-violet-600"
                                            @click="item.edit3 = true"
                                            v-else
                                        >
                                            empty
                                        </div>
                                        <input
                                            type="text"
                                            v-model="item.longitude"
                                            v-if="item.edit4"
                                            v-on:blur="
                                                item.edit4 = false;
                                                $emit('update');
                                            "
                                        />
                                        <div
                                            class="text-sm font-medium text-gray-900 hover:text-violet-600"
                                            @click="item.edit4 = true"
                                            v-else-if="item.longitude != ''"
                                        >
                                            {{ item.longitude }}
                                        </div>
                                        <div
                                            class="text-sm font-medium text-gray-900 hover:text-violet-600"
                                            @click="item.edit4 = true"
                                            v-else
                                        >
                                            empty
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="p-8">
            <form @submit.prevent="formSubmit" enctype="multipart/form-data">
                <strong class="flex pt-4">Upload New Files:</strong>
                <input
                    type="file"
                    class="form-control"
                    v-on:change="onFileChange"
                    multiple
                />
                <jet-button
                    class="float-right btn btn-success"
                    @click="saveInfo"
                    >Save</jet-button
                >
            </form>
        </div>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import JetButton from "@/Jetstream/Button.vue";

export default defineComponent({
    components: {
        JetButton,
    },

    mounted() {
        console.log("Component mounted.");
    },

    data() {
        return {
            items: [],
            files: [],
        };
    },

    methods: {
        onFileChange(e) {
            console.log(e.target.files[0]);
            this.file = e.target.files[0];
        },

        formSubmit(e) {
            e.preventDefault();
            let currentObj = this;
            const config = {
                headers: { "content-type": "multipart/form-data" },
            };
        },
        uploadFile(event) {
            this.files = event.target.file;

            let formData = new FormData();
            for (const i of Object.keys(this.items)) {
                formData.append("files", this.files[i]);
            }
            //I need that crisp laravel for the post function
            // axios
            //     .post("/formSubmit", formData, config)
            //     .then(function (response) {
            //         currentObj.success = response.data.success;
            //     })
            //     .catch(function (error) {
            //         currentObj.output = error;
            //     });
        },

        saveInfo(event) {
            this.items = event.target.items;
            for (const i of Object.keys(this.items)) {
                formData.append("files", this.items[i]);
            }
        },
    },
});
</script>
