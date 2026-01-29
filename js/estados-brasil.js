/**
 * Brazilian States Data
 * List of all Brazilian states (estados) with their UF codes
 */

const ESTADOS_BRASIL = [
    { uf: 'AC', nome: 'Acre' },
    { uf: 'AL', nome: 'Alagoas' },
    { uf: 'AP', nome: 'Amapá' },
    { uf: 'AM', nome: 'Amazonas' },
    { uf: 'BA', nome: 'Bahia' },
    { uf: 'CE', nome: 'Ceará' },
    { uf: 'DF', nome: 'Distrito Federal' },
    { uf: 'ES', nome: 'Espírito Santo' },
    { uf: 'GO', nome: 'Goiás' },
    { uf: 'MA', nome: 'Maranhão' },
    { uf: 'MT', nome: 'Mato Grosso' },
    { uf: 'MS', nome: 'Mato Grosso do Sul' },
    { uf: 'MG', nome: 'Minas Gerais' },
    { uf: 'PA', nome: 'Pará' },
    { uf: 'PB', nome: 'Paraíba' },
    { uf: 'PR', nome: 'Paraná' },
    { uf: 'PE', nome: 'Pernambuco' },
    { uf: 'PI', nome: 'Piauí' },
    { uf: 'RJ', nome: 'Rio de Janeiro' },
    { uf: 'RN', nome: 'Rio Grande do Norte' },
    { uf: 'RS', nome: 'Rio Grande do Sul' },
    { uf: 'RO', nome: 'Rondônia' },
    { uf: 'RR', nome: 'Roraima' },
    { uf: 'SC', nome: 'Santa Catarina' },
    { uf: 'SP', nome: 'São Paulo' },
    { uf: 'SE', nome: 'Sergipe' },
    { uf: 'TO', nome: 'Tocantins' }
];

/**
 * Fetch municipalities for a given state from BrasilAPI
 * @param {string} uf - State UF code (e.g., 'SP', 'RJ')
 * @returns {Promise<Array>} Array of municipality objects
 */
async function getMunicipios(uf) {
    try {
        const response = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch municipalities for ${uf}`);
        }
        const data = await response.json();
        return data.map(m => ({
            codigo: m.codigo_ibge,
            nome: m.nome
        }));
    } catch (error) {
        console.error('Error fetching municipalities:', error);
        return [];
    }
}

/**
 * Fetch holidays for a given year from BrasilAPI
 * @param {number} year - The year to fetch holidays for
 * @returns {Promise<Array>} Array of holiday objects
 */
async function getHolidaysFromAPI(year) {
    try {
        const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch holidays for ${year}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching holidays from API:', error);
        return [];
    }
}
