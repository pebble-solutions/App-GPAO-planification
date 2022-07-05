<template>
    <div class="bg-light border-bottom py-1 d-flex align-items-center justify-content-between" :class="className" :id="id+'AppToolbar'" :style="styleName">
        <ul class="nav mx-2">
            <slot></slot>
        </ul>

        <ul class="nav mx-2" v-if="slots.aside">
            <slot name="aside"></slot>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        id: String,
        classList: String,
        styleList: String,
        cfgSlots: Object
    },


    data() {
        return {
            slots: {
                aside: true
            }
        }
    },
    
    computed: {
        /**
         * Retourne la propriété classList ou ne retourne rien.
         * @returns {String}
         */
        className() {
            return this.classList ?? "";
        },

        /**
         * Retourne la propriété style ou ne retourne rien.
         * @returns {String}
         */
        styleName() {
            return this.styleList ?? "";
        }
    },

    mounted() {
        for (const key in this.cfgSlots) {
            this.slots[key] = this.cfgSlots[key];
        }
    }
}
</script>