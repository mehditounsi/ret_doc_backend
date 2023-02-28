const retenueService = require("../services/retenue");
const printService = require("../services/generate_pdf");
const Logger = require("winston");
let html_to_pdf = require('html-pdf-node');
const pdf = require('html-pdf')
let configuration = require('../config/config')
let tools = require('../helpers/tools')

const fs = require("fs");
const retenue = require("../routes/retenue");



exports.getRetenue = async (req, res) => {
    try {
        let retenue = await retenueService.getRetenue()
        res.status(200).json(retenue)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.getARetenue = async (req, res) => {
    try {
        let id = req.params.id
        let retenue = await adminService.getARetenue(id)
        res.status(200).json(retenue)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}


exports.searchmf = async (req, res) => {
    try {
        Logger.debug(req.query)
        let mf = req.query.mf
        let société = await retenueService.searchmf(mf)
        res.status(200).json(société)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.searchrc = async (req, res) => {
    try {
        Logger.debug(req.query)
        let rc = req.query.rc
        let société = await retenueService.searchrc(rc)
        res.status(200).json(société)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.printRetenue = async (req, res) => {
    try {
        Logger.debug(req.body)

        let mf_payeur = req.body.mf_payeur + req.body.tva_payeur + req.body.categorie_payeur + req.body.etab_payeur
        let mf_beneficiaire = req.body.mf_benef + req.body.tva_benef + req.body.categorie_benef + req.body.etab_benef

        let headers = req.headers

        let logs = {
            ip_client: tools.getHeaders(headers, "cf-connecting-ip"),
            mf_payeur: mf_payeur,
            mf_beneficiaire: mf_beneficiaire,
            cf_requete: tools.getHeaders(headers, "cf-ray"),
            pays: tools.getHeaders(headers, "cf-ipcountry"),
            agent: tools.getHeaders(headers, "user-agent"),
            body: {
                numero_retenue: req.body.numero,
                date: req.body.date,
                nom_payeur: req.body.nom_payeur,
                nom_benef: req.body.nom_benef,
                adresse_payeur: req.body.adresse_payeur,
                adresse_benef: req.body.adresse_benef,
                lieu: req.body.lieu
            },
            action: "print",
        }
    
        // please without await
        retenueService.createLog(logs)


        if (req.body.mf_benef) {
            // please without await
            retenueService.editSociete(req.body.mf_benef)
        }

        let html = await printService.getRetenuePrint(req.body)

        var options = { format: 'A4' }

        let filename
        if (req.body.mf_benef) {
            filename = `retenue_${req.body.numero}_${req.body.mf_benef}`
        } else if (req.body.cin_benef) {
            filename = `retenue_${req.body.numero}_${req.body.cin_benef}`
        }

        pdf.create(html, options).toStream(function (err, stream) {
            if (err) return res.end(err.stack)
            res.setHeader('Content-type', 'application/pdf')
            res.setHeader("Content-disposition", "attachment; filename=" + filename + '.pdf');
            stream.pipe(res)
        })
    } catch (error) {
        Logger.error(error)
        console.log(error)
        res.status(420).send(error);
    }
}

exports.shareRetenue = async (req, res) => {
    try {
        let file
        let filename

        let mf_payeur = req.body.mf_payeur + req.body.tva_payeur + req.body.categorie_payeur + req.body.etab_payeur
        let mf_beneficiaire = req.body.mf_benef + req.body.tva_benef + req.body.categorie_benef + req.body.etab_benef

        let headers = req.headers

        let logs = {
            ip_client: tools.getHeaders(headers, "cf-connecting-ip"),
            mf_payeur: mf_payeur,
            mf_beneficiaire: mf_beneficiaire,
            cf_requete: tools.getHeaders(headers, "cf-ray"),
            pays: tools.getHeaders(headers, "cf-ipcountry"),
            agent: tools.getHeaders(headers, "user-agent"),
            body: {
                numero_retenue: req.body.numero,
                date: req.body.date,
                nom_payeur: req.body.nom_payeur,
                nom_benef: req.body.nom_benef,
                adresse_payeur: req.body.adresse_payeur,
                adresse_benef: req.body.adresse_benef,
                lieu: req.body.lieu
            },
            action: "share",
        }

        //data to send when posting a retenue in minio
        let data = {
            numero: req.body.numero,
            mf_benef: mf_beneficiaire,
            cin_benef: req.body.cin_benef
        }

        //please without await
        retenueService.createLog(logs)

        if (req.body.mf_benef) {
            //please without await
            retenueService.editSociete(req.body.mf_benef)
        }

        let html = await printService.getRetenuePrint(req.body)

        let random_number = Math.random()
        let pdfFilePath = configuration.directory.tmp_dir + `retenue_${random_number}.pdf`

        var options = { format: 'A4' }

        pdf.create(html, options).toFile(pdfFilePath, function (err, file) {
            let currentTime = Date.now()
            file = pdfFilePath
            filename = `retenue_${currentTime}.pdf`
            retenueService.postRetenueFile(file, filename, data).then(() => {
                retenueService.getUrl(filename).then((url) => {
                    fs.unlinkSync(file)
                    res.status(200).json(url);
                })
            })
        })
    } catch (error) {
        console.log(error);
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.sendMail = async (req, res) => {
    try {
        await retenueService.sendMail(req.body)
        res.status(200).json({ message: 'mail has been sent with success' });
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}


//------------------------Annonce------------------------


exports.getAdHeader = async (req, res) => {
    try {
        let header = await retenueService.getAdHeader()
        res.status(200).json(header);
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.getAdFooter = async (req, res) => {
    try {
        let header = await retenueService.getAdFooter()
        res.status(200).json(header);
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

exports.getAdModal = async (req, res) => {
    try {
        let header = await retenueService.getAdModal()
        res.status(200).json(header);
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}


//----------------------------Ajouter Societe----------------------------


// exports.addSociete = async (req, res) => {
//     try {
//         let societe = await retenueService.addSociete()
//         res.status(200).json(societe);
//     } catch (error) {
//         Logger.error(error)
//         res.status(420).send(error);
//     }
// }


//----------------compteur----------------------------------

exports.getCompteur = async (req, res) => {
    try {
        let compteur = await retenueService.getCompteur()
        res.status(200).json(compteur)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}

//----------------vitrine--------------------------------

exports.getVitrine = async (req, res) => {
    try {
        let html = await retenueService.getVitrine()
        res.status(200).json(html)
    } catch (error) {
        Logger.error(error)
        res.status(420).send(error);
    }
}