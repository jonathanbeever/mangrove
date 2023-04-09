<template>
    <div class="flex flex-row">
        <div v-for="(option, key) in options" :key="key" class="px-2">
            <p class="text-gray-700">
                {{ option.label }}
            </p>
            <select
                class="text-gray-900 rounded"
                v-model="selections[key]"
                :disabled="Object.keys(option.options).length == 0"
            >
                <option
                    v-for="choice in option.options"
                    :value="choice"
                >
                    {{ option.labelKey != null
                        ? option.labelKey.split('.').reduce((c, key) => c[key], choice)
                        : choice }}
                </option>
            </select>
        </div>
    </div>
</template>

<script>
import {defineComponent} from "vue";

// Prop Definitions
// const options = {
//     id: {
//         label: "Select Label"
//         labelKey: "name",
//         options: []
//     }
// }
// const modelValue = { (Selections made, just pass an empty Object)
//     optionId: value,
//     optionId2: value,
// }
export default defineComponent({
    props: {
        options: {
            type: Object,
            required: true,
        },
        modelValue: {
            type: Object,
            required: true,
        }
    },
    computed: {
        selections: {
            get() {
                return this.modelValue
            },
            set(selections) {
                this.$emit('update:modelValue', selections)
            }
        }
    },
    beforeMount() {
        // Populate selections to be empty
        Object.keys(this.options).forEach((key) => {
            this.selections[key] = null
        })
    },
})
</script>
