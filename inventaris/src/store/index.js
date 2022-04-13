import { createStore } from 'vuex'
import axios from 'axios'
import auth from './modules/auth'
import barang from './modules/barang'
import category from './modules/category'
import user from './modules/user'

export default createStore({
  state: {
    searchLoading: false,
    btnLoading: false,
    formErrors: [],
    barang_lab: [],
    history: [],
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
    SET_HISTORY(state, status){
      state.history = status
    },
    SET_FORM_ERRORS(state, errors){
      state.formErrors = errors
    },
  },
  actions: {
    async allBarang({commit}, data){
      try{
        let res
        if(data){
          if(data.page == undefined){
            data.page = 0
          }
          res = await axios.get(`all-barang?type=${data.type}&page=${data.page}&keyword=${data.keyword}`)
        }else{
            res = await axios.get(`all-barang`)
        }
        commit('SET_BARANG_LAB', res.data)
        return res
      }catch(err){
          return err.response
      }
    },
    async allHistory({commit}, data){
      try{
        let res
        if(data){
          if(data.page == undefined){
            data.page = 0
          }
          res = await axios.get(`history?type=${data.type}&page=${data.page}&keyword=${data.keyword}`)
        }else{
            res = await axios.get(`history`)
        }
        commit('SET_HISTORY', res.data)
        return res
      }catch(err){
          return err.response
      }
    },
    async chartCategories(){
      let categories = await axios.get(`chart-categories`).then(res => {
        return res
      }).catch(err => {
        return err.response
      })

      return categories
    },
    async chartBarang(_, type){
      let barang = await axios.get(`chart-barang?type=${type}`).then(res => {
        return res
      }).catch(err => {
        return err.response
      })

      return barang
    },
    async chartType(){
      let types = await axios.get(`chart-type`).then(res => {
        return res
      }).catch(err => {
        return err.response
      })

      return types
    },
    async downloadPdf({commit}, {type, keyword}){
      commit('SET_BUTTON_LOADING', true, {root: true})
      let pdf = await axios.get(`pdf-barang?type=${type}&keyword=${keyword}`).then(res => {
        commit('SET_BUTTON_LOADING', false, {root: true})
        return window.location.href = res.data.pdf;
      }).catch(err => {
        commit('SET_BUTTON_LOADING', false, {root: true})
        window.notyf.error(err.response.data.message)
        return err.response
      })
      return pdf
    },
    async downloadPdfHistory({commit}, {type, keyword}){
      commit('SET_BUTTON_LOADING', true, {root: true})
      let pdf = await axios.get(`pdf-history?type=${type}&keyword=${keyword}`).then(res => {
        commit('SET_BUTTON_LOADING', false, {root: true})
        return window.location.href = res.data.pdf;
      }).catch(err => {
        commit('SET_BUTTON_LOADING', false, {root: true})
        window.notyf.error(err.response.data.message)
        return err.response
      })
      return pdf
    },
  },
  getters: {
    barang_lab(state){
      return state.barang_lab
    },
    history(state){
      return state.history
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
    user
  }
})
