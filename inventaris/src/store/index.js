import { createStore } from 'vuex'
import axios from 'axios'
import auth from './modules/auth'
import barang from './modules/barang'
import category from './modules/category'
import status from './modules/status'
import user from './modules/user'

export default createStore({
  state: {
    searchLoading: false,
    btnLoading: false,
    formErrors: [],
    barang_lab: [],
    show_lab: []
  },
  mutations: {
    SET_BUTTON_LOADING(state, status){
      state.btnLoading = status
    },
    SET_SEARCH_LOADING(state, status){
      state.searchLoading = status
    },
    SET_BARANG_LAB(state, status){
      state.barang_lab = status
    },
    SET_SHOW_BARANG_LAB(state, status){
      state.show_lab = status
    },
    SET_FORM_ERRORS(state, errors){
      state.formErrors = errors
    },
  },
  actions: {
    async allBarang({commit}){
      let barang = await axios.get(`all-barang`).then(res => {
        commit('SET_BARANG_LAB', res.data)
        return res
      }).catch(err => {
        return err.response
      })

      return barang
    },
    async searchAllBarang({commit}, data){
      commit('SET_SEARCH_LOADING', true, {root: true})
      try{
          let res = await axios.get(`all-barang/search/${data.keyword}`) 
          commit('SET_SEARCH_LOADING', false, {root: true})
          commit('SET_BARANG_LAB', res.data)
          return res.data
      }catch(err){
          commit('SET_SEARCH_LOADING', false, {root: true})
          return err
      }
    },
    async searchShowBarang({commit}, data){
      commit('SET_SEARCH_LOADING', true, {root: true})
      try{
          let res = await axios.get(`all-barang/search/${data.keyword}/${data.type}`) 
          commit('SET_SEARCH_LOADING', false, {root: true})
          commit('SET_SHOW_BARANG_LAB', res.data)
          return res.data
      }catch(err){
          commit('SET_SEARCH_LOADING', false, {root: true})
          return err
      }
    },
    async showAllBarang({commit}, type){
      let barang = await axios.get(`all-barang/${type}`).then(res => {
        commit('SET_SHOW_BARANG_LAB', res.data)
        return res
      }).catch(err => {
        return err.response
      })

      return barang
    },
    async chartCategories(){
      let categories = await axios.get(`chart-categories`).then(res => {
        return res
      }).catch(err => {
        return err.response
      })

      return categories
    },
    async chartBarang(){
      let categories = await axios.get(`chart-barang`).then(res => {
        return res
      }).catch(err => {
        return err.response
      })

      return categories
    },
    async downloadPdf({commit}){
      commit('SET_BUTTON_LOADING', true, {root: true})
      let pdf = await axios.get(`pdf`).then(res => {
        commit('SET_BUTTON_LOADING', false, {root: true})
        return window.location.href = res.data.pdf;
      }).catch(err => {
        commit('SET_BUTTON_LOADING', false, {root: true})
                window.notyf.error(err.response.data.message)
        return err.response
      })
      return pdf
    },
    async downloadPdfShow({commit}, url){
      commit('SET_BUTTON_LOADING', true, {root: true})
      let pdf = await axios.get(`pdf/${url}`).then(res => {
        commit('SET_BUTTON_LOADING', false, {root: true})
        return window.location.href = res.data.pdf;
      }).catch(err => {
        commit('SET_BUTTON_LOADING', false, {root: true})
        return err.response
      })
      return pdf
    }
  },
  getters: {
    barang_lab(state){
      return state.barang_lab
    },
    show_lab(state){
      return state.show_lab
    },
    btnLoading(state){
      return state.btnLoading
    },
    searchLoading(state){
      return state.searchLoading
    },
    formErrors(state){
      return state.formErrors
    }
  },
  modules: {
    auth,
    barang,
    category,
    status,
    user
  }
})
