<template>
    
    <div :class="containerClass">
        <div class="" :class="imageContainerClass">
            <user-image :name="imageName" :size="size" />
        </div>
        
        <h2 :class="nameContainerClass" v-if="useTitle">{{ name }}</h2>
        <div :class="nameContainerClass" v-else>{{ name }}</div>
    </div>

</template>

<script>
import UserImage from '../pebble-ui/UserImage.vue';

export default {
    components: { UserImage },
    props: {
        personnel: Object,
        defaultName: {
            type: String,
            default: "Personnel non trouvé"
        },
        display: {
            type: String,
            default: "horizontal"
        },
        size: String,
        showMatricule: {
            type: Boolean,
            default: false
        },
        useTitle: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        /**
         * Retourne le nom du personnel ou ? si le personnel n'a pas de nom qui servira à l'image du personnel.
         * 
         * @return {string}
         */
        imageName() {
            return this.personnel?.cache_nom ? this.personnel.cache_nom : "?";
        },

        /**
         * Retourne le nom du personnel à afficher.
         * Si le personnel n'a pas de nom, retourne la valeur par défaut de remplacement (defaultName)
         * 
         * @return {string}
         */
        name() {
            return this.personnel?.cache_nom ? this.personnel.cache_nom : this.defaultName;
        },

        /**
         * Retourne les classes CSS du container en fonction de la configuration display
         * 
         * @return {string}
         */
        containerClass() {

            let classList = "";

            if (this.display == 'horizontal')  {
                classList += "d-flex align-items-center";
            }

            return classList;

        },

        /**
         * Retourne les classes CSS du container d'image en fonction de la configuration display
         * 
         * @return {string}
         */
        imageContainerClass() {

            let classList = "";

            if (this.display == 'horizontal') {
                classList += "me-2";
            }
            else {
                classList += "my-2"
            }

            return classList;

        },

        /**
         * Retourne les classes CSS du container de nom en fonction de la configuration display
         * 
         * @return {string}
         */
        nameContainerClass() {

            let classList = "";

            if (this.display == 'vertical') {
                classList += "my-2";
            }

            return classList;

        }
    }
}

</script>