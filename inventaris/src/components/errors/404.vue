<template>
    <div class="container-fluid" id="notfound">
        <div class="notfound-container d-flex flex-column justify-content-center align-items-center">
            <img src="@/assets/images/not-found.png" alt="" srcset="">
            <h1>404 NOT FOUND</h1>
            <p>Halaman yang anda cari tidak ditemukan</p>
            <div class="d-flex justify-content-center">
                <router-link to="/"><Button label="Kembali ke Halaman Utama" icon="pi pi-arrow-left" iconPos="left" /></router-link>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
    @import "@/assets/sass/notfound.scss";
</style>