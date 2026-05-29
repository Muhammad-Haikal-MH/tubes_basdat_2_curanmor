import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import Laporan from "../models/Laporan.js";
import User from "../models/User.js";
import isAuthenticated from "../routes/middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   MULTER CONFIG
========================= */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads");
    },

    filename: function (req, file, cb) {
        const nama = req.body.nama_pelapor
            ?.toLowerCase()
            ?.replace(/\s+/g, "-") || "user";

        let prefix = "file";

        if (file.fieldname === "foto_stnk") prefix = "stnk";
        if (file.fieldname === "foto_bpkb") prefix = "bpkb";
        if (file.fieldname === "foto_ktp") prefix = "ktp";
        if (file.fieldname === "foto_kendaraan") prefix = "kendaraan";
        if (file.fieldname === "foto_tkp") prefix = "tkp";
        if (file.fieldname === "surat_leasing") prefix = "leasing";

        const ext = file.originalname.split(".").pop();

        cb(null, `${prefix}-${nama}-${Date.now()}.${ext}`);
    }
});

const upload = multer({ storage });

/* =========================
   HOME
========================= */
router.get("/", (req, res) => {
    res.render("users/home", {
        currentPage: "home"
    });
});

/* =========================
   EDUKASI
========================= */
router.get("/edukasi", (req, res) => {
    res.render("users/edukasi", {
        currentPage: "edukasi"
    });
});

/* =========================
   FORM LAPORAN
========================= */
router.get("/laporan", isAuthenticated, (req, res) => {
    res.render("users/laporan", {
        currentPage: "laporan",
        user: req.session.user
    });
});

/* =========================
   SUBMIT LAPORAN
========================= */
router.post(
    "/laporan",
    isAuthenticated,
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
                userId: req.session.user.id, // 🔥 penting untuk history

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
                foto_tkp: req.files.foto_tkp?.[0]?.filename,

                status: "menunggu"
            });

            await laporan.save();

            res.redirect("/history");
        } catch (error) {
            console.log(error);
            res.send("Gagal mengirim laporan");
        }
    }
);

router.get("/history", isAuthenticated, async (req, res) => {
    try {

        const laporan = await Laporan.find({
            userId: req.session.user.id
        }).sort({ createdAt: -1 });

        res.render("users/history", {
            currentPage: "history",
            user: req.session.user,
            laporan
        });

    } catch (error) {
        console.log(error);
        res.send("Gagal ambil history laporan");
    }
});

/* =========================
   PROFIL
========================= */
router.get("/profil", isAuthenticated, (req, res) => {
    const message = req.session.message || null;
    delete req.session.message;

    res.render("users/profil", {
        currentPage: "profil",
        user: req.session.user,
        message
    });
});

/* =========================
   UPDATE PROFIL
========================= */
router.post("/profil/edit", isAuthenticated, upload.single("avatar"), async (req, res) => {
    try {
        const updateData = {
            nama: req.body.nama,
            phone: req.body.phone
        };

        if (req.file?.filename) {
            updateData.avatar = req.file.filename;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.session.user.id,
            updateData,
            { new: true }
        );

        req.session.user = {
            id: updatedUser._id,
            nama: updatedUser.nama,
            email: updatedUser.email,
            phone: updatedUser.phone,
            avatar: updatedUser.avatar || req.session.user.avatar,
            role: updatedUser.role
        };

        req.session.message = {
            type: "success",
            text: "Profil berhasil diperbarui."
        };

        res.redirect("/profil");

    } catch (error) {
        console.log(error);
        req.session.message = {
            type: "danger",
            text: "Gagal update profil. Silakan coba lagi."
        };
        res.redirect("/profil");
    }
});

/* =========================
   UBAH PASSWORD
========================= */
router.post("/profil/password", isAuthenticated, async (req, res) => {
    try {
        const { old_password, new_password, confirm_password } = req.body;

        if (!old_password || !new_password || !confirm_password) {
            req.session.message = {
                type: "danger",
                text: "Semua field password harus diisi."
            };
            return res.redirect("/profil");
        }

        if (new_password !== confirm_password) {
            req.session.message = {
                type: "danger",
                text: "Password baru dan konfirmasi harus sama."
            };
            return res.redirect("/profil");
        }

        const user = await User.findById(req.session.user.id);

        if (!user) {
            req.session.message = {
                type: "danger",
                text: "Pengguna tidak ditemukan."
            };
            return res.redirect("/profil");
        }

        const passwordMatch = await bcrypt.compare(old_password, user.password);
        if (!passwordMatch) {
            req.session.message = {
                type: "danger",
                text: "Password lama tidak cocok."
            };
            return res.redirect("/profil");
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);
        user.password = hashedPassword;
        await user.save();

        req.session.message = {
            type: "success",
            text: "Password berhasil diperbarui."
        };
        return res.redirect("/profil");
    } catch (error) {
        console.log(error);
        req.session.message = {
            type: "danger",
            text: "Gagal memperbarui password. Silakan coba lagi."
        };
        return res.redirect("/profil");
    }
});

export default router;