<template>
	<div class="container text-center py-2" v-if="$store.state.login">
		<div class="lead mb-3">
			Bienvenue dans l'application planner. Choissisez la fonctionnalité qui vous intéresse.
		</div>

		<div class="d-flex justify-content-evenly align-items-center">
			<router-link :to="{name: 'Ressources'}" custom v-slot="{navigate, href}">
				<a :href="href" @click="navigate" class="btn btn-outline-dark" role="button">
					<div class="row">
						<i class="bi bi-boxes fs-1"></i>
						<span>Programmation des besoins</span>
					</div>
				</a>			
			</router-link>
	
			<router-link :to="{name: 'Affectations'}" custom v-slot="{navigate, href}">
				<a :href="href" @click="navigate" class="btn btn-outline-dark" role="button">
					<div class="row">
						<i class="bi bi-person-add fs-1"></i>
						<span>Affectation de personnel</span>
					</div>
				</a>			
			</router-link>
	
			<router-link :to="{name: 'Planning'}" custom v-slot="{navigate, href}">
				<a :href="href" @click="navigate" class="btn btn-outline-dark" role="button">
					<div class="row">
						<i class="bi bi-calendar2 fs-1"></i>
						<span>Planning du personnel</span>
					</div>
				</a>			
			</router-link>
		</div>
	</div>
</template>

<script>
import {mapState} from 'vuex';

export default {
	name: 'Home',

	data() {
		return {
			pending: {
				element: false,
				projets: true
			},
			projet_id: 0,
		}
	},

	computed: {
		...mapState(['tmpElement']),
	},
}
</script>
