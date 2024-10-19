import { connection } from "./connection.js";

const DBfetchAllData = async (table, where = '', value = '', where2 = '', value2 = '', orderby = true) => {

    let queryToBeForm = `SELECT * FROM ${table}`;
    if (where != '' && value != '') {
        queryToBeForm += `  where ${where}  =  ${value}`;
    }
    if (where2 != '' && value2 != '') {
        queryToBeForm += `  and= ${where2}  =  ${value2}`;
    }
    if (orderby == true) {
        queryToBeForm += `  order BY id desc`;
    }
    return await connection.query(queryToBeForm);

}

const DBFetechJoins = async (table,options,tabl2, ontable1, ontable2) => {
    let queryToBEForm = `SELECT ${options} FROM  ${table} JOIN ${tabl2} on ${table}.${ontable1} = ${tabl2}.${ontable2}`;
    return await connection.query(queryToBEForm);

}

export { DBfetchAllData, DBFetechJoins };