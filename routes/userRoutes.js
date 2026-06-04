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
    const nama =
      req.body.nama_pelapor?.toLowerCase()?.replace(/\s+/g, "-") || "user";

    let prefix = "file";

    if (file.fieldname === "foto_stnk") prefix = "stnk";
    if (file.fieldname === "foto_bpkb") prefix = "bpkb";
    if (file.fieldname === "foto_ktp") prefix = "ktp";
    if (file.fieldname === "foto_kendaraan") prefix = "kendaraan";
    if (file.fieldname === "foto_tkp") prefix = "tkp";
    if (file.fieldname === "surat_leasing") prefix = "leasing";

    const ext = file.originalname.split(".").pop();

    cb(null, `${prefix}-${nama}-${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage });

/* =========================
   HOME
========================= */
router.get("/", (req, res) => {
  res.render("users/home", {
    currentPage: "home",
  });
});

/* =========================
   EDUKASI
========================= */
const edukasiTips = {
  ganda: {
    title: "Gunakan Kunci Ganda",
    subtitle: "Lapisan perlindungan ekstra untuk kendaraan Anda",
    icon: "bi bi-lock-fill",
    text: "Pasang kunci ganda seperti gembok stang dan alarm motor. Dengan dua jenis kunci, pencuri perlu lebih banyak waktu dan usaha sehingga risiko pencurian menjadi lebih rendah. Selalu pastikan kunci tambahan dikunci dengan benar sebelum meninggalkan kendaraan.",
    bullets: [
      "Pasang gembok stang dan kunci cakram bersama alarm.",
      "Selalu aktifkan kunci tambahan saat parkir di luar rumah.",
      "Periksa kembali semua kunci sebelum meninggalkan motor."
    ],
    highlight: "Kunci ganda memberi lapisan pengamanan ekstra yang membuat pencuri ragu dan lebih sulit mengambil motor Anda.",
  },
  parkir: {
    title: "Parkir di Tempat Aman",
    subtitle: "Pilih lokasi parkir yang terlihat dan diawasi",
    icon: "bi bi-lightbulb-fill",
    text: "Hindari parkir di area gelap, sepi, atau tanpa pengawasan. Cari tempat parkir yang terang, dekat CCTV, dan jika mungkin berada di area yang diawasi petugas. Parkir aman membuat motor Anda kurang menarik bagi pelaku dan memudahkan pemantauan jika ada gerak mencurigakan.",
    bullets: [
      "Pilih area parkir yang terang dan ramai.",
      "Manfaatkan parkiran berbatas atau berpetugas.",
      "Jangan biarkan motor terparkir lama di lokasi sepi."
    ],
    highlight: "Parkir di tempat yang aman sangat membantu mengurangi risiko dan memberi peluang lebih besar bagi orang lain untuk melihat dan mencegah pencurian.",
  },
  gps: {
    title: "Pasang GPS atau CCTV",
    subtitle: "Teknologi membantu menemukan kembali kendaraan",
    icon: "bi bi-camera-video-fill",
    text: "Pasang GPS tracker pada motor atau gunakan CCTV di lokasi parkir rumah. GPS membuat pelacakan kendaraan menjadi lebih cepat jika terjadi kehilangan, sementara CCTV menambah bukti visual. Pastikan perangkat bekerja dengan baik dan bahan rekamannya tersimpan dengan rapi.",
    bullets: [
      "Gunakan GPS tracker dengan sinyal yang kuat dan baterai tahan lama.",
      "Aktifkan notifikasi lokasi di aplikasi bila tersedia.",
      "Pasang CCTV di area parkir rumah atau tempat usaha Anda."
    ],
    highlight: "Teknologi seperti GPS dan CCTV memperbesar kemungkinan kendaraan terlacak dan memberi informasi penting jika terjadi pencurian.",
  },
  dokumen: {
    title: "Simpan Dokumen Kendaraan",
    subtitle: "Dokumen lengkap memudahkan proses laporan dan klaim",
    icon: "bi bi-file-earmark-text-fill",
    text: "Simpan STNK, BPKB, dan kuitansi pembelian secara aman. Buat salinan digital yang bisa dicari kapan saja jika dokumen asli hilang. Dokumen lengkap mempercepat proses pelaporan ke pihak polisi dan memastikan Anda bisa mengurus administrasi dengan lebih cepat.",
    bullets: [
      "Simpan dokumen asli di tempat aman dan terenkripsi.",
      "Buat salinan digital agar mudah diakses saat darurat.",
      "Catat nomor polisi dan data penting kendaraan di ponsel."
    ],
    highlight: "Dokumen lengkap membuat proses pelaporan dan klaim lebih cepat, dan mengurangi stres saat kendaraan kehilangan.",
  },
};

router.get("/edukasi", (req, res) => {
  res.render("users/edukasi", {
    currentPage: "edukasi",
  });
});

router.get("/edukasi/:topic", (req, res) => {
  const topic = req.params.topic;
  const detail = edukasiTips[topic];

  if (!detail) {
    return res.redirect("/edukasi");
  }

  res.render("users/edukasi-detail", {
    currentPage: "edukasi",
    topic,
    detail,
    edukasiTips,
  });
});

/* =========================
   FORM LAPORAN
========================= */
router.get("/laporan", isAuthenticated, (req, res) => {
  res.render("users/laporan", {
    currentPage: "laporan",
    user: req.session.user,
  });
});

/* =========================
   SUBMIT LAPORAN
========================= */
router.post(
  "/laporan",
  isAuthenticated,
  upload.fields([{ name: "foto_kendaraan" }, { name: "foto_tkp" }]),
  async (req, res) => {
    try {
      const laporan = new Laporan({
        userId: req.session.user.id,

        nama_pelapor: req.body.nama_pelapor,
        nomor_pelapor: req.body.nomor_pelapor,
        plat_nomor: req.body.plat_nomor,
        merk_motor: req.body.merk_motor,
        tipe_motor: req.body.tipe_motor,
        warna_motor: req.body.warna_motor,
        tahun_pembuatan: req.body.tahun_pembuatan,

        waktu_kejadian: req.body.waktu_kejadian,
        lokasi_kehilangan: req.body.lokasi_kehilangan,
        kronologi: req.body.kronologi,

        foto_kendaraan: req.files.foto_kendaraan?.[0]?.filename,
        foto_tkp: req.files.foto_tkp?.[0]?.filename,

        status: "menunggu",
      });

      await laporan.save();

      res.redirect("/history");
    } catch (error) {
      console.log(error);
      res.send("Gagal mengirim laporan");
    }
  },
);

router.get("/history", isAuthenticated, async (req, res) => {
  try {
    const laporan = await Laporan.find({
      userId: req.session.user.id,
    }).sort({ createdAt: -1 });

    res.render("users/history", {
      currentPage: "history",
      user: req.session.user,
      laporan,
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
    message,
  });
});

/* =========================
   UPDATE PROFIL
========================= */
router.post(
  "/profil/edit",
  isAuthenticated,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const updateData = {
        nama: req.body.nama,
        phone: req.body.phone,
      };

      if (req.file?.filename) {
        updateData.avatar = req.file.filename;
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.session.user.id,
        updateData,
        { new: true },
      );

      req.session.user = {
        id: updatedUser._id,
        nama: updatedUser.nama,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar || req.session.user.avatar,
        role: updatedUser.role,
      };

      req.session.message = {
        type: "success",
        text: "Profil berhasil diperbarui.",
      };

      res.redirect("/profil");
    } catch (error) {
      console.log(error);
      req.session.message = {
        type: "danger",
        text: "Gagal update profil. Silakan coba lagi.",
      };
      res.redirect("/profil");
    }
  },
);

router.post("/profil/password", isAuthenticated, async (req, res) => {
  try {
    const { old_password, new_password, confirm_password } = req.body;

    if (!old_password || !new_password || !confirm_password) {
      req.session.message = {
        type: "danger",
        text: "Semua field password harus diisi.",
      };
      return res.redirect("/profil");
    }

    if (new_password !== confirm_password) {
      req.session.message = {
        type: "danger",
        text: "Password baru dan konfirmasi harus sama.",
      };
      return res.redirect("/profil");
    }

    const user = await User.findById(req.session.user.id);

    if (!user) {
      req.session.message = {
        type: "danger",
        text: "Pengguna tidak ditemukan.",
      };
      return res.redirect("/profil");
    }

    const passwordMatch = await bcrypt.compare(old_password, user.password);
    if (!passwordMatch) {
      req.session.message = {
        type: "danger",
        text: "Password lama tidak cocok.",
      };
      return res.redirect("/profil");
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedPassword;
    await user.save();

    req.session.message = {
      type: "success",
      text: "Password berhasil diperbarui.",
    };
    return res.redirect("/profil");
  } catch (error) {
    console.log(error);
    req.session.message = {
      type: "danger",
      text: "Gagal memperbarui password. Silakan coba lagi.",
    };
    return res.redirect("/profil");
  }
});

router.get("/surat/:id", isAuthenticated, async (req, res) => {
  try {
    const laporan = await Laporan.findById(req.params.id);

    // cek laporan ada atau tidak
    if (!laporan) {
      return res.send("Laporan tidak ditemukan");
    }

    // keamanan:
    // pastikan hanya pemilik laporan yang bisa buka surat
    if (laporan.userId.toString() !== req.session.user.id) {
      return res.send("Akses ditolak");
    }

    res.render("surat/bap_pelaporan", {
      laporan,
    });
  } catch (err) {
    console.log(err);
    res.send("Terjadi error");
  }
});

router.get("/serah-terima/:id", isAuthenticated, async (req, res) => {
  try {
    const laporan = await Laporan.findById(req.params.id);

    if (!laporan) {
      return res.send("Laporan tidak ditemukan");
    }

    if (laporan.userId.toString() !== req.session.user.id) {
      return res.send("Akses ditolak");
    }

    res.render("surat/bap_serah_terima", {
      laporan,
    });
  } catch (err) {
    console.log(err);
    res.send("Terjadi error");
  }
});

export default router;
