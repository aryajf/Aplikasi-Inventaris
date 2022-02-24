import moment from "moment/min/moment-with-locales"
import AOS from 'aos'
import 'aos/dist/aos.css'

const Mixins = {
    mounted() {
        AOS.init({ })
        moment.updateLocale('id', {
            relativeTime : {
            future: "%s lagi",
            past:   "%s lalu",
            }
        })
    },
    methods: {
        DateFormat(item) {
            return moment(item).locale('id').format('L, LTS')
        },
        DateFormatExpired(item) {
            return moment(item, 'YYYYMMDD').locale('id').fromNow()
        },
        NumberFormat(num) {
            return Number(num).toLocaleString()
        }
    },
}

export default Mixins