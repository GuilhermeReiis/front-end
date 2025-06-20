<template>
  <HeaderComponent :cart-count="0" @product-created="handleProductCreated" />
  <BodyComponent
    :products="products"
    :categories="Array.isArray(categories) ? categories : []"
    @search="handleSearch"
    @category-change="handleCategoryChange"
    @image-filter-change="handleImageFilterChange"
    @delete-product="handleDeleteProduct"
  ></BodyComponent>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { storeToRefs } from "pinia";
import { useProductsStore } from "../stores/products";

const productsStore = useProductsStore();
const { products, categories } = storeToRefs(productsStore);

const loading = ref(false);
const error = ref("");
const currentSearch = ref<string>("");
const currentCategory = ref<string>("all");
const currentImageFilter = ref<string | null>(null);
const url = "http://127.0.0.1:8000/api/products";

const fetchProducts = async (
  searchName?: string,
  category?: string,
  imageFilter?: string | null
) => {
  loading.value = true;
  error.value = "";

  try {
    let newUrl: string = url;
    const params = new URLSearchParams();
    if (searchName && searchName.trim() !== "") {
      params.append("name", searchName);
    }
    if (category && category !== "all") {
      params.append("category", category);
    }
    if (imageFilter === "with_image") {
      params.append("has_image", "true");
    } else if (imageFilter === "without_image") {
      params.append("has_image", "false");
    }

    if (params.toString()) {
      newUrl = `${newUrl}?${params.toString()}`;
    }

    const response = await axios.get(newUrl);
    products.value = response.data;
  } catch (err) {
    console.error("Erro:", err);
  } finally {
    loading.value = false;
  }
};

const handleSearch = (searchTerm: string) => {
  currentSearch.value = searchTerm;
  fetchProducts(
    currentSearch.value,
    currentCategory.value,
    currentImageFilter.value
  );
};

const handleCategoryChange = (category: string) => {
  currentCategory.value = category;
  fetchProducts(
    currentSearch.value,
    currentCategory.value,
    currentImageFilter.value
  );
};

const handleImageFilterChange = (filterType: string | null) => {
  currentImageFilter.value = filterType;
  fetchProducts(
    currentSearch.value,
    currentCategory.value,
    currentImageFilter.value
  );
};

const handleProductCreated = async (product: any) => {
  await productsStore.createProduct(product);
};

const handleProductUpdated = async (id: number, product: any) => {
  await productsStore.updateProduct(id, product);
};

const handleDeleteProduct = async (id: number) => {
  await productsStore.deleteProduct(id);
};

onMounted(() => {
  productsStore.fetchProducts();
  productsStore.fetchCategories();
});
</script>
