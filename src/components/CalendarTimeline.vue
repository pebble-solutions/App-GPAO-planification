<template>
    <div class="col bg-light">
        <table class="table table-sm table-bordered fixe-col-one" :class="{'table-hover': tablehover}">
            <TimelineHeader></TimelineHeader>
            
            <TimelineBody></TimelineBody>
        </table>
    </div>
</template>

<script>
import TimelineHeader from '@/components/TimelineHeader.vue';
import TimelineBody from '@/components/TimelineBody.vue';

import { mapState } from 'vuex';

export default {
    inheritAttrs: false,

    props: {
        tablehover: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        ...mapState(['projet'])
    },

    components: {TimelineHeader, TimelineBody},

}
</script>