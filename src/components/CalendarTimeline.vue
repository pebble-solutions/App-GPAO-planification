<template>
    <div class="col bg-light">
        <table class="table table-sm table-bordered fixe-col-one" :class="{'table-hover': tablehover}">
            <TimelineHeader :timeline="timeline"></TimelineHeader>
            
            <TimelineBodyRessources v-if="projet && isRessources" :projet="projet" :pointed-cells-obj="pointedCellsObj" :timeline="timeline"></TimelineBodyRessources>
            <TimelineBodyAffectation v-if="isAffectation" :timeline="timeline" :projets-list="projetsList" :metiers-list="metiersList"></TimelineBodyAffectation>
        </table>
    </div>
</template>

<script>
import TimelineHeader from '@/components/TimelineHeader.vue';
import TimelineBodyRessources from '@/components/TimelineBodyRessources.vue';
import TimelineBodyAffectation from '@/components/TimelineBodyAffectation.vue';

export default {
    inheritAttrs: false,

    props: {
        tablehover: {
            type: Boolean,
            default: false
        },
        timeline: Object,
        projet: Object,
        pointedCellsObj: Object,
        isRessources: {
            type: Boolean,
            default: false
        },
        isAffectation: {
            type: Boolean,
            default: false
        },
        projetsList : Array,
        metiersList: Array,
    },

    components: {
    TimelineHeader,
    TimelineBodyRessources,
    TimelineBodyAffectation
},

}
</script>