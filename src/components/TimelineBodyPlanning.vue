<template>
    <tbody class="bg-white">
        <PlanningRowPersonnel v-for="personnel in personnelsData" :key="personnel.id" :personnel="personnel" :planning-items="getPlanningFromPersonnel(personnel)"/>
    </tbody>
</template>


<script>
import { mapState } from 'vuex';

import PlanningRowPersonnel from '@/components/PlanningRowPersonnel.vue';
    
export default {
    components: {
        PlanningRowPersonnel,
    },

    computed: {
        ...mapState(['Personnels', 'GtaPlannings']),

        personnelsData() {
            return this.Personnels['personnels'];
        },

        gtaPlanningsData() {
            return this.GtaPlannings['gtaPlannings'];
        }
    },

    methods: {
        /**
         * retourne le planning d'un personnel
         * @param {Object} personnel Objet personnel contenant un ID
         * @returns {Array}
         */
        getPlanningFromPersonnel(personnel) {
            let found = this.gtaPlanningsData.filter(e => e.structure__personnel_id === personnel.id);

            //console.log('found for '+personnel.cache_nom, found);

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

    mounted() {
        console.log('personnels mounted', this.personnelsData);
        console.log('gtaPlannings mounted', this.GtaPlannings['gtaPlannings']);
    }
  
};
</script>