<template>
    <tbody class="bg-white" v-if="!pending.personnels">
        <PlanningRowPersonnel v-for="personnel in personnelsData" :key="personnel.id" :personnel="personnel" :planning-items="getPlanningFromPersonnel(personnel)"/>
        <!-- <tr v-for="personnel in personnelsData" :key="keyBFor(personnel)">
            <th>
                <PersonnelName :personnel="personnel"/>
            </th>

            <td>
                <div class="position-absolute bg-secondary rounded" :style="`left:${lp}px; width:${w}px; top:5pw; bottom:5px;`"></div>
            </td>

            <td v-for="(jour, j) in daysList" :key="'personnel-item-'+personnel.id`personnel-${personnel.id}-${j}`"
                class="text-start planning-cell"
                :class="{'border-end border-4': jour.getDay() === 0}"
            >

            </td>
        </tr> -->
    </tbody>
        
</template>


<script>
import { mapActions, mapState } from 'vuex';

import PlanningRowPersonnel from '@/components/PlanningRowPersonnel.vue';
    
export default {
    components: {
        PlanningRowPersonnel
    },

    data() {
        return {
            pending: {
                personnels: true,
                gtaPlannings: true,
            },
        }
    },

    computed: {
        ...mapState(['Personnels', 'GtaPlannings']),

        personnelsData() {
            return this.Personnels['personnels'];
        },
    },

    methods: {
        ...mapActions("Personnels", ["resetPersonnels"]),
        ...mapActions("GtaPlannings", ["resetGtaPlannings"]),

        /**
         * retourne le planning d'un personnel
         * @param {Object} personnel Objet personnel contenant un ID
         * @returns {Array}
         */
        getPlanningFromPersonnel(personnel) {
            //console.log(this.GtaPlannings['gtaPlannings'].filter(e => e.structure__personnel_id === personnel.id));
            return this.GtaPlannings['gtaPlannings'].filter(e => e.structure__personnel_id === personnel.id);
        },
        
        /**
         * Recupere la liste des personnels
         * 
         * @return {promise}
         */
         getPersonnels() {
            this.pending.personnels = true;

            let urlApi = "v2/structurePersonnel"

            this.$app.apiGet(urlApi).then((personnels) => {
                this.resetPersonnels(personnels);
            }).catch(this.$app.catchError)
            .finally(() => this.pending.personnels = false);
        },

        /**
         * Recupere la liste des plannings
         * 
         * @return {promise}
         */
        getPlannings() {
            this.pending.gtaPlannings = true;

            let urlApi = "v2/gtaPlanning"

            let personnel_ids = this.getPersonnelsIds(this.Personnels);

            let query = {
                personnel_ids : personnel_ids
            }

            this.$app.apiGet(urlApi, query).then((gtaPlanningsList) => {
                this.resetGtaPlannings(gtaPlanningsList);
            }).catch(this.$app.catchError)
            .finally(() => this.pending.gtaPlannings = false);
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

    async mounted() {
        await this.getPersonnels();

        await this.getPlannings();
    },
  
};
</script>