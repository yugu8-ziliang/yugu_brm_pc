const state = {
    editCommodityData: {},
    addNewrequestData: {},
    addSalesCommodityData: {},
    homePanelList: []
}

const mutations = {
    edit_Commodity_Data: (state, data) => {
        state.editCommodityData = data
    },
    add_Newrequest_Data: (state, data) => {
        state.addNewrequestData = data
    },
    add_SalesCommodity_Data: (state, data) => {
        state.addSalesCommodityData = data
    },
    set_index_panel_sort: (state, data) => {
        state.indexPanelList = data
    },
}

const actions = {
    editCommodityData({
        commit
    }, data) {
        commit('edit_Commodity_Data', data)
    },
    addNewrequestData({
        commit
    }, data) {
        commit('add_Newrequest_Data', data)
    },
    addSalesCommodityData({
        commit
    }, data) {
        commit('add_SalesCommodity_Data', data)
    },
    setIndexPanelSort({
        commit
    }, data) {
        commit('set_index_panel_sort', data)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}