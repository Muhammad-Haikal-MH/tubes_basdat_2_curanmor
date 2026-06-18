import express from "express";
import Laporan from "../models/Laporan.js";

import {
    isLoggedIn,
    isAdmin
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", isLoggedIn, isAdmin, async (req, res) => {

    try {
        const filter = {};

        if (req.query.status) {
          filter.status = req.query.status;
        } else {
          filter.status = {
            $in: ["diproses", "ditemukan", "selesai"]
          };
        }
        
        const laporan = await Laporan.find(filter)
        .sort({ createdAt: -1 });


        const totalLaporan = await Laporan.countDocuments();
        const diproses = await Laporan.countDocuments({
            status: "Diproses"
        });
        
        const totalDiproses = laporan.filter(
            item => item.status === "diproses"
        ).length;

        const totalSelesai = laporan.filter(
            item => item.status === "selesai"
        ).length;

        const totalDitemukan = laporan.filter(
            item => item.status === "ditemukan"
        ).length;

        res.render("admin/dashboard", {
            laporan,
            totalLaporan,
            totalDiproses,
            totalSelesai,
            totalDitemukan
        });

    } catch(error) {

        console.log(error);

        res.send("Gagal load dashboard admin");

    }

});

router.get( "/laporan/:id", isLoggedIn, isAdmin, async (req, res) => {
        try {
            const laporan = await Laporan.findById(
                req.params.id
            );
            if(!laporan) {
                return res.send("Laporan tidak ditemukan");
            }
            res.render("admin/detailLaporan", {
                laporan
            });
        } catch(error) {
            console.log(error);
            res.send("Gagal load detail laporan");
        }
    }
);

router.post( "/laporan/:id/status", async (req, res) => {
        try {
            await Laporan.findByIdAndUpdate(
                req.params.id,
                {
                    status: req.body.status
                }
            );
            res.redirect("/admin");
        } catch(error) {
            console.log(error);
            res.send("Gagal update status");
        }
    }
);

router.post( "/laporan/:id/delete", async (req, res) => {
        try {
            await Laporan.findByIdAndDelete(
                req.params.id
            );
            res.redirect("/admin");
        } catch(error) {
            console.log(error);
            res.send("Gagal menghapus laporan");
        }
    }
);

export default router;