import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';
import Product from '../database/ProductModel.js';

describe('Product API', () => {
    beforeAll(async () => {
        await mongoose.disconnect(); // Déconnecter d'abord, juste au cas où
        await mongoose.connect(process.env.MONGO_URI_TEST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await Product.deleteMany({});
        await mongoose.connection.close();
    });

    let createdProductId; // Variable pour stocker l'ID du produit créé


    ///////////// TEST DE LA CREATION DE PRODUIT /////////////
    it('creation de produit : success', async () => {
        const newProduct = {
            code: 'P001',
            name: 'Product 1',
            description: 'Description 1',
            image: 'image1.png',
            category: 'Category 1',
            price: 300,
            quantity: 15,
            internalReference: 'REF001',
            shellId: 3,
            rating: 4.8,
        };

        const response = await request(app)
            .post('/products')
            .send(newProduct)
            .expect('Content-Type', /json/)
            .expect(201);
        expect(response.body).toMatchObject(newProduct);
        expect(response.body._id).toBeDefined();
        createdProductId = response.body._id; // Sauvegarde l'ID pour les tests suivants
    });

    it('creation de produit : echec car incomplet', async () => {
    	//Suppression de "code"
        const newProduct = {
            name: 'Product 1',
            description: 'Description 1',
            image: 'image1.png',
            category: 'Category 1',
            price: 300,
            quantity: 15,
            internalReference: 'REF001',
            shellId: 3,
            rating: 4.8
        };

        const response = await request(app)
            .post('/products')
            .send(newProduct)
            .expect('Content-Type', /json/)
            .expect(500);
    });


    ///////////// TEST RÉCUPÉRATION DE TOUS LES PRODUITS /////////////
    it('récupération de tous les produits : success', async () => {
        const response = await request(app)
            .get('/products')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
    });
	

	///////////// TEST RÉCUPÉRATION UN SEUL PRODUIT /////////////
	it('récupération 1 produit : success', async () => {
        const response = await request(app)
            .get(`/products/${createdProductId}`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body._id).toBe(createdProductId);
        expect(response.body.name).toBe('Product 1');
    });

    it('récupération 1 produit : erreur car inexistant', async () => {
        const response = await request(app)
            .get(`/products/11119e5bd896253b247a2420`)
            .expect('Content-Type', /json/)
            .expect(404);

        expect(response.body.message).toBe("Aucun produit trouvé");
    });


	///////////// TEST MODIFICATION PRODUIT /////////////
    it('modification de produit : success', async () => {
        const updatedProduct = {
            name: 'Updated Product 1',
            quantity: 5,
        };

        const response = await request(app)
            .patch(`/products/${createdProductId}`)
            .send(updatedProduct)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.name).toBe('Updated Product 1');
        expect(response.body.quantity).toBe(5);
        expect(response.body.inventoryStatus).toBe('LOWSTOCK');
    });

    it('modification de produit : erreur car inexistant', async () => {
        const updatedProduct = {
            name: 'Updated Product 1',
            quantity: 5,
        };

        const response = await request(app)
            .patch(`/products/11119e5bd896253b247a2420`)
            .send(updatedProduct)
            .expect('Content-Type', /json/)
            .expect(404);

        expect(response.body.message).toBe("Aucun produit trouvé");
    });


	///////////// TEST SUPPRESSION PRODUIT /////////////
    it('suppression produit : success', async () => {
        const response = await request(app)
            .delete(`/products/${createdProductId}`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.message).toBe('Produit supprimé');

        // Vérifier que le produit a bien été supprimé
        await request(app)
            .get(`/products/${createdProductId}`)
            .expect('Content-Type', /json/)
            .expect(404);
    });
});