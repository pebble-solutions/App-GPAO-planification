<template>
    <tr :id="rowId" class="position-relative">
        <th class="bg-white row-header">
            <PersonnelName :personnel="personnel"/>
        </th>

        <td class="position-absolute bg-secondary rounded" v-if="w > 0" :style="'left:'+lp+'px; width:'+w+'px; top:5px; bottom:5px;'">
        </td>

        <td v-for="(jour, j) in daysList" :key="j"
            class="text-start planning-cell"
            :class="{'border-end border-4': jour.getDay() === 0}"
        >
            8
        </td>
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

            if (row && this.planningItems.length > 0) {
                let header = row.querySelector('.row-header');

                let rowSize = row.offsetWidth;
                let headerSize = header.offsetWidth;
                let daysSize = rowSize - headerSize;

                let unit = daysSize / this.daysList.length;
            
                let dayBegins = new Date(this.planningItems[0].dd);
                let diff = Date.listDays(this.timeline.start, dayBegins);

                let diffSize = diff.length * unit;

                leftPosition = diffSize + headerSize;
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

            if (row && this.planningItems.length > 0) {
                let header = row.querySelector('.row-header');

                let rowSize = row.offsetWidth;
                let headerSize = header.offsetWidth;
                let daysSize = rowSize - headerSize;

                let unit = daysSize / this.daysList.length;

                let dayBegins = new Date(this.planningItems[0].dd);
                let dayEnd = new Date(this.planningItems[this.planningItems.length-1].df);
                let diff = Date.listDays(dayBegins, dayEnd);

                console.log(this.planningItems);
                console.log(this.planningItems[this.planningItems.length-1].df);
                console.log('dayBegins', dayBegins);
                console.log('dayEnd', dayEnd);

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

        console.log(this.personnel.cache_nom);
    }
};
</script>