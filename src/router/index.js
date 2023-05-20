import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },

    {
        path: '/ressources/:projetListId?',
        name: 'Ressources',
        component: () => import('../views/Ressources.vue'),
        children: [
            {
                path: 'ajoutgroup',
                name: 'AjoutGroup',
                component: () => import('../views/modals/AjoutGroupModal.vue')
            },
            {
                path: 'config_heures/:id',
                name: 'ConfigHeures',
                component: () => import('../views/modals/ConfigHeuresModal.vue')
            },
            {
                path: 'edittimeline',
                name: 'EditTimeline',
                component: () => import('../views/modals/EditTimelineModal.vue')
            },
            {
                path: 'ajoutbesoins/:id',
                name: 'AjoutBesoins',
                component: () => import('../views/modals/AjoutBesoinsModal.vue')
            },
            {
                path: 'ajoutprojet',
                name: 'RessourcesAjoutProjet',
                component: () => import('../views/modals/AddProjetsModal.vue')
            },
            // {
            //     path: 'filtermetier',
            //     name: 'RessourcesFilter',
            //     component: () => import('../views/modals/headers/FilterRessourcesModal.vue')
            // }
        ]
    },

    {
        path: '/affectations/:idAffectationProjetsListId?',
        name: 'Affectations',
        component: () => import('../views/Affectations.vue'),
        children: [
            {
                path: 'edittimeline',
                name: 'EditTimelineAffectation',
                component: () => import('../views/modals/EditTimelineModal.vue')
            },
            {
                path: 'addprojets',
                name: 'AddProjets',
                component: () => import('../views/modals/AddProjetsModal.vue')
            },
        ]
    },
  
    {
        path: '/planning',
        name: 'Planning',
        component: () => import('../views/Planning.vue'),
        children: [
            {
                path: 'metierFiltre',
                name : 'MetierFiltre',
                component: () => import('../views/modals/headers/MetierFiltreModal.vue')
            }
        ]
    },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
