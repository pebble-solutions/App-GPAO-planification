import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },

  {
    path: '/ressources/:id',
    name: 'Ressources',
    component: () => import('../views/Ressources.vue'),
    children: [
      {
        path: '/ressources/:id/ajoutgroup',
        name: 'AjoutGroup',
        component: () => import('../views/modals/AjoutGroupModal.vue')
      },
      {
        path: '/ressources/:id/config_heures',
        name: 'ConfigHeures',
        component: () => import('../views/modals/ConfigHeuresModal.vue')
      },
      {
        path: '/ressources/:id/edit_projet',
        name: 'EditProjet',
        component: () => import('../views/modals/EditPtojetModal.vue')
      },
      {
        path: '/ressources/:id/edittimeline',
        name: 'EditTimeline',
        component: () => import('../views/modals/EditTimelineModal.vue')
      },
      {
        path: '/ressources/:id/ajoutbesoins',
        name: 'AjoutBesoins',
        component: () => import('../views/modals/AjoutBesoinsModal.vue')
      },
    ]
  },


  {
    path: '/affectations',
    name: 'Affectations',
    component: () => import('../views/Affectations.vue'),
    children: [
      {
        path: '/affectations/edittimeline',
        name: 'EditTimelineAffectation',
        component: () => import('../views/modals/EditTimelineModal.vue')
      },
      {
        path: '/affectations/addprojets',
        name: 'AddProjets',
        component: () => import('../views/modals/AddProjetsModal.vue')
      },
      {
        path: '/affectations/addMetiers',
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
