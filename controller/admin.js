const adminService = require("../services/admin");
const Logger = require("winston");
const jwtUtils = require("../helpers/jwt")
const fs = require("fs");

//--------------------------admin----------------------------------------------------------------


exports.adminLogin = async (req, res) => {
    try {
            let utilisateur = req.body.utilisateur
            let mdp = req.body.mdp
            let token
            let user = await adminService.adminLogin(utilisateur, mdp)
            if (user) {
                token = await jwtUtils.generateTokenForAdmin(utilisateur)
                user.token = token
            }
            res.status(200).send(user)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}


//----------------------Retenue-----------------------------

exports.createRetenue = async (req, res) => {
    try {
        let retenue = await adminService.createRetenue(req.body);
        res.status(200).json(retenue)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}


exports.getOneRetenue = async (req, res) => {
    try {
        let id = req.params.id
        let retenue = await adminService.getOneRetenue(id)
        res.status(200).json(retenue)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}


exports.editRetenue = async (req, res) => {
    try {
        let id = req.params.id;
        let retenue = await adminService.editRetenue(id, req.body)
        res.status(200).json(retenue)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.deleteRetenue = async (req, res) => {
    try {
        let id = req.params.id;
        await adminService.deleteRetenue(id)
        res.status(200).json({ message: 'deleted succesfully' })
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}


//-------------------------Société--------------------------------------------------------


exports.createSociété = async (req, res) => {
    try {
        let société = await adminService.createSociété(req.body);
        res.status(200).json(société)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.getAllSociété = async (req, res) => {
    try {
        let société = await adminService.getAllSociété();
        res.status(200).json(société)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.getOneSociété = async (req, res) => {
    try {
        let id = req.params.id;
        let société = await adminService.getOneSociété(id)
        res.status(200).json(société)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}


exports.editSociété = async (req, res) => {
    try {
        let id = req.params.id;
        let société = await adminService.editSociété(id, req.body)
        res.status(200).json(société)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.deleteSociété = async (req, res) => {
    try {
        let id = req.params.id;
        await adminService.deleteSociété(id)
        res.status(200).json({ message: 'deleted succesfully' })
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}


//----------------------- Annonce----------------------------------------------------

exports.createAnnonce = async (req, res) => {
    try {
        let file
        if (req.file) {
            file = fs.readFileSync(req.file.path)
        }
        let annonce = await adminService.createAnnonce(req.body , file);
        res.status(200).json(annonce)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}


exports.getOneAnnonce = async (req, res) => {
    try {
        let id = req.params.id
        let annonce = await adminService.getOneAnnonce(id);
        res.status(200).json(annonce)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.getAllAnnonce = async (req, res) => {
    try {
        let annonce = await adminService.getAllAnnonce();
        res.status(200).json(annonce)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.editAnnonce = async (req, res) => {
    try {
        let file
        if (req.file) {
            file = fs.readFileSync(req.file.path)
        }
        let id = req.params.id
        let annonce = await adminService.editAnnonce(id,req.body);
        res.status(200).json(annonce)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.activateAnnonce = async (req, res) => {
    try {
        let id = req.params.id
        await adminService.activateAnnonce(id);
        res.status(200).json({message : "annonce activated succesfully"})
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.deactivateAnnonce = async (req, res) => {
    try {
        let id = req.params.id
        await adminService.deactivateAnnonce(id);
        res.status(200).json({message : "annonce deactivated succesfully"})
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}


exports.deleteAnnonce = async (req, res) => {
    try {
        let id = req.params.id
        await adminService.deleteAnnonce(id);
        res.status(200).json({message : 'deleted succesfully'})
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}