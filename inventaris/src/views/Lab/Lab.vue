<template>
    <div class="bg-white admin-wrapper">
        <AdminHeader />
        <chart />
        <div class="row">
            <div class="col-12">
                <template v-if="barang.barang && barang.totalItems != 0 && barang.length != 0">
                    <h4 class="text-center my-3">Jumlah Data Barang</h4>
                    <div class="d-flex justify-content-between">
                        <Button type="button" label="Unduh Laporan" icon="pi pi-download" iconPos="right" :loading="btnLoading" @click="downloadPdf()"  />
                    </div>
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
                <template v-else>
                    <Message :closable="false" severity="info">Barang belum ditambahkan</Message>
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
            btnLoading: "btnLoading",
            user: 'auth/user',
        }),
    },
    created(){
        this.getBarang()
    },
    components: { Chart, AdminHeader },
    methods: {
        downloadPdf(){
            this.$store.dispatch('downloadPdf')
        },
        getBarang(){
            this.$store.dispatch('allBarang')
        }
    }
}
</script>
<style lang="scss">
@import "@/assets/sass/app.scss";
</style>