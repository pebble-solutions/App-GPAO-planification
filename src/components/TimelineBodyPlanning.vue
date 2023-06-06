<template>
    <tbody class="bg-white">
        <PlanningRowPersonnel v-for="personnel in personnelsData" :key="personnel.id" :personnel="personnel" :planning-items="getPlanningFromPersonnel(personnel)" :days-list="daysList"/>
    </tbody>
</template>


<script>
import { mapState } from 'vuex';

import PlanningRowPersonnel from '@/components/PlanningRowPersonnel.vue';
import { listIntervalDays } from '../js/date';
    
export default {
    components: {
        PlanningRowPersonnel,
    },

    computed: {
        ...mapState(['Personnels', 'GtaPlannings', 'timeline']),

        personnelsData() {
            return this.Personnels['personnels'];
        },

        gtaPlanningsData() {
            return this.GtaPlannings['gtaPlannings'];
        },

        /**
         * Retourne la liste des dates (objet Date) start et end.
         * 
         * @returns {Array}
         */
        daysList() 
        {
            return listIntervalDays(this.timeline.start, this.timeline.end);
        },
    },

    methods: {
        /**
         * retourne le planning d'un personnel
         * @param {Object} personnel Objet personnel contenant un ID
         * @returns {Array}
         */
        getPlanningFromPersonnel(personnel) {
            let found = this.gtaPlanningsData.filter(e => e.structure__personnel_id === personnel.id);

            return found;
        },

        /**
         * Retourne la liste des ids des personnels
         * 
         * @param {Array} personnels 
         * 
         * @returns {String}
         */
        getPersonnelsIds(personnels) {
            let ids = [];

            personnels['personnels'].forEach(personnel => {
                ids.push(personnel.id);
            });

            return ids.join(',');
        }
    },  
};
</script>