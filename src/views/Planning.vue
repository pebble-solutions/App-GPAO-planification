<template>
        <!-- <div id="chart_planning"></div> -->
        <CalendarTimeline :listLabel="'Personnel'" :mode="'planning'"></CalendarTimeline>
</template>

<script>
import CalendarTimeline from '../components/CalendarTimeline.vue';

export default {

    components: {
        CalendarTimeline
    },

    data() {
        return {

        }
    },

}
</script>
