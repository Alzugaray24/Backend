import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  productos: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1, 
      },
    },
  ],
});

const cartsModel = model("carts", cartSchema);

export { cartsModel };
