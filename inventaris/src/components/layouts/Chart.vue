<template>
    <div>
        <h4 class="text-center my-3">Jumlah barang berada di kategori</h4>
        <Chart type="pie" :data="productData" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import InputNumber from 'primevue/inputnumber'
import moment from 'moment'
import Chart from 'primevue/chart'
export default {
    created() {
        this.getProducts()
    },
    computed: {
        ...mapGetters({
            btnLoading: 'btnLoading',
        }),
    },
    methods: {
        getProducts() {
            this.$store.dispatch("allCategories").then(res => {
                if(res.status === 200){
                    this.productData = {
                        labels: res.data.categoriesName,
                        datasets: [
                            {
                                data: res.data.categoriesStock,
                                backgroundColor: res.data.categoriesColor
                            },
                        ]
                    }
                }
            })
        },
    },
    components: { Chart, InputNumber },
    data() {
        return {
            year: parseInt(moment(new Date()).format('YYYY')),
            paymentData: null,
            productData: null,
        }
    }
}
</script>