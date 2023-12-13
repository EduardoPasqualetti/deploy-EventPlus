export const dateFormatDbToView = date => {
    // 2024-02-04T00:00:00 para 04/02/2024

    date = date.substr(0, 10); // retorna apenas a data
    date = date.split("-"); // separa o dia, mes e ano, retorna um array dependendo do numero de -, [2024, 02, 04]

    
    return `${date[2]}/${date[1]}/${date[0]}`; // 04/02/2024
}
