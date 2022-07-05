<template>
    <div class="col bg-light">
        <div>
            <table class="table table-sm table-bordered fixe-col-one" :class="{'table-hover': tablehover}">
                <thead class="bg-white text-center">
                    <tr>
                        <th></th>
                        <th :colspan="month.n" v-for="month in monthsList" :key="'month-'+month.month">
                            {{month.month}} {{month.start.getFullYear()}}
                        </th>
                    </tr>

                    <tr>
                        <th></th>
                        <th :colspan="week.n" class="border-end border-4" v-for="week in weeksList" :key="'week-'+week.week">
                            Sem. {{week.week}}
                        </th>
                    </tr>

                    <tr>
                        <th class="bg-white">Métiers</th>
                        <th v-for="day in daysList" :key="'day-'+day" :class="{'border-end border-4': day.getDay() === 0, 'text-primary': day.getSqlDate() == timeline.now.getSqlDate()}">
                            <span class="d-block">{{dayDict[day.getDay()]}}</span>
                            {{day.getDate()}}
                        </th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
</template>


<script>
import '@/js/date.js'

export default {
    props: {
        tablehover: {
            type: Boolean,
            default: false
        },
        timeline: Object
    },

    data() {
        return {
                dayDict: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
                monthDict: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
            }
    },

    computed: {
        /**
         * Retourne la liste des dates (objet Date) start et end.
         * @returns {array}
         */
        daysList() {
            let days = [];
            
            if (this.timeline.start && this.timeline.end) {
                let start = this.timeline.start;
                let end = this.timeline.end;
    
                let diff_time = end.getTime() - start.getTime();
                let diff_days = Math.round(diff_time / (1000 * 3600* 24));
    
                for (let index = 0; index <= diff_days; index++) {
                    let current = new Date(start);
                    current.setDate(start.getDate() + index);
    
                    days.push(current);
                }
            }
    
            return days;
        },

        /**
         * Retourne la liste des mois entre start et end
         * @returns {array}
         */
        monthsList() {
            let months = [];

            let days = this.daysList;

            let n = 0;
            let start = null;
            let last = null;

            let self = this;

            days.forEach((day) => {
                if (!start) {
                    start = day;
                }

                if (day.getDate() === 1 && last) {
                    months.push({
                        n,
                        start,
                        month: self.monthDict[start.getMonth()]
                    });

                    n = 0;
                    start = null;
                }

                last = day;

                n += 1;
            });

            if (start) {
                months.push({
                    n,
                    start,
                    month: self.monthDict[start.getMonth()]
                });
            }

            return months;
        },

        /**
         * Retourne la liste des semaine entre start et end
         * @returns {array}
         */
        weeksList() {
            let weeks = [];

            let days = this.daysList;

            let n = 0;
            let start = null;
            let last = null;

            days.forEach((day) => {
                n += 1;

                if (!start) {
                    start = day;
                }

                if (day.getDay() === 0 && last) {
                    weeks.push({
                        n,
                        start,
                        week: start.getWeek()
                    });

                    start = null;
                    n = 0;
                }

                last = day;
            });

            if (start) {
                weeks.push({
                    n,
                    start,
                    week: start.getWeek()
                });
            }

            return weeks;
        },
    },

}
</script>