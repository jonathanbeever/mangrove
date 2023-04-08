<template>
    <div class="mb-6 dark:text-gray-700">
        <h2 class="text-xl font-semibold">{{ header }}</h2>
        <div class="my-2" v-for="param in Object.keys(labels)">
            <InputLabel>
                {{ labels[param] }}
            </InputLabel>
            <TextInput v-if="!notNumbers.includes(param)" type="text" v-model.number="params[param]"/> <!-- Number -->
            <TextInput v-else type="text" v-model="params[param]"/> <!-- String -->
            <InputError :message="errors[param]" />
        </div>
        <div>
            <PrimaryButton class="my-2" @click="params = {...defaults}">
                Restore Defaults
            </PrimaryButton>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'

import InputError from "@/Components/InputError.vue"
import InputLabel from "@/Components/InputLabel.vue"
import PrimaryButton from "@/Components/PrimaryButton.vue"
import TextInput from "@/Components/TextInput.vue"

export default defineComponent({
    components: {
        InputError,
        InputLabel,
        PrimaryButton,
        TextInput,
    },
    props: {
        modelValue: {
            type: Object,
            required: true
        },
        labels: {
            type: Object
        },
        header: {
            type: String
        },
        errors: {
            type: Object
        },
        notNumbers: {
            type: Array,
            required: false,
            default: [],
        }
    },
    emits: ['update:modelValue'],
    data() {
        return {
            defaults: {}
        }
    },
    computed: {
        params: {
            get() {
                return this.modelValue
            },
            set(params) {
                this.$emit('update:modelValue', params)
            }
        }
    },
    mounted() {
        // Set defaults based on initial params passed
        this.defaults = {...this.params}
    },

})
</script>
