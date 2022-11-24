<template>
    <div class="col bg-light">
        <table class="table table-sm table-bordered fixe-col-one" :class="{'table-hover': tablehover}">
            <TimelineHeader></TimelineHeader>
            
            <TimelineBodyRessources v-if="projet && isRessources" ref="TimelineBodyRessources" 
            :pointed-cells-obj="pointedCellsObj"></TimelineBodyRessources>
            <TimelineBodyAffectation v-if="isAffectation"></TimelineBodyAffectation>
        </table>
    </div>
</template>

<script>
import TimelineHeader from '@/components/TimelineHeader.vue';
import TimelineBodyRessources from '@/components/TimelineBodyRessources.vue';
import TimelineBodyAffectation from '@/components/TimelineBodyAffectation.vue';

import { mapState } from 'vuex';

export default {
    inheritAttrs: false,

    props: {
        tablehover: {
            type: Boolean,
            default: false
        },
        pointedCellsObj: Object,
        isRessources: {
            type: Boolean,
            default: false
        },
        isAffectation: {
            type: Boolean,
            default: false
        },
    },

    computed: {
        ...mapState(['projet'])
    },

    components: {TimelineHeader, TimelineBodyRessources, TimelineBodyAffectation},

}
</script>