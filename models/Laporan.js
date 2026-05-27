import mongoose from "mongoose";

const laporanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    nama_pelapor: String,

    plat_nomor: String,
    nomor_rangka: String,
    nomor_mesin: String,
    merk_motor: String,
    tipe_motor: String,
    warna_motor: String,
    tahun_pembuatan: Number,

    waktu_kejadian: Date,
    lokasi_kehilangan: String,
    kronologi: String,

    foto_stnk: String,
    foto_bpkb: String,
    surat_leasing: String,
    foto_ktp: String,
    foto_kendaraan: String,
    foto_tkp: String,

    status: {
      type: String,
      enum: ["menunggu", "diproses", "selesai"],
      default: "menunggu"
    }
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Laporan", laporanSchema);
