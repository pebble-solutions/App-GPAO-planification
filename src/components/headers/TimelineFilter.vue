<template>
    <router-link :to="{name:routeName}" custom v-slot="{navigate, href}">
        <a :href="href" @click="navigate" class="btn btn-secondary mx-2"><i class="bi bi-calendar3"></i> {{getHumanDate(timeline.start)}} <i class="bi bi-chevron-compact-right"></i> {{getHumanDate(timeline.end)}}</a>
    </router-link>
</template>

<script>
import { mapState } from 'vuex';
import { getDisplayFormatedDate } from '../../js/date';

export default {
    computed: {
        ...mapState(['timeline']),

        routeName() {
            if (this.$route.name === 'Planning') {
                return 'TimelineFilterPlanning'
            }
            
            return 'TimelineFilter'
        }
    },

    methods: {
        getHumanDate(date) {
            return getDisplayFormatedDate(date);
        }
    }
}
</script>