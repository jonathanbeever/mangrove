<template>
    <app-layout title="Queue">
        <template #header>
            <h2
                class="font-semibold text-xl text-gray-800 leading-tight dark:text-white pl-8"
            >
                Queue
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                    <div class="flex flex-col">
                        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div
                                class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
                            >
                                <div
                                    class="shadow overflow-y-auto overflow-x-hidden max-h-96 border-b border-gray-200 sm:rounded-lg"
                                >
                                    <table
                                        class="min-w-full divide-y divide-gray-200"
                                    >
                                        <thead class="bg-gray-50">
                                        <tr>
                                            <th
                                                class="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
                                                scope="col"
                                            >
                                                Job Name
                                            </th>
                                            <th
                                                class="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
                                                scope="col"
                                            >
                                                Indices Used
                                            </th>
                                            <th
                                                class="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
                                                scope="col"
                                            >
                                                Created On
                                            </th>
                                            <th
                                                class="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider"
                                                scope="col"
                                            >
                                                Status
                                            </th>

                                        </tr>
                                        </thead>
                                        <tbody
                                            class="bg-white divide-y divide-gray-200"
                                        >
                                        <tr
                                            v-for="item in items"
                                            :key="item"
                                        >
                                            <td
                                                class="px-6 py-4 whitespace-nowrap"
                                            >
                                                <div
                                                    class="text-sm text-gray-500"
                                                >
                                                    {{ item.name }}
                                                </div>
                                            </td>
                                            <td
                                                class="px-6 py-4 whitespace-nowrap"
                                            >
                                                <div
                                                    class="text-sm text-gray-900"
                                                >
                                                    {{
                                                        item.indicesUsed.join(
                                                            ", "
                                                        )
                                                    }}
                                                </div>
                                            </td>
                                            <td
                                                class="px-6 py-4 whitespace-nowrap"
                                            >
                                                <div
                                                    class="text-sm text-gray-900"
                                                >
                                                    {{
                                                        item.created_at.substring(
                                                            0,
                                                            10
                                                        )
                                                    }}
                                                </div>
                                            </td>
                                            <td
                                                class="px-6 py-4 whitespace-nowrap text-center"
                                            >
                                                <div
                                                    class="text-sm text-gray-900"
                                                >
                                                    <vue-element-loading
                                                        ref="animation"
                                                        :active="
                                                                item.finished !=
                                                                true
                                                            "
                                                        background-color="dark:rgba(0,0,0,.9);"
                                                        color="#b0b"
                                                        duration="2"
                                                        size="50"
                                                        spinner="mini-spinner"
                                                    />
                                                    {{
                                                        item.finished
                                                            ? "Completed"
                                                            : ""
                                                    }}
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
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
import JetButton from "@/Jetstream/Button.vue";
import {usePage} from "@inertiajs/inertia-vue3";
import VueElementLoading from "vue-element-loading";

export default defineComponent({
    components: {
        AppLayout,
        JetButton,
        VueElementLoading,
    },
    data() {
        return {
            items: []
        };
    },
    mounted() {
        const findIndicesUsed = (object) => {
            let indicesUsed = [];
            Object.keys(object).map((key) => {
                if (
                    key.includes("aci") &&
                    object[key] != null &&
                    !indicesUsed.includes("ACI")
                ) {
                    indicesUsed.push("ACI");
                }
                if (
                    key.includes("adi") &&
                    object[key] != null &&
                    !indicesUsed.includes("ADI")
                ) {
                    indicesUsed.push("ADI");
                }
                if (
                    key.includes("aei") &&
                    object[key] != null &&
                    !indicesUsed.includes("AEI")
                ) {
                    indicesUsed.push("AEI");
                }
                if (
                    key.includes("bi") &&
                    object[key] != null &&
                    !indicesUsed.includes("BIO")
                ) {
                    indicesUsed.push("BIO");
                }
                if (
                    key.includes("ndsi") &&
                    object[key] != null &&
                    !indicesUsed.includes("NDSI")
                ) {
                    indicesUsed.push("NDSI");
                }
                if (
                    key.includes("rms") &&
                    object[key] != null &&
                    !indicesUsed.includes("RMS")
                ) {
                    indicesUsed.push("RMS");
                }
            });
            return {indices: indicesUsed};
        };

        this.items = usePage().props.value.jobs;
        this.items.forEach((element, ind) => {
            let result = findIndicesUsed(element);
            this.items[ind]["indicesUsed"] = result.indices;
            if (element.series.results.length == 0) {
                this.items[ind]["finished"] = false
            } else {
                this.items[ind]["finished"] = true
            }
        });
    },
    methods: {},
});
</script>
