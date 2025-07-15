import { createRouter, createWebHistory } from 'vue-router'
//Index View
import Home from '../views/Home.vue' //Home
import Roulette from '../views/Roulette.vue' //Roulette
import Katalog from '../views/Katalog.vue' //Katalog
import DetailKatalog from '../views/DetailKatalog.vue' //Detail Katalog
// Navbar
import Navbar from '../views/Dashboard/Navbar.vue'
import NavKatalog from '../views/Dashboard/NavKatalog.vue'
import NavSetting from '../views/Dashboard/NavSetting.vue'
import NavAdmin from '../views/Dashboard/NavAdmin.vue'
import Footer from '../views/Dashboard/Footer.vue'
//User
import UserLog from '../views/User/UserLog/UserLog.vue' //login
import UserReg from '../views/User/UserLog/UserReg.vue' //Register
import LupaPassUser from '../views/User/UserLog/LupaPassUser.vue' //Lupa Password User
import UbahPassUser from '../views/User/UserLog/UbahPassUser.vue' //Lupa Password User
import Retur from '../views/User/Retur/Retur.vue' //Retur
import HsRetur from '../views/User/Retur/HsRetur.vue' //Histori Retur
import DetailRetur from '../views/User/Retur/DetailRetur.vue' //Detail Retur
import Invoice from '../views/User/Invoice.vue' //Invoice
import UserSet from '../views/User/Profile/UserSet.vue' //User Setting
import Checkout from '../views/User/Checkout.vue' //Checkout
import Order from '../views/User/Profile/Order.vue' //Histori Transaksi
import DtOrder from '../views/User/Profile/DtOrder.vue' //Histori Transaksi
import Keranjang from '../views/User/Keranjang.vue' //Keranjang
//UserAdmin
import AdminLog from '../views/UserAdmin/AdminLog/AdminLog.vue' //Login
import AdminReg from '../views/UserAdmin/AdminLog/AdminReg.vue' //Register
import ListAdmin from '../views/UserAdmin/Laporan/ListAdmin.vue' //Login
import LupaPassAdmin from '../views/UserAdmin/AdminLog/LupaPassAdmin.vue' //Lupa Password Admin
import UbahPassAdmin from '../views/UserAdmin/AdminLog/UbahPassAdmin.vue' //Lupa Password Admin
import AdminDash from '../views/UserAdmin/AdminDash.vue' //Dashboard page Admin
import Barang from '../views/UserAdmin/Barang/Barang.vue' //View Tabel Barang
import BarangEdit from '../views/UserAdmin/Barang/BarangEdit.vue' //Form Edit Data Barang
import BarangTbh from '../views/UserAdmin/Barang/BarangTbh.vue' //Form Tambah Data Barang
import FormMsk from '../views/UserAdmin/Barang/FormMsk.vue' //Form Catat Barang Masuk
import FormKlr from '../views/UserAdmin/Barang/FormKlr.vue'//Form Catat Barang Keluar
import Expedisi from '../views/UserAdmin/Expedisi/Expedisi.vue' //View Tabel Expedisi
import ExpedisiEdit from '../views/UserAdmin/Expedisi/ExpedisiEdit.vue' //Edit Data Expedisi
import ExpedisiTbh from '../views/UserAdmin/Expedisi/ExpedisiTbh.vue' //Tambah Data Expedisi
import Kategori from '../views/UserAdmin/Kategori/Kategori.vue' //View Tabel Kategori
import KategoriEdit from '../views/UserAdmin/Kategori/KategoriEdit.vue' //Edit Data Kategori
import KategoriTbh from '../views/UserAdmin/Kategori/KategoriTbh.vue' //Tambah Data Kategori
import BarangKlr from '../views/UserAdmin/Laporan/BarangKlr.vue' //View Tabel BarangKlr
import BarangMsk from '../views/UserAdmin/Laporan/BarangMsk.vue' //View Tabel BarangMsk
import DetailPenjualan from '../views/UserAdmin/Laporan/DetailPenjualan.vue' //View Tabel Detail Penjualan
import Penjualan from '../views/UserAdmin/Laporan/Penjualan.vue' //View Tabel Transaksi Keseluruhan
import ReturMsk from '../views/UserAdmin/AdminRetur/ReturMsk.vue' //View Tabel List Retur Masuk Dari Pelanggan
import ReturDetail from '../views/UserAdmin/AdminRetur/ReturDetail.vue' //View Tabel List Detail Retur Masuk Dari Pelanggan

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/roulette',
      name: 'Roulette',
      component: Roulette,
    },
    {
      path: '/katalog',
      name: 'Katalog',
      component: Katalog,
    },
    {
      path: '/DetailKatalog/:id',
      name: 'DetailKatalog',
      component: DetailKatalog,
      props: true,
    },
    {
      path: '/Dashboard/Navbar',
      name: 'Navbar',
      component: Navbar,
    },
    {
      path: '/Dashboard/NavKatalog',
      name: 'NavKatalog',
      component: NavKatalog,
    },
    {
      path: '/Dashboard/Footer',
      name: 'Footer',
      component: Footer,
    },
    {
      path: '/Dashboard/NavSetting',
      name: 'NavSetting',
      component: NavSetting,
    },
    {
      path: '/Dashboard/NavAdmin',
      name: 'NavAdmin',
      component: NavAdmin,
    },

    {
      path: '/User/Retur/:id_order',
      name: 'Retur',
      component: () => import('@/views/User/Retur/Retur.vue'),
    },
    {
      path: '/User/Retur/DetailRetur',
      name: 'DetailRetur',
      component: DetailRetur,
    },
    {
      path: '/User/Retur/HsRetur',
      name: 'HsRetur',
      component: HsRetur,
    },
    {
      path: '/User/UserLog/UserLog',
      name: 'UserLog',
      component: UserLog,
    },
    {
      path: '/User/UserLog/LupaPassUser',
      name: 'LupaPassUser',
      component: LupaPassUser,
    },
    {
      path: '/User/UserLog/UbahPassUser',
      name: 'UbahPassUser',
      component: UbahPassUser,
    },
    {
      path: '/User/UserLog/UserReg',
      name: 'UserReg',
      component: UserReg,
    },
    {
      path: '/User/Profile/UserSet',
      name: 'UserSet',
      component: UserSet,
    },
    {
      path: '/User/Checkout',
      name: 'Checkout',
      component: Checkout,
    },
    {
      path: '/User/Profile/Order',
      name: 'Order',
      component: Order,
    },
    
    {
      path: '/User/Keranjang',
      name: 'Keranjang',
      component: Keranjang,
    },
    {
      path: '/User/Invoice',
      name: 'Invoice',
      component: Invoice,
    },
    {
      path: '/UserAdmin/Laporan/ListAdmin',
      name: 'ListAdmin',
      component: ListAdmin,
    },
    {
  path: '/user/order/:id',
  name: 'OrderDetail',
  component: () => import('../views/User/Profile/DtOrder.vue')

},



    {
      path: '/UserAdmin/AdminLog/AdminLog',
      name: 'AdminLog',
      component: AdminLog,
    },
    {
      path: '/UserAdmin/AdminLog/LupaPassAdmin',
      name: 'LupaPassAdmin',
      component: LupaPassAdmin,
    },
    {
      path: '/UserAdmin/AdminLog/UbahPassAdmin',
      name: 'UbahPassAdmin',
      component: UbahPassAdmin,
    },
    {
      path: '/UserAdmin/AdminLog/AdminReg',
      name: 'AdminReg',
      component: AdminReg,
    },
    {
      path: '/UserAdmin/AdminDash',
      name: 'AdminDash',
      component: AdminDash,
    },
    {
      path: '/UserAdmin/Barang/FormMsk',
      name: 'FormMsk',
      component: FormMsk,
    },
    {
      path: '/UserAdmin/Barang/Barang',
      name: 'Barang',
      component: Barang,
    },
    {
      path: '/UserAdmin/Barang/FormKlr',
      name: 'FormKlr',
      component: FormKlr,
    },
    {
      path: '/UserAdmin/Barang/BarangEdit',
      name: 'BarangEdit',
      component: BarangEdit,
    },
    {
      path: '/UserAdmin/Barang/BarangTbh',
      name: 'BarangTbh',
      component: BarangTbh,
    },
    {
      path: '/UserAdmin/Expedisi/Expedisi',
      name: 'Expedisi',
      component: Expedisi,
    },
    {
      path: '/UserAdmin/Expedisi/ExpedisiEdit',
      name: 'ExpedisiEdit',
      component: ExpedisiEdit,
    },
    {
      path: '/UserAdmin/Expedisi/ExpedisiTbh',
      name: 'ExpedisiTbh',
      component: ExpedisiTbh,
    },
    {
      path: '/UserAdmin/Kategori/Kategori',
      name: 'Kategori',
      component: Kategori,
    },
    {
      path: '/UserAdmin/Kategori/KategoriEdit',
      name: 'KategoriEdit',
      component: KategoriEdit,
    },
    {
      path: '/UserAdmin/Kategori/KategoriTbh',
      name: 'KategoriTbh',
      component: KategoriTbh,
    },
    {
      path: '/UserAdmin/Laporan/BarangKlr',
      name: 'BarangKlr',
      component: BarangKlr,
    },
    {
      path: '/UserAdmin/Laporan/BarangMsk',
      name: 'BarangMsk',
      component: BarangMsk,
    },
    {
      path: '/UserAdmin/Laporan/DetailPenjualan',
      name: 'DetailPenjualan',
      component: DetailPenjualan,
    },
    {
      path: '/UserAdmin/Laporan/Penjualan',
      name: 'Penjualan',
      component: Penjualan,
    },
    {
      path: '/UserAdmin/AdminRetur/ReturMsk',
      name: 'ReturMsk',
      component: ReturMsk,
    },
    {
      path: '/UserAdmin/AdminRetur/ReturDetail',
      name: 'ReturDetail',
      component: ReturDetail,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/About.vue'),
    },
  ],
})

export default router
