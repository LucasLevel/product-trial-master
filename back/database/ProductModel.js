import mongoose from 'mongoose';

//Création du schéma de la collection "products"
const productSchema = new mongoose.Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    internalReference: { type: String, required: true },
    shellId: { type: Number, required: true },
    inventoryStatus: { type: String, enum: ['INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK'], required: true },
    rating: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now, required: true },
});

export default mongoose.model('Product', productSchema);
