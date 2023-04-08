<template>
    <table class="min-w-full divide-y divide-gray-200">
        <thead>
            <tr>
                <th
                    v-for="column in columns"
                    :key="column.id"
                    scope="col"
                    class="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
                    @click="onHeaderClick(column.id)"
                >
                    <div class="flex justify-between">
                        <slot name="column" v-bind="column">
                            <p>{{ column.name }}</p>
                        </slot>
                        <div v-if="sortable" class="flex-column">
                            <p class="text-gray-400 text-xl leading-3 select-none" :class="[(sortMode === SortMode.Descending && sortKey == column.id) ? '!text-slate-900' : '']">{{ "▴" }}</p>
                            <p class="text-gray-400 text-xl leading-3 select-none" :class="[(sortMode === SortMode.Ascending && sortKey == column.id) ? '!text-slate-900' : '']">{{ "▾" }}</p>
                        </div>
                    </div>
                </th>
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
            <tr v-for="(entry, index) in sortedEntries" :key="index" @click="$emit('activeEntry', entry)">
                <td v-for="column in columns" :key="column.id" class="px-6 py-4 whitespace-nowrap">
                    <slot :name="column.id" v-bind="entry" class="bg-transparent">
                        <!-- Editable -->
                        <input
                            v-if="editable"
                            class="text-gray-900"
                            :value="column.id.split('.').reduce((e, prop) => e[prop], entry)"
                            @change.prevent="$emit('edit', entry, column.id, $event.target.value)"
                        >
                        <!-- Not Editable -->
                        <p class="text-gray-900">
                            {{ column.id.split('.').reduce((e, prop) => e[prop], entry) }}
                        </p>
                    </slot>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>

// Psuedo-Enum
const SortMode = {
    Unsorted: "Unsorted",
    Ascending: "Ascending",
    Descending: "Descending",
}

export default {
    props: {
        columns: {
            type: Array,
            required: true
        },
        entries: {
            type: Array,
            required: true
        },
        editable: {
            type: Boolean,
            default: false
        },
        sortable: {
            type: Boolean,
            default: false
        }
    },
    emits: ['edit', 'activeEntry'],
    data() {
        return {
            sortKey: null,
            sortMode: SortMode.Unsorted,
            SortMode: SortMode,
        }
    },
    computed: {
        sortedEntries() {
            // If sorting disabled, return default ordering
            if (!this.sortable) return this.entries

            // If no sort, return default ordering
            if (this.sortMode === SortMode.Unsorted || this.sortKey == null) return this.entries

            // Ascending
            if (this.sortMode === SortMode.Ascending)
            {
                // Copy Array then sort
                return [...this.entries].sort((a,b) => {
                    if (a[this.sortKey] < b[this.sortKey]) return -1
                    if (a[this.sortKey] > b[this.sortKey]) return 1
                    return 0
                })
            }

            // Descending
            // Copy Array then sort
            return [...this.entries].sort((a,b) => {
                if (a[this.sortKey] > b[this.sortKey]) return -1
                if (a[this.sortKey] < b[this.sortKey]) return 1
                return 0
            })
        }
    },
    methods: {
        onHeaderClick(key) {
            // Switched to different column
            if (this.sortKey != key) {
                this.sortKey = key
                this.sortMode = SortMode.Ascending
                return;
            }

            // Sorting from same column

            if (this.sortMode === SortMode.Ascending) { // If ascending, go to descending
                this.sortMode = SortMode.Descending
            } else if (this.sortMode === SortMode.Descending) { // If descending, clear sort
                this.sortMode = SortMode.Unsorted
                this.sortKey = null
            } else { // Must be already unsorted, we should never hit this because when unsorted key should be null
                this.sortMode = SortMode.Ascending
            }
        }
    },
}
</script>
