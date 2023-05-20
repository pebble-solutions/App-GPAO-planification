<template>
    <router-link :to="{name: 'RessourcesFilterRessources'}" custom v-slot="{navigate, href}">
        <a :href="href" @click="navigate" class="btn btn-dark">
            <i class="bi bi-briefcase-fill me-1" :class="{'text-warning': filterRessources.length > 0}"></i>
            <span v-if="filterRessources.length > 0" class="text-warning">{{filterRessources.length}} Ressource<span v-if="filterRessources.length > 1">s</span> sélectionné<span v-if="filterRessources.length > 1">s</span></span>
            <span v-else>Filtrer les ressources</span>
        </a>
    </router-link>
</template>


<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['filterRessources'])
    }
}

</script>