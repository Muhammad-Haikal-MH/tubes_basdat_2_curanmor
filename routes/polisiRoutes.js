import express from "express";
import Laporan from "../models/Laporan.js";

const router = express.Router();

router.get("/", async (req, res) => {

    try {
        const laporan = await Laporan.find({
            status: {
                $in: ["diproses", "selesai"]
            } 
        });
        
        const totalDiproses = laporan.filter(
            item => item.status === "diproses"
        ).length;

        const totalSelesai = laporan.filter(
            item => item.status === "selesai"
        ).length;

        res.render("polisi/dashboard", {
            laporan,
            totalDiproses,
            totalSelesai
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
                    status: "selesai"
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

export default router;