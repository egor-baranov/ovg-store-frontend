export async function loadProducts() {
    // Call an external API endpoint to get posts
    const res = await fetch('https://bbaonqfc47fea9ij5un0.containers.yandexcloud.net' + '/product/123')
    const data = await res.json()

    return data
}