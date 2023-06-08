<template>
    <tr :id="rowId" class="">      
        <th class="bg-white row-header position-relative">
            <PersonnelName :personnel="personnel"/>
            <div class="position-absolute bg-secondary rounded" :style="'left:'+lp+'px; width:'+w+'px; top:5px; bottom:5px;'"></div>
        </th>

        <td v-for="(jour, j) in daysList" :key="j"
            class="text-start planning-cell"
            :class="{'border-end-week': jour.getDay() === 0}"
        >
        </td>
    </tr>
</template>


<script>
import { mapState } from 'vuex';
import '@/js/date.js';

import PersonnelName from '@/components/personnel/PersonnelName.vue';
import { listIntervalDays } from '../js/date';

export default {
    components: {
        PersonnelName
    },

    props: {
        personnel: Object,
        planningItems: Array,
        daysList: Array,
    },

    data() {
        return {
            lp: null,
            w: null,
        }
    },

    watch: {
        /**
         * Lance resizeHandler() quand la timeline change
         */
        daysList() {
            this.resizeHandler();
        }
    },

    computed: {
        ...mapState(['timeline']),

        /**
         * Retourne l'id de la ligne
         * 
         * @returns {String}
         */
        rowId() 
        {
            return 'personnel-item-'+this.personnel.id
        },

        /**
         * Filtre le tableau planningItems en fonction de la timeline
         */
        filterPlanningFromTimeline() 
        {
            if (this.planningItems.length === 0) {
                return [];
            }

            let PlanningFromTimeline = this.planningItems.filter(item => {
                let insideTimeline = false;
                let dd = new Date(item.dd);
                let df = new Date(item.df);

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
                let header = row.querySelector('.row-header');
                
                let rowSize = row.offsetWidth;
                let headerSize = header.offsetWidth;
                let daysSize = rowSize - headerSize;

                let unit = daysSize / this.daysList.length;
            
                let dayBegins = new Date(this.filterPlanningFromTimeline[0].dd);
                let diff = listIntervalDays(this.timeline.start, dayBegins);

                let diffSize = diff.length * unit;

                leftPosition = diffSize + headerSize;
            }

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

                let dayBegins = new Date(this.filterPlanningFromTimeline[0].dd);
                let dayEnd = this.filterPlanningFromTimeline[this.filterPlanningFromTimeline.length-1].df;
                if (dayEnd) {
                    dayEnd = new Date(this.filterPlanningFromTimeline[this.filterPlanningFromTimeline.length-1].df);
                } else {
                    dayEnd = this.timeline.end;
                }
                
                if (dayBegins < this.timeline.start) {
                    dayBegins = this.timeline.start;
                }
                
                if (dayEnd > this.timeline.end)  {
                    dayEnd = this.timeline.end;
                }

                let diff = listIntervalDays(dayBegins, dayEnd);

                let diffSize = diff.length * unit;

                width = diffSize;
            }

            return width;
        },

        /**
         * Gère le redimensionnement des barres de plannings
         */
        resizeHandler() {
            this.lp = this.leftPosition();
            this.w = this.width();
        }
    },

    created() {
        window.addEventListener('resize', this.resizeHandler);
    },

    unmounted() {
        window.removeEventListener('resize', this.resizeHandler);
    },

    mounted() {
        this.lp = this.leftPosition();
        this.w = this.width();

        document.addEventListener('resize', this.resizeHandler);
    }
};
</script>