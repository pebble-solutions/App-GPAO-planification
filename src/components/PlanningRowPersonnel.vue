<template>
    <tr :id="rowId">
        <th class="bg-white row-header">
            <PersonnelName :personnel="personnel"/>
        </th>

        <td class="position-relative">
            <div class="position-absolute bg-secondary rounded" :style="'left:'+lp+'px; width:'+w+'px; top:5px; bottom:5px;'"></div>
        </td>

        <!-- <td class="position-relative">
            <div class="position-absolute bg-secondary rounded" 
            :style="'left:'+leftPosition()+'px; width: '+ width()+'px;'" 
            v-for="planning in filterPlanningFromTimeline" :key="planning.id"></div>
        </td> -->

        <template v-for="(jour, j) in daysList" :key="j">
            <td v-if="jour.getDate() !== timeline.start.getDate()"
                class="text-start planning-cell"
                :class="{'border-end border-4': jour.getDay() === 0}"
            >
            </td>
        </template>
    </tr>
</template>

<style lang="scss">
.planning-cell {
    min-width:50px;
    position:relative;
}
</style>


<script>
import { mapState } from 'vuex';
import '@/js/date.js';

import PersonnelName from '@/components/personnel/PersonnelName.vue';

export default {
    components: {
        PersonnelName
    },

    props: {
        personnel: Object,
        planningItems: Array
    },

    data() {
        return {
            lp: null,
            w: null,
        }
    },

    computed: {
        ...mapState(['timeline']),

        rowId() {
            return 'personnel-item-'+this.personnel.id
        },

        /**
         * Retourne la liste des dates (objet Date) start et end.
         * 
         * @returns {Array}
         */
         daysList() {
            return Date.listDays(this.timeline.start, this.timeline.end);
        },

        /**
         * Filtre le tableau planningItems en fonction de la timeline
         */
        filterPlanningFromTimeline() {
            console.log('before filter planning', this.planningItems);

            if (this.planningItems.length === 0) {
                return [];
            }

            let PlanningFromTimeline = this.planningItems.filter(item => {
                let insideTimeline = false;
                let dd = new Date(item.dd);
                let df = new Date(item.df);

                console.log('df', item.df);

                if (item.df === null) {
                    if (dd <= this.timeline.end) {
                        insideTimeline = true;
                    }
                } else {
                    if (df >= this.timeline.start && df <= this.timeline.end) {
                        insideTimeline = true;
                    }
    
                    if (dd >= this.timeline.start && dd <= this.timeline.end) {
                        insideTimeline = true;
                    }
    
                    if (dd <= this.timeline.start && df >= this.timeline.end) {
                        insideTimeline = true;
                    }
                }


                return insideTimeline;
            });

            console.log('filter',PlanningFromTimeline);

            return PlanningFromTimeline;
        }
    },

    methods: {
        /**
         * Retourne la position de gauche de la barre de progression
         * 
         * @returns {Number}
         */
        leftPosition() {
            let row = document.getElementById(this.rowId);
            let leftPosition = 0;

            if (row && this.filterPlanningFromTimeline.length > 0) {
                console.log('in method');
                console.log(this.personnel.cache_nom, this.planningItems.length);
                console.log('planning', this.planningItems);

                let header = row.querySelector('.row-header');
                
                let rowSize = row.offsetWidth;
                let headerSize = header.offsetWidth;
                let daysSize = rowSize - headerSize;

                let unit = daysSize / this.daysList.length;
            
                let dayBegins = new Date(this.filterPlanningFromTimeline[0].dd);
                let diff = Date.listDays(this.timeline.start, dayBegins);

                let diffSize = diff.length * unit;

                leftPosition = diffSize;
            }

            console.log('lg', leftPosition);

            return leftPosition;
        },

        /**
         * Retourne la longueur de la barre de progression
         * 
         * @returns {Number}
         */
        width() {
            let row = document.getElementById(this.rowId);
            let width = 0;

            if (row && this.filterPlanningFromTimeline.length > 0) {
                let header = row.querySelector('.row-header');

                let rowSize = row.offsetWidth;
                let headerSize = header.offsetWidth;
                let daysSize = rowSize - headerSize;

                let unit = daysSize / this.daysList.length;

                console.log('unit', unit);

                let dayBegins = new Date(this.filterPlanningFromTimeline[0].dd);
                let dayEnd = this.filterPlanningFromTimeline[this.filterPlanningFromTimeline.length-1].df;
                if (dayEnd) {
                    dayEnd = new Date(this.filterPlanningFromTimeline[this.filterPlanningFromTimeline.length-1].df);
                } else {
                    dayEnd = this.timeline.end;
                }
                
                console.log('dayBegins', dayBegins);
                console.log('dayEnd', dayEnd);

                if (dayBegins < this.timeline.start) {
                    dayBegins = this.timeline.start;
                }

                if (dayEnd > this.timeline.end)  {
                    dayEnd = this.timeline.end;
                }

                let diff = Date.listDays(dayBegins, dayEnd);

                console.log('diff', diff);

                // console.log(this.planningItems);
                // console.log(this.planningItems[this.planningItems.length-1].df);

                let diffSize = diff.length * unit;

                width = diffSize;
            }

            console.log('w', width);
            console.log('--------------------next-------------------');

            return width;
        },
    },

    mounted() {
        this.lp = this.leftPosition();
        this.w = this.width();

        document.addEventListener('resize', () => {
            this.lp = this.leftPosition();
            this.w = this.width();
        });
    }
};
</script>