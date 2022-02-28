<template>
    <div class="bg-white admin-wrapper">
        <AdminHeader />
        <div class="row d-flex justify-content-around">
            <div class="col-12 col-md-5 mb-3">
                <chart />
            </div>
            <div class="col-12">
                <h4 class="text-center my-3">Jumlah Data Barang</h4>
                <template v-if="barang.barang && barang.totalItems != 0">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col" class="th-1">#</th>
                                    <th scope="col" class="th-1"><i class="uil uil-package me-2"></i>Nama</th>
                                    <th scope="col" class="th-1"><i class="uil uil-tag-alt me-2"></i>Kategori</th>
                                    <th scope="col" class="th-1"><i class="uil uil-box me-2"></i>Jumlah Lab Dasar</th>
                                    <th scope="col" class="th-1"><i class="uil uil-box me-2"></i>Jumlah Lab Menengah</th>
                                    <th scope="col" class="th-1"><i class="uil uil-box me-2"></i>Jumlah Lab Lanjut</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(barang, index) in barang.barang" :key="barang.id">
                                    <td class="fw-bold text-center">{{ index+1 }}</td>
                                    <td class="text-center"><router-link :to="'/barang/'+barang.slug">{{barang.title}}</router-link></td>
                                    <td class="text-center">{{barang.category}}</td>
                                    <td class="fw-bold text-center">{{barang.dasar}}</td>
                                    <td class="fw-bold text-center">{{barang.menengah}}</td>
                                    <td class="fw-bold text-center">{{barang.lanjut}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AdminHeader from '@/components/layouts/AdminHeader.vue'
import Chart from '@/components/layouts/Chart.vue'
export default {
    computed: {
        ...mapGetters({
            barang: 'barang_lab',
            user: 'auth/user',
        }),
    },
    created(){
        this.getBarang()
    },
    components: { Chart, AdminHeader },
    methods: {
        getBarang(){
            this.$store.dispatch('allBarang')
        }
    }
}
</script>
<style lang="scss">
@import "@/assets/sass/app.scss";
</style>