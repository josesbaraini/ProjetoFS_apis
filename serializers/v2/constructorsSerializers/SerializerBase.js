export class SerializerBase {
    constructor() {
        this.model = this.constructor.model;
        this.fields = this.constructor.fields || Object.keys(this.model.fields);
        this.fieldPreparers = this.constructor.fieldPreparers
    }
    static fieldFormatters = {
        date: value => value ? new Date(value).toISOString().substring(0, 10) : value,
        datetime: value => {
            if (!value) return value;
            const d = new Date(value);
            return d.toISOString().replace('T', ' ').substring(0, 19);
        }
    };

    static fieldPreparers = {
        date: value => {
            if (!value) return value;
            // Aceita 'DD/MM/YYYY' e converte para 'YYYY-MM-DD'
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
                const [d, m, y] = value.split('/');
                return `${y}-${m}-${d}`;
            }
            // Se já estiver no formato ISO, só retorna os 10 primeiros caracteres
            return new Date(value).toISOString().substring(0, 10);
        },
        datetime: value => {
            if (!value) return value;
            // Tenta converter para ISO completo
            return new Date(value).toISOString().replace('T', ' ').substring(0, 19);
        }
        // Adicione outros tipos se quiser
    };

    // Gera a query de SELECT só com os campos desejados
    getSelectQuery() {
        const campos = this.fields.join(', ');
        return `SELECT ${campos} FROM ${this.model.table}`;
    }

    getCreateQuery(data) {
        // Valida e prepara os dados
        const prepared = this.validateAndPrepare(data);

        // Pega só os campos que realmente vieram e têm valor definido
        const fields = Object.keys(prepared).filter(f => prepared[f] !== undefined && prepared[f] !== null);
        const placeholders = fields.map(() => '?').join(', ');
        const values = fields.map(f => prepared[f]);

        const query = `INSERT INTO ${this.model.table} (${fields.join(', ')}) VALUES (${placeholders})`;
        return { query, values };
    }

    // Valida e prepara dados para INSERT
    validateAndPrepare(data) {
        if (!data || typeof data !== 'object') {
            throw new Error('Dados de entrada inválidos ou ausentes');
        }
        const result = {};
        for (const field in this.model.fields) {
            const config = this.model.fields[field];
            let value = data[field];

            // Só lança erro se for required, não tiver valor E não tiver default definido
            if (
                config.required &&
                (value === undefined || value === null) &&
                (config.default === undefined)
            ) {
                throw new Error(`Campo obrigatório: ${field}`);
            }

            // Só adiciona ao objeto se veio valor (não undefined/null)
            if (value !== undefined && value !== null) {
                if (config && this.constructor.fieldPreparers[config.type]) {
                    value = this.constructor.fieldPreparers[config.type](value);
                }
                result[field] = value;
            }
            // Se não veio valor e tem default, NÃO adiciona ao objeto (deixa o banco cuidar)
        }
        return result;
    }


    serialize(data) {
        if (Array.isArray(data)) {
            return data.map(item => this.serialize(item));
        }
        const result = {};
        for (const field of this.fields) {
            const config = this.model.fields[field];
            let value = data[field];
            if (config && this.constructor.fieldFormatters[config.type]) {
                value = this.constructor.fieldFormatters[config.type](value);
            }
            result[field] = value;
        }
        return result;
    }
}