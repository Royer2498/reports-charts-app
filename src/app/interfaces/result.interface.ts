export interface ConcejalResult {
    ok?: string,
    cantidadMesas?: number,
    votosConcejal?: Count[],
    porcentaje?: Percentage
}

export interface AlcaldeResult {
    ok?: string,
    cantidadMesas?: number,
    votosAlcalde?: Count[],
    porcentaje?: Percentage
}

interface Count {
    _id?: boolean,
    c_sumate?: number,
    c_fpv?: number,
    c_pdc?: number,
    c_somos?: number,
    c_mas_ipsp?: number,
    c_ca?: number,
    c_mts?: number,
    c_pan_bol?: number,
    c_ucs?: number,
    c_blancos?: number,
    c_nulos?: number
}

interface Percentage {
    _id?: boolean,
    c_sumate?: any,
    c_fpv?: any,
    c_pdc?: any,
    c_somos?: any,
    c_mas_ipsp?: any,
    c_ca?: any,
    c_mts?: any,
    c_pan_bol?: any,
    c_ucs?: any,
    c_validos?: any,
    c_blancos?: any,
    c_nulos?: any
}