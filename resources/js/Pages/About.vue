<template>
    <app-layout title="About">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight dark:text-white pl-8">
                About
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-inner shadow-sky-200 dark:shadow-cyan-500 dark:opacity-75 sm:rounded-lg bg-sky-50 dark:bg-slate-900">
                    <div class="border-gray-200 flex flex-row">
                        <div class="p-4 m-4 flex flex-col">
                            <logo/>
                        </div>
                        <div class="pt-4">
                            <div
                                class="pt-12 pb-4 text-5xl self-center bg-gradient-to-t text-transparent bg-clip-text hover:bg-gradient-to-bl from-lime-400 to-amber-300 font-semibold"
                            >
                                Mangrove
                            </div>
                            <div
                                class="pl-4 pr-20 font-semibold text-justify"
                            >
                                Mangrove is a soundscape ecology analysis tool
                                built to provide a user interface for analytical
                                algorithms written in the R programming
                                language. Soundscape ecology is an emerging field that
                                often times has a high-bar entry for individuals
                                interested in the study. Therefore, Mangrove was
                                developed to provide an open source
                                application that is intuitive and easy to use.
                                Dr. Jonathan Beever, the project sponsor,
                                has seen Mangrove through three
                                iterations, in which users can visualize graphical
                                outputs alongside listening to this data to more
                                effectively analyze, communicate, and share
                                data. Mangrove has a vast set of tools that can
                                be utilized by biologists and analysts alike to
                                better understand and interpret how vital a role
                                sound plays in the environment.
                            </div>
                        </div>
                    </div>
                    <div class="m-8 text-xl">
                        <div>
                            <a href="http://jonathan.beever.org">
                                Sponsor Site
                            </a>
                        </div>
                        <div>
                            <a
                                href="https://github.com/jonathanbeever/mangrove"
                            >
                                Our GitHub
                            </a>
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
import Logo from "@/Components/ApplicationLogo.vue";


export default defineComponent({

    components: {
        AppLayout,
        Logo
    },
});
</script>
