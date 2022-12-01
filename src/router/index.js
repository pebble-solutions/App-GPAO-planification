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
                path: 'config_heures',
                name: 'ConfigHeures',
                component: () => import('../views/modals/ConfigHeuresModal.vue')
            },
            {
                path: 'editprojet',
                name: 'EditProjet',
                component: () => import('../views/modals/EditPtojetModal.vue')
            },
            {
                path: 'edittimeline',
                name: 'EditTimeline',
                component: () => import('../views/modals/EditTimelineModal.vue')
            },
            {
                path: 'ajoutbesoins',
                name: 'AjoutBesoins',
                component: () => import('../views/modals/AjoutBesoinsModal.vue')
            },
            {
                path: 'ajoutprojet',
                name: 'RessourcesAjoutProjet',
                component: () => import('../views/modals/AddProjetsModal.vue')
            }
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
            {
                path: 'addMetiers',
                name: 'AddMetiers',
                component: () => import('../views/modals/AddMetiersModal.vue')
            }
        ]
    },
  
    {
        path: '/planning',
        name: 'Planning',
        component: () => import('../views/Planning.vue')
    },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
