<template>
    <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="(item, index) in selected" :key="index">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-start">
                    <div class="">
                        <input
                            v-model="item.job"
                            :placeholder="item.job"
                            class="text-sm"
                        />
                        <div class="text-sm text-gray-500">
                            {{ item.name }}
                        </div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <input
                    v-model="item.series"
                    :placeholder="item.series"
                    class="text-sm text-gray-900"
                />

                <div class="text-sm text-gray-500">
                    {{ item.timestarted }}
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ item.date }}
            </td>
            <td
                class="px-6 py-4 whitespace-nowrap text-left text-sm font-medium"
            >
                <input
                    v-model="item.latitude"
                    :placeholder="item.latitude"
                    class="text-sm text-gray-500"
                />

                <input
                    v-model="item.longitude"
                    :placeholder="item.longitude"
                    class="text-sm text-gray-500"
                />
            </td>
            <td class="px-8 py-4 whitespace-nowrap text-sm font-medium">
                <!--a href="#" class="text-indigo-600 hover:text-indigo-900">x</a-->
                <!--input
                    class="form-check-input appearance-none rounded-full h-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-100 align-center bg-no-repeat bg-center bg-contain cursor-pointer"
                    type="checkbox"
                    name="flexRadioDefault"
                    id="{{item.job}}"
                    v-on:click="item.selected = !item.selected"
                /-->
                <div class="text-center cursor-pointer" v-on:click="removeItem(index)">
                x
                </div>
                <!--jet-checkbox name="{{item.count}}" v-model:checked="item.selected" /-->
            </td>
        </tr>
    </tbody>
</template>

<script>
import { defineComponent } from "vue";
import Create from "@/Pages/Jobs/Create.vue";

let list;

export default defineComponent({
    components: {},

    props: ["selected", "items"],

    data() {
        return {
            search: "",
            list: [],
        };
    },

    methods: {
        removeItem: function(event){
            this.selected.splice(event, 1);
            this.items.splice(event, 1);

        }
    },
});
</script>
