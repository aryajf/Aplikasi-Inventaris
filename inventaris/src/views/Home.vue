<template>
    <div>
        <div class="bg-light p-4 rounded">
            <h4 data-aos="flip-right" class="alert-heading mb-3">Halo {{ user.role }} 👋</h4>
            <p>
                Halo {{ user.nama }}, selamat datang di aplikasi inventaris psikologi
            </p>
            <hr>
            <p class="mb-0">Disini kamu sebagai {{ user.role }} dapat kelola seluruh barang yang dibutuhkan semisal alat tulis dan sebagainya.</p>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters({
            user: 'auth/user',
        }),
    },
}
</script>
<style lang="scss">
@import "@/assets/sass/app.scss";
</style>