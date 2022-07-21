<template>

	<AppWrapper
		:cfg="cfg"
		:cfg-menu="cfgMenu"
		:cfg-slots="cfgSlots"
		
		@auth-change="setLocal_user"
		@structure-change="switchStructure">

		<template v-slot:header>
			<div class="d-flex align-items-center" v-if="isRessources && projet">
				<router-link :to="{name:'EditProjet', params:{id:'419'}}" custom v-slot="{navigate, href}">
					<a :href="href" @click="navigate" class="btn btn-dark mx-2">{{projet.intitule}} <i class="bi bi-pencil-fill"></i></a>
				</router-link>

				<router-link :to="{name:'ConfigHeures', params:{id:'419'}}" custom v-slot="{navigate, href}">
					<a :href="href" @click="navigate" class="btn btn-secondary mx-2"><i class="bi bi-clock-fill"></i> Heure de travail</a>
				</router-link>
				
				<router-link :to="{name:'Affectations'}" custom v-slot="{navigate, href}">
					<a :href="href" @click="navigate" class="btn btn-primary mx-2"><i class="bi bi-person-check-fill"></i> Affecter du personnel</a>
				</router-link>

				<router-link :to="{name:'EditTimeline', params:{id:'419'}}" custom v-slot="{navigate, href}">
					<a :href="href" @click="navigate" class="btn btn-secondary mx-2"><i class="bi bi-calendar3"></i> {{getDateHuman(timeline.start)}} <i class="bi bi-chevron-compact-right"></i> {{getDateHuman(timeline.end)}}</a>
				</router-link>
			</div>


			<div class="d-flex align-items-center" v-if="isAffectation">

                <router-link :to="{name:'AddProjets'}" custom v-slot="{navigate, href}">
                    <a :href="href" class="btn btn-secondary mx-2" @click="navigate">
						<i class="bi bi-diagram-2-fill"></i> 
						{{projetsList.length}} Projet<span v-if="projetsList.length > 1">s</span>
					</a>
                </router-link>

                <router-link :to="{name:'AddMetiers'}" custom v-slot="{navigate, href}">
                    <a :href="href" class="btn btn-secondary mx-2" @click="navigate">
						<i class="bi bi-briefcase"></i>
						{{metiersList.length}} Metier<span v-if="metiersList.length > 1">s</span>
					</a>
                </router-link>
                
				<router-link :to="{name:'EditTimelineAffectation'}" custom v-slot="{navigate, href}">
					<a :href="href" @click="navigate" class="btn btn-secondary mx-2">
						<i class="bi bi-calendar3"></i> 
						{{getDateHuman(timeline.start)}} <i class="bi bi-chevron-compact-right"></i> {{getDateHuman(timeline.end)}}
					</a>
				</router-link>

                <div class="mx-2">
                    <a href="#!affectation/partager" class="btn btn-primary"><i class="bi bi-box-arrow-up-right"></i> Partager</a>
                </div>
            </div>

		</template>


		<template v-slot:menu>
			<AppMenu>
				<AppMenuItem href="/" look="dark" icon="bi bi-house">Accueil</AppMenuItem>
				<AppMenuItem href="/ressources/419" look="dark" icon="bi bi-boxes">Ressources</AppMenuItem>
				<AppMenuItem href="/affectations" look="dark" icon="bi bi-person-plus-fill">Affectations</AppMenuItem>
				<AppMenuItem href="/planning" look="dark" icon="bi bi-calendar2">Planning</AppMenuItem>
			</AppMenu>
		</template>

		<template v-slot:list>
			<SideBarAffectation v-if="isAffectation"></SideBarAffectation>
		</template>

		<template v-slot:core>
			<div class="px-2 bg-light">
				<router-view v-if="isConnectedUser" :cfg="cfg" :timeline="timeline" :projets-list="projetsList" :metiers-list="metiersList" @obj-projet="updateProjet" @update-timeline="updateTimeline" />
			</div>
		</template>

	</AppWrapper>
	
</template>

<script>

import AppWrapper from '@/components/pebble-ui/AppWrapper.vue'
import AppMenu from '@/components/pebble-ui/AppMenu.vue'
import AppMenuItem from '@/components/pebble-ui/AppMenuItem.vue'
import SideBarAffectation from '@/components/SideBarAffectation.vue'
// import { mapActions, mapState } from 'vuex'

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
			},
			isConnectedUser: false,
			projet:null,
			timeline: {
				start:null,
				end:null,
				now: new Date()
			},
			projetsList: [],
			metiersList: []
		}
	},

	computed: {
		// ...mapState(['elements', 'openedElement'])
		isRessources() {
			if(	this.$route.name === 'Ressources' || 
				this.$route.name === 'AjoutGroup' || 
				this.$route.name === 'ConfigHeures' || 
				this.$route.name === 'EditProjet' || 
				this.$route.name === 'EditTimeline' ||
				this.$route.name === 'AjoutBesoins') 
			{
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
				return true;
			}

			return false;
		}
	},

	methods: {
		/**
		 * Retourne la représentation d'une date lisible par un humain.
		 * @param {DateTime} date Date à analyser
		 * @param {String} fallbackText Texte à afficher au cas ou date est non renseigné (défaut '')
		 * @returns {String}
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
		 * @param {String} action 'update' (défaut), 'replace', 'remove'
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
		 * @param {Integer} structureId
		 */
		switchStructure(structureId) {
			this.$router.push('/');
			this.$store.dispatch('switchStructure', structureId);
			this.listElements();
		},

		/**
		 * Met a jour l'objet projet
		 * @param {Objet} projet
		 */
		updateProjet(projet) {
			this.projet = projet;
		},

		/**
		 * Get object timeline from $emit and update this.timeline
		 * @param {Object} timeline 
		 */
		updateTimeline(timeline) {
			this.timeline = timeline;
		}
	},

	components: {
		AppWrapper,
		AppMenu,
		AppMenuItem,
		SideBarAffectation
	},

	mounted() {
		this.timeline.start = new Date();
        this.timeline.start = this.timeline.start.getMonday();

        this.timeline.end = new Date(this.timeline.start);
        this.timeline.end.setDate(this.timeline.start.getDate() + 28);
	}


}
</script>