<template>
    <div class="col bg-light">
        <table class="table table-sm table-bordered fixe-col-one" :class="{'table-hover': tablehover}">
            <TimelineHeader  :listLabel="listLabel"></TimelineHeader>
            
            <TimelineBodyPlanning v-if="mode == 'planning'"></TimelineBodyPlanning>
            <TimelineBody></TimelineBody>
        </table>
    </div>
</template>

<script>
import TimelineHeader from '@/components/TimelineHeader.vue';
import TimelineBody from '@/components/TimelineBody.vue';

import { mapState } from 'vuex';
import TimelineBodyPlanning from './TimelineBodyPlanning.vue';

export default {
    inheritAttrs: false,

    props: {
        tablehover: {
            type: Boolean,
            default: false
        },
        mode: String,
        listLabel: String
    },

    computed: {
        ...mapState(['projet'])
    },

    components: { TimelineHeader, TimelineBody, TimelineBodyPlanning },

}
</script>