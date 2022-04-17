
<!--let editPop = false;-->
<!--let siteCreationEnabled = false;-->

export default defineComponent({
    components: {
        AppLayout,
        JetButton,
        JetInput,
        JetCheckbox,
        JetLabel,
        Modal,
        Series,
    },
    computed: {
        filtered() {
            let se = [];
            if (this.search !== "") {
                se = this.items.filter(
                    (p) =>
                        p.name
                            .toLowerCase()
                            .includes(this.search.toLowerCase()) ||
                        p.location
                            .toLowerCase()
                            .includes(this.search.toLowerCase())
                );
            } else {
                se = this.items;
            }
            return se;
        },
    },
    mounted() {
        this.items = usePage().props.value.sites;
    },
    data() {
        return {
            items: [],
            search: "",
            editPop,
            siteCreationEnabled: siteCreationEnabled,
            siteCreationName: "",
            siteCreationLocation: "",
            createNewSite: "Create New Site",
            closeMenu: "Close Site Creation",
            siteSelected: false,
            selectedName: "",
            selectedLocation: "",
            newSite: false,
            siteID: "",
        };
    },
    methods: {
        edit: function () {
            this.editPop = !this.editPop;
        },
        pushEdits: function () {
            this.editPop = !this.editPop;
        },
        onClickCreateSite: function () {
            this.siteCreationEnabled = !this.siteCreationEnabled;
        },
        onClickSiteSelectedNew: function () {
            this.newSite = true;
            this.selectedLocation = this.siteCreationLocation;
            this.selectedName = this.siteCreationName;

            this.siteSelected = true;
        },
        onClickSiteSelected: function (item) {
            this.newSite = false;
            this.selectedLocation = item.name;
            this.selectedName = item.location;
            this.siteId = item.site_id;

            this.siteSelected = true;
        },
    },
});
</script>
=======
<!--export default defineComponent({-->
<!--    components: {-->
<!--        AppLayout,-->
<!--        JetButton,-->
<!--        JetInput,-->
<!--        JetCheckbox,-->
<!--        JetLabel,-->
<!--        Modal,-->
<!--        Series-->
<!--    },-->
<!--    computed: {-->
<!--        filtered() {-->
<!--            let se = [];-->
<!--            if (this.search !== "") {-->
<!--                se = this.items.filter(-->
<!--                    (p) =>-->
<!--                        p.name-->
<!--                            .toLowerCase()-->
<!--                            .includes(this.search.toLowerCase()) ||-->
<!--                        p.location-->
<!--                            .toLowerCase()-->
<!--                            .includes(this.search.toLowerCase())-->
<!--                );-->
<!--            } else {-->
<!--                se = this.items;-->
<!--            }-->
<!--            return se;-->
<!--        }-->
<!--    },-->
<!--    mounted() {-->
<!--        this.items = usePage().props.value.sites-->
<!--    },-->
<!--    data() {-->
<!--        return {-->
<!--            items: [],-->
<!--            search: "",-->
<!--            editPop,-->
<!--            siteCreationEnabled: siteCreationEnabled,-->
<!--            siteCreationName: '',-->
<!--            siteCreationLocation: '',-->
<!--            createNewSite: 'Create New Site',-->
<!--            closeMenu: 'Close Site Creation',-->
<!--            siteSelected: false,-->
<!--            selectedName: '',-->
<!--            selectedLocation:'',-->
<!--            newSite: false,-->
<!--            siteID: '',-->
<!--        };-->
<!--    },-->
<!--    methods: {-->
<!--        edit: function () {-->
<!--            this.editPop = !this.editPop;-->
<!--        },-->
<!--        pushEdits: function () {-->
<!--            this.editPop = !this.editPop;-->

<!--        },-->
<!--        onClickCreateSite: function () {-->
<!--            this.siteCreationEnabled = !this.siteCreationEnabled-->
<!--        },-->
<!--        onClickSiteSelectedNew: function () {-->
<!--            this.newSite = true;-->
<!--            this.selectedLocation = this.siteCreationLocation-->
<!--            this.selectedName = this.siteCreationName-->

<!--            this.siteSelected = true;-->
<!--        },-->
<!--        onClickSiteSelected: function (item) {-->
<!--            this.newSite = false-->
<!--            this.selectedLocation = item.name-->
<!--            this.selectedName = item.location-->
<!--            this.siteId = item.site_id-->

<!--            this.siteSelected = true-->
<!--        }-->
<!--    },-->
<!--});-->
<!--</script>-->

