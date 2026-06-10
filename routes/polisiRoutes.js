import express from "express";
import Laporan from "../models/Laporan.js";

const router = express.Router();

router.get("/", async (req, res) => {

    try {
        const laporan = await Laporan.find({
            status: {
                $in: ["diproses", "ditemukan", "selesai"]
            } 
        }).sort({ createdAt: -1 });
        
        const totalDiproses = laporan.filter(
            item => item.status === "diproses"
        ).length;

        const totalSelesai = laporan.filter(
            item => item.status === "selesai"
        ).length;

        const totalDitemukan = laporan.filter(
            item => item.status === "ditemukan"
        ).length;

        res.render("polisi/dashboard", {
            laporan,
            totalDiproses,
            totalSelesai,
            totalDitemukan
        });
    } catch(error) {
        console.log(error);
        res.send("Gagal mengambil data polisi");
    }

});


router.post("/laporan/:id/status", async (req, res) => {
        try {
            await Laporan.findByIdAndUpdate(
                req.params.id,
                {
                    status: req.body.status
                }
            );
            res.redirect("/polisi");
        } catch(error) {
            console.log(error);
            res.send("Gagal update status");
        }
    }
);


router.get( "/laporan/:id", async (req, res) => {
        try {
            const laporan = await Laporan.findById(
                req.params.id
            );
            if(!laporan) {
                return res.send(
                    "Laporan tidak ditemukan"
                );
            }

            res.render("polisi/detailLaporan",
                {
                    laporan
                }
            );

        } catch(error) {
            console.log(error);
            res.send(
                "Gagal mengambil detail laporan"
            );
        }
    }
);

router.post("/laporan/:id/catatan", async (req, res) => {

    try {
        await Laporan.findByIdAndUpdate(
            req.params.id,
            {
                catatan_polisi: req.body.catatan_polisi
            }
        );
        res.redirect(
            `/polisi/laporan/${req.params.id}`
        );
    } catch(error) {
        console.log(error);
        res.send(
            "Gagal menyimpan catatan"
        );
    }
});





/* ==================================================
   FORM INPUT BAP (POLISI)
================================================== */
router.get("/form_bap/:id", async (req, res) => {
  try {
    const laporan = await Laporan.findById(req.params.id);

    if (!laporan) {
      return res.send("Laporan tidak ditemukan");
    }

    res.render("polisi/form_bap", {
      laporan,
    });

  } catch (err) {
    console.log(err);
    res.send("Terjadi kesalahan");
  }
});

/* ==================================================
   SIMPAN FORM BAP
================================================== */
router.post("/form_bap/:id", async (req, res) => {
  try {

    await Laporan.findByIdAndUpdate(req.params.id, {
      nik: req.body.nik,
      tempat_lahir: req.body.tempat_lahir,
      tanggal_lahir: req.body.tanggal_lahir,
      jenis_kelamin: req.body.jenis_kelamin,
      agama: req.body.agama,
      pekerjaan: req.body.pekerjaan,
      kewarganegaraan: req.body.kewarganegaraan,
      alamat_pelapor: req.body.alamat_pelapor,

      nomor_rangka: req.body.nomor_rangka,
      nomor_mesin: req.body.nomor_mesin,
      stnk_atas_nama: req.body.stnk_atas_nama,

      kronologi_polisi: req.body.kronologi_polisi,

      kerugian: req.body.kerugian,
      kerugian_terbilang: req.body.kerugian_terbilang,

      nomor_bap: req.body.nomor_bap,
      tanggal_bap: new Date(),

      bap_selesai: true,
    });

    res.redirect("/polisi/surat/bap/" + req.params.id);

  } catch (err) {
    console.log(err);
    res.send("Gagal menyimpan data BAP");
  }
});

/* ==================================================
   CETAK STPL / BAP
================================================== */
router.get("/surat/bap/:id", async (req, res) => {
  try {

    const laporan = await Laporan.findById(req.params.id);

    if (!laporan) {
      return res.send("Data tidak ditemukan");
    }

    res.render("surat/bap", {
      laporan,
    });

  } catch (err) {
    console.log(err);
    res.send("Terjadi kesalahan");
  }
});

/* ==================================================
   FORM INPUT BAST
================================================== */
router.get("/form_bast/:id", async (req, res) => {
  try {

    const laporan = await Laporan.findById(req.params.id);

    if (!laporan) {
      return res.send("Data tidak ditemukan");
    }

    res.render("polisi/form_bast", {
      laporan,
    });

  } catch (err) {
    console.log(err);
    res.send("Terjadi kesalahan");
  }
});

/* ==================================================
   SIMPAN BAST
================================================== */
router.post("/form_bast/:id", async (req, res) => {
  try {

    await Laporan.findByIdAndUpdate(req.params.id, {
      nama_penerima: req.body.nama_penerima,
      nik_penerima: req.body.nik_penerima,
      alamat_penerima: req.body.alamat_penerima,
      tanggal_ditemukan: req.body.tanggal_ditemukan,
      tanggal_penyerahan: req.body.tanggal_penyerahan,
      status: "ditemukan",

      bast_selesai: true,
    });

    res.redirect("/polisi/surat/bast/" + req.params.id);

  } catch (err) {
    console.log(err);
    res.send("Gagal menyimpan BAST");
  }
});

/* ==================================================
   CETAK BAST
================================================== */
router.get("/surat/bast/:id", async (req, res) => {
  try {

    const laporan = await Laporan.findById(req.params.id);

    if (!laporan) {
      return res.send("Data tidak ditemukan");
    }

    res.render("surat/bast", {
      laporan,
    });

  } catch (err) {
    console.log(err);
    res.send("Terjadi kesalahan");
  }
});

export default router;