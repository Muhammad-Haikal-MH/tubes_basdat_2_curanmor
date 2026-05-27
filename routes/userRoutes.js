import express from "express";
import multer from "multer";
import Laporan from "../models/Laporan.js";
import User from "../models/User.js";
import isAuthenticated from "../routes/middleware/authMiddleware.js";


const router = express.Router();

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "public/uploads");
    },

    filename: function (req, file, cb) {

        const nama = req.body.nama_pelapor
            .toLowerCase()
            .replace(/\s+/g, "-");

        let prefix = "file";

        if (file.fieldname === "foto_stnk") {
            prefix = "stnk";
        }

        if (file.fieldname === "foto_bpkb") {
            prefix = "bpkb";
        }

        if (file.fieldname === "foto_ktp") {
            prefix = "ktp";
        }

        if (file.fieldname === "foto_kendaraan") {
            prefix = "kendaraan";
        }

        if (file.fieldname === "foto_tkp") {
            prefix = "tkp";
        }

        if (file.fieldname === "surat_leasing") {
            prefix = "leasing";
        }

        const ext = file.originalname.split(".").pop();

        cb(null, `${prefix}-${nama}-${Date.now()}.${ext}`);
    }

});

const upload = multer({ storage });

router.get("/", (req, res) => {
    res.render("users/home", {
        currentPage: "home"
    });
});

router.get("/edukasi", (req, res) => {
    res.render("users/edukasi", {
        currentPage: "edukasi"
    });
});

router.get("/laporan", isAuthenticated, (req, res) => {
    res.render("users/laporan", {
        currentPage: "laporan"
    });
});

router.post(
    "/laporan",

    upload.fields([
        { name: "foto_stnk" },
        { name: "foto_bpkb" },
        { name: "surat_leasing" },
        { name: "foto_ktp" },
        { name: "foto_kendaraan" },
        { name: "foto_tkp" }
    ]),

    async (req, res) => {

        try {

            const laporan = new Laporan({

                nama_pelapor: req.body.nama_pelapor,

                plat_nomor: req.body.plat_nomor,
                nomor_rangka: req.body.nomor_rangka,
                nomor_mesin: req.body.nomor_mesin,
                merk_motor: req.body.merk_motor,
                tipe_motor: req.body.tipe_motor,
                warna_motor: req.body.warna_motor,
                tahun_pembuatan: req.body.tahun_pembuatan,

                waktu_kejadian: req.body.waktu_kejadian,
                lokasi_kehilangan: req.body.lokasi_kehilangan,
                kronologi: req.body.kronologi,

                foto_stnk: req.files.foto_stnk?.[0]?.filename,
                foto_bpkb: req.files.foto_bpkb?.[0]?.filename,
                surat_leasing: req.files.surat_leasing?.[0]?.filename,
                foto_ktp: req.files.foto_ktp?.[0]?.filename,
                foto_kendaraan: req.files.foto_kendaraan?.[0]?.filename,
                foto_tkp: req.files.foto_tkp?.[0]?.filename

            });

            await laporan.save();

            res.redirect("/");

        } catch (error) {

            console.log(error);
            res.send("Gagal mengirim laporan");

        }
    }
);

router.get("/profil", isAuthenticated, (req, res) => {

    res.render("users/profil", {
        currentPage: "profil",
        user: req.session.user,
        message: null
    });

  });

router.post("/profil/edit", isAuthenticated, async (req, res) => {

    try {

        const updatedUser = await User.findByIdAndUpdate(
            req.session.user.id,
            {
                nama: req.body.nama,
                phone: req.body.phone
            },
            { new: true }
        );

        req.session.user = {
            id: updatedUser._id,
            nama: updatedUser.nama,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role
        };

        res.redirect("/profil");

    } catch(error) {

        console.log(error);
        console.log(req.session.user.id)
console.log(await User.findById(req.session.user.id))
        res.send("Gagal update profil");

    }

});


export default router;