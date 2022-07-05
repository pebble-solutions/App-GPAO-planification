<template>
    <li class="nav-item" :class="className">
       <slot></slot>
   </li>
</template>

<script>
export default ({
    props: {
        classList: String
    },
    
    computed: {
        /**
         * Retourne la propriété classList ou ne retourne rien.
         * @returns {String}
         */
        className() {
            return this.classList ?? "";
        }
    }
})
</script>
