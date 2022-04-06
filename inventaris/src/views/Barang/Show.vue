<template>
    <div>
        <DeleteModal v-if="barang" :barang_slug="barang.slug"></DeleteModal>
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
                        <div class="d-flex justify-content-between align-items-center">
                            <h2>{{barang.title}}</h2>
                            <h5 v-if="barang.category">{{barang.category.title}}</h5>
                        </div>
                        <p class="mt-1" v-html="barang.description"></p>
                    </div>
                </div>
                <div class="row mt-5">
                    <div class="col-md-4 col-12 mb-3">
                        <div class="count-box d-flex justify-content-between align-items-center bg-az">
                            <div>Total Stok</div>
                            <div class="stock">{{ barang.tersedia + barang.dipakai + barang.rusak }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="barang-box bg-light rounded-top">
                <form action="#" @submit.prevent="updateStok">
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <div><label for="withoutgrouping">Stok Tersedia</label></div>
                            <InputNumber v-if="user.role != 'Admin'" class="w-100" id="withoutgrouping" v-model="barang.tersedia" mode="decimal" placeholder="Stok Tersedia" :useGrouping="false" />
                            <div v-else>{{barang.tersedia}}</div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div><label for="withoutgrouping">Stok Dipakai</label></div>
                            <InputNumber v-if="user.role != 'Admin'" class="w-100" id="withoutgrouping" v-model="barang.dipakai" mode="decimal" placeholder="Stok Dipakai" :useGrouping="false" />
                            <div v-else>{{barang.dipakai}}</div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div><label for="withoutgrouping">Stok Rusak</label></div>
                            <InputNumber v-if="user.role != 'Admin'" class="w-100" id="withoutgrouping" v-model="barang.rusak" mode="decimal" placeholder="Stok Rusak" :useGrouping="false" />
                            <div v-else>{{barang.rusak}}</div>
                        </div>
                        <div class="col-md-4 mb-3">
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
        this.url = this.$route.params.slug;
        this.getBarang()
    },
    created() {
        this.$watch(
            () => this.$route.params,
                () => {
                    this.url = this.$route.params.slug;
                    this.getBarang()
                }
            )
    },
    methods: {
        getBarang() {
            this.$store.dispatch("barang/show", this.$route.params.slug)
        },
        updateStok() {
            this.$store
                .dispatch("barang/updateStok", [
                    this.$route.params.slug,
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