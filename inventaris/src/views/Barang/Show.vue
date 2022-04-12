<template>
    <div>
        <DeleteModal v-if="barang" :barang_id="barang.id"></DeleteModal>
        <div class="container-fluid" v-if="barang">
            <div class="barang-box mb-3 bg-light rounded-top">
                <div v-if="user.role != 'Admin'" class="d-flex justify-content-between align-items-center mb-2">
                    <router-link class="text-info fs-4" :to="'/barang/edit/'+url"><i class="uil uil-edit-alt me-1"></i></router-link>
                    <a href="#" class="text-danger fs-4" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="uil uil-trash-alt"></i></a>
                </div>
                <div class="row">
                    <div class="col-md-4 col-12">
                        <img v-if="barang.gambar" :src="`${apiURL}images/barang/${barang.gambar}`" class="w-100" alt="gambar">
                        <img v-else src="@/assets/images/image-not-available.png" class="w-100" alt="gambar">
                    </div>
                    <div class="col-md-8 col-12 barang-box-heading">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h5 v-if="user.role == 'Admin'">Lab {{barang.type}}</h5>
                                <h2>{{barang.title}}</h2>
                            </div>
                            <div>
                                <h5 v-if="barang.category">{{barang.category.title}}</h5>
                            </div>
                        </div>
                        <p class="mt-1" v-html="barang.description"></p>
                    </div>
                </div>
                <div class="mt-2">
                    <span class="badge bg-purple py-2">Dibuat pada: {{DateFormat(barang.createdAt)}}</span>
                </div>
                <div class="mt-2">
                    <span class="badge bg-purple py-2">Diupdate pada: {{DateFormat(barang.updatedAt)}}</span>
                </div>
                <div class="row mt-2">
                    <div class="col-md-4 col-12 mb-3">
                        <div class="count-box d-flex justify-content-between align-items-center bg-purple">
                            <div>Total Stok</div>
                            <div class="stock" v-if="!isNaN(parseInt(barang.tersedia) + parseInt(barang.dipakai) + parseInt(barang.rusak))">{{ parseInt(barang.tersedia) + parseInt(barang.dipakai) + parseInt(barang.rusak) }}</div>
                            <div class="stock" v-else>Tidak Valid</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="barang-box bg-light rounded-top">
                <form action="#" @submit.prevent="updateStok">
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <div><label for="withoutgrouping">Stok Tersedia <span class="text-danger text-sm" v-if="formErrors.tersedia">*{{formErrors.tersedia[0]}}</span></label></div>
                            <input v-if="user.role != 'Admin'" type="text" class="form-control" :class="{'is-invalid': formErrors.tersedia && formErrors.tersedia.length > 0}" placeholder="Stok Tersedia" v-model="barang.tersedia">
                            <div v-else>{{barang.tersedia}}</div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div><label for="withoutgrouping">Stok Dipakai <span class="text-danger text-sm" v-if="formErrors.dipakai">*{{formErrors.dipakai[0]}}</span></label></div>
                            <input v-if="user.role != 'Admin'" type="text" class="form-control" :class="{'is-invalid': formErrors.dipakai && formErrors.dipakai.length > 0}" placeholder="Stok Dipakai" v-model="barang.dipakai">
                            <div v-else>{{barang.dipakai}}</div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div><label for="withoutgrouping">Stok Rusak <span class="text-danger text-sm" v-if="formErrors.rusak">*{{formErrors.rusak[0]}}</span></label></div>
                            <input v-if="user.role != 'Admin'" type="text" class="form-control" :class="{'is-invalid': formErrors.rusak && formErrors.rusak.length > 0}" placeholder="Stok Rusak" v-model="barang.rusak">
                            <div v-else>{{barang.rusak}}</div>
                        </div>
                        <div v-if="user.role != 'Admin'" class="col-md-4 mb-3">
                            <button type="submit" class="btn bg-purple btn-sm d-flex" :disabled="btnLoading">
                                Simpan
                                <template v-if="btnLoading">
                                    <Pulse />
                                </template>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div class="barang-box bg-light rounded-top mt-3">
                <div class="row">
                    <div class="col">
                        <template v-if="barang.histories && barang.histories.length !== 0">
                            {{ barang.histories }}
                        </template>
                        <template v-else>
                            <Message :closable="false" severity="info">Stok belum ditambahkan</Message>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import DeleteModal from '@/components/modals/Delete.vue'
import Pulse from "@/components/loader/Pulse.vue"
import { mapGetters } from "vuex"
import config from "@/config/app"
export default {
    data(){
        return{
            apiURL: config.apiURL,
            url: null,
        };
    },
    components: {DeleteModal, Pulse},
    computed: {
        ...mapGetters({
            btnLoading: "btnLoading",
            formErrors: "formErrors",
            barang: "barang/barang",
            user: "auth/user",
        }),
    },
    mounted(){
        this.url = this.$route.params.id;
        this.getBarang()
    },
    created() {
        this.$watch(
            () => this.$route.params,
                () => {
                    this.url = this.$route.params.id;
                    this.getBarang()
                }
            )
    },
    methods: {
        getBarang() {
            this.$store.dispatch("barang/show", this.$route.params.id)
        },
        updateStok() {
            this.$store
                .dispatch("barang/updateStok", [
                    this.$route.params.id,
                    this.barang,
                ])
        },
    }
}
</script>
<style lang="scss">
@import '@/assets/sass/app.scss';
@import '@/assets/sass/form.scss';
@import '@/assets/sass/barang.scss';
</style>