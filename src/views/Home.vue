<template>
	<div class="py-2" v-if="$store.state.login">
		<div class="text-center">
			Choisir dans le menu l'element qui convient 
		</div>
	</div>
</template>

<style lang="scss" scoped>
.logo {
	max-width:360px;
	display:block;
	margin:20px auto;
}
</style>

<script>

import {mapState} from 'vuex';

export default {
	name: 'Home',

	data() {
		return {
			pending: {
				element: false
			}
		}
	},

	computed: {
		...mapState(['tmpElement'])
	},

	methods: {
		/**
		 * Enregistre un nouvel élément.
		 * Étape 1 : appel la fonction record
		 * Étape 2 : enregistre la modification dans le store
		 * Étape 3 : redirige la route vers le nouvel élément
		 */
		recordNew() {
			this.$app.record(this, this.tmpElement, {
				id: 0,
				pending: this.pending.element
			}).then((data) => {
				console.log(data);
				this.$store.dispatch('refreshElements', {
					elements: [data]
				});
				this.$router.push('/element/'+data.id);
			}).catch(this.$app.catchError);
		}
	},

	mounted() {
		this.$store.commit('tmpElement', {
			name: '',
			description: ''
		});
	}
}
</script>
