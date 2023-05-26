<template>
    <router-link :to="{name: routeName}" custom v-slot="{navigate, href}">
        <a :href="href" @click="navigate" class="btn btn-dark">
            <i class="bi bi-briefcase-fill me-1" :class="{'text-warning': RessourcesRHType.length > 0}"></i>
            <span v-if="RessourcesRHType.length > 0" class="text-warning">{{RessourcesRHType.length}} Ressource<span v-if="RessourcesRHType.length > 1">s</span> sélectionné<span v-if="RessourcesRHType.length > 1">s</span></span>
            <span v-else>Filtrer les ressources</span>
        </a>
    </router-link>
</template>


<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['RessourcesRHType']),

        routeName() {
            if (this.$route.name === 'Planning') {
                return 'RessourcesFilterPlanning'
            }
            
            return 'RessourcesFilter'
        }
    }
}

</script>