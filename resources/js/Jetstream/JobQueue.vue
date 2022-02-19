<template>
    <div class="bg-white border-b border-gray-200 flex flex-col">
        <div>
            <jet-button class="float-left border-tl p-4 m-4 border-gray-200" :class="{ 'opacity-25': form }" v-on:click="deleteArray(0)">
                Clear Finished
            </jet-button>
            <jet-button class="float-right border-tl p-4 m-4 border-gray-200" :class="{ 'opacity-25': form }" :disabled="form">
                Delete Caching
            </jet-button>
        </div>
        <div class="p-6 border-t border-gray-200 md:border-t-0 md:border-l col-span-4">
            <div class="flex flex-col">
                <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Description</th>
                                         <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index Used</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr v-for="item in items" :key="item">
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-start">
                                                <div class="">
                                                    <div class="text-sm font-medium text-gray-900">{{ item.job }}</div>
                                                    <div class="text-sm text-gray-500">{{ item.name }}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">{{ item.index }}</div>
                                            <div class="text-sm text-gray-500">{{ item.timestarted }}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.author }}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div class="flex justify-between mb-1">
                                                <span v-if="item.percent==100" class="text-sm font-medium text-green-600 dark:text-white">{{item.percent}}%</span>
                                                <span v-else class="text-sm font-medium text-blue-700 dark:text-white">{{item.percent}}%</span>
                                            </div>
                                            <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                                <div v-if="item.percent==100" class="bg-green-600 h-2.5 rounded-full" style="width=100%"/>
                                                <div v-else class="bg-blue-600 h-2.5 rounded-full" :style="{'width' :'${item.percent}'}"></div>
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
</template>

<script>
    import { defineComponent } from 'vue'
    import JetButton from '@/Jetstream/Button.vue'


    export default defineComponent({
        components: {
            JetButton,

        },
        data() {
            return {
                items: [{
                    job: 'Central Florida Zoo',
                    name: 'centralfloridazoo.zip',
                    index: 'RMS',
                    timestarted: '303030',
                    author: 'Seth',
                    status: false,
                    percent: 43
                    },
                    {
                    job: 'Probably Florida Zoo',
                    name: 'probsafloridazoo.zip',
                    index: 'Spaghetti',
                    timestarted: '03/34/2022, 10:02pm',
                    author: 'Aidan',
                    status: true,
                    percent: 32
                    },
                    {job: 'Central Florida Zoo',
                    name: 'centralfloridazoo.zip',
                    index: 'RMS',
                    timestarted: '303030',
                    author: 'Seth',
                    status: false,
                    percent: 2
                    },
                    {
                    job: 'Probably Florida Zoo',
                    name: 'probsafloridazoo.zip',
                    index: 'Spaghetti',
                    timestarted: '03/34/2022, 10:02pm',
                    author: 'Aidan',
                    status: true,
                    percent: 100
                    }]
                }

            },

        methods:{
        deleteArray(index){
                this.items.splice(index,50);
            }
        }
    })


</script>


