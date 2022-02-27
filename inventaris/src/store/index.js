import { createStore } from 'vuex'
import auth from './modules/auth'
import barang from './modules/barang'
import category from './modules/category'
import status from './modules/status'
import user from './modules/user'

export default createStore({
  state: {
    btnLoading: false,
    formErrors: []
  },
  mutations: {
    SET_BUTTON_LOADING(state, status){
      state.btnLoading = status
    },
    SET_FORM_ERRORS(state, errors){
      state.formErrors = errors
    },
  },
  actions: {
  },
  getters: {
    btnLoading(state){
      return state.btnLoading
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
