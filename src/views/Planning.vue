<template>
        <CalendarTimeline :listLabel="'Personnel'" :mode="'planning'"></CalendarTimeline>

        <router-view></router-view>
</template>

<script>
import CalendarTimeline from '../components/CalendarTimeline.vue';

import { AssetsAssembler } from '../js/app/services/AssetsAssembler';
import { AssetsCollectionController } from '../js/app/controllers/AssetsCollectionController';

export default {
    inheritAttrs: false,

    components: {
        CalendarTimeline
    },

    data() {
        return {
            personnelsCollection: null
        }
    },

    methods: {
        async loadPersonnels() {
            this.personnelsCollection = this.$assets.getCollection('personnels');
            await this.personnelsCollection.load();
        },

        async loadPlannings() {
            await this.loadPersonnels();
            
            let collection = new AssetsCollectionController(this, {
                assetName: 'gtaPlannings',
                updateAction: 'updateGtaPlannings',
                namespace: 'GtaPlannings',
                apiRoute: 'v2/gta_planning/fromPersonnels',
                idParam: 'personnel_id'
            });
            
            let assembler = new AssetsAssembler(this.personnelsCollection.collection);
            await assembler.joinAsset(collection, 'id');        
            
            // Dans une autre vue, après le chargement de loadPlannings()
            //collection = this.$assets.getCollection('gta_plannings');

        }
    },

    async mounted() {
        await this.loadPlannings();
    }

}
</script>
