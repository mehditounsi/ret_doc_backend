const admin_controller = require('../controller/admin')
const jwt = require('../helpers/jwt')
const configuration = require('../config/config')
const multer  = require('multer')
const upload = multer({ dest: configuration.directory.tmp_dir})


module.exports = (router) => {

//-----------------administration ----------------------------------------------------------------

router.post('/login',admin_controller.adminLogin)

// ----------------Retenue------------------------------------------------


router.post('/retenue/create',jwt.isAdmin,admin_controller.createRetenue)
router.get('/retenue/:id',jwt.isAdmin,admin_controller.getOneRetenue)
router.put('/retenue/:id' ,jwt.isAdmin, admin_controller.editRetenue)
router.delete('/retenue/:id',jwt.isAdmin,admin_controller.deleteRetenue)


//-----------------Société---------------------------
        

router.post('/societe/create',jwt.isAdmin,admin_controller.createSociété)
router.get('/societe/:id',jwt.isAdmin,admin_controller.getOneSociété)
router.get('/societe',jwt.isAdmin,admin_controller.getAllSociété)
router.put('/societe/:id' ,jwt.isAdmin, admin_controller.editSociété)
router.delete('/societe/:id',jwt.isAdmin,admin_controller.deleteSociété)


//-------------------Annonce------------------------


router.post('/annonce/create',jwt.isAdmin,upload.single('file'),admin_controller.createAnnonce)
router.get('/annonce/:id',jwt.isAdmin,admin_controller.getOneAnnonce)
router.get('/annonce',jwt.isAdmin,admin_controller.getAllAnnonce)
router.put('/annonce/:id',jwt.isAdmin,upload.single('file'),admin_controller.editAnnonce)
router.put('/annonce/:id/activate',jwt.isAdmin,admin_controller.activateAnnonce)
router.put('/annonce/:id/deactivate',jwt.isAdmin,admin_controller.deactivateAnnonce)
router.delete('/annonce/:id',jwt.isAdmin,admin_controller.deleteAnnonce)

}