<template>
    <div class="col overflow-auto">
        <div class="row no-gutters" v-if="projetsList.lenght > 0">
            <CalendarTimeline :is-affectation="true"></CalendarTimeline>
        </div>
        
        <div v-else class="py-3 lead text-secondary text-center">
            <div>
                <i class="bi bi-file-x"></i>
            </div>
            
            <div>Pas de projet(s) séléctionné(s)</div>
        </div>
    </div>

    <router-view></router-view>
</template>


<script>
import CalendarTimeline from "@/components/CalendarTimeline.vue";

import { mapState } from 'vuex';

export default {
    inheritAttrs: false,

    computed: {
        ...mapState(['projetsList'])
    },

    components: {CalendarTimeline},
}
</script>