<script setup>
import {ref} from 'vue';
import {Inertia} from '@inertiajs/inertia';
import {Head, Link} from '@inertiajs/inertia-vue3';
import JetApplicationMark from '@/Jetstream/ApplicationMark.vue';
import JetBanner from '@/Jetstream/Banner.vue';
import JetDropdown from '@/Jetstream/Dropdown.vue';
import JetDropdownLink from '@/Jetstream/DropdownLink.vue';
import JetButton from '@/Jetstream/Button.vue';
import JetNavLink from '@/Jetstream/NavLink.vue';
import JetResponsiveNavLink from '@/Jetstream/ResponsiveNavLink.vue';
import ErrorToast from "@/Components/ErrorToast.vue";
import SuccessToast from "@/Components/SuccessToast.vue";

defineProps({
    title: String,
});

const showingNavigationDropdown = ref(false);

const switchToTeam = (team) => {
    Inertia.put(route('current-team.update'), {
        team_id: team.id,
    }, {
        preserveState: false,
    });
};

const logout = () => {
    Inertia.post(route('logout'));
};

const stopImpersonation = () => {
    window.location.replace(route('impersonate.leave'));
}

</script>

<template>
    <div>
        <Head :title="title"/>

        <JetBanner/>

        <div v-if="$page.props.flash.success">
            <SuccessToast></SuccessToast>
        </div>

        <div v-if="$page.props.flash.failure">
            <ErrorToast></ErrorToast>
        </div>

        <div class="min-h-screen bg-gradient-to-b from-sky-200 to-sky-50 dark:from-slate-900 dark:via-sky-900 dark:to-slate-700 dark:text-white">

            <nav class="bg-white border-b dark:border-cyan-500 dark:bg-slate-900">

                <!-- Primary Navigation Menu -->
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-16">
                        <div class="flex">
                            <!-- Logo -->
                            <div class="shrink-0 flex items-center">
                                <Link :href="route('import.index')">
                                    <JetApplicationMark class="block h-9 w-auto"/>
                                </Link>
                            </div>

                            <!-- Navigation Links -->
                            <div class="hidden space-x-8 sm:ml-10 sm:flex">
                                <JetNavLink :active="route().current('import.index')" :href="route('import.index')" class="dark:text-gray-200">
                                    Import Data
                                </JetNavLink>
                                <JetNavLink :active="route().current('jobs.create')" :href="route('jobs.create')" class="dark:text-gray-200">
                                    Create Jobs
                                </JetNavLink>
                                <JetNavLink :active="route().current('jobs.index')" :href="route('jobs.index')" class="dark:text-gray-200">
                                    Job Queue
                                </JetNavLink>
                                <JetNavLink :active="route().current('results.index')" :href="route('results.index')" class="dark:text-gray-200">
                                    Results
                                </JetNavLink>
                                <JetNavLink :active="route().current('about')" :href="route('about')" class="dark:text-gray-200">
                                    About
                                </JetNavLink>
                                <JetNavLink v-if="$page.props.user.role === 1" :active="route().current('admin.index')" :href="route('admin.index')" class="dark:text-gray-200">
                                    Admin Panel
                                </JetNavLink>
                                <!-- Navigation -->

                            </div>
                        </div>

                        <div class="hidden sm:flex sm:items-center sm:ml-6 ">
                            <div class="ml-3 relative">
                                <!-- Teams Dropdown -->
                                <JetDropdown v-if="$page.props.jetstream.hasTeamFeatures" align="right" width="60">
                                    <template #trigger>
                                        <span class="inline-flex rounded-md">
                                            <button class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-neutral-900 bg-white hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:bg-gray-50 active:bg-gray-50 transition"
                                                    type="button">
                                                {{ $page.props.user.current_team.name }}

                                                <svg
                                                    class="ml-2 -mr-0.5 h-4 w-4"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path clip-rule="evenodd"
                                                          d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                          fill-rule="evenodd"/>
                                                </svg>
                                            </button>
                                        </span>
                                    </template>

                                    <template #content>
                                        <div class="w-60">
                                            <!-- Team Management -->
                                            <template v-if="$page.props.jetstream.hasTeamFeatures">
                                                <div class="block px-4 py-2 text-xs text-gray-400">
                                                    Manage Team
                                                </div>

                                                <!-- Team Settings -->
                                                <JetDropdownLink :href="route('teams.show', $page.props.user.current_team)">
                                                    Team Settings
                                                </JetDropdownLink>

                                                <JetDropdownLink v-if="$page.props.jetstream.canCreateTeams" :href="route('teams.create')">
                                                    Create New Team
                                                </JetDropdownLink>

                                                <div class="border-t border-gray-100"/>

                                                <!-- Team Switcher -->
                                                <div class="block px-4 py-2 text-xs text-gray-400">
                                                    Switch Teams
                                                </div>

                                                <template v-for="team in $page.props.user.all_teams" :key="team.id">
                                                    <form @submit.prevent="switchToTeam(team)">
                                                        <JetDropdownLink as="button">
                                                            <div class="flex items-center">
                                                                <svg
                                                                    v-if="team.id == $page.props.user.current_team_id"
                                                                    class="mr-2 h-5 w-5 text-green-400"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                                </svg>
                                                                <div>{{ team.name }}</div>
                                                            </div>
                                                        </JetDropdownLink>
                                                    </form>
                                                </template>
                                            </template>
                                        </div>
                                    </template>
                                </JetDropdown>
                            </div>

                            <!-- Settings Dropdown -->
                            <div class="ml-3 relative">
                                <JetDropdown align="right" width="48">
                                    <template #trigger>
                                        <button v-if="$page.props.jetstream.managesProfilePhotos" class="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition">
                                            <img :alt="$page.props.user.name" :src="$page.props.user.profile_photo_url" class="h-8 w-8 rounded-full object-cover">
                                        </button>

                                        <span v-else class="inline-flex rounded-md">
                                            <button class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-neutral-900 bg-white hover:text-gray-700 focus:outline-none transition" type="button">
                                                {{ $page.props.user.name }}

                                                <svg
                                                    class="ml-2 -mr-0.5 h-4 w-4"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path clip-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" fill-rule="evenodd"/>
                                                </svg>
                                            </button>
                                        </span>
                                    </template>

                                    <template #content>
                                        <!-- Account Management -->
                                        <div class="block px-4 py-2 text-xs text-gray-400">
                                            Manage Account
                                        </div>

                                        <JetDropdownLink :href="route('profile.show')">
                                            Profile
                                        </JetDropdownLink>

                                        <JetDropdownLink v-if="$page.props.jetstream.hasApiFeatures" :href="route('api-tokens.index')">
                                            API Tokens
                                        </JetDropdownLink>

                                        <div class="border-t border-gray-100"/>

                                        <!-- Authentication -->
                                        <form v-if="$page.props.impersonating" @submit.prevent="stopImpersonation">
                                            <JetDropdownLink as="button">
                                                Stop Impersonating
                                            </JetDropdownLink>
                                        </form>

                                        <form @submit.prevent="logout">
                                            <JetDropdownLink as="button">
                                                Log Out
                                            </JetDropdownLink>
                                        </form>
                                    </template>
                                </JetDropdown>
                            </div>

                            <div class="inline-flex pl-5">
                                <JetButton class='close m-2 bg-transparent hover:bg-white-500 text-black dark:text-white font-semibold hover:text-white py-2 px-4 border border-white-500 hover:border-transparent rounded' style="cursor: pointer;" @click="history.forward()">Back</JetButton>
                                <JetButton class='close m-2 bg-transparent hover:bg-white-500 text-black dark:text-white font-semibold hover:text-white py-2 px-4 border border-white-500 hover:border-transparent rounded' style="cursor: pointer;" @click="history.forward()">Forward</JetButton>
                            </div>
                        </div>

                        <!-- Hamburger -->
                        <div class="-mr-2 flex items-center sm:hidden">
                            <button class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-neutral-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-neutral-900 transition" @click="showingNavigationDropdown = ! showingNavigationDropdown">
                                <svg
                                    class="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        :class="{'hidden': showingNavigationDropdown, 'inline-flex': ! showingNavigationDropdown }"
                                        d="M4 6h16M4 12h16M4 18h16"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                    />
                                    <path
                                        :class="{'hidden': ! showingNavigationDropdown, 'inline-flex': showingNavigationDropdown }"
                                        d="M6 18L18 6M6 6l12 12"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Responsive Navigation Menu -->
                <div :class="{'block': showingNavigationDropdown, 'hidden': ! showingNavigationDropdown}" class="sm:hidden">
                    <div class="pt-2 pb-3 space-y-1">
                        <JetResponsiveNavLink :active="route().current('import.index')" :href="route('import.index')" class="dark:text-gray-200">
                            Import Data
                        </JetResponsiveNavLink>
                        <JetResponsiveNavLink :active="route().current('jobs.create')" :href="route('jobs.create')" class="dark:text-gray-200">
                            Create Jobs
                        </JetResponsiveNavLink>
                        <JetResponsiveNavLink :active="route().current('jobs.index')" :href="route('jobs.index')" class="dark:text-gray-200">
                            Job Queue
                        </JetResponsiveNavLink>
                        <JetResponsiveNavLink :active="route().current('results.index')" :href="route('results.index')" class="dark:text-gray-200">
                            Results
                        </JetResponsiveNavLink>
                        <JetResponsiveNavLink :active="route().current('about')" :href="route('about')" class="dark:text-gray-200">
                            About
                        </JetResponsiveNavLink>
                    </div>

                    <!-- Responsive Settings Options -->
                    <div class="pt-4 pb-1 border-t border-gray-200">
                        <div class="flex items-center px-4">
                            <div v-if="$page.props.jetstream.managesProfilePhotos" class="shrink-0 mr-3">
                                <img :alt="$page.props.user.name" :src="$page.props.user.profile_photo_url" class="h-10 w-10 rounded-full object-cover">
                            </div>

                            <div>
                                <div class="font-medium text-base text-gray-800">
                                    {{ $page.props.user.name }}
                                </div>
                                <div class="font-medium text-sm text-neutral-900">
                                    {{ $page.props.user.email }}
                                </div>
                            </div>
                        </div>

                        <div class="mt-3 space-y-1">
                            <JetResponsiveNavLink :active="route().current('profile.show')" :href="route('profile.show')">
                                Profile
                            </JetResponsiveNavLink>

                            <JetResponsiveNavLink v-if="$page.props.jetstream.hasApiFeatures" :active="route().current('api-tokens.index')" :href="route('api-tokens.index')">
                                API Tokens
                            </JetResponsiveNavLink>

                            <!-- Authentication -->
                            <form method="POST" @submit.prevent="logout">
                                <JetResponsiveNavLink as="button">
                                    Log Out
                                </JetResponsiveNavLink>
                            </form>

                            <!-- Team Management -->
                            <template v-if="$page.props.jetstream.hasTeamFeatures">
                                <div class="border-t border-gray-200"/>

                                <div class="block px-4 py-2 text-xs text-gray-400">
                                    Manage Team
                                </div>

                                <!-- Team Settings -->
                                <JetResponsiveNavLink :active="route().current('teams.show')" :href="route('teams.show', $page.props.user.current_team)">
                                    Team Settings
                                </JetResponsiveNavLink>

                                <JetResponsiveNavLink v-if="$page.props.jetstream.canCreateTeams" :active="route().current('teams.create')" :href="route('teams.create')">
                                    Create New Team
                                </JetResponsiveNavLink>

                                <div class="border-t border-gray-200"/>

                                <!-- Team Switcher -->
                                <div class="block px-4 py-2 text-xs text-gray-400">
                                    Switch Teams
                                </div>

                                <template v-for="team in $page.props.user.all_teams" :key="team.id">
                                    <form @submit.prevent="switchToTeam(team)">
                                        <JetResponsiveNavLink as="button">
                                            <div class="flex items-center">
                                                <svg
                                                    v-if="team.id == $page.props.user.current_team_id"
                                                    class="mr-2 h-5 w-5 text-green-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>
                                                <div>{{ team.name }}</div>
                                            </div>
                                        </JetResponsiveNavLink>
                                    </form>
                                </template>
                            </template>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- Page Heading -->
            <header v-if="$slots.header">
                <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <slot name="header"/>
                </div>
            </header>

            <!-- Page Content -->
            <main>
                <slot/>
            </main>
        </div>
    </div>
</template>
