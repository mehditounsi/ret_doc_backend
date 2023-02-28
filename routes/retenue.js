const retenue_controller = require('../controller/retenue')


const configuration = require('../config/config')
const multer  = require('multer')
const limiter = require('../helpers/limiter')
const upload = multer({ dest: configuration.directory.tmp_dir})

module.exports = (router) => {

router.get('/retenue',retenue_controller.getRetenue)
router.get('/retenue/:id',retenue_controller.getARetenue)
router.get('/mf/search'/*,limiter.limiter()*/,retenue_controller.searchmf)
router.get('/rc/search'/*,limiter.limiter()*/,retenue_controller.searchrc)
router.post('/print'/*,limiter.limiter()*/,retenue_controller.printRetenue)
router.post('/share',limiter.limiter(),retenue_controller.shareRetenue)
router.get('/compteur',retenue_controller.getCompteur)
router.post('/sendmail', retenue_controller.sendMail)
router.get('/annonce/header', retenue_controller.getAdHeader)
router.get('/annonce/footer', retenue_controller.getAdFooter)
router.get('/annonce/modal', retenue_controller.getAdModal)
router.get('/vitrine', retenue_controller.getVitrine)

// router.post('/ajouter',  retenue_controller.addSociete)
}