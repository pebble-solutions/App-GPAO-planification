<template>

    <AppWrapper
        :cfg="cfg"
        :cfg-menu="cfgMenu"
        :cfg-slots="cfgSlots"
        
        @auth-change="setLocal_user">

        <template v-slot:header>
            <div class="d-flex align-items-center">
                <div v-if="isRessources || isAffectation" class="ms-2">
                    <router-link :to="{name: 'RessourcesAjoutProjet'}" custom v-slot="{navigate, href}">
                        <a :href="href" @click="navigate" class="btn btn-dark">
                            <i class="bi bi-clipboard2 me-1" :class="{'text-warning': projetsList.length > 0}"></i>
                            <span v-if="projetsList.length > 0" class="text-warning">{{projetsList.length}} Projet<span v-if="projetsList.length > 1">s</span> sélectionné<span v-if="projetsList.length > 1">s</span></span>
                            <span v-else>Sélectionner un projet</span>
                        </a>
                    </router-link>

                    <router-link :to="{name: 'RessourcesFilterRessources'}" custom v-slot="{navigate, href}">
                        <a :href="href" @click="navigate" class="btn btn-dark">
                            <i class="bi bi-briefcase-fill me-1" :class="{'text-warning': filterRessources.length > 0}"></i>
                            <span v-if="filterRessources.length > 0" class="text-warning">{{filterRessources.length}} Ressource<span v-if="filterRessources.length > 1">s</span> sélectionné<span v-if="filterRessources.length > 1">s</span></span>
                            <span v-else>Filtrer les ressources</span>
                        </a>
                    </router-link>

                    <router-link :to="{name:'EditTimeline'}" custom v-slot="{navigate, href}">
                        <a :href="href" @click="navigate" class="btn btn-secondary mx-2"><i class="bi bi-calendar3"></i> {{getDateHuman(timeline.start)}} <i class="bi bi-chevron-compact-right"></i> {{getDateHuman(timeline.end)}}</a>
                    </router-link>

                    <BtnShare :link="(link)"></BtnShare>
                </div>
            </div>
        </template>

        <template v-slot:menu>
            <AppMenu>
                <AppMenuItem href="/" look="dark" icon="bi bi-house">Accueil</AppMenuItem>
                <AppMenuItem href="/ressources" look="dark" icon="bi bi-boxes" :active="isRessources">Ressources</AppMenuItem>
                <AppMenuItem href="/affectations" look="dark" icon="bi bi-person-plus-fill" :active="isAffectation">Affectations</AppMenuItem>
                <AppMenuItem href="/planning" look="dark" icon="bi bi-calendar2">Planning</AppMenuItem>
            </AppMenu>
        </template>

        <template v-slot:list>
            <SideBarAffectation v-if="isAffectation"></SideBarAffectation>
        </template>

        <template v-slot:core>
            <div class="px-2 bg-light">
                <router-view v-if="isConnectedUser" :cfg="cfg" @updateLink="updateLink()"/>
            </div>
        </template>

    </AppWrapper>
</template>

<style lang="scss">
.lead {
    font-size: 1.25rem;
    font-weight: 300;
}
</style>

<script>

import AppWrapper from '@/components/pebble-ui/AppWrapper.vue'
import AppMenu from '@/components/pebble-ui/AppMenu.vue'
import AppMenuItem from '@/components/pebble-ui/AppMenuItem.vue'
import BtnShare from '@/components/pebble-ui/button/BtnShare.vue'
import SideBarAffectation from '@/components/SideBarAffectation.vue'
import {mapActions, mapState } from 'vuex'

import CONFIG from "@/config.json"
import '@/js/date.js'



