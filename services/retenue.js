const { Retenue, Societe, Logs, Annonce, Compteur } = require('../models')
const Errors = require('../helpers/errors');
const configuration = require('../config/config')
const Logger = require('winston')
const minioClient = require('../config/minio')
const { mailtemplate } = require('../config/constants');
let createAndSendEmail = require('../helpers/nodemailer')
const redis_client = require('../config/redis');
const fetch = require('node-fetch')
let tools = require('../helpers/tools')
let axios = require('axios');
let fs = require('fs')
const https = require("https");



exports.getRetenue = async () => {
    try {
        let retenues = await Retenue.findAll()
        if (retenues) {
            return retenues
        } else {
            throw new Errors.NotFoundError('no retenues found')
        }
    } catch (error) {
        console.log(error);
        throw error
    }
}

exports.getARetenue = async (id) => {
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


exports.searchmf = async (mf) => {
    try {
        if (mf.length >= 4) {
            let société = await Societe.searchmf(mf)
            if (société) {
                Logger.debug('search societe', société)
                return société
            } else {
                throw new Errors.NotFoundError('no société found')
            }
        }
    } catch (error) {
        console.log(error);
        throw error
    }
}


exports.searchrc = async (rc) => {
    try {
        if (rc.length >= 4) {
            let société = await Societe.searchrc(rc)
            if (société) {
                Logger.debug('search societe', société)
                return société
            } else {
                throw new Errors.NotFoundError('no société found')
            }
        }
    } catch (error) {
        console.log(error);
        throw error
    }
}

//------share retenue--------------------------------

exports.postRetenueFile = async (file, filename, data) => {
    try {
        if (file && filename) {
            let bucket_name = "retenue-drive"
            if (minioClient) {
                if (data.mf_benef) {
                    await minioClient.fPutObject(bucket_name, filename, file, { 'Content-disposition': 'attachment; filename=' + `retenue_${data.numero}_${data.mf_benef}` + '.pdf' })
                } else
                    if (data.cin_benef) {
                        await minioClient.fPutObject(bucket_name, filename, file, { 'Content-disposition': 'attachment; filename=' + `retenue_${data.numero}_${data.cin_benef}` + '.pdf' })
                    }
            } else {
                throw new Errors.InvalidDataError('Invalid data')
            }
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.InvalidDataError(error)
    }
}

exports.getUrl = async (filename) => {
    try {
        let bucket_name = "retenue-drive"
        if (minioClient) {
            let url = await minioClient.presignedGetObject(bucket_name, filename, 1000)
            let url_id = await tools.randomAlphabetic(64)

            await redis_client.set(url_id, url, 'EX', 15);
            Logger.info(`get url ${url}`)
            return {
                url_id: url_id,
                url: url
            }
        } else {
            throw new Errors.InvalidDataError('Invalid data')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.InvalidDataError(error)
    }
}

exports.sendMail = async (data) => {
    try {
        if (data.email && data.id) {

            let url = await redis_client.get(data.id)

            let content = mailtemplate

            content = content.replace("%URL%", url)

            let mailOptions
            for (let i = 0; i < data.email.length; i++) {
                mailOptions = {
                    from: configuration.mailing.sender || 'Retenue.tn',
                    to: data.email[i],
                    subject: `you received an element from Retenue.tn`,
                    html: content
                }
                await createAndSendEmail(mailOptions)
            }
        } else {
            throw new Errors.InvalidDataError('Invalid data')
        }
    } catch (error) {
        Logger.error(error)
        throw error
    }
}

//-------------------Log & compteur------------------------------------------------

exports.incrementCompteur = async (type, ip_address) => {
    try {
        if (ip_address) {
            let compteur = await Compteur.findAll()
            if (compteur[0]) {
                let logs = await Logs.findOne({ ip_client: ip_address })
                if (!logs && type == "print") {
                    await Compteur.update(compteur[0].id, { visiteur: Number(compteur[0].visiteur) + 1, impression: Number(compteur[0].impression) + 1 })
                } else if (logs && type == "print") {
                    await Compteur.update(compteur[0].id, { impression: Number(compteur[0].impression) + 1 })
                }
                if (!logs && type == "share") {
                    await Compteur.update(compteur[0].id, { visiteur: Number(compteur[0].visiteur) + 1, partage: Number(compteur[0].partage) + 1, impression: Number(compteur[0].impression) + 1 })
                } else if (logs && type == "share") {
                    await Compteur.update(compteur[0].id, { partage: Number(compteur[0].partage) + 1, impression: Number(compteur[0].impression) + 1 })
                }
            } else {
                Logger.error("no counter found")
            }
        } else {
            Logger.error("no ip found")
        }
    } catch (error) {
        console.log(error)
    }
}

exports.createLog = async (logs) => {
    try {
        if (logs) {
            await this.incrementCompteur(logs.action, logs.ip_client)
            console.log(logs);
            await Logs.create(logs)
        } else {
            throw new Errors.InvalidDataError('no data provided')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.InvalidDataError(error)
    }
}

exports.getCompteur = async () => {
    try {
        let compteur = await Compteur.findAll()
        if (compteur[0]) {
            Logger.error("Get Compteur", compteur[0])
            return compteur[0]
        } else {
            throw new Errors.InvalidDataError('no compteur found')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.InvalidDataError(error)
    }
}


//----------------------Annonce------------------------------------------------


exports.getAdHeader = async () => {
    try {
        let header = await Annonce.find({ type: "header", statut: "Activer" })
        if (header) {
            Logger.info("get Ad header", header)
            return header
        } else {
            throw new Errors.NotFoundError('no ad found')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.InvalidDataError(error)
    }
}

exports.getAdFooter = async () => {
    try {
        let footer = await Annonce.find({ type: "footer", statut: "Activer" })
        if (footer) {
            Logger.info("get Ad footer", footer)
            return footer
        } else {
            throw new Errors.NotFoundError('no ad found')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.InvalidDataError(error)
    }
}

exports.getAdModal = async () => {
    try {
        let modal = await Annonce.find({ type: "modal", statut: "Activer" })
        if (modal) {
            Logger.info("get Ad modal", modal)
            return modal
        } else {
            throw new Errors.NotFoundError('no ad found')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.InvalidDataError(error)
    }
}


//--------------------- societe------------------------


exports.editSociete = async (mf) => {
    try {
        if (mf) {
            const httpsAgent = new https.Agent({
                maxVersion: "TLSv1.2",
                minVersion: "TLSv1.2"
              });
            let body
            let societe = await Societe.findWithMF(mf)
            if (societe) {
                let current_date = new Date()
                let difference = Math.abs(current_date - societe.date_maj);
                let diffDays = Math.ceil(difference / (1000 * 60 * 60 * 24));
                if ((diffDays > 30 || !societe.date_maj)) {
                    if (societe.type == "P") {
                        let adr = configuration.url.societe_url + "pp" + "/" + societe.rc
    
                        const response = await axios({ method: "get", url: adr, httpsAgent })
    
                        body = response.data
                    }
                    if (societe.type == "M") {
                        let adr = configuration.url.societe_url + "pm" + "/" + societe.rc
                          
                        const response = await axios({ method: "get", url: adr, httpsAgent })
    
                        body = response.data
                    }
                    if (body) {
                        let update = {
                            type: body.typeRegistre,
                            nom_ar: body.denominationAr,
                            nom_fr: body.denominationLatin,
                            adresse_fr: body.villeSiegeFr,
                            adresse_ar: body.villeSiegeAr,
                            date_maj: new Date()
                        }
                        if (update) {
                            let updated_societe = await Societe.update(societe.id, update)
                            Logger.info("update société", updated_societe)
                        } else {
                            Logger.error("nothing to update")
                        }
                    } else {
                        Logger.error("no data provided")
                    }
                } else {
                    Logger.error("Less than a month since last update")
                }
            } else {
                Logger.error("Societe not found")
            }
        } else {
            Logger.error("no data provided")
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.InvalidDataError(error)
    }
   
}

// exports.addSociete = async () => {
//     try {
//         let list_path = "C:\\societe\\2023.json"

//         let raw_data = fs.readFileSync(list_path);
//         let societe = JSON.parse(raw_data);

//         if (societe) {
//             let rc_array = []

//             for (let i = 0; i < societe.length; i++) {
//                 rc_array.push(societe[i].numRegistre)
//             }

//             let existant_rc = await Societe.ifExists(rc_array)

//             for (let i = 0; i < rc_array.length; i++) {
//                 if (existant_rc.includes(rc_array[i])) {
//                     rc_array.splice(i, 1);
//                 }
//                 let adr = configuration.url.societe_url + "pm" + "/" + rc_array[i]
//                 const response = await fetch(adr);
//                 if (response) {
//                     body = await response.text();
//                 } else {
//                     let adr = configuration.url.societe_url + "pp" + "/" + rc_array[i]
//                     const response = await fetch(adr);
//                     body = await response.text();
//                 }

//                 parsed_body = JSON.parse(body);

//                 Logger.info("societe data", parsed_body)

//                 if (parsed_body) {


//                     let new_societe = {
//                         rc: parsed_body.numRegistre,
//                         mf: parsed_body.idUnique,
//                         type: parsed_body.typeRegistre,
//                         nom_ar: parsed_body.denominationAr,
//                         nom_fr: parsed_body.denominationLatin,
//                         adresse_fr: parsed_body.villeSiegeFr,
//                         adresse_ar: parsed_body.villeSiegeAr,
//                         date_maj: new Date()
//                     }

//                     let str = new_societe.rc + ',' + new_societe.mf + ',' + new_societe.type + ',' + new_societe.nom_fr + ',' + new_societe.adresse_fr + ',' + new_societe.nom_ar + ',' + new_societe.adresse_ar + '\n'


//                     fs.writeFileSync('../societe_2023_2.csv', str, {
//                         encoding: "utf8",
//                         flag: "a+"
//                     })
//                 }
//             }
//         }
//     } catch (error) {
//         console.log(error)
//     }
// }


//--------------vitrine--------------------------


exports.getVitrine = async () => {
    try {
        let vitrine = fs.readFileSync(configuration.template.vitrine, { encoding: 'utf8' });
        if (vitrine) {
            Logger.info("Site vitrine", vitrine)
            return vitrine
        } else {
            throw new Errors.NotFoundError('template not found')
        }
    } catch (error) {
        Logger.error(error)
        throw new Errors.InvalidDataError(error)
    }
}