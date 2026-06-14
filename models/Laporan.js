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
    nik: String,
    tempat_lahir: String,
    tanggal_lahir: Date,
    jenis_kelamin: String,
    agama: String,
    pekerjaan: String,
    kewarganegaraan: String,
    alamat_pelapor: String,

    plat_nomor: String,
    merk_motor: String,
    tipe_motor: String,
    warna_motor: String,
    tahun_pembuatan: Number,
    nomor_rangka: String,
    nomor_mesin: String,
    stnk_atas_nama: String,

    waktu_kejadian: Date,
    lokasi_kehilangan: String,
    kronologi: String,
    kronologi_polisi: String,

    foto_kendaraan: String,
    foto_tkp: String,

    kerugian: Number,
    kerugian_terbilang: String,

    nama_penerima: String,
    nik_penerima: String,
    alamat_penerima: String,

    tanggal_ditemukan: Date,
    tanggal_penyerahan: Date,

    // ================= BAP =================
    nomor_bap: {
      type: String,
      default: "",
    },

    tanggal_bap: {
      type: Date,
      default: Date.now,
    },

    catatan_polisi: {
      type: String,
      default: "",
    },

    // ================= STATUS =================
    status: {
      type: String,
      enum: ["menunggu", "diproses", "ditemukan", "selesai"],
      default: "menunggu",
    },
    bap_selesai: {
      type: Boolean,
      default: false,
    },

    bast_selesai: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Laporan", laporanSchema);
