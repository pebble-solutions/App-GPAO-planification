<template>
    <div class="col overflow-auto">
        <div class="row no-gutters">
            <CalendarTimeline :is-affectation="true" :timeline="timeline" :projets-list="projetsList" :metiers-list="metiersList"></CalendarTimeline>
        </div>
    </div>

    <router-view :timeline="timeline" :projets-list="projetsList"></router-view>
</template>


<script>
import CalendarTimeline from "@/components/CalendarTimeline.vue";

export default {
    inheritAttrs: false,

    props: {
        timeline: Object,
        projetsList: Array,
        metiersList: Array
    },

    components: {
       CalendarTimeline
    }
}
</script>