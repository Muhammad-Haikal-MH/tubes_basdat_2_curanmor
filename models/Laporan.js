import mongoose from "mongoose";

const laporanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    nama_pelapor: String,
    nomor_pelapor: String,

    plat_nomor: String,

    merk_motor: String,
    tipe_motor: String,
    warna_motor: String,
    tahun_pembuatan: Number,

    waktu_kejadian: Date,
    lokasi_kehilangan: String,
    kronologi: String,

    foto_kendaraan: String,
    foto_tkp: String,

    status: {
      type: String,
      enum: ["menunggu", "diproses", "selesai"],
      default: "menunggu"
    },
    catatan_polisi: {
    type: String,
    default: ""
  }
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Laporan", laporanSchema);
