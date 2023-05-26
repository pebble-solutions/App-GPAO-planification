<template>
    <div class="list-group-item">
        <div class="form-check text-nowrap">
            <input type="checkbox" class="form-check-input" :id="'ckb-ressource-'+ressource.id" v-model="checked" :aria-label="ressource.nom" :name="ressource.nom" @click="changeStatus()">

            <label class="form-check-label" :for="'ckb-ressource-'+ressource.id">
                <h6>{{ressource.nom}}</h6>
            </label>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        ressource: {
            type: Object,
            required: true
        },
        ischecked: {
            type: Boolean,
            required: true
        }
    },

    emits: [
        'update-checked'
    ],

    data() {
        return {
            checked: false,
        }
    },

    methods: {
        changeStatus() {
            this.checked = !this.checked;
            this.$emit('update-checked', this.ressource.id);
        }
    },

    beforeMount() {
        this.checked = this.ischecked;
    },
}

</script>