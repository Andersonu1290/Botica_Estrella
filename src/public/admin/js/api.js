/**
 * =========================================================
 * API REST - Sistema Botica Estrella
 * =========================================================
 * Cliente HTTP centralizado para consumir Spring Boot REST API
 * Compatible con:
 * - JWT Authentication
 * - Multipart/FormData
 * - CRUD completo
 * - Manejo global de errores
 * - Defensive Programming
 * =========================================================
 */

// Si existe una URL de la nube la usa, de lo contrario usa tu ruta local con el proxy
// 🔥 CORRECCIÓN: Si window.VITE_API_URL no existe o es vacío, aseguramos que empiece con /api
const BASE_URL = (window.VITE_API_URL || '/api') + '/v1';



const API = {

    /**
     * =========================================================
     * GENERADOR DE HEADERS
     * =========================================================
     * @param {boolean} isMultipart
     * true => NO agrega Content-Type
     * false => application/json
     */
    getHeaders: (isMultipart = false) => {

        const headers = {};

        // IMPORTANTE:
        // multipart/form-data NO debe forzar Content-Type
        // porque el navegador genera el boundary automáticamente
        if (!isMultipart) {
            headers['Content-Type'] = 'application/json';
        }

        // JWT TOKEN
        const token = sessionStorage.getItem('jwt_token');

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    },

    /**
     * =========================================================
     * MANEJO GLOBAL DE RESPUESTAS
     * =========================================================
     * Centraliza:
     * - 401 Unauthorized
     * - 204 No Content
     * - errores backend
     * - JSON inválido
     */
    handleResponse: async (response) => {

        /**
         * =====================================================
         * 401 - SESIÓN EXPIRADA
         * =====================================================
         */
        if (response.status === 401) {

            sessionStorage.removeItem('usuarioActivo');
            sessionStorage.removeItem('jwt_token');

            // Redirección automática
            window.location.replace('/Login');

            throw new Error(
                'Sesión expirada o credenciales inválidas.'
            );
        }

        /**
         * =====================================================
         * 204 - NO CONTENT
         * =====================================================
         */
        if (response.status === 204) {
            return null;
        }

        /**
         * =====================================================
         * LECTURA SEGURA DE RESPUESTA
         * =====================================================
         */
        const responseText = await response.text();

        let data = {};

        try {

            data = responseText
                ? JSON.parse(responseText)
                : {};

        } catch {

            // Si el backend devuelve texto plano
            data = {
                mensaje: responseText
            };
        }

        /**
         * =====================================================
         * MANEJO DE ERRORES HTTP
         * =====================================================
         */
        if (!response.ok) {

            throw new Error(
                data.error ||
                data.mensaje ||
                `Error HTTP ${response.status}`
            );
        }

        return data;
    },

    /**
     * =========================================================
     * GET
     * =========================================================
     * Obtener datos
     */
    get: async (endpoint) => {

        try {

            const response = await fetch(
                `${BASE_URL}${endpoint}`,
                {
                    method: 'GET',
                    headers: API.getHeaders()
                }
            );

            return await API.handleResponse(response);

        } catch (error) {

            if (error instanceof TypeError) {

                throw new Error(
                    'No se pudo conectar con el servidor.'
                );
            }

            throw error;
        }
    },

    /**
     * =========================================================
     * POST
     * =========================================================
     * Crear registros JSON
     */
    post: async (endpoint, payload) => {

        try {

            const response = await fetch(
                `${BASE_URL}${endpoint}`,
                {
                    method: 'POST',
                    headers: API.getHeaders(),
                    body: JSON.stringify(payload)
                }
            );

            return await API.handleResponse(response);

        } catch (error) {

            if (error instanceof TypeError) {

                throw new Error(
                    'Error de red al enviar información.'
                );
            }

            throw error;
        }
    },

    /**
     * =========================================================
     * POST MULTIPART
     * =========================================================
     * Crear registros con archivos
     */
    postMultipart: async (endpoint, formData) => {

        try {

            const response = await fetch(
                `${BASE_URL}${endpoint}`,
                {
                    method: 'POST',
                    headers: API.getHeaders(true),
                    body: formData
                }
            );

            return await API.handleResponse(response);

        } catch (error) {

            if (error instanceof TypeError) {

                throw new Error(
                    'Error de red al transferir archivos.'
                );
            }

            throw error;
        }
    },

    /**
     * =========================================================
     * PUT
     * =========================================================
     * Actualización completa JSON
     */
    put: async (endpoint, payload) => {

        try {

            const response = await fetch(
                `${BASE_URL}${endpoint}`,
                {
                    method: 'PUT',
                    headers: API.getHeaders(),
                    body: JSON.stringify(payload)
                }
            );

            return await API.handleResponse(response);

        } catch (error) {

            if (error instanceof TypeError) {

                throw new Error(
                    'Error de red al actualizar.'
                );
            }

            throw error;
        }
    },

    /**
     * =========================================================
     * PUT MULTIPART
     * =========================================================
     * Actualizar registros con archivos
     */
    putMultipart: async (endpoint, formData) => {

        try {

            const response = await fetch(
                `${BASE_URL}${endpoint}`,
                {
                    method: 'PUT',
                    headers: API.getHeaders(true),
                    body: formData
                }
            );

            return await API.handleResponse(response);

        } catch (error) {

            if (error instanceof TypeError) {

                throw new Error(
                    'Error de red al actualizar archivos.'
                );
            }

            throw error;
        }
    },

    /**
     * =========================================================
     * PATCH
     * =========================================================
     * Actualización parcial
     */
    patch: async (endpoint, payload) => {

        try {

            const response = await fetch(
                `${BASE_URL}${endpoint}`,
                {
                    method: 'PATCH',
                    headers: API.getHeaders(),
                    body: JSON.stringify(payload)
                }
            );

            return await API.handleResponse(response);

        } catch (error) {

            if (error instanceof TypeError) {

                throw new Error(
                    'Error de red en actualización parcial.'
                );
            }

            throw error;
        }
    },

    /**
     * =========================================================
     * DELETE
     * =========================================================
     * Eliminación de registros
     */
    delete: async (endpoint) => {

        try {

            const response = await fetch(
                `${BASE_URL}${endpoint}`,
                {
                    method: 'DELETE',
                    headers: API.getHeaders()
                }
            );

            return await API.handleResponse(response);

        } catch (error) {

            if (error instanceof TypeError) {

                throw new Error(
                    'Error de red al eliminar registro.'
                );
            }

            throw error;
        }
    }
};

