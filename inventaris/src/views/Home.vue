<template>
    <div>
        <div class="bg-light p-4 rounded">
            <h4 data-aos="flip-right" class="alert-heading mb-3">Halo {{ user.role }} 👋</h4>
            <p>
                Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.
            </p>
            <hr>
            <p class="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
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
    }
}
</script>
<style lang="scss">
@import "@/assets/sass/home.scss";
</style>