export default {
    data() {
        return {
            cfg: CONFIG.cfg,
            cfgMenu: CONFIG.cfgMenu,
            cfgSlots: CONFIG.cfgSlots,
            pending: {
                elements: true,
                projetsActifs: false
            },
            isConnectedUser: false,
            link: window.location.href
        }
    },

    computed: {
        ...mapState(['projet', 'timeline', 'projetsList', 'filterRessources']),

        isRessources() {
            if(	this.$route.name === 'Ressources' || 
                this.$route.name === 'RessourcesProjet' || 
                this.$route.name === 'AjoutGroup' || 
                this.$route.name === 'ConfigHeures' || 
                this.$route.name === 'EditProjet' || 
                this.$route.name === 'EditTimeline' ||
                this.$route.name === 'RessourcesAjoutProjet' ||
                this.$route.name === 'RessourcesFilterRessources' ||
                this.$route.name === 'AjoutBesoins') 
            {
                this.setActualPage('ressources');
                return true;
            }

            return false;
        },

        isAffectation() {
            if( this.$route.name === 'Affectations' ||
                this.$route.name === 'EditTimelineAffectation' ||
                this.$route.name === 'AddProjets' ||
                this.$route.name === 'AddMetiers')
            {
                this.setActualPage('affectations');
                return true;
            }

            return false;
        },
    },

    components: {AppWrapper, AppMenu, AppMenuItem, SideBarAffectation, BtnShare},

    methods: {
        ...mapActions(['refreshTimeline', 'refreshProjetsActifs', 'refreshPage', 'refreshRessourcesRHType']),

        /**
         * Retourne la représentation d'une date lisible par un humain.
         * 
         * @param {dateTime} date Date à analyser
         * @param {string} fallbackText Texte à afficher au cas ou date est non renseigné (défaut '')
         * 
         * @returns {string}
         */
        getDateHuman(date, fallbackText) {
            fallbackText = typeof fallbackText === 'undefined' ? '' : fallbackText;

            if (date) {
                return date.toLocaleDateString('fr-FR', {month:'2-digit', day:'2-digit', year:'numeric'});
            }
            else {
                return fallbackText;
            }
        },


        /**
         * Met à jour les informations de l'utilisateur connecté
         * @param {Object} user Un objet LocalUser
         */
        setLocal_user(user) {
            if (user) {
                this.$store.dispatch('login', user);
                this.isConnectedUser = true;
            }
            else {
                this.$store.dispatch('logout');
                this.isConnectedUser = false;
            }
        },

        /**
         * Envoie une requête pour lister les éléments et les stocke dans le store
         * 
         * @param {Object} params Paramètre passés en GET dans l'URL
         * @param {string} action 'update' (défaut), 'replace', 'remove'
         */
        listElements(params, action) {
            action = typeof action === 'undefined' ? 'update' : action;
            this.$app.listElements(this, params)
            .then((data) => {
                this.$store.dispatch('refreshElements', {
                    action,
                    elements: data
                });
            })
            .catch(this.$app.catchError);
        },

        /**
         * Change de structure, vide le store
         * 
         * @param {integer} structureId
         */
        switchStructure(structureId) {
            this.$router.push('/');
            this.$store.dispatch('switchStructure', structureId);

            this.listElements();
            this.getAllProjet();
            this.setTimeline();
            this.getRessourcesRHType();
        },

        /**
         * Récupère tout les projets in production
         */
        getAllProjet() {
            this.pending.projetsActifs = true;

            let urlApi = '/projet/GET/list';

            this.$app.apiGet(urlApi, {
                in_production: true,
                list_besoins_rh: true
            }).then( (data) => {
                this.refreshProjetsActifs(data);
            }).catch(this.$app.catchError);

            this.pending.projetsActifs = false;
        },

        /**
         * Initialise la timeline
         */
        setTimeline() {
            let timelineStart = new Date();
            timelineStart = timelineStart.getMonday();
            
            let timelineEnd = new Date(timelineStart);
            timelineEnd.setDate(timelineStart.getDate() + 28);

            let tmpTimeline = {
                start: timelineStart,
                end: timelineEnd,
                now: new Date()
            }

            this.refreshTimeline(tmpTimeline);
        },

        setActualPage(actualPage) {
            let page = {};

            switch (actualPage) {
                case 'ressources':
                    page = {
                        ressources: true,
                        affecation: false
                    }

                    this.refreshPage(page)
                    break;

                case 'affecations':
                    page = {
                        ressources: false,
                        affectation: true
                    }

                    this.refreshPage(page);
                    break
                
                default: 
                    page = {
                        ressources: false,
                        affectation: false
                    }

                    this.refreshPage(page);
            }
        },

        /**
         * Récupère une liste de ressources rh type et l'enregistre dans le store
         */
        getRessourcesRHType() {
            let urlApi = "/ressourcesRHType/GET/list";

            this.$app.apiGet(urlApi)
            .then((data) => {
                this.refreshRessourcesRHType(data);

                this.pending.ressources_rh_type=false;
            }).catch(this.$app.catchError);
        },

        /**
         * met à jour la variable link avec l'url en cours
         */
        updateLink() {
            this.link = window.location.href;
        }
    },


    mounted() {
        this.$app.addEventListener('structureChanged', (structureId) => {
			this.switchStructure(structureId);
		});
    }

}
</script>