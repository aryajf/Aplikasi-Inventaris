<template>
    <div class="bg-white admin-wrapper">
        <AdminHeader />
        <!-- <chart :type="type" /> -->
        <div class="row my-3">
            <div class="col-12">
                <div class="d-flex justify-content-between">
                    <div class="form-group">
                        <div class="row" v-if="user.role === 'Admin'">
                            <div class="col-md-7">
                                <div class="p-input-icon-right w-100">
                                    <i class="pi pi-spin pi-spinner" v-if="searchLoading" />
                                    <i class="pi pi-search" v-else />
                                    <InputText type="text" class="w-100" placeholder="Cari riwayat disini" v-model="keyword" />
                                </div>
                            </div>
                            <div class="col-md-5">
                                <Dropdown :filter="true" v-model="type" :options="types" optionLabel="name" placeholder="Pilih Tipe" class="w-100" />
                            </div>
                        </div>
                        <div class="row" v-else>
                            <div class="col-md-12">
                                <div class="p-input-icon-right w-100">
                                    <i class="pi pi-spin pi-spinner" v-if="searchLoading" />
                                    <i class="pi pi-search" v-else />
                                    <InputText type="text" class="w-100" placeholder="Cari riwayat disini" v-model="keyword" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button v-if="history.history && history.totalItems != 0 && history.length != 0" type="button" label="Unduh Laporan" icon="pi pi-download" iconPos="right" :loading="btnLoading" @click="downloadPdfHistory()"/>
                </div>
                <div class="table-responsive" v-if="history.history && history.totalItems != 0 && history.length != 0">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col" class="th-1">#</th>
                                <th scope="col" class="th-1"><i class="uil uil-box me-2"></i>Nama</th>
                                <th scope="col" class="th-1"><i class="uil uil-box me-2"></i>Tersedia</th>
                                <th scope="col" class="th-1"><i class="uil uil-box me-2"></i>Dipakai</th>
                                <th scope="col" class="th-1"><i class="uil uil-box me-2"></i>Rusak</th>
                                <th scope="col" class="th-1"><i class="uil uil-user me-2"></i>Ditambahkan oleh</th>
                                <th scope="col" class="th-1"><i class="uil uil-user me-2"></i>Diupdate pada</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(history, index) in history.history" :key="history.id">
                                <td class="fw-bold text-center">{{ index+1 }}</td>
                                <td class="fw-bold text-center">
                                    <div class="mb-1"><router-link :to="`/barang/${history.barang.id}`">{{history.barang.title}}</router-link></div>
                                    <div><span class="badge bg-purple">Lab {{history.barang.type}}</span></div>
                                </td>
                                <td class="fw-bold text-center">{{history.tersedia}}</td>
                                <td class="fw-bold text-center">{{history.dipakai}}</td>
                                <td class="fw-bold text-center">{{history.rusak}}</td>
                                <td class="fw-bold text-center" v-if="history.user">
                                    <div class="mb-1">{{history.user.nama}}</div>
                                    <div><a :href="'mailto:'+history.user.email" class="text-decoration-none d-block mb-1" title="Send Email">{{history.user.email}} <i class="uil uil-share ms-1"></i>
                                    </a></div>
                                    <div v-if="history.user.phone" class="badge bg-light text-dark">
                                        <i class="uil uil-phone-alt me-1"></i>
                                        <a :href="'https://api.whatsapp.com/send?phone=62'+history.user.phone" target="_blank" v-if="history.user.phone !== null">+62 {{history.user.phone}}</a>
                                        <span v-else>belum ditambahkan</span>
                                    </div>
                                    <div v-else class="badge bg-light text-dark">
                                        <i class="uil uil-phone-alt me-1"></i>
                                        <span>belum ditambahkan</span>
                                    </div>
                                </td>
                                <td class="fw-bold text-center">
                                    {{DateFormat(history.updatedAt)}}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Message v-else :closable="false" severity="info">Riwayat belum ditambahkan</Message>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AdminHeader from '@/components/layouts/AdminHeader.vue'
import Chart from '@/components/layouts/Chart.vue'
export default {
    data() {
        return {
            keyword: '',
            type: {name: ''},
            types: [
                {name: 'Semua Tipe'},
                {name: 'Dasar'},
                {name: 'Menengah'},
                {name: 'Lanjut'}
            ],
        }
    },
    watch: {
        type() {
            this.getHistory()
        },
        keyword() {
            this.getHistory()
        },
    },
    computed: {
        ...mapGetters({
            history: 'history',
            searchLoading: "searchLoading",
            btnLoading: "btnLoading",
            user: 'auth/user',
        }),
    },
    created(){
        this.getHistory()
    },
    components: { Chart, AdminHeader },
    methods: {
        downloadPdfHistory(){
            this.$store.dispatch('downloadPdfHistory',
            {
                type: this.type.name,
                keyword: this.keyword
            }
            )
        },
        getHistory(){
            this.$store.dispatch('allHistory',
            {
                type: this.type.name,
                keyword: this.keyword
            }
            )
        }
    }
}
</script>
<style lang="scss">
@import "@/assets/sass/app.scss";
</style>