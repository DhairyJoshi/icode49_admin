const BASE_API_URL = 'http://164.52.202.121:4545/api/'

// Auth API
export async function loginAPI(email, password) {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  const res = await fetch(`${BASE_API_URL}admin_login/`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

// Blog Category Create API
export async function blogCategoryCreateAPI(category) {
  const formData = new FormData();
  formData.append('category', category);
  const res = await fetch(`${BASE_API_URL}blog_category_create/`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

// All Blog Categories API
export async function allBlogCategoryAPI() {
  const res = await fetch(`${BASE_API_URL}all_blog_category/`, {
    method: 'POST',
  });
  return res.json();
}

// Blog Create API
export async function blogCreateAPI({
  category, title, poster, poster_alt, image, image_alt, description, author, publish_date, read_time, status, seo_title, seo_description, seo_keywords, og_title, og_description, og_image, og_type, og_image_alt
}) {
  const formData = new FormData();
  formData.append('category', category);
  formData.append('title', title);
  if (poster) formData.append('poster', poster);
  formData.append('poster_alt', poster_alt);
  if (image) formData.append('image', image);
  formData.append('image_alt', image_alt);
  formData.append('description', description);
  formData.append('author', author);
  formData.append('publish_date', publish_date);
  formData.append('read_time', read_time);
  if (status) formData.append('status', status);
  formData.append('seo_title', seo_title);
  formData.append('seo_description', seo_description);
  formData.append('seo_keywords', seo_keywords);
  formData.append('og_title', og_title);
  formData.append('og_description', og_description);
  if (og_image) formData.append('og_image', og_image);
  formData.append('og_type', og_type);
  formData.append('og_image_alt', og_image_alt);

  const res = await fetch(`${BASE_API_URL}blog_create/`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

// All Blog List API
export async function allBlogListAPI() {
  const res = await fetch(`${BASE_API_URL}all_blog_list/`, {
    method: 'POST',
  });
  return res.json();
}

export async function allPortfolioCategoryAPI() {
  const res = await fetch(`${BASE_API_URL}all_portfolio_category/`, {
    method: 'POST',
  });
  return res.json();
}

// Portfolio Category Create API
export async function portfolioCategoryCreateAPI(category) {
  const formData = new FormData();
  formData.append('category', category);
  const res = await fetch(`${BASE_API_URL}portfolio_category_create/`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

export async function allTechnologyCategoryAPI() {
  const res = await fetch(`${BASE_API_URL}all_technology/`, {
    method: 'POST',
  });
  return res.json();
}

// Portfolio Category Create API
export async function technologyCategoryCreateAPI(category) {
  const formData = new FormData();
  formData.append('category', category);
  const res = await fetch(`${BASE_API_URL}technology_create/`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

// Technology Create API
export async function technologyCreateAPI({ title, image }) {
  const formData = new FormData();
  formData.append('title', title);
  if (image) formData.append('image', image);
  const res = await fetch(`${BASE_API_URL}technology_create/`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

// All Technology API
export async function allTechnologyAPI() {
  const res = await fetch(`${BASE_API_URL}all_technology/`, {
    method: 'POST',
  });
  return res.json();
}

// Portfolio Create API
export async function portfolioCreateAPI({ category, title, description, project_duration, website_link, image, technology }) {
  const formData = new FormData();
  formData.append('category', category);
  formData.append('title', title);
  formData.append('description', description);
  formData.append('project_duration', project_duration);
  formData.append('website_link', website_link);
  if (image) {
    formData.append('image', image);
  }
  if (technology) {
    formData.append('technology', JSON.stringify(Array.isArray(technology) ? technology : [technology]));
  }
  return fetch('http://164.52.202.121:4545/api/portfolio_create/', {
    method: 'POST',
    body: formData,
  }).then(res => res.json());
}

// All Portfolio List API
export async function allPortfolioListAPI() {
  const res = await fetch(`${BASE_API_URL}all_portfolio_list/`, {
    method: 'POST',
  });
  return res.json();
}

export async function portfolioUpdateAPI({ id, category, title, description, project_duration, website_link, image, technology }) {
  const formData = new FormData();
  formData.append('id', id);
  formData.append('category', category);
  formData.append('title', title);
  formData.append('description', description);
  formData.append('project_duration', project_duration);
  formData.append('website_link', website_link);
  if (image) {
    formData.append('image', image);
  }
  if (technology) {
    formData.append('technology', JSON.stringify(Array.isArray(technology) ? technology : [technology]));
  }
  return fetch(`${BASE_API_URL}portfolio_update/`, {
    method: 'POST',
    body: formData,
  }).then(res => res.json());
}

// Blog Update API
export async function blogUpdateAPI({ id, category, title, poster, poster_alt, image, image_alt, description, author, publish_date, read_time, status, seo_title, seo_description, seo_keywords, og_title, og_description, og_image, og_type, og_image_alt }) {
  const formData = new FormData();
  formData.append('id', id);
  formData.append('category', category);
  formData.append('title', title);
  if (poster) formData.append('poster', poster);
  formData.append('poster_alt', poster_alt);
  if (image) formData.append('image', image);
  formData.append('image_alt', image_alt);
  formData.append('description', description);
  formData.append('author', author);
  formData.append('publish_date', publish_date);
  formData.append('read_time', read_time);
  if (status) formData.append('status', status);
  formData.append('seo_title', seo_title);
  formData.append('seo_description', seo_description);
  formData.append('seo_keywords', seo_keywords);
  formData.append('og_title', og_title);
  formData.append('og_description', og_description);
  if (og_image) formData.append('og_image', og_image);
  formData.append('og_type', og_type);
  formData.append('og_image_alt', og_image_alt);

  const res = await fetch(`${BASE_API_URL}blog_update/`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}