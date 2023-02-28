const { Retenue, Societe, Annonce , Utilisateur } = require('../models')
const Errors = require('../helpers/errors');
const configuration = require('../config/config')
const Logger = require('winston')

//----------------admin------------------------------------------------

exports.adminLogin = async (utilisateur,mdp) =>{
    try {
        if (utilisateur && mdp) {
            let admin = await Utilisateur.findOne({ utilisateur: utilisateur, mdp: mdp })
            if (admin) {
                Logger.info('admin login', admin)
                return admin
            } else {
                throw new Errors.InvalidDataError('incorrect username or password')
            }
        } else {
            throw new Errors.InvalidDataError('Missing credentials')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.InvalidDataError(error)
    }
}

//----------------------Retenue------------------------

exports.createRetenue = async (data) => {
    try {
        if (data) {
            let retenue = await Retenue.create(data)
            if (retenue) {
                Logger.info('create retenue', retenue)
                return retenue
            } else {
                throw new Errors.InvalidDataError('an error occured while creating the retenue')
            }
        } else {
            throw new Errors.InvalidDataError('missing data')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.InvalidDataError(error)
    }
}

exports.getOneRetenue = async (id) => {
    try {
        if (id) {
            let retenue = await Retenue.findById(id)
            if (retenue) {
                Logger.info('find retenue', retenue)
                return retenue
            } else {
                throw new Errors.NotFoundError('retenue not found')
            }
        } else {
            throw new Errors.InvalidDataError('missing data')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.InvalidDataError(error)
    }
}

exports.editRetenue = async (id, data) => {
    try {
        if (id && data) {
            let retenue = await Retenue.update(id, data)
            if (retenue) {
                Logger.info('create retenue', retenue)
                return retenue
            } else {
                throw new Errors.InvalidDataError('an error occured while creating the retenue')
            }
        } else {
            throw new Errors.InvalidDataError('missing data')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.InvalidDataError(error)
    }
}

exports.deleteRetenue = async (id) => {
    try {
        if (id) {
            let retenue = await Retenue.findById(id)
            if (retenue) {
                Logger.info("delete retenue", retenue)
                return await Retenue.destroy(id)
            } else {
                throw new Errors.NotFoundError('nothing to delete')
            }
        }
        else {
            throw new Errors.InvalidDataError('missing data')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.ForbiddenError(error)
    }
}


//---------------------------Société--------------------------------


exports.createSociété = async (data) => {
    try {
        if (data) {
            let société = await Societe.create(data)
            if (société) {
                Logger.info('create Société', société)
                return société
            } else {
                throw new Errors.InvalidDataError('an error occured while creating the société')
            }
        } else {
            throw new Errors.InvalidDataError('missing data')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.InvalidDataError(error)
    }
}


exports.getAllSociété = async () => {
    try {
        let société = await Societe.findAll()
        if (société) {
            return société
        } else {
            throw new Errors.NotFoundError('no société found')
        }
    } catch (error) {
        console.log(error);
        throw error
    }
}

exports.getOneSociété = async (id) => {
    try {
        if (id) {
            let société = await Societe.findById(id)
            if (société) {
                Logger.info('find société', société)
                return société
            } else {
                throw new Errors.NotFoundError('société not found')
            }
        } else {
            throw new Errors.InvalidDataError('missing data')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.InvalidDataError(error)
    }
}

exports.editSociété = async (id, data) => {
    try {
        if (id && data) {
            let société = await Societe.update(id, data)
            if (société) {
                Logger.info('create Société', société)
                return société
            } else {
                throw new Errors.InvalidDataError('an error occured while creating the Société')
            }
        } else {
            throw new Errors.InvalidDataError('missing data')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.InvalidDataError(error)
    }
}

exports.deleteSociété = async (id) => {
    try {
        if (id) {
            let société = await Societe.findById(id)
            if (société) {
                Logger.info("delete Société", société)
                return await Societe.destroy(id)
            } else {
                throw new Errors.NotFoundError('no template to delete')
            }
        }
        else {
            throw new Errors.InvalidDataError('missing data')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.ForbiddenError(error)
    }
}

//---------------------------Annonce------------------------------------------------


exports.createAnnonce = async (data , file) => {
    try {
        if (data) {
            if (file){
                data.contenu = file
            }
            let annonce = await Annonce.create(data)
            if (annonce) {
                Logger.info('create Annonce', annonce)
                return annonce
            } else {
                throw new Errors.InvalidDataError('an error occured while creating the Annonce')
            }
        } else {
            throw new Errors.InvalidDataError('missing data')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.InvalidDataError(error)
    }
}


exports.getAllAnnonce = async () => {
    try {
        let annonce = await Annonce.findAll()
        if (annonce) {
            Logger.info("find all annonces",annonce)
            return annonce
        } else {
            throw new Errors.NotFoundError('no Annonce found')
        }
    } catch (error) {
        console.log(error);
        throw error
    }
}


exports.getOneAnnonce = async (id) => {
    try {
        if (id) {
            let annonce = await Annonce.findById(id)
            if (annonce) {
                Logger.info('find Annonce', annonce)
                return annonce
            } else {
                throw new Errors.NotFoundError('Annonce not found')
            }
        } else {
            throw new Errors.InvalidDataError('missing data')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.InvalidDataError(error)
    }
}


exports.editAnnonce = async (id, data , file) => {
    try {
        if (id && data) {
            if (file){
                data.contenu = file
            }
            let annonce = await Annonce.update(id, data)
            if (annonce) {
                Logger.info('edit Annonce', annonce)
                return annonce
            } else {
                throw new Errors.InvalidDataError('an error occured while creating the Annonce')
            }
        } else {
            throw new Errors.InvalidDataError('missing data')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.InvalidDataError(error)
    }
}



exports.activateAnnonce = async (id) => {
    try {
        if (id) {
            let annonce = await Annonce.findById(id)
            if (annonce) {
                if (annonce.statut == "Désactiver"){
                    await Annonce.update(id,{statut : "Activer"})
                }else {
                    throw new Errors.ForbiddenError('Annonce already activated')
                }
            } else {
                throw new Errors.NotFoundError('no annonce found')
            }
        } else {
            throw new Errors.InvalidDataError('missing data')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.InvalidDataError(error)
    }
}


exports.deactivateAnnonce = async (id) => {
    try {
        if (id) {
            let annonce = await Annonce.findById(id)
            if (annonce) {
                if (annonce.statut == "Activer"){
                    await Annonce.update(id,{statut : "Désactiver"})
                }else {
                    throw new Errors.ForbiddenError('Annonce already deactivated')
                }
            } else {
                throw new Errors.NotFoundError('no annonce found')
            }
        } else {
            throw new Errors.InvalidDataError('missing data')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.InvalidDataError(error)
    }
}


exports.deleteAnnonce = async (id) => {
    try {
        if (id) {
            let annonce = await Annonce.findById(id)
            if (annonce) {
                Logger.info("delete annonce", annonce)
                return await Annonce.destroy(id)
            } else {
                throw new Errors.NotFoundError('no annonce to delete')
            }
        }
        else {
            throw new Errors.InvalidDataError('missing data')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.ForbiddenError(error)
    }
}