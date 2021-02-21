import FmsParser from './components/parser/Parser.vue'
import FmsGenerator from './views/index/Home.vue'
import Vue from 'vue'

// Vue.components = {
//     FmsParser,
//     FmsGenerator
// }
Vue.component("FmsParser", FmsParser)
Vue.component("FmsGenerator", FmsGenerator)
// Vue.use(FmsParser, FmsGenerator)

export default {
    FmsParser,
    FmsGenerator
}