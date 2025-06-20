import { defineStore } from 'pinia';
import axios from 'axios';

const url = "http://127.0.0.1:8000/api/products"

export const useProductsStore = defineStore('products', {
    state: () => ({
        products: [] as any[],
        categories: [] as string[],
    }),
    actions: {
        async fetchProducts() {
            try {
                const response = await axios.get(url);
                this.products = response.data;
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async fetchCategories() {
            try {
                const response = await axios.get(`${url}/categories`);
                this.categories = ['all', ...response.data.data];
            } catch (error) {
                console.error('Error:', error);
                this.categories = ['all'];
            }
        },
        async createProduct(product: any) {
            await axios.post(url, product);
            await this.fetchProducts();
        },
        async updateProduct(id: number, product: any) {
            await axios.put(`${url}/${id}`, product);
            await this.fetchProducts();
        },
        async deleteProduct(id: number) {
            await axios.delete(`${url}/${id}`);
            await this.fetchProducts();
        },
        async updateProductByEvent(event: any) {
            await axios.put(`${url}/${event.data.id}`, {
                name: event.data.name,
                description: event.data.description,
                price: event.data.price ? parseFloat(event.data.price) : 0,
                category: event.data.category,
                image_url: event.data.image_url || null,
            });
            await this.fetchProducts();
        },
    },
});