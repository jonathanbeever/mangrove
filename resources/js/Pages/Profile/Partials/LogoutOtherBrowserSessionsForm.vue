<script setup>
import {ref} from 'vue';
import {useForm} from '@inertiajs/inertia-vue3';
import JetActionMessage from '@/Jetstream/ActionMessage.vue';
import JetActionSection from '@/Jetstream/ActionSection.vue';
import JetButton from '@/Jetstream/Button.vue';
import JetDialogModal from '@/Jetstream/DialogModal.vue';
import JetInput from '@/Jetstream/Input.vue';
import JetInputError from '@/Jetstream/InputError.vue';
import JetSecondaryButton from '@/Jetstream/SecondaryButton.vue';

defineProps({
    sessions: Array,
});

const confirmingLogout = ref(false);
const passwordInput = ref(null);

const form = useForm({
    password: '',
});

const confirmLogout = () => {
    confirmingLogout.value = true;

    setTimeout(() => passwordInput.value.focus(), 250);
};

const logoutOtherBrowserSessions = () => {
    form.delete(route('other-browser-sessions.destroy'), {
        preserveScroll: true,
        onSuccess: () => closeModal(),
        onError: () => passwordInput.value.focus(),
        onFinish: () => form.reset(),
    });
};

const closeModal = () => {
    confirmingLogout.value = false;

    form.reset();
};
</script>

<template>
    <JetActionSection>
        <template #title>
            <div class="dark:text-white">
                Browser Sessions
            </div>
        </template>

        <template #description>
            <div class="dark:text-white">
                Manage and log out your active sessions on other browsers and devices.
            </div>
        </template>

        <template #content>
            <div class="max-w-xl text-sm text-gray-600">
                If necessary, you may log out of all of your other browser sessions across all of your devices. Some of your recent sessions are listed below; however, this list may not be exhaustive. If you feel your account has been compromised, you should also update your password.
            </div>

            <!-- Other Browser Sessions -->
            <div v-if="sessions.length > 0" class="mt-5 space-y-6">
                <div v-for="(session, i) in sessions" :key="i" class="flex items-center">
                    <div>
                        <svg
                            v-if="session.agent.is_desktop"
                            class="w-8 h-8 text-neutral-900"
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            viewBox="0 0 24 24"
                        >
                            <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>

                        <svg
                            v-else
                            class="w-8 h-8 text-neutral-900"
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M0 0h24v24H0z" stroke="none"/>
                            <rect
                                height="16"
                                rx="1"
                                width="10"
                                x="7"
                                y="4"
                            />
                            <path d="M11 5h2M12 17v.01"/>
                        </svg>
                    </div>

                    <div class="ml-3">
                        <div class="text-sm text-gray-600">
                            {{ session.agent.platform ? session.agent.platform : 'Unknown' }} - {{ session.agent.browser ? session.agent.browser : 'Unknown' }}
                        </div>

                        <div>
                            <div class="text-xs text-neutral-900">
                                {{ session.ip_address }},

                                <span v-if="session.is_current_device" class="text-green-500 font-semibold">This device</span>
                                <span v-else>Last active {{ session.last_active }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex items-center mt-5">
                <JetButton @click="confirmLogout">
                    Log Out Other Browser Sessions
                </JetButton>

                <JetActionMessage :on="form.recentlySuccessful" class="ml-3">
                    Done.
                </JetActionMessage>
            </div>

            <!-- Log Out Other Devices Confirmation Modal -->
            <JetDialogModal :show="confirmingLogout" @close="closeModal">
                <template #title>
                    Log Out Other Browser Sessions
                </template>

                <template #content>
                    Please enter your password to confirm you would like to log out of your other browser sessions across all of your devices.

                    <div class="mt-4">
                        <JetInput
                            ref="passwordInput"
                            v-model="form.password"
                            class="mt-1 block w-3/4"
                            placeholder="Password"
                            type="password"
                            @keyup.enter="logoutOtherBrowserSessions"
                        />

                        <JetInputError :message="form.errors.password" class="mt-2"/>
                    </div>
                </template>

                <template #footer>
                    <JetSecondaryButton @click="closeModal">
                        Cancel
                    </JetSecondaryButton>

                    <JetButton
                        :class="{ 'opacity-25': form.processing }"
                        :disabled="form.processing"
                        class="ml-3"
                        @click="logoutOtherBrowserSessions"
                    >
                        Log Out Other Browser Sessions
                    </JetButton>
                </template>
            </JetDialogModal>
        </template>
    </JetActionSection>
</template>
