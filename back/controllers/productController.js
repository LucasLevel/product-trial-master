import Product from '../database/ProductModel.js';

export async function getProducts(req,res){
    //Récupération de tous les produits existants
    try{
        const products = await Product.find();
        res.status(200).json(products);
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Une erreur est survenue lors de la recherche du produit"});
    }
}

export async function getProduct(req,res){
    //Récupération d'un unique produit selon son id
    try{
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({message:"Aucun produit trouvé"});
        }
        res.status(200).json(product);
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Une erreur est survenue lors de la recherche du produit"});
    }
}

export async function createProduct(req,res){
    //Créer un produit selon les informations reçues
    try {
        //Récupère les données liées au product et set inventoryStatus en fonction de la quantity (si <10 => lowstock)
        const {code, name, description, image, category, price, quantity, internalReference, shellId, rating} = req.body,
            inventoryStatus = quantity < 0 ? "erreur" : (quantity === 0 ? "OUTOFSTOCK" : quantity > 10 ? "INSTOCK" : "LOWSTOCK");

        //Création et ajout du produit
        const newProduct = new Product({code, name, description, image, category, price, quantity, internalReference, shellId, inventoryStatus, rating});
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Erreur lors de la création du produit"});
    }
}

export async function updateProduct(req,res){
    //Modifier un produit existant
    try{
        //Récupère les données liées au product et set inventoryStatus en fonction de la quantity (si <10 => lowstock)
        const {code, name, description, image, category, price, quantity, internalReference, shellId, rating} = req.body,
            inventoryStatus = (quantity !== undefined && quantity >= 0) ? (quantity === 0 ? "OUTOFSTOCK" : quantity > 10 ? "INSTOCK" : "LOWSTOCK") : undefined;

        //Modifie le produit s'il existe et return le nouveau
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, 
            {code, name, description, image, category, price, quantity, internalReference, shellId, inventoryStatus, rating, updatedAt:new Date()}, { new: true })

        if (!updatedProduct) {
            return res.status(404).json({message:"Aucun produit trouvé"});
        }
        res.status(200).json(updatedProduct);
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Erreur lors de la modification du produit"});
    }
}

export async function deleteProduct(req,res){
    //Delete un produit existant
    try{
        const deletedProduct = await Product.findByIdAndDelete(req.params.id)
        if (!deletedProduct) {
            return res.status(404).json({message:"Aucun produit trouvé"});
        }
        res.status(200).json({message:"Produit supprimé"});
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Erreur lors de la suppression du produit"})
    }
}
