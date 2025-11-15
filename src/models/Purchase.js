import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  fechaCompra: { type: Date, default: Date.now },
  direccion: { type: String, required: true },
  producto: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  cantidad: { type: Number, required: true },
  total: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model("Purchase", purchaseSchema);
