<template>
    <div v-for="(option, key) in options" :key="key" class="px-2 grow max-w-lg min-w-min">
        <p class="dark:text-white whitespace-nowrap">
            {{ option.label }}
        </p>
        <select
            :id="key + 'select'"
            class="grow dark:text-black rounded w-full"
            v-model="selections[key]"
            :disabled="Object.keys(option.options).length == 0"
        >
            <option
                :id="key + 'option'"
                v-for="choice in option.options"
                :value="choice"
            >
                {{ option.labelKey != null
                    ? option.labelKey.split('.').reduce((c, key) => c[key], choice)
                    : choice }}
            </option>
        </select>
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
    created() {
        // Populate selections to be empty, unless already set
        Object.keys(this.options).forEach((key) => {
            if (this.selections[key] == undefined)
                this.selections[key] = null
        })
    },
})
</script>
