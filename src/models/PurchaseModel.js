import mongoose from "mongoose";

const PurchasedItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String }
});

const PurchaseSchema = new mongoose.Schema({
  userId: { type: String, required: true, trim: true },
  items: [PurchasedItemSchema],
  totalAmount: { type: Number, required: true },
  paymentId: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ['approved', 'pending', 'failure', 'registered'],
    default: 'registered',
  },
  purchaseDate: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Purchase", PurchaseSchema);
