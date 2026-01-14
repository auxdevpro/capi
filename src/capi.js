/**
 * CAPI class for API representation with async/await model
 */
class CAPI {
  #baseURL = '';
  #headers = {};

  constructor(baseURL = '', headers = {}) {
    this.#baseURL = baseURL;
    this.#headers = {
      'Content-Type': 'application/json',
      ...headers
    };
  }

  /**
   * Build full URL with base URL and endpoint
   */
  #buildURL(endpoint) {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://'))
      return endpoint;

    return `${this.#baseURL}${endpoint}`;
  }

  /**
   * Handle fetch response
   */
  async #handleResponse(response) {
    const contentType = response.headers.get('content-type');
    
    let data;
    if (contentType && contentType.includes('application/json'))
      data = await response.json();
    else
      data = await response.text();

    if (!response.ok) {
      const error = new Error(data.message || `HTTP Error: ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  /**
   * Make fetch request with error handling
   */
  async #request(endpoint, options = {}) {
    const url = this.#buildURL(endpoint);
    const config = {
      ...options,
      headers: {
        ...this.#headers,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      return await this.#handleResponse(response);
    } 
    catch (error) {
      if (error.name === 'TypeError' && error.message === 'fetch failed')
        throw new Error(`Network error: Unable to reach ${url}`);

      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return await this.#request(endpoint, {
      method: 'GET',
      ...options
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data = null, options = {}) {
    return await this.#request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
      ...options
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data = null, options = {}) {
    return await this.#request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
      ...options
    });
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data = null, options = {}) {
    return await this.#request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : null,
      ...options
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return await this.#request(endpoint, {
      method: 'DELETE',
      ...options
    });
  }


  //
  // Alias methods mapping (semantic naming)
  //
  // Read Operations:
  //   read()  → get()
  //   fetch() → get()
  //
  // Create Operations:
  //   create() → post()
  //
  // Update Operations:
  //   update() → patch() // partial update
  //   replace() → put()  // complete replacement
  //
  // Delete Operations:
  //   remove() → delete()
  //

  /**
   * Alias for GET - Read a resource
   */
  async read(endpoint, options = {}) {
    return await this.get(endpoint, options);
  }

  /**
   * Alias for GET - Fetch a resource
   */
  async fetch(endpoint, options = {}) {
    return await this.get(endpoint, options);
  }

  /**
   * Alias for POST - Create a new resource
   */
  async create(endpoint, data = null, options = {}) {
    return await this.post(endpoint, data, options);
  }

  /**
   * Alias for PATCH - Update a resource partially
   */
  async update(endpoint, data = null, options = {}) {
    return await this.patch(endpoint, data, options);
  }

  /**
   * Alias for PUT - Replace a resource completely
   */
  async replace(endpoint, data = null, options = {}) {
    return await this.put(endpoint, data, options);
  }

  /**
   * Alias for DELETE - Remove a resource
   */
  async remove(endpoint, options = {}) {
    return await this.delete(endpoint, options);
  }


  // 
  // Authorization: Bearer token / Basic auth
  //

  /**
   * Set authorization token
   */
  setAuthToken(token) {
    this.#headers['Authorization'] = `Bearer ${token}`;
                //'Authorization'  : `Basic ${this.#credB64}`
  }

  /**
   * Remove authorization token
   */
  removeAuthToken() {
    delete this.#headers['Authorization'];
  }

  //
  // Headers manage
  //

  /**
   * Update headers
   */
  setHeader(key, value) {
    this.#headers[key] = value;
  }

  /**
   * Remove a header
   */
  removeHeader(key) {
    delete this.#headers[key];
  }
}

export default CAPI;